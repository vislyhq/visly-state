/**
 * Copyright (c) Visly, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Utility function for creating a mutation function taking a partial store
// from a mutation function taking a full store. Most mutations operate on a subset
// of the store and this therefor makes mocking the store much easier.
export function partialMutation<T, Args extends ReadonlyArray<unknown>>(
    mut: (t: T, ...args: Args) => void
) {
    return (t: Partial<T>, ...args: Args) => {
        mut(t as T, ...args)
    }
}
