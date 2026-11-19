import { describe, it, expect } from 'vitest'
import { getPercentAmount } from '@/modules/purchase/helpers/percentAmount'

const ONE_ETH = 10n ** 18n

describe('getPercentAmount', () => {
  it('takes the share of an ERC-20 balance without reserving any fee', () => {
    expect(
      getPercentAmount({
        balance: 248_320_000n,
        decimals: 6,
        percent: 100,
        fee: 1_000n,
        isNative: false,
      }),
    ).toBe('248.32')
    expect(
      getPercentAmount({
        balance: 248_320_000n,
        decimals: 6,
        percent: 25,
        isNative: false,
      }),
    ).toBe('62.08')
  })

  it('reserves the fee only at 100% of the native token', () => {
    const fee = ONE_ETH / 100n // 0.01
    expect(
      getPercentAmount({
        balance: ONE_ETH,
        decimals: 18,
        percent: 100,
        fee,
        isNative: true,
      }),
    ).toBe('0.99')
    expect(
      getPercentAmount({
        balance: ONE_ETH,
        decimals: 18,
        percent: 50,
        fee,
        isNative: true,
      }),
    ).toBe('0.5')
  })

  it('returns 0 when the fee is larger than the balance', () => {
    expect(
      getPercentAmount({
        balance: 100n,
        decimals: 18,
        percent: 100,
        fee: 1_000n,
        isNative: true,
      }),
    ).toBe('0')
  })

  it('rounds down to the input decimal cap', () => {
    expect(
      getPercentAmount({
        balance: 123_456_789_123_456_789n,
        decimals: 18,
        percent: 100,
        isNative: false,
      }),
    ).toBe('0.123456')
  })
})
