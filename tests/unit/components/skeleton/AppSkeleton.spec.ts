import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSkeleton from '@/components/skeleton/AppSkeleton.vue'

describe('AppSkeleton', () => {
  it('renders a 4px-radius rectangle on the skeleton base, sized by the caller', () => {
    const w = mount(AppSkeleton, { attrs: { class: 'h-3 w-[60px]' } })
    expect(w.classes()).toEqual(
      expect.arrayContaining([
        'relative',
        'overflow-hidden',
        'bg-[var(--skeleton-base)]',
        'rounded-[4px]',
        'h-3',
        'w-[60px]',
      ]),
    )
  })

  it('maps every Figma shape to its corner radius', () => {
    const cases = [
      ['rectangle', 'rounded-[4px]'],
      ['rectangle-rounded', 'rounded-12'],
      ['square', 'rounded-[4px]'],
      ['circle', 'rounded-full'],
    ] as const
    for (const [shape, radius] of cases) {
      expect(mount(AppSkeleton, { props: { shape } }).classes()).toContain(
        radius,
      )
    }
  })

  it('runs the shimmer on a double-width layer, steeper on square and circle', () => {
    const layer = mount(AppSkeleton).get('.skeleton-shimmer')
    expect(layer.classes()).toEqual(
      expect.arrayContaining(['absolute', 'w-[200%]']),
    )
    expect(
      mount(AppSkeleton, { props: { shape: 'circle' } }).classes(),
    ).toContain('[--skeleton-angle:-88.44deg]')
    expect(mount(AppSkeleton).classes()).not.toContain(
      '[--skeleton-angle:-88.44deg]',
    )
  })

  it('is hidden from assistive tech', () => {
    expect(mount(AppSkeleton).attributes('aria-hidden')).toBe('true')
  })
})
