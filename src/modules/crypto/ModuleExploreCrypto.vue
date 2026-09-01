<template>
  <div class="basis-full w-full">
    <div class="bg-white rounded-16 py-4 px-2 sm:px-4">
      <!-- Title -->
      <h1 class="text-s-20 xs:text-s-24 font-bold px-2 pt-2 pb-4">
        {{ $t('crypto.explore_tokens') }}
      </h1>

      <!-- Filters: search + category + network -->
      <div
        class="flex flex-col xs:flex-row xs:flex-wrap xs:items-center gap-2 px-2 pb-6 mb-4 border-b border-grey-5"
      >
        <app-search-input
          v-model="searchInput"
          bg-class="bg-grey-5"
          size="compact"
          :placeholder="$t('crypto.search')"
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

        <!-- Network filter -->
        <button
          class="flex items-center justify-between gap-2 bg-grey-5 hover:bg-grey-10 transition-colors rounded-full h-10 px-4 w-full xs:w-auto"
          @click="openChainDialog = true"
        >
          <div class="flex items-center gap-2 truncate">
            <app-token-logo
              v-if="!isAllChainsSelected"
              :url="selectedChainFilter?.icon"
              :symbol="selectedChainFilter?.nameLong"
              width="w-5"
              height="h-5"
            />
            <span class="text-s-15 font-medium text-black truncate">
              {{ networkFilterLabel }}
            </span>
          </div>
          <chevron-down-icon class="w-4 h-4 shrink-0 text-info" />
        </button>
      </div>

        <div class="static" ref="tableContainer">
          <table
            class="w-full text-sm table-fixed border-separate border-spacing-y-0"
          >
            <!-- Header-->
            <thead class="bg-white">
              <tr
                class="text-left text-s-11 uppercase text-info tracking-sp-06 border-b border-grey-5 font-bold"
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
                    {{ $t('crypto.token') }}
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
                  class="cursor-pointer px-1 pb-4 hover:text-black transition-colors w-[140px]"
                >
                  <div
                    class="flex items-center gap-1 justify-end relative text-right font-bold"
                    :class="{
                      'text-black': headerSort === 'MARKET_CAP',
                    }"
                    @click="setHeaderSort('MARKET_CAP')"
                  >
                    {{ $t('crypto.market_cap') }}
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
                  class="cursor-pointer px-1 pb-4 hover:text-black transition-colors hidden xl:table-cell w-[140px]"
                >
                  <div
                    class="flex items-center gap-1 justify-end relative text-right font-bold"
                    :class="{
                      'text-black': headerSort === 'TOTAL_VOLUME',
                    }"
                    @click="setHeaderSort('TOTAL_VOLUME')"
                  >
                    {{ $t('crypto.volume') }}
                    <arrow-long-up-icon
                      class="w-3.5 h-3.5 absolute -right-4"
                      v-if="
                        headerSort === 'TOTAL_VOLUME' &&
                        tableDirection === 'asc'
                      "
                    />
                    <arrow-long-down-icon
                      class="w-3.5 h-3.5 absolute -right-4"
                      v-if="
                        headerSort === 'TOTAL_VOLUME' &&
                        tableDirection === 'desc'
                      "
                    />
                  </div>
                </th>
                <!-- 24H Change -->
                <th class="hidden xl:table-cell px-1 pb-4 w-[140px]">
                  <div class="text-right font-bold">
                    {{ $t('crypto.twenty_four_h_change') }}
                  </div>
                </th>
                <!-- Price -->
                <th
                  class="cursor-pointer px-1 pb-4 hover:text-black transition-colors hidden md:table-cell w-[140px]"
                >
                  <div
                    class="flex items-center gap-1 justify-end relative text-right font-bold"
                    :class="{
                      'text-black': headerSort === 'PRICE',
                    }"
                    @click="setHeaderSort('PRICE')"
                  >
                    {{ $t('crypto.price') }}
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
                  class="lg:pl-6 lg:pr-4 pb-4 text-right w-7 xs:w-10 md:w-12 lg:w-[160px] xl:w-[180px] 2xl:w-[200px]"
                ></th>
              </tr>
            </thead>
            <!-- Body-->
            <tbody v-if="!isLoading">
              <tr
                v-for="token in tokens"
                :key="token.name + token.marketCap"
                class="h-14 cursor-pointer hover:bg-[#F5F5F5] transition-colors duration-300"
                @click="onRowClick(token)"
              >
                <!-- Watchlist -->
                <td class="w-10 rounded-l-12 text-center">
                  <button
                    :aria-label="
                      isWatchListed(getWatchlistId(token))
                        ? $t('common.remove_from_watchlist')
                        : $t('common.add_to_watchlist')
                    "
                    @click.stop="setWatchlistToken(token)"
                    class="p-2 text-black rounded-full hover:bg-grey-5 transition-colors duration-300 ease-in-out"
                  >
                    <!-- changes color when active -->
                    <star-outline-icon
                      class="h-4 w-4 cursor-pointer"
                      v-if="!isWatchListed(getWatchlistId(token))"
                    />
                    <star-solid-icon v-else class="h-4 w-4 cursor-pointer" />
                  </button>
                </td>
                <!-- Name & Symbol -->
                <td class="px-1 py-1" colspan="2">
                  <router-link
                    :to="getTokenRoute(token)"
                    class="flex items-center gap-3"
                    @click.stop
                  >
                    <app-token-logo
                      :url="token.logoUrl"
                      :symbol="token.symbol"
                      :is-stock="token.ondo !== null"
                      class="inline-block rounded-full shadow-token"
                    />
                    <div class="truncate">
                      <app-token-symbol
                        :symbol="token.symbol"
                        :is-stock="token.ondo !== null"
                      />
                      <app-tooltip
                        :text="token.name"
                        v-if="token.name.length > 20"
                      >
                        <p
                          class="truncate text-info text-s-12 max-w-[150px] md:max-w-[200px] lg:max-w-[300px] text-black"
                        >
                          {{
                            token.ondo?.stockAlias
                              ? token.ondo.stockAlias
                              : token.name
                          }}
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
                  <div class="flex flex-col items-end justify-center py-2">
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
                      :placeholder="$t('common.action_menu')"
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
                          <button
                            v-if="token.coinId || token.ondo"
                            class="xs:hidden flex items-center p-2 hoverBGWhite rounded-12"
                            @click.stop="[
                              setWatchlistToken(token),
                              toggleMenu(),
                            ]"
                          >
                            <star-outline-icon
                              class="h-4 w-4 cursor-pointer"
                              v-if="!isWatchListed(getWatchlistId(token))"
                            />
                            <star-solid-icon
                              v-else
                              class="h-4 w-4 cursor-pointer"
                            />
                            <span class="ml-2">{{
                              isWatchListed(getWatchlistId(token))
                                ? $t('common.remove_from_watchlist')
                                : $t('common.add_to_watchlist')
                            }}</span>
                          </button>
                          <hr
                            v-if="
                              isBuyableOnCompatibleChain(token.coinId) ||
                              token.ondo !== null ||
                              getIsBridgeable(token) ||
                              token.chains.length > 0 ||
                              getTokenIsCurrentNative(token)
                            "
                            class="h-px bg-grey-10 border-0 w-full my-2 xs:hidden"
                          />

                          <ul>
                            <li
                              v-if="isBuyableOnCompatibleChain(token.coinId)"
                              @click.stop="[toggleMenu(), buyBtn(token, true)]"
                              class="p-2 flex items-center hoverBGWhite rounded-12"
                            >
                              <icon-buy class="text-primary w-4 h-4 mr-2" />
                              <p>{{ $t('common.buy') }}</p>
                            </li>
                            <template v-if="token.ondo !== null">
                              <li
                                @click.stop="[
                                  tradeBtn(token, true),
                                  toggleMenu(),
                                ]"
                                class="p-2 flex items-center hoverBGWhite rounded-12"
                              >
                                <icon-trade class="text-primary w-4 h-4 mr-2" />
                                <p>{{ $t('crypto.trade') }}</p>
                              </li>
                            </template>
                            <template v-else>
                              <li
                                v-if="getIsBridgeable(token)"
                                @click.stop="[
                                  toggleMenu(),
                                  bridgeBtn(token, true),
                                ]"
                                class="p-2 flex items-center hoverBGWhite rounded-12"
                              >
                                <icon-bridge
                                  class="text-primary w-4 h-4 mr-2"
                                />
                                <p>{{ $t('crypto.bridge') }}</p>
                              </li>
                              <li
                                v-else-if="
                                  currentChainhasSwapSupport &&
                                  (token.chains.length > 0 ||
                                    getTokenIsCurrentNative(token))
                                "
                                @click.stop="[
                                  toggleMenu(),
                                  swapBtn(token, true),
                                ]"
                                class="p-2 flex items-center hoverBGWhite rounded-12"
                              >
                                <icon-swap class="text-primary w-4 h-4 mr-2" />
                                <p>{{ $t('common.swap') }}</p>
                              </li>
                            </template>
                          </ul>
                        </div>
                      </template>
                    </app-pop-up-menu>
                  </div>
                  <div
                    class="hidden lg:grid grid-cols-2 gap-2 w-full max-w-[160px] ml-auto"
                  >
                    <!-- Buy first (inverted order for the Explore Tokens table) -->
                    <app-base-button
                      v-if="isBuyableOnCompatibleChain(token.coinId)"
                      size="small"
                      @click="buyBtn(token)"
                      is-outline
                      class="w-full"
                      :class="{ 'col-start-2': !hasPrimaryAction(token) }"
                      >{{ $t('common.buy') }}</app-base-button
                    >
                    <!-- Primary action: trade / bridge / swap -->
                    <app-base-button
                      v-if="token.ondo !== null"
                      size="small"
                      @click="tradeBtn(token)"
                      class="w-full"
                      :class="{
                        'col-start-2': !isBuyableOnCompatibleChain(token.coinId),
                      }"
                      >{{ $t('crypto.trade') }}
                    </app-base-button>
                    <app-base-button
                      v-else-if="getIsBridgeable(token)"
                      size="small"
                      @click="bridgeBtn(token)"
                      class="w-full"
                      :class="{
                        'col-start-2': !isBuyableOnCompatibleChain(token.coinId),
                      }"
                      >{{ $t('crypto.bridge') }}
                    </app-base-button>
                    <app-base-button
                      v-else-if="
                        currentChainhasSwapSupport &&
                        (token.chains.length > 0 ||
                          getTokenIsCurrentNative(token))
                      "
                      size="small"
                      @click="swapBtn(token)"
                      class="w-full"
                      :class="{
                        'col-start-2': !isBuyableOnCompatibleChain(token.coinId),
                      }"
                      >{{ $t('common.swap') }}
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
              {{ $t('crypto.no_watchlisted_tokens') }}
            </p>
            <p v-if="searchInput" class="mb-1 text-center lg:my-10">
              {{ $t('crypto.no_results_for', { search: searchInput }) }}
            </p>
            <button
              v-if="selectedCryptoFilter.value === 'watchlist' && !searchInput"
              class="underline lg:mb-10"
              @click="selectedCryptoFilter = cryptoFilterOptions[0]"
            >
              {{ $t('crypto.discover_more_tokens') }}
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
              @click="previousPage"
            >
              <ChevronLeftIcon class="w-4 h-4" />
            </app-btn-icon>
            <app-btn-icon
              class="bg-grey-5"
              height="h-10"
              width="w-10"
              :disabled="!isLoading && page >= totalPages"
              :label="$t('common.next_page')"
              @click="nextPage"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </app-btn-icon>
          </div>
        </div>
        <select-chain-dialog
          v-if="isLoadedChains"
          v-model:is-open="openChainDialog"
          :selected-chain="selectedChainFilter"
          has-all
          :filter-by-selected-chain-type="false"
          @update:chain="setSelectedChain"
        />
      </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, watch, type Ref } from 'vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import IconBridge from '@/assets/icons/core_menu/icon-bridge.vue'
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
import SelectChainDialog from '@/components/select_chain/SelectChainDialog.vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import type {
  Chain,
  GetWebTokensTableResponse,
  GetWebTokensTableResponseToken,
  GetWebStocksWatchlistResponseStock,
} from '@/mew_api/types'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { useDebounceFn } from '@vueuse/core'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useFetchWatchlist } from '@/composables/useFetchWatchlist'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'

