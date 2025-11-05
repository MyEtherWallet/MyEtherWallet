<template>
  <div class="flex flex-col gap-2 xl:gap-3 w-full">
    <h1 class="text-s-20 lg:text-s-32 2xl:text-s-40 font-bold rounded-32 ml-2">
      Explore Crypto Tokens
    </h1>

    <div class="basis-full">
      <div class="flex flex-wrap justify-start items-center gap-2">
        <!-- Mobile to MD only Categories and Chain Filter-->
        <app-select
          v-model:selected="selectedCryptoFilter"
          :options="cryptoFilterOptions"
          position="left-0"
          placeholder="Category Menu"
          class="w-full xs:w-auto md:hidden"
        >
          <template #select-button="{ toggleSelect }">
            <div class="bg-surface rounded-full p-1 w-full xs:w-auto">
              <button
                class="rounded-full bg-white py-3 w-full xs:w-auto xs:min-w-[180px] px-5 shadow-button"
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
        <div class="bg-surface rounded-full p-1 md:hidden w-full xs:w-auto">
          <button
            class="rounded-full bg-white py-2 px-3 shadow-button h-[42px] w-full xs:min-w-[180px]"
            @click="openChainDialog = true"
          >
            <div class="flex items-center justify-start gap-2">
              <app-token-logo
                v-if="selectedChainFilter?.nameLong !== 'All Chains'"
                :url="selectedChainFilter?.icon"
                :symbol="selectedChainFilter?.nameLong"
                width="w-6"
                height="h-6"
              />
              <span
                class="text-s-16 font-medium truncate"
                :class="{
                  'ml-2': selectedChainFilter?.nameLong === 'All Chains',
                }"
              >
                {{ selectedChainFilter?.nameLong }}</span
              >
              <chevron-down-icon class="w-4 h-4 ml-auto" />
            </div>
          </button>
        </div>
        <!-- Search and Filter Chains-->
        <div
          class="flex grow gap-4 justify-between items-center bg-surface rounded-full p-1 w-full md:w-auto md:min-w-[400px]"
        >
          <app-search-input v-model="searchInput" class="grow" />
          <button
            class="rounded-full hoverNoBG p-2 hidden md:flex"
            @click="openChainDialog = true"
          >
            <div class="flex items-center">
              <app-token-logo
                v-if="selectedChainFilter?.nameLong !== 'All Chains'"
                :url="selectedChainFilter?.icon"
                :symbol="selectedChainFilter?.nameLong"
                width="w-5"
                height="h-5"
                class="mr-2"
              />
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
      </div>

      <div class="mt-3 bg-white rounded-16 shadow-button py-4 px-2">
        <div class="static" ref="tableContainer">
          <table class="w-full text-sm table-fixed">
            <!-- Header-->
            <thead class="bg-white">
              <tr
                class="text-left text-s-11 uppercase text-info tracking-sp-06"
              >
                <!-- Watchlist -->
                <th class="w-8 sm:w-9 3xl:w-10 hidden sm:table-cell"></th>
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
                  class="cursor-pointer pl-1 pr-4 xs:px-1 py-2 hover:text-black transition-colors"
                >
                  <div
                    class="flex items-center gap-1 justify-end relative text-right"
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
                <th class="hidden sm:table-cell">
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
                  class="pl-1 pr-3 py-2 text-right w-10 xs:w-12 sm:w-16 md:w-20 lg:w-auto 3xl:w-[180px]"
                >
                  <p class="hidden lg:block">Actions</p>
                </th>
              </tr>
            </thead>
            <!-- Body-->
            <tbody v-if="!isLoading">
              <div
                v-if="
                  watchListedTokens.length === 0 &&
                  selectedCryptoFilter.value === 'watchlist'
                "
                class="text-nowrap px-3"
              >
                <h3>No watchlisted tokens</h3>
              </div>
              <tr
                v-for="token in tokens"
                :key="token.name + token.marketCap"
                class="h-14 hoverBGWhite cursor-pointer"
                @click="goToTokenPage(token)"
              >
                <!-- Watchlist -->
                <td class="sm:pr-1 hidden sm:table-cell rounded-l-12">
                  <button
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
                      name: TOKEN_INFO_ROUTE_NAMES.crypto,
                      params: {
                        tokenId: token.coinId,
                      },
                    }"
                    class="flex items-center gap-3"
                  >
                    <app-token-logo
                      :url="token.logoUrl"
                      :symbol="token.symbol"
                    />
                    <div class="truncate">
                      <p class="truncate">{{ token.name }}</p>
                      <p class="text-info text-s-12 uppercase">
                        {{ truncate(token.symbol, 7) }}
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
                  class="px-1 py-1 text-right hidden sm:table-cell text-s-11 leading-p-100"
                  :class="getPercentClass(getActivePercent(token))"
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
                      :percent-change="getActivePercent(token) || undefined"
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
                          <div
                            v-if="token.coinId"
                            class="sm:hidden flex items-center p-2"
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
                            class="h-px bg-grey-outline border-0 w-full my-2 sm:hidden"
                          />

                          <ul>
                            <li
                              @click.stop="[toggleMenu, buyBtn()]"
                              class="p-2 flex items-center"
                            >
                              <icon-buy class="text-primary w-4 h-4 mr-2" />
                              <p>Buy</p>
                            </li>
                            <li
                              @click.stop="[toggleMenu, swapBtn(token, true)]"
                              class="p-2 flex items-center"
                            >
                              <icon-swap class="text-primary w-4 h-4 mr-2" />
                              <p>Swap</p>
                            </li>
                            <li
                              @click.stop="[toggleMenu, bridgeBtn(token, true)]"
                              class="p-2 flex items-center"
                            >
                              <icon-bridge class="text-primary w-4 h-4 mr-2" />
                              <p>Bridge</p>
                            </li>
                          </ul>
                        </div>
                      </template>
                    </app-pop-up-menu>
                  </div>
                  <div
                    class="hidden lg:flex flex-row gap-1 justify-end flex-wrap"
                  >
                    <app-base-button
                      size="small"
                      @click="buyBtn()"
                      is-outline
                      class="hidden 3xl:block"
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
            class="text-info ml-4 order-3 xs:order-1 flex-none text-center xs:text-left"
            >{{ tokens.length * page }} of {{ totalTokenCount }} results</small
          >
          <div class="flex items-center gap-2 order-2 xs:order-2">
            <app-btn-icon
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
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import IconBridge from '@/assets/icons/core_menu/icon-bridge.vue'
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
import { useDebounceFn } from '@vueuse/core'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { type AppSelectOption } from '@/types/components/appSelect'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { ALL_CHAINS } from '@/components/select_chain/helpers'
import { useRouter } from 'vue-router'
import { TOKEN_INFO_ROUTE_NAMES } from '@/router/routeNames'

