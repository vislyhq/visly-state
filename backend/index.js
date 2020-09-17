import { bgState } from "./state";
import express from "express";
import enableWs from "express-ws";
import { setSyncAdapter, SyncPayloadType } from '@visly/state'

const app = enableWs(express()).app;

setSyncAdapter((applyPatches, setState) => {
  const conections = new Set();
  
  app.ws("/", (ws) => {
    conections.add(ws);

    ws.send(
      JSON.stringify({ type: SyncPayloadType.FullSync, data: bgState.get(), bgState.syncKey })
    )

    ws.on("message", (msg) => {
      for (const connection of conections) {
        if (connection !== ws && connection.readyState === 1) {
          connection.send(msg);
        }
      }

      const { type, key, data } = JSON.parse(msg);

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

  return (key, patches) => {
    conections.forEach((conn) => {
      if (conn.readyState === WebSocket.OPEN) {
        conn.send(
          JSON.stringify({ type: SyncPayloadType.Patches, data: patches, key })
        );
      }
    });
  };
});


app.listen(process.env.PORT, () => console.log('server started'))

