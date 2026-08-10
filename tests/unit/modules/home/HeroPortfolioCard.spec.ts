import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import BigNumber from 'bignumber.js'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

// Stores consumed via storeToRefs are mocked as real Pinia setup stores so
// storeToRefs unwraps correctly; state is mutated through the store instance.
vi.mock('@/stores/walletStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref: r } = await import('vue')
  return {
    useWalletStore: defineStore('wallet', () => ({
      isWalletConnected: r(false),
      walletAddress: r<string | null>(null),
      isLoadingBalances: r(false),
      hasBalances: r(false),
      formattedTotalFiatPortfolioValue: r('$64.12'),
    })),
  }
})
vi.mock('@/stores/chainsStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref: r } = await import('vue')
  return {
    useChainsStore: defineStore('chains', () => ({
      selectedChain: r({ name: 'Ethereum' }),
    })),
  }
})
vi.mock('@/stores/globalStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref: r } = await import('vue')
  return {
    useGlobalStore: defineStore('global', () => {
      const hideBalances = r(false)
      const toggleHideBalances = () => {
        hideBalances.value = !hideBalances.value
      }
      return { hideBalances, toggleHideBalances }
    }),
  }
})

// Action-only stores: stable spies referenced by the deferred hook call.
const openAccessDialog = vi.fn()
const openCreateDialog = vi.fn()
const openPanel = vi.fn()
const refreshBalances = vi.fn()
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({ openAccessDialog }),
}))
vi.mock('@/stores/createStore', () => ({
  useCreateStore: () => ({ openCreateDialog }),
}))
vi.mock('@/stores/walletMenuStore', () => ({
  useWalletMenuStore: () => ({ openPanel }),
}))
vi.mock('@/composables/useRefreshBalances', () => ({
  useRefreshBalances: () => ({ refreshBalances }),
}))

const change = ref({
  fiat: new BigNumber(4.5),
  percentChange: new BigNumber(7.56),
})
vi.mock('@/composables/usePortfolio24hChange', () => ({
  usePortfolio24hChange: () => ({ lastTwentyFourHours: change }),
}))

const push = vi.fn()
vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }))

// The real deposit dialog transitively imports the Ledger/hardware SDK, which
// is unavailable under jsdom. Replace it with an inert stub module.
vi.mock('@/components/core_layouts/wallet/TheDepositDialog.vue', () => ({
  default: {
    name: 'TheDepositDialog',
    props: ['openDialog'],
    template: '<div data-test="deposit-dialog-stub" />',
  },
}))

import HeroPortfolioCard from '@/modules/home/components/HeroPortfolioCard.vue'
import { useWalletStore } from '@/stores/walletStore'

const mountCard = () =>
  mount(HeroPortfolioCard, {
    global: { plugins: [i18n] },
  })

const setWallet = (patch: Record<string, unknown>) => {
  const ws = useWalletStore() as unknown as Record<string, unknown>
  Object.assign(ws, patch)
}

describe('HeroPortfolioCard (MEW-2094)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    openAccessDialog.mockClear()
    openCreateDialog.mockClear()
    openPanel.mockClear()
    push.mockClear()
    change.value = {
      fiat: new BigNumber(4.5),
      percentChange: new BigNumber(7.56),
    }
  })

  it('renders the not-connected state with create/connect CTAs', async () => {
    const w = mountCard()
    expect(w.find('[data-test="hero-portfolio-notconnected"]').exists()).toBe(
      true,
    )
    await w.get('[data-test="hero-create"]').trigger('click')
    expect(openCreateDialog).toHaveBeenCalled()
    await w.get('[data-test="hero-connect"]').trigger('click')
    expect(openAccessDialog).toHaveBeenCalled()
  })

  it('renders skeletons while balances are loading', () => {
    setWallet({ isWalletConnected: true, isLoadingBalances: true })
    const w = mountCard()
    expect(w.find('[data-test="hero-address"]').exists()).toBe(false)
    expect(w.find('[data-test="hero-portfolio-assets"]').exists()).toBe(false)
    expect(w.find('[data-test="hero-go-portfolio"]').exists()).toBe(true)
  })

  it('renders the no-assets state with deposit/buy CTAs', async () => {
    setWallet({
      isWalletConnected: true,
      isLoadingBalances: false,
      hasBalances: false,
    })
    const w = mountCard()
    expect(w.find('[data-test="hero-portfolio-noassets"]').exists()).toBe(true)
    await w.get('[data-test="hero-buy"]').trigger('click')
    expect(openPanel).toHaveBeenCalledWith('purchase')
    expect(w.find('[data-test="hero-deposit"]').exists()).toBe(true)
  })

  it('renders total, today % and routes to Portfolio in the assets state', async () => {
    setWallet({
      isWalletConnected: true,
      isLoadingBalances: false,
      hasBalances: true,
      walletAddress: '0x71C8000000000000000000000000000000000389a',
    })
    const w = mountCard()
    const assets = w.get('[data-test="hero-portfolio-assets"]')
    expect(assets.text()).toContain('$64.12')
    expect(w.get('[data-test="hero-today"]').text()).toContain('7.56')
    expect(w.get('[data-test="hero-address"]').text()).toContain('0x71C8')
    await w.get('[data-test="hero-go-portfolio"]').trigger('click')
    expect(push).toHaveBeenCalledWith({ name: 'Portfolio' })
  })

  it('masks total and percent when the eye toggles hideBalances', async () => {
    setWallet({
      isWalletConnected: true,
      isLoadingBalances: false,
      hasBalances: true,
      walletAddress: '0x71C8000000000000000000000000000000000389a',
    })
    const w = mountCard()
    expect(w.get('[data-test="hero-portfolio-assets"]').text()).toContain(
      '$64.12',
    )
    await w.get('[data-test="hero-eye"]').trigger('click')
    const text = w.get('[data-test="hero-portfolio-assets"]').text()
    expect(text).toContain('$***.**')
    expect(text).not.toContain('$64.12')
    expect(w.get('[data-test="hero-today"]').text()).toContain('*.**%')
  })
})
