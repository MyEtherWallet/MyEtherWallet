<template>
  <div class="p-4 sm:p-6 my-5 bg-error-7 border-1 border-error-10 rounded-16">
    <div class="flex items-center">
      <!-- icon container -->
      <exclamation-triangle-icon class="w-6 h-6 mr-2 text-error" />
      <h3 class="font-bold">{{ title }} !</h3>
    </div>

    <!-- text container -->
    <p class="pt-2 text-s-14 sm:text-s-16 leading-p-150">
      {{ description }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

defineProps({
  title: {
    type: String,
    default: 'Not Recommended',
  },
  description: {
    type: String,
    default:
      'This information is sensitive, and these options should only be used in offline settings by experienced crypto users.',
  },
})
</script>
