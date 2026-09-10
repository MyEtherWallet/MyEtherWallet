<script setup lang="ts">
import { computed } from 'vue'
import type { AvatarStatus } from './types'

const props = defineProps<{
  type: AvatarStatus
}>()

// Semantic theme tokens (tailwind.config.js). `muted` reuses grey-subtle — no
// dedicated status-muted token exists.
const COLOR: Record<AvatarStatus, string> = {
  error: 'bg-error',
  warning: 'bg-warning',
  success: 'bg-success',
  muted: 'bg-grey-subtle',
}

const colorClass = computed(() => COLOR[props.type])
</script>

<template>
  <span class="block w-full h-full rounded-full" :class="colorClass" />
</template>
