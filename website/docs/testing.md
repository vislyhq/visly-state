---
title: Testing
sidebar_label: Testing
---

Because Visly State for the most part just deals with plain old JavaScript functions, they are really easy to test with any testing library out there. We'll be using Jest for these examples though.

```tsx
import { appState, selectors, mutations } from './state'

test('mySelector works as expected', () => {
    const data = appState.get(selectors.mySelector)
    expect(data).toEqual(2)
})

test('myMutation works as expected', () => {
    appState.set(mutations.myMutation)
    expect(appState.get()).toEqual({ count: 1 })
})
```

While this works well for small examples like this, it is often necessary to set up a more complex state before testing selectors and mutations. The simplest way to do this is by calling `.set()` on your store before you run your test and then then reset your application state before each test is run.

```tsx
import { appState, selectors, mutations } from './state'

beforeEach(() => {
  appState.resetForTesting();
});

test('mySelector works as expected', () => {
    const data = appState.get(selectors.mySelector)
    expect(data).toEqual(2)
})

test('myMutation works as expected', () => {
    appState.set(mutations.myMutation)
    expect(appState.get()).toEqual({ count: 1 })
})
```

Another way to test mutations specifically is to use the `partialMutation` helper function. This enables you to call your mutation with a partial state instead of needing to set up your whole application state. This can be useful when your application state is very complex.

```tsx
import { partialMutation, mutations } from './state'

test('myMutation works as expected', () => {
    const increment = partialMutation(mutations.increment)
    const newState = increment({count: 1})
    expect(newState).toEqual({ count: 2 })
})
```