import { ALL_CHAINS } from '@/components/select_chain/helpers'
import { useRoute, useRouter } from 'vue-router'
import {
  TOKEN_INFO_ROUTE_NAMES,
  STOCK_INFO_ROUTE_NAMES,
} from '@/router/routeNames'
import { usePurchaseStore } from '@/stores/purchaseStore'
import type { NewTokenInfo } from '@/composables/useSwap'
import { useInputStore } from '@/stores/inputStore'
import { getAPIPath } from '@/utils/constructAPIPath'
import { analytics, ClickTokenTradeEvent, CryptoMarketEvent } from '@/analytics'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { formatFiat } = useCurrency()

const walletMenu = useWalletMenuStore()
const { setWalletPanel, setSelectedTradeTokenSymbol, setSelectedPurchaseCoinId } =
  walletMenu
const { isOpenSideMenu } = storeToRefs(walletMenu)

const purchaseStore = usePurchaseStore()
const inputStore = useInputStore()
const { isBuyableOnCompatibleChain } = purchaseStore
const { storeSwapValues } = inputStore

const tableContainer = ref<HTMLElement | null>(null)

const chainsStore = useChainsStore()
const {
  isLoaded: isLoadedChains,
  selectedChain: selectedChainStore,
  currentChainhasSwapSupport,
} = storeToRefs(chainsStore)
const searchInput = ref('')
const activeSort = ref({ label: '', value: '' })
const selectedChainFilter = ref<Chain | null>(null)
const openChainDialog = ref<boolean>(false)
const isAllChainsSelected = computed(
  () => !selectedChainFilter.value || selectedChainFilter.value.name === 'all',
)
const networkFilterLabel = computed(() =>
  isAllChainsSelected.value
    ? t('common.all_networks')
    : selectedChainFilter.value!.nameLong,
)
const headerSort = ref<string>('MARKET_CAP')
const tableDirection = ref<'asc' | 'desc'>('desc')
const totalTokenCount = ref<number>(0)
const isLoading = ref<boolean>(true)

