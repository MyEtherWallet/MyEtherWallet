import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'

const globalStore = reactive({ gasPriceType: 'REGULAR' })

vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => reactive({ wallet: null }),
}))
// No chainID: the "More details" parser stays off for these fixtures.
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => reactive({ selectedChain: { currencyName: 'ETH' } }),
}))
vi.mock('@/stores/globalStore', () => ({ useGlobalStore: () => globalStore }))
vi.mock('@/stores/watchOnlyStore', () => ({
  useWatchOnlyStore: () => ({ activeAccount: { addressName: 'Main account' } }),
}))
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: vi.fn() }),
}))
vi.mock('@/stores/tradeOrdersStore', () => ({
  useTradeOrdersStore: () => ({ addTransaction: vi.fn() }),
}))
vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({ formatFiat: (v: unknown) => ({ display: `$${v}` }) }),
}))
vi.mock('@/analytics', () => ({
  analytics: { trackSendEvent: vi.fn() },
  SendEvent: {},
  SendEventStatus: {},
  SendEventError: {},
}))
vi.mock('@sentry/vue', () => ({ captureException: vi.fn() }))
vi.mock('vue-i18n', async importOriginal => ({
  ...(await importOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (k: string) => k }),
}))
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  const { toRefs } = await import('vue')
  return {
    ...actual,
    storeToRefs: (store: Record<string, unknown>) => toRefs(store),
  }
})

import EvmTransactionConfirmation from '@/modules/send/components/EvmTransactionConfirmation.vue'

const mountReview = (props: Record<string, unknown> = {}) =>
  mount(EvmTransactionConfirmation, {
    props: {
      toAddress: '0xB000000000000000000000000000000000000002',
      fromAddress: '0xA000000000000000000000000000000000000001',
      networkFeeUSD: '0.26',
      networkFeeCrypto: '0.0001',
      network: { currencyName: 'ETH' } as never,
      toToken: { symbol: 'ETH', logo_url: '' } as never,
      toAmount: '0.173',
      toAmountFiat: '947.27',
      signedTx: '0x02',
      modelValue: true,
      ...props,
    },
    global: {
      stubs: {
        // Blockies need a canvas, which jsdom lacks
        AppAvatar: true,
        AppDialog: {
          template: '<div><slot name="title" /><slot name="content" /></div>',
        },
      },
      mocks: { $t: (k: string) => k },
      directives: { ripple: {} },
    },
  })

const confirmButton = (wrapper: ReturnType<typeof mountReview>) =>
  wrapper.findAll('button').find(b => b.text() === 'verify-tx.confirm')!

describe('EvmTransactionConfirmation', () => {
  it('shows the send summary with truncated addresses and the account name', () => {
    const text = mountReview().text()
    expect(text).toContain('0.173 ETH')
    expect(text).toContain('0xA000...0001')
    expect(text).toContain('Main account')
    expect(text).toContain('0xB000...0002')
  })

  it('tags the selected fee tier and asks the parent to change it', async () => {
    const wrapper = mountReview()
    expect(wrapper.text()).toContain('select_fee.regular.title')

    const feeButton = wrapper
      .findAll('button')
      .find(b => b.text().includes('select_fee.regular.title'))!
    await feeButton.trigger('click')
    expect(wrapper.emitted('edit-fee')).toHaveLength(1)
  })

  it('blocks confirm while the tx is being rebuilt for a new fee tier', () => {
    const wrapper = mountReview({ signedTx: '', feeLoading: true })
    expect(confirmButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('blocks confirm and explains why when the new fee is unaffordable', () => {
    const wrapper = mountReview({ feeError: 'NOT_ENOUGH_BALANCE' })
    expect(confirmButton(wrapper).attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('common.not_enough_balance_to_cover_fee')
  })

  it('enables confirm once a tx is ready and the fee is fine', () => {
    const wrapper = mountReview()
    expect(confirmButton(wrapper).attributes('disabled')).toBeUndefined()
  })
})
