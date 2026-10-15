/**
 * Circle fill + glyph colour per tone (Figma `_Icon` status avatar). The glyph
 * inherits the text colour via currentColor; filled glyphs cut their mark out
 * of the shape, so the circle shows through it.
 */
export const ICON_CONTAINER_TONE_CLASS = {
  info: 'bg-background-alternative text-icon-default',
  error: 'bg-background-error-subtle text-icon-error',
  success: 'bg-background-success-subtle text-icon-success',
  warning: 'bg-background-warning-subtle text-icon-warning',
} as const

export type IconContainerTone = keyof typeof ICON_CONTAINER_TONE_CLASS
