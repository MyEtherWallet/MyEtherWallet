import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTextArea from '@/components/text_area/AppTextArea.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { textAreaFieldClass } from '@/components/text_area/types'

const field = (w: ReturnType<typeof mount>) =>
  w.get('textarea').element.parentElement!

const base = {
  surface: 'default',
  filled: false,
  error: false,
  disabled: false,
  focused: false,
  active: false,
} as const

describe('textAreaFieldClass (Figma 3094:65088)', () => {
  it('Default style never has a resting line', () => {
    for (const s of [base, { ...base, filled: true }, { ...base, error: true }])
      expect(textAreaFieldClass(s)).not.toMatch(/(^| )inset-ring /)
  })

  it('Alternative gets the 1px line only when filled, errored or disabled', () => {
    const alt = { ...base, surface: 'alternative' } as const
    expect(textAreaFieldClass(alt)).not.toContain('inset-ring-border-default')
    for (const s of [
      { ...alt, filled: true },
      { ...alt, error: true },
      { ...alt, disabled: true },
    ])
      expect(textAreaFieldClass(s)).toContain(
        'inset-ring inset-ring-border-default',
      )
  })

  it('hovers 1px while empty and valid, 2px once filled or errored', () => {
    expect(textAreaFieldClass(base)).toContain('hover:inset-ring ')
    expect(textAreaFieldClass({ ...base, filled: true })).toContain(
      'hover:inset-ring-2',
    )
    expect(textAreaFieldClass({ ...base, error: true })).toContain(
      'hover:inset-ring-2',
    )
  })

  it('focus is the 2px brand line, even with an error', () => {
    const cls = textAreaFieldClass({ ...base, error: true, focused: true })
    expect(cls).toContain('inset-ring-2 inset-ring-border-brand')
    expect(cls).not.toContain('border-error')
  })

  it('active (editing) and disabled look like rest, with no hover', () => {
    const alt = { ...base, surface: 'alternative', filled: true } as const
    for (const s of [
      { ...alt, focused: true, active: true },
      { ...alt, disabled: true },
    ]) {
      expect(textAreaFieldClass(s)).toContain('inset-ring-border-default')
      expect(textAreaFieldClass(s)).not.toContain('hover:')
    }
  })
})

describe('AppTextArea', () => {
  it('binds v-model and sends attrs to the textarea, class to the root', async () => {
    const w = mount(AppTextArea, {
      props: { modelValue: '', placeholder: 'Message' },
      attrs: { class: 'mt-4', maxlength: 10, 'data-private': '' },
    })
    const textarea = w.get('textarea')
    await textarea.setValue('hi')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['hi'])
    expect(textarea.attributes('maxlength')).toBe('10')
    expect(textarea.attributes()).toHaveProperty('data-private')
    expect(w.classes()).toContain('mt-4')
    expect(textarea.classes()).not.toContain('mt-4')
  })

  it('defaults to 140px tall and takes a height class', () => {
    expect(mount(AppTextArea).classes()).toContain('h-[140px]')
    const tall = mount(AppTextArea, { props: { heightClass: 'h-[220px]' } })
    expect(tall.classes()).toContain('h-[220px]')
    expect(tall.classes()).not.toContain('h-[140px]')
  })

  it('switches field style and line from surface + value', async () => {
    const w = mount(AppTextArea, {
      props: { modelValue: '', surface: 'alternative' },
    })
    expect(field(w).className).toContain('bg-background-alternative')
    expect(field(w).className).not.toContain('inset-ring-border-default')
    await w.setProps({ modelValue: 'filled' })
    expect(field(w).className).toContain('inset-ring-border-default')
  })

  it('shows the brand line on keyboard focus and drops it while typing', async () => {
    const w = mount(AppTextArea, { props: { modelValue: '' } })
    const textarea = w.get('textarea')
    await textarea.trigger('focus')
    expect(field(w).className).toContain('inset-ring-border-brand')
    await textarea.trigger('input')
    expect(field(w).className).not.toContain('inset-ring-border-brand')
  })

  it('shows the message, and the error replaces it', async () => {
    const w = mount(AppTextArea, { props: { message: 'Helper' } })
    const textarea = w.get('textarea')
    let row = w.get(`[id="${textarea.attributes('aria-describedby')}"]`)
    expect(row.text()).toBe('Helper')
    expect(row.classes()).toContain('text-text-subtle')
    expect(textarea.attributes('aria-invalid')).toBe('false')

    await w.setProps({ errorMessage: 'Invalid' })
    row = w.get(`[id="${textarea.attributes('aria-describedby')}"]`)
    expect(row.text()).toContain('Invalid')
    expect(row.attributes('role')).toBe('alert')
    expect(textarea.attributes('aria-invalid')).toBe('true')
    expect(w.text()).not.toContain('Helper')
  })

  it('disabled: grey text, no error row, message kept', () => {
    const w = mount(AppTextArea, {
      props: {
        modelValue: 'x',
        disabled: true,
        errorMessage: 'Invalid',
        message: 'Helper',
      },
    })
    const textarea = w.get('textarea')
    expect(textarea.attributes()).toHaveProperty('disabled')
    expect(textarea.classes()).toContain('text-text-disabled')
    expect(textarea.attributes('aria-invalid')).toBe('false')
    expect(w.text()).not.toContain('Invalid')
    expect(w.text()).toContain('Helper')
  })

  it('label: names the field, floats only once filled, is the placeholder fallback', async () => {
    const w = mount(AppTextArea, {
      props: { modelValue: '', label: 'Message' },
    })
    const textarea = w.get('textarea')
    const label = w.get('label')
    expect(label.attributes('for')).toBe(textarea.attributes('id'))
    expect(label.classes()).toContain('sr-only')
    expect(textarea.attributes('placeholder')).toBe('Message')
    expect(textarea.attributes('aria-label')).toBeUndefined()

    await w.setProps({ modelValue: 'hi' })
    expect(label.classes()).toContain('text-label-xs')
  })

  it('uses the placeholder as the accessible name without a label', () => {
    const w = mount(AppTextArea, { props: { placeholder: 'Message' } })
    expect(w.find('label').exists()).toBe(false)
    expect(w.get('textarea').attributes('aria-label')).toBe('Message')
  })

  it('renders the action as an S Button Icon that emits the value', async () => {
    const w = mount(AppTextArea, {
      props: { modelValue: 'sig', actionIcon: 'copy', actionLabel: 'Copy' },
    })
    const btn = w.getComponent(AppBtnIcon)
    expect(btn.props()).toMatchObject({
      icon: 'copy',
      label: 'Copy',
      size: 's',
    })
    await btn.trigger('click')
    expect(w.emitted('action')?.[0]).toEqual(['sig'])
  })

  it('disables the action with the field and hides it without actionIcon', async () => {
    const w = mount(AppTextArea, {
      props: { actionIcon: 'copy', actionLabel: 'Copy', disabled: true },
    })
    expect(w.getComponent(AppBtnIcon).props('disabled')).toBe(true)
    await w.setProps({ actionIcon: undefined })
    expect(w.findComponent(AppBtnIcon).exists()).toBe(false)
  })
})
