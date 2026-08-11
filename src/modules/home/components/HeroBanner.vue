<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ChartBarSquareIcon } from '@heroicons/vue/24/solid'
import { ROUTES_MAIN } from '@/router/routeNames'
import heroBannerBg from '@/assets/images/backgrounds/hero-banner-bg.jpg'

const { t } = useI18n()
const router = useRouter()

// Fall back to the CSS gradient if the background image fails to load.
const imgFailed = ref(false)

const onTradeStocks = () => router.push({ name: ROUTES_MAIN.STOCKS.NAME })

// ponytail: "Learn more" target is TBD — this banner is not shipped yet (hidden
// behind SHOW_HERO_TRADE_BANNER in HomeHero). Final copy + destination (likely
// an external campaign/service) are pending, so leave a no-op placeholder.
const onLearnMore = () => {
  /* TODO(hero-banner): wire to the campaign / external service once defined */
}
</script>

<template>
  <div
    data-test="hero-banner"
    class="relative flex flex-wrap items-center gap-4 overflow-hidden rounded-2xl border border-white p-4"
  >
    <!-- CSS gradient fallback (shows when the image is absent/fails to load) -->
    <div
      class="absolute inset-0 bg-[linear-gradient(90deg,#e6ecff_0%,#ece7fb_48%,#dbe6ff_100%)]"
      aria-hidden="true"
    />
    <img
      v-show="!imgFailed"
      :src="heroBannerBg"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 size-full object-cover"
      @error="imgFailed = true"
    />

    <ChartBarSquareIcon class="relative z-10 size-8 shrink-0 text-primary" />
    <div class="relative z-10 flex min-w-0 flex-1 flex-col">
      <p
        class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
      >
        {{ t('homePage.hero.banner.title') }}
      </p>
      <p class="text-s-14 leading-5 text-black">
        {{ t('homePage.hero.banner.subtitle') }}
      </p>
    </div>
    <div class="relative z-10 flex shrink-0 items-center gap-2">
      <button
        type="button"
        data-test="hero-banner-learn"
        class="h-10 rounded-3xl px-3 text-s-14 font-semibold tracking-[-0.28px] text-primary"
        @click="onLearnMore"
      >
        {{ t('homePage.hero.banner.learnMore') }}
      </button>
      <button
        type="button"
        data-test="hero-banner-trade"
        class="h-10 rounded-3xl bg-white px-3 text-s-14 font-semibold tracking-[-0.28px] text-primary"
        @click="onTradeStocks"
      >
        {{ t('homePage.hero.banner.tradeStocks') }}
      </button>
    </div>
  </div>
</template>
