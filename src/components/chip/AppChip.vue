<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { CHIP_SURFACE_BG_CLASS, type ChipSurface } from './types'
import type { AvatarSize } from '@/components/avatar/types'

/**
 * Chip (design library, node 3280-20635). A compact selectable pill for quick
 * filters and presets — network selection, Trade % presets, recent search items.
 * It renders as a <button>, so hover, pressed and focus are native pseudo-states
 * (never props); only the toggle state (`selected`) and `disabled` are props. An
 * optional leading Avatar goes in the `avatar` slot (sized by the chip at 24px)
 * and an optional trailing chevron (`showIcon`) marks a chip that opens a menu —
 * that chip is announced as a menu button (aria-haspopup) instead of a toggle.
 */
const props = withDefaults(
  defineProps<{
    label: string
    surface?: ChipSurface
    selected?: boolean
    /** Not in Figma; kept so the API is stable across contexts. */
    disabled?: boolean
    /** Trailing chevron, for chips that open a menu. */
    showIcon?: boolean
  }>(),
  {
    surface: 'default',
    selected: false,
    disabled: false,
    showIcon: false,
  },
)

const emit = defineEmits<{ click: [MouseEvent] }>()

// Figma nests a 24px Avatar (size s). Typed so the `avatar` slot hands consumers
// a real AvatarSize instead of a bare string.
const avatarSize: AvatarSize = 's'

// A permanent transparent border keeps the box stable, so `selected`
// (border/selected, black) and focus (border/brand) only recolour it. Focus wins
// over selected while focused via the more specific :focus-visible rule.
const borderClass = computed(() =>
  props.selected ? 'border-black' : 'border-transparent',
)
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :aria-pressed="showIcon ? undefined : selected"
    :aria-haspopup="showIcon ? 'menu' : undefined"
    data-testid="chip"
    class="inline-flex h-8 items-center rounded-full border px-1 text-s-14 font-medium text-t-default transition-colors duration-150 hover:bg-bgBase-hover active:bg-bgBase-pressed focus-visible:border-primary focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
    :class="[CHIP_SURFACE_BG_CLASS[surface], borderClass]"
    @click="emit('click', $event)"
  >
    <span v-if="$slots.avatar" class="shrink-0" data-testid="chip-avatar">
      <slot name="avatar" :size="avatarSize" />
    </span>

    <span class="px-2" data-testid="chip-label">{{ label }}</span>

    <span
      v-if="showIcon"
      class="flex size-4.5 shrink-0 items-center justify-center"
      data-testid="chip-icon"
    >
      <ChevronDownIcon class="size-full" />
    </span>
  </button>
</template>
