<script setup lang="ts">
import AppIcon from '@/components/icon/AppIcon.vue'
import type { IconName } from '@/components/icon/icons'
import { TAG_CLASSES, type TagType, type TagVariant } from './types'

/**
 * Tag (design library, component set 859:624). A small, non-interactive label
 * that categorizes or highlights information — statuses, "New" markers,
 * network labels. It renders a <span> with no states: anything clickable is a
 * Chip or a button, not a Tag. Optional 18px leading/trailing icons take the
 * text colour and use the filled glyph like Figma (stroke-only glyphs fall back
 * to stroke); the `leading` / `trailing` slots replace them for non-icon
 * content (e.g. a small avatar). Attrs (title, aria-label, data-testid) fall
 * through to the root.
 */
withDefaults(
  defineProps<{
    type?: TagType
    variant?: TagVariant
    label?: string
    leadingIcon?: IconName
    trailingIcon?: IconName
  }>(),
  {
    type: 'neutral',
    variant: 'strong',
    label: undefined,
    leadingIcon: undefined,
    trailingIcon: undefined,
  },
)
</script>

<template>
  <span
    class="inline-flex items-center rounded-full p-1 text-label-sm whitespace-nowrap"
    :class="TAG_CLASSES[type][variant]"
  >
    <slot name="leading">
      <AppIcon
        v-if="leadingIcon"
        :name="leadingIcon"
        size="xs"
        variant="filled"
      />
    </slot>
    <span class="px-1"
      ><slot>{{ label }}</slot></span
    >
    <slot name="trailing">
      <AppIcon
        v-if="trailingIcon"
        :name="trailingIcon"
        size="xs"
        variant="filled"
      />
    </slot>
  </span>
</template>
