<template>
  <div
    class="flex gap-1.5"
    role="progressbar"
    aria-valuemin="1"
    :aria-valuemax="total"
    :aria-valuenow="step"
  >
    <span
      v-for="index in total"
      :key="index"
      data-testid="step-segment"
      class="h-1 grow rounded-[2px]"
      :class="index <= step ? 'bg-background-brand' : 'bg-border-default'"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ step: number; total?: number }>(), { total: 2 })
</script>
