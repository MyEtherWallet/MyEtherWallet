import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, reactive, ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia, setActivePinia } from 'pinia'

/**
 * The connect dialog with its REAL store, mounted the way App.vue mounts it
 * (once, closed) and opened the way its callers open it. The header spec
 * drives a mocked store, which cannot show what the store and the dialog do
 * to each other.
 */

const stub = (name: string) => ({ default: { name, template: '<div />' } })
vi.mock('@/analytics', () => ({
  analytics: { trackConnectWalletEvent: vi.fn() },
}))
// The wallet configs reach the hardware-wallet SDK — unavailable under jsdom.
vi.mock('@/modules/access/common/walletConfigs', () => ({}))
vi.mock('@/modules/access/components/NetworkChips.vue', () =>
  stub('NetworkChips'),
)
vi.mock('@/modules/access/components/WalletTabs.vue', () => stub('WalletTabs'))
vi.mock('@/modules/access/components/AccessCreateWallet.vue', () =>
  stub('AccessCreateWallet'),
)
vi.mock('@/modules/access/components/privy/PrivyFlow.vue', () =>
  stub('PrivyFlow'),
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
vi.mock('@/components/divider/AppDivider.vue', () => stub('AppDivider'))
// AppModal teleports and locks the page; stub its contract: content only
// while open, back emits `back`, close flips v-model and then emits `close`.
vi.mock('@/components/modal/AppModal.vue', () => ({
  default: {
    name: 'AppModal',
    props: ['modelValue', 'title', 'showBackButton', 'persistent', 'ariaLabel'],
    emits: ['update:modelValue', 'back', 'close'],
    template: `<div v-if="modelValue">
      <button v-if="showBackButton" aria-label="common.back" @click="$emit('back')" />
      <button aria-label="common.close" @click="$emit('update:modelValue', false); $emit('close')" />
      <slot name="header"><h1>{{ title }}</h1></slot>
      <slot />
    </div>`,
  },
}))
vi.mock('@/composables/useWalletFlowRoute', () => ({
  useWalletFlowUrlSync: () => {},
}))
vi.mock('@/modules/access/composables/usePrivyOnboarding', () => ({
  usePrivyOnboarding: () => ({
    state: ref('entry'),
    backTarget: ref(null),
    isPersistent: ref(false),
    back: vi.fn(),
    cancel: vi.fn(),
  }),
}))
const route = reactive({ query: {}, meta: { walletFlow: 'access' } })
vi.mock('vue-router', async orig => ({
  ...(await orig<typeof import('vue-router')>()),
  useRoute: () => route,
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ selectedChain: ref(null), chains: ref([]) }),
}))
vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: () => ({ setSelectedNetwork: vi.fn() }),
}))

const { useAccessStore } = await import('@/stores/accessStore')
const { default: ModuleAccessWallet } =
  await import('@/modules/access/ModuleAccessWallet.vue')
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

let wrapper: VueWrapper
let store: ReturnType<typeof useAccessStore>
beforeEach(() => {
  const pinia = createPinia()
  setActivePinia(pinia)
  store = useAccessStore()
  wrapper = mount(ModuleAccessWallet, { global: { plugins: [pinia, i18n] } })
})
afterEach(() => wrapper.unmount())

const pressBack = () =>
  wrapper.get('button[aria-label="common.back"]').trigger('click')
const pressClose = () =>
  wrapper.get('button[aria-label="common.close"]').trigger('click')

describe('where Back leads from a step', () => {
  it('returns to Log in/Sign Up from a step its wallet row opened', async () => {
    store.openAccessDialog()
    await nextTick()
    store.setCurrentView('private_key')
    await nextTick()

    await pressBack()

    expect(store.currentView).toBe('sign_up')
  })

  it('returns to the chooser from a step the chooser opened', async () => {
    store.openAccessDialog()
    await nextTick()
    store.setCurrentView('default')
    await nextTick()
    store.setCurrentView('keystore')
    await nextTick()

    await pressBack()

    expect(store.currentView).toBe('default')
  })

  it('returns to Log in/Sign Up from a step reached by a link or a reload', async () => {
    // ViewAccessWallet on mount: open, then the step named in the URL.
    store.ensureAccessDialogOpen()
    store.setCurrentView('ledger')
    await nextTick()

    await pressBack()

    expect(store.currentView).toBe('sign_up')
  })

  it('returns to Log in/Sign Up from a step another flow handed over to', async () => {
    // "Access my wallet" after creating a recovery phrase.
    store.openAccessDialog()
    store.setCurrentView('mnemonic')
    await nextTick()

    await pressBack()

    expect(store.currentView).toBe('sign_up')
  })

  it('forgets a chooser visit once the dialog has closed', async () => {
    store.openAccessDialog()
    await nextTick()
    store.setCurrentView('default')
    await nextTick()
    store.setCurrentView('keystore')
    await nextTick()
    await pressClose()
    store.closeAccessDialog()
    await nextTick()

    store.openAccessDialogOn('private_key')
    await nextTick()
    await pressBack()

    expect(store.currentView).toBe('sign_up')
  })
})

describe('the title of a wallet step', () => {
  const metaMask = {
    id: 'io.metamask',
    name: 'MetaMask',
    icon: '',
    type: ['extension'],
  } as never
  const title = () => wrapper.get('h1').text()

  it('does not carry the name of a wallet tried before, back on Log in/Sign Up', async () => {
    store.openAccessDialog()
    await nextTick()
    // The MetaMask tile: the user rejects in the extension and presses Back.
    store.setClickedWeb3Wallet(metaMask)
    store.setCurrentView('web3_wallet')
    await nextTick()
    store.setWeb3ConnectionError('User rejected')
    await pressBack()
    await nextTick()

    // The MEW Mobile tile.
    store.setClickedWalletConnect({ walletName: 'MEW Mobile', walletIcon: '' })
    store.setCurrentView('wallet_connect')
    await nextTick()

    expect(store.clickedWeb3Wallet).toBeUndefined()
    expect(store.web3ConnectionError).toBeNull()
    expect(title()).toBe('access_wallet.connect_wallet_title')
  })
})
