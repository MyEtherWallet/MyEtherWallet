import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import ManageAccountsMenu from '@/components/core_layouts/wallet/ManageAccountsMenu.vue'

interface FactoryProps {
  kind?: 'signing' | 'watchOnly'
  isActive?: boolean
  toggle?: () => void
}

const factory = (props: FactoryProps = {}) =>
  mount(ManageAccountsMenu, {
    props: {
      kind: props.kind ?? 'signing',
      isActive: props.isActive ?? false,
      toggle: props.toggle,
    },
    global: { mocks: { $t: (k: string) => k } },
  })

describe('ManageAccountsMenu', () => {
  it('always shows rename / copy / refresh / explorer / remove', () => {
    const w = factory()
    expect(w.find('[data-test="menu-rename"]').exists()).toBe(true)
    expect(w.find('[data-test="menu-copy"]').exists()).toBe(true)
    expect(w.find('[data-test="menu-refresh"]').exists()).toBe(true)
    expect(w.find('[data-test="menu-explorer"]').exists()).toBe(true)
    expect(w.find('[data-test="menu-remove"]').exists()).toBe(true)
  })

  it('always shows "Open Paper wallet" (available for every address)', () => {
    expect(factory({ isActive: true }).find('[data-test="menu-paper"]').exists()).toBe(true)
    expect(factory({ isActive: false }).find('[data-test="menu-paper"]').exists()).toBe(true)
  })

  it('shows "Disconnect" only for signing (connected) accounts, not watch-only', () => {
    expect(factory({ kind: 'signing' }).find('[data-test="menu-disconnect"]').exists()).toBe(true)
    expect(factory({ kind: 'watchOnly' }).find('[data-test="menu-disconnect"]').exists()).toBe(false)
  })

  it('emits the matching action and closes the menu for non-destructive items', async () => {
    const toggle = vi.fn()
    const w = factory({ isActive: true, toggle })
    await w.get('[data-test="menu-rename"]').trigger('click')
    await w.get('[data-test="menu-copy"]').trigger('click')
    await w.get('[data-test="menu-refresh"]').trigger('click')
    await w.get('[data-test="menu-paper"]').trigger('click')
    await w.get('[data-test="menu-explorer"]').trigger('click')
    await w.get('[data-test="menu-disconnect"]').trigger('click')
    expect(w.emitted('rename')).toHaveLength(1)
    expect(w.emitted('copy')).toHaveLength(1)
    expect(w.emitted('refresh')).toHaveLength(1)
    expect(w.emitted('paper')).toHaveLength(1)
    expect(w.emitted('explorer')).toHaveLength(1)
    expect(w.emitted('disconnect')).toHaveLength(1)
    expect(toggle).toHaveBeenCalledTimes(6)
  })

  it('emits remove and closes the menu (confirmation lives in a modal)', async () => {
    const toggle = vi.fn()
    const w = factory({ toggle })
    await w.get('[data-test="menu-remove"]').trigger('click')
    expect(w.emitted('remove')).toHaveLength(1)
    expect(toggle).toHaveBeenCalledTimes(1)
  })
})
