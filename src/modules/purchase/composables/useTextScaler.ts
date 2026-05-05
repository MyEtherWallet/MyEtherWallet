import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { measureTextWidth } from '@/utils/measureText'

/**
 * Picks a font scale from `SCALES` so that `text` fits within
 * `CONTAINER_WIDTH_PX`. Used by the Buy/Sell amount input to keep the typed
 * value visible as it grows (52px → 40px → 32px → ...).
 *
 * Also exposes `measureWithScale`, a helper to measure an arbitrary string at
 * the currently active font size — used to size the `<input>` to the exact
 * width of its content.
 */

export interface TextScale {
  size: number
  lineHeight: number
  tracking: number
}

const SCALES: ReadonlyArray<TextScale> = [
  { size: 52, lineHeight: 56, tracking: -2.08 },
  { size: 40, lineHeight: 44, tracking: -1.6 },
  { size: 32, lineHeight: 36, tracking: -1.28 },
  { size: 24, lineHeight: 26, tracking: -0.48 },
  { size: 16, lineHeight: 22, tracking: -0.32 },
] as const

const CONTAINER_WIDTH_PX = 301
const FIT_PADDING_PX = 4

const buildFont = (size: number): string =>
  `700 ${size}px "DM Sans", sans-serif`

export const useTextScaler = (text: MaybeRefOrGetter<string>) => {
  const scale = computed<TextScale>(() => {
    const value = toValue(text)
    const limit = CONTAINER_WIDTH_PX - FIT_PADDING_PX
    for (const s of SCALES) {
      if (measureTextWidth(value, buildFont(s.size)) <= limit) return s
    }
    return SCALES[SCALES.length - 1]
  })

  const scaleStyle = computed(() => ({
    fontSize: `${scale.value.size}px`,
    lineHeight: `${scale.value.lineHeight}px`,
    letterSpacing: `${scale.value.tracking}px`,
  }))

  const measureWithScale = (target: string): number =>
    measureTextWidth(target, buildFont(scale.value.size))

  return { scale, scaleStyle, measureWithScale }
}
