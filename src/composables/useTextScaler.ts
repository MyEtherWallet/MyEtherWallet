import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { measureTextWidth } from '@/utils/measureText'

export interface TextScale {
  size: number
  lineHeight: number
  tracking: number
}

const DEFAULT_SCALES: ReadonlyArray<TextScale> = [
  { size: 52, lineHeight: 56, tracking: -2.08 },
  { size: 40, lineHeight: 44, tracking: -1.6 },
  { size: 32, lineHeight: 36, tracking: -1.28 },
  { size: 24, lineHeight: 26, tracking: -0.48 },
  { size: 16, lineHeight: 22, tracking: -0.32 },
] as const

const DEFAULT_CONTAINER_WIDTH_PX = 301
const FIT_PADDING_PX = 4

const buildFont = (size: number): string =>
  `700 ${size}px "DM Sans", sans-serif`

interface UseTextScalerOptions {
  scales?: ReadonlyArray<TextScale>
  containerWidthPx?: MaybeRefOrGetter<number>
}

export const useTextScaler = (
  text: MaybeRefOrGetter<string>,
  options: UseTextScalerOptions = {},
) => {
  const scales =
    options.scales && options.scales.length > 0
      ? options.scales
      : DEFAULT_SCALES

  const scale = computed<TextScale>(() => {
    const value = toValue(text)
    const containerWidth =
      toValue(options.containerWidthPx) || DEFAULT_CONTAINER_WIDTH_PX
    const limit = containerWidth - FIT_PADDING_PX
    for (const s of scales) {
      if (measureTextWidth(value, buildFont(s.size)) <= limit) return s
    }
    return scales[scales.length - 1]
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
