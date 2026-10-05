<script setup lang="ts">
// Preview for the TabItem design-library component (MEW-2406) at /dev/tab-item.
// Matches Figma node 1072:611; hover an unselected tab or Tab to one for focus.
import { ref } from 'vue'
import AppTabItem from '@/components/tabs/AppTabItem.vue'

const TABS = ['Stocks', 'Crypto', 'Perps']
const activeTab = ref('Stocks')
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Tab Item</h1>
      <p class="text-text-sm text-text-subtle">
        Single selectable tab within a TabBar. Hover an unselected tab to see
        the hover state, or Tab to one to see the focus state.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Status</h2>
      <div
        class="flex items-start gap-8 rounded-12 bg-background-default p-6"
        role="tablist"
        aria-label="Status examples"
      >
        <AppTabItem label="Stocks" selected />
        <AppTabItem label="Stocks" />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Live — {{ activeTab }}</h2>
      <div
        class="flex items-start gap-4 rounded-12 bg-background-default p-6"
        role="tablist"
        aria-label="Live example"
      >
        <AppTabItem
          v-for="tab in TABS"
          :key="tab"
          :label="tab"
          :selected="activeTab === tab"
          @click="activeTab = tab"
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Disabled</h2>
      <div
        class="flex items-start gap-4 rounded-12 bg-background-default p-6"
        role="tablist"
        aria-label="Disabled example"
      >
        <AppTabItem label="Stocks" selected />
        <AppTabItem label="Crypto" disabled />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Long label in a narrow tab (wraps)</h2>
      <div
        class="flex items-start rounded-12 bg-background-default p-6"
        role="tablist"
        aria-label="Long label example"
      >
        <AppTabItem class="w-32" label="Tokenized stocks and ETFs" selected />
      </div>
    </section>
  </div>
</template>
