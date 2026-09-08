import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {
    SOFTWARE: 'software',
    HARDWARE: 'hardware',
    EXTENSION: 'extension',
  },
}))

import ManageAccountsCard from '@/components/core_layouts/wallet/ManageAccountsCard.vue'
import { truncateAddress } from '@/utils/filters'
import type { SavedAccount } from '@/stores/saved_accounts/savedAccountsLogic'
import { WalletConfigType } from '@/modules/access/common/walletConfigs'
import { WalletType } from '@/providers/types'

const stubs = {
  AppPopUpMenu: {
    template: '<div><slot name="menu-button" :toggleMenu="() => {}" /><slot name="menu-content" :toggleMenu="() => {}" /></div>',
  },
  IconWatchOnly: true,
}

const acc = (over: Partial<SavedAccount> = {}): SavedAccount => ({
  id: 'EVM:0x1', address: '0xAbC0000000000000000000000000000000000001',
  chainType: 'EVM', kind: over.kind ?? 'signing',
  walletConfigType: WalletConfigType.SOFTWARE, providerType: WalletType.INJECTED,
  walletName: 'Metamask', addressName: over.addressName ?? 'Address 1',
  icon: '', ...over,
})

const factory = (props: { account?: Partial<SavedAccount> } = {}) =>
  mount(ManageAccountsCard, {
    props: { account: acc(props.account), balance: { usdValue: 130.23, tokenCount: 3 } },
    global: { stubs, mocks: { $t: (k: string) => k } },
  })

describe('ManageAccountsCard', () => {
  it('renders the account name and balance', () => {
    const w = factory()
    expect(w.text()).toContain('Address 1')
    expect(w.text()).toContain('$130.23')
  })

  it('shows the wallet name always; the truncated address only for a custom label', () => {
    const address = '0xAbC0000000000000000000000000000000000001'
    const truncated = truncateAddress(address, 6, 4)
    const dflt = factory({ account: { address, addressName: truncated } })
    expect(dflt.text()).toContain('Metamask')
    expect(dflt.text()).not.toContain('•')
    const custom = factory({ account: { address, addressName: 'Savings' } })
    expect(custom.text()).toContain('•')
    expect(custom.text()).toContain(truncated)
    expect(custom.text()).toContain('Metamask')
  })

  it('emits a rename request from the menu (rename happens in a modal)', async () => {
    const w = factory()
    await w.get('[data-test="menu-rename"]').trigger('click')
    expect(w.emitted('rename')).toHaveLength(1)
    expect(w.emitted('rename')![0]).toEqual([])
  })

  it('emits delete when Remove is clicked (confirmation happens in a modal)', async () => {
    const w = factory()
    await w.get('[data-test="menu-remove"]').trigger('click')
    expect(w.emitted('delete')).toHaveLength(1)
  })

  it('shows "Open Paper wallet" on the active card regardless of kind (like the home card)', () => {
    expect(factory({ account: { kind: 'signing' } }).find('[data-test="menu-paper"]').exists()).toBe(true)
    expect(factory({ account: { kind: 'watchOnly' } }).find('[data-test="menu-paper"]').exists()).toBe(true)
  })

  it('shows Disconnect (card is always active) and emits disconnect', async () => {
    const w = factory()
    expect(w.find('[data-test="menu-disconnect"]').exists()).toBe(true)
    await w.get('[data-test="menu-disconnect"]').trigger('click')
    expect(w.emitted('disconnect')).toHaveLength(1)
  })

  it('shows Connected (no Connect button) for signing accounts', () => {
    const w = factory({ account: { kind: 'signing' } })
    expect(w.text()).toContain('multi_address.connected')
    expect(w.find('[data-test="card-connect"]').exists()).toBe(false)
  })

  it('shows the eye/Watchonly status and a Connect address button for watch-only accounts', () => {
    const w = factory({ account: { kind: 'watchOnly' } })
    expect(w.text()).toContain('multi_address.watchonly')
    expect(w.find('[data-test="card-connect"]').exists()).toBe(true)
    expect(w.get('[data-test="card-connect"]').text()).toContain('multi_address.connect_address')
  })

  it('emits connect when the watch-only Connect address button is clicked', async () => {
    const w = factory({ account: { kind: 'watchOnly' } })
    await w.get('[data-test="card-connect"]').trigger('click')
    expect(w.emitted('connect')).toHaveLength(1)
  })
})
