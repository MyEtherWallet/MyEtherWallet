<template>
  <teleport to="#app">
    <transition
      enter-from-class="opacity-0 scale-95"
      enter-active-class="transition ease-out duration-200"
      enter-to-class="opacity-100 scale-100"
      leave-from-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="visible"
        :style="isAnchored ? anchoredStyle : undefined"
        class="fixed z-[200] w-[360px] min-h-[144px] bg-white rounded-20 shadow-[0px_16px_36px_-6px_rgba(0,0,0,0.45)] p-4"
        :class="
          isAnchored
            ? 'origin-right'
            : 'bottom-6 left-6 max-w-[calc(100vw-3rem)] origin-bottom-left'
        "
        role="tooltip"
        aria-live="polite"
      >
        <!-- Tail pointing right toward the anchor (rounded tip). Only the
             anchored placement has something to point at. -->
        <svg
          v-if="isAnchored"
          class="absolute top-1/2 -right-[14px] -translate-y-1/2 drop-shadow-[3px_2px_3px_rgba(0,0,0,0.28)]"
          width="14"
          height="20"
          viewBox="0 0 14 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M11.7061 6.50337C14.4493 8.02739 14.4493 11.9726 11.7061 13.4966L0 20L0 0L11.7061 6.50337Z"
            fill="white"
          />
        </svg>

        <slot />

        <!-- Dismiss button -->
        <button
          class="absolute top-2 right-2 p-1 rounded-full hoverNoBG"
          :aria-label="$t('trade.weekend.dismiss_tooltip')"
          @click="emit('dismiss')"
        >
          <XMarkIcon class="w-4 h-4 text-info" />
        </button>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
/**
 * The presentational shell shared by the app's floating tooltips: teleport,
 * transition, dismiss button, and one of two placements.
 *
 *  - `anchor`      pinned to the left of an anchor element, with a tail
 *  - `bottom-left` floating in the lower-left of the viewport, no tail
 *
 * It owns no visibility logic of its own — the consumer decides when to show it
 * and what to render inside.
 */
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'

const props = withDefaults(
  defineProps<{
    /** Required by the `anchor` placement; ignored by `bottom-left`. */
    anchor?: HTMLElement | null
    visible: boolean
    placement?: 'anchor' | 'bottom-left'
  }>(),
  { anchor: null, placement: 'anchor' },
)

const emit = defineEmits<{
  dismiss: []
}>()

const isAnchored = computed(() => props.placement === 'anchor')

const anchorRect = ref<DOMRect | null>(null)

const measure = () => {
  if (!isAnchored.value || !props.anchor) return
  anchorRect.value = props.anchor.getBoundingClientRect()
}

const anchoredStyle = computed(() => {
  if (!anchorRect.value) return {}
  const rect = anchorRect.value
  const GAP = 12 // gap card↔button; the 20px tail still reaches into the drawer
  const MARGIN = 16 // min px between tooltip left edge and viewport edge
  // The tooltip's right edge sits at (rect.left - GAP); cap its width to the
  // space left of that point so it never overflows on screens narrower than W.
  const maxWidth = Math.max(0, rect.left - GAP - MARGIN)
  return {
    top: `${rect.top + rect.height / 2}px`,
    right: `${window.innerWidth - rect.left + GAP}px`,
    maxWidth: `${maxWidth}px`,
    transform: 'translateY(-50%)',
  }
})

// Measure as it becomes visible (and if the anchor arrives later), so the card
// is never painted at a stale position.
watch(
  [() => props.visible, () => props.anchor, () => props.placement],
  ([isVisible]) => {
    if (isVisible) measure()
  },
  { immediate: true },
)

const reposition = () => {
  if (!props.visible) return
  measure()
}

onMounted(() => {
  window.addEventListener('resize', reposition)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', reposition)
})
</script>
