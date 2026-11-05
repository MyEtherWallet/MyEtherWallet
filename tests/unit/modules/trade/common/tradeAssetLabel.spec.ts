import { describe, it, expect, vi } from 'vitest'
import { tradeAssetLabel } from '@/modules/trade/common/tradeAssetLabel'

const AAPL = { address: '0xaapl', symbol: 'AAPLON' }

describe('tradeAssetLabel', () => {
  it('treats every buy-side asset as a stock without asking the list', () => {
    const isListedStock = vi.fn(() => false)
    expect(tradeAssetLabel(AAPL, 'buy', undefined, isListedStock)).toEqual({
      isStock: true,
      symbol: 'AAPLon',
    })
    expect(isListedStock).not.toHaveBeenCalled()
  })

  it('asks the stocks list on the sell side', () => {
    const isListedStock = vi.fn(
      (address: string, chain: string) =>
        address === '0xaapl' && chain === 'ETHEREUM',
    )
    expect(tradeAssetLabel(AAPL, 'sell', 'ETHEREUM', isListedStock)).toEqual({
      isStock: true,
      symbol: 'AAPLon',
    })
    expect(
      tradeAssetLabel(
        { address: '0xusdc', symbol: 'usdc' },
        'sell',
        'ETHEREUM',
        isListedStock,
      ),
    ).toEqual({ isStock: false, symbol: 'USDC' })
  })

  it('is not a stock on the sell side without a network', () => {
    expect(tradeAssetLabel(AAPL, 'sell', undefined, () => true)).toEqual({
      isStock: false,
      symbol: 'AAPLON',
    })
  })

  it('adds the "on" suffix when the ticker lacks it', () => {
    expect(
      tradeAssetLabel(
        { address: '0x1', symbol: 'meli' },
        'buy',
        'ETHEREUM',
        () => false,
      ).symbol,
    ).toBe('MELIon')
  })
})
