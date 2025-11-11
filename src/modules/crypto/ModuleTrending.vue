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

    <div class="grid grid-cols-1 gap-2" v-if="!isLoading">
      <div v-for="token in currentTrendingTokens" :key="token.symbol">
        <token-row :token="token" />
      </div>
    </div>
    <div class="grid grid-cols-1 gap-2 animate-pulse" v-else>
      <div
        v-for="token in 3"
        :key="`loading-trending-${token}`"
        å
        class="basis-full bg-grey-10 flex items-end justify-between rounded-16 w-full h-[55px]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { useToastStore } from '@/stores/toastStore'
import { computed, onMounted, ref, type Ref } from 'vue'
import type {
  GetWebTrendingTokensResponse,
  GetWebTrendingTokensResponseToken,
} from '@/mew_api/types'
import BigNumber from 'bignumber.js'
import TokenRow from './components/overview/TokenRow.vue'

const { useMEWFetch } = useFetchMewApi()
const toastStore = useToastStore()
const isLoading = ref(true)
const trendingTokens: Ref<GetWebTrendingTokensResponseToken[]> = ref([])

const apiPage = ref(1)
const apiTotalItems = ref(1)

const url = computed(() => {
  return `https://mew-api-dev.ethvm.dev/v1/web/trending-tokens?page=${apiPage.value}&sort=desc&perPage=10`
})
const fetchUrl = url
const { execute, data, onFetchResponse, onFetchError } = useMEWFetch(fetchUrl, {
  immediate: false,
})
  .get()
  .json<GetWebTrendingTokensResponse>()

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
const itemsPerPage = ref(3)
const page = ref(1)

const totalPages = computed(() =>
  new BigNumber(apiTotalItems.value)
    .div(itemsPerPage.value)
    .integerValue(BigNumber.ROUND_CEIL)
    .toNumber(),
)

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
</script>
