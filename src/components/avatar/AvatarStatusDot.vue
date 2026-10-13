<script setup lang="ts">
import { computed } from 'vue'
import type { AvatarStatus } from './types'

const props = defineProps<{
  type: AvatarStatus
}>()

// Semantic theme tokens (main.css @theme). `muted` reuses decorative-neutral — no
// dedicated status-muted token exists.
const COLOR: Record<AvatarStatus, string> = {
  error: 'bg-background-error',
  warning: 'bg-background-warning',
  success: 'bg-background-success',
  muted: 'bg-background-decorative-neutral',
}

const colorClass = computed(() => COLOR[props.type])
</script>

<template>
  <span class="block w-full h-full rounded-full" :class="colorClass" />
</template>
