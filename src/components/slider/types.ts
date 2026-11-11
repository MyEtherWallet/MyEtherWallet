/**
 * Slider design-library types (Figma: MEW Web App — Design Library › Slider,
 * node 4059:4392).
 */
export interface AppSliderProps {
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  /** Accessible name (aria-label); the slider has no visible label. */
  label: string
  /** Spoken value, e.g. `v => \`${v}% of balance\``. */
  ariaValueText?: (value: number) => string
}
