<template>
  <section class="rounded-2xl p-2 shadow-sm bg-white">
    <div class="flex justify-between items-center pb-2">
      <h2 class="text-s-18 font-bold">
        Top {{ props.losers ? 'Losers' : 'Gainers' }}
      </h2>
      <p class="text-grey-30 text-s-12">{{ timeAgo }}</p>
    </div>
    <div class="gap-2 flex-column" v-if="!isLoading && topGainers.length > 0">
      <div
        v-for="(m, i) in topGainers"
        :key="i"
        class="rounded-xl border border-2 px-2 mb-2 py-1 bg-white border-grey-light shadow-md relative flex justify-between items-center"
      >
        <div class="flex items-center gap-2">
          <img :src="m.logoUrl as string" class="w-6 h-6 rounded-full" alt="" />
          <div>
            <div class="font-semibold text-s-14">{{ m.symbol }}</div>
            <div
              class="text-grey-30 text-right text-s-12 max-w-[70px] overflow-hidden text-ellipsis text-nowrap"
            >
              {{ m.name }}
            </div>
          </div>
        </div>
        <div class="flex-column items-center gap-1">
          <div
            :class="[
              m.priceChangePercentage24h < 0 ? 'text-error' : 'text-success',
              'text-s-14',
            ]"
          >
            {{ formatPercentageValue(m.priceChangePercentage24h).value }}
          </div>
          <div class="text-grey-30 text-right text-s-12">
            {{ m.price }}
          </div>
        </div>
      </div>
    </div>
    <div class="gap-2 flex-column" v-else>
      <div
        v-for="(m, i) in 3"
        :key="`top-gainers-${i}`"
        class="rounded-xl border border-2 px-2 mb-2 py-1 bg-white border-grey-light shadow-md relative flex justify-between items-center animate-pulse"
      >
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-1">
            <div class="size-8 rounded-full bg-grey-8"></div>
            <div class="col-span-2 h-6 w-20 rounded bg-grey-8"></div>
          </div>
          <div class="col-span-2 h-6 w-10 rounded bg-grey-8"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, type Ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { useChainsStore } from '@/stores/chainsStore'
import { useToastStore } from '@/stores/toastStore'
import type { GetWebTopGainersResponse } from '@/mew_api/types'
import isValidUrl from '@/utils/isValidUrl'
import { formatPercentageValue } from '@/utils/numberFormatHelper'

const props = defineProps({
  losers: {
    type: Boolean,
    default: false,
  },
})

const chainsStore = useChainsStore()
const { isLoaded: isLoadedChains, selectedChain: selectedChainStore } =
  storeToRefs(chainsStore)
const toastStore = useToastStore()
const { useMEWFetch } = useFetchMewApi()

const topGainers: Ref<GetWebTopGainersResponse['items'][number][]> = ref([])
const intervalHolder = ref<ReturnType<typeof setInterval> | number>(0)
const isLoading = ref(true)
const fetchUrl = computed(() => {
  const chainName = selectedChainStore.value?.name ?? 'ETHEREUM'
  const sortDirection = props.losers ? 'asc' : 'desc'
  return `https://mew-api-dev.ethvm.dev/v1/web/top-gainers?chainName=${chainName}&page=1&perPage=3&sort=${sortDirection}`
})
const firstFetched: Ref<number> = ref(0)
const currentTime: Ref<number> = ref(0)
const currentTimeInterval = ref<ReturnType<typeof setInterval> | number>(0)

onMounted(() => {
  if (currentTimeInterval.value) {
    clearInterval(currentTimeInterval.value)
  }
  currentTimeInterval.value = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
  if (isLoadedChains.value) {
    firstFetched.value = Date.now()
    fetchTokens()
    if (intervalHolder.value) {
      clearInterval(intervalHolder.value)
    }
    intervalHolder.value = setInterval(() => {
      currentTime.value = Date.now()
      firstFetched.value = Date.now()
      fetchTokens()
    }, 300000) // 5 minutes
  }
})

const timeAgo = computed(() => {
  if (!firstFetched.value) return ''
  const diff = currentTime.value - firstFetched.value
  const minutes = Math.floor(diff / 60000)
  if (minutes === 0 || diff < 0) return 'Just now'
  return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
})

const { data, onFetchResponse, execute, onFetchError } =
  useMEWFetch<GetWebTopGainersResponse>(fetchUrl, {
    immediate: false,
  })
    .get()
    .json()

const fetchTokens = () => {
  isLoading.value = true
  execute()
}

onFetchResponse(() => {
  if (data.value && data.value.items) {
    topGainers.value = data.value.items.map(
      (item: GetWebTopGainersResponse['items'][number]) => {
        const logo =
          item.logoUrl && isValidUrl(item.logoUrl)
            ? item.logoUrl
            : `https://dummyimage.com/32x32/008ECC/000&text=${item.name.charAt(0)}`
        return {
          ...item,
          logoUrl: logo,
          price: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
          }).format(item.price ?? 0), // TODO: update this to convert price to user selected currency
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

watch(
  () => selectedChainStore.value,
  () => {
    if (isLoadedChains.value) {
      fetchTokens()
    }
  },
)
</script>
