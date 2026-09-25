<script setup lang="ts">
import { computed } from 'vue'
import {
  icons,
  ICON_SIZE_CLASS,
  type IconEntry,
  type IconName,
  type IconSize,
} from './icons'

/**
 * Icon (design library, Figma component `Icon` 4159:104520). Renders one glyph
 * from the registry at one of the seven wrapper sizes, in the stroke or filled
 * variant. Size is applied as a `size-*` class; color is inherited from the
 * parent via `currentColor`, so there is no color prop.
 *
 * Decorative by default — the svg is `aria-hidden`. Pass `label` to name it for
 * assistive tech: the glyph then sits inside a `role="img"` wrapper carrying the
 * `aria-label`, while the svg itself stays hidden. (Heroicons glyphs are compiled
 * render functions that only inherit a fallthrough `class`, not arbitrary attrs,
 * so the accessible name lives on the wrapper, not the svg.)
 *
 * A glyph may ship only one variant (most arrows are stroke-only, `perpetuals`
 * is filled-only) — when the requested variant is missing we fall back to the
 * one that exists.
 */
const props = withDefaults(
  defineProps<{
    name: IconName
    size?: IconSize
    variant?: 'stroke' | 'filled'
    /** Accessible name. Omit for decorative icons (svg stays aria-hidden). */
    label?: string
  }>(),
  {
    size: 'm',
    variant: 'stroke',
    label: undefined,
  },
)

// Widen the narrow per-name literal to IconEntry so both variants are indexable.
const entry = computed<IconEntry>(() => icons[props.name])
const component = computed(
  () => entry.value[props.variant] ?? entry.value.stroke ?? entry.value.filled,
)
const sizeClass = computed(() => ICON_SIZE_CLASS[props.size])
const isLabelled = computed(() => !!props.label)
</script>

<template>
  <span
    v-if="isLabelled"
    role="img"
    :aria-label="label"
    class="inline-flex shrink-0"
  >
    <component
      :is="component"
      :class="sizeClass"
      aria-hidden="true"
      focusable="false"
    />
  </span>
  <component
    :is="component"
    v-else
    :class="sizeClass"
    aria-hidden="true"
    focusable="false"
  />
</template>
