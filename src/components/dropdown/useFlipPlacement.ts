import { nextTick, ref, watch, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'

/**
 * Whether a floating panel anchored under a trigger should open above it
 * instead: only when it doesn't fit below the viewport bottom but does fit
 * above. Re-checked while open on resize and on any scroll (capture, so
 * scrolling containers count too).
 */
export const useFlipPlacement = (
  anchor: Ref<HTMLElement | null>,
  floating: () => HTMLElement | null | undefined,
  isOpen: Ref<boolean>,
  gap = 4,
) => {
  const flipUp = ref(false)

  const update = () => {
    const panel = floating()
    if (!isOpen.value || !anchor.value || !panel) return
    const { top, bottom } = anchor.value.getBoundingClientRect()
    const height = panel.offsetHeight
    const fitsBelow = bottom + gap + height <= window.innerHeight
    const fitsAbove = top - gap - height >= 0
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
