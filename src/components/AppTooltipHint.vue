<script setup lang="ts">
import { ref } from 'vue'
import { vElementHover } from '@vueuse/components'

/**
 * Small hint tooltip matching the design-library "Tooltip": a white rounded
 * pill with a downward caret, shown centered above the slotted trigger on
 * hover. (The shared AppTooltip has a different look and no caret.)
 */
defineProps<{ text?: string }>()

const show = ref(false)
const tipRef = ref<HTMLElement | null>(null)
const activatorRef = ref<HTMLElement | null>(null)

const onHover = (hovered: boolean) => {
  show.value = hovered
  if (hovered && tipRef.value && activatorRef.value) {
    const rect = activatorRef.value.getBoundingClientRect()
    tipRef.value.style.left = `${rect.left + rect.width / 2}px`
    tipRef.value.style.top = `${rect.top - 6}px`
  }
}
</script>

<template>
  <div
    ref="activatorRef"
    v-element-hover="[onHover, { delayEnter: 500, delayLeave: 100 }]"
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
