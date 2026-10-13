/**
 * Spinner design-library types (Figma: MEW Web App — Design Library › Spinner,
 * node 474:1124).
 */
export const SPINNER_COLORS = ['default', 'inverted', 'placeholder'] as const
export type SpinnerColor = (typeof SPINNER_COLORS)[number]

/** `default` is the Figma token; the others cover dark and muted surfaces. */
export const SPINNER_COLOR_CLASS: Record<SpinnerColor, string> = {
  default: 'text-background-info',
  inverted: 'text-text-inverted',
  placeholder: 'text-text-placeholder',
}

export interface AppSpinnerProps {
  /** Width and height in px. */
  size?: number
  color?: SpinnerColor
  /** Accessible name; defaults to `common.loading`. */
  label?: string
}
