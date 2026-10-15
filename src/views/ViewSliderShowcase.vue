<script setup lang="ts">
// Preview for the Slider design-library component (MEW-2405) at /dev/slider.
// Matches Figma node 4059:4392; Tab to a slider to see the focus ring.
import { ref } from 'vue'
import AppSlider from '@/components/slider/AppSlider.vue'

const FIGMA_STOPS = [0, 25, 50, 75, 100]
const stops = ref([...FIGMA_STOPS])
const continuous = ref(40)
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Slider</h1>
      <p class="text-text-sm text-text-subtle">
        Draggable control that lets users select a numeric value along a track.
        Tab to a slider to see the focus state.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Figma stops (step 25)</h2>
      <div class="flex flex-col gap-5 rounded-12 bg-background-default p-6">
        <div
          v-for="(stop, index) in FIGMA_STOPS"
          :key="stop"
          class="flex items-center gap-6"
        >
          <span class="w-8 text-text-sm text-text-subtle">{{ stop }}</span>
          <div class="w-64">
            <AppSlider
              v-model="stops[index]"
              :step="25"
              :label="`Slider starting at ${stop}`"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Continuous (step 1) — {{ continuous }}</h2>
      <div class="rounded-12 bg-background-default p-6">
        <AppSlider
          v-model="continuous"
          label="Continuous slider"
          :aria-value-text="(value: number) => `${value}%`"
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Disabled</h2>
      <div class="flex flex-col gap-5 rounded-12 bg-background-default p-6">
        <AppSlider :model-value="0" disabled label="Disabled at 0" />
        <AppSlider :model-value="50" disabled label="Disabled at 50" />
        <AppSlider :model-value="100" disabled label="Disabled at 100" />
      </div>
    </section>
  </div>
</template>
