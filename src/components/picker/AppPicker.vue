<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import {
  PICKER_SIZE_CLASS,
  PICKER_TEXT_PAD_CLASS,
  PICKER_AVATAR_SIZE,
  PICKER_SURFACE_BG_CLASS,
  type PickerSize,
  type PickerSurface,
} from './types'

/**
 * Picker (design library, component set 2531:29279). The trigger used whenever a
 * selection opens a modal — the trailing chevron-right hints that a modal will
 * open, and the row shows an optional leading Avatar plus a Title (and, at size
 * L, a Description via Content Group). If the choice happens inline, use the
 * Dropdown component instead. The modal content itself is out of scope.
 *
 * Renders as a <button>, so hover / focus / disabled are the native pseudo-states
 * (no state prop) and a plain @click falls through to open the modal. The Avatar
 * is consumer-supplied through the `avatar` slot — the picker only owns its size —
 * so any Avatar type (wallet, network, crypto…) can be dropped in.
 *
 * The Figma "Style" axis is spelled `surface` here (shared with Chip + Input):
 * `style` is reserved as an HTML/Vue attribute and can't be a prop name.
 */
const props = withDefaults(
  defineProps<{
    title: string
    /** Second line, size L only — shorter sizes are single-line by design. */
    description?: string
    size?: PickerSize
    surface?: PickerSurface
    disabled?: boolean
    /** Show the leading avatar slot (on by default, per Figma). */
    avatar?: boolean
    /** Selection not resolved yet: Content Group skeleton, clicks and keys ignored. */
    loading?: boolean
    /** The caller's modal open state, mirrored to `aria-expanded`. */
    expanded?: boolean
  }>(),
  {
    size: 'm',
    surface: 'default',
    disabled: false,
    avatar: true,
    loading: false,
    // Vue casts an absent boolean to false; keep the attribute off instead.
    expanded: undefined,
  },
)

const avatarSize = computed(() => PICKER_AVATAR_SIZE[props.size])

// The pill (S) hugs its content and can't fit a second line; M's 40px row is
// title-only too. Only the 64px L row has room for the description (Figma).
const isPill = computed(() => props.size === 's')
const description = computed(() =>
  props.size === 'l' ? props.description : undefined,
)

const rootClass = computed(() => [
  PICKER_SIZE_CLASS[props.size],
  PICKER_SURFACE_BG_CLASS[props.surface],
  isPill.value ? 'inline-flex' : 'flex w-full',
  // Loading also sets `disabled` (so Enter/Space can't open it) but isn't dimmed.
  props.disabled ? 'opacity-40' : '',
])
</script>

<template>
  <button
    type="button"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    aria-haspopup="dialog"
    :aria-expanded="expanded"
    data-testid="picker"
    class="items-center text-left transition-colors duration-200 hover:bg-background-alternative-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-border-brand disabled:pointer-events-none"
    :class="rootClass"
  >
    <span
      v-if="avatar && $slots.avatar"
      class="shrink-0"
      data-testid="picker-avatar"
    >
      <slot name="avatar" :size="avatarSize" />
    </span>

    <AppContentGroup
      :title="title"
      :description="description"
      :loading="loading"
      size="m"
      no-wrap
      :class="[isPill ? 'shrink-0' : 'flex-1', PICKER_TEXT_PAD_CLASS[size]]"
    />

    <span
      class="flex size-4 shrink-0 items-center justify-center text-icon-subtle"
      data-testid="picker-chevron"
    >
      <AppIcon name="chevron-right" size="xxs" />
    </span>
  </button>
</template>
