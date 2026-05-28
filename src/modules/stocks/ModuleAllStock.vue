<template>
  <div class="flex flex-col gap-2 xl:gap-3 w-full">
    <div class="basis-full">
      <div
        class="flex flex-wrap justify-start md:justify-between items-center gap-2 mb-6"
      >
        <h1 class="text-s-20 lg:text-s-32 font-bold ml-2">All Stocks</h1>

        <!-- Mobile only Categories-->
        <app-select
          v-model:selected="selectedCryptoFilter"
          :options="cryptoFilterOptions"
          position="left-0"
          placeholder="Category Menu"
          class="w-full md:hidden"
        >
          <template #select-button="{ toggleSelect }">
            <div class="bg-surface rounded-full p-1 w-full">
              <button
                class="rounded-full bg-white py-3 w-full xs:min-w-[180px] px-5 shadow-button"
                @click="toggleSelect"
              >
                <div class="flex items-center justify-between">
                  <span class="text-s-16 font-medium truncate">
                    {{ selectedCryptoFilter.label }}</span
                  >
                  <chevron-down-icon class="w-4 h-4 ml-1" />
                </div>
              </button>
            </div>
          </template>
        </app-select>

        <app-btn-group
          v-model:selected="selectedCryptoFilter"
          :btn-list="cryptoFilterOptions.slice(0, 4)"
          size="large"
          class="hidden md:flex"
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
                  class="rounded-full hoverNoBG px-3 py-2"
                  @click="toggleSelect"
                >
                  <div class="flex items-center text-s-17 leading-p-140">
                    <span>More</span>
                    <chevron-down-icon class="w-4 h-4 ml-1" />
                  </div>
                </button>
              </template>
            </app-select>
          </template>
        </app-btn-group>
      </div>

      <div class="mt-3 bg-white rounded-16 py-4 px-2">
        <div
          class="flex items-center px-2 pt-2 pb-6 mb-4 border-b border-grey-5"
        >
          <div
            class="flex grow gap-4 justify-between items-center bg-surface rounded-full p-1 w-full md:max-w-[500px]"
          >
            <app-search-input v-model="searchInput" class="grow" />
          </div>
        </div>

        <div class="static" ref="tableContainer">
          <table class="w-full text-sm table-fixed">
            <!-- Header-->
            <thead class="bg-white">
              <tr
                class="text-left text-s-11 uppercase text-info tracking-sp-06"
              >
                <!-- Watchlist -->
                <th class="sm:w-10 hidden sm:table-cell"></th>
                <!-- Name -->
                <th
                  :class="
                    isOpenSideMenu
                      ? 'xl:w-[140px] 3xl:w-[180px]'
                      : 'xl:w-[180px]'
                  "
                  class="cursor-pointer px-1 py-2 hover:text-black transition-colors w-[55%] sm:w-[180px]"
                >
                  <div
                    class="flex items-center gap-1 ml-11 font-bold"
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
                  class="cursor-pointer pl-1 pr-4 xs:px-1 py-2 hover:text-black transition-colors"
                >
                  <div
                    class="flex items-center gap-1 justify-end relative text-right font-bold"
                    :class="{
                      'text-black': headerSort === 'PRICE',
                    }"
                    @click="setHeaderSort('PRICE')"
                  >
                    Price
                    <arrow-long-up-icon
                      class="w-3 h-3 absolute -right-4"
                      v-if="headerSort === 'PRICE' && tableDirection === 'asc'"
                    />
                    <arrow-long-down-icon
                      class="w-3 h-3 absolute -right-4"
                      v-if="headerSort === 'PRICE' && tableDirection === 'desc'"
                    />
                  </div>
                </th>
                <!-- 24h % -->
                <th
                  class="cursor-pointer px-1 py-2 hover:text-black transition-colors hidden sm:table-cell"
                >
                  <div
                    class="flex items-center gap-1 justify-end relative text-right font-bold"
                    :class="{
                      'text-black':
                        headerSort === 'PRICE_CHANGE_PERCENTAGE_24H',
                    }"
                    @click="setHeaderSort('PRICE_CHANGE_PERCENTAGE_24H')"
                  >
                    24h
                    <arrow-long-up-icon
                      class="w-3 h-3 absolute -right-4"
                      v-if="
                        headerSort === 'PRICE_CHANGE_PERCENTAGE_24H' &&
                        tableDirection === 'asc'
                      "
                    />
                    <arrow-long-down-icon
                      class="w-3 h-3 absolute -right-4"
                      v-if="
                        headerSort === 'PRICE_CHANGE_PERCENTAGE_24H' &&
                        tableDirection === 'desc'
                      "
                    />
                  </div>
                </th>
                <th
                  :class="
                    isOpenSideMenu ? 'hidden 2xl:table-cell' : 'xl:table-cell'
                  "
                  class="cursor-pointer px-1 py-2 hover:text-black transition-colors hidden xl:min-w-[115px]"
                >
                  <div
                    class="flex items-center gap-1 justify-end relative font-bold"
                    :class="{
                      'text-black': headerSort === 'VOLUME_24H',
                    }"
                    @click="setHeaderSort('VOLUME_24H')"
                  >
                    24h Volume
                    <arrow-long-up-icon
                      class="w-3 h-3 absolute -right-4"
                      v-if="
                        headerSort === 'VOLUME_24H' && tableDirection === 'asc'
                      "
                    />
                    <arrow-long-down-icon
                      class="w-3 h-3 absolute -right-4"
                      v-if="
                        headerSort === 'VOLUME_24H' && tableDirection === 'desc'
                      "
                    />
                  </div>
                </th>
                <!-- Market Cap -->
                <th
                  class="cursor-pointer px-1 py-2 hover:text-black transition-colors hidden md:table-cell xl:min-w-[115px]"
                >
                  <div
                    class="flex items-center gap-1 justify-end relative text-right font-bold"
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
                  class="pl-1 pr-3 py-2 text-right w-10 xs:w-12 sm:w-16 md:w-20 lg:w-auto 3xl:w-[180px]"
                >
                  <p class="hidden lg:block font-bold">Actions</p>
                </th>
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
                <td class="sm:w-10 hidden sm:table-cell rounded-l-12 pl-1">
                  <button
                    :aria-label="
                      isWatchListed(token.coinId)
                        ? 'Remove from Watchlist'
                        : 'Add to Watchlist'
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
                <td class="px-1 py-2 rounded-l-12 sm:rounded-none">
                  <router-link
                    :to="{
                      name: STOCK_INFO_ROUTE_NAMES.stocks,
                      params: {
                        symbol: token.symbol,
                      },
                    }"
                    class="flex items-center gap-3"
                  >
                    <app-token-logo
                      :url="token.iconPngUrl || token.iconSvgUrl"
                      :symbol="token.symbol"
                      :is-stock="true"
                    />
                    <div class="truncate">
                      <app-token-symbol
                        :symbol="token.symbol"
                        :is-stock="true"
                      />
                      <app-tooltip
                        :text="token.name"
                        v-if="token.name.length > 12"
                      >
                        <p class="text-info text-s-12 truncate">
                          {{ token.name }}
                        </p>
                      </app-tooltip>
                      <p v-else class="text-info text-s-12 truncate">
                        {{ token.name }}
                      </p>
                    </div>
                  </router-link>
                </td>
                <!-- Price -->
                <!-- TODO: change with currency parser -->
                <td class="px-1 py-2 text-right">
                  <p class="text-right">
                    {{ token.price }}
                  </p>
                  <p
                    class="text-right sm:hidden text-s-12"
                    :class="getPercentClass(getActivePercent(token))"
                  >
                    {{ parsePercent(getActivePercent(token)) }}
                  </p>
                </td>
                <!-- 24h % -->
                <td
                  class="px-1 py-2 text-right hidden sm:table-cell text-s-13 leading-p-100"
                  :class="getPercentClass(getActivePercent(token))"
                >
                  <div>
                    <p class="mb-1">
                      {{ parsePercent(getActivePercent(token)) }}
                    </p>
                    <div v-if="getSparkLinePoints(token).length === 0"></div>
                    <table-sparkline
                      v-else
                      :points="getSparkLinePoints(token)"
                      :width="70"
                      :height="24"
                      :max-points="34"
                      :percent-change="getActivePercent(token) || undefined"
                      fill
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
                  {{ token.totalVolume }}
                </td>
                <!-- Market Cap -->
                <td class="px-1 py-2 text-right hidden md:table-cell">
                  {{ token.marketCap }}
                </td>
                <!-- Actions -->
                <td class="pl-1 pr-2 py-2 rounded-r-12 relative">
                  <div
                    class="flex items-center justify-end lg:hidden -mr-1 md:mr-0"
                  >
                    <app-pop-up-menu
                      placeholder="actions menu"
                      location="right"
                    >
                      <template #menu-button="{ toggleMenu }">
                        <app-btn-icon
                          label="action menu"
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
                          <button
                            v-if="token.coinId"
                            class="sm:hidden flex items-center p-2 hoverBGWhite rounded-12"
                            @click.stop="[
                              setWatchlistToken(token.coinId),
                              toggleMenu(),
                            ]"
                          >
                            <star-outline-icon
                              class="h-4 w-4 cursor-pointer"
                              v-if="!isWatchListed(token.coinId)"
                            />
                            <star-solid-icon
                              v-else
                              class="h-4 w-4 cursor-pointer"
                            />
                            <span class="ml-2">{{
                              isWatchListed(token.coinId)
                                ? 'Remove from Watchlist'
                                : 'Add to Watchlist'
                            }}</span>
                          </button>
                          <hr
                            class="h-px bg-grey-10 border-0 w-full my-2 sm:hidden"
                          />

                          <ul>
                            <li
                              @click.stop="[
                                toggleMenu(),
                                tradeBtn(token, true),
                              ]"
                              class="p-2 flex items-center hoverBGWhite rounded-12"
                            >
                              <icon-trade class="text-primary w-4 h-4 mr-2" />
                              <p>Trade</p>
                            </li>
                          </ul>
                        </div>
                      </template>
                    </app-pop-up-menu>
                  </div>
                  <div
                    class="hidden lg:flex flex-row gap-1 justify-end flex-wrap"
                  >
                    <app-base-button size="small" @click="tradeBtn(token)"
                      >Trade
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
              You don't have any watchlisted stocks.
            </p>
            <p v-if="searchInput" class="mb-1 text-center lg:my-10">
              No results found for "{{ searchInput }}".
            </p>
            <button
              v-if="selectedCryptoFilter.value === 'watchlist' && !searchInput"
              class="underline lg:mb-10"
              @click="selectedCryptoFilter = cryptoFilterOptions[0]"
            >
              Discover more stocks
              <arrow-long-up-icon class="rotate-90 w-4 h-4 inline-flex" />
            </button>
          </div>
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
          class="flex flex-col xs:flex-row items-center justify-between text-s-14 mt-4 border-t border-grey-5 pt-4 px-2"
        >
          <div
            class="!text-s-12 xs:!text-s-14 text-info order-2 xs:order-1 mb-4 xs:mb-0"
            :class="isLoading ? 'invisible' : 'visible'"
          >
            {{ getCurrentViewableItemsIndex }} of {{ totalTokenCount }} results
          </div>
          <div class="flex items-center gap-4 order-1 xs:order-2 mb-2 xs:mb-0">
            <app-btn-icon
              :disabled="!isLoading && page === 1"
              label="previous page"
              @click.stop="previousPage"
            >
              <chevron-left-icon class="w-4 h-4" />
            </app-btn-icon>
            <div class="flex items-center justify-center gap-2 min-w-[70px]">
              <span class="text-black tabular-nums">{{ page }}</span>
              <span class="text-info">of</span>
              <span class="text-info tabular-nums">{{ totalPages }}</span>
            </div>
            <app-btn-icon
              :disabled="!isLoading && page >= totalPages"
              label="next page"
              @click.stop="nextPage"
            >
              <chevron-right-icon class="w-4 h-4" />
            </app-btn-icon>
          </div>

          <div class="flex items-center gap-2 order-3 xs:order-3 mb-4 xs:mb-0">
            <app-select
              v-model:selected="activeShownItems"
              :options="shownItemsOptions"
              position="top-[-160px] right-0"
              class="min-w-[70px]"
            >
              <template #select-button="{ toggleSelect }">
                <button
                  class="flex items-center justify-between gap-1 px-3 py-1.5 rounded-lg border border-grey-10 hover:border-grey-30 transition-colors"
                  @click="toggleSelect"
                >
                  <span>{{ activeShownItems.label }}</span>
                  <chevron-down-icon class="w-4 h-4 text-info" />
                </button>
              </template>
            </app-select>
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
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, watch, type Ref } from 'vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
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
import {
  formatFiatValue,
  formatIntegerValue,
  formatPercentageValue,
} from '@/utils/numberFormatHelper'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'
import { useDebounceFn } from '@vueuse/core'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { type AppSelectOption } from '@/types/components/appSelect'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { ALL_CHAINS } from '@/components/select_chain/helpers'
import { useRouter } from 'vue-router'
import { STOCK_INFO_ROUTE_NAMES } from '@/router/routeNames'
import { analytics, ClickTokenTradeEvent, StockMarketEvent } from '@/analytics'

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

