<template>
  <div
    class="p-4 sm:p-6 bg-background-error-subtle border-1 border-border-error-subtle rounded-16 w-full"
  >
    <div class="flex items-center">
      <!-- icon container -->
      <AppIcon name="exclamation-triangle" class="mr-2 text-text-error" />
      <h3 class="font-bold">{{ title || $t('common.not_recommended') }}</h3>
    </div>

    <!-- text container -->
    <p class="pt-2 text-s-14 leading-p-150">
      {{ description || $t('common.not_recommended_description') }}
    </p>
  </div>
</template>

import AppIcon from '@/components/icon/AppIcon.vue'
<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
})
</script>
