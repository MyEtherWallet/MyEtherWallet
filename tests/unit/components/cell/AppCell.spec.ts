import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppCell from '@/components/cell/AppCell.vue'
import AppCellRightAccessory from '@/components/cell/AppCellRightAccessory.vue'
import AppCellWatchlistToggle from '@/components/cell/AppCellWatchlistToggle.vue'
import {
  type CellRightAccessory,
  CELL_SIZE_SPEC,
  CELL_SURFACE_BG_CLASS,
  CELL_SURFACE_INTERACTIVE_CLASS,
} from '@/components/cell/cellSizes'
import { AVATAR_SIZES } from '@/components/avatar/types'

const avatarSlot = {
  avatar: (scope: { size: string }) =>
    h('i', { 'data-test': 'avatar', 'data-size': scope.size }),
}
const accessorySlot = { accessory: '<span data-test="accessory">$1</span>' }
const BALANCE: CellRightAccessory = {
  kind: 'balance',
  primary: '$1,230',
  secondary: '1,230 USDC',
}

const i18n = createI18n({ legacy: false, locale: 'en', missingWarn: false })

const mountCell = (props: Record<string, unknown> = {}, slots = {}) =>
  mount(AppCell, {
    props: { title: 'Title', description: 'Information', ...props },
    slots,
  })

