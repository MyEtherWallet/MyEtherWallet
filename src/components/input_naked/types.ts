/**
 * Input Naked design-library props (Figma: MEW Web App — Design Library ›
 * Input Naked, component set 2822:1751). Prop names mirror the Figma props.
 */
export interface AppInputNakedProps {
  /** Currency prefix, e.g. "$" or "ETH". */
  currency?: string
  showCurrency?: boolean
  placeholder?: string
  /** Shown in the info row while the value is empty. */
  infoMessage?: string
  /** Shown in the info row once there is a value, e.g. "≈ 0.0513 ETH". */
  conversion?: string
  /** Turns currency, value and info row red. */
  error?: boolean
  disabled?: boolean
  /**
   * Output only (e.g. a quote result): keeps its colours, but is never typed
   * in, clicked into or tabbed to. Screen readers still read it.
   */
  readonly?: boolean
  /** Swaps the info row for a spinner; the value stays editable. */
  loading?: boolean
  maxDecimals?: number
  /** Steps value + currency down the heading scale when the value overflows. */
  autoScale?: boolean
  /**
   * Lets autoScale go on past heading/base (20px) to 16px, then 14px, so a
   * 20-character amount fits a side-panel card (Swap, Trade).
   */
  extendedScale?: boolean
  id?: string
  /** Accessible name — the field has no visible label. */
  label: string
}

export interface InputNakedScaleStep {
  valueClass: string
  currencyClass: string
  /** px size + em tracking of each heading token, used to measure the text */
  valueFont: { size: number; tracking: number }
  currencyFont: { size: number; tracking: number }
}

/**
 * Auto-scale steps down the typography heading scale; the first entry is the
 * Figma default (value heading/2xl, currency heading/xl). Currency stays one
 * step below the value, bottoming out at heading/base.
 */
export const INPUT_NAKED_SCALE: InputNakedScaleStep[] = [
  {
    valueClass: 'text-heading-2xl',
    currencyClass: 'text-heading-xl',
    valueFont: { size: 32, tracking: -0.03 },
    currencyFont: { size: 28, tracking: -0.03 },
  },
  {
    valueClass: 'text-heading-xl',
    currencyClass: 'text-heading-lg',
    valueFont: { size: 28, tracking: -0.03 },
    currencyFont: { size: 24, tracking: -0.02 },
  },
  {
    valueClass: 'text-heading-lg',
    currencyClass: 'text-heading-base',
    valueFont: { size: 24, tracking: -0.02 },
    currencyFont: { size: 20, tracking: -0.02 },
  },
  {
    valueClass: 'text-heading-base',
    currencyClass: 'text-heading-base',
    valueFont: { size: 20, tracking: -0.02 },
    currencyFont: { size: 20, tracking: -0.02 },
  },
]

/**
 * `extendedScale`: 16px, then 14px at the smallest. No heading token is this
 * small, so these are the label sizes kept at the heading weight (the amount
 * only shrinks, it doesn't get lighter).
 */
export const INPUT_NAKED_EXTENDED_SCALE: InputNakedScaleStep[] = [
  ...INPUT_NAKED_SCALE,
  {
    valueClass: 'text-label-base font-bold',
    currencyClass: 'text-label-base font-bold',
    valueFont: { size: 16, tracking: -0.02 },
    currencyFont: { size: 16, tracking: -0.02 },
  },
  {
    valueClass: 'text-label-sm font-bold',
    currencyClass: 'text-label-sm font-bold',
    valueFont: { size: 14, tracking: -0.02 },
    currencyFont: { size: 14, tracking: -0.02 },
  },
]
