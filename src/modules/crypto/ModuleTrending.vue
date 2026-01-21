<template>
  <!-- Top: Trending -->
  <OverviewContainer
    title="Trending"
    :current-page="page"
    :total-pages="totalPages"
    :is-loading="isLoading"
    @nextPage="nextPage"
    @previousPage="previousPage"
    class="col-span-12 lg:col-span-4"
  >
    <template #tokens>
      <div v-if="data && !isLoading" class="flex flex-col">
        <token-row
          v-for="(token, index) in currentTrendingTokens"
          :key="token.symbol + index"
          :token="token"
        />
      </div>
    </template>
  </OverviewContainer>
</template>

<script setup lang="ts">
import OverviewContainer from './components/overview/OverviewContainer.vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { useToastStore } from '@/stores/toastStore'
import { computed, onMounted, ref, type Ref } from 'vue'
import type {
  GetWebTrendingTokensResponse,
  GetWebTrendingTokensResponseToken,
} from '@/mew_api/types'
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
    apiTotalItems.value = data.value.pages
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
const page = ref(0)

const totalPages = computed(() => {
  return Math.ceil((data.value?.total || 0) / itemsPerPage.value)
})

const paginateArray = (page: number) => {
  const startIndex = page * itemsPerPage.value
  const endIndex = (page + 1) * itemsPerPage.value
  return trendingTokens.value.slice(startIndex, endIndex)
}

const currentTrendingTokens = computed(() => {
  return paginateArray(page.value)
})

const nextPage = () => {
  if (page.value + 1 < totalPages.value) {
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
  if (page.value > 0) {
    page.value -= 1
  }
}
</script>
