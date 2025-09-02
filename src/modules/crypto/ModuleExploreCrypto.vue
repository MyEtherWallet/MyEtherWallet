<template>
  <div class="flex items-center justify-between gap-3">
    <div class="flex items-center gap-4">
      <h2 class="text-s-40 font-bold">Explore <br />Crypto Tokens</h2>
      <div>
        <div class="pb-2">
          <app-btn-group
            v-model:selected="selectedCryptoFilter"
            :btn-list="cryptoFilterOptions"
            size="small"
          >
            <template #btn-content="{ data }">
              {{ data.name }}
            </template>
          </app-btn-group>
        </div>
        <div
          class="flex grow gap-4 justify-between items-center bg-surface rounded-full p-1"
        >
          <app-search-input v-model="searchInput" class="grow" />
          <app-select
            v-model:selected="activeSort"
            :options="[]"
            :emit-only="true"
            @toggle-select="openChainDialog = true"
            placeholder="Filter by Chain"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white shadow-sm rounded-2xl p-2">
    <div class="overflow-scroll h-[400px]" ref="tableContainer">
      <table class="w-full text-sm table-fixed">
        <thead class="sticky top-0 bg-white">
          <tr class="text-left">
            <th class="px-1 py-2 w-6"></th>
            <th class="px-1 py-2 w-12">#</th>
            <th
              v-for="(label, key) in HEADER_SORT_OPTIONS"
              :key="`${label}-${key}`"
              class="cursor-pointer"
              :class="{
                'px-1 py-2': label !== '#',
              }"
              @click="setHeaderSort(key)"
            >
              <div class="flex items-center gap-1">
                {{ label }}
                <chevron-up-icon
                  class="w-3 h-3"
                  v-if="headerSort === key && tableDirection === 'asc'"
                />
                <chevron-down-icon
                  class="w-3 h-3"
                  v-if="headerSort === key && tableDirection === 'desc'"
                />
              </div>
            </th>
            <th class="px-1 py-2 w-[130px] text-center">Action</th>
          </tr>
        </thead>
        <tbody v-if="!isLoading">
          <tr
            v-for="(token, index) in tokens"
            :key="token.name + token.marketCap"
            class="h-14"
          >
            <td class="px-1 py-2">
              <!-- changes color when active -->
              <star-solid-icon
                class="h-4 w-4 text-grey-10 cursor-pointer"
                @click="addTokenToWatchList(token.coinId)"
                v-if="!isWatchListed(token.coinId)"
              />
              <star-solid-icon
                class="h-4 w-4 text-gold cursor-pointer"
                @click="removeTokenWatchList(token.coinId)"
                v-else
              />
            </td>
            <td class="px-1 py-2">{{ ranker(index) }}.</td>
            <td class="px-1 py-2">
              <div class="flex">
                <img
                  :src="token.logoUrl"
                  alt="favorite"
                  class="inline-block h-5 w-5 mr-1 rounded-full"
                />
                <div class="w-[65px] overflow-hidden text-ellipsis truncate">
                  {{ token.name }}
                </div>
              </div>
            </td>
            <td class="px-1 py-2">{{ token.price }}</td>
            <td
              class="px-1 py-2"
              :class="[
                parsePercent(token.priceChangePercentage24h).includes('-')
                  ? 'text-error'
                  : 'text-success',
              ]"
            >
              {{ parsePercent(token.priceChangePercentage24h) }}
            </td>
            <td class="px-1 py-2">{{ token.marketCap }}</td>
            <td class="px-1 py-2 text-center">
              <app-base-button size="small" class="mr-1" @click="buyBtn"
                >Buy</app-base-button
              >
              <app-base-button size="small" @click="swapBtn"
                >Swap</app-base-button
              >
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="n in 12" :key="`loading-${n}`" class="animate-pulse">
            <td></td>
            <td></td>
            <td class="px-1 py-2">
              <div class="flex items-center gap-1">
                <div class="size-8 rounded-full bg-grey-8"></div>
                <div class="col-span-2 h-6 w-20 rounded bg-grey-8"></div>
              </div>
            </td>
            <td class="px-1 py-2">
              <div class="col-span-2 h-6 w-full rounded bg-grey-8"></div>
            </td>
            <td class="px-1 py-2">
              <div class="col-span-2 h-6 w-full rounded bg-grey-8"></div>
            </td>
            <td class="px-1 py-2">
              <div class="col-span-2 h-6 w-full rounded bg-grey-8"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between text-xs mt-2">
      <small>{{ tokens.length * page }} of {{ totalTokenCount }} results</small>
      <div class="flex items-center gap-2">
        <button
          class="px-2 py-1 rounded-lg border bg-white disabled:opacity-50"
          :disabled="!isLoading && page === 1"
          @click="previousPage"
        >
          Prev
        </button>
        <span class="px-2">{{ page }} of {{ totalPages }}</span>
        <button
          class="px-2 py-1 rounded-lg border bg-white disabled:opacity-50"
          :disabled="!isLoading && page >= totalPages"
          @click="nextPage"
        >
          Next
        </button>
      </div>
      <app-pop-up-menu
        :placeholder="`Shown items: ${shownItems}`"
        label-size="14"
      >
        <template #menu-content="{ toggleMenu }">
          <div
            v-for="n in shownItemsOptions"
            :key="`shown-items-${n}`"
            class="px-4 pt-4 pb-2 cursor-pointer flex items-center"
            @click="setShownItems(n, toggleMenu)"
          >
            {{ n }}
            <check-icon class="text-success w-6" v-if="shownItems === n" />
          </div>
        </template>
      </app-pop-up-menu>
    </div>
    <select-chain-dialog
      v-if="isLoadedChains"
      v-model:is-open="openChainDialog"
      :selected-chain="selectedChainFilter"
      :filter-chain-type="true"
      @update:chain="setSelectedChain"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, watch, type Ref } from 'vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import {
  StarIcon as StarSolidIcon,
  CheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/solid'
