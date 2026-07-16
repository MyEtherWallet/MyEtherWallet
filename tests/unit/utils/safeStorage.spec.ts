import { describe, it, expect } from 'vitest'
import { createSafeStorage, safeLocalStorage } from '@/utils/safeStorage'

describe('createSafeStorage', () => {
  it('falls back to in-memory storage when localStorage is null (Android WebView)', () => {
    const storage = createSafeStorage(() => null)
    expect(() => storage.setItem('k', 'v')).not.toThrow()
    expect(storage.getItem('k')).toBe('v')
    storage.removeItem('k')
    expect(storage.getItem('k')).toBeNull()
  })

  it('falls back to in-memory storage when localStorage is undefined', () => {
    const storage = createSafeStorage(() => undefined)
    expect(() => storage.getItem('missing')).not.toThrow()
    expect(storage.getItem('missing')).toBeNull()
  })

  it('falls back to in-memory storage when accessing localStorage throws SecurityError (sandboxed iframe)', () => {
    const storage = createSafeStorage(() => {
      throw new DOMException('The operation is insecure.', 'SecurityError')
    })
    expect(() => storage.setItem('k', 'v')).not.toThrow()
    expect(storage.getItem('k')).toBe('v')
  })

  it('falls back to in-memory storage when a storage method throws on probe (privacy mode)', () => {
    const throwing = {
      getItem: () => {
        throw new DOMException('denied', 'SecurityError')
      },
      setItem: () => {
        throw new DOMException('denied', 'SecurityError')
      },
      removeItem: () => {
        throw new DOMException('denied', 'SecurityError')
      },
    } as unknown as Storage
    const storage = createSafeStorage(() => throwing)
    expect(() => storage.setItem('k', 'v')).not.toThrow()
    // served transparently from the in-memory fallback
    expect(storage.getItem('k')).toBe('v')
  })

  it('writes through to the native storage when it is available', () => {
    const backing = new Map<string, string>()
    const native = {
      getItem: (k: string) => (backing.has(k) ? backing.get(k)! : null),
      setItem: (k: string, v: string) => {
        backing.set(k, v)
      },
      removeItem: (k: string) => {
        backing.delete(k)
      },
    } as unknown as Storage
    const storage = createSafeStorage(() => native)
    storage.setItem('k', 'v')
    expect(backing.get('k')).toBe('v')
    expect(storage.getItem('k')).toBe('v')
    storage.removeItem('k')
    expect(backing.has('k')).toBe(false)
  })

  it('degrades gracefully when a native method throws after construction', () => {
    let fail = false
    const native = {
      getItem: () => null,
      setItem: () => {
        if (fail) throw new DOMException('quota', 'QuotaExceededError')
      },
      removeItem: () => {},
    } as unknown as Storage
    const storage = createSafeStorage(() => native)
    fail = true
    expect(() => storage.setItem('k', 'v')).not.toThrow()
  })
})

describe('safeLocalStorage singleton', () => {
  it('exposes a working StorageLike-compatible instance under jsdom', () => {
    expect(() => safeLocalStorage.setItem('__probe__', '1')).not.toThrow()
    expect(safeLocalStorage.getItem('__probe__')).toBe('1')
    safeLocalStorage.removeItem('__probe__')
    expect(safeLocalStorage.getItem('__probe__')).toBeNull()
  })
})
