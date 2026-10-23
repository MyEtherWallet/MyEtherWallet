<template>
  <div
    class="flex gap-1.5"
    role="progressbar"
    :aria-label="$t('common.step_of', { current: step, total })"
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
// Segmented bar from the onboarding designs; AppStepper is the legacy labelled stepper.
withDefaults(defineProps<{ step: number; total?: number }>(), { total: 2 })
</script>
