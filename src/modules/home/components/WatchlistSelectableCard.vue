<script setup lang="ts">
/**
 * Shared multi-select card used across the watchlist onboarding steps (markets,
 * industries, recommended assets). Owns the selection + hover styling (1px
 * border: black when selected, grey-outline on hover); consumers pass their own
 * layout classes (they fall through onto the button) and content via the slot.
 * `bg` sets the background; selection only swaps the border, never the fill.
 * `disabled` greys the card out and blocks selection (used when a category hits
 * its limit); an already-selected card is never disabled so it can be toggled off.
 */
withDefaults(
  defineProps<{ selected: boolean; bg?: string; disabled?: boolean }>(),
  {
    bg: 'bg-[#f5f5f5]',
    disabled: false,
  },
)
defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    type="button"
    :aria-pressed="selected"
    :disabled="disabled"
    class="rounded-2xl border text-left transition-colors"
    :class="[
      bg,
      selected ? '!border-black' : 'border-transparent',
      disabled
        ? 'cursor-not-allowed opacity-40'
        : !selected && 'hover:border-grey-outline',
    ]"
    @click="$emit('toggle')"
  >
    <slot />
  </button>
</template>
