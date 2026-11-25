import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'

// The perps modules pull the wallet configs, which load Ledger.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

vi.mock('@/modules/perps/configs', () => ({
  IS_PERPS_LIVE: true,
  USDC_ADDRESS: { 1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
  USDC_DECIMALS: { 1: 6 },
  perpsClient: {
    listDepositAddresses: vi.fn(async () => ({
      result: [{ address: '0x1111111111111111111111111111111111111111' }],
    })),
  },
}))

const startPostTxPoll = vi.fn()
vi.mock('@/modules/perps/composables/usePerpsAuth', () => ({
  usePerpsAuth: () => ({ accountId: ref('acc-1'), startPostTxPoll }),
}))

const toasts = {
  toastDepositInitiated: vi.fn(),
  toastDepositComplete: vi.fn(),
  toastDepositCanceled: vi.fn(),
  toastFailedToCreditAccount: vi.fn(),
  toastFailedToInitiateDeposit: vi.fn(),
}
vi.mock('@/modules/perps/composables/usePerpsToasts', () => ({
  usePerpsToasts: () => toasts,
}))

vi.mock('@/modules/perps/sentry', () => ({ capturePerps: vi.fn() }))

vi.mock('@/analytics', () => ({
  analytics: {
    trackPerpsDepositEvent: vi.fn(),
    trackPerpsDepositErrorEvent: vi.fn(),
  },
  PerpsDepositEvent: {},
}))

// The device (or phone) holds the transaction until the user acts on it.
const deferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const SignTransaction = vi.fn()
const SendTransaction = vi.fn()
const broadcastTransaction = vi.fn()
const canSignWithoutSending = vi.fn()
let walletType = 'LEDGER'
const wallet = ref({
  getAddress: async () => '0x717ba71d4ea77d1b7c49a913c28c0bd538eecd41',
  getGasFee: async () => ({ quoteId: 'q1', fees: { REGULAR: {} } }),
  getSignableTransaction: async () => ({ serialized: '0xunsigned' }),
  getWalletType: () => walletType,
  SignTransaction,
  SendTransaction,
  broadcastTransaction,
  canSignWithoutSending,
})

vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => ({
    wallet,
    getTokenBalance: () => ({
      balance: '500',
      balanceWei: '500000000',
      decimals: 6,
    }),
  }),
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({
    selectedChain: ref({ name: 'ETHEREUM' }),
    chains: ref([]),
  }),
}))
vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: () => ({
    gasPriceType: ref('REGULAR'),
    setSelectedNetwork: vi.fn(),
  }),
}))
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: vi.fn() }),
}))
vi.mock('pinia', async importOriginal => ({
  ...(await importOriginal<typeof import('pinia')>()),
  storeToRefs: (store: Record<string, unknown>) => store,
}))

import PerpsDepositDialog from '@/modules/perps/components/PerpsDepositDialog.vue'

const AmountStub = defineComponent({
  name: 'AppEnterAmount',
  props: ['amount', 'error'],
  emits: ['update:amount'],
  template: '<div />',
})
const ButtonStub = defineComponent({
  name: 'AppBaseButton',
  props: ['disabled', 'isLoading'],
  emits: ['click'],
  template: '<button @click="$emit(\'click\')"><slot /></button>',
})
const BannerStub = defineComponent({
  name: 'AppBanner',
  props: ['description'],
  template: '<div />',
})

const mountDialog = () =>
  mount(PerpsDepositDialog, {
    props: { modelValue: false },
    global: {
      mocks: { $t: (key: string) => key },
      stubs: {
        AppModal: { template: '<div><slot /></div>' },
        AppEnterAmount: AmountStub,
        AppBaseButton: ButtonStub,
        AppBanner: BannerStub,
        AppTokenLogo: true,
        AppBlockie: true,
        AppBtnCopy: true,
        AppChip: true,
        AppIcon: true,
        QrcodeVue: true,
      },
    },
  })

vi.mock('vue-i18n', async importOriginal => ({
  ...(await importOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (key: string) => key }),
}))

type Dialog = ReturnType<typeof mountDialog>

const open = async (dialog: Dialog) => {
  await dialog.setProps({ modelValue: true })
  await flushPromises()
}
const close = async (dialog: Dialog) => {
  await dialog.setProps({ modelValue: false })
  await flushPromises()
}
const enterAmount = async (dialog: Dialog, amount: string) => {
  dialog.getComponent(AmountStub).vm.$emit('update:amount', amount)
  await flushPromises()
}
const depositButton = (dialog: Dialog) => dialog.getComponent(ButtonStub)