describe('AppCell — design-library Cell (MEW-2195)', () => {
  it('defaults to the white (background/alternative) surface at medium size', () => {
    const cls = mountCell().classes()
    expect(cls).toContain('bg-background-alternative')
    expect(cls).toContain('hover:bg-background-alternative-hover')
    expect(cls).toContain('active:bg-background-alternative-pressed')
    expect(cls).toContain(CELL_SIZE_SPEC.medium.cell.split(' ')[0])
  })

  it('renders surface="alternative" on the grey background/default with its own hover pair', () => {
    const cls = mountCell({ surface: 'alternative' }).classes()
    expect(cls).toContain('bg-background-default')
    expect(cls).toContain('hover:bg-background-default-hover')
    expect(cls).toContain('active:bg-background-default-pressed')
    expect(cls).not.toContain('bg-background-alternative')
  })

  it('only binds semantic colour tokens (no raw or legacy palette classes)', () => {
    const all = [
      ...Object.values(CELL_SURFACE_BG_CLASS),
      ...Object.values(CELL_SURFACE_INTERACTIVE_CLASS),
    ]
      .join(' ')
      .split(' ')
    for (const cls of all) {
      expect(cls).toMatch(/^(hover:|active:)?bg-background-/)
    }
  })

  it('shows the brand focus border only while interactive', () => {
    expect(mountCell().classes()).toContain('focus-visible:border-border-focus')
    expect(mountCell({ interactive: false }).classes()).not.toContain(
      'focus-visible:border-border-focus',
    )
  })

  it('hands the avatar slot the Avatar size that matches the cell size', () => {
    expect(
      mountCell({ size: 'medium' }, avatarSlot)
        .get('[data-test="avatar"]')
        .attributes('data-size'),
    ).toBe(CELL_SIZE_SPEC.medium.avatar)
    const small = mountCell({ size: 'small' }, avatarSlot)
    expect(small.classes()).toContain(CELL_SIZE_SPEC.small.cell.split(' ')[0])
    expect(small.get('[data-test="avatar"]').attributes('data-size')).toBe(
      CELL_SIZE_SPEC.small.avatar,
    )
  })

  it('renders title and description through AppContentGroup', () => {
    const w = mountCell()
    expect(w.get('[data-testid="cg-title"]').text()).toBe('Title')
    expect(w.get('[data-testid="cg-description"]').text()).toBe('Information')
  })

  it('lets a title slot replace the title prop', () => {
    const w = mountCell({}, { title: '<b data-test="custom-title">ETH</b>' })
    expect(w.find('[data-test="custom-title"]').exists()).toBe(true)
    expect(w.text()).not.toContain('Title')
  })

  it('renders the rightAccessory prop through AppCellRightAccessory', () => {
    const w = mountCell({ rightAccessory: BALANCE })
    const accessory = w.getComponent(AppCellRightAccessory)
    expect(accessory.props('accessory')).toEqual(BALANCE)
    expect(accessory.text()).toContain('$1,230')
    expect(accessory.text()).toContain('1,230 USDC')
  })

  it('renders no right side without rightAccessory or accessory slot', () => {
    expect(mountCell().findComponent(AppCellRightAccessory).exists()).toBe(
      false,
    )
  })

  it('lets the accessory slot replace the rightAccessory prop', () => {
    const w = mountCell({ rightAccessory: BALANCE }, accessorySlot)
    expect(w.find('[data-test="accessory"]').exists()).toBe(true)
    expect(w.findComponent(AppCellRightAccessory).exists()).toBe(false)
  })

  it('emits click when interactive and exposes button semantics', async () => {
    const w = mountCell()
    expect(w.attributes('role')).toBe('button')
    expect(w.attributes('tabindex')).toBe('0')
    await w.trigger('click')
    expect(w.emitted('click')).toHaveLength(1)
  })

  it('emits click on Enter and Space', async () => {
    const w = mountCell()
    await w.trigger('keydown.enter')
    await w.trigger('keydown.space')
    expect(w.emitted('click')).toHaveLength(2)
  })

  it('does not emit click and keeps the resting background when disabled', async () => {
    const w = mountCell({ disabled: true })
    await w.trigger('click')
    expect(w.emitted('click')).toBeUndefined()
    expect(w.classes()).toContain('opacity-30')
    expect(w.classes()).toContain('bg-background-alternative')
    expect(w.classes()).not.toContain('hover:bg-background-alternative-hover')
    expect(w.attributes('role')).toBeUndefined()
    expect(w.attributes('aria-disabled')).toBe('true')
  })

  it('opts out of hover, cursor and button role when interactive=false', async () => {
    const w = mountCell({ interactive: false })
    expect(w.classes()).not.toContain('hover:bg-background-alternative-hover')
    expect(w.classes()).not.toContain('cursor-pointer')
    expect(w.attributes('role')).toBeUndefined()
    await w.trigger('click')
    expect(w.emitted('click')).toBeUndefined()
  })

  it('overlays a dark check badge top-left of the avatar when selected', () => {
    const w = mountCell({ selected: true }, avatarSlot)
    const badge = w.get('[data-test="cell-selected-badge"]')
    const { badgeBox } = AVATAR_SIZES[CELL_SIZE_SPEC.medium.avatar]
    expect(badge.attributes('style')).toContain(`width: ${badgeBox}px`)
    expect(badge.find('svg').exists()).toBe(true)
    expect(badge.find('.bg-background-contrast-default').exists()).toBe(true)
    expect(badge.find('.text-text-inverted').exists()).toBe(true)
  })

  it('renders no selected badge without selection or without an avatar', () => {
    const selector = '[data-test="cell-selected-badge"]'
    expect(
      mountCell({ selected: false }, avatarSlot).find(selector).exists(),
    ).toBe(false)
    expect(mountCell({ selected: true }).find(selector).exists()).toBe(false)
  })

  it('hides the avatar check when a checkbox or radio already shows selection', () => {
    const selector = '[data-test="cell-selected-badge"]'
    for (const control of [{ checkbox: true }, { radio: true }]) {
      expect(
        mountCell({ selected: true, ...control }, avatarSlot)
          .find(selector)
          .exists(),
      ).toBe(false)
    }
  })

  it('swaps content for skeletons while loading without changing the cell height', () => {
    const w = mountCell(
      { loading: true, rightAccessory: BALANCE },
      { ...avatarSlot },
    )
    expect(w.find('[data-test="cell-skeleton-avatar"]').exists()).toBe(true)
    expect(w.getComponent(AppCellRightAccessory).props('accessory')).toEqual({
      kind: 'loading',
    })
    expect(w.find('[data-test="avatar"]').exists()).toBe(false)
    expect(w.find('[data-testid="cg-title"]').exists()).toBe(false)
    expect(w.text()).not.toContain('Title')
    expect(w.classes()).toContain(CELL_SIZE_SPEC.medium.cell.split(' ')[0])
    expect(w.attributes('aria-busy')).toBe('true')
  })

  it('sizes the loading avatar like the avatar it stands in for', () => {
    for (const size of ['medium', 'small'] as const) {
      const { box } = AVATAR_SIZES[CELL_SIZE_SPEC[size].avatar]
      const skeleton = mountCell({ loading: true, size }, avatarSlot).get(
        '[data-test="cell-skeleton-avatar"]',
      )
      expect(skeleton.attributes('style')).toContain(`width: ${box}px`)
      expect(skeleton.attributes('style')).toContain(`height: ${box}px`)
    }
  })

  it('does not emit click while loading', async () => {
    const w = mountCell({ loading: true })
    await w.trigger('click')
    expect(w.emitted('click')).toBeUndefined()
  })

  it('stops prefix and suffix clicks from bubbling into the cell click', async () => {
    const w = mountCell(
      {},
      {
        prefix: '<button data-test="prefix">★</button>',
        suffix: '<button data-test="suffix">…</button>',
      },
    )
    await w.get('[data-test="prefix"]').trigger('click')
    await w.get('[data-test="suffix"]').trigger('click')
    expect(w.emitted('click')).toBeUndefined()
  })

  it('renders the indicator slot as a decorative glyph that lets clicks reach the cell', async () => {
    const w = mountCell({}, { indicator: '<i data-test="indicator">v</i>' })
    const wrapper = w.get('[data-test="indicator"]').element.parentElement!
    expect(wrapper.getAttribute('aria-hidden')).toBe('true')
    await w.get('[data-test="indicator"]').trigger('click')
    expect(w.emitted('click')).toHaveLength(1)
  })

  it('keeps the indicator while loading, unlike the action slots', () => {
    const w = mountCell(
      { loading: true },
      {
        suffix: '<button data-test="suffix">…</button>',
        indicator: '<i data-test="indicator">v</i>',
      },
    )
    expect(w.find('[data-test="suffix"]').exists()).toBe(false)
    expect(w.find('[data-test="indicator"]').exists()).toBe(true)
  })

  it('renders the watchlist toggle in the prefix action position', async () => {
    const w = mount(AppCell, {
      props: { title: 'Title' },
      slots: { prefix: () => h(AppCellWatchlistToggle, { modelValue: true }) },
      global: { plugins: [i18n] },
    })
    const toggle = w.getComponent(AppCellWatchlistToggle)
    // Prefix action is the cell's first child, before avatar and content.
    expect(toggle.element.parentElement).toBe(w.element.firstElementChild)
    await toggle.trigger('click')
    expect(w.emitted('click')).toBeUndefined()
  })
  it('renders no checkbox or radio by default', () => {
    const w = mountCell({}, avatarSlot)
    expect(w.find('[data-test="cell-checkbox"]').exists()).toBe(false)
    expect(w.find('[data-test="cell-radio"]').exists()).toBe(false)
    expect(w.attributes('aria-pressed')).toBeUndefined()
  })

  it('puts the checkbox first and the radio last, both mirroring selected', () => {
    const w = mountCell(
      { checkbox: true, radio: true, selected: true },
      avatarSlot,
    )
    const row = w.element
    expect(row.firstElementChild?.getAttribute('data-test')).toBe(
      'cell-checkbox',
    )
    expect(row.lastElementChild?.getAttribute('data-test')).toBe('cell-radio')
    const checkboxInput = w.get<HTMLInputElement>(
      '[data-test="cell-checkbox"] input',
    ).element
    const radioInput = w.get<HTMLInputElement>(
      '[data-test="cell-radio"] input',
    ).element
    expect(checkboxInput.checked).toBe(true)
    expect(radioInput.checked).toBe(true)
    expect(w.attributes('aria-pressed')).toBe('true')
  })

  it('shows the controls unchecked while not selected', () => {
    const w = mountCell({ checkbox: true, radio: true }, avatarSlot)
    expect(
      w.get<HTMLInputElement>('[data-test="cell-checkbox"] input').element
        .checked,
    ).toBe(false)
    expect(
      w.get<HTMLInputElement>('[data-test="cell-radio"] input').element.checked,
    ).toBe(false)
    expect(w.attributes('aria-pressed')).toBe('false')
  })

  it('keeps the controls out of reach so the whole cell is the click target', async () => {
    const w = mountCell({ checkbox: true, radio: true }, avatarSlot)
    expect(w.get('[data-test="cell-checkbox"]').attributes()).toHaveProperty(
      'inert',
    )
    expect(w.get('[data-test="cell-radio"]').attributes()).toHaveProperty(
      'inert',
    )
    await w.trigger('click')
    expect(w.emitted('click')).toHaveLength(1)
  })
})
