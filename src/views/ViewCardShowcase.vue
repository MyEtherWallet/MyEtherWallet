<script setup lang="ts">
// Gallery for the Card design-library component (MEW-2339), reachable at
// /dev/card via the design-library shell — see routesDefault.ts. Shows the
// Variant × State matrix from Figma 2276:5773. Hover, pressed and focus are
// native: hover, press or Tab to an interactive card to see them. The toggles
// show or hide the optional header avatar, action and button group.
import { ref } from 'vue'
import AppCard from '@/components/card/AppCard.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import type { CardVariant } from '@/components/card/types'

// Each variant fills the opposite of the surface it sits on, so preview each
// on its designed surface or the fill would vanish (white on white).
const VARIANTS: { variant: CardVariant; label: string; page: string }[] = [
  {
    variant: 'default',
    label: 'Variant: default — fills white, sits on a default (grey) surface',
    page: 'bg-background-default',
  },
  {
    variant: 'alternative',
    label: 'Variant: alternative — fills grey, sits on a white surface',
    page: 'bg-white',
  },
]

const STATES = [
  { name: 'Default', props: { interactive: true } },
  { name: 'Selected', props: { interactive: true, selected: true } },
  { name: 'Loading', props: { interactive: true, loading: true } },
  { name: 'Non-interactive', props: {} },
] as const

const showAvatar = ref(true)
const showAction = ref(true)
const showButtons = ref(true)

// Live toggle so Selected can be flipped by clicking a card.
const picked = ref(false)
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-5xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Card</h1>
      <p class="text-s-14 text-text-subtle">
        Self-contained block (avatar, label content, action buttons) for asset
        or promo cards outside a list. Hover, press or Tab to an interactive
        card to see those states.
      </p>
      <div class="mt-3 flex flex-wrap gap-4 text-s-14">
        <label class="flex items-center gap-2">
          <input v-model="showAvatar" type="checkbox" />
          Avatar
        </label>
        <label class="flex items-center gap-2">
          <input v-model="showAction" type="checkbox" />
          Right action
        </label>
        <label class="flex items-center gap-2">
          <input v-model="showButtons" type="checkbox" />
          Button group
        </label>
      </div>
    </header>

    <section v-for="v in VARIANTS" :key="v.variant" class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">{{ v.label }}</h2>
      <div
        class="grid grid-cols-1 gap-4 rounded-12 border border-border-default p-4 sm:grid-cols-2 lg:grid-cols-4"
        :class="v.page"
      >
        <div v-for="s in STATES" :key="s.name" class="flex flex-col gap-2">
          <p class="text-s-11 uppercase tracking-sp-06 text-text-subtle">
            {{ s.name }}
          </p>
          <AppCard
            v-bind="s.props"
            :variant="v.variant"
            title="Ethereum"
            description="ETH"
          >
            <template v-if="showAvatar" #avatar="{ size }">
              <AppAvatar type="initial" :size="size" initial="E" />
            </template>
            <template v-if="showAction" #action>
              <AppBtnIcon icon="ellipsis-horizontal" label="More" />
            </template>
            <p class="px-4 text-s-14 text-text-subtle">
              Content slot. The consumer owns this area.
            </p>
            <template v-if="showButtons" #buttons>
              <AppBaseButton
                type="secondary"
                size="medium"
                :surface="v.variant === 'default' ? 'alternative' : 'default'"
              >
                Sell
              </AppBaseButton>
              <AppBaseButton size="medium">Buy</AppBaseButton>
            </template>
          </AppCard>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">
        Selectable, no header (click to toggle)
      </h2>
      <div
        class="grid grid-cols-2 gap-3 rounded-12 border border-border-default bg-white p-4 sm:grid-cols-4"
      >
        <AppCard
          interactive
          variant="alternative"
          label="Stocks"
          :selected="picked"
          class="h-[120px] justify-between p-4"
          @click="picked = !picked"
        >
          <span class="text-label-base">Stocks</span>
          <span class="text-text-sm text-text-subtle">
            {{ picked ? 'Selected' : 'Not selected' }}
          </span>
        </AppCard>
        <AppCard
          interactive
          disabled
          variant="alternative"
          label="Crypto"
          :selected="false"
          class="h-[120px] justify-between p-4"
        >
          <span class="text-label-base">Disabled</span>
        </AppCard>
      </div>
    </section>
  </div>
</template>
