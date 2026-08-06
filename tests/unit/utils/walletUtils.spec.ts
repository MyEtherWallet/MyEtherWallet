import { describe, it, expect, afterEach } from 'vitest'
import { isTrezorSupported } from '@/utils/walletUtils'

// ---------------------------------------------------------------------------
// isTrezorSupported — MEW-2041
//
// `@enkryptcom/hw-wallets` `getTrezorConnect` references the bare `chrome`
// global, which is undefined on non-Chromium browsers (e.g. iOS Safari) and
// throws `ReferenceError: Can't find variable: chrome`. The connect entry point
// must gate on this capability so unsupported browsers fail gracefully instead
// of crashing.
// ---------------------------------------------------------------------------

describe('isTrezorSupported', () => {
  const globalObj = globalThis as { chrome?: unknown }
  const hadChrome = Object.prototype.hasOwnProperty.call(globalObj, 'chrome')
  const originalChrome = globalObj.chrome

  afterEach(() => {
    if (hadChrome) {
      globalObj.chrome = originalChrome
    } else {
      delete globalObj.chrome
    }
  })

  it('returns false without throwing when `chrome` is undefined (non-Chromium, e.g. iOS Safari)', () => {
    delete globalObj.chrome

    let result: boolean | undefined
    expect(() => {
      result = isTrezorSupported()
    }).not.toThrow()
    expect(result).toBe(false)
  })

  it('returns true on a Chromium browser where the `chrome` global exists', () => {
    globalObj.chrome = { runtime: {} }
    expect(isTrezorSupported()).toBe(true)
  })
})
