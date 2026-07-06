import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {
    SOFTWARE: 'software',
    HARDWARE: 'hardware',
    EXTENSION: 'extension',
  },
}))

import ManageAccountsRow from '@/components/core_layouts/wallet/ManageAccountsRow.vue'
import { truncateAddress } from '@/utils/filters'
import type { SavedAccount } from '@/stores/saved_accounts/savedAccountsLogic'
import { WalletConfigType } from '@/modules/access/common/walletConfigs'
import { WalletType } from '@/providers/types'

const stubs = {
  AppPopUpMenu: {
    template: '<div><slot name="menu-button" :toggleMenu="() => {}" /><slot name="menu-content" :toggleMenu="() => {}" /></div>',
  },
  AppBlockie: true,
  IconWatchOnly: true,
}

const acc = (over: Partial<SavedAccount> = {}): SavedAccount => ({
  id: 'EVM:0x1', address: '0xAbC0000000000000000000000000000000000001',
  chainType: 'EVM', kind: over.kind ?? 'signing',
  walletConfigType: WalletConfigType.SOFTWARE, providerType: WalletType.INJECTED,
  walletName: 'Enkrypt', addressName: over.addressName ?? 'Address 1',
  icon: '', ...over,
})

interface FactoryProps {
  account?: Partial<SavedAccount>
  isActive?: boolean
}

const factory = (props: FactoryProps = {}) =>
  mount(ManageAccountsRow, {
    props: { account: acc(props.account), isActive: props.isActive ?? false },
    global: { stubs, mocks: { $t: (k: string) => k } },
  })

describe('ManageAccountsRow', () => {
  it('shows the addressName as the primary label', () => {
    expect(factory().text()).toContain('Address 1')
  })

  it('shows the wallet name always; the truncated address only for a custom label', () => {
    const address = '0xAbC0000000000000000000000000000000000001'
    const truncated = truncateAddress(address, 6, 4)
    // Default label (== truncated address): wallet name only, no bullet/address repeat
    const dflt = factory({ account: { address, addressName: truncated } })
    expect(dflt.text()).toContain('Enkrypt')
    expect(dflt.text()).not.toContain('•')
    // Custom label: shows "<address> • <wallet>"
    const custom = factory({ account: { address, addressName: 'Savings' } })
    expect(custom.text()).toContain('•')
    expect(custom.text()).toContain(truncated)
    expect(custom.text()).toContain('Enkrypt')
  })

  it('shows the active check badge when active and the eye when watch-only', () => {
    expect(factory({ isActive: true }).find('[data-test="badge"]').exists()).toBe(true)
    const watchOnly = factory({ account: { kind: 'watchOnly' }, isActive: false })
    expect(watchOnly.find('[data-test="badge"]').exists()).toBe(false)
    // watch-only rows render the eye icon (heroicons EyeIcon svg)
    expect(watchOnly.find('svg').exists()).toBe(true)
  })

  it('emits select when the row body is clicked', async () => {
    const w = factory()
    await w.get('[data-test="row-body"]').trigger('click')
    expect(w.emitted('select')).toHaveLength(1)
  })

  it('shows "Open Paper wallet" on every row', () => {
    expect(factory({ isActive: true }).find('[data-test="menu-paper"]').exists()).toBe(true)
    expect(factory({ isActive: false }).find('[data-test="menu-paper"]').exists()).toBe(true)
  })

  it('emits a rename request from the menu (rename happens in a modal)', async () => {
    const w = factory()
    await w.get('[data-test="menu-rename"]').trigger('click')
    expect(w.emitted('rename')).toHaveLength(1)
    expect(w.emitted('rename')![0]).toEqual([])
  })

  it('emits delete only after inline confirm', async () => {
    const w = factory()
    await w.get('[data-test="menu-remove"]').trigger('click')
    expect(w.emitted('delete')).toBeUndefined()
    await w.get('[data-test="delete-confirm"]').trigger('click')
    expect(w.emitted('delete')).toHaveLength(1)
  })

  it('shows Disconnect only on the active row and emits disconnect', async () => {
    expect(factory({ isActive: false }).find('[data-test="menu-disconnect"]').exists()).toBe(false)
    const w = factory({ isActive: true })
    expect(w.find('[data-test="menu-disconnect"]').exists()).toBe(true)
    await w.get('[data-test="menu-disconnect"]').trigger('click')
    expect(w.emitted('disconnect')).toHaveLength(1)
  })

  it('emits copy / refresh / explorer from the menu', async () => {
    const w = factory()
    await w.get('[data-test="menu-copy"]').trigger('click')
    await w.get('[data-test="menu-refresh"]').trigger('click')
    await w.get('[data-test="menu-explorer"]').trigger('click')
    expect(w.emitted('copy')).toHaveLength(1)
    expect(w.emitted('refresh')).toHaveLength(1)
    expect(w.emitted('explorer')).toHaveLength(1)
  })
})
