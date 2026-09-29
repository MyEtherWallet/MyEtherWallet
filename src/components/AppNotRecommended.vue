<template>
  <div class="p-4 sm:p-6 bg-error-7 border-1 border-error-10 rounded-16 w-full">
    <div class="flex items-center">
      <!-- icon container -->
      <AppIcon name="exclamation-triangle" class="mr-2 text-error" />
      <h3 class="font-bold">{{ title || $t('common.not_recommended') }}</h3>
    </div>

    <!-- text container -->
    <p class="pt-2 text-s-14 leading-p-150">
      {{ description || $t('common.not_recommended_description') }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import AppIcon from '@/components/icon/AppIcon.vue'

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
