<template>
  <div v-if="isWalletConnected">
    <div
      class="flex flex-col lg:flex-row lg:items-center justify-between px-2 py-2 mb-4 lg:gap-6"
    >
      <div
        class="flex grow flex-wrap order-3 order-2 lg:order-1 items-center gap-2"
      >
        <div
          class="flex grow justify-between items-center bg-surface rounded-full p-1 max-w-[500px] min-w-[200px] gap-3 lg:gap-5"
        >
          <app-search-input v-model="searchInput" class="grow" />
        </div>
        <div
          v-if="paginatedArray.length && props.view === 'custom'"
          class="flex-none"
        >
          <app-base-button size="medium" @click="openAddCustom"
            >+ Add Custom Token</app-base-button
          >
        </div>
      </div>
      <!-- TOTAL VALUE-->
      <div class="order-1 lg:order-2 mb-3 lg:mb-0 ml-2 lg:ml-0">
        <p
          class="font-bold text-info uppercase tracking-sp-06 text-s-14 lg:text-right"
        >
          Total Value
        </p>
        <p
          v-if="!isLoading"
          class="text-s-24 font-bold rounded-12 leading-none text-black"
        >
          {{ totalValue }}
        </p>
        <div
          v-else
          class="bg-grey-5 animate-pulse w-[100px] h-6 rounded-lg"
        ></div>
      </div>
    </div>
    <div :class="['static', getTableHeight]" ref="tableContainer">
      <table
        class="w-full text-sm table-fixed border-separate border-spacing-y-0"
      >
        <!-- Header-->
        <thead class="bg-white">
          <tr
            class="text-left text-s-11 uppercase text-info tracking-sp-06 border-b border-grey-5 font-bold"
          >
            <!-- Watchlist -->
            <th class="hidden xs:table-cell xs:w-10 pb-4 text-center"></th>
            <!-- Name & Balance -->
            <th
              class="cursor-pointer px-1 pb-4 hover:text-black transition-colors"
            >
              <div
                class="flex items-center gap-1 ml-11 font-bold"
                :class="{
                  'text-black': headerSort === SortValueString.NAME,
                }"
                @click="setHeaderSort(SortValueString.NAME)"
              >
                TOKEN
                <arrow-long-down-icon
                  class="w-3.5 h-3.5"
                  v-if="
                    headerSort === SortValueString.NAME &&
                    tableDirection === 'desc'
                  "
                />
                <arrow-long-up-icon
                  class="w-3.5 h-3.5"
                  v-if="
                    headerSort === SortValueString.NAME &&
                    tableDirection === 'asc'
                  "
                />
              </div>
            </th>
            <!-- Market Cap -->
            <th
              class="hidden lg:table-cell cursor-pointer px-1 pb-4 hover:text-black transition-colors"
            >
              <div
                class="flex items-center gap-1 justify-end relative font-bold"
                :class="{
                  'text-black': headerSort === SortValueString.MARKET_CAP,
                }"
                @click="setHeaderSort(SortValueString.MARKET_CAP)"
              >
                MARKET CAP
                <arrow-long-down-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.MARKET_CAP &&
                    tableDirection === 'desc'
                  "
                />
                <arrow-long-up-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.MARKET_CAP &&
                    tableDirection === 'asc'
                  "
                />
              </div>
            </th>
            <!-- Price -->
            <th
              class="hidden md:table-cell cursor-pointer px-1 pb-4 hover:text-black transition-colors"
            >
              <div
                class="flex items-center gap-1 justify-end relative font-bold"
                :class="{
                  'text-black': headerSort === SortValueString.MARKET_CAP,
                }"
                @click="setHeaderSort(SortValueString.MARKET_CAP)"
              >
                Price
                <arrow-long-down-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.MARKET_CAP &&
                    tableDirection === 'desc'
                  "
                />
                <arrow-long-up-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.MARKET_CAP &&
                    tableDirection === 'asc'
                  "
                />
              </div>
            </th>
            <!-- 24h % -->
            <th
              class="hidden xs:table-cell cursor-pointer px-1 pb-4 hover:text-black transition-colors"
            >
              <div
                class="flex items-center gap-1 justify-end relative font-bold"
                :class="{
                  'text-black': headerSort === SortValueString.PERCENT,
                }"
                @click="setHeaderSort(SortValueString.PERCENT)"
              >
                24H
                <arrow-long-down-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.PERCENT &&
                    tableDirection === 'desc'
                  "
                />
                <arrow-long-up-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.PERCENT &&
                    tableDirection === 'asc'
                  "
                />
              </div>
            </th>

            <!-- Value and Balance -->
            <th
              class="cursor-pointer pl-1 pb-4 hover:text-black transition-colors"
            >
              <div
                class="flex items-center gap-1 justify-end relative text-right font-bold"
                :class="{
                  'text-black': headerSort === SortValueString.VALUE,
                }"
                @click="setHeaderSort(SortValueString.VALUE)"
              >
                Balance
                <arrow-long-down-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.VALUE &&
                    tableDirection === 'desc'
                  "
                />
                <arrow-long-up-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.VALUE &&
                    tableDirection === 'asc'
                  "
                />
              </div>
            </th>
            <!-- Actions -->
            <th
              class="sm:pl-6 sm:pr-4 pb-4 text-right w-[36px] xs:w-[60px] sm:w-[80px] xl:w-auto"
            >
              <p class="hidden xl:block font-bold">ACTIONS</p>
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
            <td class="hidden xs:table-cell xs:w-10 rounded-l-12 text-center">
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
            <td class="px-1 py-1 rounded-l-12 xs:rounded-none">
              <div class="flex items-center gap-3">
                <app-token-logo
                  :url="token.logo_url"
                  :symbol="token.symbol"
                  class="inline-block rounded-full shadow-token"
                />
                <div class="truncate">
                  <p
                    class="truncate font-medium text-s-14 xs:text-s-15 uppercase text-black leading-tight"
                  >
                    <span class="text-s-14">
                      {{ truncate(token.symbol, 7) }}</span
                    >
                  </p>
                  <div
                    class="flex items-center gap-1 text-info text-s-12 mt-0.5"
                  >
                    <app-tooltip
                      :text="token.name"
                      v-if="token.name.length > 20"
                    >
                      <p
                        class="truncate max-w-[100px] md:max-w-[150px] lg:max-w-[200px]"
                      >
                        {{ token.name }}
                      </p>
                    </app-tooltip>
                    <p
                      v-else
                      class="truncate max-w-[100px] md:max-w-[150px] lg:max-w-[200px]"
                    >
                      {{ token.name }}
                    </p>
                  </div>
                </div>
              </div>
            </td>
            <!-- Market Cap -->
            <td
              class="hidden lg:table-cell px-1 py-1 text-right font-normal text-s-14 text-black"
            >
              {{
                token.market_cap
                  ? `$${formatFiatValue(token.market_cap).value}`
                  : '-'
              }}
            </td>
            <!-- Price -->
            <td class="hidden md:table-cell pl-1 py-1 text-right">
              <p class="font-normal text-s-15 text-black">
                {{
                  token.price ? ` $${formatFiatValue(token.price).value}` : '-'
                }}
              </p>
            </td>
            <!-- 24H % -->

            <td class="hidden xs:table-cell px-1 py-1 text-right">
              <div class="flex flex-col items-end justify-center py-2">
                <p
                  class="text-s-13 font-normal mb-1"
                  :class="[
                    token.price_change_percentage_24h
                      ? parsePercent(
                          token.price_change_percentage_24h,
                        ).includes('-')
                        ? 'text-error'
                        : 'text-success'
                      : 'text-black',
                  ]"
                >
                  {{
                    token.price_change_percentage_24h
                      ? parsePercent(token.price_change_percentage_24h)
                      : '-'
                  }}
                </p>
                <table-sparkline
                  v-if="
                    token.sparkline_in_7d && token.sparkline_in_7d.length > 0
                  "
                  :points="token.sparkline_in_7d"
                  :width="70"
                  :height="24"
                  :max-points="34"
                  fill
                  :percent-change="token.price_change_percentage_24h"
                />
              </div>
            </td>

            <!-- Value -->
            <td class="pl-1 py-1 text-right">
              <p class="font-normal text-s-14 xs:text-s-15 text-black">
                {{ token.fiatBalanceFormatted }}
              </p>
              <p class="text-info text-s-12 xs:text-[13px] mt-0.5">
                {{ formatFloatingPointValue(token.balance).value }}
                {{ truncate(token.symbol, 7) }}
              </p>
            </td>
            <!-- Actions -->
            <td
              class="xs:px-2 xl:pl-6 xl:pr-4 py-1 rounded-r-12 relative text-right"
            >
              <div class="flex items-center justify-end xl:hidden md:mr-0">
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

                      <ul v-if="props.view !== 'custom'">
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
                      <ul v-else>
                        <li
                          @click.stop="customTokenAction('edit', token)"
                          class="p-2 flex items-center hoverBGWhite rounded-12"
                        >
                          <pencil-icon class="w-4 h-4 mr-2" />
                          <p>Edit</p>
                        </li>
                        <li
                          @click.stop="[
                            customTokenAction('delete', token),
                            toggleMenu(),
                          ]"
                          class="p-2 flex items-center hoverBGWhite rounded-12"
                        >
                          <trash-icon class="w-4 h-4 mr-2" />
                          <p>Delete</p>
                        </li>
                      </ul>
                    </div>
                  </template>
                </app-pop-up-menu>
              </div>
              <div
                class="hidden xl:flex flex-row flex-nowrap gap-1 justify-end"
                v-if="props.view !== 'custom'"
              >
                <app-base-button
                  size="small"
                  @click="buyBtn()"
                  is-outline
                  class="min-w-[70px]"
                  >Buy</app-base-button
                >
                <app-base-button
                  size="small"
                  @click.stop="swapBtn(token)"
                  class="min-w-[70px]"
                  >Swap
                </app-base-button>
              </div>
              <div
                class="hidden lg:flex flex-row gap-1 justify-end flex-wrap"
                v-else
              >
                <app-btn-icon
                  label="edit"
                  @click.stop="customTokenAction('edit', token)"
                >
                  <pencil-icon class="w-4 h-4" />
                </app-btn-icon>
                <app-btn-icon
                  label="delete"
                  @click.stop="customTokenAction('delete', token)"
                >
                  <trash-icon class="w-5 h-5" />
                </app-btn-icon>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="
          searchInput.length === 0 &&
          paginatedArray.length === 0 &&
          props.view === 'watchlist'
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
        v-if="paginatedArray.length === 0 && props.view === 'custom'"
        class="text-nowrap mx-auto text-info text-center py-10 text-s-14"
      >
        <p class="mb-6 lg:mt-10">You dont have any custom tokens.</p>
        <app-base-button size="medium" @click="openAddCustom"
          >+ Add Custom Token</app-base-button
        >
        <!-- <router-link :to="{ name: ROUTES_MAIN.CRYPTO.NAME }" class="underline"
          >Discover more tokens
          <arrow-long-up-icon class="rotate-90 w-4 h-4 inline-flex" />
        </router-link> -->
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
      class="flex flex-col xs:flex-row items-center justify-between text-s-14 mt-4 border-t border-grey-5 pt-4 px-2"
    >
      <div
        v-if="!isLoading"
        class="!text-s-12 xs:!text-s-14 text-info order-2 xs:order-1 mb-4 xs:mb-0"
      >
        {{ getCurrentViewableItemsIndex }} of {{ tokens.length }} results
      </div>
      <div class="flex items-center gap-4 order-1 xs:order-2 mb-2 xs:mb-0">
        <app-btn-icon
          :disabled="!isLoading && currentPage === 0"
          label="previous page"
          @click.stop="prevPage"
        >
          <chevron-left-icon class="w-4 h-4" />
        </app-btn-icon>
        <div class="flex items-center gap-2">
          <span class="text-black">{{ currentPage + 1 }}</span>
          <span class="text-info">of</span>
          <span class="text-info">{{ totalPages }}</span>
        </div>
        <app-btn-icon
          :disabled="!isLoading && currentPage + 1 >= totalPages"
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
  </div>
  <div>
    <custom-tokens-dialog />
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
import AppTooltip from '@/components/AppTooltip.vue'
import TableSparkline from '@/components/TableSparkline.vue'
import {
  StarIcon as StarSolidIcon,
  ArrowLongDownIcon,
  ArrowLongUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/vue/24/solid'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import IconBridge from '@/assets/icons/core_menu/icon-bridge.vue'
import { StarIcon as StarOutlineIcon } from '@heroicons/vue/24/outline'
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
import { useCustomTokenStore } from '@/stores/customTokenStore'
import CustomTokensDialog from './CustomTokensDialog.vue'
import { useChainsStore } from '@/stores/chainsStore'
import { type BalanceFilter } from '../../helpers/index'

const chainStore = useChainsStore()
const walletMenu = useWalletMenuStore()
const { setWalletPanel } = walletMenu
const { isOpenSideMenu } = storeToRefs(walletMenu)
const walletStore = useWalletStore()
const {
  isWalletConnected,
  formattedTotalFiatPortfolioValue,
  formattedStockFiatPortfolioValue,
  isLoadingBalances,
  allTokens,
  allStocks,
} = storeToRefs(walletStore)

const searchInput = ref('')

const props = defineProps<{
  view: BalanceFilter
}>()

/** -------------------------------
 * Custom tokens
  -------------------------------*/
const openCustomTokenStore = useCustomTokenStore()
const { customTokens } = storeToRefs(openCustomTokenStore)
const { openCustomTokenDialog, setCurrentView } = openCustomTokenStore

const openAddCustom = () => {
  setCurrentView('add')
  openCustomTokenDialog()
}
const customTokenAction = (action: 'delete' | 'edit', token: TokenBalance) => {
  setCurrentView(action, {
    name: token.name,
    symbol: token.symbol || '',
    address: token.contract || '',
    decimals: token.decimals || 0,
  })
  openCustomTokenDialog()
}

const chainCustomTokens = computed(() => {
  return customTokens.value[chainStore.selectedChain?.name || ''] || []
})
/** -------------------------------
 * Total Value
-------------------------------*/
const totalValue = computed(() => {
  if (props.view === 'all') return formattedTotalFiatPortfolioValue.value
  else if (props.view === 'stocks')
    return formattedStockFiatPortfolioValue.value
  else if (props.view === 'watchlist') {
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
  return props.view === 'watchlist'
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
  if (props.view === 'watchlist') {
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
  } else if (props.view === 'custom') {
    // TODO: figure out balance fetching
    tokens = chainCustomTokens.value.map(customToken => {
      const hasTokenBalance = allTokens.value.filter(
        _token =>
          customToken.address.toLowerCase() === _token.contract?.toLowerCase(),
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
        name: customToken.name,
        symbol: customToken.symbol,
        contract: customToken.address,
        decimals: customToken.decimals,
        balanceWei: '0x',
        balance: '0',
        fiatBalance: 0,
        fiatBalanceFormatted: `$0.00`,
      } as DisplayToken
    })
  } else if (props.view === 'stocks') {
    tokens = [...allStocks.value].map(token => {
      const fiatBalance = getFiatValue(token)
      return {
        ...token,
        fiatBalance: fiatBalance.toNumber(),
        fiatBalanceFormatted: `$${formatFiatValue(fiatBalance).value}`,
      }
    })
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
