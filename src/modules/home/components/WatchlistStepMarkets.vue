<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
import WatchlistStepHeader from './WatchlistStepHeader.vue'
import WatchlistSelectableCard from './WatchlistSelectableCard.vue'
import { WATCHLIST_MARKETS, type WatchlistMarketId } from './watchlistOnboarding'
import stocks1 from '@/assets/images/watchlist/market-stocks-1.png'
import stocks2 from '@/assets/images/watchlist/market-stocks-2.png'
import stocks3 from '@/assets/images/watchlist/market-stocks-3.png'
import crypto1 from '@/assets/images/watchlist/market-crypto-1.png'
import crypto2 from '@/assets/images/watchlist/market-crypto-2.png'
import crypto3 from '@/assets/images/watchlist/market-crypto-3.png'

const { t } = useI18n()

// Decorative overlapping logo clusters per market (exported from Figma).
const MARKET_LOGOS: Record<WatchlistMarketId, string[]> = {
  stocks: [stocks1, stocks2, stocks3],
  crypto: [crypto1, crypto2, crypto3],
}

// Selected market ids (multi-select). Continue enables with at least one.
const selected = defineModel<string[]>({ required: true })

defineEmits<{ continue: []; skip: []; close: [] }>()

const toggle = (id: string) => {
  selected.value = selected.value.includes(id)
    ? selected.value.filter(x => x !== id)
    : [...selected.value, id]
}
</script>

<template>
  <div data-test="watchlist-step-markets">
    <WatchlistStepHeader
      :step="1"
      :title="t('homePage.hero.watchlist.onboarding.markets.subtitle')"
      :description="t('homePage.hero.watchlist.onboarding.markets.description')"
      @close="$emit('close')"
    />

    <div class="mt-6 grid grid-cols-2 gap-3">
      <WatchlistSelectableCard
        v-for="market in WATCHLIST_MARKETS"
        :key="market.id"
        data-test="market-card"
        :selected="selected.includes(market.id)"
        class="relative flex h-[120px] flex-col justify-between p-4"
        @toggle="toggle(market.id)"
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
      </WatchlistSelectableCard>
    </div>

    <div class="mt-6 flex items-center justify-end gap-4">
      <button
        type="button"
        data-test="markets-skip"
        class="hoverNoBG rounded-full px-4 py-3 text-s-16 font-semibold text-primary"
        @click="$emit('skip')"
      >
        {{ t('homePage.hero.watchlist.onboarding.skip') }}
      </button>
      <AppBaseButton
        data-test="markets-continue"
        :disabled="!selected.length"
        :style="
          !selected.length
            ? {
                backgroundColor: 'var(--color-primary) !important',
                opacity: 0.4,
                cursor: 'default',
              }
            : undefined
        "
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
