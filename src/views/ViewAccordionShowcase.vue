<script setup lang="ts">
// Preview for the Accordion design-library component (MEW-2465) at
// /dev/accordion. Figma: MEW Web App — Design Library › ↳ Acordion, set
// 2387:27248 — Style × Open × State, each style on the surface it is meant for,
// then a real body, groups and a live loading toggle.
import { ref } from 'vue'
import AppAccordion from '@components/accordion/AppAccordion.vue'
import AppAccordionGroup from '@components/accordion/AppAccordionGroup.vue'
import AppAvatar from '@components/avatar/AppAvatar.vue'
import AppAvatarBadge from '@components/avatar/AppAvatarBadge.vue'
import AppBaseButton from '@components/AppBaseButton.vue'
import AppCell from '@components/cell/AppCell.vue'
import AppDivider from '@components/divider/AppDivider.vue'
import type {
  CellRightAccessory,
  CellSurface,
} from '@components/cell/cellSizes'

const BALANCE: CellRightAccessory = {
  kind: 'balance',
  primary: '$1,230',
  secondary: '1,230 USDC',
}

const SURFACES: { surface: CellSurface; label: string; page: string }[] = [
  {
    surface: 'default',
    label: 'Style: Default — white accordion on the grey page',
    page: 'bg-background-default',
  },
  {
    surface: 'alternative',
    label: 'Style: Alternative — grey accordion on a white card',
    page: 'bg-background-alternative',
  },
]

const STATES = [
  { label: 'Default', props: {} },
  { label: 'Hover / Pressed (interact)', props: {} },
  { label: 'Focus (tab into it)', props: {} },
  { label: 'Disabled', props: { disabled: true } },
  { label: 'Loading', props: { loading: true } },
] as const

const OPEN_STATES = [
  { label: 'Open: False', open: false },
  { label: 'Open: True', open: true },
] as const

const GROUP_ITEMS = ['Ethereum', 'Bitcoin', 'Solana'] as const

const toggles = ref(0)
const liveOpen = ref(true)
const liveLoading = ref(true)
const singleOpen = ref<string | null>('Ethereum')
const multipleOpen = ref<string[]>(['Ethereum'])
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Accordion</h1>
      <p class="text-text-sm text-text-subtle">
        A Cell header that reveals grouped content beneath it. The whole row is
        the toggle; the chevron is decorative. Toggles: {{ toggles }}
      </p>
    </header>

    <section v-for="s in SURFACES" :key="s.surface" class="flex flex-col gap-4">
      <h2 class="text-label-base">{{ s.label }}</h2>
      <div
        class="grid grid-cols-2 gap-6 rounded-12 border border-border-default p-6"
        :class="s.page"
      >
        <div
          v-for="o in OPEN_STATES"
          :key="o.label"
          class="flex flex-col gap-3"
        >
          <p class="text-text-xs text-text-subtle">{{ o.label }}</p>
          <div
            v-for="state in STATES"
            :key="state.label"
            class="flex flex-col gap-1"
          >
            <span class="text-text-xs text-text-subtle">{{ state.label }}</span>
            <AppAccordion
              :surface="s.surface"
              :open="o.open"
              v-bind="state.props"
              title="Title"
              description="Information"
              :right-accessory="BALANCE"
              @toggle="toggles++"
            >
              <template #avatar="{ size: avatarSize }">
                <AppAvatar
                  :size="avatarSize"
                  type="cryptoAsset"
                  symbol="USDC"
                  badge-bottom
                >
                  <template #badge>
                    <AppAvatarBadge type="network">
                      <span
                        class="size-full rounded-full bg-background-decorative-violet"
                      />
                    </AppAvatarBadge>
                  </template>
                </AppAvatar>
              </template>
              <p class="px-4 pb-4 text-text-sm text-text-subtle">
                Content slot
              </p>
            </AppAccordion>
          </div>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Body with cells</h2>
      <div
        class="flex max-w-120 flex-col gap-3 rounded-12 border border-border-default bg-background-default p-6"
      >
        <AppAccordion
          v-model:open="liveOpen"
          title="Ethereum"
          description="3 assets"
          :right-accessory="{ kind: 'balance', primary: '$4,120' }"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="cryptoAsset" symbol="ETH" />
          </template>
          <AppDivider />
          <AppCell
            v-for="symbol in ['ETH', 'USDC', 'USDT']"
            :key="symbol"
            :title="symbol"
            description="Ethereum"
            :right-accessory="BALANCE"
          >
            <template #avatar="{ size: avatarSize }">
              <AppAvatar
                :size="avatarSize"
                type="cryptoAsset"
                :symbol="symbol"
              />
            </template>
          </AppCell>
        </AppAccordion>
        <p class="text-text-xs text-text-subtle">
          v-model:open = {{ liveOpen }}
        </p>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Loading → loaded</h2>
      <AppBaseButton
        size="small"
        class="self-start"
        @click="liveLoading = !liveLoading"
      >
        {{ liveLoading ? 'Finish loading' : 'Start loading' }}
      </AppBaseButton>
      <div
        class="flex max-w-120 flex-col gap-3 rounded-12 border border-border-default bg-background-default p-6"
      >
        <AppAccordion
          :loading="liveLoading"
          title="Title"
          description="Chevron stays, toggling is off while loading"
          :right-accessory="BALANCE"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="L" />
          </template>
          <p class="px-4 pb-4 text-text-sm text-text-subtle">Loaded content</p>
        </AppAccordion>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Group</h2>
      <div class="grid grid-cols-2 gap-6">
        <div
          class="flex flex-col gap-3 rounded-12 border border-border-default bg-background-default p-6"
        >
          <p class="text-text-xs text-text-subtle">
            Single (one open at a time) · v-model = {{ singleOpen }}
          </p>
          <AppAccordionGroup v-model="singleOpen">
            <AppAccordion
              v-for="item in GROUP_ITEMS"
              :key="item"
              :value="item"
              :title="item"
              description="Network"
            >
              <p class="px-4 pb-4 text-text-sm text-text-subtle">
                {{ item }} details
              </p>
            </AppAccordion>
          </AppAccordionGroup>
        </div>
        <div
          class="flex flex-col gap-3 rounded-12 border border-border-default bg-background-default p-6"
        >
          <p class="text-text-xs text-text-subtle">
            multiple · v-model = {{ multipleOpen }}
          </p>
          <AppAccordionGroup v-model="multipleOpen" multiple>
            <AppAccordion
              v-for="item in GROUP_ITEMS"
              :key="item"
              :value="item"
              :title="item"
              description="Network"
            >
              <p class="px-4 pb-4 text-text-sm text-text-subtle">
                {{ item }} details
              </p>
            </AppAccordion>
          </AppAccordionGroup>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-label-base">Reduced motion</h2>
      <p class="text-text-sm text-text-subtle">
        With the OS "reduce motion" setting on (DevTools › Rendering › Emulate
        prefers-reduced-motion: reduce) the body opens and closes without the
        height animation.
      </p>
    </section>
  </div>
</template>
