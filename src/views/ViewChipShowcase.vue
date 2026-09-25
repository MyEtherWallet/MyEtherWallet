<script setup lang="ts">
// Gallery for the Chip design-library component (MEW-2273), reachable at
// /dev/chip via the design-library shell — see routesDefault.ts. Lets us eyeball
// the Variant × state matrix, avatar and trailing-icon on/off, and the
// single-select chip group against Figma (node 3280-20635). Hover, pressed and
// focus are native — hover a chip, press it, or Tab to it to see those states.
import { ref } from 'vue'
import AppChip from '@/components/chip/AppChip.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import type { ChipSurface } from '@/components/chip/types'

// Each surface fills the opposite of the page it sits on, so preview each on
// the surface it is designed for or the fill is invisible (white on white).
const VARIANTS: { surface: ChipSurface; label: string; page: string }[] = [
  {
    surface: 'default',
    label: 'Variant: base — fills white, sits on a default (grey) surface',
    page: 'bg-background-default',
  },
  {
    surface: 'alternative',
    label: 'Variant: surface — fills grey, sits on a white surface',
    page: 'bg-white',
  },
]

// Single-select chip group (e.g. the Trade % presets).
const PRESETS = ['10%', '25%', '50%', 'Max']
const activePreset = ref('25%')
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Chip</h1>
      <p class="text-s-14 text-text-subtle">
        Compact selectable pill for quick filters and presets. Hover a chip,
        press it, or Tab to it to see the hover, pressed and focus states.
      </p>
    </header>

    <section v-for="v in VARIANTS" :key="v.surface" class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">{{ v.label }}</h2>
      <div
        class="flex flex-wrap items-start gap-4 rounded-12 border border-border-default p-6"
        :class="v.page"
      >
        <AppChip :surface="v.surface" label="Ethereum">
          <template #avatar="{ size }">
            <AppAvatar type="initial" :size="size" initial="E" />
          </template>
        </AppChip>

        <AppChip :surface="v.surface" label="All networks" show-icon>
          <template #avatar="{ size }">
            <AppAvatar type="initial" :size="size" initial="E" />
          </template>
        </AppChip>

        <AppChip :surface="v.surface" label="Opened recently" />

        <AppChip :surface="v.surface" label="Filter" show-icon />

        <AppChip :surface="v.surface" label="Selected" selected>
          <template #avatar="{ size }">
            <AppAvatar type="initial" :size="size" initial="E" />
          </template>
        </AppChip>

        <AppChip :surface="v.surface" label="Disabled" disabled>
          <template #avatar="{ size }">
            <AppAvatar type="initial" :size="size" initial="E" />
          </template>
        </AppChip>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">
        Chip group — single select ({{ activePreset }})
      </h2>
      <div
        class="flex flex-wrap gap-2 rounded-12 border border-border-default bg-white p-6"
      >
        <AppChip
          v-for="preset in PRESETS"
          :key="preset"
          surface="alternative"
          :label="preset"
          :selected="activePreset === preset"
          @click="activePreset = preset"
        />
      </div>
    </section>
  </div>
</template>
