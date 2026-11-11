<script setup lang="ts">
// Preview for the TabBar design-library component (MEW-2407) at /dev/tab-bar.
// Matches Figma node 2175:7168; Tab into a bar and use the arrow keys.
import { ref } from 'vue'
import AppTabBar from '@/components/tabs/AppTabBar.vue'
import type { TabBarItem, TabBarSurface } from '@/components/tabs/types'

type AssetTab = 'stocks' | 'crypto' | 'perps'

const ITEMS: TabBarItem<AssetTab>[] = [
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'perps', label: 'Perps' },
]

const VARIANTS: { surface: TabBarSurface; label: string; page: string }[] = [
  {
    surface: 'alternative',
    label: 'Variant: on alternative — white surface',
    page: 'bg-background-alternative',
  },
  {
    surface: 'default',
    label: 'Variant: on default — grey surface',
    page: 'bg-background-default',
  },
]

const activeBySurface = ref<Record<TabBarSurface, AssetTab>>({
  alternative: 'stocks',
  default: 'stocks',
})
const withDisabled = ref<AssetTab>('stocks')
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Tab Bar</h1>
      <p class="text-text-sm text-text-subtle">
        Horizontal set of TabItems that lets users switch between related
        sections of content. Tab into a bar and use ←/→, Home/End, then
        Enter/Space to select.
      </p>
    </header>

    <section v-for="v in VARIANTS" :key="v.surface" class="flex flex-col gap-4">
      <h2 class="text-label-base">
        {{ v.label }} ({{ activeBySurface[v.surface] }})
      </h2>
      <div class="rounded-12 border border-border-default p-6" :class="v.page">
        <AppTabBar
          v-model="activeBySurface[v.surface]"
          :items="ITEMS"
          :surface="v.surface"
          :label="v.label"
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">With a disabled item ({{ withDisabled }})</h2>
      <div
        class="rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <AppTabBar
          v-model="withDisabled"
          :items="[
            { id: 'stocks', label: 'Stocks' },
            { id: 'crypto', label: 'Crypto', disabled: true },
            { id: 'perps', label: 'Perps' },
          ]"
          label="Disabled example"
        />
      </div>
    </section>
  </div>
</template>
