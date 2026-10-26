<template>
  <div class="basis-full w-full">
    <AppTableWrapper :title="$t('stocks.all_stocks')">
      <template #toolbar="{ size }">
        <app-searchbar
          v-model="searchInput"
          bg-class="bg-background-default"
          size="compact"
          :placeholder="$t('common.search')"
          :class="['shrink-0', size === 's' ? 'w-full' : 'w-60']"
        />

        <!-- Category filter -->
        <app-select
          v-model:selected="selectedCryptoFilter"
          :options="cryptoFilterOptions"
          position="left-0"
          :max-visible-items="7"
        >
          <template #select-button="{ toggleSelect }">
            <button
              class="flex items-center justify-between gap-2 bg-background-default hover:bg-background-default-hover transition-colors rounded-full h-10 px-4"
              @click="toggleSelect"
            >
              <span class="text-s-15 font-medium text-black truncate">
                {{ selectedCryptoFilter.label }}
              </span>
              <AppIcon
                name="chevron-down"
                variant="filled"
                size="xxs"
                class="shrink-0 text-text-subtle"
              />
            </button>
          </template>
        </app-select>
      </template>

      <AppTable
        v-if="isLoading || tokens.length > 0"
        v-model:sort="sort"
        v-model:page="page"
        :columns="columns"
        :pages="totalPages"
        footer="pagination"
        watchlist
        actions
      >
        <template #default="{ size }">
          <!-- Full-width bars in the row tracks keep the header and pager in place. -->
          <template v-if="isLoading">
            <AppSkeleton
              v-for="n in PER_PAGE"
              :key="n"
              class="col-span-full my-3 h-11 rounded-12"
            />
          </template>
          <AppTableRow
            v-for="token in tokens"
            v-else
            :key="token.name + token.marketCap"
            :title="stockSymbol(token.symbol)"
            :description="token.name"
            :watchlisted="isWatchListed(token.coinId)"
            @update:watchlisted="setWatchlistToken(token.coinId)"
            @click="onRowClick(token)"
          >
            <template #avatar="{ size: avatarSize }">
              <app-token-logo
                :url="token.iconPngUrl || token.iconSvgUrl"
                :symbol="token.symbol"
                :is-stock="true"
                :width="avatarSize === 'l' ? 'w-10' : 'w-8'"
                :height="avatarSize === 'l' ? 'h-10' : 'h-8'"
                no-shadow
              />
            </template>
            <AppTableCell
              column="MARKET_CAP"
              :value="token.marketCap"
              :change="
                size === 's' ? token.priceChangePercentage24h : undefined
              "
            />
            <AppTableCell column="VOLUME_24H" :value="token.totalVolume" />
            <AppTableCell
              column="CHANGE"
              :change="token.priceChangePercentage24h"
              :series="
                token.sparklineIn7d?.length ? token.sparklineIn7d : undefined
              "
            />
            <AppTableCell column="PRICE" :value="token.price" />
            <template #actions="{ size: actionSize, surface }">
              <app-pop-up-menu
                v-if="actionSize === 's'"
                :placeholder="$t('stocks.actions_menu')"
                location="right"
              >
                <template #menu-button="{ toggleMenu }">
                  <AppBtnIcon
                    icon="ellipsis-horizontal"
                    :label="$t('common.action_menu')"
                    @click="toggleMenu"
                  />
                </template>
                <template #menu-content="{ toggleMenu }">
                  <div
                    class="px-2 py-3 max-w-full bg-white rounded-xl min-w-60"
                  >
                    <ul>
                      <li
                        @click.stop="[toggleMenu(), tradeBtn(token, true)]"
                        class="p-2 flex items-center hoverBGWhite rounded-12"
                      >
                        <icon-trade class="text-text-brand w-4 h-4 mr-2" />
                        <p>{{ $t('stocks.trade') }}</p>
                      </li>
                    </ul>
                  </div>
                </template>
              </app-pop-up-menu>
              <AppBaseButton
                v-else
                type="secondary"
                size="medium"
                class="w-24"
                :surface="surface"
                @click="tradeBtn(token)"
                >{{ $t('stocks.trade') }}
              </AppBaseButton>
            </template>
          </AppTableRow>
        </template>
      </AppTable>
      <div
        v-else
        class="w-full flex flex-col items-center justify-center mx-auto text-text-subtle py-10 text-s-14"
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
          <AppIcon name="arrow-up" size="xxs" class="rotate-90 inline-flex" />
        </button>
      </div>
    </AppTableWrapper>
    <select-chain-dialog
      v-if="isLoadedChains"
      v-model:is-open="openChainDialog"
      :selected-chain="selectedChainFilter"
      has-all
      @update:chain="setSelectedChain"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppSearchbar from '@/components/AppSearchbar.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppSkeleton from '@/components/skeleton/AppSkeleton.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppTableWrapper from '@/components/table/AppTableWrapper.vue'
