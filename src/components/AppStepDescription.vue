<template>
  <div class="pt-3 sm:pt-5 lg:pt-7">
    <h2 class="text-info font-bold uppercase text-s-12 mb-1">
      {{ $t('common.step', { number: activeStep + 1 }) }}
    </h2>
    <h3 class="font-bold text-s-24 sm:text-s-32 mb-2 leading-p-120">
      {{ description.title }}
    </h3>
    <p
      v-if="description.description"
      class="text-s-14 sm:text-s-16 text-info leading-p-150"
    >
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
