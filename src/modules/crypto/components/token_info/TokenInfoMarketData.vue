<template>
  <div>
    <!-- Market Data -->
    <div
      v-if="isLoading"
      :class="[
        isOpenSideMenu ? 'lg:mx-6 2xl:mx-10' : 'lg:mx-10',
        'mx-4 my-6 h-[308px] xs:h-[227px] animate-pulse bg-surface rounded-12 w-[90%]',
      ]"
    ></div>
    <div
      v-else
      :class="[isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10', 'px-4 py-6']"
    >
      <h2
        class="basis-full xs:basis-auto font-bold text-s-20 xs:text-s-24 leading-p-150 mb-6 flex items-center"
      >
        {{ $t('crypto.statistics') }}
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
import { useCurrency } from '@/composables/useCurrency'
import { type GetWebTokenInfo } from '@/mew_api/types'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { formatFiat } = useCurrency()

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
      label: t('crypto.market_cap'),
      value: props.tokenData.marketCap
        ? formatFiat(props.tokenData.marketCap).display
        : '--',
    },

    {
      label: t('crypto.total_supply'),
      value: props.tokenData.totalSupply
        ? formatFiat(props.tokenData.totalSupply).display
        : '--',
    },
    {
      label: t('crypto.max_supply'),
      value: props.tokenData.maxSupply
        ? formatFiat(props.tokenData.maxSupply).display
        : '--',
    },

    {
      label: t('crypto.circulating_supply'),
      value: props.tokenData.circulatingSupply
        ? formatFiat(props.tokenData.circulatingSupply).display
        : '--',
    },
    {
      label: t('crypto.total_volume'),
      value: props.tokenData.totalVolume
        ? formatFiat(props.tokenData.totalVolume).display
        : '--',
    },
    {
      label: t('crypto.fully_diluted_valuation'),
      value: props.tokenData.fullyDilutedValuation
        ? formatFiat(props.tokenData.fullyDilutedValuation).display
        : '--',
    },
    {
      label: t('crypto.twenty_four_h_high'),
      value: props.tokenData.high24h
        ? formatFiat(props.tokenData.high24h).display
        : '--',
    },
    {
      label: t('crypto.twenty_four_h_low'),
      value: props.tokenData.low24h
        ? formatFiat(props.tokenData.low24h).display
        : '--',
    },
  ]
})
</script>
