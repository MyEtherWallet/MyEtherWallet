<script setup lang="ts">
// Preview for the Searchbar design-library component (MEW-1971) at
// /dev/searchbar. Figma node 82:14709: Default is the grey fill on a white
// surface; Outline is the white field inside a grey pill wrapper (toolbars).
import { reactive } from 'vue'
import AppSearchbar from '@components/AppSearchbar.vue'

const SIZES = ['default', 'compact'] as const
const models = reactive<Record<string, string>>({})
</script>

<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Searchbar</h1>
      <p class="text-text-sm text-text-subtle">
        Search field with a search icon and a clear button once filled.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Style: Default — white surface</h2>
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <div v-for="size in SIZES" :key="size">
          <p class="text-text-xs text-text-muted mb-1">size = {{ size }}</p>
          <AppSearchbar v-model="models[`default-${size}`]" :size="size" />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Style: Outline — inside a grey pill</h2>
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <div v-for="size in SIZES" :key="size">
          <p class="text-text-xs text-text-muted mb-1">size = {{ size }}</p>
          <div class="bg-background-default-hover rounded-full p-1">
            <AppSearchbar
              v-model="models[`outline-${size}`]"
              :size="size"
              bg-class="bg-background-alternative"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
