<template>
  <div
    role="alert"
    class="p-4 sm:p-6 bg-background-warning-subtle border-1 border-border-warning rounded-16 w-full"
  >
    <div class="flex items-center">
      <AppIcon name="exclamation-triangle" class="mr-2 text-text-warning shrink-0" />
      <h3 class="font-bold">{{ title }}</h3>
    </div>
    <p class="pt-2 text-s-14 leading-p-150">
      {{ text }}
    </p>
  </div>
</template>

import AppIcon from '@/components/icon/AppIcon.vue'
<script lang="ts" setup>
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
