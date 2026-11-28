import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'

type FakeWallet = { getWalletType: () => string } | null

// Refs the mocked stores hand out, so a test can change what is connected.
// storeToRefs is stubbed to a passthrough below.
const h = await vi.hoisted(async () => {
  const { ref } = await import('vue')
  return {
    wallet: ref<FakeWallet>(null),
    walletAddress: ref<string | null>(null),
    isWatchOnly: ref(false),
    selectedChain: ref({
      name: 'ETHEREUM',
      type: 'EVM',
      blockExplorerAddr: 'https://explorer.example/[[address]]',
    }),
    disconnectWallet: vi.fn(),
    endLoginFor: vi.fn(),
    removeWallet: vi.fn(),
    perpsLogout: vi.fn(),
  }
})

vi.mock('@/stores/walletStore', async () => {
  const { ref, computed } = await import('vue')
  return {
    useWalletStore: () => ({
      wallet: h.wallet,
      tokens: ref([]),
      walletAddress: h.walletAddress,
      isWalletConnected: computed(
        () => h.wallet.value !== null && h.walletAddress.value !== null,
      ),
      formattedBalance: ref('0'),
      formattedTotalFiatPortfolioValue: ref('$0.00'),
      safeMainTokenBalance: ref(null),
      isLoadingBalances: ref(false),
      walletCardWasAnimated: ref(true),
      isWatchOnly: h.isWatchOnly,
      setTokens: vi.fn(),
      setIsLoadingBalances: vi.fn(),
      disconnectWallet: h.disconnectWallet,
    }),
  }
})
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ selectedChain: h.selectedChain }),
}))
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: vi.fn() }),
}))
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({
    openAccessDialog: vi.fn(),
    openAccessDialogOn: vi.fn(),
  }),
}))
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({ endLoginFor: h.endLoginFor }),
}))
vi.mock('@/stores/watchOnlyStore', () => ({
  useWatchOnlyStore: () => ({ removeWallet: h.removeWallet }),
}))
vi.mock('@/modules/perps/composables/usePerpsAuth', () => ({
  usePerpsAuth: () => ({ logout: h.perpsLogout }),
}))
vi.mock('@/modules/access/common/accessViews', () => ({
  addressStepFor: () => null,
}))
vi.mock('@/composables/useImageContrastTextColor', async () => {
  const { ref } = await import('vue')
  return {
    useImageContrastTextColor: () => ({
      textColor: ref('#fff'),
      isDynamic: ref(false),
      sampleFromUrl: vi.fn(),
    }),
  }
})
vi.mock('@/utils/balanceHandler', () => ({ default: vi.fn() }))
vi.mock('@/analytics', () => ({
  analytics: {
    trackConnectWalletEvent: vi.fn(),
    trackSelectNewAddressEvent: vi.fn(),
  },
  ConnectWalletEvent: {},
  SelectNewAddressEvent: 'select_new_address',
}))
vi.mock('@sentry/vue', () => ({ captureException: vi.fn() }))
vi.mock('animejs', () => ({ animate: vi.fn() }))
// The menu and the paper wallet have their own concerns: the menu only has
// to show what it holds.
vi.mock('@/components/AppPopUpMenu.vue', () => ({
  default: {
    name: 'AppPopUpMenu',
    template:
      '<div><slot name="menu-button" :toggle-menu="() => {}" /><slot name="menu-content" /></div>',
  },
}))
vi.mock('@/components/core_layouts/wallet/ThePaperWallet.vue', () => ({
  default: { name: 'ThePaperWallet', template: '<div />' },
}))
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return { ...actual, useI18n: () => ({ t: (key: string) => key }) }
})
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  return { ...actual, storeToRefs: (store: Record<string, unknown>) => store }
})

import AppWalletCard from '@/components/AppWalletCard.vue'

// The mocked stores are shared refs: a component left mounted by one test
// would react to the next test's changes.
enableAutoUnmount(afterEach)

const PRIVY_ADDRESS = '0x1111111111111111111111111111111111111111'
const OTHER_ADDRESS = '0x2222222222222222222222222222222222222222'

const render = () =>
  mount(AppWalletCard, {
    global: {
      mocks: { $t: (key: string) => key },
      stubs: { AppIcon: true, AppDivider: true, IconWatchOnly: true },
    },
  })
/** Press "Disconnect and delete wallet" (or its watch-only wording). */
const pressDelete = async (w: ReturnType<typeof render>) => {
  const item = w.findAll('li').find(li => li.text().includes('delete'))
  expect(item).toBeDefined()
  await item!.trigger('click')
  await flushPromises()
}

describe('AppWalletCard, deleting the wallet it shows', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    h.wallet.value = { getWalletType: () => 'PRIVY' }
    h.walletAddress.value = PRIVY_ADDRESS
    h.isWatchOnly.value = false
    h.endLoginFor.mockResolvedValue(undefined)
    h.perpsLogout.mockResolvedValue(undefined)
  })

  it('deletes the address it showed, not the one the wallet fell back to while the login was ended', async () => {
    // Ending a Privy login leaves the wallet watch-only. When the Privy
    // address is not among the saved ones (the list was full), that falls
    // back to another saved address, which nobody asked to delete.
    h.endLoginFor.mockImplementation(async () => {
      h.wallet.value = { getWalletType: () => 'LEDGER' }
      h.walletAddress.value = OTHER_ADDRESS
      h.isWatchOnly.value = true
    })
    const chain = h.selectedChain.value
    const w = render()

    await pressDelete(w)

    expect(h.endLoginFor).toHaveBeenCalledWith(PRIVY_ADDRESS)
    expect(h.removeWallet.mock.calls).toEqual([[PRIVY_ADDRESS, chain]])
    // The address now on the card is another one: it stays connected.
    expect(h.disconnectWallet).not.toHaveBeenCalled()
    expect(h.perpsLogout).toHaveBeenCalledTimes(1)
    expect(w.emitted('close')).toBeTruthy()
  })

  it('disconnects once the address is deleted, when it is still the one on the card', async () => {
    // The usual case: the same address, watch-only, after the login ended.
    h.endLoginFor.mockImplementation(async () => {
      h.isWatchOnly.value = true
    })
    const w = render()

    await pressDelete(w)

    expect(h.removeWallet).toHaveBeenCalledWith(
      PRIVY_ADDRESS,
      h.selectedChain.value,
    )
    expect(h.disconnectWallet).toHaveBeenCalledTimes(1)
    expect(w.emitted('close')).toBeTruthy()
  })

  it('ends no login for a wallet that is not a Privy one, and deletes and disconnects it', async () => {
    h.wallet.value = { getWalletType: () => 'LEDGER' }
    const w = render()

    await pressDelete(w)

    expect(h.endLoginFor).not.toHaveBeenCalled()
    expect(h.removeWallet).toHaveBeenCalledWith(
      PRIVY_ADDRESS,
      h.selectedChain.value,
    )
    expect(h.disconnectWallet).toHaveBeenCalledTimes(1)
  })
})
