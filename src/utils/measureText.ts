/**
 * Text measurement helper backed by a lazily-created, shared `<canvas>` 2D
 * context. Use this to compute the rendered pixel width of a string with a
 * given CSS font, without inserting the text into the DOM.
 */

let measureCtx: CanvasRenderingContext2D | null = null

const getMeasureCtx = (): CanvasRenderingContext2D | null => {
  if (measureCtx) return measureCtx
  if (typeof document === 'undefined') return null
  measureCtx = document.createElement('canvas').getContext('2d')
  return measureCtx
}

/**
 * Returns the pixel width of `text` rendered with the given CSS `font`
 * shorthand (e.g. `700 16px "DM Sans", sans-serif`). Returns `0` in non-browser
 * environments where a canvas context cannot be created.
 */
export const measureTextWidth = (text: string, font: string): number => {
  const ctx = getMeasureCtx()
  if (!ctx) return 0
  ctx.font = font
  return ctx.measureText(text).width
}
