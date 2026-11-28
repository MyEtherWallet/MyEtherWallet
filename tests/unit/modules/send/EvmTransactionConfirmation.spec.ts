import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'

const h = vi.hoisted(() => ({
  addTransaction: vi.fn(),
  addToastMessage: vi.fn(),
  wallet: { value: null as unknown },
}))

vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => ({ wallet: h.wallet }),
}))
vi.mock('@/stores/watchOnlyStore', () => ({ useWatchOnlyStore: () => ({}) }))
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: h.addToastMessage }),
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ selectedChain: ref({ nameLong: 'Ethereum' }) }),
}))
vi.mock('@/stores/tradeOrdersStore', () => ({
  useTradeOrdersStore: () => ({ addTransaction: h.addTransaction }),
}))
vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({ formatFiat: (v: unknown) => ({ display: String(v) }) }),
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
vi.mock('vue-i18n', async importOriginal => ({
  ...(await importOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (k: string) => k }),
}))
vi.mock('pinia', async importOriginal => ({
  ...(await importOriginal<typeof import('pinia')>()),
  storeToRefs: (store: Record<string, unknown>) => store,
}))

import EvmTransactionConfirmation from '@/modules/send/components/EvmTransactionConfirmation.vue'
import { WalletType } from '@/providers/types'

const AppModal = {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: '<div v-if="modelValue"><slot /></div>',
}
const AppBaseButton = {
  name: 'AppBaseButton',
  props: ['disabled', 'isLoading'],
  emits: ['click'],
  template: '<button @click="$emit(\'click\')"><slot /></button>',
}

// WalletConnect: the request waits on the phone until the user acts on it.
const deferred = () => {
  let resolve!: (hash: string) => void
  const promise = new Promise<string>(r => (resolve = r))
  return { promise, resolve }
}

const mountReview = async () => {
  const w = mount(EvmTransactionConfirmation, {
    props: {
      modelValue: false,
      toAddress: '0x2222222222222222222222222222222222222222',
      fromAddress: '0x1111111111111111111111111111111111111111',
      networkFeeUSD: '1',
      networkFeeCrypto: '0.001',
      network: null,
      toToken: { symbol: 'ETH' } as never,
      toAmount: '0.1',
      toAmountFiat: '300',
      signedTx: '0x02',
    },
    global: {
      stubs: {
        AppModal,
        AppBaseButton,
        AppSelectTxFee: true,
        AppContentGroup: true,
        AppAvatar: true,
        AppDivider: true,
        AppTokenLogo: true,
      },
      mocks: { $t: (k: string) => k },
    },
  })
  // The review only opens on a change of v-model, as when Send opens it.
  await w.setProps({ modelValue: true })
  return w
}

describe('EvmTransactionConfirmation closed while the wallet is pending (MEW-2694)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('drops the wait on close and ignores a signature that lands later', async () => {
    const pending = deferred()
    h.wallet.value = {
      getWalletType: () => WalletType.WAGMI,
      SendTransaction: vi.fn(() => pending.promise),
    }
    const w = await mountReview()
    const confirm = () => w.findComponent(AppBaseButton)

    await confirm().trigger('click')
    expect(confirm().props('isLoading')).toBe(true)
    expect(w.text()).toContain('send.approve-tx-on-device')

    await w.setProps({ modelValue: false })
    await w.setProps({ modelValue: true })
    expect(confirm().props('isLoading')).toBe(false)
    expect(w.text()).not.toContain('send.approve-tx-on-device')

    pending.resolve('0xhash')
    await flushPromises()
    expect(h.addTransaction).not.toHaveBeenCalled()
    expect(w.emitted('tx-sent')).toBeUndefined()
    expect(h.addToastMessage).not.toHaveBeenCalled()
  })

  it('does not broadcast a hardware signature that lands after close', async () => {
    let sign!: (tx: { signed: string }) => void
    const broadcastTransaction = vi.fn(() => Promise.resolve('0xhash'))
    h.wallet.value = {
      getWalletType: () => WalletType.LEDGER,
      SignTransaction: vi.fn(() => new Promise(r => (sign = r))),
      broadcastTransaction,
    }
    const w = await mountReview()

    await w.findComponent(AppBaseButton).trigger('click')
    await w.setProps({ modelValue: false })
    sign({ signed: '0xsigned' })
    await flushPromises()

    expect(broadcastTransaction).not.toHaveBeenCalled()
    expect(w.emitted('tx-sent')).toBeUndefined()
  })

  it('ignores a signature that lands after Send was left altogether', async () => {
    const pending = deferred()
    h.wallet.value = {
      getWalletType: () => WalletType.WAGMI,
      SendTransaction: vi.fn(() => pending.promise),
    }
    const w = await mountReview()

    await w.findComponent(AppBaseButton).trigger('click')
    w.unmount()
    pending.resolve('0xhash')
    await flushPromises()

    expect(h.addTransaction).not.toHaveBeenCalled()
  })

  it('still reports a signature that lands while the review is open', async () => {
    h.wallet.value = {
      getWalletType: () => WalletType.WAGMI,
      SendTransaction: vi.fn(() => Promise.resolve('0xhash')),
    }
    const w = await mountReview()

    await w.findComponent(AppBaseButton).trigger('click')
    await flushPromises()

    expect(h.addTransaction).toHaveBeenCalledOnce()
    expect(w.emitted('tx-sent')).toEqual([['0xhash']])
  })
})

