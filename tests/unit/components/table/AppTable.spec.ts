import { describe, it, expect, vi, afterEach } from 'vitest'

// SortableJS needs real pointer events; capture its options instead.
const sortable = vi.hoisted(() => ({
  options: {} as Record<string, any>,
  option: vi.fn(),
}))
vi.mock('@vueuse/integrations/useSortable', () => ({
  useSortable: (_el: unknown, _list: unknown, options: Record<string, any>) => {
    sortable.options = options
    return { option: sortable.option, start: () => {}, stop: () => {} }
  },
}))
import { h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppTable from '@/components/table/AppTable.vue'
import AppTableRow from '@/components/table/AppTableRow.vue'
import AppTableCell from '@/components/table/AppTableCell.vue'
import AppPagination from '@/components/pagination/AppPagination.vue'
import {
  TABLE_WRAPPER,
  tableSizeFor,
  type TableColumn,
} from '@/components/table/types'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      common: {
        show_count_more: 'Show {count} more',
        watchlist: 'Watchlist',
        actions: 'Actions',
        pagination: 'Pagination',
        showing_page: 'Showing page {current} of {total}',
        previous_page: 'previous page',
        next_page: 'next page',
      },
    },
  },
})

const COLUMNS: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'volume', label: 'Volume', largeOnly: true },
  { key: 'cap', label: 'Market cap', sortable: true, primary: true },
]

const factory = (
  props: Record<string, unknown> = {},
  {
    provide = {},
    rows = 0,
  }: { provide?: Record<symbol, unknown>; rows?: number } = {},
) =>
  mount(AppTable, {
    props: { columns: COLUMNS, size: 'l', ...props },
    slots: {
      default: () =>
        Array.from({ length: rows }, (_, i) =>
          h(AppTableRow, { title: `Row ${i}` }, () =>
            COLUMNS.slice(1).map(c =>
              h(AppTableCell, { column: c.key, value: c.key }),
            ),
          ),
        ),
    },
    global: { plugins: [i18n], provide },
  })

const grid = (w: ReturnType<typeof factory>) => w.get('[role="table"]')
const headers = (w: ReturnType<typeof factory>) =>
  w.findAll('[role="columnheader"]').map(c => c.text())

describe('tableSizeFor', () => {
  it('maps widths to the wrapper breakpoints', () => {
    expect([400, 767, 768, 900, 1279, 1280, 1300].map(tableSizeFor)).toEqual([
      's',
      's',
      'm',
      'm',
      'm',
      'l',
      'l',
    ])
  })
})