const getCurrentViewableItemsIndex = computed<number>(() => {
  const viewing = shownItems.value * page.value
  if (viewing > totalTokenCount.value) {
    return totalTokenCount.value
  }
  return viewing
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

const cryptoFilterOptions = ref([
  { label: 'All Assets', value: 'all' },
  { label: 'Watchlist', value: 'watchlist' },
  { label: 'ETF', value: 'ETF' },
  { label: 'Stock', value: 'STOCK' },
  { label: 'Equities', value: 'EQUITIES' },
  { label: 'Commodities', value: 'COMMODITIES' },
  { label: 'Fixed Income', value: 'FIXED_INCOME' },
])

const selectedCryptoFilter = ref(cryptoFilterOptions.value[0])

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
    price: priceRaw ? `$${formatFiatValue(priceRaw).value}` : '-',
    marketCap: marketCapRaw
      ? `$${formatIntegerValue(marketCapRaw).value}`
      : '-',
    totalVolume: totalVolumeRaw
      ? `$${formatIntegerValue(totalVolumeRaw).value}`
      : '-',
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
  url.searchParams.set('perPage', String(shownItems.value))
  url.searchParams.set('sort', `PRICE_CHANGE_PERCENTAGE_24H_${direction}`)
  if (searchInput.value) {
    url.searchParams.set('search', searchInput.value)
  }
  return url.toString()
})

