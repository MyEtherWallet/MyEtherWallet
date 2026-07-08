import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

const setSelectedNetwork = vi.fn()

const chains = [
  { name: 'ETH', nameLong: 'Ethereum', type: 'EVM', icon: '' },
  { name: 'OP', nameLong: 'Optimism', type: 'EVM', icon: '' },
  { name: 'BTC', nameLong: 'Bitcoin', type: 'BITCOIN', icon: '' },
]

// Mutable mock state so each test can vary the connected wallet / selected chain.
const walletState = { isWalletConnected: true, walletName: 'Metamask' }
const chainState = { selectedChain: chains[0] as (typeof chains)[number] | undefined }

vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({
    chains,
    get selectedChain() {
      return chainState.selectedChain
    },
  }),
}))
vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => ({
    get isWalletConnected() {
      return walletState.isWalletConnected
    },
    get walletName() {
      return walletState.walletName
    },
  }),
}))
vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: () => ({ setSelectedNetwork }),
}))

import ManageAccountsNetworkView from '@/components/core_layouts/wallet/ManageAccountsNetworkView.vue'

const factory = () =>
  mount(ManageAccountsNetworkView, {
    global: { stubs: { AppTooltip: true }, mocks: { $t: (k: string) => k } },
  })

describe('ManageAccountsNetworkView', () => {
  beforeEach(() => {
    setSelectedNetwork.mockClear()
    walletState.isWalletConnected = true
    walletState.walletName = 'Metamask'
    chainState.selectedChain = chains[0] // EVM (Ethereum)
  })

  it('splits chains into compatible (same type as selected) and incompatible', () => {
    const w = factory()
    expect(w.findAll('[data-test="net-compatible"]')).toHaveLength(2) // ETH + OP
    expect(w.findAll('[data-test="net-incompatible"]')).toHaveLength(1) // BTC
  })

  it('inverts the split when the selected chain is BITCOIN', () => {
    chainState.selectedChain = chains[2] // BTC
    const w = factory()
    expect(w.findAll('[data-test="net-compatible"]')).toHaveLength(1) // BTC
    expect(w.findAll('[data-test="net-incompatible"]')).toHaveLength(2) // ETH + OP
  })

  it('still disables incompatible networks for a multichain wallet (Enkrypt)', () => {
    walletState.walletName = 'Enkrypt'
    const w = factory()
    expect(w.findAll('[data-test="net-compatible"]')).toHaveLength(2) // ETH + OP
    expect(w.findAll('[data-test="net-incompatible"]')).toHaveLength(1) // BTC
  })

  it('shows all networks as compatible when no wallet is connected', () => {
    walletState.isWalletConnected = false
    const w = factory()
    expect(w.findAll('[data-test="net-compatible"]')).toHaveLength(3)
    expect(w.findAll('[data-test="net-incompatible"]')).toHaveLength(0)
  })

  it('emits back when the back button is clicked', async () => {
    const w = factory()
    await w.get('[data-test="net-back"]').trigger('click')
    expect(w.emitted('back')).toHaveLength(1)
  })

  it('applies the network and emits selected when a compatible chain is clicked', async () => {
    const w = factory()
    await w.findAll('[data-test="net-compatible"]')[1].trigger('click') // Optimism
    expect(setSelectedNetwork).toHaveBeenCalledWith('OP')
    expect(w.emitted('selected')).toHaveLength(1)
  })

  it('does not apply an incompatible chain', async () => {
    const w = factory()
    await w.get('[data-test="net-incompatible"]').trigger('click')
    expect(setSelectedNetwork).not.toHaveBeenCalled()
  })

  it('filters by search over nameLong', async () => {
    const w = factory()
    await w.get('[data-test="net-search"]').setValue('opti')
    expect(w.findAll('[data-test="net-compatible"]')).toHaveLength(1)
  })
})
