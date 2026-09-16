export type ContentGroupSize = 'm' | 'l'
export type ContentGroupAlign = 'left' | 'right'

/**
 * Content Group typography (design library, MEW-2271). Its Figma section is
 * "not published", so these map the Figma tokens to the closest current-system
 * utilities and are centralized here for a one-line swap once design finalizes:
 *   label/base = 16 · heading/base = 20 · text/sm = 14 · text/base = 16
 */
export const TITLE_SIZE_CLASS: Record<ContentGroupSize, string> = {
  m: 'text-s-16', // label/base
  l: 'text-s-20', // heading/base
}

export const DESCRIPTION_SIZE_CLASS: Record<ContentGroupSize, string> = {
  m: 'text-s-14', // text/sm
  l: 'text-s-16', // text/base
}

/** Default (non-inverted) title weight: label/base = medium, heading/base = semibold. */
export const TITLE_WEIGHT_CLASS: Record<ContentGroupSize, string> = {
  m: 'font-medium',
  l: 'font-semibold',
}
