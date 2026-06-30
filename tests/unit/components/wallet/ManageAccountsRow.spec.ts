// tests/unit/components/wallet/ManageAccountsRow.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock heavy HW-wallet transitive deps before any component import
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {
    EXTENSION: 'EXTENSION',
    HARDWARE: 'HARDWARE',
    SOFTWARE: 'SOFTWARE',
    READ_ONLY: 'READ_ONLY',
  },
}))

import ManageAccountsRow from '@/components/core_layouts/wallet/ManageAccountsRow.vue'
import { WalletConfigType } from '@/modules/access/common/walletConfigs'
import { WalletType } from '@/providers/types'

const account = {
  id: 'EVM:0xabc',
  address: '0xABCDEF0000000000000000000000000000001234',
  chainType: 'EVM',
  kind: 'watchOnly' as const,
  walletConfigType: WalletConfigType.EXTENSION,
  providerType: WalletType.WAGMI,
  connectorId: 'enkrypt',
  walletName: 'Enkrypt',
  icon: '',
  addedAt: 1,
}

const mountRow = (props = {}) =>
  mount(ManageAccountsRow, {
    props: { account, isActive: false, ...props },
    global: { stubs: { AppBlockie: true }, mocks: { $t: (k: string) => k } },
  })

describe('ManageAccountsRow', () => {
  it('renders name + truncated address', () => {
    const w = mountRow()
    expect(w.text()).toContain('Enkrypt')
    expect(w.text()).toContain('0xABCD...1234')
  })

  it('emits select when the row body is clicked', async () => {
    const w = mountRow()
    await w.find('[data-test="row-body"]').trigger('click')
    expect(w.emitted('select')).toBeTruthy()
  })

  it('requires confirm before emitting delete', async () => {
    const w = mountRow()
    await w.find('[data-test="delete"]').trigger('click')
    expect(w.emitted('delete')).toBeFalsy()
    await w.find('[data-test="delete-confirm"]').trigger('click')
    expect(w.emitted('delete')).toBeTruthy()
  })

  it('shows the badge only when active', () => {
    expect(mountRow({ isActive: false }).find('[data-test="badge"]').exists()).toBe(false)
    expect(mountRow({ isActive: true }).find('[data-test="badge"]').exists()).toBe(true)
  })

  it('emits copy and shows copied feedback when copy button is clicked', async () => {
    const w = mountRow()
    await w.find('[data-test="copy"]').trigger('click')
    expect(w.emitted('copy')).toBeTruthy()
    expect(w.text()).toContain('multi_address.copied')
  })
})
