import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const h = vi.hoisted(() => ({
  wallet: null as unknown as { value: unknown },
}))

vi.mock('@/stores/walletStore', async () => {
  const { ref } = await import('vue')
  h.wallet = ref(null)
  return { useWalletStore: () => ({ wallet: h.wallet }) }
})
vi.mock('@/stores/chainsStore', async () => {
  const { ref } = await import('vue')
  const selectedChain = ref({ name: 'ETHEREUM', chainID: '1', type: 'EVM' })
  return { useChainsStore: () => ({ selectedChain }) }
})
// The real stores reach the hardware-wallet configs, which Vitest can't load.
vi.mock('@/stores/watchOnlyStore', () => ({ useWatchOnlyStore: () => ({}) }))
vi.mock('@/stores/tradeOrdersStore', () => ({
  useTradeOrdersStore: () => ({ addTransaction: vi.fn() }),
}))
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: vi.fn() }),
}))
vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({ formatFiat: () => ({ display: '' }) }),
}))
vi.mock('@/analytics', () => ({
  analytics: {
    trackSendEvent: vi.fn(),
    trackSendEventStatus: vi.fn(),
    trackSendErrorEvent: vi.fn(),
  },
  SendEvent: {},
  SendEventStatus: {},
  SendEventError: {},
}))
vi.mock('@sentry/vue', () => ({ captureException: vi.fn() }))
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return { ...actual, useI18n: () => ({ t: (k: string) => k }) }
})
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  return { ...actual, storeToRefs: (store: Record<string, unknown>) => store }
})

import EvmTransactionConfirmation from '@/modules/send/components/EvmTransactionConfirmation.vue'

const slotOnly = { template: '<div><slot /></div>' }
const empty = { template: '<div />' }
const stubs = {
  AppModal: slotOnly,
  ExpandTransition: slotOnly,
  AppBaseButton: {
    emits: ['click'],
    template: '<button @click="$emit(\'click\')"><slot /></button>',
  },
  AppContentGroup: empty,
  AppAvatar: empty,
  AppDivider: empty,
  AppTokenLogo: empty,
  AppSelectTxFee: empty,
}

const APPROVE_MESSAGE = 'send.approve-tx-on-device'

const PROPS = {
  toAddress: '0x2222222222222222222222222222222222222222',
  fromAddress: '0x1111111111111111111111111111111111111111',
  networkFeeUSD: '0.1',
  networkFeeCrypto: '0.0001',
  network: null,
  toToken: { symbol: 'ETH' },
  toAmount: '0.1',
  toAmountFiat: '300',
  signedTx: '0x02',
}

/** Press Confirm with a wallet of `walletType` whose signature never arrives. */
const confirmWith = async (walletType: string) => {
  h.wallet.value = {
    getWalletType: () => walletType,
    SignTransaction: () => new Promise(() => {}),
  }
  const w = mount(EvmTransactionConfirmation, {
    props: PROPS as never,
    global: { stubs, mocks: { $t: (k: string) => k } },
  })
  await w.find('button').trigger('click')
  await flushPromises()
  return w
}

describe('EvmTransactionConfirmation while the wallet signs', () => {
  beforeEach(() => {
    h.wallet.value = null
  })

  it('asks the user to approve on a wallet that has its own approval step', async () => {
    const w = await confirmWith('LEDGER')

    expect(w.text()).toContain(APPROVE_MESSAGE)
  })

  it('shows no such message for a Privy wallet, which has nothing outside the app to approve on', async () => {
    const w = await confirmWith('PRIVY')

    expect(w.text()).not.toContain(APPROVE_MESSAGE)
  })

  it('has a Privy wallet sign on confirm and broadcasts the signed bytes through MEW', async () => {
    const wallet = {
      getWalletType: () => 'PRIVY',
      SignTransaction: vi.fn(async () => ({ signed: '0xsigned' })),
      broadcastTransaction: vi.fn(async () => '0xhash'),
      SendTransaction: vi.fn(),
    }
    h.wallet.value = wallet
    const w = mount(EvmTransactionConfirmation, {
      props: PROPS as never,
      global: { stubs, mocks: { $t: (k: string) => k } },
    })

    await w.find('button').trigger('click')
    await flushPromises()

    expect(wallet.SignTransaction).toHaveBeenCalledWith('0x02')
    expect(wallet.broadcastTransaction).toHaveBeenCalledWith('0xsigned')
    expect(wallet.SendTransaction).not.toHaveBeenCalled()
    expect(w.emitted('tx-sent')).toEqual([['0xhash']])
  })
})
