<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ChartBarSquareIcon } from '@heroicons/vue/24/solid'
import { ROUTES_MAIN } from '@/router/routeNames'
import heroBannerBg from '@/assets/images/backgrounds/hero-banner-bg.jpg'

const { t } = useI18n()
const router = useRouter()

// Layered background: the image on top, a CSS gradient underneath as a fallback
// that shows if the image is missing / fails to load. Using a CSS background
// (instead of an absolutely-positioned <img> + z-indexed content) keeps the
// banner free of positioned children, so its content can never stack above the
// page header.
const bannerBackground = `url(${heroBannerBg}), linear-gradient(90deg, #e6ecff 0%, #ece7fb 48%, #dbe6ff 100%)`

const onTradeStocks = () => router.push({ name: ROUTES_MAIN.STOCKS.NAME })

// ponytail: "Learn more" target is TBD — final copy + destination (likely an
// external campaign/service) are pending, so leave a no-op placeholder.
const onLearnMore = () => {
  /* TODO(hero-banner): wire to the campaign / external service once defined */
}
</script>

<template>
  <div
    data-test="hero-banner"
    class="flex flex-wrap items-center gap-4 overflow-hidden rounded-2xl border border-white bg-cover bg-center bg-no-repeat p-4"
    :style="{ backgroundImage: bannerBackground }"
  >
    <ChartBarSquareIcon class="size-8 shrink-0 text-primary" />
    <div class="flex min-w-0 flex-1 flex-col">
      <p
        class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
      >
        {{ t('homePage.hero.banner.title') }}
      </p>
      <p class="text-s-14 leading-5 text-black">
        {{ t('homePage.hero.banner.subtitle') }}
      </p>
    </div>
    <div class="flex shrink-0 items-center gap-2">
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
