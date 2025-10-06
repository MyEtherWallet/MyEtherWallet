<template>
  <div class="flex flex-col mb-10">
    <div
      class="flex items-center justify-end gap-3 mt-2 sm:mt-4 mb-2 mr-[60px]"
    >
      <!--TODO: add link-->
      <app-btn-icon label="Share" :disabled="isLoading">
        <share-icon class="h-5 w-5" />
      </app-btn-icon>
      <app-btn-icon label="Star" :disabled="isLoading">
        <star-solid-icon v-if="isWatchlisted" class="h-5 w-5" />
        <star-outline-icon v-else class="h-5 w-5" />
      </app-btn-icon>
    </div>
    <!-- Token logo, name, price, price change -->
    <div
      v-if="isLoading || tokenData === null"
      class="mx-3 xs:mx-6 md:mx-4 lg:mx-10 h-[64px] xs:h-[80px] lg:h-[65px] animate-pulse bg-surface rounded-12 w-[60%]"
    ></div>
    <div v-else class="flex items-center gap-4 px-3 xs:px-6 md:px-4 lg:px-10">
      <div class="relative">
        <app-token-logo
          :url="tokenData.iconUrl"
          :symbol="tokenData.symbol"
          width="w-10 xs:w-[56px]"
          height="h-10 xs:h-[56px]"
        />
        <app-token-logo
          v-if="selectedChain && existsOnCurrentChain"
          :url="selectedChain.icon"
          :symbol="selectedChain.name"
          width="w-5"
          height="h-5"
          class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
        />
      </div>

      <div class="flex flex-col">
        <h1 class="text-s-20 xs:text-s-24 leading-p-110 font-bold">
          {{ tokenData.name }} ({{ tokenData.symbol.toUpperCase() }})
          <span
            v-if="existsOnCurrentChain"
            class="text-s-17 hidden lg:inline-block font-medium uppercase text-info mr-1 tracking-sp-06"
          >
            on {{ selectedChain?.name }}
          </span>
        </h1>
        <div>
          <p class="text-s-20 xs:text-s-24 inline">
            ${{
              tokenData.currentPrice
                ? formatFiatValue(tokenData.currentPrice).value
                : '--'
            }}
          </p>
          <div
            v-if="tokenData.priceChangePercentage24h"
            class="inline-block ml-2"
          >
            <ArrowTrendingDownIcon
              v-if="tokenData.priceChangePercentage24h < 0"
              class="w-4 h-4 inline-block text-error"
            />
            <ArrowTrendingUpIcon
              v-else
              class="w-4 h-4 inline-block text-success"
            />
            <span
              :class="[
                {
                  'text-success': tokenData.priceChangePercentage24h >= 0,
                  'text-error': tokenData.priceChangePercentage24h < 0,
                },
                'ml-1 text-s-14 xs:text-s-17 ',
              ]"
            >
              {{ tokenData.priceChangePercentage24h.toFixed(2) }}%
            </span>
          </div>
        </div>
      </div>
    </div>
    <p
      v-if="!isLoading && existsOnCurrentChain"
      class="text-s-8 xs:text-s-11 tracking-sp-06 lg:hidden font-bold uppercase text-info px-3 xs:px-6 ml-[58px] xs:ml-[74px] md:ml-[66px]"
    >
      on {{ selectedChain?.name }}
    </p>
    <hr class="h-px bg-grey-10 border-0 w-full my-3 xs:mt-5" />
    <!-- Chart and balance -->
    <div
      class="flex flex-col px-3 xs:px-6 md:px-4 md:px-4 lg:px-10 gap-3 sm:gap-4"
    >
      <div class="w-full mb-2 sm:mb-5">
        <token-info-chart :token-id="tokenId" />
      </div>
    </div>
    <!-- Balance -->
    <token-info-balance :is-loading="isLoading" :token-data="tokenData" />
    <hr
      v-if="!isLoading && isWalletConnected"
      class="h-px bg-grey-10 border-0 w-full my-5"
    />
    <!-- Market Data -->
    <token-info-market-data :is-loading="isLoading" :token-data="tokenData" />
    <!-- <hr class="h-px bg-grey-10 border-0 w-full my-5" /> -->
    <!-- About -->
    <!-- <div v-if="!isLoading" class="px-3 xs:px-6 md:px-4 md:px-4 lg:px-10">
          <h3 class="text-s-20 font-bold mb-2">
            About {{ tokenData?.name || tokenId }}
          </h3>
          <p class="text-s-14 text-info max-w-[700px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div> -->
    <!-- Supported Chains -->
    <token-info-supported-chains
      :is-loading="isLoading"
      :token-data="tokenData"
    />
  </div>
</template>

<script setup lang="ts">
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import TokenInfoMarketData from './components/token_info/TokenInfoMarketData.vue'
import TokenInfoSupportedChains from './components/token_info/TokenInfoSupportedChains.vue'
import TokenInfoChart from './components/token_info/TokenInfoChart.vue'
import { ShareIcon, StarIcon as StarSolidIcon } from '@heroicons/vue/24/solid'
import {
  StarIcon as StarOutlineIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'
import { formatFiatValue } from '@/utils/numberFormatHelper'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { type GetWebTokenInfo } from '@/mew_api/types'
import { useWalletStore } from '@/stores/walletStore'
import TokenInfoBalance from './components/token_info/TokenInfoBalance.vue'
const props = defineProps({
  tokenId: {
    type: String,
    required: true,
  },
})

const walletStore = useWalletStore()
const { walletAddress, isWalletConnected } = storeToRefs(walletStore)
/** --------------------
 * Wallet Menu Buttons
 --------------------*/
const walletMenu = useWalletMenuStore()

/** --------------------
 * Fetch Data
 --------------------*/
const endpoint = computed(() => {
  const wallet =
    isWalletConnected.value && walletAddress.value
      ? `?evmAddresses=${walletAddress.value}`
      : ''
  return `/v1/web/pages/token-info/coins/${props.tokenId}${wallet}`
})
const isLoadedData = ref(false)

const { useMEWFetch } = useFetchMewApi()
const { data: tokenData, onFetchResponse } = useMEWFetch(endpoint)
  .get()
  .json<GetWebTokenInfo>()

const isLoading = computed(() => {
  return !isLoadedData.value
})
onFetchResponse(() => {
  if (tokenData.value === null) {
    return
  }
  if (!existsOnCurrentChain.value) {
    walletMenu.setWalletPanel('bridge')
  } else {
    walletMenu.setWalletPanel('swap')
  }
  isLoadedData.value = true
})

/** --------------------
 * Balances
 --------------------*/
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

const existsOnCurrentChain = computed(() => {
  if (tokenData.value && selectedChain.value) {
    return tokenData.value.supportedChains.some(
      chain => chain.chainName === selectedChain.value?.name,
    )
  }
  return false
})

/**
 * TEMP DATA FOR UI
 */

const isWatchlisted = ref(true)
</script>
