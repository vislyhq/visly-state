---
title: Selectors
sidebar_label: Selectors
---

Selectors are what make using Visly State performant and efficient. They ensure your component only subscribes to data that is required to render the component. Therefore, it will only update if that data changes. Apart from selecting a subset of the application state, a selector may also perform data transformations. Visly State automatically makes this efficient in regards to re-renders.

```tsx
import { state, useValue } from '@visly/state

const appState = state({ arrayOne: [], arrayTwo: [] })

const selectors = {
    arrayOne: (state) => {
        return state.arrayOne
    }
}

function Component() {
    const arrayOne = useValue(appState, selectors.arrayOne)
    return <Values values={arrayOne} />
}
```

While we reccomend defining selectors as reusable and testable functions like above, you may also use arrow functions for one-off selectors.

```tsx
import { state, useValue } from '@visly/state

const appState = state({ arrayOne: [], arrayTwo: [] })

function Component() {
    const arrayOne = useValue(appState, s => s.arrayOne)
    return <Values values={arrayOne} />
}
```

Also, as mentioned above, selectors don't have to return a strict subset of the data in the underlying state container. They may also perform computations on the state and return a derived value of some kind.

```tsx
import { state, useValue } from '@visly/state

const appState = state({ arrayOne: [], arrayTwo: [] })

const selectors = {
    arrayOneCount: (state) => {
        return state.arrayOne.length
    }
}

function Component() {
    const arrayOneCount = useValue(appState, selectors.arrayOneCount)
    return <span>{arrayOneCount}</span>
}
```

Like the rest of Visly State, selectors can also be used outside of React. For example, in tests or in a Node backend. In this case, selectors can be passed to the `.get()` method on the state container.


```tsx
import { state } from '@visly/state

const appState = state({ arrayOne: [], arrayTwo: [] })

const selectors = {
    arrayOneCount: (state) => {
        return state.arrayOne.length
    }
}

const arrayOneCount = appState.get(selectors.arrayOneCount)
console.log(arrayOneCount)
```

## Passing arguments to selectors

Selectors will sometimes need additional information to select the correct data, for example, if you wanted to make a selector that returned an item with some specific ID. Visly State doesn't have any special support for this, however we can use higher order functions to achieve this result.

```tsx
import { state, useValue } from '@visly/state

const appState = state({ items: [] })

const selectors = {
    itemWithId: (id) => (state) => {
        return state.items.find(i => i.id === id)
    }
}

function Component(props) {
    const item = useValue(appState, selectors.itemWithId(props.id))
    return <span>{item.title}</span>
}
```

As you can see above, we've changed our selector to be a function that takes an ID and then returns a state selector. This way, we can pass any arguments we want to the selector.
