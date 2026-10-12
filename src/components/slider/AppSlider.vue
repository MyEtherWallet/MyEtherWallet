<script setup lang="ts">
/**
 * Slider (Figma: MEW Web App — Design Library › Slider, node 4059:4392).
 * A transparent native range input sits on top of the drawn track, fill and
 * thumb, so pointer, keyboard and screen readers stay native.
 *
 * @example
 * <AppSlider v-model="percent" :step="25" label="Amount" />
 */
import { computed } from 'vue'
import { SIZE } from '@/components/sizeScale'
import type { AppSliderProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<AppSliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  ariaValueText: undefined,
})

const model = defineModel<number>({ required: true })

const THUMB_SIZE = SIZE['5']
const THUMB_RADIUS = THUMB_SIZE / 2

const ratio = computed(() => {
  const span = props.max - props.min
  if (span <= 0) return 0
  return Math.min(Math.max((model.value - props.min) / span, 0), 1)
})

// The thumb stays inside the track ends, so its centre travels from one radius
// to (width − one radius); the fill ends at the thumb's right edge.
const thumbLeft = computed(
  () => `calc(${THUMB_RADIUS}px + ${ratio.value} * (100% - ${THUMB_SIZE}px))`,
)
const fillWidth = computed(
  () => `calc(${THUMB_SIZE}px + ${ratio.value} * (100% - ${THUMB_SIZE}px))`,
)

const trackClass = computed(() =>
  props.disabled ? 'bg-background-disabled' : 'bg-background-alternative',
)
const fillClass = computed(() =>
  props.disabled ? 'bg-background-brand-disabled' : 'bg-background-brand',
)
const thumbClass = computed(() =>
  props.disabled
    ? 'border-border-disabled bg-background-disabled'
    : 'border-border-brand bg-background-alternative',
)

const onInput = (event: Event) => {
  model.value = Number((event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="relative flex h-5 w-full items-center" data-testid="slider">
    <!-- Native thumb sized like the drawn one so pointer positions line up -->
    <input
      v-bind="$attrs"
      :value="model"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :aria-label="label"
      :aria-valuetext="ariaValueText?.(model)"
      type="range"
      class="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer appearance-none opacity-0 disabled:cursor-default [&::-moz-range-thumb]:size-5 [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none"
      data-testid="slider-input"
      @input="onInput"
    />
    <div
      class="absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 rounded-full"
      :class="trackClass"
      data-testid="slider-track"
    />
    <div
      class="absolute left-0 top-1/2 h-2.5 -translate-y-1/2 rounded-full"
      :class="fillClass"
      :style="{ width: fillWidth }"
      data-testid="slider-fill"
    />
    <div
      class="pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-3 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-border-focus"
      :class="thumbClass"
      :style="{ left: thumbLeft }"
      data-testid="slider-thumb"
    />
  </div>
</template>
