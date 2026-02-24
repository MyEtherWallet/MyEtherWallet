<template>
  <!-- Empty State -->
  <div class="p-8 text-center">
    <bell-icon class="w-12 h-12 text-grey-30 mx-auto mb-3" />
    <p class="text-info text-s-14">No notifications yet</p>
    <p class="text-info text-s-12 mt-1">
      {{
        text
          ? text
          : 'Your recent orders, swaps, bridges and transactions will appear here.'
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
