import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppBtnGroup from '@/components/AppBtnGroup.vue'

const mountIt = (props = {}) =>
  mount(AppBtnGroup, {
    props,
    slots: { default: '<button>A</button><button>B</button>' },
  })

describe('AppBtnGroup', () => {
  it('lays out horizontally by default, splitting the row evenly', () => {
    const cls = mountIt().classes()
    expect(cls).toContain('justify-end')
    expect(cls).toContain('[&>*]:flex-1')
    expect(cls).not.toContain('flex-col')
  })

  it('stacks full-width when vertical', () => {
    const cls = mountIt({ orientation: 'vertical' }).classes()
    expect(cls).toContain('flex-col')
    expect(cls).toContain('[&>*]:w-full')
  })

  it('uses the 16px design gap in both orientations', () => {
    expect(mountIt().classes()).toContain('gap-4')
    expect(mountIt({ orientation: 'vertical' }).classes()).toContain('gap-4')
  })

  it('only pads when asked, so dialog footers can own their spacing', () => {
    expect(mountIt().classes()).not.toContain('p-4')
    expect(mountIt({ hasPadding: true }).classes()).toContain('p-4')
  })

  it('renders whatever is passed through the slot', () => {
    expect(mountIt().findAll('button')).toHaveLength(2)
  })
})
