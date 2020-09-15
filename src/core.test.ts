/**
 * Copyright (c) Visly, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    state,
    derivedState,
    syncedState,
    setSyncAdapter,
    combinedState,
} from './core'
import { Patch } from 'immer'

test('state.get()', () => {
    const s = state({ x: 1 })
    expect(s.get()).toStrictEqual({ x: 1 })
})

test('state.get(selector)', () => {
    const s = state({ x: 1 })
    expect(s.get(s => s.x)).toStrictEqual(1)
})

test('state.set()', () => {
    const s = state({ x: 1 })
    s.set(s => {
        s.x += 1
    })
    expect(s.get()).toStrictEqual({ x: 2 })
})

test('state.set(partial)', () => {
    const s = state({ x: 1, y: 2 })
    s.set({ x: 5 })
    expect(s.get()).toStrictEqual({ x: 5, y: 2 })
})

test('state.undo()', () => {
    const s = state({ x: 1 })

    s.set(s => {
        s.x += 1
    })

    s.set(s => {
        s.x += 1
    })

    s.undo()
    expect(s.get()).toStrictEqual({ x: 2 })

    s.set(s => {
        s.x += 1
    })

    expect(s.get()).toStrictEqual({ x: 3 })
    s.undo()
    expect(s.get()).toStrictEqual({ x: 2 })
    s.undo()
    expect(s.get()).toStrictEqual({ x: 1 })
    s.undo()
    expect(s.get()).toStrictEqual({ x: 1 })
})

test('state.redo()', () => {
    const s = state({ x: 1 })

    s.set(s => {
        s.x += 1
    })

    s.set(s => {
        s.x += 1
    })

    s.set(s => {
        s.x += 1
    })

    expect(s.get()).toStrictEqual({ x: 4 })
    s.undo()
    expect(s.get()).toStrictEqual({ x: 3 })
    s.undo()
    expect(s.get()).toStrictEqual({ x: 2 })
    s.redo()
    expect(s.get()).toStrictEqual({ x: 3 })
    s.redo()
    expect(s.get()).toStrictEqual({ x: 4 })
})

test('state.transaction()', () => {
    const s = state({ x: 1 })

    s.transaction(() => {
        s.set(s => {
            s.x += 1
        })

        s.set(s => {
            s.x += 1
        })
    })

    s.set(s => {
        s.x += 1
    })

    expect(s.get()).toStrictEqual({ x: 4 })
    s.undo()
    expect(s.get()).toStrictEqual({ x: 3 })
    s.undo()
    expect(s.get()).toStrictEqual({ x: 1 })
    s.redo()
    expect(s.get()).toStrictEqual({ x: 3 })
})

test('derivedState.get()', () => {
    const s = derivedState(state({ x: 1 }), s => s.x)
    expect(s.get()).toStrictEqual(1)
})

test('derivedState.get(selector)', () => {
    const s = derivedState(state({ x: 1 }), s => s.x)
    expect(s.get(s => s * 100)).toStrictEqual(100)
})

test('doubleDerivedState.get()', () => {
    const s = state({ x: 1 })
    const s2 = derivedState(s, s => s.x)
    const s3 = derivedState(s2, s => s * 100)
    expect(s3.get()).toStrictEqual(100)
})

test('syncedState.set()', () => {
    const s = syncedState('test', { x: 1 })
    let key: string | undefined
    let patches: Patch[] | undefined

    setSyncAdapter(() => {
        return (k, p) => {
            key = k
            patches = p
        }
    })

    s.set(s => {
        s.x = 2
    })

    expect(s.get()).toStrictEqual({ x: 2 })
    expect(key).toBe('test')
    expect(patches).toStrictEqual([{ op: 'replace', path: ['x'], value: 2 }])
})

test('syncedState.applyPatches()', () => {
    const s = syncedState('test', { x: 1 })
    setSyncAdapter(applyPatches => {
        applyPatches('test', [{ op: 'replace', path: ['x'], value: 2 }])
        return () => {}
    })
    expect(s.get()).toStrictEqual({ x: 2 })
})

test('syncedState.setState()', () => {
    const s = syncedState('test', { x: 1 })
    setSyncAdapter((applyPatches, setState) => {
        setState('test', { x: 2, y: 3 })
        return () => {}
    })
    expect(s.get()).toStrictEqual({ x: 2, y: 3 })
})

test('syncedState.undo()', () => {
    const s = syncedState('test', { x: 1 })
    const changes: Array<{ key: string; patches: Patch[] }> = []

    setSyncAdapter(() => {
        return (key, patches) => {
            changes.push({ key, patches })
        }
    })

    s.set(s => {
        s.x = 2
    })

    s.undo()

    expect(s.get()).toStrictEqual({ x: 1 })
    expect(changes.length).toStrictEqual(2)

    expect(changes[0].key).toStrictEqual('test')
    expect(changes[0].patches).toStrictEqual([
        { op: 'replace', path: ['x'], value: 2 },
    ])

    expect(changes[1].key).toStrictEqual('test')
    expect(changes[1].patches).toStrictEqual([
        { op: 'replace', path: ['x'], value: 1 },
    ])
})

test('combinedState.get()', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })

    const xy = combinedState({ x, y })

    expect(xy.get()).toStrictEqual({ x: { x: 1 }, y: { y: 2 } })
})

test('combinedState.get(selector)', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })

    const xy = combinedState({ x, y })

    expect(xy.get(s => s.x.x)).toStrictEqual(1)
})

test('combinedState.undo().redo()', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })

    const xy = combinedState({ x, y })
    xy.set(({ x, y }) => {
        x.x = 10
        y.y = 20
    })

    expect(x.get()).toStrictEqual({ x: 10 })
    expect(y.get()).toStrictEqual({ y: 20 })

    xy.undo()

    expect(x.get()).toStrictEqual({ x: 1 })
    expect(y.get()).toStrictEqual({ y: 2 })

    xy.redo()

    expect(x.get()).toStrictEqual({ x: 10 })
    expect(y.get()).toStrictEqual({ y: 20 })
})

test('combinedState({synced, unsynced}).set()', () => {
    const x = syncedState('test', { x: 1 })
    const y = state({ y: 2 })

    const xy = combinedState({ x, y })

    const changes: Array<{ key: string; patches: Patch[] }> = []

    setSyncAdapter(() => {
        return (key, patches) => {
            changes.push({ key, patches })
        }
    })

    xy.set(({ x, y }) => {
        x.x = 10
        y.y = 20
    })

    expect(changes.length).toStrictEqual(1)
    expect(changes[0].key).toStrictEqual('test')
    expect(changes[0].patches).toStrictEqual([
        { op: 'replace', path: ['x'], value: 10 },
    ])
})

test('combinedState.transaction()', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })

    const xy = combinedState({ x, y })

    xy.transaction(() => {
        xy.set(({ x }) => {
            x.x += 1
        })

        xy.set(({ x }) => {
            x.x += 1
        })

        xy.set(({ y }) => {
            y.y += 1
        })
    })

    xy.set(({ y }) => {
        y.y += 1
    })

    expect(x.get()).toStrictEqual({ x: 3 })
    expect(y.get()).toStrictEqual({ y: 4 })

    xy.undo()

    expect(x.get()).toStrictEqual({ x: 3 })
    expect(y.get()).toStrictEqual({ y: 3 })

    xy.undo()

    expect(x.get()).toStrictEqual({ x: 1 })
    expect(y.get()).toStrictEqual({ y: 2 })

    xy.redo()

    expect(x.get()).toStrictEqual({ x: 3 })
    expect(y.get()).toStrictEqual({ y: 3 })
})

test('move objects between combined states', () => {
    const x = state({ value: { x: 1 } })
    const y = state({ values: [{ x: 0 }] })
    const xy = combinedState({ x, y })

    xy.set(({ x, y }) => {
        y.values.push(x.value)
    })

    expect(x.get()).toStrictEqual({ value: { x: 1 } })
    expect(y.get()).toStrictEqual({ values: [{ x: 0 }, { x: 1 }] })
})

test('combined.set()', () => {
    const s = combinedState({ a: state({ x: 1 }) })
    s.set(s => {
        s.a.x += 1
    })
    expect(s.get()).toStrictEqual({ a: { x: 2 } })
})

test('combined.set(partial)', () => {
    const s = combinedState({ a: state({ x: 1 }), b: state({ y: 2 }) })
    s.set({ a: { x: 5 } })
    expect(s.get()).toStrictEqual({ a: { x: 5 }, b: { y: 2 } })
})

test('derivedState(combinedState).get()', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })

    const xy = combinedState({ x, y })
    const xy2 = derivedState(xy, s => ({
        x: s.x.x * 100,
        y: s.y.y * 100,
    }))

    expect(xy2.get()).toStrictEqual({ x: 100, y: 200 })
})

test('derivedState(combinedState).get(selector)', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })

    const xy = combinedState({ x, y })
    const xy2 = derivedState(xy, s => ({
        x: s.x.x * 100,
        y: s.y.y * 100,
    }))

    expect(xy2.get(s => s.x)).toStrictEqual(100)
})

test('transaction throws error', () => {
    const x = state({ x: 1 })

    try {
        x.transaction(() => {
            x.set(s => {
                s.x += 1
            })

            x.set(s => {
                s.x += 1
            })

            x.set(() => {
                throw new Error()
            })
        })
    } catch {
        // empty
    }

    expect(x.get()).toStrictEqual({ x: 1 })
})

test('combined transaction throws error', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })
    const xy = combinedState({ x, y })

    try {
        xy.transaction(() => {
            xy.set(s => {
                s.x.x += 1
            })

            xy.set(s => {
                s.y.y += 1
            })

            xy.set(() => {
                throw new Error()
            })
        })
    } catch {
        // empty
    }

    expect(x.get()).toStrictEqual({ x: 1 })
    expect(y.get()).toStrictEqual({ y: 2 })
})

test('syncedState.transaction()', () => {
    const x = syncedState('test', { x: 1, y: 1 })
    const changes: Array<Patch[]> = []

    setSyncAdapter(() => {
        return (key, patches) => {
            changes.push(patches)
        }
    })

    x.transaction(() => {
        x.set(s => {
            s.x += 1
        })

        x.set(s => {
            s.y += 2
        })
    })

    expect(x.get()).toStrictEqual({ x: 2, y: 3 })

    expect(changes.length).toStrictEqual(1)
    expect(changes[0]).toStrictEqual([
        { op: 'replace', path: ['x'], value: 2 },
        { op: 'replace', path: ['y'], value: 3 },
    ])
})

test('syncedState.transaction() throws', () => {
    const x = syncedState('test', { x: 1, y: 1 })
    const changes: Array<Patch[]> = []

    setSyncAdapter(() => {
        return (key, patches) => {
            changes.push(patches)
        }
    })

    try {
        x.transaction(() => {
            x.set(s => {
                s.x += 1
            })

            x.set(s => {
                s.y += 2
            })

            x.set(() => {
                throw new Error()
            })
        })
    } catch {
        // empty
    }

    expect(changes.length).toStrictEqual(0)
})

test('subscription notified at end of transaction', () => {
    const s = state({ x: 1 })
    const notifications = []

    s.subscribe(v => {
        notifications.push(v)
    })

    s.transaction(() => {
        s.set(s => {
            s.x += 1
        })

        s.set(s => {
            s.x += 1
        })
    })

    s.set(s => {
        s.x += 1
    })

    expect(notifications.length).toStrictEqual(2)
})

test('nested transaction', () => {
    const s = state({ x: 1 })
    const notifications = []

    s.subscribe(v => {
        notifications.push(v)
    })

    s.transaction(() => {
        s.set(s => {
            s.x += 1
        })

        s.set(s => {
            s.x += 1
        })

        s.transaction(() => {
            s.set(s => {
                s.x += 1
            })

            s.set(s => {
                s.x += 1
            })
        })
    })

    expect(s.get()).toStrictEqual({ x: 5 })
    expect(notifications.length).toStrictEqual(1)

    s.undo()

    expect(s.get()).toStrictEqual({ x: 1 })
    expect(notifications.length).toStrictEqual(2)
})

test('nested transaction throws', () => {
    const s = state({ x: 1 })

    s.transaction(() => {
        s.set(s => {
            s.x += 1
        })

        s.set(s => {
            s.x += 1
        })

        try {
            s.transaction(() => {
                s.set(s => {
                    s.x += 1
                })

                s.set(s => {
                    s.x += 1
                })

                s.set(() => {
                    throw new Error()
                })
            })
        } catch {
            // empty
        }
    })

    expect(s.get()).toStrictEqual({ x: 3 })
    s.undo()
    expect(s.get()).toStrictEqual({ x: 1 })
})

test('undo within transaction', () => {
    const s = state({ x: 1 })

    s.transaction(() => {
        s.set(s => {
            s.x += 1
        })

        s.set(s => {
            s.x += 1
        })

        s.undo()
    })

    expect(s.get()).toStrictEqual({ x: 2 })
    s.undo()
    expect(s.get()).toStrictEqual({ x: 1 })
})

test('subscriptions on combined statex', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })
    const xy = combinedState({ x, y })

    const xnotifications = []
    const ynotifications = []
    const xynotifications = []

    x.subscribe(v => {
        xnotifications.push(v)
    })

    y.subscribe(v => {
        ynotifications.push(v)
    })

    xy.subscribe(v => {
        xynotifications.push(v)
    })

    xy.set(v => {
        v.x.x += 1
    })

    xy.set(v => {
        v.y.y += 1
    })

    expect(xnotifications.length).toStrictEqual(1)
    expect(ynotifications.length).toStrictEqual(1)
    expect(xynotifications.length).toStrictEqual(2)
})

test('subscriptions on combined state when undo', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })
    const xy = combinedState({ x, y })

    const xnotifications = []
    const ynotifications = []
    const xynotifications = []

    xy.set(v => {
        v.x.x += 1
    })

    xy.set(v => {
        v.y.y += 1
    })

    x.subscribe(v => {
        xnotifications.push(v)
    })

    y.subscribe(v => {
        ynotifications.push(v)
    })

    xy.subscribe(v => {
        xynotifications.push(v)
    })

    xy.undo()
    xy.undo()

    expect(xnotifications.length).toStrictEqual(1)
    expect(ynotifications.length).toStrictEqual(1)
    expect(xynotifications.length).toStrictEqual(2)
})

test('subscriptions on combined state when underlying state changes', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })
    const xy = combinedState({ x, y })

    const xnotifications = []
    const ynotifications = []
    const xynotifications = []

    x.subscribe(v => {
        xnotifications.push(v)
    })

    y.subscribe(v => {
        ynotifications.push(v)
    })

    xy.subscribe(v => {
        xynotifications.push(v)
    })

    x.set(v => {
        v.x = 1
    })

    y.set(v => {
        v.y = 1
    })

    expect(xnotifications.length).toStrictEqual(1)
    expect(ynotifications.length).toStrictEqual(1)
    expect(xynotifications.length).toStrictEqual(2)
})

test('No history should be added if no change is made', () => {
    const s = state({ x: 1 })

    s.set(() => {})
    s.set(() => {})

    s.set(s => {
        s.x += 1
    })

    s.set(() => {})
    s.set(() => {})

    s.undo()
    s.undo()
    expect(s.get()).toStrictEqual({ x: 1 })

    s.redo()
    expect(s.get()).toStrictEqual({ x: 2 })
})

test('push empty state should not clear redo stack', () => {
    const s = state({ x: 1 })

    s.set(s => {
        s.x += 1
    })

    s.undo()
    s.set(() => {})
    s.redo()

    expect(s.get()).toStrictEqual({ x: 2 })
})

test('state.clearHistory()', () => {
    const s = state({ x: 1 })

    s.set(s => {
        s.x += 1
    })

    s.clearHistory()

    s.undo()
    expect(s.get()).toStrictEqual({ x: 2 })
})

test('combinedState.clearHistory()', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })
    const xy = combinedState({ x, y })

    xy.set(s => {
        s.x.x += 1
    })

    xy.clearHistory()

    xy.undo()
    expect(xy.get().x).toStrictEqual({ x: 2 })
})

test('state.set() return value', () => {
    const x = state({ x: 1 })

    const result = x.set(s => {
        s.x += 1
        return 'hello'
    })

    expect(result).toStrictEqual('hello')
})

test('state.set() return value from store', () => {
    const x = state({ x: { y: 1 } })

    const result = x.set(s => {
        s.x.y += 1
        return s.x
    })

    expect(result).toStrictEqual({ y: 2 })
})

test('combinedState.set() return value', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })
    const xy = combinedState({ x, y })

    const result = xy.set(s => {
        s.x.x += 1
        return 'hello'
    })

    expect(result).toStrictEqual('hello')
})

test('Undo transaction after having undone previous transaction', () => {
    const x = state({ x: 1 })

    function update(s: { x: number }) {
        s.x++
    }

    x.transaction(() => {
        x.set(update)
    })

    x.transaction(() => {
        x.set(update)
    })

    x.undo()

    x.transaction(() => {
        x.set(update)
        x.set(update)
        x.set(update)
    })

    x.undo()

    expect(x.get().x).toStrictEqual(2)
})
