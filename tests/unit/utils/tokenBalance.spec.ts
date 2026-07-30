import { describe, expect, it } from 'vitest'
import { hydrateTokenBalances } from '@/utils/tokenBalance'

const MAIN_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

describe('hydrateTokenBalances', () => {
  it('hydrates wallet balances while preserving an existing token price', () => {
    const [token] = hydrateTokenBalances(
      [{ address: '0xabc', price: 2, symbol: 'ABC' }],
      {
        balanceSources: [{ address: '0xAbC', balance: '42', price: 5 }],
        mainTokenAddress: MAIN_TOKEN,
      },
    )

    expect(token).toMatchObject({ balance: '42', price: 2, symbol: 'ABC' })
  })

  it('uses the native balance and chain price for the main token', () => {
    const [token] = hydrateTokenBalances(
      [{ address: MAIN_TOKEN, price: 0 }],
      {
        balanceSources: [],
        mainTokenAddress: MAIN_TOKEN,
        nativeBalance: '100',
        nativePrice: 3,
      },
    )

    expect(token).toMatchObject({ balance: '100', price: 3 })
  })

  it('can skip hydration and freeze results independently', () => {
    const [token] = hydrateTokenBalances([{ address: '0xabc', price: 2 }], {
      balanceSources: [{ address: '0xabc', balance: '42', price: 5 }],
      mainTokenAddress: MAIN_TOKEN,
      hydrate: false,
      freeze: true,
    })

    expect(token).toMatchObject({ balance: '0', price: 2 })
    expect(Object.isFrozen(token)).toBe(true)
  })
})
