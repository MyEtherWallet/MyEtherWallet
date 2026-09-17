<script setup lang="ts">
import { ref } from 'vue'
import AppToggle from '@/components/AppToggle.vue'

const interactiveValue = ref(false)

const variants = [
  { label: 'Off', value: false, forcedHover: false },
  { label: 'Off — hover', value: false, forcedHover: true },
  { label: 'On', value: true, forcedHover: false },
  { label: 'On — hover', value: true, forcedHover: true },
]
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-10 p-8">
    <div>
      <h1 class="text-s-24 font-bold text-t-default">Toggle</h1>
      <p class="mt-2 text-s-14 text-info">
        43 × 24 switch states from the design library.
      </p>
    </div>

    <section>
      <h2 class="mb-4 text-s-16 font-semibold">Variants</h2>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          v-for="variant in variants"
          :key="variant.label"
          class="flex flex-col items-center gap-3 rounded-12 border border-grey-10 bg-white p-4"
        >
          <app-toggle
            :model-value="variant.value"
            :class="{ 'is-forced-hover': variant.forcedHover }"
            :aria-label="variant.label"
          />
          <span class="text-s-12 text-info">{{ variant.label }}</span>
        </div>
      </div>
    </section>

    <section class="rounded-12 border border-grey-10 bg-white p-5">
      <h2 class="text-s-16 font-semibold">Interactive</h2>
      <div class="mt-4 flex items-center gap-3">
        <app-toggle v-model="interactiveValue" aria-label="Interactive toggle" />
        <output class="text-s-14 text-info">{{ interactiveValue ? 'On' : 'Off' }}</output>
      </div>
    </section>
  </div>
</template>
