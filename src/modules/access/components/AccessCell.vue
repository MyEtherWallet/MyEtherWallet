<template>
  <component
    :is="as"
    class="flex items-center gap-3 rounded-16 bg-background-default px-4 py-3 min-h-14"
    :class="{
      'w-full text-left cursor-pointer transition-colors hover:bg-background-default-hover':
        as !== 'div',
    }"
  >
    <slot name="avatar" />
    <AppContentGroup
      :title="title"
      :description="description"
      size="m"
      no-wrap
      class="grow min-w-0"
    />
    <slot name="trailing" />
  </component>
</template>

<script setup lang="ts">
/**
 * Local stand-in for the design-library Cell (Alternative / S) until #5766
 * lands; swap the call sites to AppCell then.
 */
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'

withDefaults(
  defineProps<{
    title: string
    description?: string
    as?: 'div' | 'button' | 'a'
  }>(),
  { description: undefined, as: 'div' },
)
</script>
