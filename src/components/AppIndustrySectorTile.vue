<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  label: string
  count?: number
  icon?: string
  to?: string | RouteLocationRaw
}>()

const tag = computed(() => (props.to ? 'RouterLink' : 'div'))
</script>

<template>
  <component
    :is="tag"
    :to="props.to"
    data-test="sector-tile"
    class="block h-[120px] w-[200px] shrink-0 rounded-2xl bg-surface p-4"
  >
    <img v-if="icon" :src="icon" alt="" class="mb-2 h-6 w-6" />
    <div data-test="sector-label" class="font-medium">{{ label }}</div>
    <div v-if="count != null" class="text-xs opacity-60">{{ count }}</div>
  </component>
</template>
