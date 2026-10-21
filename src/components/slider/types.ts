/**
 * Slider design-library types (Figma: MEW Web App — Design Library › Slider,
 * node 4059:4392).
 */
/** Fill + thumb colour. `success` / `danger` follow a side, e.g. Perps long / short. */
export type SliderTone = 'brand' | 'success' | 'danger'

export const SLIDER_TONE_CLASS: Record<
  SliderTone,
  { fill: string; thumb: string }
> = {
  brand: { fill: 'bg-background-brand', thumb: 'border-border-brand' },
  success: { fill: 'bg-background-success', thumb: 'border-border-success' },
  danger: { fill: 'bg-background-error', thumb: 'border-border-error' },
}

export interface AppSliderProps {
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  tone?: SliderTone
  /** Accessible name (aria-label); the slider has no visible label. */
  label: string
  /** Spoken value, e.g. `v => \`${v}% of balance\``. */
  ariaValueText?: (value: number) => string
}
