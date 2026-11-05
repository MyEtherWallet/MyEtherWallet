import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import AppTableCell from '@/components/table/AppTableCell.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import {
  TABLE_CONTEXT,
  TABLE_ROW_LOADING,
  defaultTableContext,
  type TableSize,
} from '@/components/table/types'

const factory = (
  props: Record<string, unknown> = {},
  {
    size = 'l',
    visibleKeys = ['price'],
    loading = false,
  }: { size?: TableSize; visibleKeys?: string[]; loading?: boolean } = {},
  slots: Record<string, string> = {},
) =>
  mount(AppTableCell, {
    props,
    slots,
    global: {
      provide: {
        [TABLE_CONTEXT as symbol]: {
          ...defaultTableContext(),
          size: ref(size),
          visibleKeys: ref(visibleKeys),
        },
        [TABLE_ROW_LOADING as symbol]: ref(loading),
      },
    },
  })

const trend = (w: ReturnType<typeof factory>) =>
  w.get('[data-test="table-cell-trend"]')

describe('AppTableCell', () => {
  it('renders the value as a cell', () => {
    const w = factory({ value: '$256.72' })
    expect(w.attributes('role')).toBe('cell')
    expect(w.text()).toBe('$256.72')
    expect(w.find('[data-test="table-cell-trend"]').exists()).toBe(false)
  })

  it('colours a rise green with the up arrow', () => {
    const w = factory({ value: '$256.72', change: 2.87 })
    expect(trend(w).classes()).toContain('text-text-success')
    expect(trend(w).text()).toBe('+2.87%')
    expect(w.getComponent(AppIcon).props('name')).toBe('arrow-small-up')
  })

  it('colours a fall red with the down arrow', () => {
    const w = factory({ value: '$256.72', change: -2.87 })
    expect(trend(w).classes()).toContain('text-text-error')
    expect(trend(w).text()).toBe('−2.87%')
    expect(w.getComponent(AppIcon).props('name')).toBe('arrow-small-down')
  })

  it('greys out a zero change with no arrow', () => {
    const w = factory({ value: '$256.72', change: 0 })
    expect(trend(w).classes()).toContain('text-text-disabled')
    expect(trend(w).text()).toBe('0.00%')
    expect(w.findComponent(AppIcon).exists()).toBe(false)
  })

  // Every "x,y" pair in the path: the start point, then each Bézier's two
  // control points and its end point.
  const pairs = (d: string) =>
    [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map(m => [+m[1], +m[2]])

  it('draws the sparkline as a smooth curve instead of the value', () => {
    const w = factory({ change: -1.2, series: [3, 1, 2, 5] })
    const d = w.get('[data-test="table-cell-sparkline"] path').attributes('d')!
    expect(d.startsWith('M')).toBe(true)
    // 4 points, 3 curved segments, no straight lines
    expect(d.match(/C/g)).toHaveLength(3)
    expect(d).not.toMatch(/L/)
    const spark = w.get('[data-test="table-cell-sparkline"]')
    expect(spark.attributes('aria-hidden')).toBe('true')
    expect(spark.classes()).toContain('text-text-error')
    expect(w.text()).toBe('−1.20%')
  })

  it('averages a long series down to 10 points', () => {
    const hourly = Array.from({ length: 168 }, (_, i) => (i % 2 ? 1 : 9) + i)
    const d = factory({ change: 1, series: hourly })
      .get('[data-test="table-cell-sparkline"] path')
      .attributes('d')!
    expect(d.match(/C/g)).toHaveLength(9)
  })

  it('keeps the curve inside the box, spikes included', () => {
    const d = factory({ change: 1, series: [1, 9, 1, 9, 1, 30, 1] })
      .get('[data-test="table-cell-sparkline"] path')
      .attributes('d')!
    for (const [x, y] of pairs(d)) {
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(56)
      expect(y).toBeGreaterThanOrEqual(1)
      expect(y).toBeLessThanOrEqual(15)
    }
  })

  it('draws a flat line for a flat series', () => {
    const d = factory({ change: 0, series: [2, 2, 2] })
      .get('[data-test="table-cell-sparkline"] path')
      .attributes('d')!
    expect(new Set(pairs(d).map(([, y]) => y)).size).toBe(1)
  })

  it('renders nothing when its column is hidden at this size', () => {
    const w = factory({ column: 'volume', value: '1' }, { size: 's' })
    expect(w.find('[role="cell"]').exists()).toBe(false)
  })

  it('stays when its column is visible, end-aligned at size S', () => {
    const w = factory({ column: 'price', value: '1' }, { size: 's' })
    expect(w.classes()).toEqual(
      expect.arrayContaining(['items-end', 'text-right']),
    )
  })

  it('takes custom content from the default slot', () => {
    const w = factory({ value: 'ignored' }, {}, { default: '<b>10x</b>' })
    expect(w.html()).toContain('<b>10x</b>')
    expect(w.text()).toBe('10x')
  })

  it('keeps the value next to a sparkline (e.g. a "-" placeholder)', () => {
    const w = factory({ value: '-', series: [1, 2] })
    expect(w.text()).toBe('-')
    expect(w.find('[data-test="table-cell-sparkline"]').exists()).toBe(true)
  })

  it('colours the value by tone', () => {
    expect(factory({ value: '$5', tone: 'up' }).get('p').classes()).toContain(
      'text-text-success',
    )
    expect(factory({ value: '$5', tone: 'down' }).get('p').classes()).toContain(
      'text-text-error',
    )
    expect(factory({ value: '$5' }).get('p').classes()).toContain(
      'text-text-default',
    )
  })

  it("swaps each line for a bar in that line's box while its row loads", () => {
    const bars = (props: Record<string, unknown>, slots = {}) =>
      factory(props, { loading: true }, slots)
        .findAll('[data-testid="skeleton"]')
        .map(b => b.classes().join(' '))
    // value 22px line, change 18px line, 56×16 sparkline
    expect(bars({ value: '$1', change: 2 })).toEqual(
      ['h-3 w-16', 'h-3 w-12'].map(c => expect.stringContaining(c)),
    )
    expect(bars({ change: 2, series: [1, 2] })).toEqual(
      ['h-3 w-12', 'h-4 w-14'].map(c => expect.stringContaining(c)),
    )
    expect(bars({}, { default: '<b>custom</b>' })).toHaveLength(1)
    const w = factory({ value: '$1', change: 2 }, { loading: true })
    expect(w.text()).toBe('')
    expect(w.get('.py-\\[5px\\]').exists()).toBe(true)
    expect(w.get('.py-\\[3px\\]').exists()).toBe(true)
  })

  it('drops the change line when the change is not a number', () => {
    const w = factory({ value: '$1', change: Number.NaN })
    expect(w.find('[data-test="table-cell-trend"]').exists()).toBe(false)
    expect(w.text()).toBe('$1')
    // and keeps one bar (the value) while loading
    expect(
      factory({ value: '$1', change: Number.NaN }, { loading: true }).findAll(
        '[data-testid="skeleton"]',
      ),
    ).toHaveLength(1)
  })
})
