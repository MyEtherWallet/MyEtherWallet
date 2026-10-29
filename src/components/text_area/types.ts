import type { InputSurface } from '@/components/inputSizes'

/**
 * Text Area design-library surface (Figma: MEW Web App — Design Library ›
 * Text area, component set 3094:65088). Same Style axis and names as Input
 * (`InputSurface`), but its own line rules:
 *
 * - Default style never has a resting line. Alternative gets a 1px
 *   border/default only once the field is filled, errored or disabled; empty
 *   and valid it has none.
 * - Hover is 1px border/hover while empty and valid, 2px once filled or
 *   errored.
 * - Focus is 2px border/brand, with or without an error: the feedback row is
 *   the only error cue.
 * - Active (editing) looks like the resting state, as on Input.
 *
 * Every line is an inset ring, so going 0 → 1 → 2px never moves the text.
 * One static string per case so the Tailwind scan sees every class.
 */
const TEXT_AREA_BG: Record<InputSurface, string> = {
  default: 'bg-background-default',
  alternative: 'bg-background-alternative',
}

const TEXT_AREA_REST_LINE: Record<InputSurface, string> = {
  default: '',
  alternative: 'inset-ring inset-ring-border-default',
}

const HOVER_THIN = 'hover:inset-ring hover:inset-ring-border-hover'
const HOVER_THICK = 'hover:inset-ring-2 hover:inset-ring-border-hover'
const FOCUS = 'inset-ring-2 inset-ring-border-brand'

export const textAreaFieldClass = ({
  surface,
  filled,
  error,
  disabled,
  focused,
  active,
}: {
  surface: InputSurface
  filled: boolean
  error: boolean
  disabled: boolean
  focused: boolean
  active: boolean
}): string => {
  const bg = TEXT_AREA_BG[surface]
  const rest = filled || error || disabled ? TEXT_AREA_REST_LINE[surface] : ''
  if (disabled || (focused && active)) return `${bg} ${rest}`
  if (focused) return `${bg} ${FOCUS}`
  return `${bg} ${rest} ${filled || error ? HOVER_THICK : HOVER_THIN}`
}
