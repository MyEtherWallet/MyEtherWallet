import { describe, expect, it } from 'vitest'
import { getProviderErrorMessageKey } from '@/modules/trade/common/providerErrorMessages'

describe('getProviderErrorMessageKey', () => {
  it('maps XSTOCKS_NOT_ALLOWED to its trade locale key', () => {
    expect(getProviderErrorMessageKey('XSTOCKS_NOT_ALLOWED')).toBe(
      'trade.error.xstocks-not-allowed',
    )
  })

  it('does not map unknown or missing provider messages', () => {
    expect(getProviderErrorMessageKey('insufficient liquidity')).toBeUndefined()
    expect(getProviderErrorMessageKey('toString')).toBeUndefined()
    expect(getProviderErrorMessageKey(undefined)).toBeUndefined()
  })
})
