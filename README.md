# [Visly State](https://state.visly.app) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/vislyhq/visly-state/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/@visly/state.svg?style=flat)](https://www.npmjs.com/package/@visly/state) [![Tests](https://github.com/vislyhq/visly-state/workflows/Test/badge.svg)](https://github.com/vislyhq/visly-state/actions?query=workflow%3ATest) 

React state for real-time apps.

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

This example shows how we can store global application state, read & display it in our UI, and finally how to update the state. The component will automatically re-render when the count changes as it is subscribed to it by calling `useValue`.

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

For more detailed usage [see the documentation](https://state.visly.app/docs).
