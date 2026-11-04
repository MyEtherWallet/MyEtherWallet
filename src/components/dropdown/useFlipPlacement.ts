import { nextTick, ref, watch, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'

const CLIPPING_OVERFLOW = new Set(['auto', 'scroll', 'hidden', 'clip'])

/**
 * Whether a floating panel anchored under a trigger should open above it
 * instead: only when it doesn't fit below the visible area but does fit
 * above. The visible area is the viewport narrowed by every ancestor that
 * clips overflow (e.g. a Modal's scrolling body), so the panel isn't cut off
 * inside one. Re-checked while open on resize and on any scroll (capture, so
 * scrolling containers count too).
 */
export const useFlipPlacement = (
  anchor: Ref<HTMLElement | null>,
  floating: () => HTMLElement | null | undefined,
  isOpen: Ref<boolean>,
  gap = 4,
) => {
  const flipUp = ref(false)

  const visibleBounds = (el: HTMLElement) => {
    let top = 0
    let bottom = window.innerHeight
    // Stop at <body>: with the page scroll-locked behind a modal its box can
    // be shorter than the viewport without clipping anything fixed.
    for (
      let node = el.parentElement;
      node && node !== document.body;
      node = node.parentElement
    ) {
      if (!CLIPPING_OVERFLOW.has(getComputedStyle(node).overflowY)) continue
      const rect = node.getBoundingClientRect()
      top = Math.max(top, rect.top)
      bottom = Math.min(bottom, rect.bottom)
    }
    return { top, bottom }
  }

  const update = () => {
    const panel = floating()
    if (!isOpen.value || !anchor.value || !panel) return
    const { top, bottom } = anchor.value.getBoundingClientRect()
    const bounds = visibleBounds(anchor.value)
    const height = panel.offsetHeight
    const fitsBelow = bottom + gap + height <= bounds.bottom
    const fitsAbove = top - gap - height >= bounds.top
    flipUp.value = !fitsBelow && fitsAbove
  }

  // Measure once the panel has rendered; a closed panel always resets below.
  watch(isOpen, async open => {
    if (!open) {
      flipUp.value = false
      return
    }
    await nextTick()
    update()
  })

  useEventListener(window, 'resize', update, { passive: true })
  useEventListener(window, 'scroll', update, { passive: true, capture: true })

  return { flipUp }
}