// Open, type an amount, Deposit — up to the wallet holding the transaction.
const depositUpToWallet = async (waitFor: ReturnType<typeof vi.fn>) => {
  const dialog = mountDialog()
  await open(dialog)
  await enterAmount(dialog, '10')
  await depositButton(dialog).trigger('click')
  await vi.waitFor(() => expect(waitFor).toHaveBeenCalled())
  expect(depositButton(dialog).props('isLoading')).toBe(true)
  return dialog
}

describe('PerpsDepositDialog — closed while the wallet is pending (MEW-2694)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    walletType = 'LEDGER'
    broadcastTransaction.mockResolvedValue('0xhash')
    canSignWithoutSending.mockResolvedValue(false)
  })

  it('reopens clean: no spinner, no amount', async () => {
    SignTransaction.mockReturnValue(deferred().promise)
    const dialog = await depositUpToWallet(SignTransaction)

    await close(dialog)
    await open(dialog)

    expect(depositButton(dialog).props('isLoading')).toBe(false)
    expect(dialog.getComponent(AmountStub).props('amount')).toBe('')
  })

  it('never broadcasts a transaction the device signs after the close', async () => {
    const device = deferred<{ signed: string }>()
    SignTransaction.mockReturnValue(device.promise)
    const dialog = await depositUpToWallet(SignTransaction)

    await close(dialog)
    device.resolve({ signed: '0xsigned' })
    await flushPromises()

    expect(broadcastTransaction).not.toHaveBeenCalled()
    expect(toasts.toastDepositInitiated).not.toHaveBeenCalled()
    expect(startPostTxPoll).not.toHaveBeenCalled()
  })

  it('keeps a late rejection off the reopened dialog', async () => {
    const device = deferred<{ signed: string }>()
    SignTransaction.mockReturnValue(device.promise)
    const dialog = await depositUpToWallet(SignTransaction)

    await close(dialog)
    await open(dialog)
    await enterAmount(dialog, '25')
    device.reject(new Error('User rejected the request'))
    await flushPromises()

    expect(dialog.findComponent(BannerStub).exists()).toBe(false)
    expect(toasts.toastDepositCanceled).not.toHaveBeenCalled()
    expect(dialog.getComponent(AmountStub).props('amount')).toBe('25')
  })

  it('leaves a reopened dialog alone when a self-broadcasting wallet answers late', async () => {
    walletType = 'WAGMI'
    const phone = deferred<string>()
    SendTransaction.mockReturnValue(phone.promise)
    const dialog = await depositUpToWallet(SendTransaction)

    await close(dialog)
    await open(dialog)
    await enterAmount(dialog, '25')
    phone.resolve('0xhash')
    await flushPromises()

    // Still open, with what the user typed since.
    expect(dialog.emitted('update:modelValue')).toBeUndefined()
    expect(dialog.getComponent(AmountStub).props('amount')).toBe('25')
    expect(toasts.toastDepositInitiated).not.toHaveBeenCalled()
  })

  it('never broadcasts what a sign-only WalletConnect wallet signs after the close', async () => {
    walletType = 'WAGMI'
    canSignWithoutSending.mockResolvedValue(true)
    const phone = deferred<{ signed: string }>()
    SignTransaction.mockReturnValue(phone.promise)
    const dialog = await depositUpToWallet(SignTransaction)

    await close(dialog)
    phone.resolve({ signed: '0xsigned' })
    await flushPromises()

    expect(broadcastTransaction).not.toHaveBeenCalled()
    expect(SendTransaction).not.toHaveBeenCalled()
    expect(toasts.toastDepositInitiated).not.toHaveBeenCalled()
  })

  it('never broadcasts what the device signs after the page is left', async () => {
    const device = deferred<{ signed: string }>()
    SignTransaction.mockReturnValue(device.promise)
    const dialog = await depositUpToWallet(SignTransaction)

    // Navigating away unmounts the dialog while it is still open.
    dialog.unmount()
    device.resolve({ signed: '0xsigned' })
    await flushPromises()

    expect(broadcastTransaction).not.toHaveBeenCalled()
    expect(toasts.toastDepositInitiated).not.toHaveBeenCalled()
    expect(startPostTxPoll).not.toHaveBeenCalled()
  })

  it('still completes a deposit when the dialog stays open', async () => {
    SignTransaction.mockResolvedValue({ signed: '0xsigned' })
    const dialog = mountDialog()
    await open(dialog)
    await enterAmount(dialog, '10')
    await depositButton(dialog).trigger('click')
    await flushPromises()

    expect(broadcastTransaction).toHaveBeenCalledWith('0xsigned')
    expect(toasts.toastDepositInitiated).toHaveBeenCalledOnce()
    expect(dialog.emitted('update:modelValue')).toEqual([[false]])
  })
})
