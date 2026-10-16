<script setup lang="ts">
// Preview for the Cell design-library component (MEW-2195) at /dev/cell.
// Figma: MEW Web App — Design Library › Cell — Style × State × Size, each
// style on the surface it is meant for, plus one row per slot.
import { computed, ref } from 'vue'
import AppCell from '@components/AppCell.vue'
import AppAvatar from '@components/avatar/AppAvatar.vue'
import AppAvatarBadge from '@components/avatar/AppAvatarBadge.vue'
import AppBaseButton from '@components/AppBaseButton.vue'
import AppBtnIcon from '@components/AppBtnIcon.vue'
import AppCellWatchlistToggle from '@components/AppCellWatchlistToggle.vue'
import AppIcon from '@components/icon/AppIcon.vue'
import {
  CELL_SIZES,
  type CellRightAccessory,
  type CellSurface,
} from '@components/cellSizes'

const BALANCE: CellRightAccessory = {
  kind: 'balance',
  primary: '$1,230',
  secondary: '1,230 USDC',
}

const SURFACES: { surface: CellSurface; label: string; page: string }[] = [
  {
    surface: 'default',
    label: 'Style: Default — white cell on the grey page',
    page: 'bg-background-default',
  },
  {
    surface: 'alternative',
    label: 'Style: Alternative — grey cell on a white card',
    page: 'bg-background-alternative',
  },
]

const STATES = [
  { label: 'Default', props: {} },
  { label: 'Hover / Pressed (interact)', props: {} },
  { label: 'Selected', props: { selected: true } },
  { label: 'Focus (tab into it)', props: {} },
  { label: 'Disabled', props: { disabled: true } },
  { label: 'Loading', props: { loading: true } },
] as const

const clicks = ref(0)
const slotClicks = ref(0)

// Right accessory (MEW-2445): the nine Figma variants (set 1058:908), then a
// live block where the sign toggle and fresh points drive the trend colours.
const randomPoints = () => Array.from({ length: 24 }, () => Math.random() * 100)
const sign = ref(1)
const livePoints = ref(randomPoints())

const ACCESSORY_VARIANTS: { label: string; accessory: CellRightAccessory }[] = [
  { label: 'balance', accessory: BALANCE },
  {
    label: 'balance+performance up',
    accessory: { kind: 'balance-performance', primary: '$1,230', change: 0.1 },
  },
  {
    label: 'balance+performance down',
    accessory: { kind: 'balance-performance', primary: '$1,230', change: -0.1 },
  },
  {
    label: 'graph positive',
    accessory: { kind: 'graph', points: [10, 14, 12, 18, 16, 22, 26] },
  },
  {
    label: 'graph negative',
    accessory: { kind: 'graph', points: [26, 22, 24, 16, 18, 12, 10] },
  },
  { label: 'performance up', accessory: { kind: 'performance', change: 0.1 } },
  {
    label: 'performance down',
    accessory: { kind: 'performance', change: -0.1 },
  },
  { label: 'check', accessory: { kind: 'icon', icon: 'check-circle' } },
  { label: 'loading', accessory: { kind: 'loading' } },
]

const liveAccessories = computed<
  { label: string; accessory: CellRightAccessory }[]
