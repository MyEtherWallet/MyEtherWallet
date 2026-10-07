<script setup lang="ts">
// Gallery for the ActionBar design-library components (MEW-2398), reachable at
// /dev/action-bar via the design-library shell — see routesDefault.ts. Compare
// against Figma ActionBar (776:259) and ActionBarButton (776:214). Hover is
// native; the static row forces the Hover look with the same background class.
import { computed, ref } from 'vue'
import AppActionBar from '@/components/action_bar/AppActionBar.vue'
import AppActionBarButton from '@/components/action_bar/AppActionBarButton.vue'
import type { ActionBarItem } from '@/components/action_bar/types'

const ITEMS: ActionBarItem[] = [
  { id: 'trade', icon: 'chart-bar', label: 'Trade' },
  { id: 'swap', icon: 'arrow-path-rounded-square', label: 'Swap' },
  { id: 'perps', icon: 'perpetuals', label: 'Perps' },
  { id: 'bridge', icon: 'arrow-uturn-right', label: 'Bridge' },
  { id: 'deposit', icon: 'arrow-down-tray', label: 'Deposit' },
  { id: 'send', icon: 'paper-airplane', label: 'Send' },
  { id: 'purchase', icon: 'currency-dollar', label: 'Buy/Sell' },
]

const activeId = ref<string | null>('swap')
const expanded = ref(false)
const disablePerps = ref(false)

const items = computed(() =>
  ITEMS.map(item =>
    item.id === 'perps' ? { ...item, disabled: disablePerps.value } : item,
  ),
)

// Clicking an item toggles its drawer, like the app rail.
const onSelect = (id: string) => {
  activeId.value = activeId.value === id ? null : id
}
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Action Bar</h1>
      <p class="text-s-14 text-text-subtle">
        Fixed right-side navigation area that provides quick access to
        contextual tools and secondary actions via a set of icon buttons that
        open expandable drawers. Hover a button, or Tab to it to see focus.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">ActionBar</h2>
      <div class="flex flex-wrap gap-4 text-s-14">
        <label class="flex items-center gap-2">
          Active
          <select
            v-model="activeId"
            class="rounded-8 border border-border-default px-2 py-1"
          >
            <option :value="null">none</option>
            <option v-for="item in ITEMS" :key="item.id" :value="item.id">
              {{ item.label }}
            </option>
          </select>
        </label>
        <label class="flex items-center gap-2">
          <input v-model="expanded" type="checkbox" />
          Expanded
        </label>
        <label class="flex items-center gap-2">
          <input v-model="disablePerps" type="checkbox" />
          Disable Perps
        </label>
      </div>
      <div
        class="flex h-160 justify-end overflow-hidden rounded-12 border border-border-default bg-background-default"
      >
        <AppActionBar
          class="h-full"
          :items="items"
          :active-id="activeId"
          :expanded="expanded"
          @select="onSelect"
          @toggle="expanded = !expanded"
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">
        ActionBarButton — Default · Hover · Active · Disabled
      </h2>
      <div
        class="flex gap-4 rounded-12 border border-border-default bg-white p-6"
      >
        <AppActionBarButton icon="chart-bar" label="Trade" />
        <AppActionBarButton
          icon="chart-bar"
          label="Trade"
          class="bg-background-default"
        />
        <AppActionBarButton icon="chart-bar" label="Trade" active />
        <AppActionBarButton icon="chart-bar" label="Trade" disabled />
      </div>
    </section>
  </div>
</template>
