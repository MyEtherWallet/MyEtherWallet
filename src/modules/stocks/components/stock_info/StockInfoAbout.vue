<template>
  <!-- Description -->
  <div
    :class="[isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10', 'px-4 py-6']"
  >
    <div
      class="grid grid-cols-1 lg:grid-cols-4 lg:divide-x divide-line gap-y-6"
    >
      <div
        class="py-1 lg:py-2"
        :class="
          isOpenSideMenu
            ? 'lg:col-span-2 2xl:col-span-3 pr-6'
            : 'lg:col-span-3 lg:pr-10'
        "
      >
        <h2
          class="basis-full xs:basis-auto font-bold text-s-20 xs:text-s-24 leading-p-150 mb-4 flex items-center"
        >
          {{ $t('stocks.about') }}
          <app-token-symbol
            v-if="data.primaryMarket"
            :symbol="data.primaryMarket?.symbol"
            is-stock
            class="!font-bold !text-s-20 xs:!text-s-24 leading-p-150 ml-1"
          />
        </h2>
        <p class="text-s-14 text-fg-subtle leading-p-150">
          {{ data.description }}
        </p>
      </div>
      <div
        class="col-span-1 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-6 !justify-start !items-start lg:px-6 lg:py-2 mt-6 lg:mt-0"
        :class="
          isOpenSideMenu ? 'lg:col-span-2 2xl:col-span-1' : 'lg:col-span-1'
        "
      >
        <div class="xs:col-span-2 lg:col-span-1">
          <p
            class="text-s-11 text-fg-subtle uppercase tracking-sp-06 font-bold mb-2"
          >
            {{ $t('stocks.category') }}
          </p>
          <div
            v-if="
              data.metadata &&
              (data.metadata.assetClass || data.metadata.instrumentType)
            "
            class="flex gap-3 items-center -ml-1 flex-wrap"
          >
            <div
              v-if="data.metadata.assetClass"
              class="bg-brand-subtle rounded-full px-4 py-1 text-brand font-semibold text-s-14"
            >
              {{ data.metadata.assetClass }}
            </div>
            <div
              v-if="data.metadata.instrumentType"
              class="bg-brand-subtle rounded-full px-4 py-1 text-brand font-semibold text-s-14"
            >
              {{ data.metadata.instrumentType }}
            </div>
          </div>
          <p v-else class="text-s-16 font-medium">-</p>
        </div>
        <div class="col-span-1">
          <p
            class="text-s-11 text-fg-subtle uppercase tracking-sp-06 font-bold mb-1"
          >
            {{ $t('stocks.shares_per_token') }}
          </p>
          <p
            class="text-s-16 font-medium"
            v-if="data.primaryMarket && data.stockAlias"
          >
            1 {{ data.primaryMarket?.symbol }} =
            {{
              formatFloatingPointValue(data.primaryMarket?.sharesMultiplier)
                .value
            }}
            {{ data.stockAlias }}
          </p>
          <p v-else class="text-s-16 font-medium">-</p>
        </div>
        <div>
          <p
            class="text-s-11 text-fg-subtle uppercase tracking-sp-06 font-bold mb-1"
          >
            {{ $t('stocks.total_holders') }}
          </p>
          <p class="text-s-16 font-medium">
            {{
              data.primaryMarket
                ? formatIntegerValue(data.primaryMarket?.totalHolders).value
                : '-'
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import {
  formatFloatingPointValue,
  formatIntegerValue,
} from '@/utils/numberFormatHelper'
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
