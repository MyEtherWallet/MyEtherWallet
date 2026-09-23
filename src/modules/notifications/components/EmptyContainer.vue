<template>
  <!-- Empty State -->
  <div class="p-8 text-center">
    <AppIcon
      name="bell"
      variant="filled"
      size="xl"
      class="text-grey-30 mx-auto mb-3"
    />
    <p class="text-info text-s-14">{{ $t('notifications_module.no_notifications_yet') }}</p>
    <p class="text-info text-s-12 mt-1">
      {{
        text
          ? text
          : $t('notifications_module.default_empty_text')
      }}
    </p>
  </div>
</template>
<script setup lang="ts">
import AppIcon from '@/components/icon/AppIcon.vue'

defineProps({
  text: {
    type: String,
  },
})
</script>
