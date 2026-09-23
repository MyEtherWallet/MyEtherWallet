<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import AppIcon from '@/components/icon/AppIcon.vue'
import type { IconName } from '@/components/icon/icons'

const props = defineProps<{
  label: string
  /** Solid tile background color (any CSS color). */
  color: string
  /** Design-library icon name shown white inside the translucent bubble. */
  icon?: IconName
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
      <AppIcon v-if="icon" :name="icon" size="xs" class="text-white" />
    </span>
    <p
      data-test="sector-label"
      class="w-full text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-white"
    >
      {{ label }}
    </p>
  </component>
</template>
