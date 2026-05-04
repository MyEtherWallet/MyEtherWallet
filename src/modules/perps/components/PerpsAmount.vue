<template>
  <div
    ref="target"
    class="w-full rounded-20 shadow-button shadow-button-elevated bg-white px-4 sm:px-5 py-4 transition-all min-h-[120px] flex flex-col"
    :class="{
      'ring-2 ring-primary': inFocusInput,
    }"
    @click="setInFocusInput"
  >
    <p class="font-semibold text-s-12 text-info">{{ title }}</p>
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
        :value="amount ?? ''"
        @input="handleInput"
        @focus="setInFocusInput"
        @keypress="checkIfNumber"
      />
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import { watch, ref, type PropType, nextTick } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { onClickOutside } from '@vueuse/core'
import { useInFocusInput } from '@/composables/useInFocusInput'

const props = defineProps({
  title: {
    type: String,
    default: 'Price',
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
  const raw = (e.target as HTMLInputElement).value
  if (raw === '') {
    amount.value = null
  } else {
    const num = parseFloat(raw)
    amount.value = isNaN(num) ? null : num
  }
}

const checkIfNumber = (e: KeyboardEvent) => {
  const key = e.key
  // Numeric
  if (key >= '0' && key <= '9') {
    return
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
