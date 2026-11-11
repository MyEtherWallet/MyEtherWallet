import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSegment from '@/components/segmented_control/AppSegment.vue'

const root = '[data-testid="segment"]'

describe('AppSegment', () => {
  it('renders a radio button with the label and aria-checked from selected', () => {
    const wrapper = mount(AppSegment, {
      props: { label: '1D', selected: true },
    })
    const el = wrapper.get(root).element as HTMLButtonElement
    expect(el.tagName).toBe('BUTTON')
    expect(el.type).toBe('button')
    expect(el.getAttribute('role')).toBe('radio')
    expect(el.getAttribute('aria-checked')).toBe('true')
    expect(wrapper.text()).toBe('1D')
  })

  it('maps size to the Figma box (40 / 28)', () => {
    const def = mount(AppSegment, { props: { label: 'A' } })
    expect(def.get(root).classes()).toEqual(
      expect.arrayContaining(['h-10', 'px-2']),
    )
    const small = mount(AppSegment, { props: { label: 'A', size: 'small' } })
    expect(small.get(root).classes()).toEqual(
      expect.arrayContaining(['h-7', 'px-1.5']),
    )
  })

  it('fills white when selected, with no hover change', () => {
    const wrapper = mount(AppSegment, {
      props: { label: 'A', selected: true, size: 'small' },
    })
    const classes = wrapper.get(root).classes()
    expect(classes).toContain('bg-background-alternative')
    expect(classes.some(c => c.startsWith('hover:'))).toBe(false)
  })

  it('binds the hover colour per size as in Figma', () => {
    const def = mount(AppSegment, { props: { label: 'A' } })
    expect(def.get(root).classes()).toContain('hover:bg-background-default')
    const small = mount(AppSegment, { props: { label: 'A', size: 'small' } })
    expect(small.get(root).classes()).toContain(
      'hover:bg-background-alternative-hover',
    )
  })

  it('hands the avatar slot the size-mapped avatar size (s / xs)', () => {
    const avatar = { avatar: '<i data-testid="av">{{ params.size }}</i>' }
    const def = mount(AppSegment, { props: { label: 'A' }, slots: avatar })
    expect(def.get('[data-testid="av"]').text()).toBe('s')
    const small = mount(AppSegment, {
      props: { label: 'A', size: 'small' },
      slots: avatar,
    })
    expect(small.get('[data-testid="av"]').text()).toBe('xs')
  })

  it('renders the trailing icon only when set', () => {
    const plain = mount(AppSegment, { props: { label: 'A' } })
    expect(plain.find('svg').exists()).toBe(false)
    const withIcon = mount(AppSegment, {
      props: { label: 'A', trailingIcon: 'chevron-down' },
    })
    expect(withIcon.find('svg').exists()).toBe(true)
  })

  it('lets the default slot replace the label', () => {
    const wrapper = mount(AppSegment, {
      props: { label: 'Orders' },
      slots: { default: 'Orders <b>3</b>' },
    })
    expect(wrapper.get('b').text()).toBe('3')
  })
})
