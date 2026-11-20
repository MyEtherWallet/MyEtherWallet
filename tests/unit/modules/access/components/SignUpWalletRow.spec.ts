import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const wallet = (name: string) => ({ id: name, name, icon: '', type: [] })
// What the wallet list picks for the row: its rules are tested with it.
const picked = ['MetaMask', 'MEW Mobile', 'Enkrypt', 'Private Key'].map(wallet)

const connect = vi.fn()
const setCurrentView = vi.fn()
const replace = vi.fn(async () => undefined)
const signUpRowWallets = vi.fn(() => picked)

vi.mock('@/composables/useWalletList', () => ({
  useWalletList: () => ({ signUpRowWallets }),
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

  it('offers the wallets picked for the row, by name, in their order', () => {
    const w = mountRow()

    expect(
      w
        .findAll('[data-testid="wallet-tile"]')
        .map(b => b.attributes('aria-label')),
    ).toEqual(['MetaMask', 'MEW Mobile', 'Enkrypt', 'Private Key'])
  })

  it('connects the wallet whose tile is clicked', async () => {
    const w = mountRow()

    await w.findAll('[data-testid="wallet-tile"]')[1].trigger('click')

    expect(connect).toHaveBeenCalledWith(picked[1])
  })

  it('ends with one tile for every other wallet method, which opens the chooser', async () => {
    const w = mountRow()
    const tiles = w.findAll('button')
    const last = tiles[tiles.length - 1]

    expect(tiles).toHaveLength(5)
    expect(last.attributes('aria-label')).toBe(
      'access_wallet.social.other_methods',
    )
    await last.trigger('click')

    expect(setCurrentView).toHaveBeenCalledWith('default')
  })

  it('has no separate key shortcut: Private Key and Keystore are tiles of their own', () => {
    expect(mountRow().find('[data-testid="more-methods"]').exists()).toBe(false)
  })
})
