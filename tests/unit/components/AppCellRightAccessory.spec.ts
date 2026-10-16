import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { CellRightAccessory } from '@/components/cellSizes'

// chart.js needs a real canvas; the accessory only forwards props to it.
vi.mock('@/components/TableSparkline.vue', () => ({
  default: {
    name: 'TableSparkline',
    props: ['points', 'width', 'height', 'percentChange'],
    template: '<span data-test="sparkline" />',
  },
}))

import AppCellRightAccessory from '@/components/AppCellRightAccessory.vue'

const mountAccessory = (accessory: CellRightAccessory) =>
  mount(AppCellRightAccessory, { props: { accessory } })

const MINUS = '−'

describe('AppCellRightAccessory — Cell right accessory (MEW-2445)', () => {
  it('renders balance as label/base primary over text/sm subtle secondary', () => {
    const w = mountAccessory({
      kind: 'balance',
      primary: '$1,230',
      secondary: '1,230 USDC',
    })
    const [primary, secondary] = w.findAll('p')
    expect(primary.text()).toBe('$1,230')
    expect(primary.classes()).toEqual(
      expect.arrayContaining(['text-label-base', 'text-text-default']),
    )
    expect(secondary.text()).toBe('1,230 USDC')
    expect(secondary.classes()).toEqual(
      expect.arrayContaining(['text-text-sm', 'text-text-subtle']),
    )
  })

  it('hides the balance secondary line when absent', () => {
    const w = mountAccessory({ kind: 'balance', primary: '$1,230' })
    expect(w.findAll('p')).toHaveLength(1)
  })

  it('colours balance-performance by the sign of change', () => {
    const up = mountAccessory({
      kind: 'balance-performance',
      primary: '$1,230',
      change: 2.5,
    })
    const upChange = up.findAll('p')[1]
    expect(upChange.text()).toBe('+2.50%')
    expect(upChange.classes()).toContain('text-text-success')

    const down = mountAccessory({
      kind: 'balance-performance',
      primary: '$1,230',
      change: -2.5,
    })
    const downChange = down.findAll('p')[1]
    expect(downChange.text()).toBe(`${MINUS}2.50%`)
    expect(downChange.classes()).toContain('text-text-error')
  })

  it('shows zero change as neutral subtle text with no sign', () => {
    const w = mountAccessory({
      kind: 'balance-performance',
      primary: '$1,230',
      change: 0,
    })
    const change = w.findAll('p')[1]
    expect(change.text()).toBe('0%')
    expect(change.classes()).toContain('text-text-subtle')
  })

  it('goes through the shared percent formatter (caps above 1000%)', () => {
    const w = mountAccessory({ kind: 'performance', change: -1234 })
    expect(w.text()).toBe(`${MINUS}> 1000%`)
  })

  it('renders performance as an arrow + label/base row in the trend colour', () => {
    const up = mountAccessory({ kind: 'performance', change: 1.2 })
    const row = up.get('[data-test="cell-accessory-performance"]')
    expect(row.classes()).toEqual(
      expect.arrayContaining(['text-label-base', 'text-text-success']),
    )
    expect(row.find('svg').exists()).toBe(true)
    expect(row.text()).toBe('+1.20%')

    const down = mountAccessory({ kind: 'performance', change: -1.2 })
    expect(
      down.get('[data-test="cell-accessory-performance"]').classes(),
    ).toContain('text-text-error')
  })

  it('draws the up and down arrows as different glyphs', () => {
    const up = mountAccessory({ kind: 'performance', change: 1 }).get('svg')
    const down = mountAccessory({ kind: 'performance', change: -1 }).get('svg')
    expect(up.html()).not.toBe(down.html())
  })

  it('drops the arrow for a zero performance change', () => {
    const w = mountAccessory({ kind: 'performance', change: 0 })
    const row = w.get('[data-test="cell-accessory-performance"]')
    expect(row.find('svg').exists()).toBe(false)
    expect(row.classes()).toContain('text-text-subtle')
    expect(row.text()).toBe('0%')
  })

  it('renders graph as a 140×40 sparkline, trend from first vs last point', () => {
    const up = mountAccessory({ kind: 'graph', points: [1, 3, 2, 4] })
    const spark = up.getComponent({ name: 'TableSparkline' })
    expect(spark.props()).toMatchObject({
      points: [1, 3, 2, 4],
      width: 140,
      height: 40,
    })
    expect(spark.props('percentChange')).toBeGreaterThan(0)
    expect(spark.attributes('aria-hidden')).toBe('true')

    const down = mountAccessory({ kind: 'graph', points: [4, 1, 3, 2] })
    expect(
      down.getComponent({ name: 'TableSparkline' }).props('percentChange'),
    ).toBeLessThan(0)
  })

  it('lets an explicit graph trend override the derived one', () => {
    const w = mountAccessory({
      kind: 'graph',
      points: [1, 2, 3, 4],
      trend: 'down',
    })
    expect(
      w.getComponent({ name: 'TableSparkline' }).props('percentChange'),
    ).toBeLessThan(0)
  })

  it('renders icon as a static 32px glyph slot, never a button', () => {
    const w = mountAccessory({ kind: 'icon', icon: 'check-circle' })
    const slot = w.get('[data-test="cell-accessory-icon"]')
    expect(slot.classes()).toContain('size-8')
    expect(slot.attributes('aria-hidden')).toBe('true')
    expect(slot.find('svg').classes()).toEqual(
      expect.arrayContaining(['size-6', 'text-icon-default']),
    )
    expect(w.find('button').exists()).toBe(false)
  })

  it('renders loading as two right-aligned skeleton bars', () => {
    const w = mountAccessory({ kind: 'loading' })
    const bars = w.findAll('.bg-background-skeleton')
    expect(bars).toHaveLength(2)
    expect(bars[0].classes()).toEqual(expect.arrayContaining(['h-3', 'w-12']))
    expect(bars[1].classes()).toEqual(expect.arrayContaining(['h-3', 'w-20']))
  })

  it('stays right-aligned and never wraps', () => {
    const cls = mountAccessory({ kind: 'balance', primary: '$1' }).classes()
    expect(cls).toEqual(
      expect.arrayContaining([
        'items-end',
        'text-right',
        'whitespace-nowrap',
        'shrink-0',
      ]),
    )
  })
})
