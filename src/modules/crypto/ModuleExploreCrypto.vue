<template>
  <div class="flex flex-col gap-2 xl:gap-3 w-full">
    <div
      class="flex flex-col sm:flex-row flex-wrap justify-between sm:items-center gap-4 mt-8 mb-3 px-2"
    >
      <h1 class="text-s-24 xs:text-s-32 font-bold">Explore Tokens</h1>

      <div class="hidden lg:flex lg:items-center bg-grey-5 rounded-full">
        <app-btn-group
          v-model:selected="selectedCryptoFilter"
          :btn-list="cryptoFilterOptions.slice(0, 4)"
          size="large"
          class="flex-nowrap"
        >
          <template #btn-content="{ data }">
            <span class="px-2">{{ data.label }}</span>
          </template>
          <template #custom>
            <app-select
              v-model:selected="selectedCryptoFilter"
              :options="
                cryptoFilterOptions.slice(4, cryptoFilterOptions.length)
              "
              position="-right-1"
            >
              <template #select-button="{ toggleSelect }">
                <button
                  class="min-h-10 rounded-full hoverNoBG px-3 flex items-center gap-1"
                  @click="toggleSelect"
                >
                  <span class="font-medium text-s-17">More</span>
                  <chevron-down-icon class="w-4 h-4" />
                </button>
              </template>
            </app-select>
          </template>
        </app-btn-group>
      </div>

      <app-select
        v-model:selected="selectedCryptoFilter"
        :options="cryptoFilterOptions"
        position="right-0"
        placeholder="Category Menu"
        class="lg:hidden"
      >
        <template #select-button="{ toggleSelect }">
          <div class="bg-surface rounded-full p-1 w-full sm:w-auto">
            <button
              class="rounded-full bg-white py-3 w-full min-w-[180px] px-5 shadow-button"
              @click="toggleSelect"
            >
              <div class="flex items-center justify-between gap-1">
                <span class="text-s-16 font-medium truncate">
                  {{ selectedCryptoFilter.label }}</span
                >
                <chevron-down-icon class="w-4 h-4" />
              </div>
            </button>
          </div>
        </template>
      </app-select>
    </div>

    <div class="basis-full">
      <div class="bg-white rounded-16 py-4 px-2">
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between px-2 sm:pt-2 pb-6 mb-4 sm:gap-6 border-b border-grey-5"
        >
          <button
            class="xs:hidden mb-3 bg-white hoverBGWhite py-2 px-4 rounded-20 w-full shadow-button shadow-button-elevated transition-all"
            @click="openChainDialog = true"
          >
            <div class="flex items-center">
              <app-token-logo
                v-if="selectedChainFilter?.nameLong !== 'All Chains'"
                :url="selectedChainFilter?.icon"
                :symbol="selectedChainFilter?.nameLong"
                width="w-6"
                height="h-6"
                class="mr-2"
              />
              <span
                v-if="selectedChainFilter"
                class="text-s-14 leading-p-140 font-medium"
                >{{ selectedChainFilter.nameLong }}</span
              >
              <chevron-down-icon class="ml-auto w-4 h-4 ml-2" />
            </div>
          </button>
          <div
            class="flex grow gap-4 justify-between items-center bg-surface rounded-full p-1 w-full xs:max-w-[600px]"
          >
            <app-search-input
              v-model="searchInput"
              class="grow"
              placeholder="Search"
            />
            <button
              class="hidden xs:block rounded-full hoverNoBG p-2 flex h-10"
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
                  class="text-s-14 leading-p-140 font-medium text-nowrap"
                  >{{ selectedChainFilter.nameLong }}</span
                >
                <chevron-down-icon class="w-4 h-4 ml-2" />
              </div>
            </button>
          </div>
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
                <th class="hidden xs:table-cell xs:w-10 pb-4 text-center"></th>
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
                    TOKEN
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
                <!-- 24h % -->
                <th class="hidden xs:table-cell pb-4">
                  <app-select
                    v-model:selected="activePercent"
                    :options="percentOptions"
                    class="text-black !text-s-14"
                    position="right-0"
                  >
                    <template #select-button="{ toggleSelect }">
                      <button
                        class="px-1 text-right !uppercase font-bold text-s-11 text-info tracking-sp-06 hover:text-black transition-colors capitalize w-full"
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
                <!-- Market Cap -->
                <th
                  class="cursor-pointer px-1 pb-4 hover:text-black transition-colors hidden md:table-cell"
                >
                  <div
                    class="flex items-center gap-1 justify-end relative text-right font-bold"
                    :class="{
                      'text-black': headerSort === 'MARKET_CAP',
                    }"
                    @click="setHeaderSort('MARKET_CAP')"
                  >
                    MARKET CAP
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
                <!-- Price / Volume -->
                <th
                  class="cursor-pointer pl-1 pr-6 pb-4 hover:text-black transition-colors"
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
                  class="lg:pl-6 lg:pr-4 pb-4 text-right w-7 xs:w-10 md:w-12 lg:w-[180px] xl:w-[188px] 2xl:w-[200px]"
                ></th>
              </tr>
            </thead>
            <!-- Body-->
            <tbody v-if="!isLoading">
              <tr
                v-for="token in tokens"
                :key="token.name + token.marketCap"
                class="h-14 cursor-pointer hoverBGWhite"
                @click="goToTokenPage(token)"
              >
                <!-- Watchlist -->
                <td
                  class="hidden xs:table-cell xs:w-10 rounded-l-12 text-center"
                >
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
                <!-- Name & Symbol -->
                <td class="px-1 py-1 rounded-l-12 xs:rounded-none" colspan="2">
                  <div class="flex items-center gap-3">
                    <app-token-logo
                      :url="token.logoUrl"
                      :symbol="token.symbol"
                      class="inline-block rounded-full shadow-token"
                    />
                    <div class="truncate">
                      <p
                        class="truncate font-medium text-s-15 max-w-[100px] md:max-w-[200px] lg:max-w-[300px] text-black"
                      >
                        {{ token.name }}
                      </p>
                      <p class="text-info text-s-12 mt-0.5">
                        <span class="uppercase font-normal text-info">{{
                          truncate(token.symbol, 7)
                        }}</span>
                      </p>
                    </div>
                  </div>
                </td>
                <!-- 24H % -->
                <td class="hidden xs:table-cell px-1 py-1 text-right">
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
                <!-- Market Cap -->
                <td
                  class="hidden md:table-cell px-1 py-1 text-right font-normal text-s-14 text-black"
                >
                  {{ token.marketCap }}
                </td>
                <!-- Price / Volume -->
                <td class="pl-1 pr-1 py-1 text-right">
                  <p class="font-normal text-s-14 text-black">
                    {{ token.price }}
                  </p>
                  <p
                    v-if="token.totalVolume !== '-'"
                    class="text-info text-s-12 mt-0.5 whitespace-nowrap"
                  >
                    Vol: {{ token.totalVolume }}
                  </p>
                </td>
                <!-- Actions -->
                <td
                  class="lg:pl-6 xl:pl-8 2xl:pl-10 lg:pr-2 py-1 rounded-r-12 relative text-right"
                >
                  <div
                    class="flex items-center justify-end lg:hidden ml-auto -mr-1 md:mr-auto"
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
                              v-if="isBuyable(token.coinId)"
                              @click.stop="[toggleMenu, buyBtn()]"
                              class="p-2 flex items-center hoverBGWhite rounded-12"
                            >
                              <icon-buy class="text-primary w-4 h-4 mr-2" />
                              <p>Buy</p>
                            </li>
                            <li
                              @click.stop="[toggleMenu, swapBtn(token, true)]"
                              class="p-2 flex items-center hoverBGWhite rounded-12"
                            >
                              <icon-swap class="text-primary w-4 h-4 mr-2" />
                              <p>Swap</p>
                            </li>
                            <li
                              @click.stop="[toggleMenu, bridgeBtn(token, true)]"
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
                  <div class="hidden lg:flex flex-row gap-2 justify-start">
                    <app-base-button
                      size="small"
                      @click="swapBtn(token)"
                      class="min-w-[70px]"
                      >Swap
                    </app-base-button>
                    <app-base-button
                      v-if="isBuyable(token.coinId)"
                      size="small"
                      @click="buyBtn()"
                      is-outline
                      class="min-w-[70px]"
                      >Buy</app-base-button
                    >
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
              You dont have any watchlisted tokens.
            </p>
            <p v-if="searchInput" class="mb-1 text-center lg:my-10">
              No results found for "{{ searchInput }}".
            </p>
            <button
              v-if="selectedCryptoFilter.value === 'watchlist' && !searchInput"
              class="underline lg:mb-10"
              @click="selectedCryptoFilter = cryptoFilterOptions[0]"
            >
              Discover more tokens
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
            v-if="!isLoading"
            class="text-info order-3 xs:order-1 mb-4 xs:mb-0"
          >
            {{ getCurrentViewableItemsIndex }} of {{ totalTokenCount }} results
          </div>
          <div class="flex items-center gap-4 order-1 xs:order-2 mb-4 xs:mb-0">
            <app-btn-icon
              :disabled="!isLoading && page === 1"
              label="previous page"
              @click="previousPage"
            >
              <ChevronLeftIcon class="w-4 h-4" />
            </app-btn-icon>

            <div class="flex items-center gap-2">
              <span class="text-black">{{ page }}</span>
              <span class="text-info">of</span>
              <span class="text-info">{{ totalPages }}</span>
            </div>
            <app-btn-icon
              :disabled="!isLoading && page >= totalPages"
              label="next page"
              @click="nextPage"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </app-btn-icon>
          </div>
          <div class="flex items-center gap-2 order-2 xs:order-3 mb-4 xs:mb-0">
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
                  <ChevronDownIcon class="w-4 h-4 text-info" />
                </button>
              </template>
            </app-select>
          </div>
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
import { usePurchaseStore } from '@/stores/purchaseStore'
import type { NewTokenInfo } from '@/composables/useSwap'
import { useInputStore } from '@/stores/inputStore'

const walletMenu = useWalletMenuStore()
const { setWalletPanel } = walletMenu
const { isOpenSideMenu } = storeToRefs(walletMenu)

const purchaseStore = usePurchaseStore()
const inputStore = useInputStore()
const { isBuyable } = purchaseStore
const { storeSwapValues } = inputStore

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
  window.open(
    'https://ccswap.myetherwallet.com/',
    '_blank',
    'noopener,noreferrer',
  )
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
  const selectedChain = (
    selectedChainFilter.value && selectedChainFilter.value.name !== 'all'
      ? selectedChainFilter.value
      : selectedChainStore.value
  ) as Chain

  const tokenOnChain =
    token.chains.find(c => c.chainName === selectedChain?.name) ||
    token.chains[0]

  const targetToChain =
    chainsStore.chains.find(c => c.name === tokenOnChain.chainName) ||
    selectedChain

  storeSwapValues({
    fromToken: {} as NewTokenInfo,
    toToken: {
      address: tokenOnChain?.address || '',
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
const getCurrentViewableItemsIndex = computed<number>(() => {
  const viewing = Number(activeShownItems.value.value) * page.value
  if (viewing > totalTokenCount.value) {
    return totalTokenCount.value
  }
  return viewing
})

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
