<template>
  <!-- Top: Trending -->
  <div>
    <h2 class="text-s-20 mb-3">Trending Tokens</h2>
    <div class="flex justify-start gap-3 flex-wrap" v-if="!isLoading">
      <div
        v-for="token in trendingTokens"
        :key="token.symbol"
        class="bg-grey-5 w-[115px] h-[100px] shadow-md gap-2 p-4 mt-2 mr-1 flex flex-col bg-white rounded-2xl"
      >
        <div class="flex gap-1 items-center justify-between">
          <img :src="token.logoUrl" class="w-6 h-6 rounded-full" alt="" />
          <span
            class="text-s-18"
            :class="{
              'text-error': token.priceChangePercentage24h < 0,
              'text-success': token.priceChangePercentage24h >= 0,
            }"
            >{{
              formatPercentageValue(token.priceChangePercentage24h).value
            }}</span
          >
        </div>
        <div class="flex flex-col">
          <span class="text-s-18">{{ token.symbol }}</span>
          <span class="text-s-14 text-grey-30 truncate w-[90px]">{{
            token.name
          }}</span>
        </div>
      </div>
    </div>
    <div class="flex justify-start gap-3 flex-wrap animate-pulse" v-else>
      <div
        v-for="token in 10"
        :key="`loading-trending-${token}`"
        class="bg-grey-5 w-[115px] h-[100px] shadow-md gap-2 p-4 mt-2 mr-1 flex flex-col bg-white rounded-2xl"
      >
        <div class="flex gap-1 items-center justify-between">
          <div class="size-8 rounded-full bg-grey-8"></div>
          <div class="col-span-2 h-6 w-full rounded bg-grey-8"></div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="col-span-2 h-4 w-full rounded bg-grey-8"></div>
          <div class="col-span-2 h-4 w-full rounded bg-grey-8"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { useToastStore } from '@/stores/toastStore'
import { onMounted, ref, type Ref } from 'vue'
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import type { GetWebTrendingTokensResponse } from '@/mew_api/types'

const { useMEWFetch } = useFetchMewApi()
const toastStore = useToastStore()
const isLoading = ref(false)
const trendingTokens: Ref<GetWebTrendingTokensResponse['items']> = ref([])

const fetchUrl =
  'https://mew-api-dev.ethvm.dev/v1/web/trending-tokens?page=1&sort=desc'
const { execute, data, onFetchResponse, onFetchError } = useMEWFetch(fetchUrl, {
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
    trendingTokens.value = data.value.items.map(
      (token: GetWebTrendingTokensResponse['items'][number]) => {
        return {
          ...token,
          name: token.name.toUpperCase(),
          symbol: token.symbol.toUpperCase(),
        }
      },
    )
  }
  isLoading.value = false
})

onFetchError(err => {
  isLoading.value = false
  toastStore.addToastMessage({
    text: err,
  })
})
</script>
