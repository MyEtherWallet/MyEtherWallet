<template>
  <component
    :is="as"
    class="flex items-center gap-3 rounded-16 bg-background-default px-4 py-3 min-h-14"
    :class="{
      'w-full text-left cursor-pointer transition-colors hover:bg-background-default-hover':
        as !== 'div',
      'max-xs:gap-2 max-xs:px-3': compact,
    }"
  >
    <slot name="avatar" />
    <span class="flex min-w-0 grow flex-col">
      <span
        data-testid="cell-title"
        class="text-base font-semibold text-text-default"
        :class="{ truncate, 'max-xs:text-sm': compact }"
      >
        {{ title }}
      </span>
      <span
        v-if="description"
        data-testid="cell-description"
        class="text-sm text-text-subtle"
        :class="{ truncate, 'max-xs:text-xs max-[400px]:sr-only': compact }"
      >
        {{ description }}
      </span>
    </span>
    <!-- `contents` keeps the slot's own flex layout; it only gives compact a
         hook to hide it. -->
    <span class="contents" :class="{ 'max-xs:hidden': compact }">
      <slot name="trailing" />
    </span>
  </component>
</template>

<script setup lang="ts">
/**
 * Local stand-in for the design-library Cell (Alternative / S) until #5766
 * lands; swap the call sites to AppCell then.
 */

withDefaults(
  defineProps<{
    title: string
    description?: string
    as?: 'div' | 'button' | 'a'
    /** Single-line title/description with ellipsis (e.g. long file names). */
    truncate?: boolean
    /**
     * Below xs (576px): smaller title and description, tighter padding and no
     * trailing slot, so two cells fit side by side. Below 400px the
     * description only stays for screen readers.
     */
    compact?: boolean
  }>(),
  { description: undefined, as: 'div', truncate: false, compact: false },
)
</script>
