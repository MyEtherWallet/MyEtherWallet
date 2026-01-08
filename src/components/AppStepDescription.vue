<template>
  <div class="pt-3 sm:pt-5 lg:pt-7">
    <h2 class="text-info font-semibold uppercase text-sm hidden sm:block">
      Step {{ activeStep + 1 }}
    </h2>
    <p class="!font-bold text6">{{ description.title }}</p>
    <p v-if="description.description" class="text-sm">
      {{ description.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import { type StepDescription } from '@/types/components/appStepper'
defineProps({
  activeStep: {
    type: Number,
    required: true,
  },
  description: {
    type: Object as PropType<StepDescription>,
    required: true,
  },
})
</script>
