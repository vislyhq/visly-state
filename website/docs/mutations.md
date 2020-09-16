---
title: Mutations
sidebar_label: Mutations
---

Mutations are similar to actions in Redux. They are a way of changing the values in the state and triggering an update to your react components that subscribe to that data.

```tsx
import { state, useMutation } from '@visly/state

const appState = state({ count: 0 })

const mutations = {
    increment: (state) => {
        state.count += 1
    }
}

function Component() {
    const increment = useMutation(appState, mutations.increment)
    return <button onClick={increment}>Increment</button>
}
```

One thing you will notice as different from Redux and similar state management libraries is that our mutations don't return a new object but rather they mutate the state object passed into the mutation function. Visly State is still an immutable library, the state object passed to the mutation by Visly State is a mutable copy of the internal state. Once mutated, Visly State (with the help of immer) will figure out what changes were made and safely apply that to the underlying state in a immutable fashion.

While we reccomend defining mutations as re-usable and testable functions like above, you may also use arrow functions for one-off mutations.

```tsx
import { state, useValue } from '@visly/state

const appState = state({ arrayOne: [], arrayTwo: [] })

function Component() {
    const increment = useMutation(appState, s => s.count++)
    return <button onClick={increment}>Increment</button>
}
```

Of course these mutations can also be used from Node, or any other non-react environment.

```tsx
import { state } from '@visly/state

const appState = state({ count: 0 })

const mutations = {
    increment: (state) => {
        state.count += 1
    }
}

appState.set(mutations.increment)
```

## Passing arguments to mutations

Mutations will sometimes need additional information to perform their mutation. For example if you are updating the string of a stored variable you would need to pass the new string as an argument.

```tsx
import { state, useMutation } from '@visly/state

const appState = state({ count: 0 })

const mutations = {
    updateCount: (state, count) => {
        state.count += 1
    }
}

function Component() {
    const updateCount = useMutation(appState, mutations.updateCount)
    return <button onClick={() => updateCount(10)}>Make it 10</button>
}
```

As you can see above we have changed our mutation to take a second parameter which is the argument we want to pass to the mutation. Mutations can take however any arguments you wish, as long as they are all listed after the first state parameter.
