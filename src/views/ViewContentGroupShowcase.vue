<script setup lang="ts">
// DEV-only gallery for the Content Group design-library component (MEW-2271).
// Never registered in production builds — see routesDefault.ts. Lets us eyeball
// the Size × Align × Inverted matrix, the icon slots and the loading state
// against Figma.
import { WalletIcon, CheckBadgeIcon } from '@heroicons/vue/24/solid'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import type {
  ContentGroupAlign,
  ContentGroupSize,
} from '@/components/content_group/types'

const SIZES: ContentGroupSize[] = ['m', 'l']
const ALIGNS: ContentGroupAlign[] = ['left', 'right']

const combos = SIZES.flatMap(size =>
  ALIGNS.flatMap(align =>
    [false, true].map(inverted => ({
      size,
      align,
      inverted,
      label: `size=${size} · align=${align} · inverted=${inverted}`,
    })),
  ),
)
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-3xl mx-auto">
    <h1 class="text-s-24 font-bold">Content Group — design library (MEW-2271)</h1>

    <!-- Size × Align × Inverted matrix -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Size × Align × Inverted</h2>
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="c in combos"
          :key="c.label"
          class="border border-grey-10 rounded-12 p-4 bg-white"
        >
          <p class="text-s-11 text-info mb-2">{{ c.label }}</p>
          <AppContentGroup
            title="Ethereum"
            description="The world computer, secured by proof of stake."
            :size="c.size"
            :align="c.align"
            :inverted="c.inverted"
          />
        </div>
      </div>
    </section>

    <!-- Icon slots populated -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Icon slots (18px, both lines)</h2>
      <div class="flex gap-8">
        <div class="border border-grey-10 rounded-12 p-4 bg-white">
          <AppContentGroup title="My Wallet" description="Verified account">
            <template #title-icon><WalletIcon /></template>
            <template #description-icon><CheckBadgeIcon /></template>
          </AppContentGroup>
        </div>
        <div class="border border-grey-10 rounded-12 p-4 bg-white">
          <AppContentGroup size="l" title="My Wallet" description="Verified">
            <template #title-icon><WalletIcon /></template>
          </AppContentGroup>
        </div>
      </div>
    </section>

    <!-- Overflow: default single-line title + wrapping description, and noWrap -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Overflow (constrained to 180px)</h2>
      <div class="flex gap-8">
        <div class="w-[180px] border border-grey-10 rounded-12 p-4 bg-white">
          <AppContentGroup
            title="A very long title that should ellipsis"
            description="A long description that is allowed to wrap onto multiple lines by default."
          />
        </div>
        <div class="w-[180px] border border-grey-10 rounded-12 p-4 bg-white">
          <AppContentGroup
            title="A very long title that should ellipsis"
            description="A long single-line description with ellipsis"
            no-wrap
          />
        </div>
      </div>
    </section>

    <!-- Loading state -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Loading (Skeleton)</h2>
      <div class="flex gap-8">
        <div class="border border-grey-10 rounded-12 p-4 bg-white">
          <AppContentGroup title="Title" description="Description" loading />
        </div>
        <div class="border border-grey-10 rounded-12 p-4 bg-white">
          <AppContentGroup title="Title only" loading />
        </div>
      </div>
    </section>
  </div>
</template>
