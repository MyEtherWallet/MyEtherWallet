<template>
  <div
    class="flex min-h-80 flex-col items-center gap-6 text-center"
    :class="{ 'pt-14': !underModalTitle }"
  >
    <div class="flex w-full grow flex-col items-center justify-center gap-4">
      <slot name="icon" />
      <div class="flex flex-col gap-2">
        <!-- Announced when the screen changes: the modal has no title here. -->
        <h2
          class="text-heading-base text-text-default"
          aria-live="polite"
          :data-private="privateTitle ? '' : undefined"
        >
          {{ title }}
        </h2>
        <slot name="description">
          <p v-if="description" class="text-text-sm text-text-subtle">
            {{ description }}
          </p>
        </slot>
      </div>
      <slot />
    </div>
    <PrivyProtectedBy />
  </div>
</template>

<script setup lang="ts">
// Layout shared by the status screens of the login flow (Figma Onboarding
// 374:3261, 374:3810, 370:2951, 749:9560): a centred icon, title and line of
// text, optional actions, and the Privy footer pinned to the bottom. The
// minimum height keeps the modal from jumping between screens.
import PrivyProtectedBy from './PrivyProtectedBy.vue'

defineProps<{
  title: string
  description?: string
  /**
   * The modal shows its own title above this screen. Without one the modal
   * has no header row, so the screen leaves room for the back / close buttons.
   */
  underModalTitle?: boolean
  /** The title names the user (an email): keep it out of session replay. */
  privateTitle?: boolean
}>()
</script>
