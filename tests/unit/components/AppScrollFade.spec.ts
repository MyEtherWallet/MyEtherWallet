import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppScrollFade from '@/components/AppScrollFade.vue'

describe('AppScrollFade', () => {
  it('defaults to right edge, 120px', () => {
    const w = mount(AppScrollFade)
    const el = w.get('[data-test="scroll-fade"]')
    expect(el.attributes('data-edge')).toBe('right')
    expect(el.attributes('style')).toContain('120px')
  })
  it('honors edge and width props', () => {
    const w = mount(AppScrollFade, { props: { edge: 'left', width: 64 } })
    const el = w.get('[data-test="scroll-fade"]')
    expect(el.attributes('data-edge')).toBe('left')
    expect(el.attributes('style')).toContain('64px')
  })
})
