<script setup lang="ts">
// Gallery for the Radio Button design-library component (MEW-2400), reachable
// at /dev/radio via the design-library shell — see routesDefault.ts. Mirrors the
// Figma Selected × State grid (node 3822:42489). Hover and focus are CSS, so the
// live grid shows them when you hover a radio or Tab into a group; the forced
// row paints those two states statically for side-by-side comparison.
import { ref } from 'vue'
import AppRadio from '@/components/radio/AppRadio.vue'
import AppIcon from '@/components/icon/AppIcon.vue'

// Grid samples are pinned: they ignore clicks so each cell keeps showing its
// Figma variant.
const pin = () => {}

const FEES = [
  { value: 'economy', label: 'Economy' },
  { value: 'regular', label: 'Regular' },
  { value: 'fast', label: 'Fast (unavailable)', disabled: true },
]
const fee = ref('regular')

const plan = ref('monthly')
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Radio Button</h1>
      <p class="text-s-14 text-text-subtle">
        Single-select control for forms and lists. Shows a check when selected.
        Hover an unselected radio for the halo; Tab into a group and use the
        arrow keys for the focus ring and selection.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Selected × State</h2>
      <div
        class="grid w-fit grid-cols-3 items-center gap-x-12 gap-y-6 rounded-12 border border-border-default bg-white p-6"
      >
        <span />
        <span class="text-s-12 text-text-subtle">Selected=False</span>
        <span class="text-s-12 text-text-subtle">Selected=True</span>

        <span class="text-s-12 text-text-subtle">Default</span>
        <AppRadio
          name="grid-1"
          value="a"
          model-value="b"
          @update:model-value="pin"
        />
        <AppRadio
          name="grid-2"
          value="a"
          model-value="a"
          @update:model-value="pin"
        />

        <span class="text-s-12 text-text-subtle">Hover (forced)</span>
        <!-- Static copy of AppRadio's unselected circle + its group-hover halo. -->
        <span
          class="size-5 rounded-full border bg-background-formfield border-border-strong ring-4 ring-background-default-hover"
        />
        <span class="text-s-12 text-text-subtle">not defined</span>

        <span class="text-s-12 text-text-subtle">Focused (forced)</span>
        <!-- Static copy of AppRadio's peer-focus-visible ring. -->
        <span
          class="size-5 rounded-full border bg-background-formfield border-border-strong outline-4 outline-offset-2 outline-border-focus"
        />
        <span
          class="flex size-5 items-center justify-center rounded-full bg-background-brand outline-4 outline-offset-2 outline-border-focus"
          title="Not in Figma — kept for keyboard users"
        >
          <AppIcon name="check" size="xxs" class="size-3! text-icon-inverted" />
        </span>

        <span class="text-s-12 text-text-subtle">Disabled</span>
        <AppRadio name="grid-3" value="a" model-value="b" disabled />
        <AppRadio name="grid-4" value="a" model-value="a" disabled />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Labelled group</h2>
      <div
        role="radiogroup"
        aria-label="Network fee"
        class="flex flex-col gap-3 rounded-12 border border-border-default bg-white p-6"
      >
        <AppRadio
          v-for="f in FEES"
          :key="f.value"
          v-model="fee"
          name="fee"
          :value="f.value"
          :label="f.label"
          :disabled="f.disabled"
        />
        <p class="text-s-12 text-text-subtle">Selected: {{ fee }}</p>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Two-line label (slot)</h2>
      <div
        role="radiogroup"
        aria-label="Plan"
        class="flex max-w-xs flex-col gap-3 rounded-12 border border-border-default bg-white p-6"
      >
        <AppRadio v-model="plan" name="plan" value="monthly">
          Monthly — billed every month, cancel any time before renewal
        </AppRadio>
        <AppRadio v-model="plan" name="plan" value="yearly">
          Yearly — <strong>two months free</strong>, billed once a year
        </AppRadio>
      </div>
    </section>
  </div>
</template>
