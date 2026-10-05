<template>
  <div
    class="flex items-start gap-2 rounded-16 bg-background-default px-4 py-3"
    role="note"
  >
    <AppAvatar type="icon" size="m" class="shrink-0">
      <template #icon>
        <AppIcon
          name="exclamation-circle"
          variant="filled"
          class="text-icon-error"
        />
      </template>
    </AppAvatar>
    <p class="text-sm text-text-subtle">
      <span class="font-semibold">{{ title }}</span>
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppIcon from '@/components/icon/AppIcon.vue'

defineProps<{ title: string; text: string }>()
</script>
