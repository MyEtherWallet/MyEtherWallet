import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'

const walletMenu = { openPanel: vi.fn() }
vi.mock('@/stores/walletMenuStore', () => ({
  useWalletMenuStore: () => walletMenu,
}))

const route = {
  query: {} as Record<string, string>,
  matched: [] as { name?: string }[],
}
const router = {
  isReady: vi.fn(() => Promise.resolve()),
  push: vi.fn(() => Promise.resolve()),
}
vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => router,
}))

import {
  isTradeCampaignQuery,
  useTradeCampaignEntry,
} from '@/composables/useTradeCampaignEntry'
import { ROUTES_MAIN } from '@/router/routeNames'

const CAMPAIGN = {
  utm_source: 'https://myetherwallet.com',
  utm_medium: 'referral',
  utm_campaign: 'trade',
}

const Host = defineComponent({
  setup() {
    useTradeCampaignEntry()
    return () => h('div')
  },
})

const flush = async () => {
  await nextTick()
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 0))
}

beforeEach(() => {
  vi.clearAllMocks()
  route.query = {}
  route.matched = []
})

describe('isTradeCampaignQuery', () => {
  it('matches the exact campaign tags', () => {
    expect(isTradeCampaignQuery(CAMPAIGN)).toBe(true)
  })

  it('tolerates case and a trailing slash on the source', () => {
    expect(
      isTradeCampaignQuery({
        utm_source: 'https://MyEtherWallet.com/',
        utm_medium: 'Referral',
        utm_campaign: 'TRADE',
      }),
    ).toBe(true)
  })

  it('requires all three tags', () => {
    expect(isTradeCampaignQuery({ ...CAMPAIGN, utm_campaign: 'swap' })).toBe(
      false,
    )
    expect(isTradeCampaignQuery({ utm_campaign: 'trade' })).toBe(false)
    expect(isTradeCampaignQuery({})).toBe(false)
  })
})

describe('useTradeCampaignEntry', () => {
  it('does nothing without the campaign query', async () => {
    mount(Host)
    await flush()
    expect(walletMenu.openPanel).not.toHaveBeenCalled()
    expect(router.push).not.toHaveBeenCalled()
  })

  it('opens the trade panel and navigates to Stocks from another page', async () => {
    route.query = { ...CAMPAIGN }
    route.matched = [{ name: ROUTES_MAIN.HOME.NAME }]
    mount(Host)
    await flush()
    expect(walletMenu.openPanel).toHaveBeenCalledWith('trade')
    expect(router.push).toHaveBeenCalledWith({
      name: ROUTES_MAIN.STOCKS.NAME,
      query: route.query,
    })
  })

  it('only opens the trade panel when already on Stocks', async () => {
    route.query = { ...CAMPAIGN }
    route.matched = [
      { name: ROUTES_MAIN.STOCKS.NAME },
      { name: 'stock-info-stocks' },
    ]
    mount(Host)
    await flush()
    expect(walletMenu.openPanel).toHaveBeenCalledWith('trade')
    expect(router.push).not.toHaveBeenCalled()
  })
})
