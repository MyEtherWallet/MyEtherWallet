import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'

// The perps modules pull the wallet configs, which load Ledger.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

const USER = '0x717ba71d4ea77d1b7c49a913c28c0bd538eecd41'

const getAddressBook = vi.fn()
const getAddressBookChallenge = vi.fn()
const completeAddressBookChallenge = vi.fn()
vi.mock('@/modules/perps/configs', () => ({
  USDC_DECIMALS: { 1: 6 },
  PERPS_CHAIN_ID: '1',
  perpsClient: {
    getAddressBook: (...args: unknown[]) => getAddressBook(...args),
    getAddressBookChallenge: (...args: unknown[]) =>
      getAddressBookChallenge(...args),
    completeAddressBookChallenge: (...args: unknown[]) =>
      completeAddressBookChallenge(...args),
    getAccount: vi.fn(async () => ({ result: { withdrawalFeeUSD: '1' } })),
    withdraw: vi.fn(),
  },
}))

vi.mock('@/modules/perps/composables/usePerpsAuth', () => ({
  usePerpsAuth: () => ({ accountId: ref('acc-1'), startPostTxPoll: vi.fn() }),
  usePerpsBalance: () => ({ balance: ref({ withdrawableMargin: '100' }) }),
}))
vi.mock('@/modules/perps/composables/usePerpsPositions', () => ({
  usePerpsPositions: () => ({ positions: ref([]) }),
}))

const toastWithdrawalAddressAdded = vi.fn()
vi.mock('@/modules/perps/composables/usePerpsToasts', () => ({
  usePerpsToasts: () => ({
    toastWithdrawalAddressAdded,
    toastWithdrawalComplete: vi.fn(),
  }),
}))

vi.mock('@/modules/perps/sentry', () => ({ capturePerps: vi.fn() }))

vi.mock('@/analytics', () => ({
  analytics: {
    trackPerpsWithdrawEvent: vi.fn(),
    trackPerpsWithdrawErrorEvent: vi.fn(),
    trackPerpsWithdrawAuthorizeEvent: vi.fn(),
    trackPerpsWithdrawAuthorizeErrorEvent: vi.fn(),
  },
  PerpsWithdrawEvent: {},
  PerpsWithdrawAuthorizeEvent: {},
}))

const SignMessage = vi.fn()
const wallet = ref({ getAddress: async () => USER, SignMessage })
vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => ({ wallet }),
}))
// Reads the chains store to pick the checksum rules; not what is under test.
vi.mock('@/utils/addressUtils', () => ({
  toChecksumAddress: (address: string) => address,
}))
vi.mock('pinia', async importOriginal => ({
  ...(await importOriginal<typeof import('pinia')>()),
  storeToRefs: (store: Record<string, unknown>) => store,
}))
vi.mock('vue-i18n', async importOriginal => ({
  ...(await importOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (key: string) => key }),
}))

import PerpsWithdrawDialog from '@/modules/perps/components/PerpsWithdrawDialog.vue'

const ButtonStub = defineComponent({
  name: 'AppBaseButton',
  props: ['disabled', 'isLoading'],
  emits: ['click'],
  template: '<button @click="$emit(\'click\')"><slot /></button>',
})
const BannerStub = defineComponent({
  name: 'AppBanner',
  props: ['type', 'description'],
  template: '<div />',
})

const mountDialog = () =>
  mount(PerpsWithdrawDialog, {
    props: { visible: false },
    global: {
      mocks: { $t: (key: string) => key },
      stubs: {
        AppModal: { template: '<div><slot /></div>' },
        AppBaseButton: ButtonStub,
        AppBanner: BannerStub,
        PerpsAmount: true,
        AppBlockie: true,
      },
    },
  })

type Dialog = ReturnType<typeof mountDialog>

const open = async (dialog: Dialog) => {
  await dialog.setProps({ visible: true })
  await flushPromises()
}
const close = async (dialog: Dialog) => {
  await dialog.setProps({ visible: false })
  await flushPromises()
}
const actionButton = (dialog: Dialog) => dialog.getComponent(ButtonStub)
const errorBanner = (dialog: Dialog) =>
  dialog.findAllComponents(BannerStub).find(b => b.props('type') === 'alert')

// The device (or phone) holds the message until the user acts on it.
const deferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

// Open on an address that is not authorized yet, Authorize — up to the wallet
// holding the message.
const authorizeUpToWallet = async () => {
  const signature = deferred<string>()
  SignMessage.mockReturnValueOnce(signature.promise)
  const dialog = mountDialog()
  await open(dialog)
  expect(actionButton(dialog).text()).toBe('perps.withdraw.authorize-button')
  await actionButton(dialog).trigger('click')
  await vi.waitFor(() => expect(SignMessage).toHaveBeenCalled())
  expect(actionButton(dialog).props('isLoading')).toBe(true)
  return { dialog, signature }
}

describe('PerpsWithdrawDialog — closed while the wallet is pending (MEW-2694)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getAddressBook.mockResolvedValue({ result: { addressBook: [] } })
    getAddressBookChallenge.mockResolvedValue({
      result: { id: 'challenge-1', message: 'authorize me' },
    })
    completeAddressBookChallenge.mockResolvedValue(undefined)
  })

  it('reopens clean: Authorize is not left spinning', async () => {
    const { dialog } = await authorizeUpToWallet()

    await close(dialog)
    await open(dialog)

    expect(actionButton(dialog).text()).toBe('perps.withdraw.authorize-button')
    expect(actionButton(dialog).props('isLoading')).toBe(false)
  })

  it('does not authorize the address with a signature given after the close', async () => {
    const { dialog, signature } = await authorizeUpToWallet()

    await close(dialog)
    signature.resolve('0xlate')
    await flushPromises()

    expect(completeAddressBookChallenge).not.toHaveBeenCalled()
    expect(toastWithdrawalAddressAdded).not.toHaveBeenCalled()
  })

  it('does not authorize the address with a signature given after the page is left', async () => {
    const { dialog, signature } = await authorizeUpToWallet()

    // Navigating away unmounts the dialog while it is still visible.
    dialog.unmount()
    signature.resolve('0xlate')
    await flushPromises()

    expect(completeAddressBookChallenge).not.toHaveBeenCalled()
    expect(toastWithdrawalAddressAdded).not.toHaveBeenCalled()
  })

  it('keeps a late rejection off the reopened dialog', async () => {
    const { dialog, signature } = await authorizeUpToWallet()

    await close(dialog)
    await open(dialog)
    signature.reject(new Error('User rejected the request'))
    await flushPromises()

    expect(errorBanner(dialog)).toBeUndefined()
    expect(actionButton(dialog).props('isLoading')).toBe(false)
  })

  it('still authorizes when the dialog stays open', async () => {
    const { dialog, signature } = await authorizeUpToWallet()

    signature.resolve('0xsig')
    await flushPromises()

    expect(completeAddressBookChallenge).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'challenge-1', signature: '0xsig' }),
    )
    expect(actionButton(dialog).text()).toBe('perps.withdraw.withdraw-button')
  })
})
