<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  name: string
  symbol: string
  price?: string
  change?: number
  logo?: string
  to?: string | RouteLocationRaw
}>()

const tag = computed(() => (props.to ? 'RouterLink' : 'div'))

const dir = computed<'up' | 'down' | 'flat'>(() => {
  if (!props.change) return 'flat'
  return props.change > 0 ? 'up' : 'down'
})
</script>

<template>
  <component
    :is="tag"
    :to="props.to"
    data-test="listing-card"
    class="block w-[160px] shrink-0 rounded-2xl bg-surface p-4 xs:w-[180px]"
  >
    <img v-if="logo" :src="logo" alt="" class="mb-3 h-8 w-8 rounded-full" />
    <div data-test="listing-name" class="truncate text-s-15 font-semibold">
      {{ name }}
    </div>
    <div data-test="listing-symbol" class="text-s-12 text-info">
      {{ symbol }}
    </div>
    <div data-test="listing-price" class="mt-2 text-s-15 font-medium">
      {{ price }}
    </div>
    <div
      data-test="listing-change"
      :data-dir="dir"
      class="text-s-12"
      :class="{
        'text-success': dir === 'up',
        'text-error': dir === 'down',
        'text-info': dir === 'flat',
      }"
    >
      {{
        change != null ? `${change > 0 ? '+' : ''}${change.toFixed(2)}%` : '--'
      }}
    </div>
  </component>
</template>
