import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (k: string) => k }) }))

import AppActionBar from '@/components/action_bar/AppActionBar.vue'
import type { ActionBarItem } from '@/components/action_bar/types'

const items: ActionBarItem[] = [
  { id: 'trade', icon: 'chart-bar', label: 'Trade' },
  { id: 'swap', icon: 'arrow-path-rounded-square', label: 'Swap' },
  { id: 'send', icon: 'paper-airplane', label: 'Send', disabled: true },
]

const factory = (props: Record<string, unknown> = {}) =>
  mount(AppActionBar, { props: { items, ...props } })

describe('AppActionBar', () => {
  it('renders one button per item inside a nav', () => {
    const wrapper = factory()
    expect(wrapper.get('nav').attributes('aria-label')).toBe(
      'common.wallet_actions',
    )
    expect(wrapper.findAll('button')).toHaveLength(items.length)
    expect(wrapper.findAll('li')).toHaveLength(items.length)
  })

  it('emits select with the item id', async () => {
    const wrapper = factory()
    await wrapper.get('[data-action-id="swap"]').trigger('click')
    expect(wrapper.emitted('select')).toEqual([['swap']])
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

  it('has no top action: the drawer owns its close button', () => {
    const wrapper = factory()
    expect(wrapper.get('nav').element.firstElementChild?.tagName).toBe('UL')
  })
})
