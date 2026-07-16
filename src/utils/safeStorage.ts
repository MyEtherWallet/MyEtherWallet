/**
 * Safe localStorage helper.
 *
 * Some environments crash the app at bootstrap when `localStorage` is touched:
 *  - Android WebView can expose `localStorage` as `null` -> `TypeError` when
 *    calling `.getItem()` (Sentry APP-MEW-WEB-199).
 *  - Sandboxed iframes / strict privacy modes throw a `SecurityError`
 *    DOMException the moment `window.localStorage` is accessed or used
 *    (Sentry APP-MEW-WEB-19E).
 *
 * This module feature-detects a usable Storage and, when none is available,
 * transparently swaps in an in-memory fallback so callers never throw. The
 * returned object is structurally compatible with @vueuse's `StorageLike`, so
 * it can be passed straight to `useStorage(key, defaults, safeLocalStorage)`.
 */

export interface SafeStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

/**
 * A process-local Storage stand-in used when the real one is unavailable.
 * State lives only for the current page session, which matches the graceful
 * degradation we want in restricted environments.
 */
const createMemoryStorage = (): SafeStorage => {
  const map = new Map<string, string>()
  return {
    getItem: (key) => (map.has(key) ? (map.get(key) as string) : null),
    setItem: (key, value) => {
      map.set(key, String(value))
    },
    removeItem: (key) => {
      map.delete(key)
    },
  }
}

/**
 * Resolves the platform Storage, returning `null` when it is absent or when
 * accessing/using it throws. Uses a write/remove probe because some
 * environments expose the object but throw on the first real operation.
 */
const resolveNativeStorage = (
  getStorage: () => Storage | null | undefined,
): Storage | null => {
  try {
    const storage = getStorage()
    if (!storage) {
      return null
    }
    const probeKey = '__mew_safe_storage_probe__'
    storage.setItem(probeKey, '1')
    storage.removeItem(probeKey)
    return storage
  } catch {
    return null
  }
}

/**
 * Builds a SafeStorage backed by `getStorage()` when it is usable, otherwise by
 * an in-memory map. Even when the native storage passes the initial probe, each
 * operation is guarded so a later failure (e.g. quota exceeded, privacy toggled
 * mid-session) degrades to the in-memory fallback instead of throwing.
 */
export const createSafeStorage = (
  getStorage: () => Storage | null | undefined,
): SafeStorage => {
  const native = resolveNativeStorage(getStorage)
  if (!native) {
    return createMemoryStorage()
  }

  const fallback = createMemoryStorage()
  return {
    getItem: (key) => {
      try {
        return native.getItem(key)
      } catch {
        return fallback.getItem(key)
      }
    },
    setItem: (key, value) => {
      try {
        native.setItem(key, value)
      } catch {
        fallback.setItem(key, value)
      }
    },
    removeItem: (key) => {
      try {
        native.removeItem(key)
      } catch {
        fallback.removeItem(key)
      }
    },
  }
}

/**
 * Shared safe wrapper around `window.localStorage`. Import and use this instead
 * of touching `localStorage` directly at bootstrap, and pass it as the storage
 * argument to @vueuse's `useStorage`.
 */
export const safeLocalStorage: SafeStorage = createSafeStorage(() =>
  typeof window !== 'undefined' ? window.localStorage : undefined,
)
