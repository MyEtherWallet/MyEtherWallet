<script setup lang="ts">
/**
 * Shared multi-select card used across the watchlist onboarding steps (markets,
 * industries, recommended assets). Owns the selection + hover styling (1px
 * border: black when selected, grey-outline on hover); consumers pass their own
 * layout classes (they fall through onto the button) and content via the slot.
 * `bg` sets the background; selection only swaps the border, never the fill.
 */
withDefaults(defineProps<{ selected: boolean; bg?: string }>(), {
  bg: 'bg-[#f5f5f5]',
})
defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    type="button"
    :aria-pressed="selected"
    class="rounded-2xl border text-left transition-colors"
    :class="
      selected
        ? `!border-black ${bg}`
        : `border-transparent ${bg} hover:border-grey-outline`
    "
    @click="$emit('toggle')"
  >
    <slot />
  </button>
</template>
