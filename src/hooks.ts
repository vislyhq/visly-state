/**
 * Copyright (c) Visly, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    State,
    StateSelector,
    AnyState,
    CombinedState,
    StateObject,
    identity,
} from '.'
import {
    useCallback,
    useRef,
    useLayoutEffect,
    useEffect,
    useReducer,
} from 'react'
import { unstable_batchedUpdates as batchUpdates } from 'react-dom'
import deepEqual from 'fast-deep-equal'

// For server-side rendering
const useIsoLayoutEffect =
    typeof window === 'undefined' ? useEffect : useLayoutEffect

export function useVislyState<T>(state: State<T> | CombinedState<T>) {
    return [useValue(state), useMutation(state as any)]
}

export function useValue<T>(state: AnyState<T>): T
export function useValue<T, U>(
    state: AnyState<T>,
    selector: StateSelector<T, U>
): U

export function useValue<T extends StateObject, U>(
    state: AnyState<T>,
    selector: StateSelector<T, U> = identity as typeof selector
) {
    const forceUpdate = useReducer(c => c + 1, 0)[1]
    const subscriberRef = useRef<Subscriber<T, U>>()

    if (!subscriberRef.current) {
        subscriberRef.current = new Subscriber(state, forceUpdate, selector)
        subscriberRef.current.subscribe()
    }

    const subscriber = subscriberRef.current
    let newValue: U | undefined
    let hasNewValue = false

    if (subscriber.selector !== selector || subscriber.errored) {
        newValue = selector(state.get())
        hasNewValue = !deepEqual(subscriber.currentValue, newValue)
    }

    useIsoLayoutEffect(() => {
        if (hasNewValue) {
            subscriber.currentValue = newValue
        }
        subscriber.selector = selector
        subscriber.errored = false
    })

    useIsoLayoutEffect(() => subscriber.unsubscribe, [])

    return hasNewValue ? newValue : subscriber.currentValue
}

function defaultProducer<T>(t: T, produce: (t: T) => void) {
    produce(t)
}

export function useMutation<
    T,
    R,
    Args extends ReadonlyArray<unknown> = [(t: T) => void]
>(
    state: State<T>,
    producer?: (t: T, ...args: Args) => R,
    deps?: Array<any>
): (...args: Args) => R

export function useMutation<
    T extends StateObject,
    R,
    Args extends ReadonlyArray<unknown> = [(t: T) => void]
>(
    state: CombinedState<T>,
    producer?: (t: T, ...args: Args) => R,
    deps?: Array<any>
): (...args: Args) => R

export function useMutation(
    state: State<any> | CombinedState<any>,
    producer: (t: any, ...args: any) => void = defaultProducer,
    deps?: Array<any>
) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const f = useCallback(producer, deps ?? [producer])
    return useCallback(
        (...args: any) => {
            let result
            batchUpdates(() => {
                result = state.set(s => f(s, ...args))
            })
            return result
        },
        [state, f]
    )
}

export function transaction(
    state: State<any> | CombinedState<any>,
    perform: () => void
) {
    batchUpdates(() => state.transaction(perform))
}

export function undo(state: State<any> | CombinedState<any>) {
    batchUpdates(() => state.undo())
}

export function redo(state: State<any> | CombinedState<any>) {
    batchUpdates(() => state.redo())
}

type StateListener<T> = (state: T | null, error?: Error) => void

class Subscriber<T extends StateObject, R> {
    state: AnyState<T>
    currentValue: R | null | undefined
    errored: boolean
    listener: StateListener<R>
    selector: StateSelector<T, R>
    unsubscribe: () => void

    constructor(
        state: AnyState<T>,
        listener: StateListener<R>,
        selector: StateSelector<T, R>
    ) {
        this.state = state
        this.currentValue = selector(state.get())
        this.errored = false
        this.listener = listener
        this.selector = selector
        this.unsubscribe = () => {}
    }

    subscribe() {
        const listener = () => {
            try {
                const newStateSlice = this.selector(this.state.get())
                if (!deepEqual(this.currentValue, newStateSlice)) {
                    this.listener((this.currentValue = newStateSlice))
                }
            } catch (error) {
                this.errored = true
                this.listener(null, error)
            }
        }

        this.unsubscribe = this.state.subscribe(listener)
    }
}
