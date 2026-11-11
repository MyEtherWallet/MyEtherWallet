<script setup lang="ts">
/**
 * Spinner (Figma: MEW Web App — Design Library › Spinner, node 474:1124).
 * A 20% track with a quarter arc; the four Figma frames are its rotation.
 *
 * @example
 * <AppSpinner :size="20" color="inverted" />
 */
import { useI18n } from 'vue-i18n'
import { SPINNER_COLOR_CLASS, type AppSpinnerProps } from './types'

withDefaults(defineProps<AppSpinnerProps>(), {
  size: 32,
  color: 'default',
  label: undefined,
})

const { t } = useI18n()
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    fill="none"
    role="status"
    :aria-label="label ?? t('common.loading')"
    class="spinner inline-block shrink-0 animate-spin"
    :class="SPINNER_COLOR_CLASS[color]"
    data-testid="spinner"
  >
    <circle
      cx="16"
      cy="16"
      r="13.5"
      stroke="currentColor"
      stroke-opacity="0.2"
      stroke-width="5"
    />
    <path
      d="M16 2.5A13.5 13.5 0 0 1 29.5 16"
      stroke="currentColor"
      stroke-width="5"
      data-testid="spinner-arc"
    />
  </svg>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation-duration: 3s;
  }
}
</style>
