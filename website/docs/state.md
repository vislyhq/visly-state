---
title: State
sidebar_label: State
---

Not all state is created equal in Visly State. There are four main kinds of state containers: `state`, `syncedState`, `derivedState`, and `combinedState`. They each have slightly different properties and are often used in combination for larger apps.

## State

`state` is the standard state container in Visly State. It holds onto a piece of data and can be accessed from any component in your application, whether in React or Node. Your applications can have any number of these state containers and they can be small or large, whatever you choose will not effect the performance of your app, although it can be good practice to split up application state into multiple state containers to increase the reusability of your components.

The `state` constructor takes a default value and is expected to be constructed as a global variable. When using TypeScript we recommend that you also create a separate type for your state container that can be used for mutations and selectors (more on those later).

```tsx
import { state } from '@visly/state'

interface AppState {
    counter: number
}

export const appState = state<AppState>({ counter: 0 })
```

The above code works whether you run it in React or Node. However, how you read data from state differs slightly depending on where you use it. For reading state from a React component, we provide hooks such as `useValue`, in a Node app you can just call `.get()` on the state container.

```tsx
import { useValue } from '@visly/state'
import { appState } from './state'

// React
function Component() {
    const count = useValue(appState, s => s.counter)
    return <span>{count}</span>
}

// Node
const count = appState.get(s => s.counter)
```

When using `useValue` in a React component, Visly State will ensure your component is re-rendered when the data you subscribe to changes.

## Synced State

`syncedState` is just like `state` except that is also lets Visly State know that this state should be synced to your server and potentially to other clients. Other than requiring a sync key when constructing the state container, it works just like `state`. To enable state syncing you'll have to configure a sync adapter and set up a compatible sync server - more on that later.

```tsx
import { syncedState } from '@visly/state'

interface AppState {
    counter: number
}

export const appState = syncedState<AppState>('appstate', { counter: 0 })
```

## Derived State

`derivedState` is a higher level state container useful for creating state that is computed based on some other state. Derived state is limitated in that it is read-only, otherwise is works just like `state`. You can create a derived state based on any other state together with a selector function, which applies a transform to the data within the underlying state container. Derived state is super useful when you have low level state that you don't want to expose directly to your application's components but would rather expose a simplified view of that state.

```tsx
import { state, derivedState } from '@visly/state'

interface AppState {
    counter: number
}

const appState = state<AppState>({ counter: 0 })

export const simpleState = derivedState(appState, s => {
    return {
        counter: Math.round(counter),
    }
})
```

## Combined State

`combinedState` is another higher level state container. Combined state is useful when you have two different pieces of state that you want to combine into a single state container. This is especially useful when you have application state where you only want a subset of it to be syncronized between clients. Unlike derived state, combined state allows you to perform mutations on it. Visly State will automatically make sure the correct underlying state is updated.

```tsx
import { syncedState } from '@visly/state'

interface RemoteState {
    pages: Page[]
}

interface LocalState {
    selectedPageId: string | null
}

type AppState = {
    remote: RemoteState
    local: LocalState
}

const remoteState = syncedState<RemoteState>('remote', { pages: [] })
const localState = state<LocalState>({ selectedPageId: null })

export const appState = combinedState<AppState>({
    remote: remoteState,
    local: localState,
})
```
