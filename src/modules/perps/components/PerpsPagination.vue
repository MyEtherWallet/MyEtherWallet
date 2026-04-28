<template>
  <div class="flex items-center justify-center gap-1">
    <app-btn-icon
      :disabled="disabled || !canPrev"
      label="previous page"
      height="h-8"
      width="w-8"
      @click="$emit('prev')"
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
      @click="$emit('next')"
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
  }>(),
  {
    totalPages: undefined,
    disabled: false,
    hasPrev: undefined,
    hasNext: undefined,
  },
)

defineEmits<{
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
</script>
