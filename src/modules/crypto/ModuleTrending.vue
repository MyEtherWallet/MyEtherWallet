<template>
  <!-- Top: Trending -->
  <div>
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-s-20 font-bold ml-2">Trending</h2>

      <div class="flex">
        <app-btn-icon
          class=""
          :disabled="isLoading || page === 1"
          label="previous page"
          @click="previousPage"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </app-btn-icon>
        <app-btn-icon
          class=""
          :disabled="isLoading || page >= totalPages"
          label="next page"
          @click="nextPage"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </app-btn-icon>
      </div>
    </div>

    <div
      class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2"
      v-if="!isLoading"
    >
      <button
        v-for="token in currentTrendingTokens"
        :key="token.symbol"
        class="w-full bg-white shadow-button px-3 py-2 flex items-end justify-between rounded-16 hoverBGWhite gap-3"
      >
        <div class="flex gap-2 items-center justify-start flex-wrap">
          <div class="xs:basis-full overflow-visible">
            <!-- TODO: replace with token image component-->
            <img
              :src="token.logoUrl as string"
              class="w-7 h-7 xl:w-8 xl:h-8 rounded-full shadow-token"
              alt=""
            />
          </div>

          <div class="text-left">
            <p class="text-s-14 font-bold text-wrap">
              {{ token.name }}
            </p>
            <p class="text-s-12 text-info">
              {{ truncate(token.symbol, 6) }}
            </p>
          </div>
        </div>
        <div class="pl-2">
          <p class="text-s-14 text-right">
            ${{ formatFiatValue(token.price).value }}
          </p>
          <p
            class="text-s-12 text-right"
            :class="{
              'text-error': token.priceChangePercentage24h < 0,
              'text-success': token.priceChangePercentage24h >= 0,
            }"
          >
            {{ formatPercentageValue(token.priceChangePercentage24h).value }}
          </p>
        </div>
      </button>
    </div>
    <div class="flex justify-start gap-2 flex-wrap animate-pulse" v-else>
      <div
        v-for="token in 10"
        :key="`loading-trending-${token}`"
        class="basis-full bg-surface shadow-button px-3 py-2 flex items-end justify-between rounded-16 w-full h-[55px]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { useToastStore } from '@/stores/toastStore'
import { computed, onMounted, ref, type Ref, watch } from 'vue'
import {
  formatPercentageValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import type {
  GetWebTrendingTokensResponse,
  GetWebTrendingTokensResponseToken,
} from '@/mew_api/types'
import { truncate } from '@/utils/filters'
import BigNumber from 'bignumber.js'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'

const { useMEWFetch } = useFetchMewApi()
const toastStore = useToastStore()
const isLoading = ref(true)
const trendingTokens: Ref<GetWebTrendingTokensResponseToken[]> = ref([])

const apiPage = ref(1)
const apiTotalItems = ref(1)

// const pageStore: Map<string, GetWebTrendingTokensResponseToken[]> = new Map()

const url = computed(() => {
  return `https://mew-api-dev.ethvm.dev/v1/web/trending-tokens?page=${apiPage.value}&sort=desc&perPage=10`
})
const fetchUrl = url
const { execute, data, onFetchResponse, onFetchError } =
  useMEWFetch<GetWebTrendingTokensResponse>(fetchUrl, {
    immediate: false,
  })
    .get()
    .json()

onMounted(() => {
  isLoading.value = true
  execute()
})

onFetchResponse(() => {
  if (data.value && data.value.items) {
    apiTotalItems.value = data.value.total
    trendingTokens.value = [
      ...trendingTokens.value,
      ...data.value.items.map((token: GetWebTrendingTokensResponseToken) => {
        return {
          ...token,
          symbol: token.symbol.toUpperCase(),
        }
      }),
    ]
  }
  isLoading.value = false
})

onFetchError(err => {
  isLoading.value = false
  toastStore.addToastMessage({
    text: err,
  })
})

/** --------------------------
 * Pagination
 --------------------------*/
const { isMobile } = useAppBreakpoints()
const page = ref(1)

const totalPages = computed(() =>
  new BigNumber(apiTotalItems.value)
    .div(itemsPerPage.value)
    .integerValue(BigNumber.ROUND_CEIL)
    .toNumber(),
)
const itemsPerPage = computed(() => {
  if (isMobile.value) {
    return 4
  }
  return 6
})

const paginateArray = (page: number) => {
  const startIndex = (page - 1) * itemsPerPage.value
  const endIndex = page * itemsPerPage.value
  return trendingTokens.value.slice(startIndex, endIndex)
}

const currentTrendingTokens = computed(() => {
  return paginateArray(page.value)
})

const nextPage = () => {
  if (page.value < totalPages.value) {
    const nextPage = page.value + 1
    const nextItems = paginateArray(nextPage)
    if (
      nextItems.length === itemsPerPage.value ||
      nextPage === totalPages.value
    ) {
      page.value += 1
    } else {
      isLoading.value = true
      apiPage.value += 1
      execute().then(() => {
        page.value += 1
      })
    }
  }
}
const previousPage = () => {
  if (page.value > 1) {
    page.value -= 1
  }
}

watch(
  () => itemsPerPage.value,
  () => {
    if (page.value > totalPages.value) {
      page.value = totalPages.value
    }
  },
)
</script>
