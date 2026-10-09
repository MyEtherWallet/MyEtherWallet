/**
 * Centralized input geometry + surface.
 *
 * Mirrors the design-library `Input` Figma component (Size × Style), the single
 * source of truth for field geometry and surface. AppInput and AppTextArea
 * read from here so a size or surface tweak lands in one place.
 *
 * Both sizes share the 16px inline padding, 8px row gap, 12px radius and 14/20
 * value type. They differ only in field height, leading-avatar size, and
 * whether the float-label row is ever rendered (Large yes, Small never).
 */
export const INPUT_SIZES = ['large', 'small'] as const

export type InputSize = (typeof INPUT_SIZES)[number]

type InputSizeSpec = {
  /** Fixed field height — never changes across states. */
  field: string
  /** Leading-slot avatar box (24px Large / 18px Small). */
  avatar: string
  /** Whether the 12/18 float label is rendered when filled. */
  showLabel: boolean
}

export const INPUT_SIZE_SPEC: Record<InputSize, InputSizeSpec> = {
  // Figma Size=Large — h 56, px 16, gap 8, avatar 24, label row shown when filled
  large: { field: 'h-14', avatar: 'size-6', showLabel: true },
  // Figma Size=Small — h 40, px 16, gap 8, avatar 18, label row never shown
  small: { field: 'h-10', avatar: 'size-[18px]', showLabel: false },
}

export const INPUT_SURFACES = ['default', 'alternative'] as const

export type InputSurface = (typeof INPUT_SURFACES)[number]

type InputSurfaceSpec = {
  /** Field fill. */
  bg: string
  /** Resting line, if any. */
  rest: string
}

const INPUT_SURFACE_SPEC: Record<InputSurface, InputSurfaceSpec> = {
  // Figma Style=Default — background/default fill, no resting line
  default: { bg: 'bg-background-default', rest: '' },
  // Figma Style=Alternative — background/alternative fill, 1px border/default
  alternative: {
    bg: 'bg-background-alternative',
    rest: 'inset-ring inset-ring-border-default',
  },
}

/**
 * Field surface classes (fill + line by state), shared by AppInput and
 * AppTextArea.
 *
 * Every line is an inset ring, never a CSS border: a ring takes no layout
 * space, so the 1px rest → 2px hover/focus change never moves the content and
 * the inline padding stays exactly 16px. The ring is Focus-only: while editing
 * (Figma "Active": pointer focus or typing) the field keeps its resting line with no ring or hover, and
 * an unfocused errored field keeps its normal line, signalled by the feedback
 * row alone.
 */
export const inputSurfaceClass = ({
  surface,
  focused,
  active = false,
  error,
  disabled = false,
}: {
  surface: InputSurface
  focused: boolean
  active?: boolean
  error: boolean
  disabled?: boolean
}): string => {
  const { bg, rest } = INPUT_SURFACE_SPEC[surface]
  const base = `box-border transition-shadow ${bg}`
  if (disabled || (focused && active)) return `${base} ${rest}`
  if (focused)
    return error
      ? `${base} inset-ring-2 inset-ring-border-error`
      : `${base} inset-ring-2 inset-ring-border-brand`
  return `${base} ${rest} hover:inset-ring-2 hover:inset-ring-border-hover`
}
