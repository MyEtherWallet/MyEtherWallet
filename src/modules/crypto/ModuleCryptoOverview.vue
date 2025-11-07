<template>
  <div class="grid grid-cols-12 w-full gap-5 2xl:gap-10 items-stretch mb-4">
    <div
      class="col-span-12 grid grid-cols-4 md:grid-cols-[140px_1fr_1fr_1fr_1fr] items-center justify-between gap-4 lg:gap-10 mb-5"
    >
      <h2
        class="col-span-4 md:col-span-1 text-s-16 md:text-s-20 font-bold md:ml-2 leading-p-120 min-w-[140px]"
      >
        Crypto Today
      </h2>
      <div class="border-l-1 border-grey-10 md:pl-2">
        <p
          class="text-s-8 md:text-s-11 text-info ml-2 uppercase tracking-sp-06 font-semibold"
        >
          Total Market Cap
        </p>
        <p
          v-if="data && !isLoading"
          class="text-s-12 md:text-s-16 font-semibold ml-2 leading-p-150"
        >
          ${{ formatFiatValue(data.marketCap).value }}
        </p>

        <div
          v-else
          class="animate-pulse bg-grey-10 rounded-full h-9 w-3/4"
        ></div>
      </div>
      <div class="border-l-1 border-grey-10 md:pl-2">
        <p
          class="text-s-8 md:text-s-11 text-info ml-2 uppercase tracking-sp-06 font-semibold"
        >
          24h Market Cap
        </p>
        <p
          v-if="data && !isLoading"
          class="text-s-12 md:text-s-16 font-semibold ml-2 leading-p-150"
          :class="{
            'text-error': randomNumber < 0,
            'text-success': randomNumber >= 0,
          }"
        >
          {{ formatPercentageValue(BigNumber(randomNumber).abs()).value }}
        </p>

        <div
          v-else
          class="animate-pulse bg-grey-10 rounded-full h-9 w-3/4"
        ></div>
      </div>
      <div class="border-l-1 border-grey-10 md:pl-2">
        <p
          class="text-s-8 md:text-s-11 text-info ml-2 uppercase tracking-sp-06 font-semibold"
        >
          24h Trading Volume
        </p>
        <p
          v-if="data && !isLoading"
          class="text-s-12 md:text-s-16 font-semibold ml-2 leading-p-150"
        >
          ${{ formatFiatValue(data.volume24h).value }}
        </p>
        <div
          v-else
          class="animate-pulse bg-grey-10 rounded-full h-9 w-3/4"
        ></div>
      </div>

      <div class="border-l-1 border-grey-10 md:pl-2">
        <p
          class="text-s-8 md:text-s-11 text-info ml-2 uppercase tracking-sp-06 font-semibold"
        >
          Total Market Cap
        </p>
        <p
          v-if="data && !isLoading"
          class="text-s-12 md:text-s-16 font-semibold ml-2 leading-p-150"
        >
          ${{ formatFiatValue(data.marketCap).value }}
        </p>

        <div
          v-else
          class="animate-pulse bg-grey-10 rounded-full h-9 w-3/4"
        ></div>
      </div>
    </div>
    <!-- NEW TOKENS -->
    <div class="col-span-12 lg:col-span-4">
      <div class="w-full flex items-center justify-between mb-2">
        <h2 class="text-s-20 font-bold ml-2">New Tokens</h2>
        <div class="flex">
          <app-btn-icon
            class=""
            :disabled="isLoading || currPageNewTokens === 1"
            label="previous page"
            @click="prevPageNewTokens"
          >
            <ChevronLeftIcon class="w-4 h-4" />
          </app-btn-icon>
          <app-btn-icon
            class=""
            :disabled="isLoading || currPageNewTokens >= totalPagesNewTokens"
            label="next page"
            @click="nextPageNewTokens"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </app-btn-icon>
        </div>
      </div>

      <div v-if="data && !isLoading" class="flex flex-col gap-2">
        <token-row
          v-for="token in paginatedNewTokensArray"
          :key="token.symbol"
          :token="token"
        />
      </div>
      <div v-else class="flex flex-col">
        <div
          v-for="n in 3"
          :key="n"
          class="h-[42px] my-2 animate-pulse bg-grey-10 rounded-full"
        ></div>
      </div>
    </div>
    <div class="w-full flex items-stretch flex-col col-span-12 lg:col-span-4">
      <module-trending />
    </div>
    <!-- RWA TOP Gainers-->
    <div class="w-full flex items-stretch flex-col col-span-12 lg:col-span-4">
      <div class="">
        <div class="w-full flex items-center justify-between mb-2">
          <h2 class="text-s-20 font-bold ml-2">RWA Top Gainers</h2>
          <div class="flex">
            <app-btn-icon
              class=""
              :disabled="isLoading || currPageGainersTokens === 1"
              label="previous page"
              @click="prevPageGainerTokens"
            >
              <ChevronLeftIcon class="w-4 h-4" />
            </app-btn-icon>
            <app-btn-icon
              class=""
              :disabled="
                isLoading || currPageGainersTokens >= totalPagesGainersTokens
              "
              label="next page"
              @click="nextPageGainersTokens"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </app-btn-icon>
          </div>
        </div>
        <h2 class="text-s-20 font-bold ml-2 mb-3"></h2>
        <div v-if="data && !isLoading" class="flex flex-col gap-2">
          <token-row
            v-for="token in paginatedGainersTokensArray"
            :key="token.symbol"
            :token="token"
          />
        </div>
        <div v-else class="flex flex-col">
          <div
            v-for="n in 3"
            :key="n"
            class="h-[42px] my-2 animate-pulse bg-grey-10 rounded-full"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import TokenRow from './components/overview/TokenRow.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { useToastStore } from '@/stores/toastStore'
import { ref } from 'vue'
import {
  formatPercentageValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import type { CryptoOverview, CryptoOverviewToken } from '@/mew_api/types'
import BigNumber from 'bignumber.js'
import ModuleTrending from '@/modules/crypto/ModuleTrending.vue'
import { usePaginate } from '@/composables/usePaginate'
const { useMEWFetch } = useFetchMewApi()
const toastStore = useToastStore()

const randomNumber = Math.random() * 200 - 100
const newTokens = ref<CryptoOverviewToken[]>([])
const gainersTokens = ref<CryptoOverviewToken[]>([])
const fetchUrl = 'https://mew-api-dev.ethvm.dev/v1/web/overview'
const {
  data,
  onFetchResponse,
  onFetchError,
  isFetching: isLoading,
} = useMEWFetch(fetchUrl).get().json<CryptoOverview>()

onFetchResponse(() => {
  if (data.value && data.value) {
    newTokens.value = data.value.newCoins
    gainersTokens.value = data.value.rwaTopGainers
  }
})

onFetchError(err => {
  toastStore.addToastMessage({
    text: err,
  })
})

const {
  currentPage: currPageNewTokens,
  paginatedArray: paginatedNewTokensArray,
  nextPage: nextPageNewTokens,
  prevPage: prevPageNewTokens,
  totalPages: totalPagesNewTokens,
} = usePaginate<CryptoOverviewToken>(newTokens, 3)

const {
  currentPage: currPageGainersTokens,
  paginatedArray: paginatedGainersTokensArray,
  nextPage: nextPageGainersTokens,
  prevPage: prevPageGainerTokens,
  totalPages: totalPagesGainersTokens,
} = usePaginate<CryptoOverviewToken>(gainersTokens, 3)
</script>
