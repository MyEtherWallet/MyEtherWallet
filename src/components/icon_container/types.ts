/**
 * Circle fill + glyph colour per tone (Figma `_Icon` status avatar; the glyphs
 * use the `background/*` tokens, as in Figma). The glyph inherits the text
 * colour via currentColor; filled glyphs cut their mark out of the shape, so
 * the circle shows through it.
 */
export const ICON_CONTAINER_TONE_CLASS = {
  info: 'bg-background-alternative text-icon-default',
  error: 'bg-background-error-subtle text-background-error',
  success: 'bg-background-success-subtle text-background-success',
  warning: 'bg-background-warning-subtle text-background-warning',
} as const

export type IconContainerTone = keyof typeof ICON_CONTAINER_TONE_CLASS