>(() => [
  {
    label: 'balance+performance',
    accessory: {
      kind: 'balance-performance',
      primary: '$1,230',
      change: 2.45 * sign.value,
    },
  },
  {
    label: 'performance',
    accessory: { kind: 'performance', change: 2.45 * sign.value },
  },
  {
    label: 'graph (trend from first vs last point)',
    accessory: { kind: 'graph', points: livePoints.value },
  },
  {
    label: 'zero change is neutral',
    accessory: { kind: 'performance', change: 0 },
  },
])
const watched = ref(false)
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Cell</h1>
      <p class="text-text-sm text-text-subtle">
        List row composed from Avatar, Avatar badge and Content Group. Cell
        clicks: {{ clicks }} · slot clicks: {{ slotClicks }}
      </p>
    </header>

    <section v-for="s in SURFACES" :key="s.surface" class="flex flex-col gap-4">
      <h2 class="text-label-base">{{ s.label }}</h2>
      <div
        class="grid grid-cols-2 gap-6 rounded-12 border border-border-default p-6"
        :class="s.page"
      >
        <div v-for="size in CELL_SIZES" :key="size" class="flex flex-col gap-3">
          <p class="text-text-xs text-text-subtle">size="{{ size }}"</p>
          <div
            v-for="state in STATES"
            :key="state.label"
            class="flex flex-col gap-1"
          >
            <span class="text-text-xs text-text-subtle">{{ state.label }}</span>
            <AppCell
              :surface="s.surface"
              :size="size"
              v-bind="state.props"
              title="Title"
              description="Information"
              :right-accessory="BALANCE"
              @click="clicks++"
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
            </AppCell>
          </div>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Right accessory</h2>
      <div
        class="grid grid-cols-2 gap-6 rounded-12 border border-border-default bg-background-default p-6"
      >
        <div v-for="size in CELL_SIZES" :key="size" class="flex flex-col gap-3">
          <p class="text-text-xs text-text-subtle">size="{{ size }}"</p>
          <div
            v-for="row in ACCESSORY_VARIANTS"
            :key="row.label"
            class="flex flex-col gap-1"
          >
            <span class="text-text-xs text-text-subtle">{{ row.label }}</span>
            <AppCell
              :size="size"
              title="Title"
              description="Information"
              :right-accessory="row.accessory"
              @click="clicks++"
            >
              <template #avatar="{ size: avatarSize }">
                <AppAvatar :size="avatarSize" type="initial" initial="A" />
              </template>
            </AppCell>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <AppBaseButton size="small" @click="sign = -sign">
          Flip sign
        </AppBaseButton>
        <AppBaseButton size="small" @click="livePoints = randomPoints()">
          New points
        </AppBaseButton>
      </div>
      <div
        class="flex max-w-120 flex-col gap-3 rounded-12 border border-border-default bg-background-default p-6"
      >
        <div
          v-for="row in liveAccessories"
          :key="row.label"
          class="flex flex-col gap-1"
        >
          <span class="text-text-xs text-text-subtle">{{ row.label }}</span>
          <AppCell
            title="Live"
            description="Information"
            :right-accessory="row.accessory"
          >
            <template #avatar="{ size: avatarSize }">
              <AppAvatar :size="avatarSize" type="initial" initial="L" />
            </template>
          </AppCell>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Watchlist toggle</h2>
      <div
        class="flex max-w-120 flex-col gap-3 rounded-12 border border-border-default bg-background-default p-6"
      >
        <div class="flex items-center gap-6 text-text-xs text-text-subtle">
          <span class="flex items-center gap-2">
            Off <AppCellWatchlistToggle :model-value="false" />
          </span>
          <span class="flex items-center gap-2">
            On <AppCellWatchlistToggle :model-value="true" />
          </span>
          <span class="flex items-center gap-2">
            Loading <AppCellWatchlistToggle :model-value="true" loading />
          </span>
        </div>
        <AppCell
          title="Live toggle"
          :description="`watched: ${watched}. Star clicks must not bump Cell clicks`"
          @click="clicks++"
        >
          <template #prefix>
            <AppCellWatchlistToggle v-model="watched" />
          </template>
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="cryptoAsset" symbol="ETH" />
          </template>
        </AppCell>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Slots</h2>
      <div
        class="flex max-w-[480px] flex-col gap-3 rounded-12 border border-border-default bg-background-default p-6"
      >
        <AppCell
          title="Prefix action"
          description="Watchlist star"
          @click="clicks++"
        >
          <template #prefix>
            <AppCellWatchlistToggle v-model="watched" @click="slotClicks++" />
          </template>
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="W" />
          </template>
        </AppCell>

        <AppCell
          title="Inline button"
          description="Action slot"
          @click="clicks++"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="B" />
          </template>
          <template #action>
            <AppBaseButton size="small" @click="slotClicks++">
              Button
            </AppBaseButton>
          </template>
        </AppCell>

        <AppCell
          title="Suffix action"
          description="Overflow menu"
          @click="clicks++"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="S" />
          </template>
          <template #suffix>
            <AppBtnIcon label="More" @click="slotClicks++">
              <AppIcon name="ellipsis-horizontal" size="xs" variant="filled" />
            </AppBtnIcon>
          </template>
        </AppCell>

        <AppCell title="No avatar" description="Text only" @click="clicks++" />

        <AppCell
          title="Custom accessory slot"
          description="Escape hatch, replaces rightAccessory"
          :right-accessory="BALANCE"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="C" />
          </template>
          <template #accessory>
            <p class="text-label-base text-text-brand">Custom</p>
          </template>
        </AppCell>

        <AppCell
          title="Static row"
          description="interactive=false — no hover, no cursor"
          :interactive="false"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="R" />
          </template>
        </AppCell>

        <AppCell
          title="Very long title that should truncate instead of wrapping onto a second line"
          description="Very long description that should truncate instead of wrapping onto a second line"
          :right-accessory="BALANCE"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="L" />
          </template>
        </AppCell>
      </div>
    </section>
  </div>
</template>
