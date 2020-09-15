/**
 * Copyright (c) Visly, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Patch } from 'immer'
import { SyncAdapter } from '../core'
import { SyncPayloadType, SyncPayload } from '.'
import ReconnectingWebSocket from 'reconnecting-websocket'

class SyncSocket<Data> {
    private onPatch: (key: string, d: Patch[]) => void
    private onFullSync: (key: string, d: Data) => void
    private ws: ReconnectingWebSocket

    constructor(
        endpoint: string,
        onPatch: (key: string, d: Patch[]) => void,
        onFullSync: (key: string, d: Data) => void,
        onError: (e: Error) => void = console.error
    ) {
        this.ws = new ReconnectingWebSocket(endpoint, undefined, {
            maxReconnectionDelay: 100,
        })
        this.onPatch = onPatch
        this.onFullSync = onFullSync

        this.ws.onmessage = message => {
            const payload: SyncPayload<Data> = JSON.parse(message.data)

            switch (payload.type) {
                case SyncPayloadType.Patches:
                    this.onPatch(payload.key, payload.data)
                    break
                case SyncPayloadType.FullSync:
                    this.onFullSync(payload.key, payload.data)
                    break
            }
        }

        this.ws.onclose = () => {
            if (process.env.NODE_ENV === 'debug') {
                console.warn('visly-state socket closed')
            }
        }

        this.ws.onerror = e => {
            onError(e.error)
        }
    }

    sendPatches(key: string, data: Patch[]) {
        this.ws.send(
            JSON.stringify({ type: SyncPayloadType.Patches, data, key })
        )
    }
}

export function WSSyncAdapter(endpoint: string): SyncAdapter {
    return (applyPatches, setState) => {
        const socket = new SyncSocket(endpoint, applyPatches, setState)
        return socket.sendPatches.bind(socket)
    }
}
