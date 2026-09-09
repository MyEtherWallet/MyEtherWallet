import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppCell from '@/components/AppCell.vue'
import { CELL_SIZE_SPEC } from '@/components/cellSizes'

const avatarSlot = { avatar: '<img data-test="avatar" />' }
const avatarBadgeSlot = { avatarBadge: '<i data-test="network" />' }
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

  it('uses the small geometry for size="small"', () => {
    const w = mountCell({ size: 'small' }, avatarSlot)
    expect(w.classes()).toContain(CELL_SIZE_SPEC.small.cell.split(' ')[0])
    expect(
      w.find('[data-test="avatar"]').element.parentElement?.parentElement
        ?.className,
    ).toContain(CELL_SIZE_SPEC.small.avatar)
  })

  it('renders title and description', () => {
    const text = mountCell().text()
    expect(text).toContain('Title')
    expect(text).toContain('Information')
  })

  it('lets a title slot replace the title prop', () => {
    const w = mountCell({}, { title: '<b data-test="custom-title">ETH</b>' })
    expect(w.find('[data-test="custom-title"]').exists()).toBe(true)
    expect(w.text()).not.toContain('Title')
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

  it('renders the dark check badge top-left when selected, keeping the network badge', () => {
    const w = mountCell(
      { selected: true },
      { ...avatarSlot, ...avatarBadgeSlot },
    )
    const selectedBadge = w.get('[data-test="cell-selected-badge"]')
    expect(selectedBadge.classes()).toContain('!bg-bgContrast')
    expect(selectedBadge.find('svg').exists()).toBe(true)
    expect(selectedBadge.classes()).toContain(CELL_SIZE_SPEC.medium.badge)
    expect(w.findAll('[data-test="network"]')).toHaveLength(1)
  })

  it('renders no selected badge without selection or without an avatar', () => {
    const selector = '[data-test="cell-selected-badge"]'
    expect(
      mountCell({ selected: false }, avatarSlot).find(selector).exists(),
    ).toBe(false)
    expect(mountCell({ selected: true }).find(selector).exists()).toBe(false)
  })

  it('swaps content for skeletons while loading without changing the cell height', () => {
    const w = mountCell({ loading: true }, { ...avatarSlot, ...accessorySlot })
    expect(w.find('[data-test="cell-skeleton-avatar"]').exists()).toBe(true)
    expect(w.find('[data-test="cell-skeleton-content"]').exists()).toBe(true)
    expect(w.find('[data-test="cell-skeleton-accessory"]').exists()).toBe(true)
    expect(w.find('[data-test="avatar"]').exists()).toBe(false)
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
