<template>
  <div id="oip" ref="section" class="relative my-4">
    <div class="ml-4">
      <h2
        data-test="section-title"
        class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black"
      >
        {{ t('stocks.oip_title') }}
      </h2>
      <p class="mt-2 text-s-16 leading-[22px] text-[#575757] max-w-[600px]">
        {{ t('stocks.oip_description') }}
        <a
          href="https://ondo.finance//intelligent-portfolios"
          class="px-1 text-black font-medium hover:underline inline-flex items-center gap-1"
          >{{ t('stocks.oip_learn_more') }}
          <ArrowRightIcon class="size-[22px]" />
        </a>
      </p>
    </div>
    <div class="relative mt-6">
      <AppSlideGroup ref="slideGroup" :total-items="items.length" edge-nav>
        <template v-for="(it, index) in items" :key="it.key" #[`item-${index}`]>
          <OipCard
            :logo="it.logo"
            :symbol="it.symbol"
            :name="it.name"
            :price="it.price"
            :description="it.description"
            :col-one-label="t('stocks.category')"
            :col-one="it.category"
            :col-two-label="t('stocks.provider')"
            :col-two="it.modelProvider"
            :col-three-label="t('stocks.ytd')"
            :col-three="it.change"
            :favorite="it.favorite"
            :trade-label="it.ctaLabel"
            @select="router.push(it.to)"
            @trade="onTrade(it)"
            @toggle-favorite="
              watchlistStore.setWatchlistItem(it.favoriteId, true)
            "
          />
        </template>
      </AppSlideGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router'
import { useStocksStore } from '@/stores/stocksStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useCurrency } from '@/composables/useCurrency'
import { STOCK_INFO_ROUTE_NAMES } from '@/router/routeNames'
import AppSlideGroup from '@/components/app_slide_group/AppSlideGroup.vue'
import OipCard from './components/OipCard.vue'
import { ArrowRightIcon } from '@heroicons/vue/20/solid'

// Shape the OIP listings map onto for the card. The stats row shows what the
// OIP payload carries (category / YTD / model provider) — there is no market
// cap or 24h volume for a portfolio token.
interface OipCardItem {
  key: string
  symbol: string
  name?: string
  price?: string
  description?: string
  category: string
  change?: number
  modelProvider: string
  logo?: string
  favorite: boolean
  favoriteId: string
  ctaLabel: string
  to: RouteLocationRaw
}

// The OIP payload's category is a closed set from the API — map it onto a
// translated label and fall back to the raw value if the API adds a new one.
const CATEGORY_KEYS: Record<string, string> = {
  Thematic: 'stocks.oip_category_thematic',
  Income: 'stocks.oip_category_income',
  Allocation: 'stocks.oip_category_allocation',
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const stocksStore = useStocksStore()
const walletMenu = useWalletMenuStore()
const watchlistStore = useWatchlistStore()
const { formatFiat } = useCurrency()

// Section-only fetch — the stocks overview is triggered by ViewStocks.
onMounted(stocksStore.fetchStocksOips)

// The home Industry Sectors tile links here as /stocks#oip. The app scrolls an
// inner overflow-y-auto wrapper rather than the window (TheAppLayout.vue), so
// the router's scrollBehavior can't reach this — bring the section into view
// ourselves, the same way PerpsPagination does.
const section = ref<HTMLElement | null>(null)
onMounted(async () => {
  if (route.hash !== '#oip') return
  await nextTick()
  const el = section.value
  if (!el) return
  // Offset for the fixed app header (TheHeader.vue: h-[68px] sm:h-[76px]).
  const headerHeight = window.innerWidth >= 640 ? 76 : 68
  el.style.scrollMarginTop = `${headerHeight + 12}px`
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

const items = computed<OipCardItem[]>(() => {
  return stocksStore.oips.map(item => ({
    key: item.symbol,
    name: item.name ?? undefined,
    symbol: item.symbol,
    price: item.price ? formatFiat(item.price).display : undefined,
    description: item.description,
    category: CATEGORY_KEYS[item.category]
      ? t(CATEGORY_KEYS[item.category])
      : item.category,
    change: item.ytdChangePct ?? undefined,
    modelProvider: item.modelProvider,
    logo: item.iconPngUrl || item.iconSvgUrl || undefined,
    favorite: watchlistStore.isWatchListed(item.symbol),
    favoriteId: item.symbol,

    ctaLabel: t('homePage.listings.trade'),
    to: {
      name: STOCK_INFO_ROUTE_NAMES.stocks,
      params: { symbol: item.symbol },
    },
  }))
})

// Open the wallet drawer with the portfolio token preselected. The Trade panel
// restores its "to" token from selectedTradeTokenSymbol — set that first (same
// as ViewStockInfo / the stocks & balance tables).
const onTrade = (it: OipCardItem) => {
  walletMenu.setSelectedTradeTokenSymbol(it.symbol)
  walletMenu.openPanel('trade')
}
</script>
