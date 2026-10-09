import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppInput from '@/components/AppInput.vue'
import { INPUT_SURFACES } from '@/components/inputSizes'

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
    expect(label.classes()).toContain('text-text-subtle')
    // Figma label/xs: DM Sans 600 · 12/18 · -2%.
    expect(label.classes()).toContain('text-label-xs')
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

  it('maps surface to semantic bg + resting line tokens', () => {
    const def = field(mountInput({ surface: 'default' })).classes()
    expect(def).toContain('bg-background-default')
    // Figma Default has no resting line.
    expect(def).not.toContain('inset-ring')
    const alt = field(mountInput({ surface: 'alternative' })).classes()
    expect(alt).toContain('bg-background-alternative')
    // Figma Alternative rests on a 1px border/default line at the outer edge.
    expect(alt).toContain('inset-ring')
    expect(alt).toContain('inset-ring-border-default')
  })

  it('draws every state line as an inset ring — no CSS border, no shift', async () => {
    for (const surface of INPUT_SURFACES) {
      const w = mountInput({ surface, modelValue: 'x' })
      const rest = field(w).classes()
      // A real border takes layout space (content would sit at 17-18px, and
      // a 1px -> 2px swap shifts it); the ring keeps padding at exactly 16px.
      expect(rest.some(c => /^border(-\d)?$/.test(c))).toBe(false)
      expect(rest).toContain('hover:inset-ring-2')
      expect(rest).toContain('hover:inset-ring-border-hover')

      await w.get('input').trigger('focus')
      const focus = field(w).classes()
      expect(focus.some(c => /^border(-\d)?$/.test(c))).toBe(false)
      expect(focus).toContain('inset-ring-2')
      expect(focus).toContain('inset-ring-border-brand')
    }
  })

  it('typing (Figma Active) drops the focus ring; keyboard focus keeps it', async () => {
    const w = mountInput({ modelValue: 'x' })
    const input = w.get('input')
    // Keyboard focus (no pointer) is Figma Focus: ringed.
    await input.trigger('focus')
    expect(field(w).classes()).toContain('inset-ring-border-brand')
    // Typing is Figma Active: caret only, no brand ring and no hover ring.
    await input.trigger('input')
    expect(field(w).classes()).not.toContain('inset-ring-border-brand')
    expect(field(w).classes()).not.toContain('hover:inset-ring-border-hover')
  })

  it('pointer focus enters Active straight away (no ring), errors included', async () => {
    const w = mountInput({ modelValue: 'x', errorMessage: 'Bad' })
    await w.get('input').trigger('pointerdown')
    await w.get('input').trigger('focus')
    expect(field(w).classes()).not.toContain('inset-ring-border-brand')
    expect(field(w).classes()).not.toContain('inset-ring-border-error')
    // The feedback row still carries the error.
    expect(w.text()).toContain('Bad')
  })

  it('renders trailing actions in icon/default, packed with no gap', () => {
    const w = mountInput({ type: 'password', modelValue: 'secret' })
    for (const label of ['Clear', 'Show']) {
      const btn = w.get(`[aria-label="${label}"]`)
      expect(btn.get('svg').classes()).toContain('text-icon-default')
      // Figma Button Icon: 20px icon + 3px padding, siblings touch.
      expect(btn.classes()).toContain('w-[26px]')
      expect(btn.classes()).toContain('h-[26px]')
    }
    const row = w.get('[aria-label="Clear"]').element.parentElement!
    expect(row.className).not.toMatch(/\bgap-/)
  })

  it('renders the value in text/default', () => {
    const w = mountInput({ modelValue: 'x' })
    expect(w.get('input').classes()).toContain('text-text-default')
  })

  it('shows the error ring on focus only; unfocused keeps its normal border', async () => {
    const w = mountInput({
      errorMessage: 'Enter a valid address',
      modelValue: '0x',
    })
    // Unfocused: no red ring, but the feedback row is shown.
    expect(field(w).classes()).not.toContain('inset-ring-border-error')
    expect(w.text()).toContain('Enter a valid address')
    // Focus: ring turns error red.
    await w.get('input').trigger('focus')
    expect(field(w).classes()).toContain('inset-ring-border-error')
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
    expect(label.classes()).toContain('text-text-disabled')
    expect(w.get('input').classes()).toContain('text-text-disabled')
    expect(w.get('input').classes()).toContain('placeholder:text-text-disabled')
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

describe('AppInput Active vs Focus edge cases (MEW-1971)', () => {
  it('a press on the field padding does not leave a stale Active flag', async () => {
    const w = mountInput({ modelValue: 'x' })
    await field(w).trigger('pointerdown') // padding, not the <input>
    await w.get('input').trigger('focus') // later keyboard focus
    expect(field(w).classes()).toContain('inset-ring-border-brand')
  })
})

describe('AppInput Active reset on blur (MEW-1971)', () => {
  it('a quick blur + Tab back is keyboard Focus again', async () => {
    const w = mountInput({ modelValue: 'x' })
    const input = w.get('input')
    await input.trigger('pointerdown')
    await input.trigger('focus')
    await input.trigger('blur') // inside the 150ms grace window…
    await input.trigger('focus') // …Tab back in
    expect(field(w).classes()).toContain('inset-ring-border-brand')
  })
})
