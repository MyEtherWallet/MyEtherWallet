<script setup lang="ts">
// Preview for the Text area design-library component (MEW-1971) at
// /dev/text-area. Figma node 3094:65088; each style on the surface it is meant
// for. Click into a field to see Active (caret, no ring); Tab in for Focus.
import { reactive } from 'vue'
import AppTextArea from '@components/AppTextArea.vue'
import { INPUT_SURFACES } from '@components/inputSizes'

const PAGE = {
  default: 'bg-background-alternative',
  alternative: 'bg-background-default',
} as const

const VARIANTS = [
  { key: 'empty', caption: 'Default (empty)', props: {}, value: '' },
  { key: 'filled', caption: 'Filled', props: {}, value: 'A signed message' },
  {
    key: 'error',
    caption: 'Error — Tab in to see the ring',
    props: { errorMessage: 'Invalid signature' },
    value: '0x123',
  },
  {
    key: 'readonly',
    caption: 'Read only',
    props: { readonly: true },
    value: 'Read only',
  },
]

const models = reactive<Record<string, string>>({})
for (const surface of INPUT_SURFACES)
  for (const v of VARIANTS) models[`${surface}-${v.key}`] = v.value
</script>

<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Text area</h1>
      <p class="text-text-sm text-text-subtle">
        Multi-line text field. Same surfaces and focus rules as Input.
      </p>
    </header>

    <section
      v-for="surface in INPUT_SURFACES"
      :key="surface"
      class="flex flex-col gap-4"
    >
      <h2 class="text-label-base">Style: {{ surface }}</h2>
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-12 border border-border-default p-6"
        :class="PAGE[surface]"
      >
        <div v-for="v in VARIANTS" :key="v.key">
          <p class="text-text-xs text-text-muted mb-1">{{ v.caption }}</p>
          <AppTextArea
            v-model="models[`${surface}-${v.key}`]"
            :surface="surface"
            placeholder="Message to sign"
            v-bind="v.props"
          />
        </div>
      </div>
    </section>
  </div>
</template>
