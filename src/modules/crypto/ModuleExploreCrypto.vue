<template>
  <div class="flex flex-col gap-2 xl:gap-3 w-full">
    <h1 class="text-s-20 lg:text-s-32 2xl:text-s-40 font-bold rounded-32 ml-2">
      Explore Crypto Tokens
    </h1>

    <div class="basis-full">
      <div class="flex flex-wrap justify-start items-center gap-2">
        <!-- Search and Filter Chains-->
        <div
          class="flex grow gap-4 justify-between items-center bg-surface rounded-full p-1 md:min-w-[400px]"
        >
          <app-search-input v-model="searchInput" class="grow" />
          <button
            class="rounded-full hoverNoBG p-2"
            @click="openChainDialog = true"
          >
            <div class="flex items-center">
              <span
                v-if="selectedChainFilter"
                class="text-s-17 leading-p-140 font-medium"
                >{{ selectedChainFilter.nameLong }}</span
              >
              <chevron-down-icon class="w-4 h-4 ml-1" />
            </div>
          </button>
        </div>
        <!--Filter Lists-->
        <div class="">
          <app-btn-group
            v-model:selected="selectedCryptoFilter"
            :btn-list="cryptoFilterOptions.slice(0, 4)"
            size="large"
          >
            <template #btn-content="{ data }">
              {{ data.label }}
            </template>
            <template #custom>
              <app-select
                v-model:selected="selectedCryptoFilter"
                :options="
                  cryptoFilterOptions.slice(4, cryptoFilterOptions.length)
                "
                position="-right-1"
                class="text-s-12"
              >
                <template #select-button="{ toggleSelect }">
                  <button
                    class="rounded-full hoverNoBG p-2"
                    @click="toggleSelect"
                  >
                    <div class="flex items-center">
                      <span>More</span>
                      <chevron-down-icon class="w-4 h-4 ml-1" />
                    </div>
                  </button>
                </template>
              </app-select>
            </template>
          </app-btn-group>
        </div>
      </div>

      <div class="mt-5 bg-white rounded-16 shadow-button py-4 px-2">
        <div class="static" ref="tableContainer">
          <table class="w-full text-sm table-fixed">
            <!-- Header-->
            <thead class="bg-white">
              <tr
                class="text-left text-s-11 uppercase text-info tracking-sp-06"
              >
                <!-- Watchlist -->
                <th class="w-8 xs:w-10 hidden sm:table-cell"></th>
                <!-- Name -->
                <th
                  class="cursor-pointer px-1 py-2 hover:text-black transition-colors xs:w-[180px]"
                >
                  <div
                    class="flex items-center gap-1 ml-11"
                    :class="{
                      'text-black': headerSort === 'NAME',
                    }"
                    @click="setHeaderSort('NAME')"
                  >
                    Name
                    <arrow-long-up-icon
                      class="w-3 h-3"
                      v-if="headerSort === 'NAME' && tableDirection === 'asc'"
                    />
                    <arrow-long-down-icon
                      class="w-3 h-3"
                      v-if="headerSort === 'NAME' && tableDirection === 'desc'"
                    />
                  </div>
                </th>
                <!-- Price -->
                <th
                  class="cursor-pointer pl-1 pr-4 xs:px-1 py-2 hover:text-black transition-colors w-[150px] xs:w-auto xl:w-[120px]"
                >
                  <div
                    class="flex items-center gap-1 justify-end xs:justify-center sm:justify-end relative"
                    :class="{
                      'text-black': headerSort === 'PRICE',
                    }"
                    @click="setHeaderSort('PRICE')"
                  >
                    Price
                    <arrow-long-up-icon
                      class="w-3 h-3 absolute xs:static sm:absolute -right-4"
                      v-if="headerSort === 'PRICE' && tableDirection === 'asc'"
                    />
                    <arrow-long-down-icon
                      class="w-3 h-3 absolute xs:static sm:absolute -right-4"
                      v-if="headerSort === 'PRICE' && tableDirection === 'desc'"
                    />
                  </div>
                </th>
                <!-- 24h % -->
                <th class="hidden sm:table-cell xl:min-w-[115px]">
                  <app-select
                    v-model:selected="activePercent"
                    :options="percentOptions"
                    class="text-black !text-s-14"
                  >
                    <template #select-button="{ toggleSelect }">
                      <button
                        class="px-1 py-2 text-right !uppercase font-bold text-s-11 text-info tracking-sp-06 hover:text-black transition-colors capitalize w-full"
                        @click="toggleSelect"
                      >
                        <div class="flex items-center justify-end gap-1">
                          <p>{{ activePercent.label }}</p>
                          <chevron-down-icon class="w-3 h-3" />
                        </div>
                      </button>
                    </template>
                  </app-select>
                </th>
                <!-- Last 7 days -->
                <!-- <th
                  class="px-1 py-2 text-right hidden sm:table-cell xl:min-w-[115px]"
                >
                  Last 7 days
                </th> -->
                <!-- 24h Volume -->
                <th
                  :class="
                    isOpenSideMenu ? 'hidden 2xl:table-cell' : 'xl:table-cell'
                  "
                  class="cursor-pointer px-1 py-2 hover:text-black transition-colors hidden xl:min-w-[115px]"
                >
                  <div
                    class="flex items-center gap-1 justify-end relative"
                    :class="{
                      'text-black': headerSort === 'TOTAL_VOLUME',
                    }"
                    @click="setHeaderSort('TOTAL_VOLUME')"
                  >
                    24h Volume
                    <arrow-long-up-icon
                      class="w-3 h-3 absolute -right-4"
                      v-if="
                        headerSort === 'TOTAL_VOLUME' &&
                        tableDirection === 'asc'
                      "
                    />
                    <arrow-long-down-icon
                      class="w-3 h-3 absolute -right-4"
                      v-if="
                        headerSort === 'TOTAL_VOLUME' &&
                        tableDirection === 'desc'
                      "
                    />
                  </div>
                </th>
                <!-- Market Cap -->
                <th
                  class="cursor-pointer px-1 py-2 hover:text-black transition-colors hidden md:table-cell xl:min-w-[115px]"
                >
                  <div
                    class="flex items-center gap-1 justify-end relative text-right"
                    :class="{
                      'text-black': headerSort === 'MARKET_CAP',
                    }"
                    @click="setHeaderSort('MARKET_CAP')"
                  >
                    Market Cap
                    <arrow-long-up-icon
                      class="w-3 h-3 absolute -right-4"
                      v-if="
                        headerSort === 'MARKET_CAP' && tableDirection === 'asc'
                      "
                    />
                    <arrow-long-down-icon
                      class="w-3 h-3 absolute -right-4"
                      v-if="
                        headerSort === 'MARKET_CAP' && tableDirection === 'desc'
                      "
                    />
                  </div>
                </th>
                <!-- Actions -->
                <th
                  class="pl-1 pr-3 py-2 text-right hidden xs:table-cell w-[150px]"
                  :class="[
                    isOpenSideMenu
                      ? '2xl:w-[130px] 3xl:w-[180px]'
                      : 'xl:w-[180px]',
                  ]"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <!-- Body-->
            <tbody v-if="!isLoading">
              <tr
                v-for="token in tokens"
                :key="token.name + token.marketCap"
                class="h-14"
              >
                <!-- Watchlist -->
                <td class="xs:pr-2 hidden sm:table-cell">
                  <button
                    :class="{
                      'text-primary hover:text-text-grey-30': isWatchListed(
                        token.coinId,
                      ),
                      'text-grey-30 hover:text-primary': !isWatchListed(
                        token.coinId,
                      ),
                    }"
                    @click="setWatchlistToken(token.coinId)"
                    class="p-2 rounded-full hover:bg-grey-5 transition-colors duration-300 ease-in-out"
                  >
                    <!-- changes color when active -->

                    <star-solid-icon class="h-4 w-4 cursor-pointer" />
                  </button>
                </td>
                <!-- Name -->
                <td class="px-1 py-2">
                  <div class="flex items-center gap-3">
                    <img
                      :src="token.logoUrl as string"
                      alt="favorite"
                      class="inline-block h-8 w-8 rounded-full shadow-token"
                    />
                    <div class="truncate">
                      <p class="truncate">{{ token.name }}</p>
                      <p class="text-info text-s-12 uppercase">
                        {{ truncate(token.symbol, 7) }}
                      </p>
                    </div>
                  </div>
                </td>
                <!-- Price -->
                <!-- TODO: change with currency parser -->
                <td class="px-1 py-2 text-right">
                  <p class="text-right xs:text-center sm:text-right">
                    ${{ token.price }}
                  </p>
                  <p
                    class="text-right xs:text-center sm:hidden text-s-12"
                    :class="[
                      parsePercent(getActivePercent(token)).includes('-')
                        ? 'text-error'
                        : 'text-success',
                    ]"
                  >
                    {{ parsePercent(getActivePercent(token)) }}
                  </p>
                </td>
                <!-- 24h % -->
                <td
                  class="px-1 py-1 text-right hidden sm:table-cell text-s-11 leading-p-100"
                  :class="[
                    parsePercent(getActivePercent(token)).includes('-')
                      ? 'text-error'
                      : 'text-success',
                  ]"
                >
                  <div>
                    <p>{{ parsePercent(getActivePercent(token)) }}</p>
                    <div v-if="getSparkLinePoints(token).length === 0"></div>
                    <table-sparkline
                      v-else
                      :points="getSparkLinePoints(token)"
                      :width="50"
                      :height="35"
                      :max-points="35"
                    />
                  </div>
                </td>
                <!-- 24h Volume -->
                <td
                  :class="
                    isOpenSideMenu ? 'hidden 2xl:table-cell' : 'xl:table-cell'
                  "
                  class="px-1 py-2 text-right hidden"
                >
                  ${{ formatFiatValue(token.totalVolume ?? 0).value }}
                </td>
                <!-- Market Cap -->
                <td class="px-1 py-2 text-right hidden md:table-cell">
                  ${{ token.marketCap ?? 0 }}
                </td>
                <!-- Actions -->
                <td class="pl-1 py-2 hidden xs:table-cell">
                  <div class="flex flex-row gap-1 justify-end flex-wrap">
                    <app-base-button size="small" @click="buyBtn" is-outline
                      >Buy</app-base-button
                    >
                    <app-base-button size="small" @click="swapBtn"
                      >Swap</app-base-button
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Loading State -->
          <div v-if="isLoading" class="">
            <div
              v-for="n in Number(activeShownItems.value)"
              :key="n"
              class="flex w-full h-[56px] py-2"
            >
              <div
                class="bg-surface/30 rounded-12 w-full h-full animate-pulse"
              ></div>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col xs:flex-row items-center justify-center justify-between text-xs mt-2"
        >
          <small
            class="text-info ml-4 order-3 xs:order-1 flex-none text-center xs:text-left"
            >{{ tokens.length * page }} of {{ totalTokenCount }} results</small
          >
          <div class="flex items-center gap-2 order-2 xs:order-2">
            <app-btn-icon
              class=""
              :disabled="!isLoading && page === 1"
              label="previous page"
              @click="previousPage"
            >
              <ChevronLeftIcon class="w-4 h-4" />
            </app-btn-icon>

            <span class="px-2">{{ page }} of {{ totalPages }}</span>
            <app-btn-icon
              class=""
              :disabled="!isLoading && page >= totalPages"
              label="next page"
              @click="nextPage"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </app-btn-icon>
          </div>
          <app-select
            v-model:selected="activeShownItems"
            :options="shownItemsOptions"
            placeholder="Items per page"
            class="text-black !text-s-14 order-1 xs:order-3 ml-auto xs:ml-0"
            position="-right-1"
          />
        </div>
        <select-chain-dialog
          v-if="isLoadedChains"
          v-model:is-open="openChainDialog"
          :selected-chain="selectedChainFilter"
          :filter-chain-type="true"
          has-all
          @update:chain="setSelectedChain"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, watch, type Ref } from 'vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import {
  StarIcon as StarSolidIcon,
  ChevronDownIcon,
  ArrowLongDownIcon,
  ArrowLongUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/solid'
