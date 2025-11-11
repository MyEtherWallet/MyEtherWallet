<template>
  <div v-if="isWalletConnected">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between px-2 py-2 mb-4 sm:gap-6"
    >
      <div
        class="flex grow justify-between items-center bg-surface rounded-full p-1 max-w-[500px] order-3 order-2 sm:order-1 gap-1"
      >
        <app-search-input v-model="searchInput" class="grow" />
        <app-select
          v-model:selected="selectedAllTokensFilter"
          :options="allTokensFilterOptions"
          position="-right-1"
          class="text-s-12"
        >
          <template #select-button="{ toggleSelect }">
            <button
              class="rounded-full hoverNoBG p-2 xs:min-w-[140px] xs:px-3"
              @click="toggleSelect"
            >
              <div class="flex items-center justify-between">
                <span class="hidden xs:inline">{{
                  selectedAllTokensFilter.label
                }}</span>
                <span class="inline xs:hidden">Filter</span>
                <chevron-down-icon class="w-4 h-4 ml-1" />
              </div>
            </button>
          </template>
        </app-select>
      </div>
      <!-- TOTAL VALUE-->
      <div class="order-1 sm:order-2 mb-3 sm:mb-0 ml-2 sm:ml-0">
        <p
          class="font-bold text-info uppercase tracking-sp-06 text-s-14 sm:text-right"
        >
          Total Value
        </p>
        <p
          v-if="!isLoading"
          class="text-s-20 font-bold sm:text-right rounded-12"
        >
          {{ totalValue }}
        </p>
        <div
          v-else
          class="bg-grey-10 animate-pulse min-w-[120px] h-[30px]"
        ></div>
      </div>
    </div>
    <div :class="['static', getTableHeight]" ref="tableContainer">
      <table class="w-full text-sm table-fixed">
        <!-- Header-->
        <thead class="bg-white">
          <tr class="text-left text-s-11 uppercase text-info tracking-sp-06">
            <!-- Watchlist -->
            <th class="hidden xs:table-cell xs:w-10"></th>
            <!-- Name & Balance -->
            <th
              class="cursor-pointer px-1 py-2 hover:text-black transition-colors"
              colspan="2"
            >
              <div
                class="flex items-center gap-1 ml-11 font-semibold"
                :class="{
                  'text-black': headerSort === SortValueString.NAME,
                }"
                @click="setHeaderSort(SortValueString.NAME)"
              >
                Token
                <arrow-long-up-icon
                  class="w-3 h-3"
                  v-if="
                    headerSort === SortValueString.NAME &&
                    tableDirection === 'desc'
                  "
                />
                <arrow-long-down-icon
                  class="w-3 h-3"
                  v-if="
                    headerSort === SortValueString.NAME &&
                    tableDirection === 'asc'
                  "
                />
              </div>
            </th>
            <!-- 24h % -->
            <th
              class="hidden xs:table-cell w-[60px] md:w-[80px] cursor-pointer px-1 py-2 hover:text-black transition-colors"
            >
              <div
                class="flex items-center gap-1 justify-end relative font-semibold"
                :class="{
                  'text-black': headerSort === SortValueString.PERCENT,
                }"
                @click="setHeaderSort(SortValueString.PERCENT)"
              >
                24h
                <arrow-long-up-icon
                  class="w-3 h-3 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.PERCENT &&
                    tableDirection === 'desc'
                  "
                />
                <arrow-long-down-icon
                  class="w-3 h-3 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.PERCENT &&
                    tableDirection === 'asc'
                  "
                />
              </div>
            </th>
            <!-- Market Cap -->
            <th
              class="hidden md:table-cell cursor-pointer px-1 py-2 hover:text-black transition-colors"
            >
              <div
                class="flex items-center gap-1 justify-end relative font-semibold"
                :class="{
                  'text-black': headerSort === SortValueString.MARKET_CAP,
                }"
                @click="setHeaderSort(SortValueString.MARKET_CAP)"
              >
                Market Cap
                <arrow-long-up-icon
                  class="w-3 h-3 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.MARKET_CAP &&
                    tableDirection === 'desc'
                  "
                />
                <arrow-long-down-icon
                  class="w-3 h-3 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.MARKET_CAP &&
                    tableDirection === 'asc'
                  "
                />
              </div>
            </th>
            <!-- Value and Price -->
            <th
              class="cursor-pointer px-1 py-2 hover:text-black transition-colors"
            >
              <div
                class="flex items-center gap-1 justify-end relative text-right font-semibold"
                :class="{
                  'text-black': headerSort === SortValueString.VALUE,
                }"
                @click="setHeaderSort(SortValueString.VALUE)"
              >
                Value
                <arrow-long-up-icon
                  class="w-3 h-3 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.VALUE &&
                    tableDirection === 'desc'
                  "
                />
                <arrow-long-down-icon
                  class="w-3 h-3 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.VALUE &&
                    tableDirection === 'asc'
                  "
                />
              </div>
            </th>
            <!-- Actions -->
            <th
              class="lg:pl-1 lg:pr-3 py-2 text-right w-8 sm:w-16 lg:w-auto"
              :class="isOpenSideMenu ? 'xl:w-[160px] 2xl:w-auto' : ''"
            >
              <p class="hidden lg:block font-semibold">Actions</p>
            </th>
          </tr>
        </thead>
        <!-- Body-->
        <tbody v-if="!isLoading">
          <tr
            v-for="(token, index) in paginatedArray"
            :key="
              index +
              token.name +
              token.market_cap +
              token.coinId +
              token.contract
            "
            class="h-14 cursor-pointer hoverBGWhite"
            @click="goToTokenPage(token)"
          >
            <!-- Watchlist -->
            <td class="hidden xs:table-cell xs:pr-2 rounded-l-12">
              <button
                v-if="token.coinId"
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
            <!-- Name & Balance -->
            <td class="px-1 py-2 rounded-l-12 xs:rounded-none" colspan="2">
              <div class="flex items-center gap-3">
                <app-token-logo
                  :url="token.logo_url"
                  :symbol="token.symbol"
                  class="inline-block rounded-full shadow-token"
                />
                <div class="truncate">
                  <p class="truncate">{{ token.name }}</p>
                  <p class="text-info text-s-12 uppercase">
                    {{ formatFloatingPointValue(token.balance).value }}
                    {{ truncate(token.symbol, 7) }}
                  </p>
                </div>
              </div>
            </td>
            <!-- 24h % -->
            <td
              class="hidden xs:table-cell w-[80px] px-1 py-1 text-right text-s-11 leading-p-100"
              :class="[
                token.price_change_percentage_24h
                  ? parsePercent(token.price_change_percentage_24h).includes(
                      '-',
                    )
                    ? 'text-error'
                    : 'text-success'
                  : 'text-black',
              ]"
            >
              <div>
                <p>
                  {{
                    token.price_change_percentage_24h
                      ? parsePercent(token.price_change_percentage_24h)
                      : '-'
                  }}
                </p>
                <div v-if="getSparkLinePoints(token).length === 0"></div>
                <table-sparkline
                  v-else
                  :points="getSparkLinePoints(token)"
                  :width="50"
                  :height="35"
                  :max-points="35"
                  :percent-change="token.price_change_percentage_24h"
                />
              </div>
            </td>
            <!-- MarketCap -->
            <td class="hidden md:table-cell px-1 py-2 text-right">
              {{
                token.market_cap
                  ? `$${formatFiatValue(token.market_cap).value}`
                  : '-'
              }}
            </td>
            <!-- Value -->
            <td class="px-1 py-2 text-right">
              <p>{{ token.fiatBalanceFormatted }}</p>
              <p class="text-info text-s-12">
                {{
                  token.price ? `@ $${formatFiatValue(token.price).value}` : '-'
                }}
              </p>
            </td>
            <!-- Actions -->
            <td class="lg:pl-1 lg:pr-2 py-2 rounded-r-12 relative">
              <div
                class="flex items-center justify-end lg:hidden -mr-1 md:mr-0"
              >
                <app-pop-up-menu placeholder="actions menu" location="right">
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
                      <div
                        v-if="token.coinId"
                        class="xs:hidden flex items-center p-2 hoverBGWhite rounded-12"
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
                      </div>
                      <hr
                        class="h-px bg-grey-outline border-0 w-full my-2 xs:hidden"
                      />

                      <ul>
                        <li
                          @click.stop="[buyBtn(), toggleMenu()]"
                          class="p-2 flex items-center hoverBGWhite rounded-12"
                        >
                          <icon-buy class="text-primary w-4 h-4 mr-2" />
                          <p>Buy</p>
                        </li>
                        <li
                          @click.stop="[swapBtn(token, true), toggleMenu()]"
                          class="p-2 flex items-center hoverBGWhite rounded-12"
                        >
                          <icon-swap class="text-primary w-4 h-4 mr-2" />
                          <p>Swap</p>
                        </li>
                        <li
                          @click.stop="[bridgeBtn(token, true), toggleMenu()]"
                          class="p-2 flex items-center hoverBGWhite rounded-12"
                        >
                          <icon-bridge class="text-primary w-4 h-4 mr-2" />
                          <p>Bridge</p>
                        </li>
                      </ul>
                    </div>
                  </template>
                </app-pop-up-menu>
              </div>

              <div class="hidden lg:flex flex-row gap-1 justify-end flex-wrap">
                <app-base-button size="small" @click="buyBtn()" is-outline
                  >Buy</app-base-button
                >
                <app-base-button size="small" @click="swapBtn(token)"
                  >Swap
                </app-base-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="
          searchInput.length === 0 &&
          paginatedArray.length === 0 &&
          selectedAllTokensFilter.value === 'watchlist'
        "
        class="text-nowrap mx-auto text-info text-center py-10 text-s-14"
      >
        <p class="mb-1 lg:mt-10">You dont have any watchlisted tokens.</p>
        <router-link :to="{ name: ROUTES_MAIN.CRYPTO.NAME }" class="underline"
          >Discover more tokens
          <arrow-long-up-icon class="rotate-90 w-4 h-4 inline-flex" />
        </router-link>
      </div>
      <div
        v-if="searchInput.length > 0 && paginatedArray.length === 0"
        class="text-nowrap mx-auto text-info text-center py-10 text-s-14"
      >
        <p class="mb-1 lg:mt-10">No results found for "{{ searchInput }}".</p>
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
      class="flex flex-col xs:flex-row items-center justify-center justify-between text-s-12 mt-2"
    >
      <small
        v-if="!isLoading"
        class="text-info ml-4 order-3 xs:order-1 flex-none text-center xs:text-left"
        >{{ getCurrentViewableItemsIndex }} of
        {{ tokens.length }} results</small
      >
      <div class="flex items-center gap-2 order-2 xs:order-2">
        <app-btn-icon
          :disabled="!isLoading && currentPage === 0"
          label="previous page"
          @click="prevPage"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </app-btn-icon>

        <span class="px-2">{{ currentPage + 1 }} of {{ totalPages }}</span>
        <app-btn-icon
          class=""
          :disabled="!isLoading && currentPage + 1 >= totalPages"
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
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import {
  StarIcon as StarSolidIcon,
  ArrowLongDownIcon,
  ArrowLongUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/solid'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import IconBridge from '@/assets/icons/core_menu/icon-bridge.vue'
import { StarIcon as StarOutlineIcon } from '@heroicons/vue/24/outline'
import TableSparkline from '@/components/TableSparkline.vue'
import { storeToRefs } from 'pinia'
import { truncate } from '@/utils/filters'
import type { TokenBalance } from '@/mew_api/types'
import {
  formatFiatValue,
  formatFloatingPointValue,
  formatPercentageValue,
} from '@/utils/numberFormatHelper'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { type AppSelectOption } from '@/types/components/appSelect'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useRouter } from 'vue-router'
import { TOKEN_INFO_ROUTE_NAMES } from '@/router/routeNames'
import { useWalletStore } from '@/stores/walletStore'
import BigNumber from 'bignumber.js'
import { usePaginate } from '@/composables/usePaginate'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'
import { searchArrayByKeysStr } from '@/utils/searchArray'
import type { GetWebTokensWatchlistResponse } from '@/mew_api/types'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { ROUTES_MAIN } from '@/router/routeNames'
import { useTokenInfoStore } from '@/stores/tokenInfoStore'

