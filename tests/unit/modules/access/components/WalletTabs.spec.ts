import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { reactive } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {
    MOBILE: 'mobile',
    HARDWARE: 'hardware',
    SOFTWARE: 'software',
    EXTENSION: 'extension',
  },
}))
const walletsForTab = vi.fn((tab: string, search: string) =>
  search === 'none'
    ? []
    : [
        {
          wallet: { id: `${tab}-1`, name: `${tab} wallet`, icon: '', type: [] },
        },
      ],
)
vi.mock('@/composables/useWalletList', () => ({
  useWalletList: () => ({ walletsForTab }),
}))
const connect = vi.fn()
vi.mock('@/modules/access/composables/useConnectWallet', () => ({
  useConnectWallet: () => ({ connect }),
}))

const route = reactive<{ query: Record<string, unknown> }>({ query: {} })
const replace = vi.fn(({ query }: { query: Record<string, unknown> }) => {
  route.query = query
})
vi.mock('vue-router', async orig => ({
  ...(await orig<typeof import('vue-router')>()),
  useRoute: () => route,
  useRouter: () => ({ replace }),
}))

const { default: WalletTabs } =
  await import('@/modules/access/components/WalletTabs.vue')
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

let wrapper: VueWrapper | undefined
const mountTabs = () => {
  wrapper = mount(WalletTabs, {
    attachTo: document.body,
    global: {
      plugins: [i18n],
      stubs: {
        WalletCard: {
          props: ['wallet', 'status'],
          emits: ['select'],
          template:
            '<button class="card" @click="$emit(\'select\', wallet)">{{ wallet.name }}</button>',
        },
      },
    },
  })
  return wrapper
}
beforeEach(() => {
  route.query = { type: 'default' }
  replace.mockClear()
})
afterEach(() => wrapper?.unmount())

describe('WalletTabs', () => {
  it('starts on Popular and renders its wallets', () => {
    const w = mountTabs()
    expect(w.get('[role="tab"][aria-selected="true"]').text()).toBe(
      'access_wallet.tabs.popular',
    )
    expect(w.findAll('.card').map(c => c.text())).toEqual(['popular wallet'])
  })

  it('switches tabs and hides search on Advanced', async () => {
    const w = mountTabs()
    await w.findAll('[role="tab"]')[3].trigger('click')
    expect(w.find('input').exists()).toBe(false)
    expect(w.text()).toContain('advanced wallet')
  })

  it('clears search when the tab changes', async () => {
    const w = mountTabs()
    await w.get('input').setValue('none')
    expect(w.text()).toContain('access_wallet.not_found')
    await w.findAll('[role="tab"]')[1].trigger('click')
    expect(walletsForTab).toHaveBeenLastCalledWith('hardware', '')
    expect(w.text()).toContain('hardware wallet')
  })

  it('connects the selected wallet', async () => {
    const w = mountTabs()
    await w.get('.card').trigger('click')
    expect(connect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'popular-1' }),
    )
  })

  it('remembers the tab in the URL, keeping the rest of the query', async () => {
    const w = mountTabs()
    await w.findAll('[role="tab"]')[1].trigger('click')
    expect(replace).toHaveBeenLastCalledWith({
      query: { type: 'default', walletTab: 'hardware' },
    })
  })

  it('restores the tab from the URL when coming back from another step', () => {
    route.query = { type: 'default', walletTab: 'mobile' }
    const w = mountTabs()
    expect(w.get('[role="tab"][aria-selected="true"]').text()).toBe(
      'access_wallet.tabs.mobile',
    )
  })

  it('falls back to Popular for an unknown tab in the URL', () => {
    route.query = { walletTab: 'nope' }
    const w = mountTabs()
    expect(w.get('[role="tab"][aria-selected="true"]').text()).toBe(
      'access_wallet.tabs.popular',
    )
  })
})
