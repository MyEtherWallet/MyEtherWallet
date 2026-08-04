<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Small hint tooltip matching the design-library "Tooltip": a white rounded
 * pill with a downward caret, shown centered above the slotted trigger after a
 * short hover delay. Suppressed while hovering interactive children (buttons),
 * so the hint doesn't cover a card's own CTA/actions.
 */
defineProps<{ text?: string; delay?: number }>()

const show = ref(false)
const tipRef = ref<HTMLElement | null>(null)
const activatorRef = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

const position = () => {
  if (tipRef.value && activatorRef.value) {
    const rect = activatorRef.value.getBoundingClientRect()
    tipRef.value.style.left = `${rect.left + rect.width / 2}px`
    tipRef.value.style.top = `${rect.top - 6}px`
  }
}

const onOver = (e: MouseEvent, delay = 500) => {
  // Don't show over the card's own buttons (CTA, favorite).
  if ((e.target as HTMLElement | null)?.closest('button')) {
    clearTimer()
    show.value = false
    return
  }
  if (show.value || timer) return
  timer = setTimeout(() => {
    timer = null
    show.value = true
    position()
  }, delay)
}

const onLeave = () => {
  clearTimer()
  show.value = false
}

// A fixed-position tooltip detaches from its trigger once the page (or the
// carousel) scrolls, so dismiss it on any scroll. Capture phase catches scroll
// events from nested scroll containers too, since scroll doesn't bubble.
const onScroll = () => {
  if (show.value || timer) onLeave()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { capture: true, passive: true })
})

onBeforeUnmount(() => {
  clearTimer()
  window.removeEventListener('scroll', onScroll, { capture: true })
})
</script>

<template>
  <div
    ref="activatorRef"
    @mouseover="onOver($event, delay ?? 500)"
    @mouseleave="onLeave"
  >
    <slot />
  </div>
  <teleport to="#app">
    <div
      v-show="show"
      ref="tipRef"
      role="tooltip"
      class="pointer-events-none fixed z-[2101] flex -translate-x-1/2 -translate-y-full flex-col items-center [filter:drop-shadow(0_0_0.5px_rgba(0,0,0,0.25))_drop-shadow(0_1.5px_2px_rgba(0,0,0,0.12))]"
    >
      <div
        class="whitespace-nowrap rounded-lg bg-white px-2 py-1 text-center text-s-12 font-semibold leading-[18px] tracking-[-0.24px] text-black"
      >
        {{ text }}
      </div>
      <div
        class="-mt-px size-0 border-x-[6px] border-t-[7px] border-x-transparent border-t-white"
      />
    </div>
  </teleport>
</template>