/** -------------------------------
 * Watchlist
-------------------------------*/

const watchListStore = useWatchlistStore()
const { isWatchListed, setWatchlistItem } = watchListStore
const { watchListedTokens, watchListedStocks } = storeToRefs(watchListStore)

const getWatchlistId = (token: DisplayToken) => {
  const isStock = token.ondo !== null && token.ondo?.primaryMarket?.symbol
  return isStock ? token.ondo!.primaryMarket.symbol : token.coinId
}

const setWatchlistToken = (token: DisplayToken) => {
  const isStock = !!(token.ondo !== null && token.ondo?.primaryMarket?.symbol)
  const id = getWatchlistId(token)
  setWatchlistItem(id, isStock)
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

/** -------------------------------
 * Buy/Trade/Swap/Bridge Button Actions
-------------------------------*/

const getTokenIsCurrentNative = (token: DisplayToken): boolean => {
  if (!selectedChainStore.value) {
    return false
  }
  const currentChainName = selectedChainStore.value.name
  return token.nativeChains.some(c => c.chainName === currentChainName)
}
const getIsBridgeable = (token: DisplayToken): boolean => {
  if (!selectedChainStore.value) {
    return false
  }
  const isNativeToken = token.nativeChains.length > 0
  const currentChainName = selectedChainStore.value.name
  const isNativeToCurrentChain = token.nativeChains.some(
    c => c.chainName === currentChainName,
  )
  const isAvailableOnCurrentChain = token.chains.some(
    c => c.chainName === currentChainName,
  )
  // Check if any native chain has swap support
  const hasSwapSupportChain = token.nativeChains.some(c =>
    chainsStore.chainHasSwapSupport(c.chainName),
  )
  if (isNativeToken && isNativeToCurrentChain) {
    return false
  }
  return isNativeToken && !isAvailableOnCurrentChain && hasSwapSupportChain
}
// A token has a "primary" action (trade / bridge / swap) in the desktop actions
// cell — mirrors the v-if/v-else-if chain in the template. Used to make a lone
// button span the full actions width so rows stay vertically aligned.
const hasPrimaryAction = (token: DisplayToken): boolean =>
  token.ondo !== null ||
  getIsBridgeable(token) ||
  (currentChainhasSwapSupport.value &&
    (token.chains.length > 0 || getTokenIsCurrentNative(token)))
const buyBtn = (token: DisplayToken, isMobile = false) => {
  analytics.trackClickTokenTradeEvent(ClickTokenTradeEvent.BUY, {
    location: 'crypto_table',
    token: token.symbol,
    isMobile,
  })
  analytics.trackCryptoMarketClickTokenEvent(CryptoMarketEvent.CLICK_TOKEN, {
    location: 'buy_button',
    tokenName: token.name,
    tokenSymbol: token.symbol,
  })
  setSelectedPurchaseCoinId(token.coinId ?? null)
  walletMenu.openPanel('purchase')
}
const bridgeBtn = (token: DisplayToken, isMobile = false) => {
  analytics.trackClickTokenTradeEvent(ClickTokenTradeEvent.BRIDGE, {
    location: 'crypto_table',
    token: token.symbol,
    isMobile,
  })
  analytics.trackCryptoMarketClickTokenEvent(CryptoMarketEvent.CLICK_TOKEN, {
    location: 'bridge_button',
    tokenName: token.name,
    tokenSymbol: token.symbol,
  })
  const selectedChain = (
    selectedChainFilter.value && selectedChainFilter.value.name !== 'all'
      ? selectedChainFilter.value
      : selectedChainStore.value
  ) as Chain
  // Find the first native chain with swap support
  const tokenOnChain = token.nativeChains.find(c =>
    chainsStore.chainHasSwapSupport(c.chainName),
  )

  if (!tokenOnChain) {
    console.error(
      'CLICK Bridge: No native chain with swap support found for this token.',
      token,
      selectedChain,
    )
    return
  }

  const targetToChain =
    chainsStore.allChains.find(c => c.name === tokenOnChain.chainName) ||
    selectedChain
  storeSwapValues({
    fromToken: {} as NewTokenInfo,
    toToken: {
      address: MAIN_TOKEN_CONTRACT,
      symbol: token.symbol,
      decimals: tokenOnChain?.decimals || 18,
      name: token.name,
    } as NewTokenInfo,
    fromAmount: '',
    toChain: targetToChain as Chain,
  })
  setWalletPanel('bridge')
  if (!isOpenSideMenu.value) {
    walletMenu.setIsOpenSideMenu(true)
  }
  if (!isMobile) {
    goToTokenPage(token)
  }
}
const swapBtn = (token: DisplayToken, isMobile = false) => {
  analytics.trackClickTokenTradeEvent(ClickTokenTradeEvent.SWAP, {
    location: 'crypto_table',
    token: token.symbol,
    isMobile,
  })
  analytics.trackCryptoMarketClickTokenEvent(CryptoMarketEvent.CLICK_TOKEN, {
    location: 'swap_button',
    tokenName: token.name,
    tokenSymbol: token.symbol,
  })
  const selectedChain = (
    selectedChainFilter.value && selectedChainFilter.value.name !== 'all'
      ? selectedChainFilter.value
      : selectedChainStore.value
  ) as Chain
  const _chains = getTokenIsCurrentNative(token)
    ? token.nativeChains
    : token.chains
  const _address = getTokenIsCurrentNative(token)
    ? MAIN_TOKEN_CONTRACT
    : token.chains.find(c => c.chainName === selectedChain?.name)?.address || ''

  const tokenOnChain =
    _chains.find(c => c.chainName === selectedChain?.name) || _chains[0]

  const targetToChain =
    chainsStore.chains.find(c => c.name === tokenOnChain.chainName) ||
    selectedChain
  if (_address === '') {
    console.error(
      'SWAP: No address found for this token on the selected chain.',
      token,
      selectedChain,
    )
    return
  }
  storeSwapValues({
    fromToken: {} as NewTokenInfo,
    toToken: {
      address: _address,
      symbol: token.symbol,
      decimals: tokenOnChain?.decimals || 18,
      name: token.name,
    } as NewTokenInfo,
    fromAmount: '',
    toChain: targetToChain as Chain,
  })
  setWalletPanel('swap')
  if (!isOpenSideMenu.value) {
    walletMenu.setIsOpenSideMenu(true)
  }
  if (!isMobile) {
    goToTokenPage(token)
  }
}

const tradeBtn = (token: DisplayToken, isMobile = false) => {
  analytics.trackClickTokenTradeEvent(ClickTokenTradeEvent.TRADE, {
    location: 'crypto_table',
    token: token.symbol,
    stock: token.ondo?.underlyingMarket.name,
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
  analytics.trackCryptoMarketClickSortEvent(CryptoMarketEvent.CLICK_SORT, {
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
  analytics.trackCryptoMarketSelectNetworkEvent(
    CryptoMarketEvent.SELECT_NETWORK,
    {
      networkName: chain.name,
      networkNameLong: chain.nameLong,
    },
  )
  activeSort.value = { label: chain.nameLong, value: chain.name }
  selectedChainFilter.value = chain
  openChainDialog.value = false
}

const cryptoFilterOptions = computed(() => [
  { label: t('crypto.all_categories'), value: 'all' },
  { label: t('crypto.watchlist'), value: 'watchlist' },
  { label: t('crypto.top_gainers'), value: 'topGainers' },
  { label: t('crypto.top_losers'), value: 'topLosers' },
  { label: t('crypto.stablecoins'), value: 'stablecoins' },
  { label: t('crypto.defi'), value: 'defi-index' },
  { label: t('crypto.meme'), value: 'meme-token' },
  { label: t('crypto.tiktok'), value: 'tiktok-meme' },
])

const selectedCryptoFilter = ref(cryptoFilterOptions.value[0])

// Deep-link: a home Industry Sectors tile opens /crypto?category=<value>.
// Preselect the matching filter so the list opens on that category.
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

interface DisplayToken extends Omit<
  GetWebTokensTableResponseToken,
  'price' | 'marketCap' | 'totalVolume'
> {
  price: string
  marketCap: string
  totalVolume: string
}
const tokens: Ref<DisplayToken[]> = ref([])
const page = ref<number>(1)
const totalPages = ref<number>(1)
const { useMEWFetch } = useFetchMewApi()

const {
  tokensWatchlistData,
  onTokensWatchlistResponse,
  stocksWatchlistData,
  fetchAllWatchlist,
  onStocksWatchlistResponse,
} = useFetchWatchlist(selectedChainFilter)

const fetchGainersUrl = computed(() => {
  const baseUrl = getAPIPath('/v1/web/tokens-table')
  const defaultChain =
    !selectedChainFilter.value || selectedChainFilter.value.name === 'all'
      ? ''
      : `filterChain=${selectedChainFilter.value.name}`
  const direction =
    selectedCryptoFilter.value.value !== 'topGainers' ? 'ASC' : 'DESC'
  return `${baseUrl}?${defaultChain}&page=${page.value}&perPage=${PER_PAGE}&sort=PRICE_CHANGE_PERCENTAGE_24H_${direction}&search=${searchInput.value}`
})

const fetchTableUrl = computed(() => {
  const baseUrl = getAPIPath('/v1/web/tokens-table')
  const defaultChain =
    !selectedChainFilter.value || selectedChainFilter.value.name === 'all'
      ? ''
      : `filterChain=${selectedChainFilter.value.name}`
  return `${baseUrl}?${defaultChain}&page=${page.value}&perPage=${PER_PAGE}&sort=${headerSort.value}_${tableDirection.value.toUpperCase()}&search=${searchInput.value}${selectedCryptoFilter.value.value !== 'all' ? '&category=' + selectedCryptoFilter.value.value : ''}`
})

const {
  data: fetchGainersData,
  onFetchResponse: onFetchGainersResponse,
  execute: fetchGainersTable,
} = useMEWFetch(fetchGainersUrl, {
  immediate: false,
})
  .get()
  .json<GetWebTokensTableResponse>()

const {
  data: fetchTokenData,
  onFetchResponse: onFetchTokenTableResponse,
  execute: fetchTokenTable,
} = useMEWFetch(fetchTableUrl, {
  immediate: false,
})
  .get()
  .json<GetWebTokensTableResponse>()

const debounceFetchTokens = useDebounceFn(() => {
  fetchTokenTable()
  tableContainer.value?.scrollTo(0, 0)
}, 100)
const debounceFetchWatchlist = useDebounceFn(() => {
  fetchAllWatchlist()
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

const formatToken = (item: GetWebTokensTableResponseToken): DisplayToken => {
  return {
    ...item,
    price: item.price ? formatFiat(item.price).display : '-',
    marketCap: item.marketCap ? formatFiat(item.marketCap).display : '-',
    totalVolume: item.totalVolume
      ? formatFiat(item.totalVolume).display
      : '-',
  }
}

const formatStock = (
  item: GetWebStocksWatchlistResponseStock,
): DisplayToken => {
  return {
    coinId: '',
    name: item.underlyingMarket.name,
    symbol: item.primaryMarket.symbol,
    logoUrl: item.iconPngUrl || item.iconSvgUrl || null,
    price: item.primaryMarket.price
      ? formatFiat(Number(item.primaryMarket.price)).display
      : '-',
    priceChangePercentage1h: null,
    priceChangePercentage24h: item.primaryMarket.priceChangePercentage24h
      ? Number(item.primaryMarket.priceChangePercentage24h)
      : null,
    priceChangePercentage7d: null,
    totalVolume: item.underlyingMarket.volume24h
      ? formatFiat(Number(item.underlyingMarket.volume24h)).display
      : '-',
    marketCap: item.underlyingMarket.marketCap
      ? formatFiat(Number(item.underlyingMarket.marketCap)).display
      : '-',
    addresses: {},
    nativeChains: [],
    chains: [],
    ondo: {
      stockAlias: item.stockAlias,
      iconPngUrl: item.iconPngUrl,
      iconSvgUrl: item.iconSvgUrl,
      primaryMarket: {
        symbol: item.primaryMarket.symbol,
      },
      underlyingMarket: {
        name: item.underlyingMarket.name,
      },
    },
    sparklineIn7d: item.primaryMarket.sparkline24h || null,
  }
}

const parseFormattedNumber = (value: string): number => {
  if (value === '-') return 0
  // Strip any currency symbol/prefix and grouping separators, keeping only
  // digits, decimal point, and the K/M/B/T magnitude suffixes.
  const cleaned = value.replace(/[^\d.KMBT]/g, '')
  // Handle K, M, B, T suffixes from formatIntegerValue
  const multipliers: Record<string, number> = {
    K: 1e3,
    M: 1e6,
    B: 1e9,
    T: 1e12,
  }
  const match = cleaned.match(/^([\d.]+)([KMBT])?$/)
  if (match) {
    const num = parseFloat(match[1])
    const suffix = match[2]
    return suffix ? num * multipliers[suffix] : num
  }
  return parseFloat(cleaned) || 0
}

const sortWatchlistTokens = (tokensList: DisplayToken[]): DisplayToken[] => {
  return [...tokensList].sort((a, b) => {
    let comparison = 0

    switch (headerSort.value) {
      case 'NAME':
        comparison = a.name.localeCompare(b.name)
        break
      case 'MARKET_CAP':
        comparison =
          parseFormattedNumber(a.marketCap) - parseFormattedNumber(b.marketCap)
        break
      case 'TOTAL_VOLUME':
        comparison =
          parseFormattedNumber(a.totalVolume) -
          parseFormattedNumber(b.totalVolume)
        break
      case 'PRICE':
        comparison =
          parseFormattedNumber(a.price) - parseFormattedNumber(b.price)
        break
      default:
        comparison = 0
    }

    return tableDirection.value === 'desc' ? -comparison : comparison
  })
}

onTokensWatchlistResponse(() => {
  // Only update tokens if watchlist filter is selected
  if (selectedCryptoFilter.value.value !== 'watchlist') return
  const tokensData =
    tokensWatchlistData.value?.map(item => formatToken(item)) || []
  const stocksData =
    stocksWatchlistData.value?.map(item => formatStock(item)) || []
  tokens.value = sortWatchlistTokens([...tokensData, ...stocksData])
  totalTokenCount.value = tokens.value.length
  totalPages.value = 1
  isLoading.value = false
})
onStocksWatchlistResponse(() => {
  // Only update tokens if watchlist filter is selected
  if (selectedCryptoFilter.value.value !== 'watchlist') return
  const tokensData =
    tokensWatchlistData.value?.map(item => formatToken(item)) || []
  const stocksData =
    stocksWatchlistData.value?.map(item => formatStock(item)) || []
  tokens.value = sortWatchlistTokens([...tokensData, ...stocksData])
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
    analytics.trackCryptoMarketSearchEvent(CryptoMarketEvent.SEARCH_TOKEN, {
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
    analytics.trackCryptoMarketFilterEvent(CryptoMarketEvent.SELECTED_FILTER, {
      value: selectedCryptoFilter.value.value,
    })
  },
)

// Reset page to 1 when the category filter changes
watch(
  () => selectedCryptoFilter.value,
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
  cryptoFilter: selectedCryptoFilter.value,
})

watch(
  () => [
    selectedChainFilter.value,
    page.value,
    headerSort.value,
    tableDirection.value,
    selectedCryptoFilter.value,
  ],
  () => {
    const prev = prevWatchValues.value
    const isOnlyHeaderSortChanged =
      prev.chain === selectedChainFilter.value &&
      prev.page === page.value &&
      prev.cryptoFilter === selectedCryptoFilter.value &&
      (prev.headerSort !== headerSort.value ||
        prev.tableDirection !== tableDirection.value)

    // Update previous values
    prevWatchValues.value = {
      chain: selectedChainFilter.value,
      page: page.value,
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
    } else if (
      selectedCryptoFilter.value.value === 'watchlist' &&
      (watchListedTokens.value.length > 0 || watchListedStocks.value.length > 0)
    ) {
      fetchAllWatchlist()
    } else {
      fetchTokenTable()
    }
  },
  {
    deep: true,
  },
)

/**-------------------------------
 * 24h change (fixed column — matches Figma table design)
 --------------------------------*/
const getActivePercent = (token: DisplayToken) => token.priceChangePercentage24h

const getSparkLinePoints = (token: DisplayToken) => {
  if (token.sparklineIn7d && token.sparklineIn7d.length > 0) {
    // Last 24h slice of the 7d sparkline (7 days of points → ~1 day).
    const totalPoints = token.sparklineIn7d.length / 7
    return token.sparklineIn7d.slice(-totalPoints)
  }
  return []
}

/**-------------------------------
 * Token Link
 --------------------------------*/
const router = useRouter()

// Keep the URL `?category=` in sync with the selected filter so it is shareable,
// survives a reload, and round-trips with the home Industry Sectors deep-links
// (which are read on mount, above).
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
  analytics.trackCryptoMarketClickTokenEvent(CryptoMarketEvent.CLICK_TOKEN, {
    location: 'token_row',
    tokenName: token.name,
    tokenSymbol: token.symbol,
  })
  goToTokenPage(token)
}

const getTokenRoute = (token: DisplayToken) => {
  if (token.ondo !== null && token.ondo.primaryMarket.symbol) {
    return {
      name: STOCK_INFO_ROUTE_NAMES.crypto,
      params: { symbol: token.ondo.primaryMarket.symbol },
    }
  }
  return {
    name: TOKEN_INFO_ROUTE_NAMES.crypto,
    params: { tokenId: token.coinId },
  }
}

const goToTokenPage = (token: DisplayToken) => {
  router.push(getTokenRoute(token))
}
</script>
