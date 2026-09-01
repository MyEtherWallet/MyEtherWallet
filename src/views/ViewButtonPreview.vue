<script setup lang="ts">
// Dev-only preview for AppBaseButton and AppBtnGroup.
// Route is registered only when import.meta.env.DEV — see routesDefault.ts.
// Visit https://localhost:8080/button-preview in dev.
//
// This page doubles as the "collect examples and test the secondary in
// multiple contexts" surface: the Contexts section below renders the secondary
// against every background it ships on.
import AppBaseButton from '@components/AppBaseButton.vue'
import AppBtnGroup from '@components/AppBtnGroup.vue'
import { BTN_SIZES } from '@components/buttonSizes'

const types = [
  { label: 'Primary', props: { type: 'primary' } },
  { label: 'Secondary', props: { type: 'secondary' } },
  {
    label: 'Secondary — on alternative',
    props: { type: 'secondary', surface: 'alternative' },
  },
  { label: 'Tertiary', props: { type: 'tertiary' } },
  {
    label: 'Tertiary — on alternative',
    props: { type: 'tertiary', surface: 'alternative' },
  },
  { label: 'Link', props: { type: 'link' } },
] as const

const tones = ['default', 'danger', 'success'] as const

// Surfaces the secondary has to survive, for the "revisit secondary" review.
const contexts = [
  { label: 'App background', class: 'bg-app-background' },
  { label: 'White card', class: 'bg-white' },
  { label: 'Muted / bgBase', class: 'bg-bgBase' },
  { label: 'Brand tint', class: 'bg-mewBg' },
] as const
</script>

<template>
  <div class="p-10 bg-app-background min-h-screen">
    <h1 class="title5 mb-8">AppBaseButton — types × tones × sizes</h1>

    <div
      v-for="t in types"
      :key="t.label"
      class="mb-10 border-b border-grey-10 pb-8"
    >
      <h2 class="text7 mb-4">{{ t.label }}</h2>

      <div v-for="tone in tones" :key="tone" class="mb-6">
        <p class="text-s-13 text-grey-50 mb-2 capitalize">{{ tone }}</p>
        <div class="grid grid-cols-[90px_repeat(4,1fr)] gap-4 items-center">
          <div></div>
          <div
            v-for="s in BTN_SIZES"
            :key="`h-${s}`"
            class="text-s-13 text-grey-50 capitalize"
          >
            {{ s }}
          </div>

          <div class="text-s-13 text-grey-50">Default</div>
          <div v-for="s in BTN_SIZES" :key="`d-${s}`">
            <AppBaseButton v-bind="t.props" :tone="tone" :size="s"
              >Button</AppBaseButton
            >
          </div>

          <div class="text-s-13 text-grey-50">Loading</div>
          <div v-for="s in BTN_SIZES" :key="`l-${s}`">
            <AppBaseButton v-bind="t.props" :tone="tone" :size="s" isLoading
              >Button</AppBaseButton
            >
          </div>

          <div class="text-s-13 text-grey-50">Disabled</div>
          <div v-for="s in BTN_SIZES" :key="`x-${s}`">
            <AppBaseButton v-bind="t.props" :tone="tone" :size="s" disabled
              >Button</AppBaseButton
            >
          </div>

          <div class="text-s-13 text-grey-50">Icons</div>
          <div v-for="s in BTN_SIZES" :key="`i-${s}`">
            <AppBaseButton v-bind="t.props" :tone="tone" :size="s">
              <template #leading><span aria-hidden="true">＋</span></template>
              Button
              <template #trailing><span aria-hidden="true">→</span></template>
            </AppBaseButton>
          </div>
        </div>
      </div>
    </div>

    <h2 class="title5 mb-4">Secondary in context</h2>
    <p class="text-s-14 text-grey-50 mb-4">
      The secondary is provisional — brand blue standing in until the approach
      is settled. Each swatch below is a real app surface it has to hold up on.
    </p>
    <div class="grid grid-cols-2 gap-4 mb-10">
      <div
        v-for="c in contexts"
        :key="c.label"
        :class="['p-6 rounded-20 border border-grey-10', c.class]"
      >
        <p class="text-s-13 text-grey-50 mb-3">{{ c.label }}</p>
        <div class="flex gap-3 items-center flex-wrap">
          <AppBaseButton type="secondary" size="medium"
            >On default</AppBaseButton
          >
          <AppBaseButton type="secondary" surface="alternative" size="medium">
            On alternative
          </AppBaseButton>
          <AppBaseButton type="primary" size="medium">Primary</AppBaseButton>
        </div>
      </div>
    </div>

    <h2 class="title5 mb-4">AppBtnGroup</h2>
    <div class="grid grid-cols-2 gap-6 mb-10">
      <div class="bg-white rounded-20 p-4">
        <p class="text-s-13 text-grey-50 mb-2">Horizontal</p>
        <AppBtnGroup>
          <AppBaseButton type="secondary" surface="alternative"
            >Cancel</AppBaseButton
          >
          <AppBaseButton>Confirm</AppBaseButton>
        </AppBtnGroup>
      </div>
      <div class="bg-white rounded-20 p-4">
        <p class="text-s-13 text-grey-50 mb-2">Horizontal — with tertiary</p>
        <AppBtnGroup>
          <AppBaseButton type="tertiary">Learn more</AppBaseButton>
          <AppBaseButton type="secondary" surface="alternative"
            >Cancel</AppBaseButton
          >
          <AppBaseButton>Confirm</AppBaseButton>
        </AppBtnGroup>
      </div>
      <div class="bg-white rounded-20 p-4">
        <p class="text-s-13 text-grey-50 mb-2">Vertical</p>
        <AppBtnGroup orientation="vertical">
          <AppBaseButton type="secondary" surface="alternative"
            >Cancel</AppBaseButton
          >
          <AppBaseButton>Confirm</AppBaseButton>
        </AppBtnGroup>
      </div>
      <div class="bg-white rounded-20 p-4">
        <p class="text-s-13 text-grey-50 mb-2">Vertical — danger</p>
        <AppBtnGroup orientation="vertical">
          <AppBaseButton type="secondary" surface="alternative"
            >Keep</AppBaseButton
          >
          <AppBaseButton tone="danger">Delete</AppBaseButton>
        </AppBtnGroup>
      </div>
    </div>

    <p class="text-s-13 text-grey-50">
      Hover and Pressed are pseudo-state driven — hover / click the Default row
      buttons above to see the color shift and darken. Focus is keyboard-only
      (tab to a button) and renders a 2px focus ring.
    </p>
  </div>
</template>
