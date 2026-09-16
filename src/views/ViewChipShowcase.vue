<script setup lang="ts">
// Gallery for the Chip design-library component (MEW-2273), reachable at
// /dev/chip via the design-library shell — see routesDefault.ts. Lets us eyeball
// the Variant × state matrix, avatar and trailing-icon on/off, and the
// single-select chip group against Figma (node 3280-20635). Hover, pressed and
// focus are native — hover a chip, press it, or Tab to it to see those states.
import { ref } from 'vue'
import AppChip from '@/components/chip/AppChip.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import type { ChipVariant } from '@/components/chip/types'

// Each variant fills the opposite of the surface it sits on, so preview each on
// the surface it is designed for or the fill is invisible (white on white).
const VARIANTS: { variant: ChipVariant; label: string; surface: string }[] = [
  {
    variant: 'base',
    label: 'Variant: base — fills white, sits on a default (grey) surface',
    surface: 'bg-app-background',
  },
  {
    variant: 'surface',
    label: 'Variant: surface — fills grey, sits on a white surface',
    surface: 'bg-white',
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
      <p class="text-s-14 text-info">
        Compact selectable pill for quick filters and presets. Hover a chip,
        press it, or Tab to it to see the hover, pressed and focus states.
      </p>
    </header>

    <section
      v-for="v in VARIANTS"
      :key="v.variant"
      class="flex flex-col gap-4"
    >
      <h2 class="text-s-16 font-semibold">{{ v.label }}</h2>
      <div
        class="flex flex-wrap items-start gap-4 rounded-12 border border-grey-10 p-6"
        :class="v.surface"
      >
        <AppChip :variant="v.variant" label="Ethereum">
          <template #avatar="{ size }">
            <AppAvatar type="initial" :size="size" initial="E" />
          </template>
        </AppChip>

        <AppChip :variant="v.variant" label="All networks" show-icon>
          <template #avatar="{ size }">
            <AppAvatar type="initial" :size="size" initial="E" />
          </template>
        </AppChip>

        <AppChip :variant="v.variant" label="Opened recently" />

        <AppChip :variant="v.variant" label="Filter" show-icon />

        <AppChip :variant="v.variant" label="Selected" selected>
          <template #avatar="{ size }">
            <AppAvatar type="initial" :size="size" initial="E" />
          </template>
        </AppChip>

        <AppChip :variant="v.variant" label="Disabled" disabled>
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
        class="flex flex-wrap gap-2 rounded-12 border border-grey-10 bg-white p-6"
      >
        <AppChip
          v-for="preset in PRESETS"
          :key="preset"
          variant="surface"
          :label="preset"
          :selected="activePreset === preset"
          @click="activePreset = preset"
        />
      </div>
    </section>
  </div>
</template>
