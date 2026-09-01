<template>
  <div class="basis-full w-full">
    <div class="bg-white rounded-16 py-4 px-2 sm:px-4">
      <!-- Title -->
      <h1 class="text-s-20 xs:text-s-24 font-bold px-2 pt-2 pb-4">
        {{ $t('stocks.all_stocks') }}
      </h1>

      <!-- Filters: search + category -->
      <div
        class="flex flex-col xs:flex-row xs:flex-wrap xs:items-center gap-2 px-2 pb-6 mb-4 border-b border-grey-5"
      >
        <app-search-input
          v-model="searchInput"
          bg-class="bg-grey-5"
          size="compact"
          :placeholder="$t('common.search')"
          class="w-full xs:w-[240px] shrink-0"
        />

        <!-- Category filter -->
        <app-select
          v-model:selected="selectedCryptoFilter"
          :options="cryptoFilterOptions"
          position="left-0"
        >
          <template #select-button="{ toggleSelect }">
            <button
              class="flex items-center justify-between gap-2 bg-grey-5 hover:bg-grey-10 transition-colors rounded-full h-10 px-4 w-full xs:w-auto"
              @click="toggleSelect"
            >
              <span class="text-s-15 font-medium text-black truncate">
                {{ selectedCryptoFilter.label }}
              </span>
              <chevron-down-icon class="w-4 h-4 shrink-0 text-info" />
            </button>
          </template>
        </app-select>
      </div>

        <div class="static" ref="tableContainer">
          <table
            class="w-full text-sm table-fixed border-separate border-spacing-y-0"
          >
            <!-- Header-->
            <thead class="bg-white">
              <tr
                class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold"
              >
                <!-- Watchlist -->
                <th class="w-10 pb-4 text-center"></th>
                <!-- Name -->
                <th
                  class="cursor-pointer px-1 pb-4 hover:text-black transition-colors"
                  colspan="2"
                >
                  <div
                    class="flex items-center gap-1 ml-11 font-bold"
                    :class="{
                      'text-black': headerSort === 'NAME',
                    }"
                    @click="setHeaderSort('NAME')"
                  >
                    {{ $t('stocks.name') }}
                    <arrow-long-up-icon
                      class="w-3.5 h-3.5"
                      v-if="headerSort === 'NAME' && tableDirection === 'asc'"
                    />
                    <arrow-long-down-icon
                      class="w-3.5 h-3.5"
                      v-if="headerSort === 'NAME' && tableDirection === 'desc'"
                    />
                  </div>
                </th>
                <!-- Market Cap -->
                <th
                  class="cursor-pointer px-1 pb-4 hover:text-black transition-colors"
                >
                  <div
                    class="flex items-center gap-1 justify-end relative text-right font-bold"
                    :class="{
                      'text-black': headerSort === 'MARKET_CAP',
                    }"
                    @click="setHeaderSort('MARKET_CAP')"
                  >
                    {{ $t('stocks.market_cap') }}
                    <arrow-long-up-icon
                      class="w-3.5 h-3.5 absolute -right-4"
                      v-if="
                        headerSort === 'MARKET_CAP' && tableDirection === 'asc'
                      "
                    />
                    <arrow-long-down-icon
                      class="w-3.5 h-3.5 absolute -right-4"
                      v-if="
                        headerSort === 'MARKET_CAP' && tableDirection === 'desc'
                      "
                    />
                  </div>
                </th>
                <!-- Volume -->
                <th
                  class="cursor-pointer px-1 pb-4 hover:text-black transition-colors hidden xl:table-cell"
                >
                  <div
                    class="flex items-center gap-1 justify-end relative text-right font-bold"
                    :class="{
                      'text-black': headerSort === 'VOLUME_24H',
                    }"
                    @click="setHeaderSort('VOLUME_24H')"
                  >
                    {{ $t('stocks.twenty_four_h_volume') }}
                    <arrow-long-up-icon
                      class="w-3.5 h-3.5 absolute -right-4"
                      v-if="
                        headerSort === 'VOLUME_24H' && tableDirection === 'asc'
                      "
                    />
                    <arrow-long-down-icon
                      class="w-3.5 h-3.5 absolute -right-4"
                      v-if="
                        headerSort === 'VOLUME_24H' && tableDirection === 'desc'
                      "
                    />
                  </div>
                </th>
                <!-- 24H Change -->
                <th class="hidden xl:table-cell px-1 pb-4">
                  <div class="text-right font-bold">
                    {{ $t('stocks.twenty_four_h_change') }}
                  </div>
                </th>
                <!-- Price -->
                <th
                  class="cursor-pointer pl-1 pr-6 pb-4 hover:text-black transition-colors hidden md:table-cell"
                >
                  <div
                    class="flex items-center gap-1 justify-end relative text-right font-bold"
                    :class="{
                      'text-black': headerSort === 'PRICE',
                    }"
                    @click="setHeaderSort('PRICE')"
                  >
                    {{ $t('stocks.price') }}
                    <arrow-long-up-icon
                      class="w-3.5 h-3.5 absolute -right-4"
                      v-if="headerSort === 'PRICE' && tableDirection === 'asc'"
                    />
                    <arrow-long-down-icon
                      class="w-3.5 h-3.5 absolute -right-4"
                      v-if="headerSort === 'PRICE' && tableDirection === 'desc'"
                    />
                  </div>
                </th>
                <!-- Actions -->
                <th
                  class="lg:pl-6 lg:pr-4 pb-4 text-right w-7 xs:w-10 md:w-12 lg:w-[120px]"
                ></th>
              </tr>
            </thead>
            <!-- Body-->
            <tbody v-if="!isLoading">
              <tr
                v-for="token in tokens"
                :key="token.name + token.marketCap"
                class="h-14 hoverBGWhite cursor-pointer"
                @click="onRowClick(token)"
              >
                <!-- Watchlist -->
                <td class="w-10 rounded-l-12 text-center">
                  <button
                    :aria-label="
                      isWatchListed(token.coinId)
                        ? $t('common.remove_from_watchlist')
                        : $t('common.add_to_watchlist')
                    "
                    @click.stop="setWatchlistToken(token.coinId)"
                    class="p-2 text-black rounded-full hover:bg-grey-5 transition-colors duration-300 ease-in-out"
                  >
                    <!-- changes color when active -->
                    <star-outline-icon
                      class="h-4 w-4 cursor-pointer"
                      v-if="!isWatchListed(token.coinId)"
                    />
                    <star-solid-icon v-else class="h-4 w-4 cursor-pointer" />
                  </button>
                </td>
                <!-- Name -->
                <td class="px-1 py-1" colspan="2">
                  <router-link
                    :to="{
                      name: STOCK_INFO_ROUTE_NAMES.stocks,
                      params: {
                        symbol: token.symbol,
                      },
                    }"
                    class="flex items-center gap-3"
                    @click.stop
                  >
                    <app-token-logo
                      :url="token.iconPngUrl || token.iconSvgUrl"
                      :symbol="token.symbol"
                      :is-stock="true"
                      class="inline-block rounded-full shadow-token"
                    />
                    <div class="truncate">
                      <app-token-symbol
                        :symbol="token.symbol"
                        :is-stock="true"
                      />
                      <app-tooltip
                        :text="token.name"
                        v-if="token.name.length > 20"
                      >
                        <p
                          class="truncate text-info text-s-12 max-w-[150px] md:max-w-[200px] lg:max-w-[300px] text-black"
                        >
                          {{ token.name }}
                        </p>
                      </app-tooltip>
                      <p
                        v-else
                        class="truncate text-info text-s-12 max-w-[150px] md:max-w-[200px] lg:max-w-[300px] text-black"
                      >
                        {{ token.name }}
                      </p>
                    </div>
                  </router-link>
                </td>
                <!-- Market Cap -->
                <td class="px-1 py-1 text-right text-s-14 text-black">
                  <p class="font-normal">{{ token.marketCap }}</p>
                  <p
                    class="text-s-12 font-normal md:hidden"
                    :class="getPercentClass(getActivePercent(token))"
                  >
                    {{ parsePercent(getActivePercent(token)) }}
                  </p>
                </td>
                <!-- Volume -->
                <td
                  class="hidden xl:table-cell px-1 py-1 text-right font-normal text-s-14 text-black"
                >
                  {{ token.totalVolume }}
                </td>
                <!-- 24H Change -->
                <td class="hidden xl:table-cell px-1 py-1 text-right">
                  <div class="flex flex-col items-end justify-center py-2 pr-2">
                    <p
                      class="text-s-13 font-normal mb-1"
                      :class="getPercentClass(getActivePercent(token))"
                    >
                      {{ parsePercent(getActivePercent(token)) }}
                    </p>
                    <table-sparkline
                      v-if="getSparkLinePoints(token).length > 0"
                      :points="getSparkLinePoints(token)"
                      :width="70"
                      :height="24"
                      :max-points="34"
                      fill
                      :percent-change="getActivePercent(token) || undefined"
                    />
                  </div>
                </td>
                <!-- Price -->
                <td class="hidden md:table-cell pl-1 pr-1 py-1 text-right">
                  <p class="font-normal text-s-14 text-black">
                    {{ token.price }}
                  </p>
                  <p
                    class="text-s-12 font-normal xl:hidden"
                    :class="getPercentClass(getActivePercent(token))"
                  >
                    {{ parsePercent(getActivePercent(token)) }}
                  </p>
                </td>
                <!-- Actions -->
                <td class="lg:pr-2 py-1 rounded-r-12 relative text-right">
                  <div
                    class="flex items-center justify-end lg:hidden ml-auto -mr-1 md:mr-auto"
                  >
                    <app-pop-up-menu
                      :placeholder="$t('stocks.actions_menu')"
                      location="right"
                    >
                      <template #menu-button="{ toggleMenu }">
                        <app-btn-icon
                          :label="$t('common.action_menu')"
                          @click.stop="toggleMenu"
                          height="h-7 xs:h-8"
                          width="w-7 xs:w-8"
                        >
                          <ellipsis-vertical-icon class="w-5 h-5" />
                        </app-btn-icon>
                      </template>
                      <template #menu-content="{ toggleMenu }">
                        <div
                          class="px-2 py-3 max-w-full bg-white rounded-xl min-w-[240px]"
                        >
                          <ul>
                            <li
                              @click.stop="[
                                toggleMenu(),
                                tradeBtn(token, true),
                              ]"
                              class="p-2 flex items-center hoverBGWhite rounded-12"
                            >
                              <icon-trade class="text-primary w-4 h-4 mr-2" />
                              <p>{{ $t('stocks.trade') }}</p>
                            </li>
                          </ul>
                        </div>
                      </template>
                    </app-pop-up-menu>
                  </div>
                  <div class="hidden lg:flex justify-end">
                    <app-base-button
                      size="small"
                      is-outline
                      @click="tradeBtn(token)"
                      >{{ $t('stocks.trade') }}
                    </app-base-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="!isLoading && tokens.length === 0"
            class="w-full flex flex-col items-center justify-center mx-auto text-info py-10 text-s-14"
          >
            <p
              v-if="selectedCryptoFilter.value === 'watchlist' && !searchInput"
              class="mb-1 text-center lg:mt-10"
            >
              {{ $t('stocks.no_watchlisted_stocks') }}
            </p>
            <p v-if="searchInput" class="mb-1 text-center lg:my-10">
              {{ $t('stocks.no_results_for', { search: searchInput }) }}
            </p>
            <button
              v-if="selectedCryptoFilter.value === 'watchlist' && !searchInput"
              class="underline lg:mb-10"
              @click="selectedCryptoFilter = cryptoFilterOptions[0]"
            >
              {{ $t('stocks.discover_more_stocks') }}
              <arrow-long-up-icon class="rotate-90 w-4 h-4 inline-flex" />
            </button>
          </div>
          <!-- Loading State -->
          <div v-if="isLoading" class="">
            <div
              v-for="n in PER_PAGE"
              :key="n"
              class="flex w-full h-[56px] py-2"
            >
              <div
                class="bg-surface/30 rounded-12 w-full h-full animate-pulse"
              ></div>
            </div>
          </div>
        </div>

        <!-- Footer / pagination -->
        <div
          class="flex items-center justify-between text-s-14 mt-4 border-t border-grey-5 pt-4 px-2"
        >
          <span
            class="text-info"
            :class="isLoading ? 'invisible' : 'visible'"
          >
            {{ $t('common.showing_page', { current: page, total: totalPages }) }}
          </span>
          <div class="flex items-center gap-2">
            <app-btn-icon
              class="bg-grey-5"
              height="h-10"
              width="w-10"
              :disabled="!isLoading && page === 1"
              :label="$t('common.previous_page')"
              @click.stop="previousPage"
            >
              <chevron-left-icon class="w-4 h-4" />
            </app-btn-icon>
            <app-btn-icon
              class="bg-grey-5"
              height="h-10"
              width="w-10"
              :disabled="!isLoading && page >= totalPages"
              :label="$t('common.next_page')"
              @click.stop="nextPage"
            >
              <chevron-right-icon class="w-4 h-4" />
            </app-btn-icon>
          </div>
        </div>
        <select-chain-dialog
          v-if="isLoadedChains"
          v-model:is-open="openChainDialog"
          :selected-chain="selectedChainFilter"
          has-all
          @update:chain="setSelectedChain"
        />
      </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import IconTrade from '@/assets/icons/core_menu/icon-trade.vue'
