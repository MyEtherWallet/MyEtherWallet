<template>
  <div>
    <!-- Market Data -->
    <div
      v-if="isLoading"
      class="mx-3 xs:mx-6 md:mx-4 lg:mx-10 h-[308px] xs:h-[227px] animate-pulse bg-surface rounded-12 w-[60%]"
    ></div>
    <div
      v-else
      :class="[isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10', 'px-4 py-6']"
    >
      <h2
        class="basis-full xs:basis-auto font-bold text-s-20 xs:text-s-24 leading-p-150 mb-6 flex items-center"
      >
        Statistics
      </h2>
      <div
        class="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6"
      >
        <div
          v-for="(item, index) in marketData"
          :key="index"
          class="flex flex-col gap-1"
        >
          <p
            class="text-s-11 text-info uppercase tracking-sp-06 font-bold mb-2"
          >
            {{ item.label }}
          </p>
          <p class="text-s-16 font-medium">{{ item.value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { formatFiatValue } from '@/utils/numberFormatHelper'
import { type GetWebTokenInfo } from '@/mew_api/types'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
    default: true,
  },
  tokenData: {
    type: Object as PropType<GetWebTokenInfo | null>,
    required: false,
  },
})

/** --------------------
 * Market Data
 --------------------*/
interface Item {
  label: string
  value: string
}
const marketData = computed<Item[]>(() => {
  if (!props.tokenData) {
    return []
  }
  return [
    {
      label: 'Market Cap',
      value: props.tokenData.marketCap
        ? `$${formatFiatValue(props.tokenData.marketCap).value}`
        : '--',
    },

    {
      label: 'Total Supply',
      value: props.tokenData.totalSupply
        ? `$${formatFiatValue(props.tokenData.totalSupply).value}`
        : '--',
    },
    {
      label: 'Max Supply',
      value: props.tokenData.maxSupply
        ? `$${formatFiatValue(props.tokenData.maxSupply).value}`
        : '--',
    },

    {
      label: 'Circulating Supply',
      value: props.tokenData.circulatingSupply
        ? `$${formatFiatValue(props.tokenData.circulatingSupply).value}`
        : '--',
    },
    {
      label: 'Total Volume',
      value: props.tokenData.totalVolume
        ? `$${formatFiatValue(props.tokenData.totalVolume).value}`
        : '--',
    },
    {
      label: 'Fully Diluted Valuation',
      value: props.tokenData.fullyDilutedValuation
        ? `$${formatFiatValue(props.tokenData.fullyDilutedValuation).value}`
        : '--',
    },
    {
      label: '24h High',
      value: props.tokenData.high24h
        ? `$${formatFiatValue(props.tokenData.high24h).value}`
        : '--',
    },
    {
      label: '24h Low',
      value: props.tokenData.low24h
        ? `$${formatFiatValue(props.tokenData.low24h).value}`
        : '--',
    },
  ]
})
</script>
