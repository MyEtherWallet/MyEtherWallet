<script setup lang="ts">
// Preview for the Pagination design-library component (MEW-2447) at
// /dev/pagination. Matches Figma set 1074:3108: each variant on its surface,
// in both breakpoints. Breakpoint is a container query on the pager's width
// (48rem), so the Mobile cells sit in a narrow wrapper; the Default cells need
// a window of ~1120px or more to clear 48rem next to the dev sidebar.
import { computed, ref } from 'vue'
import AppPagination from '@/components/pagination/AppPagination.vue'
import type { PaginationVariant } from '@/components/pagination/types'

const VARIANTS: { variant: PaginationVariant; label: string; page: string }[] =
  [
    {
      variant: 'default',
      label: 'Variant: on default — grey surface',
      page: 'bg-background-default',
    },
    {
      variant: 'alternative',
      label: 'Variant: on alternative — white surface',
      page: 'bg-background-alternative',
    },
  ]
const BREAKPOINTS = [
  { name: 'Default', width: 'w-full' },
  { name: 'Mobile', width: 'max-w-sm' },
]

const PER_PAGE = 3
const ITEMS = Array.from({ length: 9 }, (_, i) => `Item ${i + 1}`)
const page = ref(1)
const pageItems = computed(() =>
  ITEMS.slice((page.value - 1) * PER_PAGE, page.value * PER_PAGE),
)

const variantPages = ref<Record<PaginationVariant, number>>({
  default: 1,
  alternative: 1,
})
const singlePage = ref(1)
const customPage = ref(2)
const customLabel = (p: number, total: number) => `${p} / ${total}`
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Pagination</h1>
      <p class="text-text-sm text-text-subtle">
        Navigation control that lets users move between pages of a long list or
        table using previous/next icon buttons.
      </p>
    </header>

    <section v-for="v in VARIANTS" :key="v.variant" class="flex flex-col gap-4">
      <h2 class="text-label-base">{{ v.label }}</h2>
      <div
        class="flex flex-col gap-8 rounded-12 border border-border-default p-6"
        :class="v.page"
      >
        <div
          v-for="b in BREAKPOINTS"
          :key="b.name"
          class="flex flex-col gap-2"
          :class="b.width"
        >
          <p class="text-text-sm text-text-subtle">Breakpoint: {{ b.name }}</p>
          <AppPagination
            v-model="variantPages[v.variant]"
            :total-pages="3"
            :variant="v.variant"
          />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Live: 3-page list</h2>
      <div
        class="rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <ul class="mb-4">
          <li v-for="item in pageItems" :key="item" class="py-3 text-text-sm">
            {{ item }}
          </li>
        </ul>
        <AppPagination
          v-model="page"
          :total-pages="ITEMS.length / PER_PAGE"
          variant="alternative"
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Single page (both disabled)</h2>
      <div
        class="rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <AppPagination
          v-model="singlePage"
          :total-pages="1"
          variant="alternative"
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Custom label</h2>
      <div
        class="rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <AppPagination
          v-model="customPage"
          :total-pages="5"
          variant="alternative"
          :label="customLabel"
        />
      </div>
    </section>
  </div>
</template>
