import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSkeleton from '@/components/AppSkeleton.vue'

describe('AppSkeleton', () => {
  it('renders a pulsing 4px-radius bar on the skeleton token by default', () => {
    const w = mount(AppSkeleton, { attrs: { class: 'h-3 w-[60px]' } })
    expect(w.classes()).toContain('rounded-[4px]')
    expect(w.classes()).toContain('bg-background-skeleton')
    expect(w.classes()).toContain('animate-pulse')
    expect(w.classes()).toContain('h-3')
  })

  it('renders a circle for avatars', () => {
    const w = mount(AppSkeleton, { props: { shape: 'circle' } })
    expect(w.classes()).toContain('rounded-full')
    expect(w.classes()).not.toContain('rounded-[4px]')
  })

  it('is hidden from assistive tech', () => {
    expect(mount(AppSkeleton).attributes('aria-hidden')).toBe('true')
  })
})