const walletMenu = useWalletMenuStore()
const { setWalletPanel } = walletMenu
const { isOpenSideMenu } = storeToRefs(walletMenu)
const walletStore = useWalletStore()
const {
  isWalletConnected,
  formattedTotalFiatPortfolioValue,
  isLoadingBalances,
  allTokens,
} = storeToRefs(walletStore)

const tableContainer = ref<HTMLElement | null>(null)
const searchInput = ref('')

/** -------------------------------
 * All Tokens Filter
  -------------------------------*/

const allTokensFilterOptions = ref([
  { label: 'All Tokens', value: 'all' },
  { label: 'Custom Tokens', value: 'customTokens' },
  { label: 'Watchlist', value: 'watchlist' },
])

const selectedAllTokensFilter = ref(allTokensFilterOptions.value[0])

/** -------------------------------
 * Total Value
-------------------------------*/
const totalValue = computed(() => {
  if (selectedAllTokensFilter.value.value === 'all')
    return formattedTotalFiatPortfolioValue.value
  else if (selectedAllTokensFilter.value.value === 'watchlist') {
    const sum = tokens.value.reduce((acc, token) => {
      const fiatValue = BigNumber(token.fiatBalance || 0)
      return acc.plus(fiatValue)
    }, new BigNumber(0))

    return `$${formatFiatValue(sum).value}`
  } else {
    return `$0.00`
  }
})

