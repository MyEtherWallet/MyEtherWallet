import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSkeleton from '@/components/AppSkeleton.vue'

describe('AppSkeleton', () => {
  it('renders a 4px-radius bar by default with the bar shimmer', () => {
    const w = mount(AppSkeleton, { attrs: { class: 'h-3 w-[60px]' } })
    expect(w.classes()).toContain('rounded-[4px]')
    expect(w.classes()).toContain('h-3')
    expect(w.find('.animate-shimmer').classes()).toContain('bg-shimmer-bar')
  })

  it('renders a circle with the circle shimmer', () => {
    const w = mount(AppSkeleton, { props: { shape: 'circle' } })
    expect(w.classes()).toContain('rounded-full')
    expect(w.find('.animate-shimmer').classes()).toContain('bg-shimmer-circle')
  })

  it('is hidden from assistive tech', () => {
    expect(mount(AppSkeleton).attributes('aria-hidden')).toBe('true')
  })
})
