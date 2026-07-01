import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const setSelectedNetwork = vi.fn()
const chains = [
  { name: 'ETH', nameLong: 'Ethereum', type: 'EVM', icon: '' },
  { name: 'OP', nameLong: 'Optimism', type: 'EVM', icon: '' },
  { name: 'BTC', nameLong: 'Bitcoin', type: 'BITCOIN', icon: '' },
]
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ chains, selectedChain: chains[0] }),
}))
vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => ({ isWalletConnected: true, walletName: 'Metamask' }),
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
  it('splits chains into compatible (same type) and incompatible (other type)', () => {
    const w = factory()
    const compat = w.findAll('[data-test="net-compatible"]')
    const incompat = w.findAll('[data-test="net-incompatible"]')
    expect(compat).toHaveLength(2) // ETH + OP (EVM)
    expect(incompat).toHaveLength(1) // BTC
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