import AppTable from '@/components/table/AppTable.vue'
import AppTableRow from '@/components/table/AppTableRow.vue'
import AppTableCell from '@/components/table/AppTableCell.vue'
import type { TableColumn, TableSort } from '@/components/table/types'
import IconTrade from '@/assets/icons/core_menu/icon-trade.vue'
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
import { useCurrency } from '@/composables/useCurrency'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'
import { useDebounceFn } from '@vueuse/core'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { ALL_CHAINS } from '@/components/select_chain/helpers'
import { useRoute, useRouter } from 'vue-router'
import { STOCK_INFO_ROUTE_NAMES } from '@/router/routeNames'
import { analytics, ClickTokenTradeEvent, StockMarketEvent } from '@/analytics'

import AppIcon from '@/components/icon/AppIcon.vue'
const { t } = useI18n()
const { formatFiat } = useCurrency()
const walletMenu = useWalletMenuStore()
const { setWalletPanel, setSelectedTradeTokenSymbol } = walletMenu
const { isOpenSideMenu } = storeToRefs(walletMenu)

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

// Column keys are the API sort keys. The header cycles off → desc → asc → off;
// "off" falls back to the default market cap desc.
const columns = computed<TableColumn[]>(() => [
  { key: 'NAME', label: t('stocks.name'), sortable: true },
  { key: 'MARKET_CAP', label: t('stocks.market_cap'), sortable: true },
  {
    key: 'VOLUME_24H',
    label: t('stocks.twenty_four_h_volume'),
    sortable: true,
  },
  { key: 'CHANGE', label: t('stocks.twenty_four_h_change') },
  { key: 'PRICE', label: t('stocks.price'), sortable: true },
])

const sort = computed<TableSort | null>({
  get: () => ({ key: headerSort.value, direction: tableDirection.value }),
  set: next => {
    analytics.trackStockMarketClickSortEvent(StockMarketEvent.CLICK_SORT, {
      sortOption: (next?.key ?? headerSort.value).toLowerCase(),
    })
    headerSort.value = next?.key ?? 'MARKET_CAP'
    tableDirection.value = next?.direction ?? 'desc'
  },
})

// AppTokenSymbol's stock form (AAPL + "on") as text: the row title is a string.
const stockSymbol = (symbol: string) =>
  `${symbol.replace(/on$/i, '').toUpperCase()}on`

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
  const priceRaw = item.primaryMarket?.price
    ? Number(item.primaryMarket.price)
    : 0
  const marketCapRaw = item.underlyingMarket?.marketCap
    ? Number(item.underlyingMarket.marketCap)
    : 0
  const totalVolumeRaw = item.underlyingMarket?.volume24h
    ? Number(item.underlyingMarket.volume24h)
    : 0

  return {
    symbol: item.primaryMarket.symbol,
    name: item.stockAlias || item.underlyingMarket?.name || '',
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

const debounceFetchTokens = useDebounceFn(fetchTokenTable, 100)
const debounceFetchWatchlist = useDebounceFn(fetchStocksWatchlist, 100)
const debounceFetchGainers = useDebounceFn(fetchGainersTable, 100)

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
  const marketCapRaw = tableItem.underlyingMarket?.marketCap
    ? Number(tableItem.underlyingMarket.marketCap)
    : 0
  const totalVolumeRaw = tableItem.underlyingMarket?.volume24h
    ? Number(tableItem.underlyingMarket.volume24h)
    : 0

  return {
    symbol: tableItem.primaryMarket.symbol,
    name: tableItem.stockAlias || tableItem.underlyingMarket?.name || '',
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
