<script setup lang="ts">
// Gallery for the Modal design-library component (MEW-1967), reachable at
// /dev/modal via the design-library shell — see routesDefault.ts. Figma
// component set 2279:31532: M (2279:27719) from 768px up, S (2279:31533)
// below, so resize the window to see S. The playground toggles the four Figma
// booleans; the presets cover the behaviour that isn't in Figma.
import { ref } from 'vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppToggle from '@/components/AppToggle.vue'
import AppModal from '@/components/modal/AppModal.vue'

const showHeader = ref(true)
const showBackButton = ref(true)
const showCloseButton = ref(true)
const showButtonGroup = ref(true)
const showSubtitle = ref(true)
const lastEvent = ref('—')

const FLAGS = [
  { label: 'showHeader', model: showHeader },
  { label: 'subtitle', model: showSubtitle },
  { label: 'showBackButton', model: showBackButton },
  { label: 'showCloseButton', model: showCloseButton },
  { label: 'showButtonGroup', model: showButtonGroup },
]

const PRESETS = [
  'Playground',
  'Three buttons',
  '#footer override',
  'Long content',
  'Persistent',
  'Stacked',
  'Custom #header',
  'Wide (class override)',
] as const
type Preset = (typeof PRESETS)[number]

const open = ref<Preset | null>(null)
const stackedOpen = ref(false)

const show = (preset: Preset) => (open.value = preset)
const model = (preset: Preset) => ({
  modelValue: open.value === preset,
  'onUpdate:modelValue': (v: boolean) => (open.value = v ? preset : null),
})
const twoButtons = (
  done: () => void = () => {
    open.value = null
  },
) => ({
  primary: { label: 'Confirm', onClick: done },
  secondary: { label: 'Cancel', onClick: done },
})
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Modal</h1>
      <p class="text-s-14 text-text-subtle">
        Overlay that blocks the page to present focused content or actions.
        Optional header, back and close buttons, an unpadded content slot and
        an optional Button Group footer. M is 480 wide from 768px up; below
        that S fills the screen minus 16px gutters.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Playground</h2>
      <div
        class="flex flex-col gap-6 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <div class="flex flex-wrap gap-6">
          <label
            v-for="flag in FLAGS"
            :key="flag.label"
            class="flex items-center gap-2 text-s-14"
          >
            <AppToggle v-model="flag.model.value" :aria-label="flag.label" />
            {{ flag.label }}
          </label>
        </div>
        <div class="flex items-center gap-4">
          <AppBaseButton size="medium" class="w-fit" @click="show('Playground')">
            Open
          </AppBaseButton>
          <output class="text-s-14 text-text-subtle">
            Last event: {{ lastEvent }}
          </output>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Presets</h2>
      <div
        class="flex flex-wrap gap-3 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <AppBaseButton
          v-for="preset in PRESETS.slice(1)"
          :key="preset"
          type="secondary"
          size="medium"
          @click="show(preset)"
        >
          {{ preset }}
        </AppBaseButton>
      </div>
    </section>

    <AppModal
      v-bind="model('Playground')"
      title="Title"
      :subtitle="showSubtitle ? 'Subtitle' : undefined"
      aria-label="Playground modal"
      :show-header="showHeader"
      :show-back-button="showBackButton"
      :show-close-button="showCloseButton"
      :buttons="showButtonGroup ? twoButtons() : undefined"
      @back="lastEvent = 'back'"
      @close="lastEvent = 'close'"
      @opened="lastEvent = 'opened'"
      @closed="lastEvent = 'closed'"
    >
      <div
        class="m-4 sm:m-6 flex h-42.5 items-center justify-center rounded-12 border border-dashed border-border-default text-s-14 text-text-subtle"
      >
        Content slot
      </div>
    </AppModal>

    <AppModal
      v-bind="model('Three buttons')"
      title="Three buttons"
      :buttons="{
        ...twoButtons(),
        tertiary: { label: 'Skip', onClick: () => (open = null) },
      }"
    >
      <p class="px-4 sm:px-6 text-s-14">Tertiary → secondary → primary.</p>
    </AppModal>

    <AppModal v-bind="model('#footer override')" title="Custom footer">
      <p class="px-4 sm:px-6 text-s-14">The #footer slot replaces buttons.</p>
      <template #footer>
        <AppBaseButton class="w-full" tone="danger" @click="open = null">
          Delete
        </AppBaseButton>
      </template>
    </AppModal>

    <AppModal
      v-bind="model('Long content')"
      title="Long content"
      subtitle="Header and footer stay pinned"
      :buttons="twoButtons()"
    >
      <div class="flex flex-col gap-3 px-4 sm:px-6">
        <p v-for="n in 40" :key="n" class="text-s-14">Row {{ n }}</p>
      </div>
    </AppModal>

    <AppModal
      v-bind="model('Persistent')"
      title="Persistent"
      subtitle="No Esc, no backdrop, no close button"
      persistent
      :buttons="{ primary: { label: 'Done', onClick: () => (open = null) } }"
    >
      <p class="px-4 sm:px-6 text-s-14">Only the action closes it.</p>
    </AppModal>

    <AppModal
      v-bind="model('Stacked')"
      title="First modal"
      :buttons="{
        primary: { label: 'Open second', onClick: () => (stackedOpen = true) },
      }"
    >
      <p class="px-4 sm:px-6 text-s-14">
        Esc closes only the top one; focus returns here.
      </p>
    </AppModal>
    <AppModal
      v-model="stackedOpen"
      title="Second modal"
      :buttons="twoButtons(() => (stackedOpen = false))"
    >
      <p class="px-4 sm:px-6 text-s-14">Stacked above the first.</p>
    </AppModal>

    <AppModal v-bind="model('Custom #header')" title="Custom header">
      <template #header>
        <span class="text-heading-base">Anything goes here</span>
      </template>
      <p class="px-4 sm:px-6 pb-4 sm:pb-6 text-s-14">
        Back/close stay; the title becomes the aria-label.
      </p>
    </AppModal>

    <AppModal
      v-bind="model('Wide (class override)')"
      title="Wide"
      class="sm:w-200"
    >
      <p class="px-4 sm:px-6 pb-4 sm:pb-6 text-s-14">
        <code>class="sm:w-200"</code> overrides the 480 default.
      </p>
    </AppModal>
  </div>
</template>
