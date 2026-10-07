<script setup lang="ts">
// Gallery for the SegmentedControl design-library component (MEW-1968), reachable
// at /dev/segmented-control via the design-library shell — see routesDefault.ts.
// Compare against Figma SegmentedControl (274:2749) and Segment / _Base
// (274:2783). Hover is native; the Hover row forces it with the bound colour so
// the default-size quirk (same grey as the track) is visible for design.
import { computed, ref } from 'vue'
import AppAvatar from '@components/avatar/AppAvatar.vue'
import AppSegment from '@components/segmented_control/AppSegment.vue'
import AppSegmentedControl from '@components/segmented_control/AppSegmentedControl.vue'
import {
  SEGMENT_SIZE,
  type SegmentItem,
  type SegmentSize,
} from '@components/segmented_control/types'

const SIZES: SegmentSize[] = ['default', 'small']

// Hover bg as bound in Figma, minus the `hover:` prefix, to force the state.
const forcedHover = (size: SegmentSize) =>
  SEGMENT_SIZE[size].hover.replace('hover:', '')

const FIGMA_ITEMS: SegmentItem[] = [
  { value: 'a', label: 'Segment', trailingIcon: 'chevron-down' },
  { value: 'b', label: 'Segment', trailingIcon: 'chevron-down' },
  { value: 'c', label: 'Segment', trailingIcon: 'chevron-down' },
]
const PLAIN_ITEMS: SegmentItem[] = [
  { value: 'a', label: 'All' },
  { value: 'b', label: 'Stocks' },
  { value: 'c', label: 'Crypto' },
]
const figmaSelected = ref({ default: 'a', small: 'a' })
const plainSelected = ref({ default: 'b', small: 'b' })

const RANGES = [
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
  { value: '1m', label: '1M' },
  { value: '1y', label: '1Y' },
] as const
type RangeId = (typeof RANGES)[number]['value']
const range = ref<RangeId>('1w')
const rangePanel = computed(
  () => RANGES.find(r => r.value === range.value)?.label,
)

const TABS = [
  { value: 'orders', label: 'Orders' },
  { value: 'fills', label: 'Fills' },
]
const tab = ref('orders')
const COUNTS: Record<string, number> = { orders: 3, fills: 12 }

const category = ref('all')
const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'trades', label: 'Trades' },
  { value: 'swaps', label: 'Swaps' },
]
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Segmented Control</h1>
      <p class="text-s-14 text-text-subtle">
        Group of segments that lets users switch between a small set of related
        views or filters. Click a segment, or Tab in and use the arrow keys —
        arrows move and select, like radios.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Segment — Status × Size</h2>
      <div
        class="grid w-fit grid-cols-3 items-center gap-x-8 gap-y-4 rounded-12 border border-border-default bg-background-default p-6"
      >
        <span />
        <span
          v-for="size in SIZES"
          :key="size"
          class="text-s-12 text-text-subtle"
        >
          {{ size }}
        </span>
        <template
          v-for="status in ['Default', 'Selected', 'Hover']"
          :key="status"
        >
          <span class="text-s-12 text-text-subtle">{{ status }}</span>
          <AppSegment
            v-for="size in SIZES"
            :key="size"
            label="Segment"
            trailing-icon="chevron-down"
            :size="size"
            :selected="status === 'Selected'"
            :class="status === 'Hover' ? forcedHover(size) : ''"
          >
            <template #avatar="{ size: avatarSize }">
              <AppAvatar type="initial" initial="M" :size="avatarSize" />
            </template>
          </AppSegment>
        </template>
      </div>
    </section>

    <section v-for="size in SIZES" :key="size" class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Control — {{ size }}</h2>
      <div
        class="flex flex-col items-start gap-4 rounded-12 border border-border-default bg-white p-6"
      >
        <AppSegmentedControl
          v-model="figmaSelected[size]"
          :items="FIGMA_ITEMS"
          :size="size"
          label="Figma example"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar type="initial" initial="M" :size="avatarSize" />
          </template>
        </AppSegmentedControl>
        <AppSegmentedControl
          v-model="plainSelected[size]"
          :items="PLAIN_ITEMS"
          :size="size"
          label="Asset class"
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Live v-model</h2>
      <div
        class="flex flex-col items-start gap-4 rounded-12 border border-border-default bg-white p-6"
      >
        <AppSegmentedControl
          v-model="range"
          :items="[...RANGES]"
          size="small"
          label="Chart range"
        />
        <p class="text-s-14">Showing the {{ rangePanel }} chart</p>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">
        Slots — count badge, trailing content, full width
      </h2>
      <div
        class="flex flex-col items-start gap-4 rounded-12 border border-border-default bg-white p-6"
      >
        <AppSegmentedControl
          v-model="tab"
          :items="TABS"
          size="small"
          label="Activity"
        >
          <template #label="{ item }">
            {{ item.label }}
            <span class="ml-1 text-text-subtle">{{ COUNTS[item.value] }}</span>
          </template>
        </AppSegmentedControl>
        <AppSegmentedControl
          v-model="range"
          :items="RANGES.slice(0, 2)"
          size="small"
          label="Chart range"
        >
          <button type="button" class="px-2 text-label-sm">More</button>
        </AppSegmentedControl>
        <div class="w-80">
          <AppSegmentedControl
            v-model="category"
            :items="CATEGORIES"
            size="small"
            label="Category"
            full-width
          />
        </div>
      </div>
    </section>
  </div>
</template>
