<template>
  <!-- Empty State -->
  <div class="p-8 text-center">
    <bell-icon class="w-12 h-12 text-fg-muted mx-auto mb-3" />
    <p class="text-fg-subtle text-s-14">{{ $t('notifications_module.no_notifications_yet') }}</p>
    <p class="text-fg-subtle text-s-12 mt-1">
      {{
        text
          ? text
          : $t('notifications_module.default_empty_text')
      }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { BellIcon } from '@heroicons/vue/24/solid'

defineProps({
  text: {
    type: String,
  },
})
</script>
