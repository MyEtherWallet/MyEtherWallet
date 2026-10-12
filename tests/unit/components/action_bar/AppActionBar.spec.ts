import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (k: string) => k }) }))

import AppActionBar from '@/components/action_bar/AppActionBar.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import type { ActionBarItem } from '@/components/action_bar/types'

const items: ActionBarItem[] = [
  { id: 'trade', icon: 'chart-bar', label: 'Trade' },
  { id: 'swap', icon: 'arrow-path-rounded-square', label: 'Swap' },
  { id: 'send', icon: 'paper-airplane', label: 'Send', disabled: true },
]

const factory = (props: Record<string, unknown> = {}) =>
  mount(AppActionBar, { props: { items, ...props } })

describe('AppActionBar', () => {
  it('renders the top action plus one button per item inside a nav', () => {
    const wrapper = factory()
    expect(wrapper.get('nav').attributes('aria-label')).toBe(
      'common.wallet_actions',
    )
    expect(wrapper.findAll('button')).toHaveLength(items.length + 1)
    expect(wrapper.findAll('li')).toHaveLength(items.length)
  })

  it('emits select with the item id', async () => {
    const wrapper = factory()
    await wrapper.get('[data-action-id="swap"]').trigger('click')
    expect(wrapper.emitted('select')).toEqual([['swap']])
  })

  it('emits toggle from the top action', async () => {
    const wrapper = factory()
    await wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('marks only the activeId button as pressed', () => {
    const wrapper = factory({ activeId: 'swap' })
    const pressed = wrapper.findAll('[aria-pressed="true"]')
    expect(pressed).toHaveLength(1)
    expect(pressed[0].attributes('data-action-id')).toBe('swap')
  })

  it('forwards disabled to the item button', () => {
    const wrapper = factory()
    const send = wrapper.get('[data-action-id="send"]')
      .element as HTMLButtonElement
    expect(send.disabled).toBe(true)
  })

  it('flips the chevron and the top action name with expanded', async () => {
    const wrapper = factory()
    const top = () => wrapper.findAll('button')[0]
    expect(wrapper.findAllComponents(AppIcon)[0].props('name')).toBe(
      'chevron-double-left',
    )
    expect(top().attributes('aria-expanded')).toBe('false')
    expect(top().attributes('aria-label')).toBe('common.open_side_menu')

    await wrapper.setProps({ expanded: true })
    expect(wrapper.findAllComponents(AppIcon)[0].props('name')).toBe(
      'chevron-double-right',
    )
    expect(top().attributes('aria-expanded')).toBe('true')
    expect(top().attributes('aria-label')).toBe('common.close_side_menu')
  })
})
