import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const h = vi.hoisted(() => ({
  unlockKeystore: vi.fn(),
  setWallet: vi.fn(),
  addWallet: vi.fn(),
  setSelectedNetwork: vi.fn(),
  setCurrentView: vi.fn(),
  closeAccessDialog: vi.fn(),
  track: vi.fn(),
}))
const accessStep = ref(1)
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({
    accessStep,
    selectedChain: ref({ chainID: '1', name: 'ETHEREUM' }),
    setCurrentView: h.setCurrentView,
    closeAccessDialog: h.closeAccessDialog,
  }),
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
  walletConfigs: { keystore: { id: 'keystore', type: ['software'] } },
}))
vi.mock('@/modules/access/common/helpers', async orig => ({
  ...(await orig<typeof import('@/modules/access/common/helpers')>()),
  unlockKeystore: h.unlockKeystore,
}))
vi.mock('@/providers/ethereum/privateKeyWallet', () => ({
  default: class PrivateKeyWallet {},
}))
// AppAvatar's import graph reaches walletConfigs' hardware SDKs.
vi.mock('@/components/avatar/AppAvatar.vue', () => ({
  default: {
    template: '<span><slot name="icon" /><slot name="badge" /></span>',
  },
}))

const { default: ModuleAccessKeystore } =
  await import('@/modules/access/ModuleAccessKeystore.vue')
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {
      access_wallet: {
        advanced: { keystore_version: 'Keystore v{version}' },
      },
    },
  },
})

const V3 = { version: 3, id: 'x', crypto: { cipher: 'aes-128-ctr' } }

let wrapper: VueWrapper | undefined
const mountIt = () => {
  wrapper = mount(ModuleAccessKeystore, {
    attachTo: document.body,
    global: { plugins: [i18n], stubs: { AccessHelpFooter: true } },
  })
  return wrapper
}
const upload = async (w: VueWrapper, content: string, name = 'UTC--1.json') => {
  const input = w.get('[data-testid="keystore-file-input"]')
  const file = new File([content], name, { type: 'application/json' })
  Object.defineProperty(input.element, 'files', {
    value: [file],
    configurable: true,
  })
  await input.trigger('change')
  await vi.waitFor(() => {
    expect(
      accessStep.value === 2 ||
        w.find('[data-testid="keystore-invalid"]').exists(),
    ).toBe(true)
  })
  await flushPromises()
}
const connect = (w: VueWrapper) => w.get('[data-testid="keystore-connect"]')

beforeEach(() => {
  accessStep.value = 1
  Object.values(h).forEach(fn => fn.mockReset())
})
afterEach(() => wrapper?.unmount())

describe('ModuleAccessKeystore', () => {
  it('moves to the password step with the file details for a keystore', async () => {
    const w = mountIt()
    await upload(w, JSON.stringify(V3))
    expect(accessStep.value).toBe(2)
    expect(w.text()).toContain('UTC--1.json')
    expect(w.text()).toContain('v3')
  })

  it('flags a JSON file that is not a keystore and keeps Continue disabled', async () => {
    const w = mountIt()
    await upload(w, JSON.stringify({ hello: 'world' }), 'notes.json')
    expect(accessStep.value).toBe(1)
    expect(w.text()).toContain('access_wallet.advanced.invalid_file_title')
    expect(
      w.get('[data-testid="keystore-continue"]').attributes('disabled'),
    ).toBeDefined()
  })

  it('shows an inline error for a wrong password', async () => {
    h.unlockKeystore.mockRejectedValue(
      new Error('Key derivation failed - possibly wrong passphrase'),
    )
    const w = mountIt()
    await upload(w, JSON.stringify(V3))
    await w.get('input[type="password"]').setValue('nope')
    await connect(w).trigger('click')
    await flushPromises()
    expect(w.text()).toContain('access_wallet.advanced.incorrect_password')
    expect(w.find('[data-testid="keystore-error-card"]').exists()).toBe(false)
  })

  it('shows the error card when the file cannot be decrypted', async () => {
    h.unlockKeystore.mockRejectedValue(new Error('Unsupported kdf'))
    const w = mountIt()
    await upload(w, JSON.stringify(V3))
    await w.get('input[type="password"]').setValue('pw')
    await connect(w).trigger('click')
    await flushPromises()
    expect(w.find('[data-testid="keystore-error-card"]').exists()).toBe(true)
    expect(connect(w).attributes('disabled')).toBeDefined()
  })

  it('connects the wallet on a correct password', async () => {
    h.unlockKeystore.mockResolvedValue({
      getPrivateKey: () => new Uint8Array(32),
    })
    const w = mountIt()
    await upload(w, JSON.stringify(V3))
    await w.get('input[type="password"]').setValue('right')
    await connect(w).trigger('click')
    await flushPromises()
    expect(h.setWallet).toHaveBeenCalledTimes(1)
    expect(h.closeAccessDialog).toHaveBeenCalled()
  })

  it('keeps the password out of session replays and analytics', async () => {
    const w = mountIt()
    await upload(w, JSON.stringify(V3))
    // AppInput puts fallthrough attrs on its wrapper; Sentry `block` and the
    // Amplitude mask both cover the matched element's subtree.
    expect(
      w.get('input[type="password"]').element.closest('[data-private]'),
    ).not.toBeNull()
  })

  it('uses the light brand disabled style on its primary buttons', async () => {
    const w = mountIt()
    await upload(w, JSON.stringify({ hello: 'world' }), 'notes.json')
    expect(w.get('[data-testid="keystore-continue"]').classes()).toContain(
      'aria-disabled:!bg-background-brand/40',
    )
    accessStep.value = 2
    await flushPromises()
  })
})
