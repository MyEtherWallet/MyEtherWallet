<script setup lang="ts">
// Gallery for the Button Icon design-library component (MEW-2397), reachable at
// /dev/btn-icon via the design-library shell — see routesDefault.ts. Compare
// against Figma 82:15271 (Style × State) and 1519:7534 (sizes). Hover, pressed
// and focus are native CSS: hover a button, press it, or Tab to it. Disabled is
// shown statically.
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import {
  BTN_ICON_SIZE,
  BTN_ICON_VARIANT_CLASS,
  type BtnIconSize,
  type BtnIconVariant,
} from '@/components/btnIconTypes'

const VARIANTS = Object.keys(BTN_ICON_VARIANT_CLASS) as BtnIconVariant[]
const SIZES = Object.keys(BTN_ICON_SIZE) as BtnIconSize[]
// Contrast styles are for dark surfaces only, so each panel shows just the
// styles built for it.
const CONTRAST = VARIANTS.filter(v => v.endsWith('contrast'))
const LIGHT = VARIANTS.filter(v => !CONTRAST.includes(v))
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Button Icon</h1>
      <p class="text-s-14 text-text-subtle">
        Icon-only interactive button used for compact actions where a label is
        not needed. Hover, press, or Tab to a button to see the hover, pressed
        and focus states.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Style × State</h2>
      <div
        class="flex flex-col gap-4 rounded-12 border border-border-default bg-white p-6"
      >
        <div v-for="v in LIGHT" :key="v" class="flex items-center gap-8">
          <span class="w-36 text-s-14 font-medium">{{ v }}</span>
          <AppBtnIcon :variant="v" icon="x-mark" :label="`${v} default`" />
          <AppBtnIcon
            :variant="v"
            icon="x-mark"
            :label="`${v} disabled`"
            disabled
          />
        </div>
      </div>
      <div
        class="flex flex-col gap-4 rounded-12 bg-background-contrast-default p-6"
      >
        <div v-for="v in CONTRAST" :key="v" class="flex items-center gap-8">
          <span class="w-36 text-s-14 font-medium text-white">{{ v }}</span>
          <AppBtnIcon :variant="v" icon="x-mark" :label="`${v} default`" />
          <AppBtnIcon
            :variant="v"
            icon="x-mark"
            :label="`${v} disabled`"
            disabled
          />
        </div>
      </div>
      <p class="text-s-12 text-text-subtle">
        Columns: default (interactive) · disabled.
      </p>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Sizes</h2>
      <div
        class="flex items-end gap-8 rounded-12 border border-border-default bg-white p-6"
      >
        <div
          v-for="s in SIZES"
          :key="s"
          class="flex flex-col items-center gap-2"
        >
          <AppBtnIcon
            :size="s"
            variant="filled"
            icon="chevron-left"
            :label="`size ${s}`"
          />
          <span class="text-s-12 text-text-subtle">
            {{ s.toUpperCase() }}
          </span>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">
        Slot escape hatch (custom artwork)
      </h2>
      <div
        class="flex items-center gap-4 rounded-12 border border-border-default bg-white p-6"
      >
        <AppBtnIcon label="Custom svg">
          <svg viewBox="0 0 24 24" class="size-6" aria-hidden="true">
            <circle cx="12" cy="12" r="8" fill="currentColor" />
          </svg>
        </AppBtnIcon>
        <AppBtnIcon
          icon="arrow-top-right-on-square"
          label="External link"
          href="https://www.myetherwallet.com"
        />
      </div>
    </section>
  </div>
</template>
