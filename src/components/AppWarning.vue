<template>
  <div
    role="alert"
    class="p-4 sm:p-6 bg-warning-subtle border-1 border-warning rounded-16 w-full"
  >
    <div class="flex items-center">
      <exclamation-triangle-icon class="w-6 h-6 mr-2 text-warning shrink-0" />
      <h3 class="font-bold">{{ title }}</h3>
    </div>
    <p class="pt-2 text-s-14 leading-p-150">
      {{ text }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

defineProps({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
})
</script>
