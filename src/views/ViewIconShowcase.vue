<script setup lang="ts">
// Gallery for the Icon design-library component (MEW-2359), reachable at
// /dev/icons via the design-library shell — see routesDefault.ts. Renders the
// whole registry so we can eyeball every glyph across the two variants and the
// seven sizes against Figma (🗂️ Icons, 4159:108945). Toggle stroke/filled and
// pick a size to re-render the grid; the size row shows one glyph at all sizes.
// A glyph with only one variant falls back, so nothing renders blank.
import { computed, ref } from 'vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import {
  ICON_NAMES,
  ICON_SIZES,
  type IconName,
  type IconSize,
} from '@/components/icon/icons'

const variant = ref<'stroke' | 'filled'>('stroke')
const size = ref<IconSize>('m')
const query = ref('')

const SIZE_NAMES = Object.keys(ICON_SIZES) as IconSize[]

const filtered = computed<IconName[]>(() => {
  const q = query.value.trim().toLowerCase()
  return q ? ICON_NAMES.filter(n => n.includes(q)) : ICON_NAMES
})

// A representative glyph that ships both variants, for the size scale.
const SAMPLE: IconName = 'wallet'
</script>

<template>
  <div class="p-8 flex flex-col gap-10 max-w-5xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Icon</h1>
      <p class="text-s-14 text-info">
        {{ ICON_NAMES.length }} glyphs, stroke and filled, at seven sizes. Color
        comes from the parent via <code>currentColor</code>.
      </p>
    </header>

    <!-- Controls -->
    <section
      class="flex flex-wrap items-center gap-6 rounded-12 border border-grey-10 bg-white p-4"
    >
      <div class="flex items-center gap-2">
        <span class="text-s-12 font-bold uppercase text-info tracking-sp-06">
          Variant
        </span>
        <button
          v-for="v in ['stroke', 'filled'] as const"
          :key="v"
          type="button"
          class="rounded-8 px-3 py-1.5 text-s-14 capitalize hoverNoBG"
          :class="
            variant === v
              ? 'bg-grey-10 font-medium text-t-default'
              : 'text-info'
          "
          @click="variant = v"
        >
          {{ v }}
        </button>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-s-12 font-bold uppercase text-info tracking-sp-06">
          Size
        </span>
        <button
          v-for="s in SIZE_NAMES"
          :key="s"
          type="button"
          class="rounded-8 px-2.5 py-1.5 text-s-14 uppercase hoverNoBG"
          :class="
            size === s ? 'bg-grey-10 font-medium text-t-default' : 'text-info'
          "
          @click="size = s"
        >
          {{ s }}
        </button>
      </div>

      <input
        v-model="query"
        type="search"
        aria-label="Filter icons by name"
        placeholder="Filter by name…"
        class="ml-auto w-56 rounded-8 border border-grey-10 px-3 py-1.5 text-s-14 outline-none focus:border-primary"
      />
    </section>

    <!-- Size scale -->
    <section class="flex flex-col gap-3">
      <h2 class="text-s-16 font-semibold">Sizes</h2>
      <div
        class="flex flex-wrap items-end gap-8 rounded-12 border border-grey-10 bg-white p-6 text-t-default"
      >
        <div
          v-for="s in SIZE_NAMES"
          :key="s"
          class="flex flex-col items-center gap-2"
        >
          <AppIcon :name="SAMPLE" :size="s" :variant="variant" />
          <span class="text-s-11 uppercase text-info">
            {{ s }} · {{ ICON_SIZES[s] }}
          </span>
        </div>
      </div>
    </section>

    <!-- Full grid -->
    <section class="flex flex-col gap-3">
      <h2 class="text-s-16 font-semibold">
        All icons
        <span class="font-normal text-info">({{ filtered.length }})</span>
      </h2>
      <div
        class="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 text-t-default"
      >
        <div
          v-for="name in filtered"
          :key="name"
          class="flex flex-col items-center gap-2 rounded-8 border border-grey-10 p-3 hoverNoBG"
          :title="name"
        >
          <div class="flex h-8 items-center">
            <AppIcon :name="name" :size="size" :variant="variant" />
          </div>
          <span class="w-full truncate text-center text-s-11 text-info">
            {{ name }}
          </span>
        </div>
      </div>
      <p v-if="!filtered.length" class="text-s-14 text-info">
        No icon matches “{{ query }}”.
      </p>
    </section>
  </div>
</template>