/** -------------------------------
 * Sorting
-------------------------------*/
enum SortValueString {
  NAME = 'Name',
  PERCENT = '24h',
  MARKET_CAP = 'Market_Cap',
  VALUE = 'USD_Balance',
}
const headerSort = ref<SortValueString>(SortValueString.MARKET_CAP)
const tableDirection = ref<'asc' | 'desc'>('asc')

const setHeaderSort = (key: SortValueString) => {
  if (headerSort.value === key) {
    tableDirection.value = tableDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    tableDirection.value = 'desc'
  }
  headerSort.value = key
}
/** -------------------------------
 * Watchlist
-------------------------------*/

const watchListStore = useWatchlistStore()
const { isWatchListed, addTokenToWatchList, removeTokenWatchList } =
  watchListStore
const { watchListedTokens } = storeToRefs(watchListStore)

const setWatchlistToken = (tokenId: string) => {
  if (!tokenId) return
  if (isWatchListed(tokenId)) {
    removeTokenWatchList(tokenId)
  } else {
    addTokenToWatchList(tokenId)
    fetchWatchlistTable()
  }
}

/**-------------------------------
 * Watchlist Fetch URL
-------------------------------*/

const { useMEWFetch } = useFetchMewApi()

const fetchWatchListUrl = computed(() => {
  const baseUrl = 'https://mew-api-dev.ethvm.dev/v1/web/tokens-watchlist'
  return `${baseUrl}?coins=${watchListedTokens.value}`
})

