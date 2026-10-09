<script setup lang="ts">
// Gallery for the Content Group design-library component (MEW-2271), reachable
// at /dev/content-group via the design-library shell — see routesDefault.ts.
// Lets us eyeball the Size × Align × Inverted matrix, the trailing icon/avatar
// slots and the loading state per size against Figma (component set 1952:43).
import AppIcon from '@/components/icon/AppIcon.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import type {
  ContentGroupAlign,
  ContentGroupSize,
} from '@/components/content_group/types'

const SIZES: ContentGroupSize[] = ['m', 'l']
const ALIGNS: ContentGroupAlign[] = ['left', 'right']
const ADDRESS = '0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8'

const sizeAlign = SIZES.flatMap(size =>
  ALIGNS.map(align => ({
    size,
    align,
    label: `size=${size} · align=${align}`,
  })),
)

const combos = sizeAlign.flatMap(c =>
  [false, true].map(inverted => ({
    ...c,
    inverted,
    label: `${c.label} · inverted=${inverted}`,
  })),
)
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-3xl mx-auto">
    <h1 class="text-s-24 font-bold">Content Group</h1>

    <!-- Size × Align × Inverted matrix -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Size × Align × Inverted</h2>
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="c in combos"
          :key="c.label"
          class="border border-border-default rounded-12 p-4 bg-white"
        >
          <p class="text-s-11 text-text-subtle mb-2">{{ c.label }}</p>
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

    <!-- Trailing icon / avatar slots (always XS, 18px) -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">
        Icon / Avatar slots (trailing, XS 18px)
      </h2>
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="c in sizeAlign"
          :key="c.label"
          class="border border-border-default rounded-12 p-4 bg-white"
        >
          <p class="text-s-11 text-text-subtle mb-2">{{ c.label }}</p>
          <AppContentGroup
            title="Title"
            description="Information"
            :size="c.size"
            :align="c.align"
          >
            <template #title-icon="{ size }">
              <AppIcon name="star" :size="size" />
              <AppAvatar type="account" :size="size" :address="ADDRESS" />
            </template>
            <template #description-icon="{ size }">
              <AppIcon name="star" :size="size" />
              <AppAvatar type="account" :size="size" :address="ADDRESS" />
            </template>
          </AppContentGroup>
        </div>
      </div>
    </section>

    <!-- Overflow: default single-line title + wrapping description, and noWrap -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Overflow (constrained to 180px)</h2>
      <div class="flex gap-8">
        <div
          class="w-[180px] border border-border-default rounded-12 p-4 bg-white"
        >
          <AppContentGroup
            title="A very long title that should ellipsis"
            description="A long description that is allowed to wrap onto multiple lines by default."
          />
        </div>
        <div
          class="w-[180px] border border-border-default rounded-12 p-4 bg-white"
        >
          <AppContentGroup
            title="A very long title that should ellipsis"
            description="A long single-line description with ellipsis"
            no-wrap
          />
        </div>
      </div>
    </section>

    <!-- Loading state, per size and align -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Loading (Skeleton)</h2>
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="c in sizeAlign"
          :key="c.label"
          class="border border-border-default rounded-12 p-4 bg-white"
        >
          <p class="text-s-11 text-text-subtle mb-2">{{ c.label }}</p>
          <AppContentGroup
            title="Title"
            description="Description"
            :size="c.size"
            :align="c.align"
            loading
          />
        </div>
      </div>
    </section>
  </div>
</template>
