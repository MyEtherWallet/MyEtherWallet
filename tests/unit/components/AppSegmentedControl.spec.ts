import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSegmentedControl from '@/components/AppSegmentedControl.vue'

const btnList = [{ value: '1D' }, { value: '7D' }]

const mountIt = (props = {}) =>
  mount(AppSegmentedControl, {
    props: { btnList, ...props },
    slots: { 'btn-content': '<span>opt</span>' },
  })

describe('AppSegmentedControl', () => {
  it('selects a button on click when enabled', async () => {
    const w = mountIt()
    await w.findAll('button')[1].trigger('click')
    expect(w.emitted('onUpdate:selected')?.[0]).toEqual([btnList[1]])
  })

  it('disables every button and blocks selection while disabled', async () => {
    const w = mountIt({ disabled: true })
    const buttons = w.findAll('button')
    expect(buttons.every(b => b.attributes('disabled') !== undefined)).toBe(
      true,
    )

    await buttons[1].trigger('click')
    expect(w.emitted('onUpdate:selected')).toBeUndefined()
  })
})
