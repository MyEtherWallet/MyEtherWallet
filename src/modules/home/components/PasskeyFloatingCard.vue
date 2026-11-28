<template>
  <!-- Sits clear of the wallet action bar on the right (60px wide, 80px from
       sm up) and under the side panels and dialogs. -->
  <div
    class="fixed bottom-6 right-[76px] z-[48] flex w-[392px] max-w-[calc(100vw-92px)] flex-col gap-4 rounded-20 bg-background-contrast-default p-5 text-text-inverted shadow-[0px_12px_32px_-8px_rgba(0,0,0,0.40)] sm:right-[104px] sm:max-w-[calc(100vw-120px)]"
  >
    <div class="relative flex min-h-8 items-center justify-center px-10">
      <p class="text-center text-label-base">{{ title }}</p>
      <button
        type="button"
        :aria-label="$t('common.dismiss')"
        class="absolute right-0 flex size-8 items-center justify-center rounded-full bg-background-contrast-hover transition-colors hover:bg-background-contrast-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand"
        @click="emit('close')"
      >
        <AppIcon name="x-mark" size="xs" />
      </button>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import AppIcon from '@/components/icon/AppIcon.vue'

/**
 * The dark card that floats at the bottom right for the passkey prompt and
 * its confirmation (Figma: Account settings for Privy Account).
 */
defineProps<{ title: string }>()

const emit = defineEmits<{
  close: []
}>()
</script>
