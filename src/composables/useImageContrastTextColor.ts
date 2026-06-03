import { ref } from 'vue'

interface UseImageContrastTextColorOptions {
  lightColor?: string
  darkColor?: string
  /** WCAG contrast ratio threshold. Default 4.5 (AA for normal text). */
  threshold?: number
  /** Downsample size for the offscreen canvas. Default 32px. */
  sampleSize?: number
}

/**
 * Picks a text color (light or dark) based on WCAG relative-luminance
 * sampling of a background image. Requires the image host to serve CORS
 * headers; falls back to `isDynamic = false` when the canvas would be
 * tainted, so callers can apply a static overlay/shadow instead.
 */
export const useImageContrastTextColor = (
  options: UseImageContrastTextColorOptions = {},
) => {
  const lightColor = options.lightColor ?? '#ffffff'
  const darkColor = options.darkColor ?? '#0a0a0a'
  const threshold = options.threshold ?? 4.5
  const sampleSize = options.sampleSize ?? 32

  const textColor = ref<string>(lightColor)
  const isDynamic = ref(false)

  const toLinear = (c: number) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }

  const sampleAverageColor = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas')
    canvas.width = sampleSize
    canvas.height = sampleSize
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('canvas 2d context unavailable')
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize)
    const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize)
    let r = 0
    let g = 0
    let b = 0
    const pixels = data.length / 4
    for (let i = 0; i < data.length; i += 4) {
      r += toLinear(data[i])
      g += toLinear(data[i + 1])
      b += toLinear(data[i + 2])
    }
    return { r: r / pixels, g: g / pixels, b: b / pixels }
  }

  const computeFromImage = (img: HTMLImageElement) => {
    try {
      const { r, g, b } = sampleAverageColor(img)
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const contrastWithWhite = 1.05 / (luminance + 0.05)
      textColor.value = contrastWithWhite >= threshold ? lightColor : darkColor
      isDynamic.value = true
    } catch {
      isDynamic.value = false
    }
  }

  /**
   * Loads `src` as an anonymous (CORS-enabled) image and computes the text
   * color from its average pixel luminance. Silently no-ops if the image
   * cannot be sampled (no CORS, decode error, etc.).
   */
  const sampleFromUrl = (src: string) => {
    const sampler = new Image()
    sampler.crossOrigin = 'anonymous'
    sampler.onload = () => computeFromImage(sampler)
    sampler.onerror = () => {
      isDynamic.value = false
    }
    sampler.src = src
  }

  return {
    textColor,
    isDynamic,
    sampleFromUrl,
  }
}
