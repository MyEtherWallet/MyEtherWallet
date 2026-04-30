<template>
  <div class="flex items-center justify-center gap-1">
    <app-btn-icon
      :disabled="disabled || !canPrev"
      label="previous page"
      height="h-8"
      width="w-8"
      @click="onPrev"
    >
      <ChevronLeftIcon class="w-4 h-4" />
    </app-btn-icon>
    <span class="px-2 text-s-12 text-info font-medium">
      <template v-if="totalPages !== undefined"
        >{{ currentPage + 1 }} of {{ totalPages }}</template
      >
      <template v-else>Page {{ currentPage + 1 }}</template>
    </span>
    <app-btn-icon
      :disabled="disabled || !canNext"
      label="next page"
      height="h-8"
      width="w-8"
      @click="onNext"
    >
      <ChevronRightIcon class="w-4 h-4" />
    </app-btn-icon>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

const props = withDefaults(
  defineProps<{
    currentPage: number
    totalPages?: number
    disabled?: boolean
    hasPrev?: boolean
    hasNext?: boolean
    scrollTarget?: HTMLElement | null
  }>(),
  {
    totalPages: undefined,
    disabled: false,
    hasPrev: undefined,
    hasNext: undefined,
    scrollTarget: null,
  },
)

const emit = defineEmits<{
  prev: []
  next: []
}>()

const canPrev = computed(() =>
  props.hasPrev !== undefined ? props.hasPrev : props.currentPage > 0,
)
const canNext = computed(() =>
  props.hasNext !== undefined
    ? props.hasNext
    : props.totalPages !== undefined && props.currentPage + 1 < props.totalPages,
)

function scrollToTarget() {
  const target = props.scrollTarget
  if (!target) return
  // Offset for the fixed app header (TheHeader.vue: h-[68px] sm:h-[76px]).
  // Setting scroll-margin-top lets scrollIntoView honor the offset inside
  // whichever ancestor is the actual scroll container (the app layout uses
  // an inner overflow-y-auto wrapper, not the window).
  const headerHeight = window.innerWidth >= 640 ? 76 : 68
  target.style.scrollMarginTop = `${headerHeight + 12}px`
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onPrev() {
  emit('prev')
  scrollToTarget()
}

function onNext() {
  emit('next')
  scrollToTarget()
}
</script>
