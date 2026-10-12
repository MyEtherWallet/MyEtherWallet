import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  CHUNK_LOAD_ERROR_MESSAGES,
  isChunkLoadError,
  installStaleChunkReload,
  reloadOnceForStaleChunk,
  resetStaleChunkReloadForTests,
} from '@/router/chunkError'

describe('isChunkLoadError', () => {
  it('is true for the Safari/WebKit dynamic-import failure (APP-MEW-WEB-A5)', () => {
    expect(
      isChunkLoadError(new TypeError('Importing a module script failed.')),
    ).toBe(true)
  })

  it('is true for the stale-HTML MIME-type failure (APP-MEW-WEB-B8)', () => {
    expect(
      isChunkLoadError(
        new TypeError("'text/html' is not a valid JavaScript MIME type."),
      ),
    ).toBe(true)
  })

  it('is true for the CSS preload failure (APP-MEW-WEB-1K6)', () => {
    expect(
      isChunkLoadError(
        new Error(
          'Unable to preload CSS for /assets/useFetchWatchlist-abc123.css',
        ),
      ),
    ).toBe(true)
  })

  it('is true for the Chromium and Firefox dynamic-import wordings', () => {
    expect(
      isChunkLoadError(
        new TypeError(
          'Failed to fetch dynamically imported module: https://app.myetherwallet.com/assets/token-info-home-abc.js',
        ),
      ),
    ).toBe(true)
    expect(
      isChunkLoadError(new Error('error loading dynamically imported module')),
    ).toBe(true)
  })

  it('handles non-Error payloads (bare string rejection)', () => {
    expect(isChunkLoadError('Importing a module script failed.')).toBe(true)
    expect(isChunkLoadError('some unrelated string')).toBe(false)
  })

  it('is false for unrelated errors and nullish values', () => {
    expect(isChunkLoadError(new TypeError('x is not a function'))).toBe(false)
    expect(isChunkLoadError(null)).toBe(false)
    expect(isChunkLoadError(undefined)).toBe(false)
  })

  it('exposes the shared message list used by the Sentry ignoreErrors filter', () => {
    expect(CHUNK_LOAD_ERROR_MESSAGES).toContain(
      'Importing a module script failed',
    )
    expect(CHUNK_LOAD_ERROR_MESSAGES).toContain(
      'is not a valid JavaScript MIME type',
    )
    expect(CHUNK_LOAD_ERROR_MESSAGES).toContain('Unable to preload CSS')
  })
})

describe('reloadOnceForStaleChunk', () => {
  beforeEach(() => {
    sessionStorage.clear()
    resetStaleChunkReloadForTests()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reloads on the first failure and records it for the path', () => {
    const navigate = vi.fn()
    expect(reloadOnceForStaleChunk('/verify-message', navigate)).toBe(true)
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(sessionStorage.getItem('chunk-reload:/verify-message')).toBe('1')
  })

  it('does not reload a second time for a path already retried this session', () => {
    // The post-reload page load: the guard key is there, the chunk still fails.
    sessionStorage.setItem('chunk-reload:/verify-message', '1')
    const navigate = vi.fn()
    expect(reloadOnceForStaleChunk('/verify-message', navigate)).toBe(false)
    expect(navigate).not.toHaveBeenCalled()
  })

  it('decides once per page load so two handlers cannot both act', () => {
    const first = vi.fn()
    const second = vi.fn()
    expect(reloadOnceForStaleChunk('/a', first)).toBe(true)
    expect(reloadOnceForStaleChunk('/b', second)).toBe(false)
    expect(second).not.toHaveBeenCalled()
    expect(sessionStorage.getItem('chunk-reload:/b')).toBeNull()
  })

  it('leaves the error alone while offline', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    const navigate = vi.fn()
    expect(reloadOnceForStaleChunk('/a', navigate)).toBe(false)
    expect(navigate).not.toHaveBeenCalled()
  })

  it('does not reload when the once-guard cannot be persisted', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })
    const navigate = vi.fn()
    expect(reloadOnceForStaleChunk('/a', navigate)).toBe(false)
    expect(navigate).not.toHaveBeenCalled()
  })
})

describe('installStaleChunkReload', () => {
  type FakeWindow = Window & { emit: (payload: unknown) => void }

  const makeWindow = (): FakeWindow => {
    const listeners = new Set<(event: Event) => void>()
    const target = {
      addEventListener: vi.fn((_type: string, cb: (event: Event) => void) => {
        listeners.add(cb)
      }),
      removeEventListener: vi.fn(
        (_type: string, cb: (event: Event) => void) => {
          listeners.delete(cb)
        },
      ),
      location: {
        pathname: '/verify-message',
        search: '?x=1',
        hash: '',
        reload: vi.fn(),
      },
      emit(payload: unknown) {
        const event = new Event('vite:preloadError', { cancelable: true })
        ;(event as Event & { payload?: unknown }).payload = payload
        listeners.forEach(cb => cb(event))
      },
    }
    return target as unknown as FakeWindow
  }

  const staleChunk = new TypeError(
    'Failed to fetch dynamically imported module: https://app.myetherwallet.com/assets/secp256k1-Dv6Yu3yl.js',
  )

  beforeEach(() => {
    sessionStorage.clear()
    resetStaleChunkReloadForTests()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('reloads in place for a stale chunk imported outside the router (viem secp256k1)', () => {
    const win = makeWindow()
    installStaleChunkReload(win)
    win.emit(staleChunk)
    expect(win.location.reload).not.toHaveBeenCalled()
    vi.runAllTimers()
    expect(win.location.reload).toHaveBeenCalledTimes(1)
    expect(sessionStorage.getItem('chunk-reload:/verify-message?x=1')).toBe('1')
  })

  it('does not reload for a chunk that failed while evaluating', () => {
    const win = makeWindow()
    installStaleChunkReload(win)
    win.emit(new TypeError('x is not a function'))
    vi.runAllTimers()
    expect(win.location.reload).not.toHaveBeenCalled()
  })

  it('yields to router.onError when the failed chunk was a route component', () => {
    const win = makeWindow()
    installStaleChunkReload(win)
    win.emit(staleChunk)
    // The router sees the same rejection within the microtask chain and lands
    // the user on the destination before the deferred global handler runs.
    const routerNavigate = vi.fn()
    expect(reloadOnceForStaleChunk('/portfolio', routerNavigate)).toBe(true)
    vi.runAllTimers()
    expect(routerNavigate).toHaveBeenCalledTimes(1)
    expect(win.location.reload).not.toHaveBeenCalled()
  })

  it('does not reload again after the reload already happened once for this page', () => {
    sessionStorage.setItem('chunk-reload:/verify-message?x=1', '1')
    const win = makeWindow()
    installStaleChunkReload(win)
    win.emit(staleChunk)
    vi.runAllTimers()
    expect(win.location.reload).not.toHaveBeenCalled()
  })

  it('stops listening once uninstalled', () => {
    const win = makeWindow()
    const uninstall = installStaleChunkReload(win)
    uninstall()
    win.emit(staleChunk)
    vi.runAllTimers()
    expect(win.location.reload).not.toHaveBeenCalled()
  })
})
