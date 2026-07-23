<template>
  <div
    ref="target"
    class="w-full rounded-20 shadow-button shadow-button-elevated bg-white px-4 sm:px-5 py-4 transition-all min-h-[120px] flex flex-col"
    :class="{
      'ring-2 ring-primary': inFocusInput,
    }"
    @click="setInFocusInput"
  >
    <p class="font-semibold text-s-12 text-info">{{ displayTitle }}</p>
    <div class="flex justify-start items-center w-full gap-1">
      <span
        class="font-medium text-s-28 tracking-tight shrink-0"
        :class="[!amount ? 'opacity-60' : '', !!error ? 'text-error' : '']"
        >$</span
      >
      <input
        ref="amountInput"
        class="grow py-1 text-s-28 font-medium focus:outline-none focus:ring-0 !border-transparent !appearance-none bg-transparent min-w-0"
        :class="{ 'text-error': !!error }"
        name="amount-input"
        id="amount-input"
        type="decimal"
        autoComplete="off"
        placeholder="0.00"
        :value="inputValue"
        @input="handleInput"
        @focus="setInFocusInput"
        @keypress="checkIfNumber"
      />
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed, type PropType, nextTick } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { onClickOutside } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useInFocusInput } from '@/composables/useInFocusInput'

const { t } = useI18n()

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  validateInput: {
    type: Function as PropType<() => void>,
    default: () => {},
    required: true,
  },
  isPristine: {
    type: Boolean,
    default: false,
  },
  // Permit a leading '-' so the field can hold 0 / negative values (e.g. a
  // short position's take-profit target). Off by default so positive-only
  // fields (margin, withdraw, stop-loss) stay unchanged.
  allowNegative: {
    type: Boolean,
    default: false,
  },
})

const amount = defineModel('amount', {
  type: [null, Number] as PropType<null | number>,
  required: true,
})

const error = defineModel('error', {
  type: String,
  required: true,
  default: '',
})

const displayTitle = computed(
  () => props.title || t('perps.amount.price-label'),
)

// When allowNegative is on, a leading '-' (and transient states like "-",
// "-0", "-0.") can't be represented by the numeric model alone — String(-0)
// drops the sign. pendingRaw preserves exactly what the user typed while it
// doesn't round-trip through Number, and clears once it does.
const pendingRaw = ref<string | null>(null)

const inputValue = computed(() =>
  pendingRaw.value ?? (amount.value ?? ''),
)

// Drop a stale pendingRaw when the model is changed from outside (e.g. a pill
// sets the price) so the input reflects the new value instead of the old draft.
watch(
  () => amount.value,
  val => {
    if (pendingRaw.value !== null && parseFloat(pendingRaw.value) !== val) {
      pendingRaw.value = null
    }
  },
)

watch(
  () => amount.value,
  useDebounceFn(() => {
    props.validateInput()
  }, 500),
)

/**------------------------
 * Focus State
 -------------------------*/
const target = ref<HTMLElement | null>(null)
const targetValue = ref<HTMLElement | null>(null)
const amountInput = ref<HTMLElement | null>(null)

const {
  inFocusInput,
  setInFocusInput: setInFocusInputElement,
  startOutOfFocusTimeout,
} = useInFocusInput(amountInput)

const setInFocusInput = () => {
  nextTick(() => {
    setInFocusInputElement()
  })
  targetValue.value = target.value
  nextTick(() => {
    setInFocusInputElement()
  })
}

onClickOutside(targetValue, () => {
  targetValue.value = null
  startOutOfFocusTimeout()
  props.validateInput()
})

const handleInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  const raw = input.value
  if (raw === '') {
    pendingRaw.value = null
    amount.value = null
    return
  }
  const num = parseFloat(raw)
  // Reject non-finite parses (e.g. very long inputs that overflow Number.MAX_VALUE
  // to Infinity) — otherwise Vue would stringify amount back into the input as
  // the literal "Infinity" and downstream consumers would submit it.
  if (!Number.isFinite(num)) {
    // A partial negative/decimal in progress ("-", "-.", ".") has no numeric
    // value yet but is valid to keep on screen while the user finishes typing.
    if (props.allowNegative && /^-?\d*\.?\d*$/.test(raw)) {
      pendingRaw.value = raw
      amount.value = null
      return
    }
    pendingRaw.value = null
    input.value = amount.value === null ? '' : String(amount.value)
    return
  }
  // Preserve the raw text whenever it doesn't round-trip through Number
  // (e.g. "-0", "-0.", trailing dot) so the sign/decimal-in-progress survives.
  pendingRaw.value = props.allowNegative && raw !== String(num) ? raw : null
  amount.value = num
}

const checkIfNumber = (e: KeyboardEvent) => {
  const key = e.key
  // Numeric
  if (key >= '0' && key <= '9') {
    return
  }
  // Allow a single leading minus when negatives are permitted.
  if (props.allowNegative && key === '-') {
    const el = e.target as HTMLInputElement
    if (el.selectionStart === 0 && !el.value.includes('-')) {
      return
    }
  }
  // Only allow a single period
  if (key === '.') {
    if (amount.value === null) {
      return
    }
    const input = amount.value.toString()
    if (!input.includes('.')) {
      return
    }
  }
  // Alphabetical (/non-numeric) or multiple periods. Don't propagate change
  e.preventDefault()
}
</script>
