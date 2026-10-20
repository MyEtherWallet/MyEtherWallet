<script setup lang="ts">
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import { CARD_VARIANT_CLASS, type CardVariant } from './types'

/**
 * Card (design library, Figma 2276:5773). Self-contained block for asset or
 * promo cards outside a list: an optional header (32px Avatar + Content Group +
 * a trailing action such as an AppBtnIcon), consumer content in the default
 * slot, and an optional Button Group. Width fills the parent and height hugs
 * the content; the default slot renders straight into the column with no
 * padding of its own, so the consumer lays it out.
 *
 * `interactive` adds a transparent <button> stretched over the card (the
 * AppNewsCard pattern) instead of making the root a button: the header action
 * and the buttons sit above it, so they stay real, separate buttons rather than
 * nesting inside one. Hover, pressed and focus are native states of that
 * button; only `selected` and `loading` are props. Leave `selected` unbound for
 * cards that aren't toggles so aria-pressed isn't exposed.
 */
withDefaults(
  defineProps<{
    title?: string
    description?: string
    variant?: CardVariant
    interactive?: boolean
    selected?: boolean
    loading?: boolean
    /** Not a Figma state: blocks and dims an interactive card (e.g. a limit is hit). */
    disabled?: boolean
    /** Accessible name for the hit button when there's no title. */
    label?: string
  }>(),
  {
    variant: 'default',
    selected: undefined,
  },
)

const emit = defineEmits<{ click: [] }>()

const AVATAR_SIZE = 'm' as const // 32px
</script>

<template>
  <div
    data-testid="card"
    class="relative flex flex-col overflow-hidden rounded-16 transition-colors duration-200"
    :class="[CARD_VARIANT_CLASS[variant], { 'opacity-40': disabled }]"
    :aria-busy="loading || undefined"
  >
    <div
      v-if="title || $slots.avatar || $slots.action"
      data-testid="card-header"
      class="flex items-start gap-3 p-4"
    >
      <template v-if="$slots.avatar">
        <span
          v-if="loading"
          data-testid="card-avatar-skeleton"
          class="size-8 shrink-0 self-center rounded-full bg-background-skeleton animate-pulse"
        ></span>
        <span v-else class="shrink-0 self-center">
          <slot name="avatar" :size="AVATAR_SIZE" />
        </span>
      </template>

      <AppContentGroup
        v-if="title"
        :title="title"
        :description="description"
        :loading="loading"
        class="flex-1"
      />

      <span v-if="$slots.action" class="relative z-10 ml-auto shrink-0">
        <slot name="action" />
      </span>
    </div>

    <slot />

    <AppBtnGroup
      v-if="$slots.buttons"
      data-testid="card-buttons"
      has-padding
      class="relative z-10"
    >
      <slot name="buttons" />
    </AppBtnGroup>

    <button
      v-if="interactive"
      type="button"
      data-testid="card-hit"
      class="card-hit absolute inset-0 rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-brand disabled:cursor-default!"
      :class="{ 'ring-1 ring-inset ring-border-selected': selected }"
      :aria-label="label || title"
      :aria-pressed="selected"
      :disabled="loading || disabled"
      @click="emit('click')"
    ></button>
  </div>
</template>
