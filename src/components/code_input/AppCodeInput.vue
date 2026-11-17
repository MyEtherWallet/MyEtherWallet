<template>
  <div
    role="group"
    :aria-label="label ?? t('common.code_input.label')"
    class="flex items-start justify-center gap-2"
  >
    <input
      v-for="(digit, index) in digits"
      :key="index"
      :ref="
        el => {
          if (el) cells[index] = el as HTMLInputElement
        }
      "
      :value="digit"
      type="text"
      inputmode="numeric"
      autocomplete="one-time-code"
      :maxlength="length"
      :disabled="disabled"
      :aria-label="
        t('common.code_input.digit_label', { index: index + 1, total: length })
      "
      :aria-invalid="status === 'error' ? 'true' : undefined"
      class="h-18 w-full max-w-16 min-w-0 rounded-16 border-[1.5px] bg-background-alternative text-center text-s-24 font-bold text-text-default caret-text-default outline-none transition-colors focus:border-2 disabled:opacity-50"
      :class="cellClass"
      @input="onInput(index, $event)"
      @keydown="onKeydown(index, $event)"
      @paste="onPaste"
      @focus="($event.target as HTMLInputElement).select()"
    />
  </div>
</template>

<script setup lang="ts">
// One-time-code field: one box per digit (Figma "OTP Digit Input", 143:529).
// Typing advances, backspace goes back, and a pasted or autofilled code is
// spread across the boxes. Emits `complete` once every box holds a digit.
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export type CodeInputStatus = 'default' | 'error' | 'success'

const props = withDefaults(
  defineProps<{
    /** The digits entered so far. */
    modelValue: string
    length?: number
    status?: CodeInputStatus
    disabled?: boolean
    /** Accessible name for the group of boxes. */
    label?: string
  }>(),
  { length: 6, status: 'default', disabled: false, label: undefined },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  complete: [code: string]
}>()

const { t } = useI18n()

const toDigits = (value: string): string[] => {
  const chars = value.replace(/\D/g, '').slice(0, props.length).split('')
  return Array.from({ length: props.length }, (_, i) => chars[i] ?? '')
}

const digits = ref<string[]>(toDigits(props.modelValue))
const cells = ref<HTMLInputElement[]>([])
/** The code last reported, so an unchanged code is never reported twice. */
let published = props.modelValue

watch(
  () => props.modelValue,
  value => {
    published = value
    if (value !== digits.value.join('')) digits.value = toDigits(value)
  },
)

const STATUS_BORDER: Record<CodeInputStatus, string> = {
  default: 'border-border-default focus:border-border-hover',
  error: 'border-border-error',
  success: 'border-border-success',
}
const cellClass = computed(() => STATUS_BORDER[props.status])

const focusCell = (index: number): void => {
  const cell = cells.value[Math.min(Math.max(index, 0), props.length - 1)]
  cell?.focus()
  cell?.select()
}

const publish = (): void => {
  const code = digits.value.join('')
  if (code === published) return
  published = code
  emit('update:modelValue', code)
  if (digits.value.every(digit => digit !== '')) emit('complete', code)
}

/** Place `chars` from `start` onwards, then move to the next empty box. */
const fill = (start: number, chars: string): void => {
  const next = [...digits.value]
  chars
    .slice(0, props.length - start)
    .split('')
    .forEach((char, offset) => {
      next[start + offset] = char
    })
  digits.value = next
  focusCell(start + chars.length)
  publish()
}

const onInput = (index: number, event: Event): void => {
  const target = event.target as HTMLInputElement
  if (target.value === '') {
    // Delete or cut emptied the box.
    clearCell(index)
    return
  }
  // A key press reports the character typed. Using it means typing into a
  // filled box replaces its digit, instead of the box's two characters being
  // read as a longer code.
  const typedChar =
    event instanceof InputEvent && event.inputType === 'insertText'
      ? event.data
      : null
  const entered = (typedChar ?? target.value).replace(/\D/g, '')
  if (entered.length >= props.length) {
    // A whole code at once is autofill: it starts at the first box wherever
    // the cursor happened to be.
    fill(0, entered)
  } else if (entered) {
    fill(index, typedChar === null ? entered : entered.slice(-1))
  }
  // The box shows exactly its digit, also when nothing changed (not a digit,
  // or the same digit again).
  target.value = digits.value[index]
}

const onPaste = (event: ClipboardEvent): void => {
  event.preventDefault()
  const pasted = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '')
  if (pasted) fill(0, pasted)
}

const clearCell = (index: number): void => {
  const next = [...digits.value]
  next[index] = ''
  digits.value = next
  publish()
}

const onKeydown = (index: number, event: KeyboardEvent): void => {
  if (event.key === 'Backspace') {
    event.preventDefault()
    if (digits.value[index]) {
      clearCell(index)
    } else if (index > 0) {
      clearCell(index - 1)
      focusCell(index - 1)
    }
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusCell(index - 1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusCell(index + 1)
  }
}

/** Focus the first box, e.g. after a wrong code was cleared. */
const focus = (): void => focusCell(0)
defineExpose({ focus })
</script>
