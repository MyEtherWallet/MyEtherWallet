<script setup lang="ts">
// Dev-only preview for AppBaseButton (all types × states × sizes).
// Route is registered only when import.meta.env.DEV — see routesDefault.ts.
// Visit https://localhost:8080/button-preview in dev.
import AppBaseButton from '@components/AppBaseButton.vue'

const types = [
  { label: 'Primary', props: { theme: 'primary' } },
  { label: 'Secondary', props: { theme: 'neutral' } },
  { label: 'Outline', props: { theme: 'primary', isOutline: true } },
  { label: 'Ghost', props: { theme: 'primary', isGhost: true } },
  { label: 'Destructive', props: { theme: 'error' } },
] as const

const sizes = ['large', 'medium', 'small'] as const
</script>

<template>
  <div class="p-10 bg-app-background min-h-screen">
    <h1 class="title5 mb-8">AppBaseButton — states preview</h1>

    <div
      v-for="t in types"
      :key="t.label"
      class="mb-10 border-b border-line pb-8"
    >
      <h2 class="text7 mb-4">{{ t.label }}</h2>

      <div class="grid grid-cols-[80px_repeat(3,1fr)] gap-4 items-center">
        <div></div>
        <div class="text-s-13 text-fg-subtle">Large</div>
        <div class="text-s-13 text-fg-subtle">Medium</div>
        <div class="text-s-13 text-fg-subtle">Small</div>

        <!-- Default -->
        <div class="text-s-13 text-fg-subtle">Default</div>
        <div v-for="s in sizes" :key="`d-${s}`">
          <AppBaseButton v-bind="t.props" :size="s">Button</AppBaseButton>
        </div>

        <!-- Loading -->
        <div class="text-s-13 text-fg-subtle">Loading</div>
        <div v-for="s in sizes" :key="`l-${s}`">
          <AppBaseButton v-bind="t.props" :size="s" isLoading
            >Button</AppBaseButton
          >
        </div>

        <!-- Disabled -->
        <div class="text-s-13 text-fg-subtle">Disabled</div>
        <div v-for="s in sizes" :key="`x-${s}`">
          <AppBaseButton v-bind="t.props" :size="s" disabled
            >Button</AppBaseButton
          >
        </div>

        <!-- Leading / Trailing icons -->
        <div class="text-s-13 text-fg-subtle">Icons</div>
        <div v-for="s in sizes" :key="`i-${s}`">
          <AppBaseButton v-bind="t.props" :size="s">
            <template #leading>
              <span aria-hidden="true">＋</span>
            </template>
            Button
            <template #trailing>
              <span aria-hidden="true">→</span>
            </template>
          </AppBaseButton>
        </div>
      </div>
    </div>

    <p class="text-s-13 text-fg-subtle">
      Hover and Pressed are pseudo-state driven — hover / click the Default row
      buttons above to see the color shift and darken.
    </p>
  </div>
</template>
