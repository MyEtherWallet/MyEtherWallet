import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppInput from '@/components/AppInput.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      common: {
        required: 'Required',
        clear_icon: 'Clear',
        show_password: 'Show',
        hide_password: 'Hide',
      },
    },
  },
})

const mountInput = (props: Record<string, unknown> = {}) =>
  mount(AppInput, {
    props: { label: 'Recipient', ...props },
    global: { plugins: [i18n] },
  })

// The field box carries the geometry + surface classes.
const field = (w: ReturnType<typeof mountInput>) => w.find('.rounded-12')

describe('AppInput — design-library rebuild (MEW-1971)', () => {
  it('renders a real <input> associated with a <label>', () => {
    const w = mountInput()
    const input = w.get('input')
    const label = w.get('label')
    expect(input.attributes('id')).toBeTruthy()
    expect(label.attributes('for')).toBe(input.attributes('id'))
  })

  it('holds a fixed height per size — h-14 large, h-10 small', () => {
    expect(field(mountInput({ size: 'large' })).classes()).toContain('h-14')
    expect(field(mountInput({ size: 'small' })).classes()).toContain('h-10')
  })

  it('Large floats the label once filled; empty stays a placeholder-only row', async () => {
    const w = mountInput({ size: 'large', modelValue: '' })
    expect(w.get('label').classes()).toContain('sr-only')
    await w.setProps({ modelValue: 'vitalik.eth' })
    const label = w.get('label')
    expect(label.classes()).not.toContain('sr-only')
    expect(label.classes()).toContain('text-t-subtle')
  })

  it('Small never renders a visible label row, even when filled', () => {
    const w = mountInput({ size: 'small', modelValue: 'vitalik.eth' })
    expect(w.get('label').classes()).toContain('sr-only')
  })

  it('maps surface to bg + resting border', () => {
    expect(field(mountInput({ surface: 'default' })).classes()).toContain(
      'bg-bgBase',
    )
    const alt = field(mountInput({ surface: 'alternative' }))
    expect(alt.classes()).toContain('bg-white')
    expect(alt.classes()).toContain('border-border-default')
  })

  it('shows the error ring on focus only; unfocused keeps its normal border', async () => {
    const w = mountInput({
      errorMessage: 'Enter a valid address',
      modelValue: '0x',
    })
    // Unfocused: no red ring, but the feedback row is shown.
    expect(field(w).classes()).not.toContain('border-error')
    expect(w.text()).toContain('Enter a valid address')
    // Focus: ring turns error red.
    await w.get('input').trigger('focus')
    expect(field(w).classes()).toContain('border-error')
  })

  it('wires aria-invalid and aria-describedby to the feedback row', () => {
    const w = mountInput({ errorMessage: 'Bad', modelValue: 'x' })
    const input = w.get('input')
    expect(input.attributes('aria-invalid')).toBe('true')
    const describedby = input.attributes('aria-describedby')
    expect(describedby).toBeTruthy()
    const feedback = w
      .findAll('div')
      .find(d => d.attributes('id') === describedby)
    expect(feedback?.text()).toContain('Bad')
  })

  it('disabled hides the label row and never shows the feedback row', () => {
    const w = mountInput({
      disabled: true,
      errorMessage: 'Bad',
      modelValue: 'x',
      size: 'large',
    })
    expect(w.get('label').classes()).toContain('sr-only')
    expect(w.text()).not.toContain('Bad')
    expect(w.find('[aria-label="Clear"]').exists()).toBe(false)
  })

  it('required + blur while empty raises the feedback row', async () => {
    vi.useFakeTimers()
    try {
      const w = mountInput({ isRequired: true, modelValue: '' })
      await w.get('input').trigger('focus')
      await w.get('input').trigger('blur')
      vi.advanceTimersByTime(200) // out-of-focus timeout is 150ms
      await nextTick()
      expect(w.text()).toContain('Required')
    } finally {
      vi.useRealTimers()
    }
  })

  it('clears the value through the built-in clear button', async () => {
    const w = mountInput({ modelValue: 'abc' })
    await w.get('[aria-label="Clear"]').trigger('click')
    await nextTick()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([''])
  })

  it('toggles password visibility via the reveal button', async () => {
    const w = mountInput({ type: 'password', modelValue: 'secret' })
    expect(w.get('input').attributes('type')).toBe('password')
    await w.get('[aria-label="Show"]').trigger('click')
    await nextTick()
    expect(w.get('input').attributes('type')).toBe('text')
  })
})
