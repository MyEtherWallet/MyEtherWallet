<script setup lang="ts">
import { warn } from 'vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import type { IconName } from '@/components/icon/icons'

/**
 * ActionBarButton (design library, Figma component set 776:214). A 72px square
 * in the right-side ActionBar: brand icon over an overline label. Hover is CSS;
 * Active (the drawer this button owns is open) is the `active` prop, announced
 * through aria-pressed. Without a label it is the bar's icon-only top action,
 * which is not a toggle and needs `ariaLabel` for its accessible name.
 */
const props = withDefaults(
  defineProps<{
    icon: IconName
    /** Omit for the icon-only top action. */
    label?: string
    active?: boolean
    /** Not in Figma; for feature-gated actions. */
    disabled?: boolean
    /** Required when `label` is omitted. */
    ariaLabel?: string
  }>(),
  {
    label: undefined,
    active: false,
    disabled: false,
    ariaLabel: undefined,
  },
)

if (!props.label && !props.ariaLabel) {
  warn('AppActionBarButton: an icon-only button needs an ariaLabel.')
}
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :aria-label="ariaLabel ?? label"
    :aria-pressed="label ? active : undefined"
    class="flex size-18 flex-col items-center justify-center gap-2 rounded-16 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-brand disabled:pointer-events-none disabled:opacity-40"
    :class="
      active ? 'bg-background-brand-subtle' : 'hover:bg-background-default'
    "
  >
    <AppIcon :name="icon" variant="filled" class="text-icon-brand" />
    <span
      v-if="label"
      class="line-clamp-2 w-full break-words text-center text-overline text-text-default"
    >
      {{ label }}
    </span>
  </button>
</template>