const {
  data: wachListMarketData,
  isFetching: isLoadingWatchlist,
  execute: fetchWatchlistTable,
} = useMEWFetch(fetchWatchListUrl, {})
  .get()
  .json<GetWebTokensWatchlistResponse>()

const isLoading = computed<boolean>(() => {
  return selectedAllTokensFilter.value.value === 'watchlist'
    ? isLoadingBalances.value || isLoadingWatchlist.value
    : isLoadingBalances.value
})
/**-------------------------------
 * Balances Table Data
-------------------------------*/
export interface DisplayToken extends TokenBalance {
  fiatBalance?: number
  fiatBalanceFormatted?: string
}

const tokens = computed<DisplayToken[]>(() => {
  let tokens: DisplayToken[] = []
  if (selectedAllTokensFilter.value.value === 'watchlist') {
    tokens =
      [...(wachListMarketData.value || [])]
        .filter(token => watchListedTokens.value.includes(token.coinId))
        .map(token => {
          const hasTokenBalance = allTokens.value.filter(
            _token => token.coinId === _token.coinId,
          )
          if (hasTokenBalance.length > 0) {
            const _token = hasTokenBalance[0]
            const fiatBalance = getFiatValue(_token)
            return {
              ..._token,
              fiatBalance: fiatBalance.toNumber(),
              fiatBalanceFormatted: `$${formatFiatValue(fiatBalance).value}`,
            }
          }
          return {
            ...token,
            fiatBalance: 0,
            fiatBalanceFormatted: `$0.00`,
            balanceWei: '0x',
            balance: '0',
            contract: '',
            price: token.price || undefined,
            market_cap: token.marketCap || undefined,
            price_change_percentage_24h: token.priceChangePercentage24h || 0,
            sparkline_in_7d: token.sparklineIn7d || [],
            logo_url: token.logoUrl || '',
          }
        }) || []
  } else if (selectedAllTokensFilter.value.value === 'customTokens') {
    return tokens
  } else {
    tokens = [...allTokens.value].map(token => {
      const fiatBalance = getFiatValue(token)
      return {
        ...token,
        fiatBalance: fiatBalance.toNumber(),
        fiatBalanceFormatted: `$${formatFiatValue(fiatBalance).value}`,
      }
    })
  }

  //Search
  if (searchInput.value && searchInput.value.length > 0) {
    return searchArrayByKeysStr(tokens, ['name', 'symbol'], searchInput.value)
  }
  //Sorting
  if (headerSort.value === SortValueString.NAME) {
    return sortObjectArrayString(tokens, 'name', tableDirection.value)
  }
  if (headerSort.value === SortValueString.PERCENT) {
    return sortObjectArrayNumber(
      tokens,
      'price_change_percentage_24h',
      tableDirection.value,
    )
  }
  if (headerSort.value === SortValueString.MARKET_CAP) {
    return sortObjectArrayNumber(tokens, 'market_cap', tableDirection.value)
  }
  if (headerSort.value === SortValueString.VALUE) {
    return sortObjectArrayNumber(tokens, 'fiatBalance', tableDirection.value)
  }
  return tokens
})

