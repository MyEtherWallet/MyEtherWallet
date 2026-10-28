import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import AppInfoCell from '@/components/cell/AppInfoCell.vue'
import AppCellRightAccessory from '@/components/cell/AppCellRightAccessory.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import {
  CELL_SURFACE_BG_CLASS,
  INFO_CELL_SIZE_SPEC,
} from '@/components/cell/cellSizes'
import { AVATAR_SIZES } from '@/components/avatar/types'

const avatarSlots = {
  avatar: (scope: { size: string }) =>
    h('i', { 'data-test': 'avatar', 'data-size': scope.size }),
  'trailing-avatar': (scope: { size: string }) =>
    h('i', { 'data-test': 'trailing-avatar', 'data-size': scope.size }),
}

const mountInfoCell = (props: Record<string, unknown> = {}, slots = {}) =>
  mount(AppInfoCell, {
    props: {
      title: 'Title',
      description: 'Information',
      trailingTitle: 'Trailing',
      trailingDescription: 'Details',
      ...props,
    },
    slots,
  })

const row = (wrapper: ReturnType<typeof mountInfoCell>) =>
  wrapper.get('[data-testid="info-cell"]')

describe('AppInfoCell — design-library InfoCell (MEW-2464)', () => {
  it('uses its own Figma box per size, radius 16, no hover or pressed look', () => {
    for (const size of ['medium', 'small'] as const) {
      const classes = row(mountInfoCell({ size })).classes()
      for (const cls of INFO_CELL_SIZE_SPEC[size].cell.split(' ')) {
        expect(classes).toContain(cls)
      }
      expect(classes).toContain('rounded-16')
      expect(classes.some(cls => cls.startsWith('hover:'))).toBe(false)
      expect(classes.some(cls => cls.startsWith('active:'))).toBe(false)
    }
  })

  it('fills white on the default style and grey on alternative', () => {
    expect(row(mountInfoCell()).classes()).toContain(
      CELL_SURFACE_BG_CLASS.default,
    )
    expect(row(mountInfoCell({ surface: 'alternative' })).classes()).toContain(
      CELL_SURFACE_BG_CLASS.alternative,
    )
  })

  it('hands L avatars at M and XS at S to both avatar slots', () => {
    const medium = mountInfoCell({}, avatarSlots)
    expect(medium.get('[data-test="avatar"]').attributes('data-size')).toBe('l')
    expect(
      medium.get('[data-test="trailing-avatar"]').attributes('data-size'),
    ).toBe('l')
    const small = mountInfoCell({ size: 'small' }, avatarSlots)
    expect(small.get('[data-test="avatar"]').attributes('data-size')).toBe('xs')
  })

  it('renders a left and a right-aligned Content Group', () => {
    const groups = mountInfoCell().findAllComponents(AppContentGroup)
    expect(groups).toHaveLength(2)
    expect(groups[0].props()).toMatchObject({
      title: 'Title',
      description: 'Information',
      align: 'left',
    })
    expect(groups[1].props()).toMatchObject({
      title: 'Trailing',
      description: 'Details',
      align: 'right',
    })
  })

  it('is title only at S, with the leading title in the inverted style', () => {
    const [leading, trailing] = mountInfoCell({
      size: 'small',
    }).findAllComponents(AppContentGroup)
    expect(leading.props('description')).toBeUndefined()
    expect(leading.props('inverted')).toBe(true)
    expect(trailing.props('description')).toBeUndefined()
    expect(trailing.props('inverted')).toBe(false)
  })

  it('swaps the trailing group for the right accessory, and the slot wins over both', () => {
    const swapped = mountInfoCell({
      rightAccessory: { kind: 'balance', primary: '$1' },
    })
    expect(swapped.findComponent(AppCellRightAccessory).exists()).toBe(true)
    expect(swapped.findAllComponents(AppContentGroup)).toHaveLength(1)

    const custom = mountInfoCell(
      { rightAccessory: { kind: 'balance', primary: '$1' } },
      { accessory: '<span data-test="custom" />' },
    )
    expect(custom.find('[data-test="custom"]').exists()).toBe(true)
    expect(custom.findComponent(AppCellRightAccessory).exists()).toBe(false)
  })

  it('mirrors selected on a leading checkbox and a trailing radio, as inert controls', () => {
    const wrapper = mountInfoCell(
      { checkbox: true, radio: true, selected: true },
      avatarSlots,
    )
    const element = row(wrapper).element
    expect(element.firstElementChild?.getAttribute('data-test')).toBe(
      'info-cell-checkbox',
    )
    expect(element.lastElementChild?.getAttribute('data-test')).toBe(
      'info-cell-radio',
    )
    for (const selector of [
      '[data-test="info-cell-checkbox"]',
      '[data-test="info-cell-radio"]',
    ]) {
      expect(wrapper.get(selector).attributes()).toHaveProperty('inert')
      expect(
        wrapper.get<HTMLInputElement>(`${selector} input`).element.checked,
      ).toBe(true)
    }
    expect(row(wrapper).attributes('aria-pressed')).toBe('true')
  })

  it('is a keyboard row button that emits click; slot controls do not bubble', async () => {
    const wrapper = mountInfoCell(
      {},
      {
        prefix: '<button data-test="prefix" />',
        action: '<button data-test="action" />',
        suffix: '<button data-test="suffix" />',
        extra: '<button data-test="extra" />',
      },
    )
    expect(row(wrapper).attributes('role')).toBe('button')
    await row(wrapper).trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('click')).toHaveLength(1)
    for (const slot of ['prefix', 'action', 'suffix', 'extra']) {
      await wrapper.get(`[data-test="${slot}"]`).trigger('click')
    }
    expect(wrapper.emitted('click')).toHaveLength(1)

    const passive = mountInfoCell({ interactive: false })
    expect(row(passive).attributes('role')).toBeUndefined()
    await row(passive).trigger('click')
    expect(passive.emitted('click')).toBeUndefined()
  })

  it('loads with avatar-sized skeletons, the Content Group skeleton and no actions', async () => {
    const wrapper = mountInfoCell(
      { loading: true },
      {
        ...avatarSlots,
        action: '<button data-test="action" />',
        suffix: '<button data-test="suffix" />',
      },
    )
    expect(row(wrapper).attributes('aria-busy')).toBe('true')
    const box = `${AVATAR_SIZES.l.box}px`
    for (const selector of [
      '[data-test="info-cell-skeleton-avatar"]',
      '[data-test="info-cell-skeleton-trailing-avatar"]',
    ]) {
      expect(wrapper.get(selector).attributes('style')).toContain(
        `width: ${box}`,
      )
    }
    const groups = wrapper.findAllComponents(AppContentGroup)
    expect(groups).toHaveLength(1)
    expect(groups[0].props('loading')).toBe(true)
    expect(wrapper.find('[data-test="action"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="suffix"]').exists()).toBe(false)
    await row(wrapper).trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
