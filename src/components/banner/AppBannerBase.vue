<template>
  <div
    :class="[
      'flex w-full gap-2 rounded-12 bg-background-default px-4',
      isMultiLine()
        ? 'min-h-15 items-start py-3'
        : 'min-h-12 items-center py-2',
    ]"
  >
    <slot name="icon" />
    <div
      :class="[
        'flex min-w-0 flex-1 flex-col items-end justify-center',
        { 'gap-4': isMultiLine() },
      ]"
    >
      <div class="flex w-full flex-col break-words text-text-default">
        <p v-if="title" class="text-label-base">{{ title }}</p>
        <div class="text-text-sm">
          <slot>{{ description }}</slot>
        </div>
      </div>
      <div v-if="$slots.actions" class="flex items-start gap-2">
        <slot name="actions" />
      </div>
    </div>
    <AppBtnIcon
      v-if="dismissible"
      icon="x-mark"
      size="s"
      :label="$t('common.dismiss')"
      @click="emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'

/**
 * `_base / Banner` (design library, Figma 3740:42018). Internal: only AppBanner
 * renders it. Figma's "Text alignment" variant follows from content, so it's
 * not a prop: a title or actions give the multi-line layout (top-aligned,
 * stacked), a bare description the single-line one (centred).
 *
 * The default slot replaces `description` for copy that needs markup.
 */
const props = defineProps<{
  title?: string
  description?: string
  dismissible?: boolean
}>()
const emit = defineEmits<{ close: [] }>()
const slots = useSlots()

// A function, not a computed: slots aren't reactive, so a computed would miss
// an #actions slot that appears after mount.
const isMultiLine = () => !!props.title || !!slots.actions
</script>
