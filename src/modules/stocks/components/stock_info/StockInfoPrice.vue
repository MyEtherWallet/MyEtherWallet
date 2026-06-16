<template>
  <!-- Description -->
  <div
    :class="[isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10', 'px-4 py-6']"
  >
    <div
      class="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-y lg:divide-y-0 divide-grey-10 gap-y-6"
    >
      <div class="lg:py-2 pr-6 pb-6 lg:pb-0">
        <h2
          class="basis-full xs:basis-auto font-bold text-s-20 xs:text-s-24 leading-p-150 mb-4 flex items-center"
        >
          <app-token-symbol
            v-if="data.primaryMarket?.symbol"
            :symbol="data.primaryMarket.symbol"
            is-stock
            class="text-s-20 xs:text-s-24 leading-p-150 mr-1 !font-bold"
          />
          Price
        </h2>
        <div
          class="grid grid-cols-1 xs:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-6"
        >
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              Open
            </p>
            <p class="text-s-16 font-medium">
              {{
                data.primaryMarket?.open24h
                  ? `$${formatFiatValue(data.primaryMarket.open24h).value}`
                  : '-'
              }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              24h High
            </p>
            <p class="text-s-16 font-medium">
              {{
                data.primaryMarket?.high24h
                  ? `$${formatFiatValue(data.primaryMarket.high24h).value}`
                  : '-'
              }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              24h Low
            </p>
            <p class="text-s-16 font-medium">
              {{
                data.primaryMarket?.low24h
                  ? `$${formatFiatValue(data.primaryMarket.low24h).value}`
                  : '-'
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="lg:py-2 pr-6 lg:px-6 lg:mt-0 lg:pb-0">
        <h3
          class="basis-full xs:basis-auto font-bold text-s-17 leading-p-150 mb-6"
        >
          Underlying Asset
        </h3>
        <div
          class="grid grid-cols-1 xs:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-6"
        >
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              Open
            </p>
            <p class="text-s-16 font-medium">
              {{
                data?.underlyingMarket?.open24h
                  ? `$${formatFiatValue(data.underlyingMarket.open24h).value}`
                  : '-'
              }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              24h High
            </p>
            <p class="text-s-16 font-medium capitalize">
              {{
                data?.underlyingMarket?.high24h
                  ? `$${formatFiatValue(data.underlyingMarket.high24h).value}`
                  : '-'
              }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              24h Low
            </p>
            <p class="text-s-16 font-medium">
              {{
                data?.underlyingMarket?.low24h
                  ? `$${formatFiatValue(data.underlyingMarket.low24h).value}`
                  : '-'
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppTokenSymbol from '@components/AppTokenSymbol.vue'
import { formatFiatValue } from '@/utils/numberFormatHelper'
import type { GetWebStocksInfoSummaryResponse } from '@/mew_api/types'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'

interface Props {
  data: GetWebStocksInfoSummaryResponse
}
defineProps<Props>()

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)
</script>
