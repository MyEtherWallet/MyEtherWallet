import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia, defineStore } from 'pinia'
import { ref } from 'vue'
import BigNumber from 'bignumber.js'
import { vi } from 'vitest'

// walletStore transitively pulls in the Ledger/hardware SDK, which breaks test
// load under jsdom. Replace it with a minimal Pinia store exposing only what
// usePortfolio24hChange reads: allTokens, getTokenBalance, and
// totalFiatPortfolioValueBN.
const tokens = ref<Array<{ contract: string; price_change_percentage_24h: number }>>([])
const balances: Record<string, { price: string; balance: string }> = {}
let totalNow = new BigNumber(0)

vi.mock('@/stores/walletStore', () => ({
  useWalletStore: defineStore('wallet', () => ({
    allTokens: tokens,
    getTokenBalance: (contract: string) => balances[contract],
    get totalFiatPortfolioValueBN() {
      return totalNow
    },
  })),
}))

const { usePortfolio24hChange } = await import(
  '@/composables/usePortfolio24hChange'
)

describe('usePortfolio24hChange (MEW-2094)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    tokens.value = []
    for (const k of Object.keys(balances)) delete balances[k]
    totalNow = new BigNumber(0)
  })

  it('computes the balance-weighted 24h fiat and percent change', () => {
    // A: value 110 now, +10% -> gain 10; B: value 80 now, -20% -> loss 20.
    tokens.value = [
      { contract: '0xA', price_change_percentage_24h: 10 },
      { contract: '0xB', price_change_percentage_24h: -20 },
    ]
    balances['0xA'] = { price: '110', balance: '1' }
    balances['0xB'] = { price: '80', balance: '1' }
    totalNow = new BigNumber(190)

    const { lastTwentyFourHours } = usePortfolio24hChange()
    // totalGainOrLoss = 10 - 20 = -10; old = 190 - (-10) = 200; % = -5.
    expect(lastTwentyFourHours.value.fiat.toNumber()).toBe(-10)
    expect(lastTwentyFourHours.value.percentChange.toNumber()).toBe(-5)
  })

  it('returns 0% when the derived old value is zero or negative', () => {
    // No tokens -> no gain/loss, totalNow 0 -> old 0 -> guard returns 0.
    const { lastTwentyFourHours } = usePortfolio24hChange()
    expect(lastTwentyFourHours.value.fiat.toNumber()).toBe(0)
    expect(lastTwentyFourHours.value.percentChange.toNumber()).toBe(0)
  })

  it('treats a missing token balance as zero', () => {
    tokens.value = [{ contract: '0xMISSING', price_change_percentage_24h: 50 }]
    totalNow = new BigNumber(0)
    const { lastTwentyFourHours } = usePortfolio24hChange()
    expect(lastTwentyFourHours.value.fiat.toNumber()).toBe(0)
  })
})
