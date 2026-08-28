<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PlusIcon, CheckIcon } from '@heroicons/vue/20/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import type { RecommendedAsset } from './watchlistOnboarding'
import cluster1 from '@/assets/images/watchlist/market-stocks-1.png'
import cluster2 from '@/assets/images/watchlist/market-crypto-1.png'
import cluster3 from '@/assets/images/watchlist/market-crypto-2.png'
import cluster4 from '@/assets/images/watchlist/market-crypto-3.png'
import cluster5 from '@/assets/images/watchlist/market-stocks-2.png'

const { t } = useI18n()

// Decorative fading avatar cluster for the "Finding assets…" loading state
// (Figma: symmetric, biggest + fully opaque in the centre, fading outward).
const LOADING_CLUSTER = [
  { src: cluster1, size: 'size-4', opacity: 'opacity-30' },
  { src: cluster2, size: 'size-8', opacity: 'opacity-60' },
  { src: cluster3, size: 'size-12', opacity: 'opacity-100' },
  { src: cluster4, size: 'size-8', opacity: 'opacity-60' },
  { src: cluster5, size: 'size-4', opacity: 'opacity-30' },
]

defineProps<{
  assets: RecommendedAsset[]
  isLoading: boolean
}>()

// Selected asset ids. Done enables with at least one.
const selected = defineModel<string[]>({ required: true })

defineEmits<{ done: [] }>()

const toggle = (id: string) => {
  selected.value = selected.value.includes(id)
    ? selected.value.filter(x => x !== id)
    : [...selected.value, id]
}
</script>

<template>
  <div data-test="watchlist-step-assets">
    <!-- Loading (Figma: fading avatar cluster + "Finding assets…"). -->
    <div
      v-if="isLoading"
      data-test="assets-loading"
      class="flex min-h-[380px] flex-col items-center justify-center gap-8 text-center"
    >
      <div class="flex animate-pulse items-center" aria-hidden="true">
        <img
          v-for="(avatar, i) in LOADING_CLUSTER"
          :key="i"
          :src="avatar.src"
          alt=""
          class="rounded-full border-2 border-white object-contain"
          :class="[avatar.size, avatar.opacity, i > 0 ? '-ml-2' : '']"
        />
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-s-24 font-bold leading-[26px] text-black">
          {{ t('homePage.hero.watchlist.onboarding.assets.loadingTitle') }}
        </p>
        <p class="text-s-16 text-[#575757]">
          {{ t('homePage.hero.watchlist.onboarding.assets.loadingSubtitle') }}
        </p>
      </div>
    </div>

    <!-- Results -->
    <div v-else>
      <h2 class="text-s-24 font-bold text-black">
        {{ t('homePage.hero.watchlist.onboarding.assets.title') }}
      </h2>
      <p class="mt-1 text-s-16 text-[#575757]">
        {{ t('homePage.hero.watchlist.onboarding.assets.subtitle') }}
      </p>

      <div class="mt-6 grid grid-cols-4 gap-2">
        <button
          v-for="asset in assets"
          :key="asset.id"
          type="button"
          data-test="asset-card"
          :aria-pressed="selected.includes(asset.id)"
          class="relative flex h-[108px] flex-col items-center justify-center rounded-2xl border-2 transition-colors"
          :class="
            selected.includes(asset.id) ? 'border-black' : 'border-transparent'
          "
          @click="toggle(asset.id)"
        >
          <span
            class="absolute left-2 top-3 flex size-5 items-center justify-center rounded-full"
            :class="
              selected.includes(asset.id)
                ? 'bg-success text-white'
                : 'bg-[#e6e6e6] text-black'
            "
            aria-hidden="true"
          >
            <CheckIcon v-if="selected.includes(asset.id)" class="size-4" />
            <PlusIcon v-else class="size-4" />
          </span>
          <AppTokenLogo
            :url="asset.logoUrl"
            :symbol="asset.symbol"
            :is-stock="asset.type === 'stock'"
            width="w-10"
            height="h-10"
          />
          <span class="mt-2 text-s-14 text-black">{{ asset.symbol }}</span>
        </button>
      </div>

      <div class="mt-4 flex items-center justify-end gap-4">
        <span class="text-s-14 text-[#575757]">
          {{
            t('homePage.hero.watchlist.onboarding.assets.selected', {
              count: selected.length,
            })
          }}
        </span>
        <AppBaseButton
          data-test="assets-done"
          :disabled="!selected.length"
          @click="$emit('done')"
        >
          {{ t('homePage.hero.watchlist.onboarding.assets.done') }}
        </AppBaseButton>
      </div>
    </div>
  </div>
</template>
