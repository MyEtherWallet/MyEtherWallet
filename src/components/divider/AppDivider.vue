<script setup lang="ts">
/**
 * Divider (Figma: MEW Web App — Design Library › Divider, node 3533:107915).
 * An 8px slot with a 1px rule centred in it; attrs (margins, v-if, aria-hidden)
 * land on the slot.
 *
 * @example
 * <AppDivider variant="alternative" />
 */
import { DIVIDER_CLASS, type DividerVariant } from './types'

withDefaults(defineProps<{ variant?: DividerVariant }>(), {
  variant: 'default',
})
</script>

<template>
  <div class="flex h-2 w-full items-center" data-testid="divider">
    <hr class="m-0 w-full border-0 border-t" :class="DIVIDER_CLASS[variant]" />
  </div>
</template>
