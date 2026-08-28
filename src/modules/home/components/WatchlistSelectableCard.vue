<script setup lang="ts">
/**
 * Shared multi-select card used across the watchlist onboarding steps (markets,
 * industries). Owns the selection + hover styling; consumers pass their own
 * layout classes (they fall through onto the button) and content via the slot.
 */
defineProps<{ selected: boolean }>()
defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    type="button"
    :aria-pressed="selected"
    class="rounded-2xl border text-left transition-colors"
    :class="
      selected
        ? 'border-black bg-white'
        : 'border-transparent bg-[#f5f5f5] hover:border-grey-outline'
    "
    @click="$emit('toggle')"
  >
    <slot />
  </button>
</template>
