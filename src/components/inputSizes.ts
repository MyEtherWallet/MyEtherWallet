/**
 * Centralized input sizing.
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
