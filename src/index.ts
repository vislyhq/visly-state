/**
 * Copyright (c) Visly, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    produce,
    enablePatches,
    produceWithPatches,
    Patch,
    applyPatches,
    current,
    isDraft,
} from 'immer'

enablePatches()

export declare type StateObject = Record<string | number | symbol, any>
export declare type StateSelector<T extends StateObject, U> = (state: T) => U

const syncedStates = new Map<string, State<any>>()

class Stack<T> {
    private items: Array<T> = []

    push(t: T) {
        this.items.push(t)
    }

    pop(): T | undefined {
        return this.items.pop()
    }

    peek(): T {
        return this.items[this.items.length - 1]
    }
}

interface Change {
    apply: Patch[]
    revert: Patch[]
}

interface History {
    changelist: Array<Change>
    position: number
}

function createHistory(): History {
    return {
        changelist: [],
        position: 0,
    }
}

function pushHistory(history: History, change: Change): History {
    return produce(history, history => {
        if (change.apply.length === 0) {
            history.changelist.splice(history.position, 0, change)
            history.position++
        } else {
            history.changelist = history.changelist.splice(0, history.position)
            history.changelist.push(change)
            history.position++
        }
    })
}

function undoHistory(
    history: History,
    apply: (changes: Patch[]) => void
): History {
    return produce(history, history => {
        if (history.position === 0) {
            return
        }

        const change = history.changelist[history.position - 1]
        apply(change.revert)
        history.position--
    })
}

function redoHistory(
    history: History,
    apply: (changes: Patch[]) => void
): History {
    return produce(history, history => {
        if (history.position === history.changelist.length) {
            return
        }

        const change = history.changelist[history.position]
        apply(change.apply)
        history.position++
    })
}

function compressHistory(prev: History, curr: History): History {
    let start = 0
    for (let i = 0; i < curr.position; i++) {
        start = i
        if (prev.changelist[i] !== curr.changelist[i]) {
            break
        }
    }

    // prev is not a prefix of curr (curr has gone backwards in history)
    // we are unable to compress the history in this case
    if (start < prev.position) {
        return curr
    }

    const change = curr.changelist.slice(start, curr.position).reduce(
        (acc, curr) => ({
            apply: [...acc.apply, ...curr.apply],
            revert: [...curr.revert, ...acc.revert],
        }),
        { apply: [], revert: [] }
    )

    return {
        changelist: [...curr.changelist.slice(0, start), change],
        position: start + 1,
    }
}

function difference<T>(a: T, b: T): Patch[] {
    const [, patches] = produceWithPatches(a, a => Object.assign(a, b))
    return patches
}

export class State<T> {
    readonly syncKey?: string
    private _initial: T
    private _value: T
    private _history: History
    private _subscriptions = new Set<(v: T) => void>()
    private _transactions = new Stack<{ value: T; history: History }>()

    constructor(initial: T, syncKey?: string) {
        this._initial = produce(initial, () => {})
        this._value = this._initial
        this.syncKey = syncKey
        this._history = createHistory()

        if (syncKey) {
            syncedStates.set(syncKey, this)
        }
    }

    resetForTesting() {
        if (this._transactions.peek()) {
            throw new Error('Cannot reset during a transaction')
        }

        this._value = this._initial
        this.clearHistory()
    }

    get(): T
    get<R>(selector: StateSelector<T, R>): R
    get<R = T>(selector?: StateSelector<T, R>): R {
        if (selector) {
            return selector(this._value)
        } else {
            return this._value as any
        }
    }

    set<R>(producer: (t: T) => R): R
    set(update: Partial<T>): void
    set<R>(producer: ((t: T) => R) | Partial<T>) {
        let updater: (t: T) => R | undefined
        if (typeof producer === 'function') {
            updater = producer
        } else {
            updater = (t: T) => {
                Object.assign(t, producer)
                return undefined
            }
        }

        let returnValue: R | undefined

        const [value, patches, reversePatches] = produceWithPatches<T, T>(
            this._value,
            (t: T) => {
                const v = updater(t)
                returnValue = isDraft(v) ? current(v) : v
            }
        )

        this._value = value

        this._history = pushHistory(this._history, {
            apply: patches,
            revert: reversePatches,
        })

        if (!this._transactions.peek()) {
            this.syncPatches(patches)
            this.notifyChanges()
        }

        return returnValue
    }

    setNoHistory(producer: (t: T) => void) {
        this._value = produce(this._value, producer)

        if (!this._transactions.peek()) {
            this.notifyChanges()
        }
    }

    // This internal function will only do a single undo, even if that undo results
    // in no changes.
    _undoSingle(): Patch[] | null {
        let changes: Patch[] | null = null

        this._history = undoHistory(this._history, patches => {
            changes = current(patches)
            this._value = applyPatches(this._value, patches)

            if (!this._transactions.peek() && patches.length > 0) {
                this.syncPatches(current(patches))
                this.notifyChanges()
            }
        })

        return changes
    }

    // This internal function will only do a single redo, even if that redo results
    // in no changes.
    _redoSingle(): Patch[] | null {
        let changes: Patch[] | null = null

        this._history = redoHistory(this._history, patches => {
            changes = current(patches)
            this._value = applyPatches(this._value, patches)

            if (!this._transactions.peek() && patches.length > 0) {
                this.syncPatches(current(patches))
                this.notifyChanges()
            }
        })

        return changes
    }

    undo() {
        while (true) {
            const result = this._undoSingle()
            if (result === null || result.length > 0) {
                break
            }
        }
    }

    redo() {
        while (true) {
            const result = this._redoSingle()
            if (result === null || result.length > 0) {
                break
            }
        }
    }

    _beginTransaction() {
        this._transactions.push({ value: this._value, history: this._history })
    }

    _abortTransaction() {
        const transaction = this._transactions.pop()
        if (!transaction) {
            throw new Error('No transaction in progress')
        }

        this._value = transaction.value
        this._history = transaction.history
    }

    _commitTransaction() {
        const transaction = this._transactions.pop()
        if (!transaction) {
            throw new Error('No transaction in progress')
        }

        this._history = compressHistory(transaction.history, this._history)

        if (!this._transactions.peek()) {
            const patches = difference(transaction.value, this._value)
            if (patches.length > 0) {
                this.syncPatches(patches)
                this.notifyChanges()
            }
        }
    }

    transaction(perform: () => void) {
        this._beginTransaction()
        try {
            perform()
            this._commitTransaction()
        } catch (e) {
            this._abortTransaction()
            throw e
        }
    }

    subscribe(subscriber: (v: T) => void) {
        this._subscriptions.add(subscriber)
        return () => {
            this._subscriptions.delete(subscriber)
        }
    }

    clearHistory() {
        this._history = createHistory()
    }

    _applyPatchesWithHistory(patches: Patch[], reversePatches: Patch[]) {
        this._value = applyPatches(this._value, patches)

        this._history = pushHistory(this._history, {
            apply: patches,
            revert: reversePatches,
        })

        if (!this._transactions.peek()) {
            this.syncPatches(patches)
            this.notifyChanges()
        }
    }

    _applyPatches(patches: Patch[]) {
        this._value = applyPatches(this._value, patches)

        if (!this._transactions.peek()) {
            this.notifyChanges()
        }
    }

    _setState(s: T) {
        this._value = produce(s, () => {})
        this.clearHistory()

        if (!this._transactions.peek()) {
            this.notifyChanges()
        }
    }

    private notifyChanges() {
        if (this._transactions.peek()) {
            throw new Error('Cannot notify changes during a transaction')
        }

        this._subscriptions.forEach(s => s(this.get()))
    }

    private syncPatches(patches: Patch[]) {
        if (this._transactions.peek()) {
            throw new Error('Cannot sync patches during a transaction')
        }

        if (broadcastPatches && this.syncKey) {
            broadcastPatches(this.syncKey, patches)
        }
    }
}

export class DerivedState<T, U> {
    readonly _selector: StateSelector<T, U>
    readonly _state: AnyState<T>

    constructor(state: AnyState<T>, selector: StateSelector<T, U>) {
        this._selector = selector
        this._state = state
    }

    resetForTesting() {
        this._state.resetForTesting()
    }

    get(): U
    get<R>(selector: StateSelector<U, R>): R
    get<R = U>(selector?: StateSelector<U, R>): R {
        const value = this._selector(this._state.get())
        if (selector) {
            return selector(value)
        } else {
            return value as any
        }
    }

    subscribe(subscriber: (v: U) => void): () => void {
        return this._state.subscribe((v: T) => {
            subscriber(this._selector(v))
        })
    }

    undo() {
        this._state.undo()
    }

    redo() {
        this._state.redo()
    }

    transaction(perform: () => void) {
        this._state.transaction(perform)
    }

    clearHistory() {
        this._state.clearHistory()
    }
}

type PatchApplicator = (key: string, patches: Patch[]) => void

export type SyncAdapter = (
    applyPatches: (key: string, t: Patch[]) => void,
    setState: (key: string, t: unknown) => void,
    syncedStates: Map<string, State<unknown>>
) => PatchApplicator

let broadcastPatches: PatchApplicator | undefined
export function setSyncAdapter(adapter: SyncAdapter | null) {
    broadcastPatches = adapter?.(
        (key: string, patches: Patch[]) => {
            syncedStates.get(key)?._applyPatches(patches)
        },
        (key: string, t: unknown) => {
            syncedStates.get(key)?._setState(t)
        },
        syncedStates
    )
}

export class CombinedState<T extends StateObject> {
    readonly _states: { [K in keyof T]: State<T[K]> }
    readonly _api: { getState: () => T }

    constructor(states: { [K in keyof T]: State<T[K]> }) {
        this._states = states
        this._api = {
            getState: () => {
                return this.get()
            },
        }
    }

    resetForTesting() {
        Object.values(this._states).forEach(s => s.resetForTesting())
    }

    get(): T
    get<R>(selector: StateSelector<T, R>): R
    get<R = T>(selector?: StateSelector<T, R>): R {
        const value = Object.entries(this._states).reduce(
            (acc, [key, store]) => {
                acc[key as any] = store.get()
                return acc
            },
            {} as T
        )

        const sel = selector ?? identity
        return sel(value as any)
    }

    set<R>(producer: (t: T) => R): R
    set(update: Partial<T>): void
    set<R>(producer: ((t: T) => R) | Partial<T>) {
        let updater: (t: T) => R | undefined

        if (producer instanceof Function) {
            updater = producer
        } else {
            updater = (t: T) => {
                for (const key in producer) {
                    t[key as any] = producer[key]
                }

                return undefined
            }
        }

        let returnValue: R | undefined

        const state = this.get()
        const [, patches, reversePatches] = produceWithPatches(
            state,
            (t: T) => {
                const v = updater(t)
                returnValue = isDraft(v) ? current(v) : v
            }
        )

        this.transaction(() => {
            for (const [key, store] of Object.entries(this._states)) {
                const filter = (patches: Patch[]) => {
                    return patches
                        .filter(patch => patch.path[0] === key)
                        .map(patch => ({ ...patch, path: patch.path.slice(1) }))
                }

                store._applyPatchesWithHistory(
                    filter(patches),
                    filter(reversePatches)
                )
            }
        })

        return returnValue
    }

    setNoHistory(producer: (t: { [K in keyof T]: T[K] }) => void) {
        const state = this.get()
        const [, patches] = produceWithPatches(state, producer)

        this.transaction(() => {
            for (const [key, store] of Object.entries(this._states)) {
                const filter = (patches: Patch[]) => {
                    return patches
                        .filter(patch => patch.path[0] === key)
                        .map(patch => ({ ...patch, path: patch.path.slice(1) }))
                }

                store._applyPatches(filter(patches))
            }
        })
    }

    undo() {
        this.transaction(() => {
            while (true) {
                const done = Object.values(this._states)
                    .map(s => s._undoSingle())
                    .reduce((acc, curr) => {
                        return acc || curr === null || curr.length > 0
                    }, false)

                if (done) {
                    break
                }
            }
        })
    }

    redo() {
        this.transaction(() => {
            while (true) {
                const done = Object.values(this._states)
                    .map(s => s._redoSingle())
                    .reduce((acc, curr) => {
                        return acc || curr === null || curr.length > 0
                    }, false)

                if (done) {
                    break
                }
            }
        })
    }

    transaction(perform: () => void) {
        Object.values(this._states).forEach(s => s._beginTransaction())
        try {
            perform()
            Object.values(this._states).forEach(s => s._commitTransaction())
        } catch (e) {
            Object.values(this._states).forEach(s => s._abortTransaction())
            throw e
        }
    }

    subscribe(subscriber: (v: T) => void) {
        const unsubs = Object.values(this._states).map(s => {
            return s.subscribe(() => subscriber(this.get()))
        })

        return () => {
            unsubs.forEach(s => s())
        }
    }

    clearHistory() {
        Object.values(this._states).forEach(s => s.clearHistory())
    }
}

export function identity<T>(t: T) {
    return t
}

export type AnyState<T> = State<T> | DerivedState<any, T> | CombinedState<T>

export function combinedState<T extends Record<string, unknown>>(
    states: { [K in keyof T]: State<T[K]> }
) {
    return new CombinedState(states)
}

export function derivedState<T, U>(
    state: AnyState<T>,
    selector: StateSelector<T, U>
): DerivedState<T, U> {
    return new DerivedState(state, selector)
}

export function syncedState<T>(syncKey: string, initial: T) {
    return new State(initial, syncKey)
}

export function state<T>(initial: T) {
    return new State(initial)
}
