import { describe, it, expect, beforeEach, vi } from 'vitest'

// walletConfigs drags @enkryptcom/hw-wallets (ledger transport) into the
// import graph via @/analytics; the transport does not resolve under vitest.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import i18n from '@/i18n'
import TradeReviewModal from '@/modules/trade/components/TradeReviewModal.vue'
import { analytics, TradeEvent } from '@/analytics'
import type { QuoteOutputType } from '@/modules/trade/providers/oneinch_fusion/oneInchTypes'
import type { NewTokenInfo } from '@/composables/useSwap'

const AppDialogStub = {
  props: { isOpen: { type: Boolean, default: false } },
  template: '<div v-if="isOpen"><slot name="title" /><slot name="content" /></div>',
}

const usdt = {
  symbol: 'USDT',
  decimals: 6,
  address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  price: 1,
  logoURI: '',
} as NewTokenInfo

const aalon = {
  symbol: 'AALON',
  decimals: 18,
  address: '0x0000000000000000000000000000000000000001',
  price: 13.54,
  logoURI: '',
} as NewTokenInfo

const quote: QuoteOutputType = {
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

let pinia: Pinia

const mountModal = (props: Record<string, unknown> = {}) =>
  mount(TradeReviewModal, {
    props: {
      isOpen: true,
      quote,
      fromToken: usdt,
      toToken: aalon,
      fromAmount: '12.947536',
      ...props,
    },
    global: {
      plugins: [i18n, pinia],
      stubs: { AppDialog: AppDialogStub, RewardsTradeConfirmationBanner: true },
    },
  })

describe('TradeReviewModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders the single provider row', () => {
    const modal = mountModal()
    expect(modal.text()).toContain('Trade provider')
    expect(modal.text()).toContain('1 Inch Fusion')
  })

  it('renders the estimated summary with both sides of the trade', () => {
    const modal = mountModal()
    expect(modal.text()).toContain("You're paying")
    expect(modal.text()).toContain('12.947536')
    expect(modal.text()).toContain("You'll receive")
    expect(modal.text()).toContain('(Value is estimated)')
  })

  it('hides the breakdown until expanded and shows quote-derived rows after', async () => {
    const modal = mountModal()
    expect(modal.text()).not.toContain("Minimum you'll receive")

    const toggle = modal
      .findAll('button')
      .find(button => button.text().includes('Expand breakdown'))
    await toggle!.trigger('click')

    expect(modal.text()).toContain("Minimum you'll receive")
    expect(modal.text()).toContain('Rate')
    expect(modal.text()).toContain('5.5%')
    expect(modal.text()).toContain('Close breakdown')
  })

  it('emits confirm from the CTA while the quote is live', async () => {
    const modal = mountModal({ expiresAt: null })
    const confirm = modal
      .findAll('button')
      .find(button => button.text().includes('Confirm trade'))
    await confirm!.trigger('click')
    expect(modal.emitted('confirm')).toHaveLength(1)
  })

  it('disables the CTA once the quote expired', async () => {
    const modal = mountModal({ expiresAt: Date.now() - 1000 })
    const confirm = modal
      .findAll('button')
      .find(button => button.text().includes('Confirm trade'))
    expect(confirm!.attributes('disabled')).toBeDefined()
    await confirm!.trigger('click')
    expect(modal.emitted('confirm')).toBeUndefined()
  })

  it('tracks the offer as declined when closed without confirming', async () => {
    const trackSpy = vi
      .spyOn(analytics, 'trackTradeEvent')
      .mockImplementation(() => {})
    const modal = mountModal()
    await modal.setProps({ isOpen: false })
    expect(trackSpy).toHaveBeenCalledWith(TradeEvent.OFFER_DECLINED)
  })
})
