import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import AppTableCell from '@/components/table/AppTableCell.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import {
  TABLE_CONTEXT,
  defaultTableContext,
  type TableSize,
} from '@/components/table/types'

const factory = (
  props: Record<string, unknown> = {},
  {
    size = 'l',
    visibleKeys = ['price'],
  }: { size?: TableSize; visibleKeys?: string[] } = {},
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

  it('draws a sparkline with one point per sample instead of the value', () => {
    const w = factory({ change: -1.2, series: [3, 1, 2, 5] })
    const line = w.get('polyline')
    expect(line.attributes('points')!.trim().split(' ')).toHaveLength(4)
    const spark = w.get('[data-test="table-cell-sparkline"]')
    expect(spark.attributes('aria-hidden')).toBe('true')
    expect(spark.classes()).toContain('text-text-error')
    expect(w.text()).toBe('−1.20%')
  })

  it('draws a flat line for a flat series', () => {
    const w = factory({ change: 0, series: [2, 2, 2] })
    const ys = w
      .get('polyline')
      .attributes('points')!
      .split(' ')
      .map(p => p.split(',')[1])
    expect(new Set(ys).size).toBe(1)
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
})
