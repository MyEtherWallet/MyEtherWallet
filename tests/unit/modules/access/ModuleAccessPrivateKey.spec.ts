import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// A valid secp256k1 private key (64 hex chars) — passes isValidPrivate.
const VALID_KEY =
  '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318'

// Hoisted so the vi.mock factories (which are lifted above the file body) can
// safely reference these spies/holders. Chain flags are plain { value } holders
// because storeToRefs is stubbed to a passthrough.
const h = vi.hoisted(() => ({
  setWallet: vi.fn(() => Promise.resolve()),
  addWallet: vi.fn(),
  setSelectedNetwork: vi.fn(),
  addToastMessage: vi.fn(),
  setCurrentView: vi.fn(),
  closeAccessDialog: vi.fn(),
  trackConnectWalletEvent: vi.fn(),
  captureException: vi.fn(),
  selectedChain: { value: { chainID: '1', name: 'ETHEREUM' } } as {
    value: { chainID: string; name: string }
  },
  isEvmChain: { value: true },
  isBitcoinChain: { value: false },
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
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: h.addToastMessage }),
}))
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({
    selectedChain: h.selectedChain,
    isEvmChain: h.isEvmChain,
    isBitcoinChain: h.isBitcoinChain,
    setCurrentView: h.setCurrentView,
    closeAccessDialog: h.closeAccessDialog,
  }),
}))
vi.mock('@/analytics', () => ({
  analytics: { trackConnectWalletEvent: h.trackConnectWalletEvent },
  ConnectWalletEvent: { SUCCESS: 'success' },
}))
vi.mock('@sentry/vue', () => ({ captureException: h.captureException }))
vi.mock('@/modules/access/common/walletConfigs', () => ({
  walletConfigs: {
    privateKey: { id: 'privateKey', name: 'Private Key', type: ['software'] },
  },
  WalletConfigType: { SOFTWARE: 'software' },
}))
// Lightweight wallet stubs so the test doesn't pull the full crypto stack; the
// crash under test happens inside setWallet (mocked), not in construction.
vi.mock('@/providers/ethereum/privateKeyWallet', () => ({
  default: class EthereumPrivateKey {},
}))
vi.mock('@/providers/bitcoin/privateKeyWallet', () => ({
  default: class BitcoinPrivateKey {},
}))
// isValidPrivateKey depends on the real secp256k1 validation stack, which
// doesn't validate reliably under jsdom. Stub the validation helpers with the
// same canonical shape checks (0x + 64 hex, 32-byte key) so the computed still
// discriminates valid from invalid keys — the happy-path test exercises the
// unlock -> setWallet wiring and the guard tests still see invalid input as
// invalid. Isolates the component (code under test) from the crypto lib.
vi.mock('@/modules/access/common/helpers', () => ({
  isPrivateKey: (v: string) => /^0x[0-9a-fA-F]{64}$/.test(v),
  getBufferFromHex: (hex: string) => Buffer.from(hex, 'hex'),
  sanitizeHex: (hex: string) => hex,
}))
vi.mock('@ethereumjs/util', async importOriginal => {
  const actual = await importOriginal<typeof import('@ethereumjs/util')>()
  return { ...actual, isValidPrivate: (b: Uint8Array) => b.length === 32 }
})
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return { ...actual, useI18n: () => ({ t: (k: string) => k }) }
})
// storeToRefs passthrough so the plain-object store works in the component
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  return { ...actual, storeToRefs: (store: Record<string, unknown>) => store }
})

import ModuleAccessPrivateKey from '@/modules/access/ModuleAccessPrivateKey.vue'

const AppInput = {
  name: 'AppInput',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template:
    '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
}
const stubs = {
  AppInput,
  AppSheet: { template: '<div><slot /></div>' },
  AppNotRecommended: { template: '<div />' },
  ButtonNoWallet: { template: '<div />' },
  AppBaseButton: {
    props: ['disabled'],
    template: '<button :disabled="disabled"><slot /></button>',
  },
}

const factory = () =>
  mount(ModuleAccessPrivateKey, {
    global: { stubs, mocks: { $t: (k: string) => k } },
  })

const pressEnter = async (w: ReturnType<typeof factory>, value: string) => {
  const input = w.get('input')
  await input.setValue(value)
  await input.trigger('keyup', { key: 'Enter' })
}

describe('ModuleAccessPrivateKey', () => {
  beforeEach(() => {
    h.setWallet.mockClear()
    h.isEvmChain.value = true
    h.isBitcoinChain.value = false
  })

  it('does not build a wallet when Enter is pressed with an invalid key (MEW-2185)', async () => {
    const w = factory()
    await pressEnter(w, '0x1234') // valid hex but wrong length → invalid
    expect(h.setWallet).not.toHaveBeenCalled()
  })

  it('does not build a wallet when Enter is pressed with an empty input', async () => {
    const w = factory()
    await pressEnter(w, '')
    expect(h.setWallet).not.toHaveBeenCalled()
  })

  it('connects with setWallet when Enter is pressed with a valid key', async () => {
    const w = factory()
    await pressEnter(w, VALID_KEY)
    await Promise.resolve()
    expect(h.setWallet).toHaveBeenCalledTimes(1)
  })

})
