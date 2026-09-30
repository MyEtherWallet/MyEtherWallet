<template>
  <div
    ref="rootElement"
    :class="[
      'flex flex-col items-start gap-1',
      autoScale && 'w-full',
      attrsClass,
    ]"
    :aria-busy="loading || undefined"
  >
    <!-- Value row -->
    <label
      :for="inputId"
      :class="[
        'flex items-center gap-0.5 h-9 max-w-full',
        disabled ? 'cursor-not-allowed' : 'cursor-text',
      ]"
    >
      <span
        v-if="showCurrency && currency"
        :class="[
          'shrink-0 whitespace-nowrap',
          scale.currencyClass,
          textColorClass,
        ]"
        aria-hidden="true"
        data-testid="input-naked-currency"
        >{{ currency }}</span
      >
      <!-- Invisible mirror and input share one grid cell so the input hugs its text -->
      <span class="inline-grid min-w-0 px-0.5">
        <span
          :class="[
            'invisible col-start-1 row-start-1 overflow-hidden whitespace-pre',
            scale.valueClass,
          ]"
          aria-hidden="true"
          >{{ model || placeholder }}</span
        >
        <input
          :id="inputId"
          v-bind="inputAttrs"
          :value="model"
          :disabled="disabled"
          :placeholder="placeholder"
          :aria-label="label"
          :aria-invalid="error || undefined"
          :aria-describedby="hasInfoRow ? infoId : undefined"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          spellcheck="false"
          size="1"
          :class="[
            'col-start-1 row-start-1 w-full min-w-0 p-0 border-0 bg-transparent outline-none focus:ring-0 caret-text-brand disabled:cursor-not-allowed',
            scale.valueClass,
            textColorClass,
            disabled
              ? 'placeholder:text-text-disabled'
              : 'placeholder:text-current focus:placeholder:text-text-placeholder',
          ]"
          data-testid="input-naked-input"
          @input="onInput"
        />
      </span>
    </label>

    <!-- Info row -->
    <div
      v-if="hasInfoRow"
      :id="infoId"
      :class="[
        'flex items-center justify-center gap-2 text-text-sm whitespace-nowrap',
        infoColorClass,
      ]"
      data-testid="input-naked-info"
    >
      <AppSpinner
        v-if="loading"
        size-class="size-5"
        class="text-text-default"
      />
      <template v-else>{{ infoText }}</template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs, useId } from 'vue'
import { useElementSize } from '@vueuse/core'
import AppSpinner from '@/components/AppSpinner.vue'
import { measureTextWidth } from '@/utils/measureText'
import { sanitizeAmount } from './sanitizeAmount'
import {
  INPUT_NAKED_SCALE,
  type AppInputNakedProps,
  type InputNakedScaleStep,
} from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<AppInputNakedProps>(), {
  currency: '$',
  showCurrency: true,
  placeholder: '0',
  infoMessage: '',
  conversion: '',
  error: false,
  disabled: false,
  loading: false,
  maxDecimals: 18,
  autoScale: true,
  id: undefined,
})

// String, never number — keeps "0.", trailing zeros and amounts above 2^53
const model = defineModel<string>({ required: true })

// `class` styles the root, everything else (readonly, name, …) reaches the input
const attrs = useAttrs()
const attrsClass = computed(() => attrs.class)
const inputAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class')),
)

const generatedId = useId()
const inputId = computed(() => props.id ?? `input-naked-${generatedId}`)
const infoId = computed(() => `${inputId.value}-info`)

const infoText = computed(() =>
  model.value ? props.conversion : props.infoMessage,
)
const hasInfoRow = computed(() => props.loading || !!infoText.value)

// Auto-scale
const rootElement = ref<HTMLElement | null>(null)
const { width: rootWidth } = useElementSize(rootElement)

// Value padding (2 × 2px) + row gap (2px) + caret (2px)
const VALUE_ROW_CHROME_PX = 8

// Canvas measureText ignores letter-spacing, so it is added per character
const measure = (
  text: string,
  { size, tracking }: InputNakedScaleStep['valueFont'],
) =>
  measureTextWidth(text, `700 ${size}px "DM Sans", sans-serif`) +
  text.length * tracking * size

const scale = computed<InputNakedScaleStep>(() => {
  const [defaultStep] = INPUT_NAKED_SCALE
  if (!props.autoScale || !rootWidth.value) return defaultStep
  const text = model.value || props.placeholder
  const currency = props.showCurrency ? props.currency : ''
  const available = rootWidth.value - VALUE_ROW_CHROME_PX
  return (
    INPUT_NAKED_SCALE.find(
      step =>
        measure(currency, step.currencyFont) + measure(text, step.valueFont) <=
        available,
    ) ?? INPUT_NAKED_SCALE[INPUT_NAKED_SCALE.length - 1]
  )
})

const textColorClass = computed(() => {
  if (props.disabled) return 'text-text-disabled'
  return props.error ? 'text-text-error' : 'text-text-default'
})

const infoColorClass = computed(() => {
  if (props.disabled) return 'text-text-disabled'
  return props.error ? 'text-text-error' : 'text-text-subtle'
})

const onInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const cleaned = sanitizeAmount(input.value, props.maxDecimals)
  if (cleaned !== input.value) input.value = cleaned
  model.value = cleaned
}
</script>
