<template>
  <div
    :class="[
      isFocused ? 'bg-white border border-grey-10' : 'bg-bgBase',
      'rounded-20 p-4 flex flex-col items-center justify-between h-[272px] transition-colors',
    ]"
  >
    <!-- Header -->
    <div
      class="w-full flex items-center justify-between pb-3 border-b border-grey-10"
    >
      <p class="text-s-11 font-bold tracking-sp-06 uppercase text-black">
        {{ label }}
      </p>
      <purchase-currency-chip
        :currency="currency"
        @click="emit('open-currency')"
      />
    </div>

    <!-- Amount + estimate / helper / spinner / error -->
    <div class="flex flex-col items-center gap-2">
      <label
        :for="inputId"
        :style="scaleStyle"
        class="h-[56px] w-[301px] flex items-center justify-center cursor-text caret-primary font-bold"
      >
        <span v-if="symbolPosition === 'prefix'" aria-hidden="true">{{
          effectiveSymbol
        }}</span>
        <input
          :id="inputId"
          ref="inputEl"
          :value="displayValue"
          type="text"
          inputmode="decimal"
          aria-label="Amount"
          class="bg-transparent outline-none border-none p-0 font-bold text-black appearance-none w-auto min-w-0 max-w-full text-left"
          :style="{
            fontSize: 'inherit',
            lineHeight: 'inherit',
            letterSpacing: 'inherit',
            width: inputWidth,
          }"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
        />
        <span
          v-if="amount === ''"
          :class="isFocused ? 'text-grey-30' : 'text-black'"
          aria-hidden="true"
        >0</span>
        <span
          v-if="symbolPosition === 'suffix'"
          aria-hidden="true"
          class="ml-2"
        >{{ effectiveSymbol }}</span>
      </label>

      <p
        v-if="isLoading"
        class="h-[22px] flex items-center justify-center"
        aria-live="polite"
      >
        <span
          class="inline-block w-5 h-5 rounded-full border-2 border-grey-10 border-t-grey-30 animate-spin"
        />
      </p>
      <p
        v-else-if="errorMessage"
        class="text-s-16 font-semibold text-error leading-[22px] tracking-[-0.32px] text-center"
      >
        {{ errorMessage }}
      </p>
      <p
        v-else-if="helperMessage"
        class="text-s-16 font-semibold text-info leading-[22px] tracking-[-0.32px] text-center"
      >
        {{ helperMessage }}
      </p>
      <p
        v-else
        class="text-s-16 font-semibold text-info leading-[22px] tracking-[-0.32px] text-center"
      >
        ≈ {{ estimate }}
      </p>
    </div>

    <!-- Balance row (Sell mode) -->
    <p
      v-if="balance"
      class="text-s-12 text-info leading-[18px] text-center"
    >
      {{ $t('purchase.sell.your_balance') }}
      <span
        :class="[
          'font-semibold',
          balance.hasError ? 'text-error' : 'text-black',
        ]"
      >{{ balance.value }}</span>
      <span class="text-info"> ({{ balance.fiat }})</span>
    </p>

    <!-- Quick amount buttons -->
    <div class="flex items-center justify-center gap-1 w-full">
      <button
        v-for="preset in presetAmounts"
        :key="preset"
        type="button"
        :class="[
          isFocused ? 'bg-bgBase' : 'bg-white',
          selectedPreset === preset
            ? 'border-2 border-black'
            : 'border-2 border-transparent',
          'flex-1 min-w-0 flex items-center justify-center px-3 py-2 rounded-8 hoverNoBG transition-colors',
        ]"
        @click="onSelectPreset(preset)"
      >
        <span class="text-s-11 font-bold tracking-sp-06 uppercase">
          {{ currencySymbol }}{{ preset }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import PurchaseCurrencyChip from './PurchaseCurrencyChip.vue'
import { getCurrencySymbol } from '@/utils/currencySymbols'
import {
  formatWithCommas,
  sanitizeDecimal,
  exceedsLimits,
} from '../helpers/amountFormatting'
import { useTextScaler } from '../composables/useTextScaler'

interface AmountBalance {
  value: string
  fiat: string
  /** When true, the value portion is rendered in the error color. */
  hasError?: boolean
}

const props = withDefaults(
  defineProps<{
    label: string
    currency: string
    amount: string
    estimate: string
    isLoading?: boolean
    errorMessage?: string
    helperMessage?: string
    presetAmounts?: number[]
    autofocus?: boolean
    /** Text rendered next to the amount value. If omitted, derived from `currency` via `getCurrencySymbol`. */
    amountSymbol?: string
    /** Position of the symbol relative to the amount. `'prefix'` for fiat ($100), `'suffix'` for crypto (0.5 ETH). */
    symbolPosition?: 'prefix' | 'suffix'
    /** Optional balance row shown below the estimate (Sell mode). */
    balance?: AmountBalance | null
  }>(),
  {
    isLoading: false,
    errorMessage: '',
    helperMessage: '',
    presetAmounts: () => [15, 50, 100, 250],
    autofocus: false,
    amountSymbol: undefined,
    symbolPosition: 'prefix',
    balance: null,
  },
)

const emit = defineEmits<{
  'update:amount': [value: string]
  'open-currency': []
  'select-preset': [value: number]
  focus: []
  blur: []
}>()

const inputId = `purchase-amount-input-${Math.random().toString(36).slice(2, 8)}`
const isFocused = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)

