<script setup lang="ts">
// Gallery for the Picker design-library component (MEW-2231), reachable at
// /dev/picker via the design-library shell — see routesDefault.ts. Lets us
// eyeball the Style × Size matrix, avatar on/off, the L-only description and the
// disabled state against Figma. Hover and focus are native — hover a row or Tab
// to it to see those states.
import AppPicker from '@/components/picker/AppPicker.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import type { PickerSize, PickerStyle } from '@/components/picker/types'

const SIZES: PickerSize[] = ['l', 'm', 's']

// Each style fills the opposite of the surface it sits on, so preview each on the
// surface it's designed for or the fill would be invisible (white on white).
const STYLES: { variant: PickerStyle; label: string; surface: string }[] = [
  {
    variant: 'default',
    label: 'Style: default — fills white, sits on a default (grey) surface',
    surface: 'bg-app-background',
  },
  {
    variant: 'alternative',
    label: 'Style: alternative — fills grey, sits on a white surface',
    surface: 'bg-white',
  },
]
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Picker</h1>
      <p class="text-s-14 text-info">
        Trigger that opens a modal to pick something (use Dropdown when the choice
        is inline). Hover a row or Tab to it to see the hover and focus states.
      </p>
    </header>

    <section v-for="s in STYLES" :key="s.variant" class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">{{ s.label }}</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          v-for="size in SIZES"
          :key="size"
          class="flex flex-col items-start gap-3 rounded-12 border border-grey-10 p-4"
          :class="s.surface"
        >
          <p class="text-s-11 uppercase tracking-sp-06 text-info">
            size {{ size }}
          </p>

          <AppPicker
            class="max-w-full"
            :size="size"
            :variant="s.variant"
            title="Ethereum"
            :description="size === 'l' ? 'Secured by proof of stake' : undefined"
          >
            <template #avatar="{ size: avatarSize }">
              <AppAvatar type="initial" :size="avatarSize" initial="E" />
            </template>
          </AppPicker>

          <AppPicker
            class="max-w-full"
            :size="size"
            :variant="s.variant"
            :avatar="false"
            title="No avatar"
          />

          <AppPicker
            class="max-w-full"
            :size="size"
            :variant="s.variant"
            disabled
            title="Disabled"
          >
            <template #avatar="{ size: avatarSize }">
              <AppAvatar type="initial" :size="avatarSize" initial="E" />
            </template>
          </AppPicker>
        </div>
      </div>
    </section>
  </div>
</template>
