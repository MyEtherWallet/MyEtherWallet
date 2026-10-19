<script setup lang="ts">
// Preview for the ScrollFade design-library component (MEW-2444) at
// /dev/scroll-fade. Matches Figma component set 1080:702 (specs 3535:116133).
import { useTemplateRef } from 'vue'
import AppScrollFade from '@/components/scroll_fade/AppScrollFade.vue'
import { useScrollEdges } from '@/components/scroll_fade/useScrollEdges'
import {
  SCROLL_FADE_SIDES,
  SCROLL_FADE_VARIANTS,
  type ScrollFadeSide,
} from '@/components/scroll_fade/types'

const SIDE_LABEL: Record<ScrollFadeSide, string> = {
  left: 'Scroll left',
  right: 'Scroll right',
  top: 'Scroll up',
  bottom: 'Scroll down',
}

const CHIPS = Array.from({ length: 16 }, (_, index) => `Chip ${index + 1}`)
const ROWS = Array.from({ length: 14 }, (_, index) => `Row ${index + 1}`)

const horizontalScroller = useTemplateRef<HTMLElement>('horizontalScroller')
const horizontalEdges = useScrollEdges(horizontalScroller, 'x')
const verticalScroller = useTemplateRef<HTMLElement>('verticalScroller')
const verticalEdges = useScrollEdges(verticalScroller, 'y')
const fadeOnlyScroller = useTemplateRef<HTMLElement>('fadeOnlyScroller')
const fadeOnlyEdges = useScrollEdges(fadeOnlyScroller, 'x')

const scrollStep = (
  scroller: HTMLElement | null,
  axis: 'x' | 'y',
  direction: 1 | -1,
) => {
  if (!scroller) return
  const step =
    (axis === 'x' ? scroller.clientWidth : scroller.clientHeight) * 0.8
  scroller.scrollBy({
    [axis === 'x' ? 'left' : 'top']: direction * step,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">ScrollFade</h1>
      <p class="text-text-sm text-text-subtle">
        Scroll indicator with fade edges and optional directional arrow buttons,
        used inside MenuList and other scrollable containers.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Side × Variant</h2>
      <div
        class="grid w-fit grid-cols-2 gap-8 rounded-12 border border-border-default bg-background-default p-6"
      >
        <div
          v-for="variant in SCROLL_FADE_VARIANTS"
          :key="variant"
          class="flex flex-col gap-6"
        >
          <p class="text-label-sm">on {{ variant }}</p>
          <div
            v-for="side in SCROLL_FADE_SIDES"
            :key="side"
            class="relative h-[118px] w-[114px]"
          >
            <AppScrollFade
              :side="side"
              :variant="variant"
              :label="SIDE_LABEL[side]"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Live — horizontal, on base</h2>
      <div
        class="rounded-12 border border-border-default bg-background-default p-6"
      >
        <div class="relative">
          <div
            ref="horizontalScroller"
            class="no-scrollbar flex gap-2 overflow-x-auto py-3"
          >
            <span
              v-for="chip in CHIPS"
              :key="chip"
              class="shrink-0 rounded-full bg-background-alternative px-4 py-2 text-text-sm"
            >
              {{ chip }}
            </span>
          </div>
          <AppScrollFade
            v-if="horizontalEdges.canScrollStart.value"
            side="left"
            :label="SIDE_LABEL.left"
            @click="scrollStep(horizontalScroller, 'x', -1)"
          />
          <AppScrollFade
            v-if="horizontalEdges.canScrollEnd.value"
            side="right"
            :label="SIDE_LABEL.right"
            @click="scrollStep(horizontalScroller, 'x', 1)"
          />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Live — vertical, on surface</h2>
      <div
        class="w-80 rounded-12 border border-border-default bg-background-alternative"
      >
        <div class="relative">
          <ul
            ref="verticalScroller"
            class="no-scrollbar h-80 overflow-y-auto px-4"
          >
            <li v-for="row in ROWS" :key="row" class="py-3 text-text-sm">
              {{ row }}
            </li>
          </ul>
          <AppScrollFade
            v-if="verticalEdges.canScrollStart.value"
            side="top"
            variant="surface"
            :label="SIDE_LABEL.top"
            @click="scrollStep(verticalScroller, 'y', -1)"
          />
          <AppScrollFade
            v-if="verticalEdges.canScrollEnd.value"
            side="bottom"
            variant="surface"
            :label="SIDE_LABEL.bottom"
            @click="scrollStep(verticalScroller, 'y', 1)"
          />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">showButton = false</h2>
      <div
        class="rounded-12 border border-border-default bg-background-default p-6"
      >
        <div class="relative">
          <div
            ref="fadeOnlyScroller"
            class="no-scrollbar flex gap-2 overflow-x-auto py-3"
          >
            <span
              v-for="chip in CHIPS"
              :key="chip"
              class="shrink-0 rounded-full bg-background-alternative px-4 py-2 text-text-sm"
            >
              {{ chip }}
            </span>
          </div>
          <AppScrollFade
            v-if="fadeOnlyEdges.canScrollStart.value"
            side="left"
            :show-button="false"
            :label="SIDE_LABEL.left"
          />
          <AppScrollFade
            v-if="fadeOnlyEdges.canScrollEnd.value"
            side="right"
            :show-button="false"
            :label="SIDE_LABEL.right"
          />
        </div>
      </div>
    </section>
  </div>
</template>
