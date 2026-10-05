import { describe, it, expect, vi, afterEach } from 'vitest'
import { ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const stub = (name: string) => ({ default: { name, template: '<div />' } })
vi.mock('@/modules/access/components/NetworkChips.vue', () =>
  stub('NetworkChips'),
)
vi.mock('@/modules/access/components/WalletTabs.vue', () => stub('WalletTabs'))
vi.mock('@/modules/access/components/AccessSignUp.vue', () =>
  stub('AccessSignUp'),
)
vi.mock('@/modules/access/components/AccessDownloadMobile.vue', () =>
  stub('AccessDownloadMobile'),
)
vi.mock('@/modules/access/ModuleAccessKeystore.vue', () => stub('Keystore'))
vi.mock('@/modules/access/ModuleAccessPrivateKey.vue', () => stub('PrivateKey'))
vi.mock('@/modules/access/ModuleAccessMnemonic.vue', () => stub('Mnemonic'))
vi.mock('@/modules/access/ModuleAccessHardwareWallet.vue', () => stub('Hw'))
vi.mock('@/modules/access/ModuleAccessWalletConnect.vue', () => stub('Wc'))
vi.mock('@/modules/access/ModuleAccessWeb3Wallet.vue', () => stub('Web3'))
vi.mock('@/modules/access/ModuleAccessAddressSaved.vue', () => stub('Saved'))
vi.mock('@/components/AppNeedHelp.vue', () => stub('AppNeedHelp'))
vi.mock('@/components/AppDialog.vue', () => ({
  default: {
    name: 'AppDialog',
    template: '<div><slot name="title" /><slot name="content" /></div>',
  },
}))
vi.mock('@/composables/useWalletFlowRoute', () => ({
  useWalletFlowUrlSync: () => {},
}))
vi.mock('pinia', async orig => ({
  ...(await orig<typeof import('pinia')>()),
  storeToRefs: (store: unknown) => store,
}))

const currentView = ref('default')
const isOpenAccessDialog = ref(true)
const setCurrentView = vi.fn((view: string) => {
  currentView.value = view
})
const closeAccessDialog = vi.fn()
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({
    currentView,
    isOpenAccessDialog,
    clickedWeb3Wallet: ref(undefined),
    addressSavedInfo: ref(null),
    connectAddressInfo: ref(null),
    selectedChain: ref(null),
    setCurrentView,
    setSelectedChain: vi.fn(),
    closeAccessDialog,
  }),
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ selectedChain: ref(null) }),
}))
vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: () => ({ setSelectedNetwork: vi.fn() }),
}))

const { default: ModuleAccessWallet } =
  await import('@/modules/access/ModuleAccessWallet.vue')
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

let wrapper: VueWrapper | undefined
const mountAt = (view: string) => {
  currentView.value = view
  isOpenAccessDialog.value = true
  setCurrentView.mockClear()
  closeAccessDialog.mockClear()
  wrapper = mount(ModuleAccessWallet, {
    global: { plugins: [i18n], stubs: { AppAvatar: true } },
  })
  return wrapper
}
afterEach(() => wrapper?.unmount())

const back = (w: VueWrapper) => w.find('button[aria-label="common.back"]')
const title = (w: VueWrapper) => w.get('h1').text()

describe('ModuleAccessWallet header', () => {
  it('hides back on the wallet chooser and shows the login title', () => {
    const w = mountAt('default')
    expect(back(w).exists()).toBe(false)
    expect(title(w)).toBe('access_wallet.login_title')
  })

  it('goes back from sign-up to the chooser', async () => {
    const w = mountAt('sign_up')
    expect(title(w)).toBe('access_wallet.login_title')
    await back(w).trigger('click')
    expect(setCurrentView).toHaveBeenCalledWith('default')
  })

  it('goes back from the download screen to sign-up', async () => {
    const w = mountAt('download_mobile')
    expect(title(w)).toBe('access_wallet.download_mobile.title')
    await back(w).trigger('click')
    expect(setCurrentView).toHaveBeenCalledWith('sign_up')
  })

  it('closes like the backdrop does, without resetting the add-account intent', async () => {
    const w = mountAt('sign_up')
    await w.get('button[aria-label="common.close"]').trigger('click')
    expect(isOpenAccessDialog.value).toBe(false)
    expect(setCurrentView).toHaveBeenCalledWith('default')
    expect(closeAccessDialog).not.toHaveBeenCalled()
  })
})
