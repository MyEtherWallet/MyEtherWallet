<template>
  <div
    aria-hidden="true"
    :class="[
      'relative overflow-hidden',
      isCircle ? 'rounded-full' : 'rounded-[4px]',
    ]"
  >
    <div
      :class="[
        'absolute inset-0 -right-full animate-shimmer',
        isCircle ? 'bg-shimmer-circle' : 'bg-shimmer-bar',
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'

const props = defineProps({
  shape: {
    type: String as PropType<'bar' | 'circle'>,
    default: 'bar',
  },
})

const isCircle = computed(() => props.shape === 'circle')
</script>