const walletMenu = useWalletMenuStore()
const { setWalletPanel } = walletMenu
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
  { label: 'All Tokens', value: 'all' },
  { label: 'Top Gainers', value: 'topGainers' },
  { label: 'Top Losers', value: 'topLosers' },
  { label: 'Watchlist', value: 'watchlist' },
  { label: 'Stablecoins', value: 'stablecoins' },
  { label: 'DeFi', value: 'defi-index' },
  { label: 'MEME', value: 'meme-token' },
  { label: 'TikTok', value: 'tiktok-meme' },
])

const selectedCryptoFilter = ref(cryptoFilterOptions.value[0])

interface DisplayToken
  extends Omit<
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
} = useMEWFetch(fetchGainersUrl, {
  immediate: false,
})
  .get()
  .json<GetWebTokensTableResponse>()

const {
  data: fetchWatchlistData,
  onFetchResponse: onFetchWatchlistResponse,
  execute: fetchWatchlistTable,
  onFetchError: onFetchWatchlistError,
} = useMEWFetch(fetchWatchListUrl, {
  immediate: false,
})
  .get()
  .json<GetWebTokensWatchlistResponse>()

const {
  data: fetchTokenData,
  onFetchResponse: onFetchTokenTableResponse,
  execute: fetchTokenTable,
  onFetchError: onFetchTokenTableError,
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
    // TODO: update this to convert price to user selected currency
    price: item.price ? `$${formatFiatValue(item.price).value}` : '-',
    marketCap: item.marketCap
      ? `$${formatIntegerValue(item.marketCap).value}`
      : '-',
    totalVolume: item.totalVolume
      ? `$${formatIntegerValue(item.totalVolume).value}`
      : '-',
  }
}
onFetchWatchlistResponse(() => {
  totalTokenCount.value = fetchWatchlistData.value?.length ?? 0
  totalPages.value = 1
  if (fetchWatchlistData.value) {
    tokens.value = fetchWatchlistData.value.map(item => formatToken(item)) || []
  }
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
  if (val === null || val === undefined) return '-'
  return formatPercentageValue(val ?? 0).value
}

const getPercentClass = (val: number | null): string => {
  if (val === null || val === undefined) return ''
  if (val > 0) return 'text-success'
  if (val < 0) return 'text-error'
  return 'text-primary'
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
    } else if (
      selectedCryptoFilter.value.value === 'watchlist' &&
      watchListedTokens.value.length > 0
    ) {
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

const getActivePercent = (token: DisplayToken) => {
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

const getSparkLinePoints = (token: DisplayToken) => {
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

/**-------------------------------
 * Token Link
 --------------------------------*/
const router = useRouter()

const goToTokenPage = (token: DisplayToken) => {
  router.push({
    name: TOKEN_INFO_ROUTE_NAMES.crypto,
    params: { tokenId: token.coinId },
  })
}
</script>
