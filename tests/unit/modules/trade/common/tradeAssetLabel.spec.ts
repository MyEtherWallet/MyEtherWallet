import { describe, it, expect, vi } from 'vitest'
import { tradeAssetLabel } from '@/modules/trade/common/tradeAssetLabel'

const AAPL = { address: '0xaapl', symbol: 'AAPLON' }
const USDC = { address: '0xusdc', symbol: 'usdc' }

describe('tradeAssetLabel', () => {
  it('asks the stocks list for the asset on this network', () => {
    const isListedStock = vi.fn(
      (address: string, chain: string) =>
        address === '0xaapl' && chain === 'ETHEREUM',
    )
    expect(tradeAssetLabel(AAPL, 'ETHEREUM', isListedStock)).toEqual({
      isStock: true,
      symbol: 'AAPLon',
    })
    // A cash-out buys a supporting asset, which stays a plain token.
    expect(tradeAssetLabel(USDC, 'ETHEREUM', isListedStock)).toEqual({
      isStock: false,
      symbol: 'USDC',
    })
  })

  it('is not a stock without a network', () => {
    const isListedStock = vi.fn(() => true)
    expect(tradeAssetLabel(AAPL, undefined, isListedStock)).toEqual({
      isStock: false,
      symbol: 'AAPLON',
    })
    expect(isListedStock).not.toHaveBeenCalled()
  })

  it('adds the "on" suffix when the ticker lacks it', () => {
    expect(
      tradeAssetLabel(
        { address: '0x1', symbol: 'meli' },
        'ETHEREUM',
        () => true,
      ).symbol,
    ).toBe('MELIon')
  })
})
