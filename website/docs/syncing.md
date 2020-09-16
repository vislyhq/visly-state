---
title: Syncing state
sidebar_label: Syncing state
---

A core part of Visly State is allowing you to efficiently synchronize data between your frontend, backend, and even multiple frontend clients. Because this requires integration with your custom backend, it needs some additional setup. For this walkthrough, we'll assume you have a React frontend and a Node + Express backend and want to synchronize state changes to all connected clients using websockets. However, Visly State does not have any limitations when it comes to backend framework or transport protocol.

## In your React app

The first thing you'll need to do is set up a synced state in your React app and configure a sync adapter. We'll use the built-in support for a websocket-based sync adapter, however you can write your own sync adapter using a different protocol or even sync via services such as Pusher.

We'll create a file named `state.js` that contains our synced state. This file will later also be imported into our backend.

```tsx
import { syncedState } from '@visly/state'

export const appState = syncedState('appstate', { items: [] })
```

We'll also add the following configuration code at the root of our application - `index.js` if using create-react-app.

```tsx
import { setSyncAdapter, WSSSyncAdapter } from '@visly/state'

setSyncAdapter(WSSSyncAdapter('wss://api.example.com'))
```

This is all you'll have to do on the client side to get things working. Mutations will automatically sync to your backend and changes coming in from other clients will automatically be applied to your state and update your components. For your own applications, you'll want to update the websocket endpoint used and most likely point it at localhost for development.

## On your backend

For this, we're going to assume you are building a Node server using Express. You'll need to install the following Node libraries if you haven't already: `express`, `express-ws`. This example sets up a sync adapter for the server that listens to websocket connections from the client and applies them to the correct state object on the server and then broadcasts that message out to all connected clients. In a real world application you would want to look at the sender of the data and only transmit the updates to connections that should have access to the data being transmitted.

```tsx
import '../shared/state'
import express from "express";
import enableWs from "express-ws";
import { setSyncAdapter, SyncPayload, SyncPayloadType } from '@visly/state'

const app = enableWs(express()).app;

setSyncAdapter((applyPatches, setState) => {
  const conections = new Set<WebSocket>();
  
  app.ws("/", (ws) => {
    conections.add(ws);

    ws.on("message", (msg) => {
      for (const connection of conections) {
        if (connection !== ws && connection.readyState === WebSocket.OPEN) {
          connection.send(msg);
        }
      }

      const { type, key, data } = JSON.parse(msg as string) as SyncPayload<any>;

      switch (type) {
        case SyncPayloadType.Patches:
          applyPatches(key, data);
          break;
        case SyncPayloadType.FullSync:
          setState(key, data);
          break;
      }
    });

    ws.on("close", () => {
      conections.delete(ws);
    });
  });

  return (key: string, patches: Patch[]) => {
    conections.forEach((conn) => {
      if (conn.readyState === WebSocket.OPEN) {
        conn.send(
          JSON.stringify({ type: SyncPayloadType.Patches, data: patches, key })
        );
      }
    });
  };
});
```