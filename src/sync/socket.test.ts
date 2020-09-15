/**
 * Copyright (c) Visly, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { WSSyncAdapter } from './socket'
import WebSocketServer from 'jest-websocket-mock'
import { Patch } from 'immer'
import { State } from '../core'
import { SyncPayloadType } from '.'

test('onPatch', async () => {
    const server = new WebSocketServer('wss://visly.app')
    const syncAdapter = WSSyncAdapter('wss://visly.app')

    let receivedKey: string | undefined
    let receivedPatches: Patch[] | undefined

    const onPatch = (key: string, patches: Patch[]) => {
        receivedKey = key
        receivedPatches = patches
    }

    syncAdapter(onPatch, () => {}, {} as Map<string, State<unknown>>)

    await server.connected

    server.send(
        JSON.stringify({
            type: SyncPayloadType.Patches,
            key: 'test',
            data: [{ op: 'replace', path: ['x'], value: 2 }],
        })
    )

    expect(receivedKey).toStrictEqual('test')
    expect(receivedPatches).toStrictEqual([
        { op: 'replace', path: ['x'], value: 2 },
    ])

    server.close()
})

test('onFullSync', async () => {
    const server = new WebSocketServer('wss://visly.app')
    const syncAdapter = WSSyncAdapter('wss://visly.app')

    let receivedKey: string | undefined
    let receivedData: any | undefined

    const onFullSync = (key: string, data: any) => {
        receivedKey = key
        receivedData = data
    }

    syncAdapter(() => {}, onFullSync, {} as Map<string, State<unknown>>)

    await server.connected

    server.send(
        JSON.stringify({
            type: SyncPayloadType.FullSync,
            key: 'test',
            data: { x: 2 },
        })
    )

    expect(receivedKey).toStrictEqual('test')
    expect(receivedData).toStrictEqual({ x: 2 })

    server.close()
})

test('sendPatches', async () => {
    const server = new WebSocketServer('wss://visly.app')
    const syncAdapter = WSSyncAdapter('wss://visly.app')

    const sendPatches = syncAdapter(
        () => {},
        () => {},
        {} as Map<string, State<unknown>>
    )

    await server.connected

    sendPatches('test', [{ op: 'replace', path: ['x'], value: 2 }])

    await server.nextMessage

    expect(server.messages.length).toStrictEqual(1)
    const message = JSON.parse(server.messages[0] as string)

    expect(message.type).toStrictEqual(SyncPayloadType.Patches)
    expect(message.key).toStrictEqual('test')
    expect(message.data).toStrictEqual([
        { op: 'replace', path: ['x'], value: 2 },
    ])

    server.close()
})