import TableSparkline from '@/components/TableSparkline.vue'
import SelectChainDialog from '@/components/select_chain/SelectChainDialog.vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import { truncate } from '@/utils/filters'
import type {
  Chain,
  GetWebTokensTableResponse,
  GetWebTokensTableResponseToken,
  GetWebTokensWatchlistResponse,
} from '@/mew_api/types'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import {
  formatFiatValue,
  formatIntegerValue,
  formatPercentageValue,
} from '@/utils/numberFormatHelper'
import { useToastStore } from '@/stores/toastStore'
import isValidUrl from '@/utils/isValidUrl'
import { useDebounceFn } from '@vueuse/core'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { type AppSelectOption } from '@/types/components/appSelect'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { ALL_CHAINS } from '@/components/select_chain/helpers'
const walletMenu = useWalletMenuStore()
const { setIsOpenSideMenu, setWalletPanel } = walletMenu
const { isOpenSideMenu } = storeToRefs(walletMenu)

const tableContainer = ref<HTMLElement | null>(null)

const toastStore = useToastStore()
const chainsStore = useChainsStore()
const { isLoaded: isLoadedChains, selectedChain: selectedChainStore } =
  storeToRefs(chainsStore)
const searchInput = ref('')
const activeSort = ref({ label: '', value: '' })
const selectedChainFilter = ref<Chain | null>(null)
const openChainDialog = ref<boolean>(false)
const headerSort = ref<string>('MARKET_CAP')
const tableDirection = ref<'asc' | 'desc'>('desc')
const totalTokenCount = ref<number>(0)
const isLoading = ref<boolean>(true)

