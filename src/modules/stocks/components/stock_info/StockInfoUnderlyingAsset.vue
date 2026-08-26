<template>
  <div
    :class="[isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10', 'px-4 py-6']"
  >
    <h2
      class="basis-full xs:basis-auto font-bold text-s-20 xs:text-s-24 leading-p-150 mb-6 flex items-center"
    >
      {{ $t('stocks.underlying_asset') }}
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
              {{ $t('stocks.name') }}
            </p>
            <p class="text-s-16 font-medium">
              {{ asset?.name || '-' }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              {{ $t('stocks.ticker') }}
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
            {{ $t('stocks.historical_price') }}
          </h3>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              {{ $t('stocks.fifty_two_w_high') }}
            </p>
            <p class="text-s-16 font-medium">
              {{ currencySymbol
              }}{{ asset ? formatFiat(asset.priceHigh52w).value : '-' }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              {{ $t('stocks.fifty_two_w_low') }}
            </p>
            <p class="text-s-16 font-medium">
              {{ currencySymbol
              }}{{ asset ? formatFiat(asset.priceLow52w).value : '-' }}
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
          {{ $t('stocks.statistics') }}
        </h3>
        <div class="grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-6">
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              {{ $t('stocks.twenty_four_h_volume') }}
            </p>
            <p class="text-s-16 font-medium">
              {{ asset ? formatFiat(asset.volume24h).value : '-' }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              {{ $t('stocks.avg_volume') }}
            </p>
            <p class="text-s-16 font-medium">
              {{ asset ? formatFiat(asset.averageVolume).value : '-' }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              {{ $t('stocks.market_cap') }}
            </p>
            <p class="text-s-16 font-medium">
              {{ asset ? formatFiat(asset.marketCap).value : '-' }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              {{ $t('stocks.shares_outstanding') }}
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
          {{ $t('stocks.dividends') }}
        </h3>
        <div class="grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-6">
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              {{ $t('stocks.dividend_yield') }}
            </p>
            <p class="text-s-16 font-medium">
              {{ dividendYieldFormatted }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              {{ $t('stocks.payout_frequency') }}
            </p>
            <p class="text-s-16 font-medium capitalize">
              {{ dividends?.payoutFrequency || '-' }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              {{ $t('stocks.last_amount') }}
            </p>
            <p class="text-s-16 font-medium">
              {{ lastAmountFormatted }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-s-11 text-info uppercase tracking-sp-06 font-bold">
              {{ $t('stocks.last_payment_date') }}
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
  formatIntegerValue,
  formatPercentageValue,
} from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import BigNumber from 'bignumber.js'
import type { StockUnderlyingAsset, StockDividends } from '@/mew_api/types'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'

const { formatFiat, currencySymbol } = useCurrency()

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
  return '-'
})

const dividendYieldFormatted = computed(() => {
  if (props.dividends?.dividendYield) {
    return formatPercentageValue(props.dividends.dividendYield).value + '%'
  }
  return '-'
})

const lastAmountFormatted = computed(() => {
  if (props.dividends?.lastCashAmount) {
    return formatFiat(props.dividends.lastCashAmount).display
  }
  return '-'
})
</script>
