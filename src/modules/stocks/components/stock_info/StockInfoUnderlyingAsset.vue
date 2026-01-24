<template>
  <div
    class=""
    :class="[isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10', 'px-4 py-6']"
  >
    <h2
      class="basis-full xs:basis-auto font-bold text-s-20 leading-p-150 mb-6 flex items-center"
    >
      Underlying Asset
    </h2>
    <!-- Underlying Asset Info -->
    <div>
      <div
        class="grid grid-cols-1 lg:grid-cols-2 mt-3 lg:divide-x divide-y lg:divide-y-0 divide-grey-10 lg:pb-6"
      >
        <div
          class="grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-6 pb-6 lg:py-2"
        >
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              Name
            </p>
            <p class="text-s-16 font-medium">
              {{ asset?.name || '-' }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              Ticker
            </p>
            <p class="text-s-16 font-medium">
              {{ asset?.ticker || '-' }}
            </p>
          </div>
        </div>
        <div
          class="grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-6 py-6 lg:py-2 lg:px-6"
        >
          <h3
            class="xs:col-span-2 lg:hidden basis-full xs:basis-auto font-bold text-s-17 leading-p-150"
          >
            Historical Price
          </h3>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              52W High
            </p>
            <p class="text-s-16 font-medium">
              ${{ asset ? formatFiatValue(asset.priceHigh52w).value : '-' }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              52W Low
            </p>
            <p class="text-s-16 font-medium">
              ${{ asset ? formatFiatValue(asset.priceLow52w).value : '-' }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <hr class="border-grey-10 mb-6" />

    <div
      class="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-y lg:divide-y-0 divide-grey-10 gap-y-6"
    >
      <div class="lg:py-2 pr-6 pb-6 lg:pb-0">
        <h3
          class="basis-full xs:basis-auto font-bold text-s-17 leading-p-150 mb-6"
        >
          Statistics
        </h3>
        <div class="grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-6">
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              24h Volume
            </p>
            <p class="text-s-16 font-medium">
              {{ asset ? formatFiatValue(asset.volume24h).value : '-' }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              Avg Volume
            </p>
            <p class="text-s-16 font-medium">
              {{ asset ? formatFiatValue(asset.averageVolume).value : '-' }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              Market Cap
            </p>
            <p class="text-s-16 font-medium">
              {{ asset ? formatFiatValue(asset.marketCap).value : '-' }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              Shares Outstanding
            </p>
            <p class="text-s-16 font-medium">
              {{ sharesOutstandingFormatted }}
            </p>
          </div>
        </div>
      </div>
      <div class="lg:py-2 pr-6 lg:px-6 lg:mt-0 lg:pb-0">
        <h3
          class="basis-full xs:basis-auto font-bold text-s-17 leading-p-150 mb-6"
        >
          Dividends
        </h3>
        <div class="grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-6">
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              Dividend Yield
            </p>
            <p class="text-s-16 font-medium">
              {{ dividendYieldFormatted }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              Payout Frequency
            </p>
            <p class="text-s-16 font-medium capitalize">
              {{ dividends?.payoutFrequency || '-' }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              Last Amount
            </p>
            <p class="text-s-16 font-medium">
              {{ lastAmountFormatted }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              Last Payment Date
            </p>
            <p class="text-s-16 font-medium">
              {{ dividends?.lastPaymentDate || '-' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  formatFiatValue,
  formatIntegerValue,
  formatPercentageValue,
} from '@/utils/numberFormatHelper'
import BigNumber from 'bignumber.js'
import type { StockUnderlyingAsset, StockDividends } from '@/mew_api/types'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)

/** ----------------
 * Props
 ------------------*/
interface Props {
  asset?: StockUnderlyingAsset
  dividends?: StockDividends
}
const props = defineProps<Props>()

const sharesOutstandingFormatted = computed(() => {
  if (props.asset?.sharesOutstanding) {
    const shares = new BigNumber(props.asset?.sharesOutstanding).toFixed(0)
    return formatIntegerValue(new BigNumber(shares)).value
  }
  return ''
})

const dividendYieldFormatted = computed(() => {
  if (props.dividends?.dividendYield) {
    return formatPercentageValue(props.dividends.dividendYield).value + '%'
  }
  return '-'
})

const lastAmountFormatted = computed(() => {
  if (props.dividends?.lastCashAmount) {
    return '$' + formatFiatValue(props.dividends.lastCashAmount).value
  }
  return '-'
})
</script>