import SelectChainDialog from '@/components/select_chain/SelectChainDialog.vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import type { Chain, GetWebTokensTableResponse } from '@/mew_api/types'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import {
  formatIntegerValue,
  formatPercentageValue,
} from '@/utils/numberFormatHelper'
import { useToastStore } from '@/stores/toastStore'
import isValidUrl from '@/utils/isValidUrl'
import { useDebounceFn } from '@vueuse/core'
import { useWatchlistStore } from '@/stores/watchlistTableStore'

const tableContainer = ref<HTMLElement | null>(null)

const HEADER_SORT_OPTIONS = {
  NAME: 'Name',
  PRICE: 'Price',
  PRICE_CHANGE_PERCENTAGE_24H: '24h',
  MARKET_CAP: 'Market Cap',
}
const toastStore = useToastStore()
const chainsStore = useChainsStore()
const { isLoaded: isLoadedChains, selectedChain: selectedChainStore } =
  storeToRefs(chainsStore)
const searchInput = ref('')
const activeSort = ref({ label: '', value: '' })
const shownItems = ref<number>(50)

const shownItemsOptions = [5, 10, 50, 100]
const selectedChainFilter = ref<Chain | null>(null)
const openChainDialog = ref<boolean>(false)
const headerSort = ref<string>('MARKET_CAP')
const tableDirection = ref<'asc' | 'desc'>('desc')
const totalTokenCount = ref<number>(0)
const isLoading = ref<boolean>(true)

const { isWatchListed, addTokenToWatchList, removeTokenWatchList } =
  useWatchlistStore()

const previousPage = () => {
  if (page.value > 1) {
    page.value--
  }
  tableContainer.value?.scrollTo(0, 0)
}

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++
  }
  tableContainer.value?.scrollTo(0, 0)
}

const buyBtn = () => {
  window.open('https://ccswap.myetherwallet.com', '_blank')
}
const swapBtn = () => {}

const setShownItems = (n: number, toggle: () => void) => {
  shownItems.value = n
  page.value = 1
  toggle()
}

const setHeaderSort = (key: string) => {
  if (headerSort.value === key) {
    tableDirection.value = tableDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    tableDirection.value = 'desc'
  }
  headerSort.value = key
}

const setSelectedChain = (chain: Chain) => {
  selectedChainFilter.value = chain
  openChainDialog.value = false
}

const cryptoFilterOptions = ref([
  { name: 'All', id: 'all' },
  { name: 'DeFi', id: 'defi' },
  { name: 'Top Gainers', id: 'topGainers' },
  { name: 'Top Losers', id: 'topLosers' },
  { name: 'MEME', id: 'meme' },
  { name: 'StableCoin', id: 'stable' },
  { name: 'TikTok', id: 'tiktok' },
  { name: 'Watchlist', id: 'watchlist' },
])

const selectedCryptoFilter = ref(cryptoFilterOptions.value[0])
const tokens: Ref<GetWebTokensTableResponse['items']> = ref([])
const page = ref<number>(1)
const totalPages = ref<number>(1)

const { useMEWFetch } = useFetchMewApi()

const fetchUrl = computed(() => {
  const baseUrl = 'https://mew-api-dev.ethvm.dev/v1/web/tokens-table'
  const defaultChain = selectedChainFilter.value?.name ?? 'ETHEREUEM'
  return `${baseUrl}?chain=${defaultChain}&page=${page.value}&perPage=${shownItems.value}&sort=${headerSort.value}_${tableDirection.value.toUpperCase()}&search=${searchInput.value}`
})

const ranker = (idx: number): number => {
  if (tableDirection.value === 'desc') {
    return idx + 1 + (page.value - 1) * shownItems.value
  } else {
    return totalTokenCount.value - idx - (page.value - 1) * shownItems.value
  }
}

const { data, onFetchResponse, execute, onFetchError } =
  useMEWFetch<GetWebTokensTableResponse>(fetchUrl, {
    immediate: false,
  })
    .get()
    .json()

const fetchTokens = useDebounceFn(() => {
  execute()
  tableContainer.value?.scrollTo(0, 0)
}, 500)

onMounted(() => {
  if (isLoadedChains.value && selectedChainStore.value) {
    selectedChainFilter.value = selectedChainStore.value
  }
  // Fetch tokens based on the selected filter
  isLoading.value = true
  fetchTokens()
})

onFetchResponse(() => {
  totalTokenCount.value = data.value?.total ?? 0
  totalPages.value = data.value?.pages ?? 0
  if (data.value && data.value.items) {
    tokens.value = data.value.items.map(
      (item: GetWebTokensTableResponse['items'][number]) => {
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
          marketCap: formatIntegerValue(item.marketCap ?? 0).value,
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

const parsePercent = (val: number): string => {
  return formatPercentageValue(val ?? 0).value
}

watch(
  () => [
    selectedChainFilter.value,
    page.value,
    shownItems.value,
    headerSort.value,
    tableDirection.value,
    searchInput.value,
    selectedCryptoFilter.value,
  ],
  () => {
    isLoading.value = true
    fetchTokens()
  },
  {
    deep: true,
  },
)
</script>
