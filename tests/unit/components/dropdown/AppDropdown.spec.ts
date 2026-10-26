import { describe, it, expect, afterEach, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppDropdown from '@/components/dropdown/AppDropdown.vue'
import AppMenuList from '@/components/menu_list/AppMenuList.vue'
import AppCell from '@/components/cell/AppCell.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { common: { search: 'Search', clear_icon: 'Clear' } } },
})

const TITLES = ['Ethereum', 'Base', 'Polygon']

const mountDropdown = (
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) =>
  mount(AppDropdown, {
    props: { title: 'Network', ...props },
    slots: {
      default: () =>
        TITLES.map(title =>
          h(AppCell, {
            key: title,
            size: 'small',
            inset: true,
            role: 'option',
            title,
          }),
        ),
      ...slots,
    },
    global: { plugins: [i18n] },
    attachTo: document.body,
  })

const trigger = (wrapper: ReturnType<typeof mountDropdown>) =>
  wrapper.get('[data-testid="dropdown-trigger"]')

const openMenu = async (wrapper: ReturnType<typeof mountDropdown>) => {
  await trigger(wrapper).trigger('click')
  await flushPromises()
}

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('AppDropdown — design-library Dropdown (MEW-2468)', () => {
  it('starts closed: no menu, collapsed trigger that announces a listbox', () => {
    const wrapper = mountDropdown()
    expect(wrapper.findComponent(AppMenuList).exists()).toBe(false)
    expect(trigger(wrapper).attributes()).toMatchObject({
      'aria-haspopup': 'listbox',
      'aria-expanded': 'false',
    })
    expect(trigger(wrapper).attributes('aria-controls')).toBeUndefined()
  })

  it('opens on click with the menu wired to the trigger', async () => {
    const wrapper = mountDropdown()
    await openMenu(wrapper)
    const list = wrapper.get('[data-testid="menu-list-rows"]')
    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true')
    expect(trigger(wrapper).attributes('aria-controls')).toBe(
      list.attributes('id'),
    )
    expect(list.attributes('aria-labelledby')).toBe(
      trigger(wrapper).attributes('id'),
    )
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    expect(wrapper.find('.rotate-180').exists()).toBe(true)
  })

  it('moves focus to the first row on open, or to the search field when searchable', async () => {
    const plain = mountDropdown()
    await openMenu(plain)
    expect(document.activeElement).toBe(plain.find('[role="option"]').element)
    plain.unmount()

    const searchable = mountDropdown({ searchable: true })
    await openMenu(searchable)
    expect(document.activeElement).toBe(searchable.get('input').element)
  })

  it('leaves focus on the trigger when opened with the pointer', async () => {
    const wrapper = mountDropdown({ searchable: true })
    ;(trigger(wrapper).element as HTMLButtonElement).focus()
    // A pointer click counts ≥ 1 (Test Utils can't set `detail` itself).
    trigger(wrapper).element.dispatchEvent(
      new MouseEvent('click', { bubbles: true, detail: 1 }),
    )
    await flushPromises()
    expect(wrapper.findComponent(AppMenuList).exists()).toBe(true)
    expect(document.activeElement).toBe(trigger(wrapper).element)
  })

  it('opens with ↓ on the trigger', async () => {
    const wrapper = mountDropdown()
    await trigger(wrapper).trigger('keydown', { key: 'ArrowDown' })
    await flushPromises()
    expect(wrapper.findComponent(AppMenuList).exists()).toBe(true)
    expect(document.activeElement).toBe(wrapper.find('[role="option"]').element)
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const wrapper = mountDropdown()
    await openMenu(wrapper)
    await wrapper.find('[role="option"]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.findComponent(AppMenuList).exists()).toBe(false)
    expect(document.activeElement).toBe(trigger(wrapper).element)
  })

  it('closes when focus leaves the dropdown', async () => {
    const outside = document.createElement('button')
    document.body.appendChild(outside)
    const wrapper = mountDropdown()
    await openMenu(wrapper)
    await wrapper
      .find('[role="option"]')
      .trigger('focusout', { relatedTarget: outside })
    expect(wrapper.findComponent(AppMenuList).exists()).toBe(false)
  })

  it('closes on a click outside without taking focus back', async () => {
    const wrapper = mountDropdown()
    await openMenu(wrapper)
    document.body.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true }),
    )
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.findComponent(AppMenuList).exists()).toBe(false)
    expect(document.activeElement).not.toBe(trigger(wrapper).element)
  })

  it('closes once a row is picked by click or keyboard, unless closeOnSelect is off', async () => {
    const byClick = mountDropdown()
    await openMenu(byClick)
    await byClick.find('[role="option"]').trigger('click')
    expect(byClick.findComponent(AppMenuList).exists()).toBe(false)
    byClick.unmount()

    const byEnter = mountDropdown()
    await openMenu(byEnter)
    await byEnter.find('[role="option"]').trigger('keydown', { key: 'Enter' })
    expect(byEnter.findComponent(AppMenuList).exists()).toBe(false)
    byEnter.unmount()

    const stays = mountDropdown({ closeOnSelect: false })
    await openMenu(stays)
    await stays.find('[role="option"]').trigger('click')
    expect(stays.findComponent(AppMenuList).exists()).toBe(true)
  })

  it('hands the default slot a close function', async () => {
    const wrapper = mountDropdown(
      { closeOnSelect: false },
      {
        default: ({ close }: { close: () => void }) =>
          h('button', { 'data-test': 'done', onClick: close }),
      },
    )
    await openMenu(wrapper)
    await wrapper.get('[data-test="done"]').trigger('click')
    expect(wrapper.findComponent(AppMenuList).exists()).toBe(false)
  })

  it('stays open while v-model:open is controlled and the parent keeps it open', async () => {
    const wrapper = mountDropdown({ open: true, 'onUpdate:open': () => {} })
    await trigger(wrapper).trigger('click')
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(wrapper.findComponent(AppMenuList).exists()).toBe(true)
  })

  it('does not open while disabled', async () => {
    const wrapper = mountDropdown({ disabled: true })
    expect(trigger(wrapper).attributes('disabled')).toBeDefined()
    await trigger(wrapper).trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.findComponent(AppMenuList).exists()).toBe(false)
  })

  it('draws the hairline only for M on default and the suffix only at M', () => {
    const mDefault = mountDropdown({}, { suffix: '<i />' })
    expect(trigger(mDefault).classes()).toContain('ring-border-default')
    expect(mDefault.find('[data-testid="dropdown-suffix"]').exists()).toBe(true)

    const mAlternative = mountDropdown({ surface: 'alternative' })
    expect(trigger(mAlternative).classes()).not.toContain('ring-border-default')

    const small = mountDropdown({ size: 's' }, { suffix: '<i />' })
    expect(trigger(small).classes()).toContain('rounded-full')
    expect(small.find('[data-testid="dropdown-suffix"]').exists()).toBe(false)
  })

  it('opens the menu at the trigger width for M and at 240px for S', async () => {
    const medium = mountDropdown()
    await openMenu(medium)
    expect(medium.getComponent(AppMenuList).classes()).toContain('right-0')
    medium.unmount()

    const small = mountDropdown({ size: 's' })
    await openMenu(small)
    expect(small.getComponent(AppMenuList).classes()).toContain('w-60')
  })

  it('forwards the search query both ways', async () => {
    const wrapper = mountDropdown({ searchable: true })
    await openMenu(wrapper)
    await wrapper.get('input').setValue('ba')
    expect(wrapper.emitted('update:search')?.[0]).toEqual(['ba'])
  })

  it('opens above the trigger when the menu does not fit below', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 900,
      bottom: 952,
    } as DOMRect)
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(960)
    // jsdom lays nothing out; give the panel its Figma height.
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(208)
    const wrapper = mountDropdown()
    await openMenu(wrapper)
    expect(wrapper.getComponent(AppMenuList).classes()).toContain('bottom-full')
  })

  it('opens below when there is room', async () => {
    const wrapper = mountDropdown()
    await openMenu(wrapper)
    expect(wrapper.getComponent(AppMenuList).classes()).toContain('top-full')
  })
})
