import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import AppList from '@/components/list/AppList.vue'
import ListHeader from '@/components/list/ListHeader.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import {
  LIST_CONTAINER_CLASS,
  LIST_GRID_DEFAULT_CLASS,
} from '@/components/list/types'

const rows = (count = 3) =>
  Array.from({ length: count }, (_, index) =>
    h('div', { key: index, 'data-test': 'row' }, `Row ${index}`),
  )

const mountList = (
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) =>
  mount(AppList, {
    props: { title: 'Assets', ...props },
    slots: { default: () => rows(), ...slots },
  })

const container = (wrapper: ReturnType<typeof mountList>) =>
  wrapper.get('[data-testid="list-rows"]').element.parentElement as HTMLElement

describe('AppList — design-library List (MEW-2467)', () => {
  it('defaults to the rows layout: one padded white container, rows 2px apart, no header', () => {
    const wrapper = mountList()
    for (const cls of LIST_CONTAINER_CLASS.split(' ')) {
      expect(container(wrapper).classList).toContain(cls)
    }
    expect(container(wrapper).classList).toContain('bg-background-alternative')
    expect(wrapper.get('[data-testid="list-rows"]').classes()).toContain(
      'gap-0.5',
    )
    expect(wrapper.findComponent(ListHeader).exists()).toBe(false)
    expect(wrapper.attributes('aria-label')).toBeUndefined()
  })

  it('fills the rows container grey with surface="alternative"', () => {
    const wrapper = mountList({ surface: 'alternative' })
    expect(container(wrapper).classList).toContain('bg-background-default')
  })

  it('wraps every slotted child, v-for rows included, in a listitem of a list', () => {
    const wrapper = mountList({}, { default: () => [rows(2), h('i')] })
    const list = wrapper.get('[role="list"]')
    const items = list.findAll(':scope > [role="listitem"]')
    expect(items).toHaveLength(3)
    expect(items[0].find('[data-test="row"]').exists()).toBe(true)
  })

  it('puts the M title-only header inside the rows container', () => {
    const wrapper = mountList({ header: 'inside', description: 'Hidden' })
    const header = wrapper.getComponent(ListHeader)
    expect(container(wrapper).contains(header.element)).toBe(true)
    expect(header.getComponent(AppContentGroup).props('size')).toBe('m')
    expect(header.getComponent(AppContentGroup).props('description')).toBe(
      undefined,
    )
    expect(wrapper.attributes('aria-label')).toBe('Assets')
  })

  it('puts the L title + description header above the list, 12px away', () => {
    const wrapper = mountList({ header: 'outside', description: 'Information' })
    const header = wrapper.getComponent(ListHeader)
    expect(container(wrapper).contains(header.element)).toBe(false)
    expect(header.getComponent(AppContentGroup).props()).toMatchObject({
      size: 'l',
      description: 'Information',
    })
    expect(wrapper.classes()).toContain('gap-3')
  })

  it('moves an inside header outside for spaced rows and grids, as Figma only draws those', () => {
    for (const layout of ['spaced', 'grid']) {
      const wrapper = mountList({ layout, header: 'inside' })
      const header = wrapper.getComponent(ListHeader)
      expect(container(wrapper).contains(header.element)).toBe(false)
      expect(header.getComponent(AppContentGroup).props('size')).toBe('l')
    }
  })

  it('lays spaced rows 8px apart with no container fill', () => {
    const wrapper = mountList({ layout: 'spaced' })
    expect(wrapper.get('[data-testid="list-rows"]').classes()).toContain(
      'gap-2',
    )
    expect(container(wrapper).className).not.toContain('bg-background')
    expect(container(wrapper).className).not.toContain('p-1')
  })

  it('lays cards on a 12px grid with responsive columns, overridable with gridClass', () => {
    const grid = mountList({ layout: 'grid' }).get('[data-testid="list-rows"]')
    expect(grid.classes()).toEqual(
      expect.arrayContaining([
        'grid',
        'gap-3',
        ...LIST_GRID_DEFAULT_CLASS.split(' '),
      ]),
    )

    const custom = mountList({ layout: 'grid', gridClass: 'grid-cols-4' }).get(
      '[data-testid="list-rows"]',
    )
    expect(custom.classes()).toContain('grid-cols-4')
    expect(custom.classes()).not.toContain('sm:grid-cols-2')
  })

  it('renders the action as a labelled Button Icon and emits action', async () => {
    const wrapper = mountList({
      header: 'inside',
      action: { icon: 'star', label: 'Add to watchlist' },
    })
    const button = wrapper.getComponent(AppBtnIcon)
    expect(button.props()).toMatchObject({
      icon: 'star',
      label: 'Add to watchlist',
    })
    await button.trigger('click')
    expect(wrapper.emitted('action')).toHaveLength(1)
  })

  it('lets #header-action replace the action and #header-extra fill the 32px slot', () => {
    const wrapper = mountList(
      { header: 'outside', action: { icon: 'star', label: 'Star' } },
      {
        'header-action': '<button data-test="custom-action" />',
        'header-extra': '<span data-test="extra" />',
      },
    )
    expect(wrapper.find('[data-test="custom-action"]').exists()).toBe(true)
    expect(wrapper.findComponent(AppBtnIcon).exists()).toBe(false)
    const extra = wrapper.get('[data-testid="list-header-extra"]')
    expect(extra.classes()).toContain('size-8')
    expect(extra.find('[data-test="extra"]').exists()).toBe(true)
  })

  it('renders no extra slot box when #header-extra is empty', () => {
    const wrapper = mountList({ header: 'inside' })
    expect(wrapper.find('[data-testid="list-header-extra"]').exists()).toBe(
      false,
    )
  })

  it('sends attrs to the section', () => {
    const wrapper = mountList({ class: 'max-w-100', 'data-test': 'assets' })
    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.classes()).toContain('max-w-100')
    expect(wrapper.attributes('data-test')).toBe('assets')
  })
})
