import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick, reactive, ref } from 'vue'
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
vi.mock('@/modules/access/components/privy/PrivyFlow.vue', () =>
  stub('PrivyFlow'),
)
vi.mock('@/modules/access/components/AccessDownloadMobile.vue', () =>
  stub('AccessDownloadMobile'),
)
vi.mock('@/modules/access/components/AccessDownloadWallets.vue', () =>
  stub('AccessDownloadWallets'),
)
vi.mock('@/modules/access/ModuleAccessKeystore.vue', () => stub('Keystore'))
vi.mock('@/modules/access/ModuleAccessPrivateKey.vue', () => stub('PrivateKey'))
vi.mock('@/modules/access/ModuleAccessMnemonic.vue', () => stub('Mnemonic'))
vi.mock('@/modules/access/ModuleAccessHardwareWallet.vue', () => stub('Hw'))
vi.mock('@/modules/access/ModuleAccessWalletConnect.vue', () => stub('Wc'))
vi.mock('@/modules/access/ModuleAccessWeb3Wallet.vue', () => stub('Web3'))
vi.mock('@/modules/access/ModuleAccessAddressSaved.vue', () => stub('Saved'))
vi.mock('@/components/AppNeedHelp.vue', () => stub('AppNeedHelp'))
// AppModal teleports and locks the page; stub its contract: back emits `back`,
// close flips v-model and then emits `close`.
vi.mock('@/components/modal/AppModal.vue', () => ({
  default: {
    name: 'AppModal',
    props: ['modelValue', 'title', 'showBackButton', 'persistent', 'ariaLabel'],
    emits: ['update:modelValue', 'back', 'close'],
    template: `<div>
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
vi.mock('pinia', async orig => ({
  ...(await orig<typeof import('pinia')>()),
  storeToRefs: (store: unknown) => store,
}))

// The login flow's shared state, driven directly by these tests.
const flow = {
  state: ref('entry'),
  backTarget: ref<'chooser' | 'entry' | null>('chooser'),
  isPersistent: ref(false),
  back: vi.fn(),
  cancel: vi.fn(),
}
vi.mock('@/modules/access/composables/usePrivyOnboarding', () => ({
  usePrivyOnboarding: () => flow,
}))
const currentView = ref('default')
const isOpenAccessDialog = ref(true)
const accessStep = ref(1)
const setCurrentView = vi.fn((view: string) => {
  currentView.value = view
})
const closeAccessDialog = vi.fn()
const setSelectedChain = vi.fn()
const CHAINS = [
  { name: 'ETHEREUM', nameLong: 'Ethereum', type: 'EVM' },
  { name: 'POLYGON', nameLong: 'Polygon', type: 'EVM' },
]
const route = reactive<{
  query: Record<string, unknown>
  meta: Record<string, unknown>
}>({
  query: {},
  meta: { walletFlow: 'access' },
})
const replace = vi.fn(({ query }: { query: Record<string, unknown> }) => {
  route.query = query
})
vi.mock('vue-router', async orig => ({
  ...(await orig<typeof import('vue-router')>()),
  useRoute: () => route,
  useRouter: () => ({ replace }),
}))
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({
    currentView,
    isOpenAccessDialog,
    accessStep,
    clickedWeb3Wallet: ref(undefined),
    addressSavedInfo: ref(null),
    connectAddressInfo: ref(null),
    selectedChain: ref(null),
    setCurrentView,
    setSelectedChain,
    closeAccessDialog,
  }),
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ selectedChain: ref(null), chains: ref(CHAINS) }),
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
const mountAt = (view: string, step = 1) => {
  currentView.value = view
  accessStep.value = step
  setSelectedChain.mockClear()
  replace.mockClear()
  isOpenAccessDialog.value = true
  setCurrentView.mockClear()
  closeAccessDialog.mockClear()
  wrapper = mount(ModuleAccessWallet, {
    global: { plugins: [i18n], stubs: { AppAvatar: true } },
  })
  return wrapper
}
beforeEach(() => {
  flow.state.value = 'entry'
  flow.backTarget.value = 'chooser'
  flow.isPersistent.value = false
  flow.back.mockClear()
  flow.cancel.mockClear()
})
afterEach(() => wrapper?.unmount())

const back = (w: VueWrapper) => w.find('button[aria-label="common.back"]')
const title = (w: VueWrapper) => w.get('h1').text()

describe('ModuleAccessWallet header', () => {
  it('hides back on the wallet chooser and shows the Connect wallet title', () => {
    const w = mountAt('default')
    expect(back(w).exists()).toBe(false)
    expect(title(w)).toBe('connect_wallet')
  })

  it('caps the chooser under the title so only the wallet grid scrolls', () => {
    const content = (w: VueWrapper) => w.get('[data-testid="access-content"]')
    let w = mountAt('default')
    expect(content(w).classes()).toContain('overflow-y-auto')
    expect(
      content(w)
        .classes()
        .some(c => c.startsWith('max-h-')),
    ).toBe(true)
    w.unmount()
    // The address steps too, so only their address list shrinks and scrolls.
    for (const view of ['mnemonic', 'ledger', 'trezor'] as const) {
      w = mountAt(view)
      expect(content(w).classes()).toContain('overflow-y-auto')
      w.unmount()
    }
    // Other steps scroll in the dialog itself, which their sticky footers need.
    w = mountAt('keystore')
    expect(content(w).classes()).not.toContain('overflow-y-auto')
    expect(
      content(w)
        .classes()
        .some(c => c.startsWith('max-h-')),
    ).toBe(false)
  })

  it('goes back from sign-up to the chooser', async () => {
    const w = mountAt('sign_up')
    await back(w).trigger('click')
    expect(setCurrentView).toHaveBeenCalledWith('default')
  })

  it('titles the sign-up view "Log in/Sign Up" on its entry screen', () => {
    const w = mountAt('sign_up')

    expect(title(w)).toBe('access_wallet.social.title')
    expect(w.findComponent({ name: 'PrivyFlow' }).exists()).toBe(true)
  })

  it('shows no title on the later login screens', () => {
    flow.state.value = 'google.verifying'

    expect(title(mountAt('sign_up'))).toBe('')
  })

  it('returns from the code screen to the entry screen with the back arrow', async () => {
    flow.state.value = 'email.code'
    flow.backTarget.value = 'entry'
    const w = mountAt('sign_up')

    await back(w).trigger('click')

    expect(flow.back).toHaveBeenCalledTimes(1)
    expect(setCurrentView).not.toHaveBeenCalled()
  })

  it('hides the back arrow on login screens that have nowhere to go back to', () => {
    flow.state.value = 'google.verifying'
    flow.backTarget.value = null

    expect(back(mountAt('sign_up')).exists()).toBe(false)
  })

  it('cannot be closed while the wallet is being set up', () => {
    flow.state.value = 'wallet.setup'
    flow.isPersistent.value = true

    const w = mountAt('sign_up')

    expect(w.findComponent({ name: 'AppModal' }).props('persistent')).toBe(true)
  })

  it('cancels the login flow when the sign-up view is closed', async () => {
    const w = mountAt('sign_up')

    await w.get('button[aria-label="common.close"]').trigger('click')

    expect(flow.cancel).toHaveBeenCalledTimes(1)
  })

  it('cancels the login flow when the dialog is closed from outside the modal', async () => {
    flow.state.value = 'email.code'
    mountAt('sign_up')

    // Browser Back or a link elsewhere closes it through the store.
    isOpenAccessDialog.value = false
    await nextTick()

    expect(flow.cancel).toHaveBeenCalledTimes(1)
  })

  it('names the dialog for screen readers on login screens that have no title', () => {
    flow.state.value = 'google.verifying'

    const w = mountAt('sign_up')

    expect(w.findComponent({ name: 'AppModal' }).props('ariaLabel')).toBe(
      'access_wallet.social.title',
    )
  })

  it('goes back from the download screen to sign-up', async () => {
    const w = mountAt('download_mobile')
    expect(title(w)).toBe('access_wallet.download_mobile.title')
    await back(w).trigger('click')
    expect(setCurrentView).toHaveBeenCalledWith('sign_up')
  })

  it('offers Sign Up under the wallet list, not the download cards', () => {
    const w = mountAt('default')

    expect(w.find('[data-testid="sign-up-cta"]').exists()).toBe(true)
    expect(w.findComponent({ name: 'AccessDownloadWallets' }).exists()).toBe(
      false,
    )
  })

  it('closes like the backdrop does, without resetting the add-account intent', async () => {
    const w = mountAt('sign_up')
    await w.get('button[aria-label="common.close"]').trigger('click')
    expect(isOpenAccessDialog.value).toBe(false)
    expect(setCurrentView).toHaveBeenCalledWith('default')
    expect(closeAccessDialog).not.toHaveBeenCalled()
  })

  it.each([
    ['keystore', 1, 'access_wallet.advanced.keystore_title'],
    ['keystore', 2, 'access_wallet.advanced.password_title'],
    ['mnemonic', 1, 'access_wallet.advanced.phrase_title'],
    ['mnemonic', 2, 'access_wallet.advanced.address_title'],
    ['private_key', 1, 'access_wallet.advanced.private_key_title'],
    ['ledger', 1, 'access_wallet_ledger.step.step1.title'],
    ['ledger', 2, 'access_wallet.advanced.address_title'],
    ['trezor', 1, 'access_wallet_trezor.step.step1.title'],
    ['trezor', 2, 'access_wallet.advanced.address_title'],
  ])('titles %s step %i', (view, step, key) => {
    const w = mountAt(view, step)
    expect(title(w)).toBe(key)
  })

  it('goes back to step 1 inside an advanced flow before leaving it', async () => {
    const w = mountAt('keystore', 2)
    await back(w).trigger('click')
    expect(accessStep.value).toBe(1)
    expect(setCurrentView).not.toHaveBeenCalled()
    await back(w).trigger('click')
    expect(setCurrentView).toHaveBeenCalledWith('default')
  })

  it('remembers the picked network in the URL', async () => {
    route.query = { type: 'default' }
    const w = mountAt('default')
    w.findComponent({ name: 'NetworkChips' }).vm.$emit('select', CHAINS[1])
    expect(replace).toHaveBeenLastCalledWith({
      query: { type: 'default', walletNetwork: 'POLYGON' },
    })
  })

  it('restores the network from the URL when the dialog opens', async () => {
    route.query = { type: 'default', walletNetwork: 'POLYGON' }
    isOpenAccessDialog.value = false
    const w = mountAt('default')
    isOpenAccessDialog.value = false
    await w.vm.$nextTick()
    isOpenAccessDialog.value = true
    await w.vm.$nextTick()
    expect(setSelectedChain).toHaveBeenLastCalledWith(CHAINS[1])
  })

  it.each([
    'default',
    'sign_up',
    'download_mobile',
    'wallet_connect',
    'keystore',
    'mnemonic',
    'private_key',
    'ledger',
    'trezor',
  ])('keeps the chooser width on %s', view => {
    const w = mountAt(view)
    expect(w.findComponent({ name: 'AppModal' }).classes()).toContain(
      'max-w-[560px]',
    )
  })
})
