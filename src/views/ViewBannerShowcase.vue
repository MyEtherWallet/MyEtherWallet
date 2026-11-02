<script setup lang="ts">
// Gallery for the Banner (MEW-2448), reachable at /dev/banner via the
// design-library shell — see routesDefault.ts. Figma `Banner` 3740:42238 (four
// types), the `_base` 3740:42018 sizes on both surfaces, then actions, no
// close, long copy, and a live v-model dismiss.
import { ref } from 'vue'
import AppBanner from '@/components/banner/AppBanner.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { BANNER_TYPES } from '@/components/banner/types'

const TITLE = 'Title of notification'
const DESCRIPTION = 'Description of issue, error or info.'
const SHORT = 'Short feedback message of only 1 line'

// Figma "Style": the surface each banner sits on, and the panel that shows it.
const SURFACES = [
  {
    surface: 'alternative',
    label: 'On alternative',
    panel: 'bg-background-alternative',
  },
  { surface: 'default', label: 'On default', panel: 'bg-background-default' },
] as const
const LONG =
  'Bridging from Arbitrum usually takes a few minutes, but during network congestion it can take up to an hour. Your funds stay safe while the transfer is pending, and you can follow its progress from the activity panel.'

const isShown = ref(true)
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Banner</h1>
      <p class="text-s-14 text-text-subtle">
        Inline feedback at the top of a page or section. Type only swaps the
        status icon; the container stays grey for every type.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Types</h2>
      <div
        class="grid sm:grid-cols-2 gap-6 rounded-12 border border-border-default bg-background-alternative p-8"
      >
        <AppBanner
          v-for="type in BANNER_TYPES"
          :key="type"
          :type="type"
          :title="TITLE"
          :description="DESCRIPTION"
          dismissible
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Sizes and surfaces</h2>
      <p class="text-s-14 text-text-subtle">
        Multi line comes from a title or actions, single line from a bare
        description. The surface prop picks the fill for the background the
        banner sits on.
      </p>
      <div
        v-for="s in SURFACES"
        :key="s.surface"
        :class="[
          'flex flex-col gap-4 rounded-12 border border-border-default p-8',
          s.panel,
        ]"
      >
        <h3 class="text-s-14 font-semibold">{{ s.label }}</h3>
        <div class="grid sm:grid-cols-2 gap-6 items-start">
          <AppBanner
            :surface="s.surface"
            :title="TITLE"
            :description="DESCRIPTION"
            dismissible
          />
          <AppBanner :surface="s.surface" :description="SHORT" dismissible />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Variations</h2>
      <div
        class="grid sm:grid-cols-2 gap-6 rounded-12 border border-border-default bg-background-alternative p-8"
      >
        <AppBanner
          type="warning"
          :title="TITLE"
          :description="DESCRIPTION"
          dismissible
        >
          <template #actions>
            <AppBaseButton type="secondary" surface="alternative" size="small">
              Secondary
            </AppBaseButton>
            <AppBaseButton size="small">Primary</AppBaseButton>
          </template>
        </AppBanner>
        <AppBanner type="success" :title="TITLE" :description="DESCRIPTION" />
        <AppBanner type="info" :title="TITLE" :description="LONG" dismissible />
        <AppBanner type="alert" :description="LONG" />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Dismiss (v-model)</h2>
      <div
        class="flex flex-col items-start gap-4 rounded-12 border border-border-default bg-background-alternative p-8"
      >
        <AppBanner
          v-model="isShown"
          type="info"
          :title="TITLE"
          :description="DESCRIPTION"
          dismissible
        />
        <AppBaseButton
          v-if="!isShown"
          type="secondary"
          size="small"
          @click="isShown = true"
        >
          Show again
        </AppBaseButton>
      </div>
    </section>
  </div>
</template>
