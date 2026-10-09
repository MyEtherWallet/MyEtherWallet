export type ContentGroupSize = 'm' | 'l'
export type ContentGroupAlign = 'left' | 'right'
/** Which surface the group sits on — picks the text colours. */
export type ContentGroupTone = 'default' | 'inverse'

/**
 * Content Group line styles (design library, MEW-2271; Figma component set
 * 1952:43). Each line is either the emphasized one (the title, or the
 * description when `inverted`) or the supporting one. The typography tokens
 * carry size, line height, tracking and weight, so no `font-*` override:
 *   M: emphasis label/base 16·600 · supporting text/sm 14·400
 *   L: emphasis heading/base 20·700 · supporting text/base 16·400
 */
export const EMPHASIS_TEXT_CLASS: Record<ContentGroupSize, string> = {
  m: 'text-label-base',
  l: 'text-heading-base',
}

export const SUPPORTING_TEXT_CLASS: Record<ContentGroupSize, string> = {
  m: 'text-text-sm',
  l: 'text-text-base',
}

/** Emphasis / supporting colours per tone. `inverse` is for dark surfaces (Toast, dark modal header). */
export const TONE_EMPHASIS_CLASS: Record<ContentGroupTone, string> = {
  default: 'text-text-default',
  inverse: 'text-white',
}

export const TONE_SUPPORTING_CLASS: Record<ContentGroupTone, string> = {
  default: 'text-text-subtle',
  inverse: 'text-white/70',
}

/** Gap between the title and description rows (loading included): M none, L 4px. */
export const ROW_GAP_CLASS: Record<ContentGroupSize, string> = {
  m: '',
  l: 'gap-1',
}
