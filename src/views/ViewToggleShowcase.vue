<script setup lang="ts">
// Gallery for the Toggle design-library component (MEW-1974), reachable at
// /dev/toggle via the design-library shell — see routesDefault.ts. Mirrors the
// Status × State matrix in Figma (node 628-190). Hover is CSS only, so the
// Hover column forces it with `is-forced-hover`; the interactive toggle shows
// the real hover, press and Tab focus.
import { ref } from 'vue'
import AppToggle from '@/components/AppToggle.vue'

const STATUSES = [
  { label: 'Off', value: false },
  { label: 'On', value: true },
]
const STATES = [
  { label: 'Default', forcedHover: false },
  { label: 'Hover', forcedHover: true },
]

const interactiveValue = ref(false)
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Toggle</h1>
      <p class="text-s-14 text-text-subtle">
        43 × 24 switch to turn a setting on or off. The label is not part of the
        component — pair it with a Cell or Content Group.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Status × State</h2>
      <div
        class="inline-grid w-fit grid-cols-[auto_repeat(2,96px)] items-center gap-y-6 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <span />
        <span
          v-for="state in STATES"
          :key="state.label"
          class="text-s-12 text-text-subtle"
        >
          {{ state.label }}
        </span>
        <template v-for="status in STATUSES" :key="status.label">
          <span class="pr-8 text-s-12 text-text-subtle">
            Status={{ status.label }}
          </span>
          <!-- No-op listener keeps the samples fixed: without it defineModel
               flips the value locally on click. -->
          <app-toggle
            v-for="state in STATES"
            :key="state.label"
            :model-value="status.value"
            :class="{ 'is-forced-hover': state.forcedHover }"
            @update:model-value="() => {}"
            :aria-label="`${status.label} — ${state.label}`"
          />
        </template>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Interactive</h2>
      <div
        class="flex flex-wrap items-center gap-8 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <div class="flex items-center gap-3">
          <app-toggle v-model="interactiveValue" aria-label="Interactive" />
          <output class="text-s-14 text-text-subtle">
            {{ interactiveValue ? 'On' : 'Off' }}
          </output>
        </div>
        <div class="flex items-center gap-3">
          <app-toggle :model-value="false" disabled aria-label="Disabled off" />
          <app-toggle :model-value="true" disabled aria-label="Disabled on" />
          <span class="text-s-14 text-text-subtle">
            Disabled (not in Figma yet)
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Preview only: paint the CSS hover fill without a pointer over it. */
.is-forced-hover[aria-checked='false'] {
  background-color: var(--background-default-hover);
}

.is-forced-hover[aria-checked='true'] {
  background-color: var(--background-brand-hover);
}
</style>
