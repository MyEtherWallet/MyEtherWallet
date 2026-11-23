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
import AppTooltip from '@/components/tooltip/AppTooltip.vue'

const USDT = { address: '0xusdt', symbol: 'USDT', decimals: 6, price: 1 }
const ETH = { address: '0xeee', symbol: 'ETH', decimals: 18, price: 2000 }

// 2,000 USDT in; the ETH out sets the loss.
const quote = (provider: string, eth: string, toToken: object = ETH) =>
  ({
    provider,
    fromTokenAmount: parseUnits('2000', USDT.decimals),
    toTokenAmount: parseUnits(eth, ETH.decimals),
    quote: { provider, options: { fromToken: USDT, toToken } },
  }) as unknown as ProviderQuoteResponse

const fair = quote('oneInch', '0.99') // 1% loss
const bad = quote('zerox', '0.8') // 20% loss

const mountWith = (selectedQuote: ProviderQuoteResponse, amount = '2000') =>
  mount(SwapOfferModal, {
    props: {
      swapOfferOpen: true,
      selectedQuote,
      quotes: [fair, bad],
      amount,
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

  it('warns without blocking when a token has no price (MEW-2649)', () => {
    const wrapper = mountWith(quote('zerox', '0.8', { ...ETH, price: null }))

    expect(wrapper.text()).toContain('swap.price-impact-unknown')
    expect(wrapper.text()).not.toContain('swap.price-impact-too-high')
    expect(proceedButton(wrapper).attributes('disabled')).toBeUndefined()
  })
})

describe('SwapOfferModal paying amount', () => {
  const payingAmount = (wrapper: ReturnType<typeof mountWith>) =>
    wrapper.get('[data-testid="swap-paying-amount"]')
  const tooltipTexts = (wrapper: ReturnType<typeof mountWith>) =>
    wrapper.findAllComponents(AppTooltip).map(t => t.props('text'))

  it('shows an amount of up to 20 characters in full, 14px scaling to 16px', () => {
    const full = '0.006389040424117250' // 20 characters
    const wrapper = mountWith(fair, full)

    expect(payingAmount(wrapper).text()).toBe(full)
    expect(tooltipTexts(wrapper)).not.toContain(full)
    expect(payingAmount(wrapper).element.parentElement?.className).toContain(
      'text-label-sm sm:text-label-base',
    )
  })

  it('cuts a longer amount to 20 characters and shows it in full in a tooltip', () => {
    const full = '0.006389040424117250123' // 23 characters
    const wrapper = mountWith(fair, full)

    expect(payingAmount(wrapper).text()).toBe('0.00638904042411725…')
    expect(payingAmount(wrapper).text()).toHaveLength(20)
    expect(tooltipTexts(wrapper)).toContain(full)
  })

  it('makes the full-amount tooltip trigger keyboard-focusable', () => {
    const full = '0.006389040424117250123'
    const wrapper = mountWith(fair, full)

    const tooltip = wrapper
      .findAllComponents(AppTooltip)
      .find(t => t.props('text') === full)!
    const trigger = tooltip.find('[tabindex="0"]')
    expect(trigger.attributes('aria-label')).toBe(full)
  })
})
