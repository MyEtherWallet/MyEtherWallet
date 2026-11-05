import { describe, it, expect } from 'vitest'
import {
  pickQuickPicks,
  tokenRowAccessory,
} from '@/components/token_selector/tokenSelector'
import type { TokenSelectorItem } from '@/components/token_selector/types'

const item = (symbol: string, extra: Partial<TokenSelectorItem> = {}) =>
  ({ id: symbol.toLowerCase(), symbol, name: symbol, raw: null, ...extra }) as TokenSelectorItem

describe('tokenRowAccessory', () => {
  it('shows the holding when the token has a fiat balance', () => {
    expect(
      tokenRowAccessory({
        balanceFiat: '$1,230',
        balance: '1,230 USDC',
        price: '$1.00',
        change: 0.1,
      }),
    ).toEqual({ kind: 'balance', primary: '$1,230', secondary: '1,230 USDC' })
  })

  it('falls back to the price with its 24h change', () => {
    expect(tokenRowAccessory({ price: '$314.38', change: -2.21 })).toEqual({
      kind: 'balance-performance',
      primary: '$314.38',
      change: -2.21,
    })
  })

  it('shows the price alone when there is no 24h change', () => {
    expect(tokenRowAccessory({ price: '$314.38' })).toEqual({
      kind: 'balance',
      primary: '$314.38',
    })
    expect(tokenRowAccessory({ price: '$1', change: Number.NaN })).toEqual({
      kind: 'balance',
      primary: '$1',
    })
  })

  it('has nothing to show without a balance or a price', () => {
    expect(tokenRowAccessory({})).toBeUndefined()
  })
})

describe('pickQuickPicks', () => {
  it('returns USDC, WBTC, the native token and USDT in Figma order', () => {
    const items = [item('USDT'), item('ETH'), item('DAI'), item('WBTC'), item('USDC')]
    expect(pickQuickPicks(items, 'ETH').map(i => i.symbol)).toEqual([
      'USDC',
      'WBTC',
      'ETH',
      'USDT',
    ])
  })

  it('skips the symbols the list does not have and disabled tokens', () => {
    const items = [item('usdc'), item('WBTC', { disabled: true }), item('POL')]
    expect(pickQuickPicks(items, 'pol').map(i => i.symbol)).toEqual([
      'usdc',
      'POL',
    ])
  })

  it('takes the first match per symbol and never repeats one', () => {
    const items = [
      item('USDC', { id: 'usdc-eth' }),
      item('USDC', { id: 'usdc-base' }),
    ]
    expect(pickQuickPicks(items, 'USDC').map(i => i.id)).toEqual(['usdc-eth'])
  })
})
