import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const VALID_PHRASE =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
const ETH = {
  name: 'ETHEREUM',
  nameLong: 'Ethereum',
  type: 'EVM',
  chainID: '1',
  currencyName: 'ETH',
}

const h = vi.hoisted(() => ({
  setWallet: vi.fn(),
  addWallet: vi.fn(),
  setSelectedNetwork: vi.fn(),
  closeAccessDialog: vi.fn(),
  setSelectedChain: vi.fn(),
  fetchNativeBalances: vi.fn(),
  track: vi.fn(),
  getWallet: vi.fn(),
}))
const accessStep = ref(1)
const selectedChain = ref<typeof ETH | null>(ETH)
const selectedDerivation = ref({
  label: 'Ethereum',
  path: "m/44'/60'/0'/0",
  type: 'EVM',
})

vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({
    accessStep,
    selectedChain,
    setSelectedChain: h.setSelectedChain,
    closeAccessDialog: h.closeAccessDialog,
  }),
}))
vi.mock('@/stores/derivationStore', () => ({
  useDerivationStore: () => ({
    selectedDerivation,
    setSelectedDerivation: (path: typeof selectedDerivation.value) => {
      selectedDerivation.value = path
    },
  }),
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ chains: ref([ETH]) }),
}))
vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => ({ setWallet: h.setWallet }),
}))
vi.mock('@/stores/recentWalletsStore', () => ({
  useRecentWalletsStore: () => ({ addWallet: h.addWallet }),
}))
vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: () => ({ setSelectedNetwork: h.setSelectedNetwork }),
}))
vi.mock('pinia', async orig => ({
  ...(await orig<typeof import('pinia')>()),
  storeToRefs: (store: unknown) => store,
}))
vi.mock('@/analytics', () => ({
  analytics: { trackConnectWalletEvent: h.track },
  ConnectWalletEvent: { SUCCESS: 'success' },
}))
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WALLET_TYPES: { MNEMONIC: 'mnemonic' },
  walletConfigs: { mnemonic: { id: 'mnemonic', type: ['software'] } },
}))
vi.mock('@/modules/access/common/bip44', () => ({
  default: {
    mnemonic: [
      { label: 'Ethereum', path: "m/44'/60'/0'/0", type: 'EVM' },
      { label: 'Ledger', path: "m/44'/60'/0'", type: 'EVM' },
    ],
  },
}))
vi.mock('@/providers/ethereum/mnemonicToWallet', () => ({
  default: class {
    getWallet = h.getWallet
  },
}))
vi.mock('@/providers/bitcoin/mnemonicToBitcoinWallet', () => ({
  default: class {
    static getSupportedPaths = () => []
    getWallet = h.getWallet
  },
}))
vi.mock('@/composables/useNativeBalances', () => ({
  fetchNativeBalances: h.fetchNativeBalances,
  formatNativeBalance: (raw: string) => raw,
}))
vi.mock('@/components/avatar/AppAvatar.vue', () => ({
  default: { template: '<span />' },
}))

const { default: ModuleAccessMnemonic } =
  await import('@/modules/access/ModuleAccessMnemonic.vue')
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

const address = (i: number) => `0x${String(i).padStart(40, 'a')}`

let wrapper: VueWrapper | undefined
const mountIt = () => {
  wrapper = mount(ModuleAccessMnemonic, {
    attachTo: document.body,
    global: {
      plugins: [i18n],
      stubs: { AccessHelpFooter: true, teleport: true },
    },
  })
  return wrapper
}
const toStep2 = async (w: VueWrapper) => {
  await w.get('textarea').setValue(VALID_PHRASE)
  await w.get('[data-testid="phrase-continue"]').trigger('click')
  await flushPromises()
}
const rows = (w: VueWrapper) => w.findAll('[data-testid="address-row"]')

beforeEach(() => {
  accessStep.value = 1
  Object.values(h).forEach(fn => fn.mockReset())
  h.getWallet.mockImplementation(async (i: number) => ({
    getAddress: async () => address(i),
  }))
  h.fetchNativeBalances.mockImplementation(
    async (_chain: unknown, addresses: string[]) =>
      new Map(addresses.map(a => [a.toLowerCase(), '0.42'])),
  )
})
afterEach(() => {
  wrapper?.unmount()
  vi.useRealTimers()
})

describe('ModuleAccessMnemonic', () => {
  it('keeps Continue disabled and flags an invalid phrase', async () => {
    vi.useFakeTimers()
    const w = mountIt()
    await w.get('textarea').setValue('not a real phrase')
    expect(
      w.get('[data-testid="phrase-continue"]').attributes('disabled'),
    ).toBeDefined()
    await vi.advanceTimersByTimeAsync(2100)
    expect(w.text()).toContain('access_wallet.advanced.invalid_phrase')
  })

  it('shows the passphrase input when the toggle is on', async () => {
    const w = mountIt()
    expect(w.findAll('input[type="password"]')).toHaveLength(0)
    await w.get('[role="switch"]').trigger('click')
    expect(w.findAll('input[type="password"]')).toHaveLength(1)
  })

  it('moves to step 2 and lists derived addresses with balances', async () => {
    const w = mountIt()
    await toStep2(w)
    expect(accessStep.value).toBe(2)
    expect(rows(w)).toHaveLength(5)
    expect(w.text()).toContain('0.42 ETH')
    expect(h.fetchNativeBalances).toHaveBeenCalledTimes(1)
  })

  it('appends five more addresses on "Show more"', async () => {
    const w = mountIt()
    await toStep2(w)
    await w.get('[data-testid="show-more"]').trigger('click')
    await flushPromises()
    expect(rows(w)).toHaveLength(10)
    expect(h.getWallet).toHaveBeenLastCalledWith(9)
  })

  it('surfaces a balance failure and retries it', async () => {
    h.fetchNativeBalances.mockRejectedValueOnce(new Error('429'))
    const w = mountIt()
    await toStep2(w)
    expect(rows(w)).toHaveLength(5)
    expect(w.find('[data-testid="balances-error"]').exists()).toBe(true)
    expect(
      w.get('[data-testid="phrase-connect"]').attributes('disabled'),
    ).toBeUndefined()
    await w.get('[data-testid="balances-retry"]').trigger('click')
    await flushPromises()
    expect(w.find('[data-testid="balances-error"]').exists()).toBe(false)
    expect(w.text()).toContain('0.42 ETH')
  })

  it('connects the selected address', async () => {
    const w = mountIt()
    await toStep2(w)
    await rows(w)[2].trigger('click')
    await w.get('[data-testid="phrase-connect"]').trigger('click')
    await flushPromises()
    expect(h.getWallet).toHaveBeenLastCalledWith(2)
    expect(h.setWallet).toHaveBeenCalledTimes(1)
    expect(h.closeAccessDialog).toHaveBeenCalled()
  })
})
