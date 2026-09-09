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
    // Figma label/xs is DM Sans 600 (semibold).
    expect(label.classes()).toContain('font-semibold')
  })

  it('Small never renders a visible label row, even when filled', () => {
    const w = mountInput({ size: 'small', modelValue: 'vitalik.eth' })
    expect(w.get('label').classes()).toContain('sr-only')
  })

  it('keeps an explicit placeholder visible while the Large label floats', async () => {
    const w = mountInput({
      size: 'large',
      label: 'Amount',
      placeholder: '0.00',
      modelValue: '',
    })
    expect(w.get('input').attributes('placeholder')).toBe('0.00')
    await w.setProps({ modelValue: '5' }) // label floats
    expect(w.get('input').attributes('placeholder')).toBe('0.00')
  })

  it('does not float the label on focus while empty — Filled drives the label', async () => {
    const w = mountInput({ size: 'large', label: 'Recipient', modelValue: '' })
    await w.get('input').trigger('focus')
    // Figma Focus + Filled=false keeps the plain placeholder, no label row.
    expect(w.get('label').classes()).toContain('sr-only')
    expect(w.get('input').attributes('placeholder')).toBe('Recipient')
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

  it('disabled + filled keeps the float label in disabled grey; no feedback row', () => {
    const w = mountInput({
      disabled: true,
      errorMessage: 'Bad',
      modelValue: 'x',
      size: 'large',
    })
    // Figma Disabled + Filled still shows the label, in text/disabled grey.
    const label = w.get('label')
    expect(label.classes()).not.toContain('sr-only')
    expect(label.classes()).toContain('text-grey-subtle')
    expect(w.text()).not.toContain('Bad')
    expect(w.find('[aria-label="Clear"]').exists()).toBe(false)
    // A disabled field must not announce an invalid state — there is no error
    // text to describe it (feedback row + aria-describedby are suppressed).
    expect(w.get('input').attributes('aria-invalid')).not.toBe('true')
  })

  it('makes the trailing slot inert when disabled, interactive when enabled', () => {
    const slots = { trailing: '<button aria-label="Paste">P</button>' }
    const disabled = mount(AppInput, {
      props: { label: 'Recipient', disabled: true, modelValue: 'v' },
      slots,
      global: { plugins: [i18n] },
    })
    expect(disabled.find('[inert]').exists()).toBe(true)

    const enabled = mount(AppInput, {
      props: { label: 'Recipient', modelValue: 'v' },
      slots,
      global: { plugins: [i18n] },
    })
    expect(enabled.find('[inert]').exists()).toBe(false)
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

describe('AppInput submit-on-Enter gate (MEW-2185)', () => {
  it('emits `enter` on Enter when submitDisabled is false', async () => {
    const w = mountInput({ submitDisabled: false })
    await w.get('input').trigger('keyup', { key: 'Enter' })
    expect(w.emitted('enter')).toHaveLength(1)
  })

  it('does not emit `enter` on Enter when submitDisabled is true', async () => {
    const w = mountInput({ submitDisabled: true })
    await w.get('input').trigger('keyup', { key: 'Enter' })
    expect(w.emitted('enter')).toBeUndefined()
  })

  it('defaults submitDisabled to false (Enter emits)', async () => {
    const w = mountInput()
    await w.get('input').trigger('keyup', { key: 'Enter' })
    expect(w.emitted('enter')).toHaveLength(1)
  })
})
