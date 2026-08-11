<template>
  <div
    class="relative overflow-hidden rounded-2xl flex flex-col justify-between block mt-[32px] cursor-pointer"
    @click="openSpaceX"
  >
    <img
      src="@/assets/images/newly-added/background.png"
      class="absolute inset-0 w-full h-full object-cover"
      alt=""
      aria-hidden="true"
    />
    <div class="absolute right-0 bottom-0 flex items-end">
      <div class="relative">
        <img
          src="@/assets/images/newly-added/mars.png"
          class="w-40 sm:w-56 lg:w-[8.5rem] min-[1050px]:w-36 h-auto translate-y-4 translate-x-5"
          alt=""
          aria-hidden="true"
        />
        <img
          src="@/assets/images/newly-added/spacex.svg"
          :class="isOpenSideMenu ? 'min-[1270px]:max-[1380px]:hidden' : ''"
          class="absolute inset-0 w-full h-full object-contain object-right p-5 pr-0"
          alt="SpaceX"
        />
      </div>
    </div>
    <div
      class="relative z-10 p-5 flex flex-col justify-between min-h-[160px] sm:min-h-[200px] lg:min-h-[244px]"
    >
      <div>
        <p
          class="text-fg-on-fill font-bold text-lg sm:text-xl lg:text-lg leading-snug"
        >
          {{ $t('common.new_stock_added') }}
        </p>
        <p class="text-white/70 text-sm sm:text-base lg:text-sm mt-0.5">
          {{ $t('common.spcx_live') }}
        </p>
      </div>
      <app-base-button
        class="mt-4 bg-surface text-fg! text-sm font-medium py-2 px-5 rounded-full self-start hover:bg-white/90 transition-colors"
        @click="openSpaceX"
      >
        {{ $t('common.trade_today') }}
      </app-base-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBaseButton from '@/components/AppBaseButton.vue'
import { STOCK_INFO_ROUTE_NAMES } from '@/router/routeNames'
import { analytics, StockMarketEvent } from '@/analytics'
import { useRouter } from 'vue-router'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)

const router = useRouter()

const openSpaceX = () => {
  analytics.trackStockMarketClickStockEvent(StockMarketEvent.CLICK_STOCK, {
    location: 'spacex_annoucement_banner',
    stockName: 'SpaceX',
    stockSymbol: 'SPCXon',
  })
  router.push({
    name: STOCK_INFO_ROUTE_NAMES.stocks,
    params: { symbol: 'SPCXon' },
  })
}
</script>
