import { describe, it, expect, beforeEach, vi } from 'vitest'

// walletConfigs drags @enkryptcom/hw-wallets (ledger transport) into the
// import graph via @/analytics; the transport does not resolve under vitest.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useTradeBreakdown } from '@/modules/trade/composables/useTradeBreakdown'
import type { QuoteOutputType } from '@/modules/trade/providers/oneinch_fusion/oneInchTypes'
import type { NewTokenInfo } from '@/composables/useSwap'

const usdt = {
  symbol: 'USDT',
  decimals: 6,
  address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
} as NewTokenInfo

const aalon = {
  symbol: 'AALON',
  decimals: 18,
  address: '0x0000000000000000000000000000000000000001',
} as NewTokenInfo

const realQuote: QuoteOutputType = {
  startAmount: 1042335908759023930n,
  endAmount: 798874814627285528n,
  avgAmount: 920605361693154729n,
  auctionDurationSeconds: 180,
  slippage: 5.5,
  tokenFee: 186132624610132138n,
  marketReturn: 1042335914536949912n,
  usdPrices: {
    fromToken: '1.0000982169632373',
    toToken: '13.539447672837907',
  },
}

const setup = (quoteOverride: QuoteOutputType | null = realQuote) => {
  const quote = ref<QuoteOutputType | null>(quoteOverride)
  const fromToken = ref<NewTokenInfo | null>(usdt)
  const toToken = ref<NewTokenInfo | null>(aalon)
  const fromAmount = ref('12.947536')
  return {
    quote,
    fromAmount,
    ...useTradeBreakdown({ quote, fromToken, toToken, fromAmount }),
  }
}

describe('useTradeBreakdown', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('formats minimum receive from endAmount with to-token decimals', () => {
    const { minReceive } = setup()
    expect(minReceive.value).toMatch(/^0\.79/)
  })

  it('computes the rate as 1 to-token in from-token units', () => {
    const { rate } = setup()
    expect(rate.value).toMatch(/^1 AALON ≈ 14\.0\d* USDT$/)
  })

  it('computes tx fee in fiat from tokenFee and usd price', () => {
    const { txFee } = setup()
    expect(txFee.value).toMatch(/^\$2\.52/)
  })

  it('computes price impact of execution amount vs market return', () => {
    const { priceImpact } = setup()
    expect(priceImpact.value).toBe('-11.67%')
  })

  it('renders slippage as a percentage', () => {
    const { maxSlippage } = setup()
    expect(maxSlippage.value).toBe('5.5%')
  })

  it('degrades every row to an em dash without a quote', () => {
    const { minReceive, rate, txFee, priceImpact, maxSlippage } = setup(null)
    for (const row of [minReceive, rate, txFee, priceImpact, maxSlippage]) {
      expect(row.value).toBe('—')
    }
  })

  it('degrades only the rows whose fields are missing', () => {
    const { minReceive, rate, txFee, priceImpact, maxSlippage } = setup({
      startAmount: realQuote.startAmount,
      endAmount: realQuote.endAmount,
      avgAmount: realQuote.avgAmount,
    })
    expect(minReceive.value).toMatch(/^0\.79/)
    expect(rate.value).toMatch(/^1 AALON/)
    expect(txFee.value).toBe('—')
    expect(priceImpact.value).toBe('—')
    expect(maxSlippage.value).toBe('—')
  })

  it('degrades the rate when the from amount is empty', () => {
    const { rate, fromAmount } = setup()
    fromAmount.value = ''
    expect(rate.value).toBe('—')
  })

  it('reacts to quote updates', () => {
    const { quote, maxSlippage } = setup()
    quote.value = { ...realQuote, slippage: 1 }
    expect(maxSlippage.value).toBe('1%')
  })
})
