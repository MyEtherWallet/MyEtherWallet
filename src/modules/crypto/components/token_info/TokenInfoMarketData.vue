<template>
  <div>
    <!-- Market Data -->
    <div
      v-if="isLoading"
      class="mx-3 xs:mx-6 md:mx-4 lg:mx-10 h-[308px] xs:h-[227px] animate-pulse bg-surface rounded-12 w-[60%]"
    ></div>
    <div
      v-else
      class="px-3 xs:px-6 md:px-4 md:px-4 lg:px-10 grid grid-cols-2 xs:grid-cols-3 gap-4 max-w-[700px]"
    >
      <div
        v-for="(item, index) in marketData"
        :key="index"
        class="flex flex-col py-2"
      >
        <p class="text-s-14 text-info mb-1">{{ item.label }}</p>
        <p class="text-s-16 font-medium">{{ item.value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { formatFiatValue } from '@/utils/numberFormatHelper'
import { type GetWebTokenInfo } from '@/mew_api/types'

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
