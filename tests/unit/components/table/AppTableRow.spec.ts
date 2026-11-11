import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppTableRow from '@/components/table/AppTableRow.vue'
import AppCellWatchlistToggle from '@/components/cell/AppCellWatchlistToggle.vue'
import AppTableCell from '@/components/table/AppTableCell.vue'
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
      stubs: { RouterLink: RouterLinkStub },
      components: { AppTableCell },
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

  it('passes the avatar size: L at sizes L/M, S (24px) on mobile', () => {
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
    ).toBe('s')
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

  it('passes the description-icon slot to the content group', () => {
    const w = factory({
      props: { description: 'USD Coin' },
      slots: {
        'description-icon': '<i data-test="desc-tag">{{ params.size }}</i>',
      },
    })
    const tag = w.get('[data-test="desc-tag"]')
    expect(tag.text()).toBe('xs')
    // On the description's line, not the title's.
    const line = (id: string) =>
      w.get(`[data-testid="${id}"]`).element.parentElement!
    expect(line('cg-description').contains(tag.element)).toBe(true)
    expect(line('cg-title').contains(tag.element)).toBe(false)
  })

  it('links the title over the whole row when given `to`', async () => {
    const calls: number[] = []
    const w = factory({
      props: { to: '/token/usdc' },
      attrs: { onClick: () => calls.push(1) },
    })
    const link = w.getComponent(RouterLinkStub)
    expect(link.props('to')).toBe('/token/usdc')
    expect(link.text()).toBe('USDC')
    expect(link.classes()).toEqual(
      expect.arrayContaining(['after:absolute', 'after:inset-0']),
    )
    // The link is the focus target, not the row.
    expect(w.attributes('tabindex')).toBeUndefined()
    await link.trigger('click')
    expect(calls).toHaveLength(1)
  })

  it('keeps the star and actions above the row link, inside the row', () => {
    const w = factory({
      props: { to: '/x', watchlisted: false },
      slots: { actions: '<button>Trade</button>' },
      ctx: { start: true, actions: true },
    })
    const cells = w.findAll('[role="cell"]')
    expect(cells[0].classes()).toContain('z-10')
    expect(cells.at(-1)!.classes()).toContain('z-10')
    // its own stacking context: the z-10 never climbs over the fixed header
    expect(w.get('[role="row"]').classes()).toContain('isolate')
  })

  it('shows the full title as a tooltip on the leading cell', () => {
    expect(factory().findAll('[role="cell"]')[0].attributes('title')).toBe(
      'USDC',
    )
  })

  it('keeps the handle box on a loading row but takes it out of the drag', () => {
    const w = factory({
      props: { loading: true },
      ctx: { start: true, reorderable: true },
    })
    expect(w.find('[data-table-handle]').exists()).toBe(false)
    const box = w.findAll('[role="cell"]')[0].get('span')
    expect(box.classes()).toEqual(
      expect.arrayContaining(['invisible', 'size-8']),
    )
    expect(box.classes()).not.toContain('group-hover:visible')
  })

  it('uses Button Icon S for the star on mobile and M above, skeleton too', () => {
    const star = (size: 'l' | 'm' | 's') =>
      factory({ props: { watchlisted: false }, ctx: { start: true, size } })
        .getComponent(AppCellWatchlistToggle)
        .props('size')
    expect([star('s'), star('m'), star('l')]).toEqual(['s', 'm', 'm'])
    const placeholder = (size: 'l' | 's') => {
      const box = factory({
        props: { loading: true },
        ctx: { start: true, watchlist: true, size },
      })
        .findAll('[role="cell"]')[0]
        .get('span')
      return [box.classes(), box.get('[data-testid="skeleton"]').classes()]
    }
    // box and glyph of Button Icon S (32/16) and M (40/24)
    expect(placeholder('s')).toEqual([
      expect.arrayContaining(['size-8']),
      expect.arrayContaining(['size-4']),
    ])
    expect(placeholder('l')).toEqual([
      expect.arrayContaining(['size-10']),
      expect.arrayContaining(['size-6']),
    ])
  })

  it('keeps the drag handle visible on touch screens', () => {
    const handle = factory({ ctx: { start: true, reorderable: true } }).get(
      '[data-table-handle]',
    )
    expect(handle.classes()).toContain('pointer-coarse:visible')
  })

  it('loads as a skeleton copy of itself: own cells, star kept, no click', () => {
    const calls: number[] = []
    const w = factory({
      props: { loading: true, watchlisted: true },
      attrs: { onClick: () => calls.push(1) },
      slots: {
        default: '<AppTableCell column="price" value="$1" :change="2" />',
        actions: '<button>Trade</button>',
      },
      ctx: { start: true, actions: true, visibleKeys: ['price'] },
    })
    expect(w.findComponent(AppCellWatchlistToggle).exists()).toBe(true)
    expect(w.text()).toBe('')
    // start + leading + its price cell + actions
    const cells = w.findAll('[role="cell"]')
    expect(cells).toHaveLength(4)
    expect(cells[2].findAll('[data-testid="skeleton"]')).toHaveLength(2)
    expect(w.attributes('tabindex')).toBeUndefined()
  })

  it('sizes the avatar skeleton like the avatar and keeps the two text lines', () => {
    const avatar = (size: 'l' | 's') =>
      factory({
        props: { loading: true },
        slots: { avatar: '<img />' },
        ctx: { size },
      })
        .findAll('[role="cell"]')[0]
        .findAll('[data-testid="skeleton"]')
    expect(avatar('l')[0].attributes('style')).toContain('width: 40px')
    expect(avatar('s')[0].attributes('style')).toContain('width: 24px')
    // avatar + title + description bars
    expect(avatar('l')).toHaveLength(3)
    expect(
      factory({ props: { loading: true } })
        .findAll('[role="cell"]')[0]
        .findAll('[data-testid="skeleton"]'),
    ).toHaveLength(2)
  })

  it('holds the star place with a skeleton when the table has a watchlist', () => {
    const start = (ctx: Record<string, unknown>) =>
      factory({ props: { loading: true }, ctx: { start: true, ...ctx } })
        .findAll('[role="cell"]')[0]
        .find('[data-testid="skeleton"]')
    expect(start({ watchlist: true }).exists()).toBe(true)
    expect(start({ reorderable: true }).exists()).toBe(false)
  })

  it('swaps the actions for button skeletons: one at L/M, the icon at S, or loadingButtons', () => {
    const skeletons = (size: 'l' | 's', loadingButtons?: number) =>
      factory({
        props: { loading: true, loadingButtons },
        slots: { actions: '<button>Trade</button>' },
        ctx: { actions: true, size },
      })
        .findAll('[role="cell"]')
        .at(-1)!
        .findAll('[data-testid="skeleton"]')
        .map(b => b.classes())
    expect(skeletons('l')).toEqual([expect.arrayContaining(['h-10', 'w-24'])])
    expect(skeletons('s')).toEqual([expect.arrayContaining(['size-10'])])
    expect(skeletons('l', 2)).toHaveLength(2)
    expect(skeletons('l', 0)).toEqual([expect.arrayContaining(['size-10'])])
  })

  it('gives a placeholder row (no cells) one skeleton cell per visible column', () => {
    const w = factory({
      props: { loading: true },
      ctx: { visibleKeys: ['price', 'cap'] },
    })
    expect(w.findAll('[role="cell"]')).toHaveLength(3)
  })
})
