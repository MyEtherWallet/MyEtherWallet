import { nextTick, onMounted, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { useEventListener, useResizeObserver } from '@vueuse/core'

export type ScrollAxis = 'x' | 'y'

// Sub-pixel scroll offsets never land exactly on 0 or the max.
const EDGE_TOLERANCE_PX = 1

/**
 * Tracks whether a scroll container can still scroll toward its start and its
 * end on one axis, to drive AppScrollFade. Re-checks on scroll and resize;
 * content that grows without resizing the container (async items) needs a
 * manual `update()` from the caller.
 */
export function useScrollEdges(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  axis: ScrollAxis = 'x',
) {
  const canScrollStart = ref(false)
  const canScrollEnd = ref(false)

  const update = () => {
    const element = toValue(target)
    if (!element) return
    const offset = axis === 'x' ? element.scrollLeft : element.scrollTop
    const visibleSize =
      axis === 'x' ? element.clientWidth : element.clientHeight
    const contentSize =
      axis === 'x' ? element.scrollWidth : element.scrollHeight
    canScrollStart.value = offset > EDGE_TOLERANCE_PX
    canScrollEnd.value = offset + visibleSize < contentSize - EDGE_TOLERANCE_PX
  }

  useEventListener(target, 'scroll', update, { passive: true })
  useResizeObserver(target, update)
  onMounted(() => nextTick(update))

  return { canScrollStart, canScrollEnd, update }
}