const onFocus = () => {
  isFocused.value = true
  emit('focus')
}

const onBlur = () => {
  isFocused.value = false
  emit('blur')
}

const currencySymbol = computed(() => getCurrencySymbol(props.currency))

const effectiveSymbol = computed(
  () => props.amountSymbol ?? currencySymbol.value,
)

const selectedPreset = computed(() => {
  if (props.amount === '') return null
  const n = Number(props.amount)
  return props.presetAmounts.find(p => p === n) ?? null
})

const displayValue = computed(() => formatWithCommas(props.amount))

const scalerText = computed(() => {
  const value = displayValue.value || '0'
  return props.symbolPosition === 'suffix'
    ? `${value} ${effectiveSymbol.value}`
    : `${effectiveSymbol.value}${value}`
})
const { scaleStyle, measureWithScale } = useTextScaler(scalerText)

const inputWidth = computed(() => {
  if (displayValue.value === '') return '2px'
  return `${Math.ceil(measureWithScale(displayValue.value)) + 2}px`
})

const onInput = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const oldValue = target.value
  const oldCursor = target.selectionStart ?? oldValue.length

  let unitsBefore = 0
  for (let i = 0; i < oldCursor; i++) {
    if (oldValue[i] !== ',') unitsBefore++
  }

  const raw = oldValue.replace(/,/g, '')
  const sanitized = sanitizeDecimal(raw)

  // Reject the keystroke if it would exceed the digit limits — restore the
  // visual to the previous value and step the cursor back one position.
  if (exceedsLimits(sanitized)) {
    target.value = displayValue.value
    const cursor = Math.max(0, oldCursor - 1)
    target.setSelectionRange(cursor, cursor)
    return
  }

  emit('update:amount', sanitized)
  await nextTick()

  const formatted = target.value
  let count = 0
  let newCursor = formatted.length
  for (let i = 0; i < formatted.length; i++) {
    if (count >= unitsBefore) {
      newCursor = i
      break
    }
    if (formatted[i] !== ',') count++
  }
  target.setSelectionRange(newCursor, newCursor)
}

const onSelectPreset = (preset: number) => {
  emit('update:amount', String(preset))
  emit('select-preset', preset)
}

const focus = () => inputEl.value?.focus()

defineExpose({ focus })

onMounted(() => {
  if (props.autofocus) focus()
})
</script>

