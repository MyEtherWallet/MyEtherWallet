export type ContentGroupSize = 'm' | 'l'
export type ContentGroupAlign = 'left' | 'right'
/** Which surface the group sits on — picks the text colours. */
export type ContentGroupTone = 'default' | 'inverse'

/**
 * Content Group typography (design library, MEW-2271), bound to the published
 * Typography tokens (MEW-2031, `main.css` @theme). Each token carries size,
 * line-height, tracking and weight, so one class is the whole style:
 *   m → title label/base (16/22 · 600) · description text/sm (14/20 · 400)
 *   l → title heading/base (20/22 · 700) · description text/base (16/22 · 400)
 * `inverted` only swaps the weights via `font-*`, which override the token's slot.
 */
export const TITLE_SIZE_CLASS: Record<ContentGroupSize, string> = {
  m: 'text-label-base',
  l: 'text-heading-base',
}

export const DESCRIPTION_SIZE_CLASS: Record<ContentGroupSize, string> = {
  m: 'text-text-sm',
  l: 'text-text-base',
}

/** Title / description colours per tone. `inverse` is for dark surfaces (Toast, dark modal header). */
export const TONE_TITLE_CLASS: Record<ContentGroupTone, string> = {
  default: 'text-text-default',
  inverse: 'text-text-inverted',
}

export const TONE_DESCRIPTION_CLASS: Record<ContentGroupTone, string> = {
  default: 'text-text-subtle',
  inverse: 'text-text-inverted-subtle',
}