describe('AppTable', () => {
  it('builds one grid template from the column model', () => {
    expect(grid(factory()).attributes('style')).toContain(
      'grid-template-columns: minmax(0,1fr) repeat(3, calc(var(--spacing) * 35))',
    )
    expect(grid(factory({ size: 'm' })).attributes('style')).toContain(
      'repeat(2, calc(var(--spacing) * 27.5))',
    )
  })

  it('adds the start and actions tracks when asked', () => {
    expect(
      grid(factory({ watchlist: true, actions: true })).attributes('style'),
    ).toContain(
      'grid-template-columns: auto minmax(0,1fr) repeat(3, calc(var(--spacing) * 35)) auto',
    )
    expect(headers(factory({ watchlist: true, actions: true }))).toEqual([
      'Watchlist',
      'Name',
      'Price',
      'Volume',
      'Market cap',
      'Actions',
    ])
  })

  it('keeps only the leading and primary columns at size S', () => {
    const w = factory({ size: 's' }, { rows: 1 })
    expect(headers(w)).toEqual(['Name', 'Market cap'])
    expect(grid(w).attributes('style')).toContain(
      'minmax(0,1fr) repeat(1, calc(var(--spacing) * 24))',
    )
    expect(grid(w).classes()).toContain('gap-x-1')
    // The row drops the hidden cells with their headers.
    expect(
      w
        .findAll('[role="row"]')[1]
        .findAll('[role="cell"]')
        .map(c => c.text()),
    ).toEqual(['Row 0', 'cap'])
  })

  it('falls back to the first data column as primary', () => {
    const w = factory({ size: 's', columns: COLUMNS.slice(0, 3) })
    expect(headers(w)).toEqual(['Name', 'Price'])
  })

  it('takes the size from the wrapper when there is no size prop', () => {
    const w = factory(
      { size: undefined },
      {
        provide: {
          [TABLE_WRAPPER as symbol]: { size: ref('s'), title: ref('Explore') },
        },
      },
    )
    expect(headers(w)).toEqual(['Name', 'Market cap'])
  })

  it('renders sortable titles as buttons and plain titles as text', () => {
    const w = factory()
    const [name, price, volume] = w.findAll('[role="columnheader"]')
    expect(name.find('button').exists()).toBe(true)
    expect(price.attributes('aria-sort')).toBe('none')
    expect(volume.find('button').exists()).toBe(false)
    expect(volume.attributes('aria-sort')).toBeUndefined()
  })

  it('cycles a column off → desc → asc → off', async () => {
    const w = factory({ sort: null })
    const click = async () => {
      await w.findAll('[role="columnheader"]')[1].get('button').trigger('click')
      const last = w.emitted('update:sort')!.at(-1)![0]
      await w.setProps({ sort: last })
      return last
    }
    expect(await click()).toEqual({ key: 'price', direction: 'desc' })
    expect(await click()).toEqual({ key: 'price', direction: 'asc' })
    expect(await click()).toBeNull()
  })

  it('starts a different column at desc', async () => {
    const w = factory({ sort: { key: 'price', direction: 'asc' } })
    await w.findAll('[role="columnheader"]')[0].get('button').trigger('click')
    expect(w.emitted('update:sort')).toEqual([
      [{ key: 'name', direction: 'desc' }],
    ])
  })

  it('marks the sorted column with aria-sort, the arrow and the default colour', () => {
    const w = factory({ sort: { key: 'price', direction: 'asc' } })
    const price = w.findAll('[role="columnheader"]')[1]
    expect(price.attributes('aria-sort')).toBe('ascending')
    expect(price.get('button').classes()).toContain('text-text-default')
    expect(
      w.findAll('[role="columnheader"]')[0].get('button').classes(),
    ).toContain('text-text-subtle')
  })

  it('renders a show-more footer that emits', async () => {
    const w = factory({ footer: 'show-more', remaining: 14 })
    const button = w.findAll('button').find(b => b.text() === 'Show 14 more')!
    await button.trigger('click')
    expect(w.emitted('show-more')).toHaveLength(1)
  })

  it('renders a pagination footer bound to page', async () => {
    const w = factory({ footer: 'pagination', page: 1, pages: 3 })
    await w.getComponent(AppPagination).vm.$emit('update:modelValue', 2)
    expect(w.emitted('update:page')).toEqual([[2]])
  })

  it('is named by the wrapper title unless given its own label', () => {
    const wrapper = {
      [TABLE_WRAPPER as symbol]: { size: ref('l'), title: ref('Explore') },
    }
    expect(
      grid(factory({}, { provide: wrapper })).attributes('aria-label'),
    ).toBe('Explore')
    expect(
      grid(factory({ ariaLabel: 'Own' }, { provide: wrapper })).attributes(
        'aria-label',
      ),
    ).toBe('Own')
  })

  it('labels the start column Watchlist only when it holds the star', () => {
    expect(headers(factory({ reorderable: true }))[0]).toBe('')
    expect(headers(factory({ watchlist: true }))[0]).toBe('Watchlist')
  })

  it('drops largeOnly columns at M and keeps them at L', () => {
    expect(headers(factory({ size: 'm' }))).toEqual([
      'Name',
      'Price',
      'Market cap',
    ])
    expect(headers(factory({ size: 'l' }))).toEqual([
      'Name',
      'Price',
      'Volume',
      'Market cap',
    ])
  })

  it('passes a custom label to the pagination footer', () => {
    const label = () => '10 of 42 results'
    const w = factory({
      footer: 'pagination',
      pages: 5,
      paginationLabel: label,
    })
    expect(w.getComponent(AppPagination).props('label')).toBe(label)
  })

  it('reorders through SortableJS by the row handle, undoing its DOM move', () => {
    const w = factory({ reorderable: true }, { rows: 3 })
    expect(sortable.options.handle).toBe('[data-table-handle]')
    expect(sortable.options.disabled).toBe(false)
    const body = w.get('[role="rowgroup"]').element
    const first = body.children[0]
    body.appendChild(first) // what SortableJS does on drop
    sortable.options.onUpdate({
      item: first,
      from: body,
      oldIndex: 0,
      newIndex: 2,
    })
    expect(body.children[0]).toBe(first)
    expect(w.emitted('reorder')).toEqual([[{ from: 0, to: 2 }]])
  })

  it('keeps SortableJS disabled until the table is reorderable', async () => {
    const w = factory({}, { rows: 2 })
    expect(sortable.options.disabled).toBe(true)
    await w.setProps({ reorderable: true })
    expect(sortable.option).toHaveBeenLastCalledWith('disabled', false)
  })

  describe('measuring its own width', () => {
    afterEach(() => vi.unstubAllGlobals())

    it.each([
      [400, ['Name', 'Market cap']],
      [900, ['Name', 'Price', 'Market cap']],
      [1300, ['Name', 'Price', 'Volume', 'Market cap']],
    ])('at %ipx shows %j', async (width, expected) => {
      vi.stubGlobal(
        'ResizeObserver',
        class {
          constructor(private cb: ResizeObserverCallback) {}
          observe() {
            this.cb(
              [
                {
                  borderBoxSize: [{ inlineSize: width, blockSize: 100 }],
                  contentRect: { width, height: 100 },
                } as unknown as ResizeObserverEntry,
              ],
              this as unknown as ResizeObserver,
            )
          }
          unobserve() {}
          disconnect() {}
        },
      )
      const w = factory({ size: undefined })
      await w.vm.$nextTick()
      expect(headers(w)).toEqual(expected)
      expect(grid(w).attributes('style')).toContain(
        `calc(var(--spacing) * ${width >= 1280 ? 35 : width >= 768 ? 27.5 : 24})`,
      )
    })
  })
})
