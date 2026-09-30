<template>
  <p
    v-if="message || $slots.default"
    :role="type === 'error' ? 'alert' : 'status'"
    :class="[
      'flex w-full min-h-6 items-center gap-1 px-4 text-text-xs',
      FEEDBACK_CLASS[type],
    ]"
  >
    <AppIcon
      v-if="type !== 'text'"
      :name="FEEDBACK_ICON[type]"
      size="s"
      class="shrink-0"
    />
    <span class="flex-1 min-w-0 break-words"
      ><slot>{{ message }}</slot></span
    >
  </p>
</template>

<script setup lang="ts">
import AppIcon from '@/components/icon/AppIcon.vue'
import {
  FEEDBACK_CLASS,
  FEEDBACK_ICON,
  type FeedbackType,
} from '@/components/input_feedback/types'

/**
 * Feedback row under a form field (design library `_feedback / _base`, Figma
 * 2564:1269). Type drives the fixed icon + colour; `text` is a plain grey hint.
 * Renders nothing without a message, so fields don't reserve its height.
 *
 * `min-h-6` rather than Figma's fixed 24px: long messages wrap and grow the row
 * instead of overflowing it. Pass `id` (fallthrough) for the field's
 * `aria-describedby`.
 *
 * @example
 * <AppInputFeedback type="error" :message="error" :id="feedbackId" />
 */
withDefaults(defineProps<{ type?: FeedbackType; message?: string }>(), {
  type: 'text',
  message: undefined,
})
</script>