// A WalletConnect wallet whose session offers the sign-only call: it hands the
// signature back and MEW broadcasts, instead of the wallet sending by itself.
describe('EvmTransactionConfirmation with a WalletConnect wallet that signs without sending (MEW-2694)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const walletConnect = (SignTransaction: ReturnType<typeof vi.fn>) => {
    const wallet = {
      getWalletType: () => WalletType.WAGMI,
      canSignWithoutSending: vi.fn(async () => true),
      SignTransaction,
      SendTransaction: vi.fn(),
      broadcastTransaction: vi.fn(() => Promise.resolve('0xhash')),
    }
    h.wallet.value = wallet
    return wallet
  }

  it('never sends a transaction signed on the phone after the review was closed', async () => {
    let signOnPhone!: (tx: { signed: string }) => void
    const wallet = walletConnect(
      vi.fn(() => new Promise(r => (signOnPhone = r))),
    )
    const w = await mountReview()
    const confirm = () => w.findComponent(AppBaseButton)

    await confirm().trigger('click')
    await vi.waitFor(() => expect(wallet.SignTransaction).toHaveBeenCalled())
    expect(confirm().props('isLoading')).toBe(true)

    await w.setProps({ modelValue: false })
    await w.setProps({ modelValue: true })
    expect(confirm().props('isLoading')).toBe(false)

    signOnPhone({ signed: '0xsigned' })
    await flushPromises()

    expect(wallet.broadcastTransaction).not.toHaveBeenCalled()
    expect(wallet.SendTransaction).not.toHaveBeenCalled()
    expect(h.addTransaction).not.toHaveBeenCalled()
    expect(w.emitted('tx-sent')).toBeUndefined()
    expect(h.addToastMessage).not.toHaveBeenCalled()
  })

  it('broadcasts from MEW when the review stays open', async () => {
    const wallet = walletConnect(vi.fn(async () => ({ signed: '0xsigned' })))
    const w = await mountReview()

    await w.findComponent(AppBaseButton).trigger('click')
    await flushPromises()

    expect(wallet.broadcastTransaction).toHaveBeenCalledWith('0xsigned')
    expect(wallet.SendTransaction).not.toHaveBeenCalled()
    expect(h.addTransaction).toHaveBeenCalledOnce()
    expect(w.emitted('tx-sent')).toEqual([['0xhash']])
  })

  it('reports a rejection on the phone as a cancel', async () => {
    const wallet = walletConnect(
      vi.fn(async () =>
        Promise.reject(
          Object.assign(new Error('User rejected the request.'), {
            code: 4001,
          }),
        ),
      ),
    )
    const w = await mountReview()

    await w.findComponent(AppBaseButton).trigger('click')
    await flushPromises()

    expect(h.addToastMessage).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'common.error.user_canceled_request' }),
    )
    expect(wallet.SendTransaction).not.toHaveBeenCalled()
    expect(w.findComponent(AppBaseButton).props('isLoading')).toBe(false)
  })
})
