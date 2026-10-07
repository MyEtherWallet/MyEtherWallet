/**
 * Centralized input geometry + surface.
 *
 * Mirrors the design-library `Input` Figma component (Size = Large / Small),
 * the single source of truth for field geometry. AppInput reads from here so a
 * size tweak lands in one place — same pattern as `buttonSizes.ts`.
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

export type InputSurface = 'default' | 'alternative'

const SURFACE_BG: Record<InputSurface, string> = {
  default: 'bg-background-default',
  alternative: 'bg-background-alternative',
}
// Figma Default has no resting border (transparent keeps the 1px constant);
// Alternative rests on a 1px border/default line at the outer edge.
const SURFACE_REST_BORDER: Record<InputSurface, string> = {
  default: 'border-transparent',
  alternative: 'border-border-default',
}

/**
 * Field surface classes (bg + border by state), shared by AppInput and
 * AppTextField.
 *
 * The border is a constant 1px so no state shifts the content. Hover and focus
 * thicken it to Figma's 2px with an inset ring of the same colour, which paints
 * just inside the border and takes no layout space. The error colour is
 * focus-only: an unfocused errored field keeps its normal border and is
 * signalled by the feedback row alone.
 */
export const inputSurfaceClass = ({
  surface,
  focused,
  error,
  disabled = false,
}: {
  surface: InputSurface
  focused: boolean
  error: boolean
  disabled?: boolean
}): string => {
  const base = `box-border border transition-[border-color,box-shadow] ${SURFACE_BG[surface]}`
  if (disabled) return `${base} ${SURFACE_REST_BORDER[surface]}`
  if (focused)
    return error
      ? `${base} border-border-error inset-ring inset-ring-border-error`
      : `${base} border-border-brand inset-ring inset-ring-border-brand`
  return `${base} ${SURFACE_REST_BORDER[surface]} hover:border-border-hover hover:inset-ring hover:inset-ring-border-hover`
}
