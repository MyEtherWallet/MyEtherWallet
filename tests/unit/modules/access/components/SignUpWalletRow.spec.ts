import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const wallet = (name: string) => ({ id: name, name, icon: '', type: [] })
const popular = ['Rainbow', 'MEW Mobile', 'Enkrypt', 'MetaMask', 'Phantom'].map(
  name => ({ wallet: wallet(name) }),
)

const connect = vi.fn()
const setCurrentView = vi.fn()
const replace = vi.fn(async () => undefined)
const walletsForTab = vi.fn(() => popular)

vi.mock('@/composables/useWalletList', () => ({
  useWalletList: () => ({ walletsForTab }),
}))
vi.mock('@/modules/access/composables/useConnectWallet', () => ({
  useConnectWallet: () => ({ connect }),
}))
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({ setCurrentView }),
}))
vi.mock('vue-router', async orig => ({
  ...(await orig<typeof import('vue-router')>()),
  useRoute: () => ({
    query: { type: 'sign_up' },
    meta: { walletFlow: 'access' },
  }),
  useRouter: () => ({ replace }),
}))
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))
vi.mock('@/analytics', () => ({
  analytics: { trackConnectWalletEvent: vi.fn() },
}))

const { default: SignUpWalletRow } =
  await import('@/modules/access/components/SignUpWalletRow.vue')

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

let wrapper: VueWrapper | undefined
const mountRow = () => {
  wrapper = mount(SignUpWalletRow, {
    global: { plugins: [i18n], stubs: { AppAvatar: true } },
  })
  return wrapper
}

describe('SignUpWalletRow', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => wrapper?.unmount())

  it('offers the first three popular wallets by name', () => {
    const w = mountRow()

    expect(walletsForTab).toHaveBeenCalledWith('popular')
    expect(
      w
        .findAll('[data-testid="wallet-tile"]')
        .map(b => b.attributes('aria-label')),
    ).toEqual(['Rainbow', 'MEW Mobile', 'Enkrypt'])
  })

  it('connects the wallet whose tile is clicked', async () => {
    const w = mountRow()

    await w.findAll('[data-testid="wallet-tile"]')[1].trigger('click')

    expect(connect).toHaveBeenCalledWith(popular[1].wallet)
  })

  it('opens the wallet chooser from the all-wallets tile', async () => {
    const w = mountRow()

    await w.get('[data-testid="all-wallets"]').trigger('click')

    expect(setCurrentView).toHaveBeenCalledWith('default')
  })

  it('opens the wallet chooser on its Advanced tab from the key tile', async () => {
    const w = mountRow()

    await w.get('[data-testid="more-methods"]').trigger('click')

    expect(replace).toHaveBeenCalledWith({
      query: { type: 'default', walletTab: 'advanced' },
    })
    expect(setCurrentView).toHaveBeenCalledWith('default')
  })
})
