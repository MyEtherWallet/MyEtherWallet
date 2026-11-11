<script setup lang="ts">
// Preview for the Divider design-library component (MEW-2422) at /dev/divider.
// Matches Figma node 3533:107915; each style on the surface it is meant for.
import AppDivider from '@/components/divider/AppDivider.vue'
import type { DividerVariant } from '@/components/divider/types'

const VARIANTS: { variant: DividerVariant; label: string; page: string }[] = [
  {
    variant: 'default',
    label: 'Style: Default — white surface',
    page: 'bg-background-alternative',
  },
  {
    variant: 'alternative',
    label: 'Style: Alternative — grey surface',
    page: 'bg-background-default',
  },
]
const ROWS = ['First row', 'Second row', 'Third row']
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Divider</h1>
      <p class="text-text-sm text-text-subtle">
        Thin line used to visually separate content within a list or section.
      </p>
    </header>

    <section v-for="v in VARIANTS" :key="v.variant" class="flex flex-col gap-4">
      <h2 class="text-label-base">{{ v.label }}</h2>
      <div class="rounded-12 border border-border-default p-6" :class="v.page">
        <div class="w-72">
          <AppDivider :variant="v.variant" />
        </div>
        <ul class="mt-6">
          <template v-for="(row, index) in ROWS" :key="row">
            <li class="py-3 text-text-sm">{{ row }}</li>
            <AppDivider
              v-if="index < ROWS.length - 1"
              :variant="v.variant"
              aria-hidden="true"
            />
          </template>
        </ul>
      </div>
    </section>
  </div>
</template>
