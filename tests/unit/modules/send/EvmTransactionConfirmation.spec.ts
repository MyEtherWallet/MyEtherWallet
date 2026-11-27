import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { WalletType } from '@/providers/types'

const h = vi.hoisted(() => ({
  wallet: null as unknown as { value: unknown },
}))

const PRE_SIGNED_TX = '0x02000000000101'
const UNSIGNED_TX = '70736274ff01'
const DEVICE_SIGNED_TX = '0x02000000000102'

vi.mock('@/stores/walletStore', async () => {
  const { ref } = await import('vue')
  h.wallet = ref(null)
  return { useWalletStore: () => ({ wallet: h.wallet }) }
})
vi.mock('@/stores/chainsStore', async () => {
  const { ref } = await import('vue')
  const store = {
    selectedChain: ref({ name: 'BITCOIN', type: 'BITCOIN' }),
  }
  return { useChainsStore: () => store }
})
vi.mock('@/stores/tradeOrdersStore', () => ({
  useTradeOrdersStore: () => ({ addTransaction: vi.fn() }),
}))
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: vi.fn() }),
}))
// The real store pulls in the hardware-wallet configs, which Vitest can't load.
vi.mock('@/stores/watchOnlyStore', () => ({ useWatchOnlyStore: () => ({}) }))
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

const stubs = {
  AppModal: { template: '<div><slot /></div>' },
  AppBaseButton: {
    emits: ['click'],
    template: '<button @click="$emit(\'click\')"><slot /></button>',
  },
  AppContentGroup: { template: '<div />' },
  AppAvatar: { template: '<div />' },
  AppDivider: { template: '<div />' },
  AppTokenLogo: { template: '<div />' },
  AppSelectTxFee: { template: '<div />' },
  ExpandTransition: { template: '<div><slot /></div>' },
}

const makeWallet = (walletType: WalletType) => ({
  getWalletType: () => walletType,
  SignTransaction: vi.fn(() => Promise.resolve({ signed: DEVICE_SIGNED_TX })),
  broadcastTransaction: vi.fn(() => Promise.resolve('txid')),
})

const confirmSend = async (signedTx: string) => {
  const wrapper = mount(EvmTransactionConfirmation, {
    props: {
      fromAddress: 'bc1qsender',
      toAddress: 'bc1qrecipient',
      networkFeeUSD: '1',
      networkFeeCrypto: '0.00001',
      network: null,
      toToken: { symbol: 'BTC' } as never,
      toAmount: '0.1',
      toAmountFiat: '5000',
      signedTx,
    },
    global: { stubs, mocks: { $t: (k: string) => k } },
  })
  await wrapper.find('button').trigger('click')
  await flushPromises()
  return wrapper
}

describe('EvmTransactionConfirmation signing', () => {
  beforeEach(() => {
    h.wallet.value = null
  })

  // APP-MEW-WEB-1RV: the Send panel already signs for these wallets, and the
  // Bitcoin signer can't parse its own signed output as a PSBT.
  it.each([WalletType.MNEMONIC, WalletType.PRIVATE_KEY])(
    'broadcasts the pre-signed tx without signing again for %s wallets',
    async walletType => {
      const wallet = makeWallet(walletType)
      h.wallet.value = wallet

      const wrapper = await confirmSend(PRE_SIGNED_TX)

      expect(wallet.SignTransaction).not.toHaveBeenCalled()
      expect(wallet.broadcastTransaction).toHaveBeenCalledWith(PRE_SIGNED_TX)
      expect(wrapper.emitted('tx-sent')).toEqual([['txid']])
    },
  )

  it.each([WalletType.LEDGER, WalletType.TREZOR])(
    'signs on confirm for %s wallets',
    async walletType => {
      const wallet = makeWallet(walletType)
      h.wallet.value = wallet

      await confirmSend(UNSIGNED_TX)

      expect(wallet.SignTransaction).toHaveBeenCalledWith(UNSIGNED_TX)
      expect(wallet.broadcastTransaction).toHaveBeenCalledWith(DEVICE_SIGNED_TX)
    },
  )
})
