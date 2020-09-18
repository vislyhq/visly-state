import path from 'path'
import express from 'express'
import enableWs from 'express-ws'
import WebSocket from 'ws'
import { setSyncAdapter, SyncPayload, SyncPayloadType } from '@visly/state'
import { Patch } from 'immer'
import { gameState } from './src/state'

const app = enableWs(express()).app

setSyncAdapter((applyPatches, setState) => {
    const connections = new Set<WebSocket>()

    app.ws('/', (ws) => {
        connections.add(ws)

        ws.send(
            JSON.stringify({
                type: SyncPayloadType.FullSync,
                data: gameState.get(),
                key: gameState.syncKey,
            }),
        )

        ws.on('message', (msg) => {
            for (const connection of connections) {
                if (connection !== ws && connection.readyState === WebSocket.OPEN) {
                    connection.send(msg)
                }
            }

            const { type, key, data } = JSON.parse(msg as string) as SyncPayload<any>

            switch (type) {
                case SyncPayloadType.Patches:
                    applyPatches(key, data)
                    break
                case SyncPayloadType.FullSync:
                    setState(key, data)
                    break
            }
        })

        ws.on('close', () => {
            connections.delete(ws)
        })
    })

    return (key: string, patches: Patch[]) => {
        connections.forEach((conn) => {
            if (conn.readyState === WebSocket.OPEN) {
                conn.send(
                    JSON.stringify({ type: SyncPayloadType.Patches, data: patches, key }),
                )
            }
        })
    }
})

app.use(express.static(path.join(__dirname, 'build')))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(process.env.PORT || 8080)