const getFiatValue = (token: TokenBalance): BigNumber => {
  return BigNumber(token.price || 0).multipliedBy(token.balance)
}

/** -------------------------------
 * Custom Token
  -------------------------------*/

// const customTokensMenu = ref([
//   { label: 'Add Custom Token', value: 'add-custom' },
//   { label: 'Edit Custom Token', value: 'edit-custom' },
// ])

// const openCustomTokenMenu = () => {
//   //TODO: implement custom token functionality
//   toastStore.addToastMessage({
//     text: 'The custom token feature is coming soon!',
//   })
// }

/** -------------------------------
 * Number of items shown in the table
-------------------------------*/
const shownItemsOptions = <AppSelectOption[]>[
  { label: '5', value: '5' },
  { label: '10', value: '10' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
]

const shownItems = computed<number>(() => {
  return Number(activeShownItems.value.value)
})

const getTableHeight = computed<string>(() => {
  if (shownItems.value === 5) {
    return 'min-h-[320px]'
  }
  return 'min-h-[596px]'
})
/** -------------------------------
 * Pagination
-------------------------------*/
const activeShownItems = ref<AppSelectOption>(shownItemsOptions[1])

const getCurrentViewableItemsIndex = computed<number>(() => {
  const viewing = shownItems.value * (currentPage.value + 1)
  if (viewing > tokens.value.length) {
    return tokens.value.length
  }
  return viewing
})

const { currentPage, paginatedArray, nextPage, prevPage, totalPages } =
  usePaginate<DisplayToken>(tokens, shownItems)

const buyBtn = () => {
  window.open('https://ccswap.myetherwallet.com', '_blank')
}
const bridgeBtn = (token: DisplayToken, isMobile = false) => {
  setWalletPanel('bridge')
  if (!isOpenSideMenu.value) {
    walletMenu.setIsOpenSideMenu(true)
  }
  if (!isMobile) {
    goToTokenPage(token)
  }
}
const swapBtn = (token: DisplayToken, isMobile = false) => {
  setWalletPanel('swap')
  if (!isOpenSideMenu.value) {
    walletMenu.setIsOpenSideMenu(true)
  }
  if (!isMobile) {
    goToTokenPage(token)
  }
}

const parsePercent = (val: number | null): string => {
  if (val === null || val === undefined) return ''
  return formatPercentageValue(val ?? 0).value
}

const getSparkLinePoints = (token: DisplayToken) => {
  if (token.sparkline_in_7d && token.sparkline_in_7d.length > 0) {
    const totalPoints = token.sparkline_in_7d.length / 7
    const lastDay = token.sparkline_in_7d.slice(-totalPoints)
    return lastDay
  }
  return []
}

/**-------------------------------
 * Token Link
 --------------------------------*/
const router = useRouter()

const goToTokenPage = (token: DisplayToken) => {
  useTokenInfoStore().setTokenInfo(token)
  router.push({
    name: TOKEN_INFO_ROUTE_NAMES.home,
    params: { tokenId: token.coinId || token.symbol },
  })
}
</script>
