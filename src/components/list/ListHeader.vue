<script setup lang="ts">
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import type { ContentGroupSize } from '@/components/content_group/types'
import type { ListAction } from './types'

/**
 * Header row of AppList (Figma List › Title: _Content Group + Slot + Buttcon
 * Icon). Internal: the same row sits inside the `rows` container (size M,
 * title only) or above the list (size L, title + description).
 */
defineProps<{
  title: string
  description?: string
  size: ContentGroupSize
  action?: ListAction
}>()

const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <div
    data-testid="list-header"
    class="flex w-full items-center gap-2 px-3 py-2"
  >
    <AppContentGroup
      :title="title"
      :description="description"
      :size="size"
      no-wrap
      class="flex-1"
    />
    <div
      v-if="$slots.extra"
      data-testid="list-header-extra"
      class="flex size-8 shrink-0 items-center justify-center"
    >
      <slot name="extra" />
    </div>
    <slot name="action">
      <AppBtnIcon
        v-if="action"
        :icon="action.icon"
        :label="action.label"
        data-testid="list-header-action"
        @click="emit('action')"
      />
    </slot>
  </div>
</template>
