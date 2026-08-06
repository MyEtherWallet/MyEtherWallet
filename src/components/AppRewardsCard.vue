<script setup lang="ts">
import { computed, type Component } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import type { RouteLocationRaw } from 'vue-router'
import gradientPurple from '@/assets/images/home/offers/gradient-purple.png'
import gradientBlue from '@/assets/images/home/offers/gradient-blue.png'
import gradientGreen from '@/assets/images/home/offers/gradient-green.png'

const props = withDefaults(
  defineProps<{
    title: string
    highlight?: string
    category?: string
    icon?: Component
    gradient?: 'purple' | 'blue' | 'green'
    to?: RouteLocationRaw
  }>(),
  { gradient: 'purple' },
)

// Colored gradient background image per card variant.
const GRADIENT_SRC: Record<'purple' | 'blue' | 'green', string> = {
  purple: gradientPurple,
  blue: gradientBlue,
  green: gradientGreen,
}
const gradientSrc = computed(() => GRADIENT_SRC[props.gradient])

// Renders as a link when `to` is set, otherwise a real button so consumers
// can wire a click action (e.g. open a side-drawer module) accessibly.
const tag = computed(() => (props.to ? 'RouterLink' : 'button'))
</script>

<template>
  <component
    :is="tag"
    :to="props.to"
    :type="props.to ? undefined : 'button'"
    data-test="rewards-card"
    class="group relative flex h-[230px] w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-white p-5 text-left"
  >
    <!-- colored gradient background (per-card variant) -->
    <img
      :src="gradientSrc"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 size-full object-cover object-right-top"
    />

    <!-- category chip -->
    <div v-if="category || icon" class="relative flex items-center gap-2">
      <component :is="icon" v-if="icon" class="size-8 shrink-0 text-primary" />
      <span
        v-if="category"
        data-test="rewards-category"
        class="text-s-12 font-semibold tracking-[-0.24px] text-primary"
        >{{ category }}</span
      >
    </div>

    <!-- headline + chevron -->
    <div class="relative flex items-end gap-4">
      <div
        class="flex min-w-0 flex-1 flex-col gap-1 text-s-28 font-bold leading-8 tracking-[-0.84px]"
      >
        <p data-test="rewards-title" class="text-black">{{ title }}</p>
        <p v-if="highlight" data-test="rewards-highlight" class="text-primary">
          {{ highlight }}
        </p>
      </div>
      <span
        class="flex shrink-0 items-center rounded-full p-2 transition-colors group-hover:bg-grey-5"
      >
        <ChevronRightIcon class="size-6 text-primary" />
      </span>
    </div>
  </component>
</template>
