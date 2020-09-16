---
title: Getting started
sidebar_label: Getting started
slug: /
---

## Installation

Visly State works with React & Node.js, whether you use JavaScript or TypeScript.

Install it using npm:

```sh
npm install @visly/state
```

or yarn:

```sh
yarn add @visly/state
```

## Creating your first state

In the following sections we'll cover in depth how to use Visly State. For now we'll just create a simple state container with a counter which we can read and update from a React component.

```jsx
import { state, useValue, useMutation } from '@visly/state'

const appState = state({ count: 0 })

function Component() {
    const count = useValue(appState, s => s.count)
    const increment = useMutation(appState, s => s.count++)

    return (
        <div>
            <span>{count}</span>
            <button onClick={increment}>increment</button>
        </div>
    )
}
```

This example shows how we can store global application state, read & display it in our UI, and finally how to update the state. The component will automatically re-render when the count changes as it is subscribed to it by calling `useValue`.
