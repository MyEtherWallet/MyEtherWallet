<template>
  <component
    :is="href ? 'a' : 'button'"
    :type="href ? undefined : 'button'"
    :href="href"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
    :disabled="href ? undefined : disabled"
    :aria-label="label"
    :class="[
      'inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-brand disabled:cursor-default! disabled:opacity-40',
      BTN_ICON_SIZE[size].box,
      BTN_ICON_VARIANT_CLASS[variant],
    ]"
  >
    <AppIcon
      v-if="icon"
      :name="icon"
      :size="BTN_ICON_SIZE[size].icon"
      :variant="iconVariant"
    />
    <slot v-else />
  </component>
</template>

<script setup lang="ts">
import AppIcon from '@/components/icon/AppIcon.vue'
import type { IconEntry, IconName } from '@/components/icon/icons'
import {
  BTN_ICON_SIZE,
  BTN_ICON_VARIANT_CLASS,
  type BtnIconSize,
  type BtnIconVariant,
} from './btnIconTypes'

/**
 * Button Icon (design library, Figma 82:15271). Icon-only button for compact
 * actions where a label isn't needed. Hover, pressed, disabled and focus are
 * native CSS states, not props. `@click` falls through as a native listener,
 * so a disabled button never fires it. `cursor-default!` needs the important
 * flag to beat the unlayered global `button { cursor: pointer }` in main.css.
 *
 * Pass `icon` for a registry glyph (sized to the button); use the default slot
 * only for custom artwork the registry doesn't have. `href` renders an external
 * link with the same look.
 *
 * @example <AppBtnIcon icon="x-mark" :label="t('common.close')" @click="close" />
 * @example <AppBtnIcon icon="chevron-left" variant="filled" size="l" :label="t('common.previous_page')" />
 */
withDefaults(
  defineProps<{
    /** Accessible name (required): an icon-only button has no text. Same
     *  prop name as AppIcon `label`. */
    label: string
    icon?: IconName
    iconVariant?: keyof IconEntry
    variant?: BtnIconVariant
    size?: BtnIconSize
    disabled?: boolean
    href?: string
  }>(),
  {
    iconVariant: 'stroke',
    variant: 'naked',
    size: 'm',
  },
)
</script>
