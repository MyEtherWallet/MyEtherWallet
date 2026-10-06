import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {
    MOBILE: 'mobile',
    HARDWARE: 'hardware',
    SOFTWARE: 'software',
    EXTENSION: 'extension',
  },
}))
const track = vi.fn()
vi.mock('@/analytics', () => ({
  analytics: {
    trackConnectWalletEvent: (...args: unknown[]) => track(...args),
  },
}))

const { default: WalletCard } =
  await import('@/modules/access/components/WalletCard.vue')

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})
const mountCard = (props: Record<string, unknown>) =>
  mount(WalletCard, {
    props,
    global: {
      plugins: [i18n],
      stubs: {
        AppAvatar: {
          props: ['type', 'url'],
          template:
            '<span class="avatar" :data-type="type" :data-url="url"><slot name="icon" /></span>',
        },
      },
    },
  })

const metaMask = {
  id: 'io.metamask',
  name: 'MetaMask',
  icon: 'mm.svg',
  type: ['extension'],
  rkDetails: { id: 'metaMask' },
}

describe('WalletCard', () => {
  it('renders the name and the status label', () => {
    const w = mountCard({ wallet: metaMask, status: 'detected' })
    expect(w.text()).toContain('MetaMask')
    expect(w.text()).toContain('access_wallet.detected')
  })

  it('emits select and tracks the click', async () => {
    const w = mountCard({ wallet: metaMask })
    await w.get('button').trigger('click')
    expect(w.emitted('select')?.[0]).toEqual([metaMask])
    expect(track).toHaveBeenCalledWith(expect.anything(), {
      walletName: 'MetaMask',
    })
  })

  it('follows a new wallet prop instead of keeping the old logo', async () => {
    const w = mountCard({ wallet: metaMask })
    await w.setProps({
      wallet: { ...metaMask, id: 'io.rabby', name: 'Rabby', icon: 'rabby.svg' },
    })
    expect(w.get('.avatar').attributes('data-url')).toBe('rabby.svg')
  })

  it('draws full-bleed round marks edge to edge instead of inset in an avatar', () => {
    const w = mountCard({
      wallet: {
        id: 'ledger',
        name: 'Ledger',
        icon: 'ledger.svg',
        type: ['hardware'],
        roundIcon: true,
      },
    })
    expect(w.find('.avatar').exists()).toBe(false)
    const img = w.get('img')
    expect(img.attributes('src')).toBe('ledger.svg')
    expect(img.classes()).toEqual(
      expect.arrayContaining(['size-8', 'rounded-full']),
    )
  })

  it('sets the wallet name in semibold', () => {
    const w = mountCard({ wallet: metaMask })
    const name = w.findAll('span').find(s => s.text() === 'MetaMask')
    expect(name?.classes()).toContain('font-semibold')
  })
})