/** -------------------------------
 * Watchlist
-------------------------------*/

const watchListStore = useWatchlistStore()
const { isWatchListed, addTokenToWatchList, removeTokenWatchList } =
  watchListStore
const { watchListedTokens } = storeToRefs(watchListStore)

const setWatchlistToken = (tokenId: string) => {
  if (isWatchListed(tokenId)) {
    removeTokenWatchList(tokenId)
  } else {
    addTokenToWatchList(tokenId)
  }
}

/** -------------------------------
 * Number of items shown in the table
-------------------------------*/
const shownItemsOptions = <AppSelectOption[]>[
  { label: '5', value: '5' },
  { label: '10', value: '10' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
]

const activeShownItems = ref<AppSelectOption>(shownItemsOptions[1])

const shownItems = computed<number>(() => {
  return Number(activeShownItems.value.value)
})

/** -------------------------------
 * Pagination
-------------------------------*/
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
const swapBtn = () => {
  setIsOpenSideMenu(true)
  setWalletPanel(3)
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
  activeSort.value = { label: chain.nameLong, value: chain.name }
  selectedChainFilter.value = chain
  openChainDialog.value = false
}

const cryptoFilterOptions = ref([
  { label: 'All', value: 'all' },
  { label: 'Top Gainers', value: 'topGainers' },
  { label: 'Top Losers', value: 'topLosers' },
  { label: 'Watchlist', value: 'watchlist' },
  { label: 'Stablecoins', value: 'stablecoins' },
  { label: 'DeFi', value: 'defi-index' },
  { label: 'MEME', value: 'meme-token' },
  { label: 'TikTok', value: 'tiktok-meme' },
])

const selectedCryptoFilter = ref(cryptoFilterOptions.value[0])
const tokens: Ref<GetWebTokensTableResponseToken[]> = ref([])
const page = ref<number>(1)
const totalPages = ref<number>(1)

const { useMEWFetch } = useFetchMewApi()

const fetchWatchListUrl = computed(() => {
  const baseUrl = 'https://mew-api-dev.ethvm.dev/v1/web/tokens-watchlist'
  const defaultChain =
    !selectedChainFilter.value || selectedChainFilter.value.name === 'all'
      ? ''
      : `filterChain=${selectedChainFilter.value.name}`
  return `${baseUrl}?${defaultChain}&coins=${watchListedTokens.value}`
})

const fetchGainersUrl = computed(() => {
  const baseUrl = 'https://mew-api-dev.ethvm.dev/v1/web/tokens-table'
  const defaultChain =
    !selectedChainFilter.value || selectedChainFilter.value.name === 'all'
      ? ''
      : `filterChain=${selectedChainFilter.value.name}`
  const direction =
    selectedCryptoFilter.value.value !== 'topGainers' ? 'ASC' : 'DESC'
  return `${baseUrl}?${defaultChain}&page=${page.value}&perPage=${shownItems.value}&sort=PRICE_CHANGE_PERCENTAGE_24H_${direction}&search=${searchInput.value}`
})

const fetchTableUrl = computed(() => {
  const baseUrl = 'https://mew-api-dev.ethvm.dev/v1/web/tokens-table'
  const defaultChain =
    !selectedChainFilter.value || selectedChainFilter.value.name === 'all'
      ? ''
      : `filterChain=${selectedChainFilter.value.name}`
  return `${baseUrl}?${defaultChain}&page=${page.value}&perPage=${shownItems.value}&sort=${headerSort.value}_${tableDirection.value.toUpperCase()}&search=${searchInput.value}${selectedCryptoFilter.value.value !== 'all' ? '&category=' + selectedCryptoFilter.value.value : ''}`
})

const {
  data: fetchGainersData,
  onFetchResponse: onFetchGainersResponse,
  execute: fetchGainersTable,
  onFetchError: onFetchGainersError,
} = useMEWFetch<GetWebTokensTableResponse>(fetchGainersUrl, {
  immediate: false,
})
  .get()
  .json()

const {
  data: fetchWatchlistData,
  onFetchResponse: onFetchWatchlistResponse,
  execute: fetchWatchlistTable,
  onFetchError: onFetchWatchlistError,
} = useMEWFetch<GetWebTokensWatchlistResponse>(fetchWatchListUrl, {
  immediate: false,
})
  .get()
  .json()

const {
  data: fetchTokenData,
  onFetchResponse: onFetchTokenTableResponse,
  execute: fetchTokenTable,
  onFetchError: onFetchTokenTableError,
} = useMEWFetch<GetWebTokensTableResponse>(fetchTableUrl, {
  immediate: false,
})
  .get()
  .json()

const debounceFetchTokens = useDebounceFn(() => {
  fetchTokenTable()
  tableContainer.value?.scrollTo(0, 0)
}, 100)
const debounceFetchWatchlist = useDebounceFn(() => {
  fetchWatchlistTable()
  tableContainer.value?.scrollTo(0, 0)
}, 100)
const debounceFetchGainers = useDebounceFn(() => {
  fetchGainersTable()
  tableContainer.value?.scrollTo(0, 0)
}, 100)

onMounted(() => {
  // Fetch tokens based on the selected filter
  if (isLoadedChains.value && selectedChainStore.value) {
    selectedChainFilter.value = ALL_CHAINS.value
  }
  isLoading.value = true
  fetchTokenTable()
})

onFetchWatchlistResponse(() => {
  totalTokenCount.value = fetchWatchlistData.value?.length ?? 0
  totalPages.value = 1
  if (fetchWatchlistData.value) {
    tokens.value = fetchWatchlistData.value.map(
      (item: GetWebTokensWatchlistResponse[number]) => {
        const logo =
          item.logoUrl && isValidUrl(item.logoUrl)
            ? item.logoUrl
            : `https://dummyimage.com/32x32/008ECC/000&text=${item.name.charAt(0)}`
        return {
          ...item,
          logoUrl: logo,
          priceChangePercentage24h: item.priceChangePercentage24h ?? 0,
          price: formatFiatValue(item.price ?? 0).value,
          // price: new Intl.NumberFormat('en-US', {
          //   style: 'currency',
          //   currency: 'USD',
          //   maximumFractionDigits: 2,
          // }).format(item.price ?? 0), // TODO: update this to convert price to user selected currency
          marketCap: formatIntegerValue(item.marketCap ?? 0).value,
        }
      },
    )
  }
  isLoading.value = false
})
onFetchGainersResponse(() => {
  totalTokenCount.value = fetchGainersData.value?.total ?? 0
  totalPages.value = fetchGainersData.value?.pages ?? 0
  if (fetchGainersData.value && fetchGainersData.value.items) {
    tokens.value = fetchGainersData.value.items.map(
      (item: GetWebTokensTableResponseToken) => {
        const logo =
          item.logoUrl && isValidUrl(item.logoUrl)
            ? item.logoUrl
            : `https://dummyimage.com/32x32/008ECC/000&text=${item.name.charAt(0)}`
        return {
          ...item,
          logoUrl: logo,
          priceChangePercentage24h: item.priceChangePercentage24h ?? 0,
          price: formatFiatValue(item.price ?? 0).value,
          // price: new Intl.NumberFormat('en-US', {
          //   style: 'currency',
          //   currency: 'USD',
          //   maximumFractionDigits: 2,
          // }).format(item.price ?? 0), // TODO: update this to convert price to user selected currency
          marketCap: formatIntegerValue(item.marketCap ?? 0).value,
        }
      },
    )
  }
  isLoading.value = false
})
onFetchTokenTableResponse(() => {
  totalTokenCount.value = fetchTokenData.value?.total ?? 0
  totalPages.value = fetchTokenData.value?.pages ?? 0
  if (fetchTokenData.value && fetchTokenData.value.items) {
    tokens.value = fetchTokenData.value.items.map(
      (item: GetWebTokensTableResponseToken) => {
        const logo =
          item.logoUrl && isValidUrl(item.logoUrl)
            ? item.logoUrl
            : `https://dummyimage.com/32x32/008ECC/000&text=${item.name.charAt(0)}`
        return {
          ...item,
          logoUrl: logo,
          priceChangePercentage24h: item.priceChangePercentage24h ?? 0,
          price: formatFiatValue(item.price ?? 0).value,
          // price: new Intl.NumberFormat('en-US', {
          //   style: 'currency',
          //   currency: 'USD',
          //   maximumFractionDigits: 2,
          // }).format(item.price ?? 0), // TODO: update this to convert price to user selected currency
          marketCap: formatIntegerValue(item.marketCap ?? 0).value,
        }
      },
    )
  }
  isLoading.value = false
})

onFetchGainersError(err => {
  isLoading.value = false
  toastStore.addToastMessage({
    text: err,
  })
})
onFetchWatchlistError(err => {
  isLoading.value = false
  toastStore.addToastMessage({
    text: err,
  })
})
onFetchTokenTableError(err => {
  isLoading.value = false
  toastStore.addToastMessage({
    text: err,
  })
})

const parsePercent = (val: number | null): string => {
  if (val === null || val === undefined) return ''
  return formatPercentageValue(val ?? 0).value
}

watch(
  () => searchInput.value,
  () => {
    page.value = 1
    isLoading.value = true
    tokens.value = []
    if (
      selectedCryptoFilter.value.value === 'topGainers' ||
      selectedCryptoFilter.value.value === 'topLosers'
    ) {
      debounceFetchGainers()
    } else if (selectedCryptoFilter.value.value === 'watchlist') {
      debounceFetchWatchlist()
    } else {
      debounceFetchTokens()
    }
  },
)

watch(
  () => [
    selectedChainFilter.value,
    page.value,
    shownItems.value,
    headerSort.value,
    tableDirection.value,
    selectedCryptoFilter.value,
  ],
  () => {
    isLoading.value = true
    tokens.value = []
    if (
      selectedCryptoFilter.value.value === 'topGainers' ||
      selectedCryptoFilter.value.value === 'topLosers'
    ) {
      fetchGainersTable()
    } else if (selectedCryptoFilter.value.value === 'watchlist') {
      fetchWatchlistTable()
    } else {
      fetchTokenTable()
    }
  },
  {
    deep: true,
  },
)

/**-------------------------------
 * Active percent change options
 --------------------------------*/
enum activePercentChange {
  ONE_HOUR = '1h',
  TWENTY_FOUR_HOURS = '24h',
  SEVEN_DAYS = '7d',
}

const percentOptions = <AppSelectOption[]>[
  { label: '1h', value: activePercentChange.ONE_HOUR },
  { label: '24h', value: activePercentChange.TWENTY_FOUR_HOURS },
  { label: '7d', value: activePercentChange.SEVEN_DAYS },
]

const activePercent = ref<AppSelectOption>(percentOptions[1])

const getActivePercent = (token: GetWebTokensTableResponseToken) => {
  switch (activePercent.value.value) {
    case activePercentChange.ONE_HOUR:
      return token.priceChangePercentage1h
    case activePercentChange.TWENTY_FOUR_HOURS:
      return token.priceChangePercentage24h
    case activePercentChange.SEVEN_DAYS:
      return token.priceChangePercentage7d
    default:
      return token.priceChangePercentage24h
  }
}

watch(
  () => selectedCryptoFilter.value,
  () => {
    if (
      selectedCryptoFilter.value.value === 'topGainers' ||
      selectedCryptoFilter.value.value === 'topLosers'
    ) {
      activePercent.value = percentOptions[1]
    }
  },
)

const getSparkLinePoints = (token: GetWebTokensTableResponseToken) => {
  if (
    token.sparklineIn7d &&
    token.sparklineIn7d.length > 0 &&
    activePercent.value.value !== '1h'
  ) {
    if (activePercent.value.value === '7d') {
      return token.sparklineIn7d
    }
    const totalPoints = token.sparklineIn7d.length / 7
    return token.sparklineIn7d.slice(-totalPoints)
  }
  return []
}
</script>
