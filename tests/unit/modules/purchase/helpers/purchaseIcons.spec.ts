import { describe, it, expect } from 'vitest'
import { getSelectedTokenIcon } from '@/modules/purchase/helpers/purchaseIcons'
import type { PurchaseAsset } from '@/types/buyToken'

const chain = { icon: 'eth-chain.svg', currencyName: 'ETH' }
const asset = (overrides: Partial<PurchaseAsset>) =>
  ({ symbol: 'USDC', coingecko_id: 'usd-coin', ...overrides }) as PurchaseAsset

describe('getSelectedTokenIcon', () => {
  it('uses the chain icon for the native coin or before a token is picked', () => {
    expect(getSelectedTokenIcon(null, chain, new Map())).toBe('eth-chain.svg')
    expect(
      getSelectedTokenIcon(asset({ symbol: 'ETH' }), chain, new Map()),
    ).toBe('eth-chain.svg')
  })

  it('prefers the coin image, then the market data icon', () => {
    const images = new Map([['usd-coin', 'usdc.png']])
    expect(getSelectedTokenIcon(asset({}), chain, images)).toBe('usdc.png')
    expect(
      getSelectedTokenIcon(
        asset({ market_data: { icon: 'usdc-md.png' } } as never),
        chain,
        new Map(),
      ),
    ).toBe('usdc-md.png')
  })

  it("returns no icon for a token without one, never the chain's coin", () => {
    expect(getSelectedTokenIcon(asset({}), chain, new Map())).toBeUndefined()
  })
})
