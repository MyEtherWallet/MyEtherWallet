import { describe, it, expect } from 'vitest'
import {
  CHUNK_LOAD_ERROR_MESSAGES,
  isChunkLoadError,
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
      isChunkLoadError(
        new Error('error loading dynamically imported module'),
      ),
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
    expect(CHUNK_LOAD_ERROR_MESSAGES).toContain('Importing a module script failed')
    expect(CHUNK_LOAD_ERROR_MESSAGES).toContain('is not a valid JavaScript MIME type')
    expect(CHUNK_LOAD_ERROR_MESSAGES).toContain('Unable to preload CSS')
  })
})
