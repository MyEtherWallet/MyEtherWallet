<script setup lang="ts">
// Preview for the Spinner design-library component (MEW-2423) at /dev/spinner.
// The static row reproduces the four Figma frames (474:1124).
import AppSpinner from '@/components/spinner/AppSpinner.vue'

const FRAMES = ['rotate-0', 'rotate-90', 'rotate-180', 'rotate-270']
const SIZES = [16, 18, 20, 24, 32, 48]
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Spinner</h1>
      <p class="text-text-sm text-text-subtle">
        Animated indicator used to communicate that content is loading or an
        action is processing.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Figma frames (static)</h2>
      <div class="flex items-center gap-6 rounded-12 bg-background-default p-6">
        <div
          v-for="frame in FRAMES"
          :key="frame"
          class="flex [&_svg]:animate-none"
          :class="frame"
        >
          <AppSpinner />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Sizes</h2>
      <div class="flex items-end gap-6 rounded-12 bg-background-default p-6">
        <div
          v-for="size in SIZES"
          :key="size"
          class="flex flex-col items-center gap-2"
        >
          <AppSpinner :size="size" />
          <span class="text-text-xs text-text-subtle">{{ size }}</span>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Colors</h2>
      <div class="flex items-center gap-6">
        <div class="rounded-12 bg-background-default p-6">
          <AppSpinner />
        </div>
        <div class="rounded-12 bg-background-info p-6">
          <AppSpinner color="inverted" />
        </div>
        <div class="rounded-12 bg-background-default p-6">
          <AppSpinner color="placeholder" />
        </div>
      </div>
    </section>
  </div>
</template>
