import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { nextTick } from 'vue'
import AppCodeInput from '@/components/code_input/AppCodeInput.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

let wrapper: VueWrapper | undefined
const mountInput = (props: Record<string, unknown> = {}) => {
  wrapper = mount(AppCodeInput, {
    attachTo: document.body,
    props: { modelValue: '', ...props },
    global: { plugins: [i18n] },
  })
  return wrapper
}
afterEach(() => wrapper?.unmount())

const cells = (w: VueWrapper) => w.findAll('input')
const values = (w: VueWrapper) =>
  cells(w).map(c => (c.element as HTMLInputElement).value)
const focusedIndex = (w: VueWrapper) =>
  cells(w).findIndex(c => c.element === document.activeElement)
const lastEmitted = (w: VueWrapper, event: string) => {
  const calls = w.emitted(event) ?? []
  return calls[calls.length - 1]?.[0]
}

/** Press a key in a box the way a browser reports it: the box then holds both characters. */
const press = async (w: VueWrapper, index: number, char: string) => {
  const cell = cells(w)[index].element as HTMLInputElement
  cell.value = `${cell.value}${char}`
  cell.dispatchEvent(
    new InputEvent('input', { inputType: 'insertText', data: char }),
  )
  await nextTick()
}

/** Type one character into a cell the way a keyboard does. */
const type = async (w: VueWrapper, index: number, char: string) => {
  const cell = cells(w)[index]
  ;(cell.element as HTMLInputElement).value = char
  await cell.trigger('input')
}

const paste = async (w: VueWrapper, index: number, text: string) => {
  await cells(w)[index].trigger('paste', {
    clipboardData: { getData: () => text },
  })
}

describe('AppCodeInput', () => {
  it('renders six numeric cells that accept a one-time code', () => {
    const w = mountInput()

    expect(cells(w)).toHaveLength(6)
    for (const cell of cells(w)) {
      expect(cell.attributes('inputmode')).toBe('numeric')
      expect(cell.attributes('autocomplete')).toBe('one-time-code')
    }
  })

  it('moves to the next cell after a digit is typed', async () => {
    const w = mountInput()

    await type(w, 0, '4')

    expect(lastEmitted(w, 'update:modelValue')).toBe('4')
    expect(focusedIndex(w)).toBe(1)
  })

  it('ignores anything that is not a digit', async () => {
    const w = mountInput()

    await type(w, 0, 'x')

    expect(values(w)[0]).toBe('')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('fills every cell from a pasted code and reports it complete', async () => {
    const w = mountInput()

    await paste(w, 0, '123 456')

    expect(values(w)).toEqual(['1', '2', '3', '4', '5', '6'])
    expect(lastEmitted(w, 'update:modelValue')).toBe('123456')
    expect(w.emitted('complete')).toEqual([['123456']])
  })

  it('spreads an autofilled code typed into one cell across the cells', async () => {
    const w = mountInput()

    await type(w, 0, '987654')

    expect(values(w)).toEqual(['9', '8', '7', '6', '5', '4'])
    expect(w.emitted('complete')).toEqual([['987654']])
  })

  it('replaces the digit when another is typed into a filled box', async () => {
    const w = mountInput({ modelValue: '123' })

    await press(w, 0, '9')

    expect(values(w).slice(0, 3)).toEqual(['9', '2', '3'])
    expect(lastEmitted(w, 'update:modelValue')).toBe('923')
  })

  it('keeps a box to one digit when its own digit is typed again', async () => {
    const w = mountInput({ modelValue: '123' })

    await press(w, 0, '1')

    expect(values(w).slice(0, 3)).toEqual(['1', '2', '3'])
  })

  it('empties a box when its digit is deleted', async () => {
    const w = mountInput({ modelValue: '123' })
    const cell = cells(w)[1]
    ;(cell.element as HTMLInputElement).value = ''

    await cell.trigger('input')

    expect(values(w).slice(0, 3)).toEqual(['1', '', '3'])
  })

  it('fills from the first box when a whole code is autofilled into a later one', async () => {
    const w = mountInput()

    await type(w, 2, '987654')

    expect(values(w)).toEqual(['9', '8', '7', '6', '5', '4'])
    expect(w.emitted('complete')).toEqual([['987654']])
  })

  it('does not report a complete code a second time when nothing changed', async () => {
    const w = mountInput({ modelValue: '12345' })
    await press(w, 5, '6')

    await press(w, 5, '6')

    expect(w.emitted('complete')).toEqual([['123456']])
  })

  it('reports the code complete when the last digit is typed', async () => {
    const w = mountInput({ modelValue: '12345' })

    await type(w, 5, '6')

    expect(w.emitted('complete')).toEqual([['123456']])
  })

  it('goes back and clears the previous cell on backspace in an empty cell', async () => {
    const w = mountInput({ modelValue: '12' })
    ;(cells(w)[2].element as HTMLInputElement).focus()

    await cells(w)[2].trigger('keydown', { key: 'Backspace' })

    expect(lastEmitted(w, 'update:modelValue')).toBe('1')
    expect(focusedIndex(w)).toBe(1)
  })

  it('shows the cells from the model and clears them when it is emptied', async () => {
    const w = mountInput({ modelValue: '123456' })
    expect(values(w)).toEqual(['1', '2', '3', '4', '5', '6'])

    await w.setProps({ modelValue: '' })
    await nextTick()

    expect(values(w)).toEqual(['', '', '', '', '', ''])
  })

  it('marks every cell invalid in the error state', () => {
    const w = mountInput({ status: 'error' })

    for (const cell of cells(w)) {
      expect(cell.attributes('aria-invalid')).toBe('true')
      expect(cell.classes()).toContain('border-border-error')
    }
  })

  it('uses the success border in the success state', () => {
    const w = mountInput({ status: 'success' })

    for (const cell of cells(w)) {
      expect(cell.classes()).toContain('border-border-success')
    }
  })

  it('focuses the first cell when asked to', async () => {
    const w = mountInput()

    ;(w.vm as unknown as { focus: () => void }).focus()
    await nextTick()

    expect(focusedIndex(w)).toBe(0)
  })
})
