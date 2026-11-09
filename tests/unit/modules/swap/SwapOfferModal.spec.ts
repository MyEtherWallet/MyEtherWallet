import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import { parseUnits } from 'viem'
import type { ProviderQuoteResponse } from '@enkryptcom/swap'

vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => reactive({ wallet: null }),
}))
vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: () => reactive({ gasPriceType: 'REGULAR' }),
}))
vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({
    formatFiat: (v: unknown) => ({ value: String(v) }),
    currencySymbol: '$',
  }),
}))
vi.mock('@/analytics', () => ({
  analytics: { trackSwapEvent: vi.fn() },
  SwapEvent: {},
}))
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (k: string) => k }) }))
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  const { toRefs } = await import('vue')
  return {
    ...actual,
    storeToRefs: (store: Record<string, unknown>) => toRefs(store),
  }
})

import SwapOfferModal from '@/modules/swap/components/SwapOfferModal.vue'

const USDT = { address: '0xusdt', symbol: 'USDT', decimals: 6, price: 1 }
const ETH = { address: '0xeee', symbol: 'ETH', decimals: 18, price: 2000 }

// 2,000 USDT in; the ETH out sets the loss.
const quote = (provider: string, eth: string) =>
  ({
    provider,
    fromTokenAmount: parseUnits('2000', USDT.decimals),
    toTokenAmount: parseUnits(eth, ETH.decimals),
    quote: { provider, options: { fromToken: USDT, toToken: ETH } },
  }) as unknown as ProviderQuoteResponse

const fair = quote('oneInch', '0.99') // 1% loss
const bad = quote('zerox', '0.8') // 20% loss

const mountWith = (selectedQuote: ProviderQuoteResponse) =>
  mount(SwapOfferModal, {
    props: {
      swapOfferOpen: true,
      selectedQuote,
      quotes: [fair, bad],
      amount: '2000',
      swapGasFeeQuote: {
        quoteId: 'q1',
        fees: { REGULAR: { nativeValue: '0.001' } },
      } as never,
    },
    global: {
      stubs: {
        AppModal: { template: '<div><slot /></div>' },
        AppSelectTxFee: true,
        AppDropdown: true,
        AppTokenSymbol: true,
        AppTokenLogo: true,
        AppIcon: true,
      },
      mocks: { $t: (k: string) => k },
    },
  })

const proceedButton = (wrapper: ReturnType<typeof mountWith>) =>
  wrapper.findAll('button').find(b => b.text() === 'swap.swap-offer.proceed')!

describe('SwapOfferModal price impact (MEW-2648)', () => {
  it('warns and blocks a picked offer above the limit', async () => {
    const wrapper = mountWith(bad)

    expect(wrapper.text()).toContain('swap.price-impact-too-high')
    expect(proceedButton(wrapper).attributes('disabled')).toBeDefined()

    await proceedButton(wrapper).trigger('click')
    expect(wrapper.emitted('update:proceedWithSwap')).toBeUndefined()
  })

  it('lets an offer within the limit proceed', async () => {
    const wrapper = mountWith(fair)

    expect(wrapper.text()).not.toContain('swap.price-impact-too-high')
    expect(proceedButton(wrapper).attributes('disabled')).toBeUndefined()

    await proceedButton(wrapper).trigger('click')
    expect(wrapper.emitted('update:proceedWithSwap')).toEqual([['q1']])
  })
})
