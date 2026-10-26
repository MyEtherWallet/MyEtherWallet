import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppTableRow from '@/components/table/AppTableRow.vue'
import AppCellWatchlistToggle from '@/components/cell/AppCellWatchlistToggle.vue'
import {
  TABLE_CONTEXT,
  defaultTableContext,
  type TableContext,
} from '@/components/table/types'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      common: {
        add_to_watchlist: 'Add to watchlist',
        remove_from_watchlist: 'Remove from watchlist',
      },
    },
  },
})

const factory = ({
  props = {},
  attrs = {},
  slots = {},
  ctx = {},
}: {
  props?: Record<string, unknown>
  attrs?: Record<string, unknown>
  slots?: Record<string, string>
  ctx?: Partial<Record<keyof TableContext, unknown>>
} = {}) => {
  const context = defaultTableContext()
  for (const [k, v] of Object.entries(ctx))
    (context[k as keyof TableContext] as { value: unknown }).value = v
  return mount(AppTableRow, {
    props: { title: 'USDC', description: 'USD Coin', ...props },
    attrs,
    slots,
    global: {
      plugins: [i18n],
      provide: { [TABLE_CONTEXT as symbol]: context },
    },
  })
}

describe('AppTableRow', () => {
  it('is a subgrid row padded for its size', () => {
    expect(factory().classes()).toEqual(
      expect.arrayContaining([
        'grid-cols-subgrid',
        'col-span-full',
        'px-2',
        'py-3',
      ]),
    )
    expect(factory({ ctx: { size: 's' } }).classes()).toContain('px-1')
    expect(factory().attributes('role')).toBe('row')
  })

  it('renders title and description in the leading cell', () => {
    const w = factory()
    expect(w.text()).toContain('USDC')
    expect(w.text()).toContain('USD Coin')
  })

  it('passes the avatar size: L at sizes L/M, M at size S', () => {
    const avatar = { avatar: '<i>{{ params.size }}</i>' }
    expect(factory({ slots: avatar }).get('i').text()).toBe('l')
    expect(
      factory({ slots: avatar, ctx: { size: 'm' } })
        .get('i')
        .text(),
    ).toBe('l')
    expect(
      factory({ slots: avatar, ctx: { size: 's' } })
        .get('i')
        .text(),
    ).toBe('m')
  })

  it('is not focusable without a click listener', () => {
    expect(factory().attributes('tabindex')).toBeUndefined()
    expect(factory().classes()).not.toContain('cursor-pointer')
  })

  it('becomes focusable with a click listener and activates on Enter/Space', async () => {
    const calls: number[] = []
    const w = factory({ attrs: { onClick: () => calls.push(1) } })
    expect(w.attributes('tabindex')).toBe('0')
    expect(w.classes()).toContain('cursor-pointer')
    await w.trigger('keydown', { key: 'Enter' })
    await w.trigger('keydown', { key: ' ' })
    expect(calls).toHaveLength(2)
  })

  it('renders the watchlist toggle only when watchlisted is bound', () => {
    expect(
      factory({ ctx: { start: true } })
        .findComponent(AppCellWatchlistToggle)
        .exists(),
    ).toBe(false)
    expect(
      factory({ props: { watchlisted: false }, ctx: { start: true } })
        .findComponent(AppCellWatchlistToggle)
        .exists(),
    ).toBe(true)
  })

  it('keeps the start cell when the table has a start track, so tracks line up', () => {
    expect(factory().findAll('[role="cell"]')).toHaveLength(1)
    expect(
      factory({ ctx: { start: true } }).findAll('[role="cell"]'),
    ).toHaveLength(2)
  })

  it('toggles the watchlist without clicking the row', async () => {
    const calls: number[] = []
    const w = factory({
      props: { watchlisted: false },
      attrs: { onClick: () => calls.push(1) },
      ctx: { start: true },
    })
    await w.getComponent(AppCellWatchlistToggle).trigger('click')
    expect(w.emitted('update:watchlisted')).toEqual([[true]])
    expect(calls).toHaveLength(0)
  })

  it('renders actions in their own cell without clicking the row', async () => {
    const calls: number[] = []
    const w = factory({
      attrs: { onClick: () => calls.push(1) },
      slots: { actions: '<button data-test="act">Trade</button>' },
      ctx: { actions: true },
    })
    await w.get('[data-test="act"]').trigger('click')
    expect(calls).toHaveLength(0)
  })

  it('flips the action surface while hovered so buttons stay visible on the grey row', async () => {
    const w = factory({
      slots: { actions: '<i>{{ params.surface }}</i>' },
      ctx: { actions: true },
    })
    expect(w.get('i').text()).toBe('default')
    await w.trigger('mouseenter')
    expect(w.get('i').text()).toBe('alternative')
    await w.trigger('mouseleave')
    expect(w.get('i').text()).toBe('default')
  })

  it('shows a drag handle only when the table is reorderable', () => {
    expect(
      factory({ ctx: { start: true } })
        .find('[data-table-handle]')
        .exists(),
    ).toBe(false)
    const handle = factory({ ctx: { start: true, reorderable: true } }).get(
      '[data-table-handle]',
    )
    expect(handle.classes()).toContain('invisible')
  })

  it('passes title and title-icon slots to the content group', () => {
    const w = factory({
      slots: {
        title: '<b>AAPL<span class="on">on</span></b>',
        'title-icon': '<i data-test="tag">{{ params.size }}</i>',
      },
    })
    expect(w.get('.on').text()).toBe('on')
    expect(w.get('[data-test="tag"]').text()).toBe('xs')
  })
})