import {
  StarIcon as StarSolidIcon,
  ChevronDownIcon,
  ArrowLongDownIcon,
  ArrowLongUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from '@heroicons/vue/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/vue/24/outline'
import TableSparkline from '@/components/TableSparkline.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import SelectChainDialog from '@/components/select_chain/SelectChainDialog.vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import configs from '@/configs'
import type {
  Chain,
  GetWebStocksTableResponse,
  GetWebStocksTableResponseItem,
  GetWebStocksWatchlistResponseStock,
} from '@/mew_api/types'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { useFetchWatchlist } from '@/composables/useFetchWatchlist'
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'
import { useDebounceFn } from '@vueuse/core'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { ALL_CHAINS } from '@/components/select_chain/helpers'
import { useRoute, useRouter } from 'vue-router'
import { STOCK_INFO_ROUTE_NAMES } from '@/router/routeNames'
import { analytics, ClickTokenTradeEvent, StockMarketEvent } from '@/analytics'

const { t } = useI18n()
const { formatFiat } = useCurrency()
const walletMenu = useWalletMenuStore()
const { setWalletPanel, setSelectedTradeTokenSymbol } = walletMenu
const { isOpenSideMenu } = storeToRefs(walletMenu)

const tableContainer = ref<HTMLElement | null>(null)

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
const { isWatchListed, setWatchlistItem } = watchListStore
const { watchListedStocks } = storeToRefs(watchListStore)

const setWatchlistToken = (
  tokenId: string,
  isStock: boolean | null | undefined = true,
) => {
  setWatchlistItem(tokenId, isStock)
}

/** -------------------------------
 * Number of items shown per page (fixed — matches Figma table footer)
-------------------------------*/
const PER_PAGE = 10

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

const tradeBtn = (token: DisplayToken, isMobile = false) => {
  analytics.trackClickTokenTradeEvent(ClickTokenTradeEvent.TRADE, {
    location: 'stocks_table',
    token: token.symbol,
    stock: token.name,
    isMobile,
  })
  analytics.trackStockMarketClickStockEvent(StockMarketEvent.CLICK_STOCK, {
    location: 'trade_button',
    stockName: token.name,
    stockSymbol: token.symbol,
  })
  setSelectedTradeTokenSymbol(token.symbol)
  setWalletPanel('trade')
  if (!isOpenSideMenu.value) {
    walletMenu.setIsOpenSideMenu(true)
  }
  if (!isMobile) {
    goToTokenPage(token)
  }
}

const setHeaderSort = (key: string) => {
  analytics.trackStockMarketClickSortEvent(StockMarketEvent.CLICK_SORT, {
    sortOption: key.toLowerCase(),
  })
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

// Product-defined category tabs (MEW-2069). 'all' + 'watchlist' are the fixed
// view modes; the rest are stock categories in the requested order, each sent
// to the API as `?category=` (see fetchTableUrl). All values are supported
// server-side (WebStocksTableCategory enum).
const cryptoFilterOptions = computed(() => [
  { label: t('stocks.all_categories'), value: 'all' },
  { label: t('stocks.category_watchlist'), value: 'watchlist' },
  { label: t('stocks.category_equities'), value: 'EQUITIES' },
  { label: t('stocks.category_stock'), value: 'STOCK' },
  { label: t('stocks.category_large_cap'), value: 'LARGE_CAP' },
  { label: t('stocks.category_us'), value: 'US' },
  { label: t('stocks.category_growth'), value: 'GROWTH' },
  { label: t('stocks.category_technology'), value: 'TECHNOLOGY' },
  { label: t('stocks.category_etf'), value: 'ETF' },
  { label: t('stocks.category_value'), value: 'VALUE' },
  { label: t('stocks.category_small_cap'), value: 'SMALL_CAP' },
  { label: t('stocks.category_industrials'), value: 'INDUSTRIALS' },
])

const selectedCryptoFilter = ref(cryptoFilterOptions.value[0])

// Deep-link: a home Industry Sectors tile opens /stocks?category=<value>.
// Preselect the matching tab so the table opens on that filter.
const route = useRoute()
const initialCategory = route.query.category
if (typeof initialCategory === 'string') {
  const match = cryptoFilterOptions.value.find(o => o.value === initialCategory)
  if (match) selectedCryptoFilter.value = match
}

watch(cryptoFilterOptions, options => {
  selectedCryptoFilter.value =
    options.find(opt => opt.value === selectedCryptoFilter.value.value) ||
    options[0]
})

interface DisplayToken {
  symbol: string
  name: string
  price: string
  marketCap: string
  totalVolume: string
  priceChangePercentage24h: number
  sparklineIn7d?: number[]
  coinId: string
  iconPngUrl?: string
  iconSvgUrl?: string
  // Raw numeric values for sorting
  priceRaw: number
  marketCapRaw: number
  totalVolumeRaw: number
}
const tokens: Ref<DisplayToken[]> = ref([])
const page = ref<number>(1)
const totalPages = ref<number>(1)

const { useMEWFetch } = useFetchMewApi()

/** -------------------------------
 * Watchlist Fetch (using useFetchWatchlist)
-------------------------------*/
const selectedChainForWatchlist = computed(
  () => selectedChainFilter.value ?? null,
)

const { stocksWatchlistData, fetchStocksWatchlist, onStocksWatchlistResponse } =
  useFetchWatchlist(selectedChainForWatchlist)

const formatStock = (
  item: GetWebStocksWatchlistResponseStock,
): DisplayToken => {
  const priceRaw = item.primaryMarket.price
    ? Number(item.primaryMarket.price)
    : 0
  const marketCapRaw = item.underlyingMarket.marketCap
    ? Number(item.underlyingMarket.marketCap)
    : 0
  const totalVolumeRaw = item.underlyingMarket.volume24h
    ? Number(item.underlyingMarket.volume24h)
    : 0

  return {
    symbol: item.primaryMarket.symbol,
    name: item.underlyingMarket.name,
    price: priceRaw ? formatFiat(priceRaw).display : '-',
    marketCap: marketCapRaw ? formatFiat(marketCapRaw).display : '-',
    totalVolume: totalVolumeRaw ? formatFiat(totalVolumeRaw).display : '-',
    sparklineIn7d: item.primaryMarket.sparkline24h || [],
    coinId: item.primaryMarket.symbol,
    priceChangePercentage24h: item.primaryMarket.priceChangePercentage24h
      ? Number(item.primaryMarket.priceChangePercentage24h)
      : 0,
    iconPngUrl: item.iconPngUrl || undefined,
    iconSvgUrl: item.iconSvgUrl || undefined,
    priceRaw,
    marketCapRaw,
    totalVolumeRaw,
  }
}

const sortWatchlistTokens = (tokensList: DisplayToken[]): DisplayToken[] => {
  const sortMap: Record<string, () => DisplayToken[]> = {
    NAME: () => sortObjectArrayString(tokensList, 'name', tableDirection.value),
    MARKET_CAP: () =>
      sortObjectArrayNumber(tokensList, 'marketCapRaw', tableDirection.value),
    VOLUME_24H: () =>
      sortObjectArrayNumber(tokensList, 'totalVolumeRaw', tableDirection.value),
    PRICE: () =>
      sortObjectArrayNumber(tokensList, 'priceRaw', tableDirection.value),
    PRICE_CHANGE_PERCENTAGE_24H: () =>
      sortObjectArrayNumber(
        tokensList,
        'priceChangePercentage24h',
        tableDirection.value,
      ),
  }

  return sortMap[headerSort.value] ? sortMap[headerSort.value]() : tokensList
}

const fetchGainersUrl = computed(() => {
  const url = new URL(`${configs.MEW_API_URL}/v1/web/pages/stocks/table`)
  const direction =
    selectedCryptoFilter.value.value !== 'topGainers' ? 'ASC' : 'DESC'
  url.searchParams.set('page', String(page.value))
  url.searchParams.set('perPage', String(PER_PAGE))
  url.searchParams.set('sort', `PRICE_CHANGE_PERCENTAGE_24H_${direction}`)
  if (searchInput.value) {
    url.searchParams.set('search', searchInput.value)
  }
  return url.toString()
})

const fetchTableUrl = computed(() => {
  const url = new URL(`${configs.MEW_API_URL}/v1/web/pages/stocks/table`)
  url.searchParams.set('page', String(page.value))
  url.searchParams.set('perPage', String(PER_PAGE))

  if (searchInput.value) {
    url.searchParams.set('search', searchInput.value)
  }

  // Send the selected category for every view except "all" (watchlist uses its
  // own fetch path, so it never reaches here).
  if (selectedCryptoFilter.value.value !== 'all') {
    url.searchParams.set('category', selectedCryptoFilter.value.value)
  }

  const sort = `${headerSort.value}_${tableDirection.value.toUpperCase()}`
  url.searchParams.set('sort', sort)

  return url.toString()
})

const {
  data: fetchGainersData,
  onFetchResponse: onFetchGainersResponse,
  execute: fetchGainersTable,
} = useMEWFetch(fetchGainersUrl, {
  immediate: false,
})
  .get()
  .json<GetWebStocksTableResponse>()

const {
  data: fetchTokenData,
  onFetchResponse: onFetchTokenTableResponse,
  execute: fetchTokenTable,
} = useMEWFetch(fetchTableUrl, {
  immediate: false,
})
  .get()
  .json<GetWebStocksTableResponse>()

const debounceFetchTokens = useDebounceFn(() => {
  fetchTokenTable()
  tableContainer.value?.scrollTo(0, 0)
}, 100)
const debounceFetchWatchlist = useDebounceFn(() => {
  fetchStocksWatchlist()
  tableContainer.value?.scrollTo(0, 0)
}, 100)
const debounceFetchGainers = useDebounceFn(() => {
  fetchGainersTable()
  tableContainer.value?.scrollTo(0, 0)
}, 100)

onMounted(() => {
  // Fetch tokens based on the selected filter
  if (isLoadedChains.value && selectedChainStore.value) {
    // This will trigger fetching tokens in watch below
    selectedChainFilter.value = ALL_CHAINS.value
  } else {
    isLoading.value = true
    fetchTokenTable()
  }
})

const formatToken = (item: GetWebStocksTableResponseItem): DisplayToken => {
  const tableItem = item as GetWebStocksTableResponseItem
  const priceRaw = tableItem.primaryMarket.price
    ? Number(tableItem.primaryMarket.price)
    : 0
  const marketCapRaw = tableItem.underlyingMarket.marketCap
    ? Number(tableItem.underlyingMarket.marketCap)
    : 0
  const totalVolumeRaw = tableItem.underlyingMarket.volume24h
    ? Number(tableItem.underlyingMarket.volume24h)
    : 0

  return {
    symbol: tableItem.primaryMarket.symbol,
    name: tableItem.underlyingMarket.name,
    price: priceRaw ? formatFiat(priceRaw).display : '-',
    marketCap: marketCapRaw ? formatFiat(marketCapRaw).display : '-',
    totalVolume: totalVolumeRaw ? formatFiat(totalVolumeRaw).display : '-',
    sparklineIn7d: tableItem.primaryMarket.sparkline24h,
    coinId: tableItem.primaryMarket.symbol,
    priceChangePercentage24h: tableItem.primaryMarket.priceChangePercentage24h
      ? parseFloat(tableItem.primaryMarket.priceChangePercentage24h)
      : 0,
    iconPngUrl: tableItem.iconPngUrl,
    iconSvgUrl: tableItem.iconSvgUrl,
    priceRaw,
    marketCapRaw,
    totalVolumeRaw,
  }
}

onStocksWatchlistResponse(() => {
  if (selectedCryptoFilter.value.value !== 'watchlist') return
  const watchlistData = stocksWatchlistData.value
  if (!Array.isArray(watchlistData)) {
    tokens.value = []
    totalTokenCount.value = 0
    totalPages.value = 1
    isLoading.value = false
    return
  }
  const stocksList = watchlistData
    .filter(stock =>
      watchListedStocks.value.includes(stock.primaryMarket.symbol),
    )
    .map(stock => formatStock(stock))
  tokens.value = sortWatchlistTokens(stocksList)
  totalTokenCount.value = tokens.value.length
  totalPages.value = 1
  isLoading.value = false
})
onFetchGainersResponse(() => {
  totalTokenCount.value = fetchGainersData.value?.total ?? 0
  totalPages.value = fetchGainersData.value?.pages ?? 0
  if (fetchGainersData.value && fetchGainersData.value.items) {
    tokens.value =
      fetchGainersData.value.items.map(item => formatToken(item)) || []
  }
  isLoading.value = false
})
onFetchTokenTableResponse(() => {
  totalTokenCount.value = fetchTokenData.value?.total ?? 0
  totalPages.value = fetchTokenData.value?.pages ?? 0
  if (fetchTokenData.value && fetchTokenData.value.items) {
    tokens.value =
      fetchTokenData.value.items.map(item => formatToken(item)) || []
  }
  isLoading.value = false
})

const parsePercent = (val: number | null): string => {
  if (val === null || val === undefined) return '-'
  return formatPercentageValue(val ?? 0).value
}

const getPercentClass = (val: number | null): string => {
  if (val === null || val === undefined) return ''
  if (val > 0) return 'text-success'
  if (val < 0) return 'text-error'
  return 'text-primary'
}

const debounceTrackSearch = useDebounceFn((value: string) => {
  if (value) {
    analytics.trackStockMarketSearchEvent(StockMarketEvent.SEARCH_STOCK, {
      searchValue: value,
    })
  }
}, 500)

watch(
  () => searchInput.value,
  () => {
    debounceTrackSearch(searchInput.value)
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
  () => selectedCryptoFilter.value.value,
  () => {
    analytics.trackStockMarketFilterEvent(StockMarketEvent.SELECTED_FILTER, {
      value: selectedCryptoFilter.value.value,
    })
  },
)

// Reset page to 1 when the category filter changes
watch(
  () => selectedCryptoFilter.value.value,
  () => {
    page.value = 1
  },
)

// Track previous values to detect sort-only changes
const prevWatchValues = ref({
  chain: selectedChainFilter.value,
  page: page.value,
  headerSort: headerSort.value,
  tableDirection: tableDirection.value,
  cryptoFilter: selectedCryptoFilter.value.value,
})

watch(
  () => [
    selectedChainFilter.value,
    page.value,
    headerSort.value,
    tableDirection.value,
    selectedCryptoFilter.value.value,
  ],
  () => {
    const prev = prevWatchValues.value
    const isOnlyHeaderSortChanged =
      prev.chain === selectedChainFilter.value &&
      prev.page === page.value &&
      prev.cryptoFilter === selectedCryptoFilter.value.value &&
      (prev.headerSort !== headerSort.value ||
        prev.tableDirection !== tableDirection.value)

    // Update previous values
    prevWatchValues.value = {
      chain: selectedChainFilter.value,
      page: page.value,
      headerSort: headerSort.value,
      tableDirection: tableDirection.value,
      cryptoFilter: selectedCryptoFilter.value.value,
    }

    // If on watchlist and only sort changed, just re-sort existing data
    if (
      selectedCryptoFilter.value.value === 'watchlist' &&
      isOnlyHeaderSortChanged &&
      tokens.value.length > 0
    ) {
      tokens.value = sortWatchlistTokens(tokens.value)
      return
    }

    isLoading.value = true
    tokens.value = []
    if (
      selectedCryptoFilter.value.value === 'topGainers' ||
      selectedCryptoFilter.value.value === 'topLosers'
    ) {
      fetchGainersTable()
    } else if (selectedCryptoFilter.value.value === 'watchlist') {
      if (watchListedStocks.value.length > 0) {
        fetchStocksWatchlist()
      } else {
        // Empty watchlist - don't fetch, just show empty state
        isLoading.value = false
      }
    } else {
      fetchTokenTable()
    }
  },
  {
    deep: true,
  },
)

const getActivePercent = (token: DisplayToken) => {
  return token.priceChangePercentage24h || 0
}

const getSparkLinePoints = (token: DisplayToken) => {
  return token.sparklineIn7d || []
}

/**-------------------------------
 * Token Link
 --------------------------------*/
const router = useRouter()

// Keep the URL `?category=` in sync with the selected tab so the filter is
// shareable, survives a reload, and round-trips with the home Industry Sectors
// deep-links (which are read on mount, above).
watch(
  () => selectedCryptoFilter.value.value,
  value => {
    const query = { ...route.query }
    if (value === 'all') delete query.category
    else query.category = value
    router.replace({ query })
  },
)

const onRowClick = (token: DisplayToken) => {
  analytics.trackStockMarketClickStockEvent(StockMarketEvent.CLICK_STOCK, {
    location: 'token_row',
    stockName: token.name,
    stockSymbol: token.symbol,
  })
  goToTokenPage(token)
}

const goToTokenPage = (token: DisplayToken) => {
  router.push({
    name: STOCK_INFO_ROUTE_NAMES.stocks,
    params: { symbol: token.symbol },
  })
}
</script>
