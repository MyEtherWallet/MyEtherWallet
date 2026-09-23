<template>
  <!-- Empty State -->
  <div class="p-8 text-center">
    <AppIcon name="bell" variant="filled" size="xxl" class="text-text-placeholder mx-auto mb-3" />
    <p class="text-text-subtle text-s-14">
      {{ $t('notifications_module.no_notifications_yet') }}
    </p>
    <p class="text-text-subtle text-s-12 mt-1">
      {{ text ? text : $t('notifications_module.default_empty_text') }}
    </p>
  </div>
</template>
import AppIcon from '@/components/icon/AppIcon.vue'
<script setup lang="ts">
defineProps({
  text: {
    type: String,
  },
})
</script>
