import { describe, it, expect, afterEach } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppMenuList from '@/components/menu_list/AppMenuList.vue'
import AppCell from '@/components/cell/AppCell.vue'
import AppSearchbar from '@/components/AppSearchbar.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import { flattenVNodes } from '@/utils/flattenVNodes'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { common: { search: 'Search', clear_icon: 'Clear' } } },
})

const TITLES = ['Ethereum', 'Base', 'Polygon']

const optionRows = (titles = TITLES) =>
  titles.map(title =>
    h(AppCell, {
      key: title,
      size: 'small',
      inset: true,
      role: 'option',
      title,
    }),
  )

const mountMenu = (
  props: Record<string, unknown> = {},
  rows: () => unknown = () => optionRows(),
) =>
  mount(AppMenuList, {
    props: { ariaLabel: 'Networks', ...props },
    slots: { default: rows },
    global: { plugins: [i18n] },
    attachTo: document.body,
  })

const rowsOf = (wrapper: ReturnType<typeof mountMenu>) =>
  wrapper.findAll('[role="option"]').map(row => row.element as HTMLElement)

const lastSearch = (wrapper: ReturnType<typeof mountMenu>) => {
  const emitted = wrapper.emitted('update:search') ?? []
  return emitted[emitted.length - 1]
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('AppMenuList — design-library Menu List (MEW-2466)', () => {
  it('renders the Figma panel with the searchbar and the rows inside a named listbox', () => {
    const wrapper = mountMenu()
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'rounded-16',
        'bg-background-alternative',
        'p-1',
        'shadow-button',
      ]),
    )
    expect(wrapper.findComponent(AppSearchbar).props('variant')).toBe('default')
    const list = wrapper.get('[data-testid="menu-list-rows"]')
    expect(list.attributes('role')).toBe('listbox')
    expect(list.attributes('aria-label')).toBe('Networks')
    expect(list.findAll('[role="option"]')).toHaveLength(3)
  })

  it('drops the searchbar with searchable=false and switches to a menu with role="menu"', () => {
    const wrapper = mountMenu({ searchable: false, role: 'menu' })
    expect(wrapper.findComponent(AppSearchbar).exists()).toBe(false)
    expect(
      wrapper.get('[data-testid="menu-list-rows"]').attributes('role'),
    ).toBe('menu')
  })

  it('styles the scrollbar by default, hides it with scrollbar=false and applies listClass', () => {
    const list = mountMenu().get('[data-testid="menu-list-rows"]')
    expect(list.classes()).toEqual(
      expect.arrayContaining(['menu-list-scrollbar', 'pr-1', 'max-h-80']),
    )

    const hidden = mountMenu({ scrollbar: false, listClass: 'max-h-96' }).get(
      '[data-testid="menu-list-rows"]',
    )
    expect(hidden.classes()).toContain('no-scrollbar')
    expect(hidden.classes()).toContain('max-h-96')
    expect(hidden.classes()).not.toContain('menu-list-scrollbar')
  })

  it('sends attrs to the panel, not the rows region', () => {
    const wrapper = mountMenu({ class: 'w-75', 'data-test': 'panel' })
    expect(wrapper.attributes('data-test')).toBe('panel')
    expect(wrapper.classes()).toContain('w-75')
    expect(
      wrapper.get('[data-testid="menu-list-rows"]').attributes('data-test'),
    ).toBeUndefined()
  })

  it('emits update:search as the field is typed in', async () => {
    const wrapper = mountMenu()
    await wrapper.get('input').setValue('ba')
    expect(lastSearch(wrapper)).toEqual(['ba'])
  })

  it('makes the rows a single Tab stop', () => {
    const rows = rowsOf(mountMenu())
    expect(rows.map(row => row.tabIndex)).toEqual([0, -1, -1])
  })

  it('moves focus with ↓/↑ without wrapping, and Home/End jump to the ends', async () => {
    const wrapper = mountMenu({ searchable: false })
    const rows = rowsOf(wrapper)
    rows[0].focus()

    await wrapper
      .findAll('[role="option"]')[0]
      .trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(rows[1])
    expect(rows.map(row => row.tabIndex)).toEqual([-1, 0, -1])

    await wrapper
      .findAll('[role="option"]')[1]
      .trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(rows[2])

    await wrapper
      .findAll('[role="option"]')[2]
      .trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(rows[2])

    await wrapper
      .findAll('[role="option"]')[2]
      .trigger('keydown', { key: 'Home' })
    expect(document.activeElement).toBe(rows[0])

    await wrapper
      .findAll('[role="option"]')[0]
      .trigger('keydown', { key: 'ArrowUp' })
    expect(document.activeElement).toBe(rows[0])
  })

  it('hands focus between the searchbar and the rows', async () => {
    const wrapper = mountMenu()
    const input = wrapper.get('input')
    const rows = rowsOf(wrapper)

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(rows[0])

    await wrapper
      .findAll('[role="option"]')[0]
      .trigger('keydown', { key: 'ArrowUp' })
    expect(document.activeElement).toBe(input.element)
  })

  it('sends a printable key typed on a row back to the searchbar', async () => {
    const wrapper = mountMenu({ search: 'ba' })
    const rows = rowsOf(wrapper)
    rows[1].focus()

    await wrapper.findAll('[role="option"]')[1].trigger('keydown', { key: 's' })
    await nextTick()
    expect(lastSearch(wrapper)).toEqual(['bas'])
    expect(document.activeElement).toBe(wrapper.get('input').element)
  })

  it('leaves Space on a row to the row and ignores keys from controls inside it', async () => {
    const clicks = ref(0)
    const wrapper = mountMenu({}, () => [
      h(AppCell, {
        role: 'option',
        title: 'Ethereum',
        onClick: () => clicks.value++,
      }),
    ])
    await wrapper.get('[role="option"]').trigger('keydown', { key: ' ' })
    expect(clicks.value).toBe(1)
    expect(wrapper.emitted('update:search')).toBeUndefined()
  })

  it('skips disabled rows', () => {
    const wrapper = mountMenu({ searchable: false }, () => [
      h(AppCell, { role: 'option', title: 'On' }),
      h(AppCell, { role: 'option', title: 'Off', disabled: true }),
    ])
    const [enabled, disabled] = rowsOf(wrapper)
    expect(enabled.tabIndex).toBe(0)
    expect(disabled.getAttribute('aria-disabled')).toBe('true')
    expect(disabled.hasAttribute('tabindex')).toBe(false)
  })

  it('puts an aria-hidden divider between every row with divided, v-for rows included', () => {
    const wrapper = mountMenu({ divided: true }, () => [optionRows()])
    const dividers = wrapper.findAllComponents(AppDivider)
    expect(dividers).toHaveLength(2)
    expect(dividers[0].attributes('aria-hidden')).toBe('true')
    expect(wrapper.findAllComponents(AppDivider)).toHaveLength(
      TITLES.length - 1,
    )
  })

  it('renders no dividers of its own without divided', () => {
    expect(mountMenu().findAllComponents(AppDivider)).toHaveLength(0)
  })

  it('exposes focusSearch and focusRow for the popover owner', () => {
    const wrapper = mountMenu()
    const exposed = wrapper.vm as unknown as {
      focusSearch: () => void
      focusRow: (index: number) => void
    }
    exposed.focusRow(2)
    expect(document.activeElement).toBe(rowsOf(wrapper)[2])
    exposed.focusSearch()
    expect(document.activeElement).toBe(wrapper.get('input').element)
  })

  it('moves the Tab stop to a row once it takes focus', async () => {
    const wrapper = mountMenu()
    await wrapper.findAll('[role="option"]')[2].trigger('focusin')
    expect(rowsOf(wrapper).map(row => row.tabIndex)).toEqual([-1, -1, 0])
  })

  it('keeps a Tab stop when filtering removes the active row', async () => {
    const titles = ref(TITLES)
    const Host = defineComponent(
      () => () =>
        h(AppMenuList, { ariaLabel: 'Networks' }, () =>
          optionRows(titles.value),
        ),
    )
    const wrapper = mount(Host, { global: { plugins: [i18n] } })
    const menu = wrapper.findComponent(AppMenuList)
    ;(menu.vm as unknown as { focusRow: (i: number) => void }).focusRow(2)

    titles.value = ['Ethereum']
    await nextTick()
    expect(
      wrapper
        .findAll('[role="option"]')
        .map(row => (row.element as HTMLElement).tabIndex),
    ).toEqual([0])
  })
})

describe('flattenVNodes', () => {
  it('unwraps fragments and drops comments and blank text', () => {
    const Fragmented = defineComponent({
      setup(_, { slots }) {
        return () =>
          h(
            'div',
            flattenVNodes(slots.default?.()).map(() => h('i')),
          )
      },
    })
    const wrapper = mount(Fragmented, {
      slots: {
        default: () => [[h('a'), h('b')], h('c')],
      },
    })
    expect(wrapper.findAll('i')).toHaveLength(3)
  })
})
