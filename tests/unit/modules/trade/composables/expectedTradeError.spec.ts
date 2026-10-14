import { describe, it, expect } from 'vitest'
import {
  isExpectedTradeError,
  isBelowMinimumError,
  isExpectedClientError,
  isPairUnavailableError,
  isTransientNetworkError,
} from '@/modules/trade/common/expectedTradeError'

describe('isExpectedTradeError', () => {
  it('is true for a user rejection carrying EIP-1193 code 4001', () => {
    // The exact production shape from the Sentry breadcrumb:
    // "Rabby - RPC Error: User rejected the request. {code: 4001}"
    expect(
      isExpectedTradeError({
        code: 4001,
        message: 'User rejected the request.',
      }),
    ).toBe(true)
  })

  it('is true when only the message signals a user rejection (code stripped)', () => {
    // submitOrder used to re-throw a bare Error that lost `.code`; the message
    // pattern must still classify it as expected.
    expect(isExpectedTradeError(new Error('User rejected the request.'))).toBe(
      true,
    )
    expect(isExpectedTradeError(new Error('MetaMask Tx: user denied'))).toBe(
      true,
    )
  })

  it('is true for a 1inch 4xx response (expired quote / illiquid / invalid)', () => {
    expect(isExpectedTradeError({ response: { status: 400 } })).toBe(true)
    expect(isExpectedTradeError({ response: { status: 404 } })).toBe(true)
    expect(isExpectedTradeError({ response: { status: 499 } })).toBe(true)
  })

  // These arrive as 4xx but are not the user's doing: suppressing them hides a
  // revoked credential, a provider block, or throttling behind a generic toast.
  it('is false for credential, authorization and throttle statuses', () => {
    expect(isExpectedTradeError({ response: { status: 401 } })).toBe(false)
    expect(isExpectedTradeError({ response: { status: 403 } })).toBe(false)
    expect(isExpectedTradeError({ response: { status: 429 } })).toBe(false)
  })

  it('is false for a genuine 5xx / server failure', () => {
    expect(isExpectedTradeError({ response: { status: 500 } })).toBe(false)
    expect(isExpectedTradeError({ response: { status: 503 } })).toBe(false)
  })

  it('is false for a network error with no response', () => {
    expect(isExpectedTradeError(new Error('Network Error'))).toBe(false)
  })

  it('is false for a native transaction revert', () => {
    expect(isExpectedTradeError(new Error('Native Transaction Failed'))).toBe(
      false,
    )
  })

  it('is false for non-object / empty inputs', () => {
    expect(isExpectedTradeError(null)).toBe(false)
    expect(isExpectedTradeError(undefined)).toBe(false)
    expect(isExpectedTradeError('boom')).toBe(false)
  })
})

describe('isExpectedClientError', () => {
  it('reads the flag the 1inch provider attaches', () => {
    expect(isExpectedClientError({ expectedClientError: true })).toBe(true)
    expect(isExpectedClientError({ expectedClientError: false })).toBe(false)
    expect(isExpectedClientError(new Error('no flag'))).toBe(false)
  })

  // A thrown null/undefined/primitive used to raise a TypeError inside the catch
  // block, skipping the toast and analytics that follow the report.
  it('survives thrown values that are not objects', () => {
    expect(isExpectedClientError(null)).toBe(false)
    expect(isExpectedClientError(undefined)).toBe(false)
    expect(isExpectedClientError('boom')).toBe(false)
    expect(isExpectedClientError(0)).toBe(false)
  })
})

describe('isPairUnavailableError', () => {
  it('is true for a 1inch 4xx without a code or with an unknown one', () => {
    expect(isPairUnavailableError({ expectedClientError: true })).toBe(true)
    expect(
      isPairUnavailableError({
        expectedClientError: true,
        fusionCode: 'NOT_ENOUGH_LIQUIDITY',
      }),
    ).toBe(true)
  })

  it('is false for codes that describe the amount or the market, not the pair', () => {
    expect(
      isPairUnavailableError({
        expectedClientError: true,
        fusionCode: 'INSUFFICIENT_AMOUNT',
      }),
    ).toBe(false)
    expect(
      isPairUnavailableError({
        expectedClientError: true,
        fusionCode: 'MARKET_CLOSED',
      }),
    ).toBe(false)
  })

  it('is false without the client-error flag and for non-object throws', () => {
    expect(isPairUnavailableError({ fusionCode: 'INSUFFICIENT_AMOUNT' })).toBe(
      false,
    )
    expect(isPairUnavailableError(new Error('boom'))).toBe(false)
    expect(isPairUnavailableError(null)).toBe(false)
    expect(isPairUnavailableError('boom')).toBe(false)
  })
})

describe('isBelowMinimumError', () => {
  it('is true only for a flagged 1inch INSUFFICIENT_AMOUNT', () => {
    expect(
      isBelowMinimumError({
        expectedClientError: true,
        fusionCode: 'INSUFFICIENT_AMOUNT',
      }),
    ).toBe(true)
    expect(
      isBelowMinimumError({
        expectedClientError: true,
        fusionCode: 'MARKET_CLOSED',
      }),
    ).toBe(false)
    expect(isBelowMinimumError({ fusionCode: 'INSUFFICIENT_AMOUNT' })).toBe(
      false,
    )
    expect(isBelowMinimumError(null)).toBe(false)
  })
})

describe('isTransientNetworkError', () => {
  it('reads the flag and survives non-object throws', () => {
    expect(isTransientNetworkError({ transientNetworkError: true })).toBe(true)
    expect(isTransientNetworkError({})).toBe(false)
    expect(isTransientNetworkError(null)).toBe(false)
    expect(isTransientNetworkError(undefined)).toBe(false)
  })
})
