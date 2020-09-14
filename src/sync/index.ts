/**
 * Copyright (c) Visly, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Patch } from 'immer'

export enum SyncPayloadType {
    Patches = 'patches',
    FullSync = 'fullsync',
}

export type SyncPayload<Data> =
    | { key: string; type: SyncPayloadType.Patches; data: Patch[] }
    | { key: string; type: SyncPayloadType.FullSync; data: Data }
