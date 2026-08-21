import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

const openAccessDialog = vi.fn()
const setCurrentView = vi.fn()
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({ openAccessDialog, setCurrentView }),
}))
const fetchStockOverview = vi.fn()
vi.mock('@/stores/stocksStore', () => ({
  useStocksStore: () => ({ fetchStockOverview }),
}))
// ModuleHome is the whole home page — stub it out, this spec only covers
// ViewHome's /access connect-dialog wiring.
vi.mock('@/modules/home/ModuleHome.vue', () => ({
  default: { template: '<div data-test="module-home-stub" />' },
}))

// walletConfigs transitively imports the Ledger hw-wallet module, which fails
// to load under jsdom — stub it to the plain list ViewHome needs.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  ACCESS_WALLET_VIEWS: [
    'default',
    'ledger',
    'trezor',
    'keystore',
    'mnemonic',
    'private_key',
    'wallet_connect',
    'web3_wallet',
  ],
}))

let query: Record<string, unknown> = {}
vi.mock('vue-router', () => ({ useRoute: () => ({ query }) }))

import ViewHome from '@/views/ViewHome.vue'

describe('ViewHome — /access connect deep-link (MEW-2182)', () => {
  beforeEach(() => {
    openAccessDialog.mockClear()
    setCurrentView.mockClear()
    fetchStockOverview.mockClear()
    query = {}
  })

  it('opens the connect dialog for a valid ?type on mount', () => {
    query = { type: 'default' }
    mount(ViewHome)
    expect(openAccessDialog).toHaveBeenCalledTimes(1)
    expect(setCurrentView).toHaveBeenCalledWith('default')
  })

  it('selects the requested wallet view from ?type', () => {
    query = { type: 'ledger' }
    mount(ViewHome)
    expect(setCurrentView).toHaveBeenCalledWith('ledger')
  })

  it('does not open the dialog without a valid ?type', () => {
    query = {}
    mount(ViewHome)
    expect(openAccessDialog).not.toHaveBeenCalled()

    query = { type: 'bogus' }
    mount(ViewHome)
    expect(openAccessDialog).not.toHaveBeenCalled()
  })

  it('still fetches the stock overview on mount', () => {
    mount(ViewHome)
    expect(fetchStockOverview).toHaveBeenCalledTimes(1)
  })
})
