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

  it('emits rename with the edited value from the menu', async () => {
    const w = factory()
    await w.get('[data-test="menu-rename"]').trigger('click')
    await w.get('[data-test="rename-input"]').setValue('Savings')
    await w.get('[data-test="rename-save"]').trigger('click')
    expect(w.emitted('rename')![0]).toEqual(['Savings'])
  })

  it('emits delete only after inline confirm', async () => {
    const w = factory()
    await w.get('[data-test="menu-remove"]').trigger('click')
    expect(w.emitted('delete')).toBeUndefined()
    await w.get('[data-test="delete-confirm"]').trigger('click')
    expect(w.emitted('delete')).toHaveLength(1)
  })

  it('hides "Open Paper wallet" for watch-only accounts', () => {
    expect(factory({ account: { kind: 'signing' } }).find('[data-test="menu-paper"]').exists()).toBe(true)
    expect(factory({ account: { kind: 'watchOnly' } }).find('[data-test="menu-paper"]').exists()).toBe(false)
  })

  it('shows Disconnect (card is always active) and emits disconnect', async () => {
    const w = factory()
    expect(w.find('[data-test="menu-disconnect"]').exists()).toBe(true)
    await w.get('[data-test="menu-disconnect"]').trigger('click')
    expect(w.emitted('disconnect')).toHaveLength(1)
  })
})
