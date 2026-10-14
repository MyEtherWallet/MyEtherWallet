<script setup lang="ts">
/**
 * Transaction input card (Figma: MEW — Side panel actions › Building blocks ›
 * Transaction input card). The base of every side-panel action: an amount
 * input on the left, a picker + caption (balance / price) on the right, and an
 * optional row of quick actions (% presets) underneath.
 *
 * Presentational only — consumers own the input, the picker and the state.
 * The optional `header` sits above the input row (network picker, title).
 */
defineProps<{
  /** Under the picker, e.g. "Balance: 2,458.23 USDT". */
  caption?: string
}>()
</script>

<template>
  <div
    class="flex w-full flex-col gap-6 rounded-16 bg-background-default p-4"
    data-testid="transaction-input-card"
  >
    <div class="flex w-full flex-col gap-3">
      <slot name="header" />
      <div class="flex w-full items-center justify-between gap-2">
        <div class="min-w-0 flex-1">
          <slot />
        </div>
        <div
          class="flex shrink-0 flex-col items-end justify-center gap-2 self-stretch"
        >
          <slot name="picker" />
          <p
            v-if="caption"
            class="text-text-sm whitespace-nowrap text-text-subtle"
            data-testid="transaction-input-card-caption"
          >
            {{ caption }}
          </p>
        </div>
      </div>
      <slot name="feedback" />
    </div>
    <div
      v-if="$slots.actions"
      class="flex w-full items-center justify-end gap-2"
      data-testid="transaction-input-card-actions"
    >
      <slot name="actions" />
    </div>
  </div>
</template>
