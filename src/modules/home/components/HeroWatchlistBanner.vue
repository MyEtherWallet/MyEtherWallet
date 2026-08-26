<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import stockSpot from '@/assets/images/watchlist/stock-spot.png'
import stockIbm from '@/assets/images/watchlist/stock-ibm.png'
import stockNke from '@/assets/images/watchlist/stock-nke.png'
import stockLly from '@/assets/images/watchlist/stock-lly.png'

const { t } = useI18n()

defineEmits<{
  // Starts the "build your watchlist" onboarding flow. The flow itself is not
  // built yet, so the parent handles this as a placeholder for now.
  begin: []
}>()

// Decorative sample stock logos (SPOT / IBM / NKE / LLY), exported from Figma.
// SPOT is intentionally clipped — it fades out under the white gradient at the
// left edge (matches the design).
</script>

<template>
  <div
    data-test="hero-watchlist-banner"
    class="relative flex items-center justify-between overflow-hidden rounded-2xl bg-white py-6 pr-6"
  >
    <div class="flex min-w-0 flex-1 items-center gap-6">
      <!-- Overlapping stock logos (SPOT clipped at the left, under the fade) -->
      <div class="flex shrink-0 items-center">
        <img
          :src="stockSpot"
          alt=""
          aria-hidden="true"
          data-test="stock-avatar"
          class="h-10 w-auto shrink-0 object-contain"
        />
        <img
          :src="stockIbm"
          alt=""
          aria-hidden="true"
          data-test="stock-avatar"
          class="-ml-3 size-10 shrink-0"
        />
        <img
          :src="stockNke"
          alt=""
          aria-hidden="true"
          data-test="stock-avatar"
          class="-ml-3 size-10 shrink-0"
        />
        <img
          :src="stockLly"
          alt=""
          aria-hidden="true"
          data-test="stock-avatar"
          class="-ml-3 size-10 shrink-0"
        />
      </div>
      <div class="flex min-w-0 flex-col gap-1">
        <p
          class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black"
        >
          {{ t('homePage.hero.watchlist.title') }}
        </p>
        <p class="text-s-16 leading-[22px] text-[#575757]">
          {{ t('homePage.hero.watchlist.subtitle') }}
        </p>
      </div>
    </div>

    <button
      type="button"
      data-test="hero-watchlist-begin"
      class="flex h-12 shrink-0 items-center gap-1 rounded-3xl px-4 text-s-16 font-semibold tracking-[-0.32px] text-black"
      @click="$emit('begin')"
    >
      {{ t('homePage.hero.watchlist.begin') }}
      <ChevronRightIcon class="size-[22px]" />
    </button>

    <!-- White fade on the left edge (over the avatars), per Figma. -->
    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-[104px] bg-gradient-to-l from-transparent to-white"
      aria-hidden="true"
    />
  </div>
</template>
