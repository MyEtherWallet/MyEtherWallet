<script setup lang="ts">
// Gallery for the Tooltip design-library component (MEW-2272), reachable at
// /dev/tooltip via the design-library shell — see routesDefault.ts. Lets us
// eyeball the four placements, text / slot / text+slot content, the max-width
// wrap and the edge auto-flip against Figma (node 2279-37377). Hover or
// Tab to a trigger to show its tooltip.
import AppTooltip from '@/components/tooltip/AppTooltip.vue'
import AppChip from '@/components/chip/AppChip.vue'
import type { TooltipPlacement } from '@/components/tooltip/types'

const PLACEMENTS: TooltipPlacement[] = ['top', 'bottom', 'left', 'right']
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Tooltip</h1>
      <p class="text-s-14 text-text-subtle">
        Small contextual overlay shown on hover or focus. Hover or Tab to a
        trigger to show its tooltip.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Placements</h2>
      <div
        class="flex flex-wrap gap-10 rounded-12 border border-border-default p-16"
      >
        <AppTooltip
          v-for="p in PLACEMENTS"
          :key="p"
          :placement="p"
          :text="`Tooltip ${p}`"
        >
          <AppChip :label="p" />
        </AppTooltip>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">
        Pinned for inspection (click to open, click again to close)
      </h2>
      <div
        class="flex flex-wrap gap-x-36 gap-y-28 rounded-12 border border-border-default p-16"
      >
        <AppTooltip
          v-for="p in PLACEMENTS"
          :key="p"
          :placement="p"
          :trigger="['click']"
          :text="`Tooltip ${p}`"
        >
          <AppChip :label="p" />
        </AppTooltip>
        <AppTooltip
          :trigger="['click']"
          text="A longer tooltip message that keeps going until it wraps at the maximum width of the bubble."
        >
          <AppChip label="Long text" />
        </AppTooltip>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Content</h2>
      <div
        class="flex flex-wrap gap-10 rounded-12 border border-border-default p-16"
      >
        <AppTooltip text="Text only">
          <AppChip label="Text" />
        </AppTooltip>

        <AppTooltip>
          <template #content>
            <span class="font-bold text-text-inverted">Custom slot</span>
          </template>
          <AppChip label="Slot only" />
        </AppTooltip>

        <AppTooltip text="With text">
          <template #content>
            <span class="font-bold text-text-inverted">★</span>
          </template>
          <AppChip label="Text + slot" />
        </AppTooltip>

        <AppTooltip
          text="A longer tooltip message that keeps going until it wraps at the maximum width of the bubble."
        >
          <AppChip label="Long text" />
        </AppTooltip>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">
        Auto-flip (resize or scroll so a trigger nears an edge)
      </h2>
      <div
        class="flex justify-between rounded-12 border border-border-default p-4"
      >
        <AppTooltip placement="left" text="Flips to the right near the edge">
          <AppChip label="Left" />
        </AppTooltip>
        <AppTooltip placement="right" text="Flips to the left near the edge">
          <AppChip label="Right" />
        </AppTooltip>
      </div>
    </section>
  </div>
</template>
