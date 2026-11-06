import { describe, it, expect } from 'vitest'
import { parseUnits } from 'viem'
import type { ProviderQuoteResponse } from '@enkryptcom/swap'
import { quotePriceImpact } from '@/modules/swap/swapPriceImpact'

const USDT = { address: '0xusdt', decimals: 6, price: 0.99 }
const ETH = { address: '0xeee', decimals: 18, price: 2222.89 }

const quote = (from: string, to: string, fromToken = USDT, toToken = ETH) =>
  ({
    fromTokenAmount: parseUnits(from, fromToken.decimals),
    toTokenAmount: parseUnits(to, toToken.decimals),
    quote: { options: { fromToken, toToken } },
  }) as unknown as ProviderQuoteResponse

describe('quotePriceImpact', () => {
  it('values the quote against itself, not the amount being typed', () => {
    // 3 USDT for 0.001326 ETH: the field may already read 33, the quote is for 3.
    expect(quotePriceImpact(quote('3', '0.001326'), USDT, ETH)).toBeCloseTo(
      0.75,
      1,
    )
  })

  it('reports a real loss', () => {
    // 33,423 USDT ($33,089) for 1.4845 ETH ($3,300).
    expect(quotePriceImpact(quote('33423', '1.4845'), USDT, ETH)).toBeCloseTo(
      90.03,
      1,
    )
  })

  it('has nothing to show for a quote of another pair', () => {
    const DAI = { address: '0xdai', decimals: 18, price: 1 }
    expect(quotePriceImpact(quote('3', '0.001326'), DAI, ETH)).toBe(0)
    expect(quotePriceImpact(quote('3', '0.001326'), USDT, DAI)).toBe(0)
  })

  it('has nothing to show without a quote or a price', () => {
    expect(quotePriceImpact(null, USDT, ETH)).toBe(0)
    expect(
      quotePriceImpact(quote('3', '0.001326'), { ...USDT, price: 0 }, ETH),
    ).toBe(0)
    expect(
      quotePriceImpact(quote('3', '0.001326'), USDT, { ...ETH, price: 0 }),
    ).toBe(0)
  })
})
