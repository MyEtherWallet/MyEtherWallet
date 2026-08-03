<script setup lang="ts">
const props = withDefaults(defineProps<{ edge?: 'left' | 'right' | 'both'; width?: number }>(), {
  edge: 'right',
  width: 120,
})
</script>

<template>
  <div
    data-test="scroll-fade"
    :data-edge="props.edge"
    class="pointer-events-none absolute inset-y-0 right-0"
    :style="{ width: `${props.width}px` }"
  />
</template>
