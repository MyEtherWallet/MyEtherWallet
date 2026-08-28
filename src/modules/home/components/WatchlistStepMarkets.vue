<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { WATCHLIST_MARKETS, type WatchlistMarketId } from './watchlistOnboarding'
import stocks1 from '@/assets/images/watchlist/market-stocks-1.png'
import stocks2 from '@/assets/images/watchlist/market-stocks-2.png'
import stocks3 from '@/assets/images/watchlist/market-stocks-3.png'
import crypto1 from '@/assets/images/watchlist/market-crypto-1.png'
import crypto2 from '@/assets/images/watchlist/market-crypto-2.png'
import crypto3 from '@/assets/images/watchlist/market-crypto-3.png'
import perps1 from '@/assets/images/watchlist/market-perps-1.png'
import perps2 from '@/assets/images/watchlist/market-perps-2.png'
import perps3 from '@/assets/images/watchlist/market-perps-3.png'

const { t } = useI18n()

// Decorative overlapping logo clusters per market (exported from Figma).
const MARKET_LOGOS: Record<WatchlistMarketId, string[]> = {
  stocks: [stocks1, stocks2, stocks3],
  crypto: [crypto1, crypto2, crypto3],
  perps: [perps1, perps2, perps3],
}

// Selected market ids (multi-select). Continue enables with at least one.
const selected = defineModel<string[]>({ required: true })

defineEmits<{ continue: [] }>()

const toggle = (id: string) => {
  selected.value = selected.value.includes(id)
    ? selected.value.filter(x => x !== id)
    : [...selected.value, id]
}
</script>

<template>
  <div data-test="watchlist-step-markets">
    <p class="text-s-20 font-normal text-[#575757]">
      {{ t('homePage.hero.watchlist.title') }}
    </p>
    <h2 class="mt-1 text-s-20 font-bold text-black">
      {{ t('homePage.hero.watchlist.onboarding.markets.subtitle') }}
    </h2>

    <div class="mt-12 grid grid-cols-3 gap-3">
      <button
        v-for="market in WATCHLIST_MARKETS"
        :key="market.id"
        type="button"
        data-test="market-card"
        :aria-pressed="selected.includes(market.id)"
        class="relative flex h-[120px] flex-col justify-between rounded-2xl border-2 p-4 text-left transition-colors"
        :class="
          selected.includes(market.id)
            ? 'border-black bg-white'
            : 'border-transparent bg-[#f5f5f5]'
        "
        @click="toggle(market.id)"
      >
        <span class="text-s-16 font-semibold text-black">
          {{ t(`homePage.hero.watchlist.onboarding.marketLabels.${market.labelKey}`) }}
        </span>
        <!-- Overlapping round asset avatars (Figma logos, 24px with card-bg ring). -->
        <span class="flex items-center" aria-hidden="true">
          <img
            v-for="(logo, i) in MARKET_LOGOS[market.id]"
            :key="i"
            :src="logo"
            alt=""
            class="size-6 rounded-full border"
            :class="[
              i > 0 ? '-ml-2' : '',
              selected.includes(market.id) ? 'border-white' : 'border-[#f5f5f5]',
            ]"
          />
        </span>
      </button>
    </div>

    <div class="mt-12 flex items-center justify-end">
      <AppBaseButton
        data-test="markets-continue"
        :disabled="!selected.length"
        @click="$emit('continue')"
      >
        <span class="flex items-center gap-2">
          {{ t('homePage.hero.watchlist.onboarding.continue') }}
          <ChevronRightIcon class="size-5" />
        </span>
      </AppBaseButton>
    </div>
  </div>
</template>
