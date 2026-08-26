<script setup lang="ts">
import { computed, type Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  label: string
  /** Solid tile background color (any CSS color). */
  color: string
  /** Heroicon component shown white inside the translucent bubble. */
  icon?: Component
  to?: string | RouteLocationRaw
}>()

const tag = computed(() => (props.to ? 'RouterLink' : 'div'))
</script>

<template>
  <component
    :is="tag"
    :to="props.to"
    data-test="sector-tile"
    class="flex h-[120px] w-[200px] shrink-0 cursor-pointer flex-col items-end justify-center gap-10 overflow-hidden rounded-2xl border border-transparent px-4 py-3 transition-colors hover:border-black/20"
    :style="{ backgroundColor: color }"
  >
    <span class="flex items-center rounded-full bg-white/20 p-2">
      <component :is="icon" v-if="icon" class="size-[18px] text-white" />
    </span>
    <p
      data-test="sector-label"
      class="w-full text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-white"
    >
      {{ label }}
    </p>
  </component>
</template>
