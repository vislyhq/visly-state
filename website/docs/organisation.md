---
title: Organising code
sidebar_label: Organising code
---

Visly State doesn't care how you organize your state, selectors, and mutations. However we have discovered some patterns while building Visly which may be helpful to you as you adopt Visly State in your own applications.

## Combinding local and remote state

Typically you want to have both local and remote state which depends on one another. For example your data models will be remote state synced to the server but you'll also have local state such as what item is currently selected by the use which you don't want to sync to the server but hich at the same time is dependant on what items exist in the data model. For this we rely on `combinedState` to combine the remote and local stores and write mutations and selectors which operate on this combined store.

```tsx
import { syncedState } from '@visly/state'

interface RemoteState {
    items: Item[]
}

interface LocalState {
    selectedItemId: string | null
}

type AppState = {
    remote: RemoteState
    local: LocalState
}

const remoteState = syncedState<RemoteState>('remote', { items: [] })
const localState = state<LocalState>({ selectedItemId: null })

export const appState = combinedState<AppState>({
    remote: remoteState,
    local: localState,
})

export const mutations = {
    addItem: (state: AppState, item: Item) => {
        state.remote.items.push(item)
        state.local.selectedItemId = item.id
    }
}

export const selectors = {
    selectedItem: (state: AppState) => {
        return state.remote.items.find(item => {
            return item.id === state.local.selectedItemId
        })
    }
}
```

## Namespacing selectors and mutations

As you may have noticed throughout the examples we tend to place mutations and selectors within exported objects called `mutations` and `selectors`. We typically export these object from the module which defines the state. This makes it very obvious to the other developers which operations exist on the state.

```tsx
import { state } from '@visly/state'

export const appState = state({ ... })
export const mutations = { ... }
export const selectors = { ... }
```

## Using smaller states for independant features

We typically have one large state which holds all the main data models for the application but then we also have many smaller stores for independant features. For example in Visly we have the ability to pan around and zoom in on the main editor canvas, we store this state in a `zoomStore` as it is independant from data in any other stores.

## Seperating shared code

We recommend creating a module with no React / browser dependencies which holds the state, selectors, and mutations which operate on data which is shared between Both React and Node environments. This way code is easily shared between client and server. If we wish to add any React-specific functionaility such as custom hooks wrapping state operations we place these outside of the main shared module. This makes state easy to re-use and test. 