const fetchTableUrl = computed(() => {
  const url = new URL(`${configs.MEW_API_URL}/v1/web/pages/stocks/table`)
  url.searchParams.set('page', String(page.value))
  url.searchParams.set('perPage', String(shownItems.value))

  if (searchInput.value) {
    url.searchParams.set('search', searchInput.value)
  }

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
    price: priceRaw ? `$${formatFiatValue(priceRaw).value}` : '-',
    marketCap: marketCapRaw
      ? `$${formatIntegerValue(marketCapRaw).value}`
      : '-',
    totalVolume: totalVolumeRaw
      ? `$${formatIntegerValue(totalVolumeRaw).value}`
      : '-',
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
  () => selectedCryptoFilter.value,
  () => {
    analytics.trackStockMarketFilterEvent(StockMarketEvent.SELECTED_FILTER, {
      value: selectedCryptoFilter.value.value,
    })
  },
)

// Reset page to 1 when filter or items per page changes
watch(
  () => [selectedCryptoFilter.value, shownItems.value],
  () => {
    page.value = 1
  },
)

// Track previous values to detect sort-only changes
const prevWatchValues = ref({
  chain: selectedChainFilter.value,
  page: page.value,
  shownItems: shownItems.value,
  headerSort: headerSort.value,
  tableDirection: tableDirection.value,
  cryptoFilter: selectedCryptoFilter.value,
})

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
    const prev = prevWatchValues.value
    const isOnlyHeaderSortChanged =
      prev.chain === selectedChainFilter.value &&
      prev.page === page.value &&
      prev.shownItems === shownItems.value &&
      prev.cryptoFilter === selectedCryptoFilter.value &&
      (prev.headerSort !== headerSort.value ||
        prev.tableDirection !== tableDirection.value)

    // Update previous values
    prevWatchValues.value = {
      chain: selectedChainFilter.value,
      page: page.value,
      shownItems: shownItems.value,
      headerSort: headerSort.value,
      tableDirection: tableDirection.value,
      cryptoFilter: selectedCryptoFilter.value,
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
