import { describe, it, expect, afterEach } from 'vitest'
import {
  isTrezorSupported,
  isInsufficientFundsError,
  isUserRejectionError,
  isBlindSigningDisabledError,
} from '@/utils/walletUtils'

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

describe('isInsufficientFundsError', () => {
  const walletError = {
    code: 4001,
    message:
      '8546: Returned error: Insufficient funds for gas * price + value: have 23219751748880 want 32859931864032',
  }

  const estimationError = {
    message:
      'execution reverted with reason: gas required exceeds allowance (31517). estimate gas arguments: from: 0x717ba71d4ea77d1b7c49a913c28c0bd538eecd41 maxfeepergas: 0.195115408 gwei nonce: 6 details: gas required exceeds allowance (31517) version: viem@2.44.0',
  }

  it('detects the wallet variant even though it is tagged as code 4001', () => {
    expect(isInsufficientFundsError(walletError)).toBe(true)
  })

  it('detects the estimation variant, which carries no code', () => {
    expect(isInsufficientFundsError(estimationError)).toBe(true)
  })

  it('is what separates the wallet variant from a real cancellation', () => {
    expect(isUserRejectionError(walletError)).toBe(true)
  })

  it('leaves a genuine user cancellation alone', () => {
    const cancelled = { code: 4001, message: 'User rejected the request' }
    expect(isInsufficientFundsError(cancelled)).toBe(false)
    expect(isUserRejectionError(cancelled)).toBe(true)
  })

  it('ignores an ordinary revert', () => {
    expect(isInsufficientFundsError({ message: 'execution reverted' })).toBe(
      false,
    )
  })

  it('matches regardless of casing and tolerates malformed errors', () => {
    expect(
      isInsufficientFundsError({ message: 'INSUFFICIENT FUNDS for gas' }),
    ).toBe(true)
    expect(isInsufficientFundsError(undefined)).toBe(false)
    expect(isInsufficientFundsError(null)).toBe(false)
    expect(isInsufficientFundsError({})).toBe(false)
    expect(isInsufficientFundsError('insufficient funds')).toBe(false)
  })
})

describe('isBlindSigningDisabledError', () => {
  it('detects the Ledger Ethereum app error thrown when blind signing is off', () => {
    const error = new Error(
      'Please enable Blind signing or Contract data in the Ethereum app Settings',
    )
    error.name = 'EthAppPleaseEnableContractData'
    expect(isBlindSigningDisabledError(error)).toBe(true)
  })

  it('detects the Celo app variant', () => {
    expect(
      isBlindSigningDisabledError(
        new Error('Please enable Contract data in the Celo app Settings'),
      ),
    ).toBe(true)
  })

  it('matches the raw message string passed by getLocalizedWalletError', () => {
    expect(
      isBlindSigningDisabledError(
        'please enable blind signing or contract data in the ethereum app settings',
      ),
    ).toBe(true)
  })

  it('leaves other signing failures reportable', () => {
    expect(
      isBlindSigningDisabledError(new Error('Ledger device: locked (0x5515)')),
    ).toBe(false)
    expect(isBlindSigningDisabledError(undefined)).toBe(false)
    expect(isBlindSigningDisabledError(null)).toBe(false)
  })
})
