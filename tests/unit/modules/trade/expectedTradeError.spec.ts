import { describe, it, expect } from 'vitest'
import { isExpectedTradeError } from '@/modules/trade/common/expectedTradeError'

describe('isExpectedTradeError', () => {
  it('is true for a user rejection carrying EIP-1193 code 4001', () => {
    // The exact production shape from the Sentry breadcrumb:
    // "Rabby - RPC Error: User rejected the request. {code: 4001}"
    expect(
      isExpectedTradeError({ code: 4001, message: 'User rejected the request.' }),
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
