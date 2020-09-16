---
title: Transactions & history 
sidebar_label: Transactions & history 
---

Visly State has support for both transactions and history. Transactions allow you to group multiple mutations into a single mutation to ensure components aren't re-rendered before all mutations are run, and history enables you to add undo / redo capabilities to your app with a single line of code. Transactions work together with the history api to ensure all mutations within a transaction are undone / redone as a single operation.

## Transactions

Transactions quickly become necesarry in larger applications where you have your mutation logic split across many mutation functions but want to ensure components only re-render a single time independent of how many mutations you combine. Just wrap app mutations calls in a `transaction`.

```tsx
import { useMutation, transaction } from '@visly/state`
import { appState, mutations } from './state`

function Component() {
    const mutation1 = useMutation(appState, mutations.one)
    const mutation2 = useMutation(appState, mutations.two)
    const mutation3 = useMutation(appState, mutations.three)

    const onClick = () => {
        transaction(appState, () => {
            mutation1()
            mutation2()
            mutation3()
        })
    }

    return <button onClick={onClick}>Perform transaction</button>
}
```

When using transactions outside of React, for example in a Node.js application, you can instead call the `.transaction()` method on the state container. Make sure you don't use this from React as it won't ensure component re-renders don't trigger multiple times.

```tsx
import { appState, mutations } from './state`

appState.transaction(() => {
    appState.set(mutations.one)
    appState.set(mutations.two)
    appState.set(mutations.three)
})
```

## History

The history api allows you to implement undo & redo functionality in your application with a single line of code. Just import the `undo` and `redo` function in your react app and call them based on some user interaction such as a button click. This will undo / redo the latest mutation or transaction in an effecient way. Just like mutations, this will only re-render the components which were effected by the changes to the history. Visly State stores historical state in a compact and efficient way making it possible to have a near infinite history stack.

```tsx
import { undo, redo } from '@visly/state`
import { appState } from './state`

function Component() {
    return (
        <div>
            <button onClick={() => undo(appState)}>Undo</button>
            <button onClick={() => redo(appState)}>Redo</button>
        </div>
    )
}
```

Much like with transactions, in a Node environment you will want to call the `.undo()` and `.redo()` method on the state object instead. Which these functions work in a react environment as well, they won't ensure the most eficient component re-renders.

```tsx
import { appState } from './state`

appState.undo()
appState.redo()
```
