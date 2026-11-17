import type { Storage } from '@privy-io/js-sdk-core'

/**
 * Privy storage adapter backed by `sessionStorage`, so a login belongs to one
 * tab: it survives the Google redirect and a reload, and is never shared with
 * another tab. Mirrors the SDK's own `LocalStorage` adapter (JSON values,
 * `undefined` for a missing key).
 */
export const tabStorage: Storage = {
  get: key => {
    const raw = sessionStorage.getItem(key)
    return raw === null ? undefined : JSON.parse(raw)
  },
  put: (key, value) =>
    value === undefined
      ? sessionStorage.removeItem(key)
      : sessionStorage.setItem(key, JSON.stringify(value)),
  del: key => sessionStorage.removeItem(key),
  getKeys: () => Object.keys(sessionStorage),
}

/** Every key the Privy SDK writes through the adapter starts with this. */
const STORAGE_PREFIX = 'privy:'

/**
 * Whether Privy has stored anything in this tab. Lets the app decide whether
 * a login could be there without loading the SDK to find out.
 */
export const tabHoldsPrivyData = (): boolean => {
  try {
    return Object.keys(sessionStorage).some(key =>
      key.startsWith(STORAGE_PREFIX),
    )
  } catch {
    // Storage is blocked: nothing can be held.
    return false
  }
}
