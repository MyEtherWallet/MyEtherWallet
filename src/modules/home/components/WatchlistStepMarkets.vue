<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ArrowRightIcon } from '@heroicons/vue/20/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { WATCHLIST_MARKETS } from './watchlistOnboarding'

const { t } = useI18n()

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
    <h2 class="text-s-24 font-bold text-black">
      {{ t('homePage.hero.watchlist.title') }}
    </h2>
    <p class="mt-1 text-s-16 text-[#575757]">
      {{ t('homePage.hero.watchlist.onboarding.markets.subtitle') }}
    </p>

    <div class="mt-6 grid grid-cols-3 gap-4">
      <button
        v-for="market in WATCHLIST_MARKETS"
        :key="market.id"
        type="button"
        data-test="market-card"
        :aria-pressed="selected.includes(market.id)"
        class="relative flex h-[128px] flex-col justify-between rounded-2xl border-2 p-4 text-left transition-colors"
        :class="
          selected.includes(market.id)
            ? 'border-black bg-white'
            : 'border-transparent bg-[#f5f5f5]'
        "
        @click="toggle(market.id)"
      >
        <span class="text-s-16 font-bold text-black">
          {{ t(`homePage.hero.watchlist.onboarding.marketLabels.${market.labelKey}`) }}
        </span>
        <!-- Decorative asset cluster (real per-market logos are a later polish). -->
        <span class="flex items-center" aria-hidden="true">
          <span class="size-6 rounded-full bg-[#dcdcdc]" />
          <span class="-ml-2 size-6 rounded-full bg-[#cfcfcf]" />
          <span class="-ml-2 size-6 rounded-full bg-[#c2c2c2]" />
        </span>
      </button>
    </div>

    <div class="mt-8 flex items-center justify-between">
      <span class="text-s-14 text-[#575757]">
        {{ t('homePage.hero.watchlist.onboarding.markets.hint') }}
      </span>
      <AppBaseButton
        data-test="markets-continue"
        :disabled="!selected.length"
        @click="$emit('continue')"
      >
        <span class="flex items-center gap-2">
          {{ t('homePage.hero.watchlist.onboarding.continue') }}
          <ArrowRightIcon class="size-5" />
        </span>
      </AppBaseButton>
    </div>
  </div>
</template>
