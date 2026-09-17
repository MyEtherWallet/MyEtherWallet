import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import AppCell from '@/components/AppCell.vue'
import { CELL_SIZE_SPEC } from '@/components/cellSizes'
import { AVATAR_SIZES } from '@/components/avatar/types'

const avatarSlot = {
  avatar: (scope: { size: string }) =>
    h('i', { 'data-test': 'avatar', 'data-size': scope.size }),
}
const accessorySlot = { accessory: '<span data-test="accessory">$1</span>' }

const mountCell = (props: Record<string, unknown> = {}, slots = {}) =>
  mount(AppCell, {
    props: { title: 'Title', description: 'Information', ...props },
    slots,
  })

describe('AppCell — design-library Cell (MEW-2195)', () => {
  it('defaults to the white surface variant at medium size', () => {
    const cls = mountCell().classes()
    expect(cls).toContain('bg-white')
    expect(cls).toContain('hover:bg-bgSurface-hover')
    expect(cls).toContain('active:bg-bgSurface-pressed')
    expect(cls).toContain(CELL_SIZE_SPEC.medium.cell.split(' ')[0])
  })

  it('renders variant="base" on the grey background with its own hover pair', () => {
    const cls = mountCell({ variant: 'base' }).classes()
    expect(cls).toContain('bg-bgBase')
    expect(cls).toContain('hover:bg-bgBase-hover')
    expect(cls).toContain('active:bg-bgBase-pressed')
    expect(cls).not.toContain('bg-white')
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

  it('renders the accessory props as a right-aligned content group', () => {
    const w = mountCell({
      accessoryTitle: '$1,230',
      accessoryDescription: '1,230 USDC',
    })
    const groups = w.findAll('[data-testid="cg-root"]')
    expect(groups).toHaveLength(2)
    expect(groups[1].classes()).toContain('text-right')
    expect(groups[1].text()).toContain('$1,230')
    expect(groups[1].text()).toContain('1,230 USDC')
  })

  it('lets the accessory slot override the accessory props', () => {
    const w = mountCell({ accessoryTitle: '$1,230' }, accessorySlot)
    expect(w.find('[data-test="accessory"]').exists()).toBe(true)
    expect(w.text()).not.toContain('$1,230')
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
    expect(w.classes()).toContain('bg-white')
    expect(w.classes()).not.toContain('hover:bg-bgSurface-hover')
    expect(w.attributes('role')).toBeUndefined()
    expect(w.attributes('aria-disabled')).toBe('true')
  })

  it('opts out of hover, cursor and button role when interactive=false', async () => {
    const w = mountCell({ interactive: false })
    expect(w.classes()).not.toContain('hover:bg-bgSurface-hover')
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
    expect(badge.find('.\\!bg-bgContrast').exists()).toBe(true)
  })

  it('renders no selected badge without selection or without an avatar', () => {
    const selector = '[data-test="cell-selected-badge"]'
    expect(
      mountCell({ selected: false }, avatarSlot).find(selector).exists(),
    ).toBe(false)
    expect(mountCell({ selected: true }).find(selector).exists()).toBe(false)
  })

  it('swaps content for skeletons while loading without changing the cell height', () => {
    const w = mountCell(
      { loading: true, accessoryTitle: '$1' },
      { ...avatarSlot },
    )
    expect(w.find('[data-test="cell-skeleton-avatar"]').exists()).toBe(true)
    expect(w.find('[data-test="cell-skeleton-accessory"]').exists()).toBe(true)
    expect(w.find('[data-test="avatar"]').exists()).toBe(false)
    expect(w.find('[data-testid="cg-title"]').exists()).toBe(false)
    expect(w.text()).not.toContain('Title')
    expect(w.classes()).toContain(CELL_SIZE_SPEC.medium.cell.split(' ')[0])
    expect(w.attributes('aria-busy')).toBe('true')
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
})
