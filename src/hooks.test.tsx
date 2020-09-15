/**
 * Copyright (c) Visly, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import { state, derivedState, combinedState } from './core'
import { useValue, useMutation } from './hooks'
import { render, act } from '@testing-library/react'

test('useValue(state)', () => {
    const s = state({ x: 1 })

    function Component() {
        const val = useValue(s)
        return <div>{val.x}</div>
    }

    const { container } = render(<Component />)
    expect(container.innerHTML).toEqual('<div>1</div>')
})

test('useValue(state, selector)', () => {
    const s = state({ x: 1 })

    function Component() {
        const val = useValue(s, s => s.x * 100)
        return <div>{val}</div>
    }

    const { container } = render(<Component />)
    expect(container.innerHTML).toEqual('<div>100</div>')
})

test('useValue should not re-render', () => {
    const s = state({ x: { x: 1, y: 1 } })

    let numRenders = 0

    function Component() {
        numRenders++
        const val = useValue(s, s => s.x.y)
        return <div>{val}</div>
    }

    render(<Component />)

    act(() => {
        s.set(s => {
            s.x.x += 1
        })
    })

    expect(numRenders).toEqual(1)
})

test('useValue(derivedState, selector)', () => {
    const s = state({ x: 1 })
    const s2 = derivedState(s, s => s.x * 100)

    function Component() {
        const val = useValue(s2)
        return <div>{val}</div>
    }

    const { container } = render(<Component />)
    expect(container.innerHTML).toEqual('<div>100</div>')
})

test('useValue(derivedState, selector)', () => {
    const s = state({ x: 1 })
    const s2 = derivedState(s, s => s.x * 100)

    function Component() {
        const val = useValue(s2, s => s + 2)
        return <div>{val}</div>
    }

    const { container } = render(<Component />)
    expect(container.innerHTML).toEqual('<div>102</div>')
})

test('useValue(combinedState, selector)', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })

    const s = combinedState({ x, y })

    function Component() {
        const val = useValue(s, s => s.y.y * 2)
        return <div>{val}</div>
    }

    const { container } = render(<Component />)
    expect(container.innerHTML).toEqual('<div>4</div>')
})

test('combinedState should re-render', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })

    const s = combinedState({ x, y })

    let numRenders = 0

    function Component() {
        numRenders++
        const val = useValue(s, s => s.x.x)
        return <div>{val}</div>
    }

    render(<Component />)

    act(() => {
        x.set(s => {
            s.x += 1
        })
    })

    expect(numRenders).toEqual(2)
})

test('combinedState should not re-render', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })

    const s = combinedState({ x, y })

    let numRenders = 0

    function Component() {
        numRenders++
        const val = useValue(s, s => s.x.x)
        return <div>{val}</div>
    }

    render(<Component />)

    act(() => {
        y.set(s => {
            s.y += 1
        })
    })

    expect(numRenders).toEqual(1)
})

test('useMutation()', () => {
    const s = state({ x: 1 })

    function Component() {
        const val = useValue(s)

        const mutate = useMutation(s, s => {
            s.x += 2
        })

        return <div onClick={mutate}>{val.x}</div>
    }

    const element = <Component />

    const { container } = render(element)
    expect(container.innerHTML).toEqual('<div>1</div>')
    ;(container.childNodes[0] as HTMLElement).click()
    expect(container.innerHTML).toEqual('<div>3</div>')
})

test('useMutation(combinedState)', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })
    const s = combinedState({ x, y })

    function Component() {
        const val = useValue(s)

        const mutate = useMutation(s, s => {
            s.x.x += 2
            s.y.y += 2
        })

        return (
            <div onClick={mutate}>
                {val.x.x}-{val.y.y}
            </div>
        )
    }

    const element = <Component />

    const { container } = render(element)
    expect(container.innerHTML).toEqual('<div>1-2</div>')
    ;(container.childNodes[0] as HTMLElement).click()
    expect(container.innerHTML).toEqual('<div>3-4</div>')
})

test('useMutation(combinedState) update order', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })
    const s = combinedState({ x, y })

    const renders: string[] = []

    function Parent() {
        renders.push('parent')
        const val = useValue(s, s => s.x.x)
        return <Child val={val} />
    }

    function Child(props: { val: number }) {
        renders.push('child')
        const val = useValue(s, s => s.y.y)

        const mutate = useMutation(s, s => {
            s.x.x += 2
            s.y.y += 2
        })

        return (
            <div onClick={mutate}>
                {props.val}-{val}
            </div>
        )
    }

    const element = <Parent />

    const { container } = render(element)
    expect(renders).toStrictEqual(['parent', 'child'])
    expect(container.innerHTML).toEqual('<div>1-2</div>')
    ;(container.childNodes[0] as HTMLElement).click()
    expect(renders).toStrictEqual(['parent', 'child', 'parent', 'child'])
    expect(container.innerHTML).toEqual('<div>3-4</div>')
})

test('useMutation() is memoized without producer as deps', () => {
    const foo = state({ foo: 1 })

    // Producer is created in each render
    let mutations = [] as any[]
    function NonMemoizedProducer() {
        mutations.push(useMutation(foo, () => {}))
        return <div />
    }
    render(<NonMemoizedProducer />).rerender(<NonMemoizedProducer />)
    expect(mutations[0] === mutations[1]).toBeFalsy()

    // Producer is created in each render and memoized deps are provided
    mutations = []
    const dep = 1
    function NonMemoizedProducerWithDeps() {
        mutations.push(useMutation(foo, () => {}, [dep]))
        return <div />
    }
    render(<NonMemoizedProducerWithDeps />).rerender(
        <NonMemoizedProducerWithDeps />
    )
    expect(mutations[0] === mutations[1]).toBeTruthy()

    // Producer is memoized
    mutations = []
    const memoizedProducer = () => {}
    function MemoizedProducerComponent() {
        mutations.push(useMutation(foo, memoizedProducer))
        return <div />
    }
    render(<MemoizedProducerComponent />).rerender(
        <MemoizedProducerComponent />
    )
    expect(mutations[0] === mutations[1]).toBeTruthy()
})

test('undo transaction', () => {
    const x = state({ x: 1 })
    const y = state({ y: 2 })
    const s = combinedState({ x, y })

    function Component() {
        const val = useValue(s)

        const mutate1 = useMutation(s, s => {
            s.x.x += 1
        })

        const mutate2 = useMutation(s, s => {
            s.x.x += 2
        })

        const onClick = () => {
            s.transaction(() => {
                mutate1()
                mutate2()
            })

            x.undo()
        }

        return <div onClick={onClick}>{val.x.x}</div>
    }

    const { container } = render(<Component />)
    expect(container.innerHTML).toEqual('<div>1</div>')
    ;(container.childNodes[0] as HTMLElement).click()
    expect(container.innerHTML).toEqual('<div>1</div>')
})
