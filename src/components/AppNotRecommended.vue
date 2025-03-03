<template>
  <div
    class="py-[20px] px-[40px] flex justify-center gap-4 mt-8 bg-warning-10 rounded-lg"
  >
    <!-- icon container -->
    <div class="mr-4 text-orange">
      <exclamation-triangle-icon class="w-6 h-6" />
    </div>
    <!-- text container -->
    <div>
      <h3 class="font-bold">{{ title }}</h3>
      <p class="pt-2">
        {{ description }}
      </p>
    </div>
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
