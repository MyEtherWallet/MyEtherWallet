<template>
  <div class="pt-3 xs:pt-10">
    <p class="text-info font-semibold uppercase text-sm">
      Step {{ activeStep + 1 }}
    </p>
    <p class="!font-bold text6">{{ description.title }}</p>
    <p class="text-sm">{{ description.description }}</p>
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
