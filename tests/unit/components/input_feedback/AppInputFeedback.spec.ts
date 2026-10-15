import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppInputFeedback from '@/components/input_feedback/AppInputFeedback.vue'
import AppIcon from '@/components/icon/AppIcon.vue'

describe('AppInputFeedback', () => {
  it('renders nothing without a message or slot', () => {
    const w = mount(AppInputFeedback, { props: { type: 'error' } })
    expect(w.find('p').exists()).toBe(false)
  })

  it.each([
    ['error', 'text-text-error', 'exclamation-circle'],
    ['success', 'text-text-success', 'check-circle'],
    ['warning', 'text-text-warning', 'exclamation-triangle'],
  ] as const)('%s → %s with the %s icon', (type, colour, icon) => {
    const w = mount(AppInputFeedback, { props: { type, message: 'Hi' } })
    expect(w.get('p').classes()).toContain(colour)
    expect(w.getComponent(AppIcon).props('name')).toBe(icon)
  })

  it('defaults to the plain text type: subtle colour, no icon', () => {
    const w = mount(AppInputFeedback, { props: { message: 'Hint' } })
    expect(w.get('p').classes()).toContain('text-text-subtle')
    expect(w.findComponent(AppIcon).exists()).toBe(false)
  })

  it('announces errors as alerts and everything else as status', () => {
    const error = mount(AppInputFeedback, {
      props: { type: 'error', message: 'Bad' },
    })
    expect(error.get('p').attributes('role')).toBe('alert')
    const success = mount(AppInputFeedback, {
      props: { type: 'success', message: 'Good' },
    })
    expect(success.get('p').attributes('role')).toBe('status')
  })

  it('takes the id for aria-describedby and lets the slot override message', () => {
    const w = mount(AppInputFeedback, {
      props: { message: 'plain' },
      attrs: { id: 'feedback-1' },
      slots: { default: 'Rich <a href="#">link</a>' },
    })
    expect(w.get('p').attributes('id')).toBe('feedback-1')
    expect(w.text()).toContain('Rich link')
    expect(w.text()).not.toContain('plain')
  })
})
