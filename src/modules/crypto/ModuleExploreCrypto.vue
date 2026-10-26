<template>
  <div class="basis-full w-full">
    <AppTableWrapper :title="$t('crypto.explore_tokens')">
      <template #toolbar="{ size }">
        <app-searchbar
          v-model="searchInput"
          bg-class="bg-background-default"
          size="compact"
          :placeholder="$t('crypto.search')"
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

        <!-- Network filter -->
        <button
          class="flex items-center justify-between gap-2 bg-background-default hover:bg-background-default-hover transition-colors rounded-full h-10 px-4"
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
          <AppIcon
            name="chevron-down"
            variant="filled"
            size="xxs"
            class="shrink-0 text-text-subtle"
          />
        </button>
      </template>

      <AppTable
        v-if="isLoading || tokens.length > 0"
        v-model:sort="sort"
        v-model:page="page"
        :columns="columns"
        :pages="totalPages"
        :pagination-label="isLoading ? blankLabel : undefined"
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
            :title="token.symbol.toUpperCase()"
            :description="getTokenDisplayName(token)"
            :watchlisted="isWatchListed(getWatchlistId(token))"
            @update:watchlisted="setWatchlistToken(token)"
            @click="onRowClick(token)"
          >
            <template v-if="token.ondo !== null" #title>
              {{ stockBaseSymbol(token.symbol)
              }}<span class="bg-stock-gradient bg-clip-text text-transparent"
                >on</span
              >
            </template>
            <template #avatar="{ size: avatarSize }">
              <app-token-logo
                :url="token.logoUrl"
                :symbol="token.symbol"
                :is-stock="token.ondo !== null"
                :width="avatarSize === 'l' ? 'w-10' : 'w-8'"
                :height="avatarSize === 'l' ? 'h-10' : 'h-8'"
                no-shadow
              />
            </template>
            <AppTableCell
              column="MARKET_CAP"
              :value="token.marketCap"
              :change="
                size === 's'
                  ? (token.priceChangePercentage24h ?? undefined)
                  : undefined
              "
            />
            <AppTableCell column="TOTAL_VOLUME" :value="token.totalVolume" />
            <AppTableCell
              column="CHANGE"
              :value="token.priceChangePercentage24h === null ? '-' : undefined"
              :change="token.priceChangePercentage24h ?? undefined"
              :series="
                getSparkLinePoints(token).length
                  ? getSparkLinePoints(token)
                  : undefined
              "
            />
            <AppTableCell column="PRICE" :value="token.price" />
            <template #actions="{ size: actionSize, surface }">
              <app-pop-up-menu
                v-if="actionSize === 's'"
                :placeholder="$t('common.action_menu')"
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
                    <button
                      v-if="token.coinId || token.ondo"
                      class="xs:hidden flex items-center p-2 hoverBGWhite rounded-12"
                      @click.stop="[setWatchlistToken(token), toggleMenu()]"
                    >
                      <AppIcon
                        name="star"
                        :variant="
                          isWatchListed(getWatchlistId(token))
                            ? 'filled'
                            : 'stroke'
                        "
                        size="xxs"
                      />
                      <span class="ml-2">{{
                        isWatchListed(getWatchlistId(token))
                          ? $t('common.remove_from_watchlist')
                          : $t('common.add_to_watchlist')
                      }}</span>
                    </button>
                    <app-divider
                      v-if="
                        isBuyableOnCompatibleChain(token.coinId) ||
                        token.ondo !== null ||
                        getIsBridgeable(token) ||
                        token.chains.length > 0 ||
                        getTokenIsCurrentNative(token)
                      "
                      class="my-1 xs:hidden"
                    />
                    <ul>
                      <li
                        v-if="isBuyableOnCompatibleChain(token.coinId)"
                        @click.stop="[toggleMenu(), buyBtn(token, true)]"
                        class="p-2 flex items-center hoverBGWhite rounded-12"
                      >
                        <icon-buy class="text-text-brand w-4 h-4 mr-2" />
                        <p>{{ $t('common.buy') }}</p>
                      </li>
                      <li
                        v-if="token.ondo !== null"
                        @click.stop="[tradeBtn(token, true), toggleMenu()]"
                        class="p-2 flex items-center hoverBGWhite rounded-12"
                      >
                        <icon-trade class="text-text-brand w-4 h-4 mr-2" />
                        <p>{{ $t('crypto.trade') }}</p>
                      </li>
                      <li
                        v-else-if="getIsBridgeable(token)"
                        @click.stop="[toggleMenu(), bridgeBtn(token, true)]"
                        class="p-2 flex items-center hoverBGWhite rounded-12"
                      >
                        <icon-bridge class="text-text-brand w-4 h-4 mr-2" />
                        <p>{{ $t('crypto.bridge') }}</p>
                      </li>
                      <li
                        v-else-if="canSwap(token)"
                        @click.stop="[toggleMenu(), swapBtn(token, true)]"
                        class="p-2 flex items-center hoverBGWhite rounded-12"
                      >
                        <icon-swap class="text-text-brand w-4 h-4 mr-2" />
                        <p>{{ $t('common.swap') }}</p>
                      </li>
                    </ul>
                  </div>
                </template>
              </app-pop-up-menu>
              <!-- One primary action at L and M, tonal like Stocks (QA MEW-2324) -->
              <AppBaseButton
                v-else-if="token.ondo !== null"
                type="secondary"
                size="medium"
                class="w-24"
                :surface="surface"
                @click="tradeBtn(token)"
                >{{ $t('crypto.trade') }}
              </AppBaseButton>
              <AppBaseButton
                v-else-if="getIsBridgeable(token)"
                type="secondary"
                size="medium"
                class="w-24"
                :surface="surface"
                @click="bridgeBtn(token)"
                >{{ $t('crypto.bridge') }}
              </AppBaseButton>
              <AppBaseButton
                v-else-if="canSwap(token)"
                type="secondary"
                size="medium"
                class="w-24"
                :surface="surface"
                @click="swapBtn(token)"
                >{{ $t('common.swap') }}
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
          <AppIcon name="arrow-up" size="xxs" class="rotate-90 inline-flex" />
        </button>
      </div>
    </AppTableWrapper>
    <select-chain-dialog
      v-if="isLoadedChains"
      v-model:is-open="openChainDialog"
      :selected-chain="selectedChainFilter"
      has-all
      :filter-by-selected-chain-type="false"
      @update:chain="setSelectedChain"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, watch, type Ref } from 'vue'
import { getTokenDisplayName, stockBaseSymbol } from '@/utils/tokenDisplayName'
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
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import IconBridge from '@/assets/icons/core_menu/icon-bridge.vue'
import IconTrade from '@/assets/icons/core_menu/icon-trade.vue'
import SelectChainDialog from '@/components/select_chain/SelectChainDialog.vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import type {
  Chain,
  GetWebTokensTableResponse,
  GetWebTokensTableResponseToken,
  GetWebTokensWatchlistResponseToken,
  GetWebStocksWatchlistResponseStock,
} from '@/mew_api/types'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
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
import type { NewTokenInfo } from '@/stores/swapStore'
import { useInputStore } from '@/stores/inputStore'
import { getAPIPath } from '@/utils/constructAPIPath'
import { analytics, ClickTokenTradeEvent, CryptoMarketEvent } from '@/analytics'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppDivider from '@/components/divider/AppDivider.vue'

const { t } = useI18n()
const { formatFiat } = useCurrency()

const walletMenu = useWalletMenuStore()
const {
  setWalletPanel,
  setSelectedTradeTokenSymbol,
  setSelectedPurchaseCoinId,
} = walletMenu
const { isOpenSideMenu } = storeToRefs(walletMenu)

const purchaseStore = usePurchaseStore()
const inputStore = useInputStore()
const { isBuyableOnCompatibleChain } = purchaseStore
const { storeSwapValues } = inputStore

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
const canSwap = (token: DisplayToken): boolean =>
  currentChainhasSwapSupport.value &&
  (token.chains.length > 0 || getTokenIsCurrentNative(token))
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
    stock: token.ondo?.stockAlias || token.ondo?.underlyingMarket?.name,
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
  { key: 'NAME', label: t('crypto.token'), sortable: true },
  { key: 'MARKET_CAP', label: t('crypto.market_cap'), sortable: true },
  { key: 'TOTAL_VOLUME', label: t('crypto.volume'), sortable: true },
  { key: 'CHANGE', label: t('crypto.twenty_four_h_change') },
  { key: 'PRICE', label: t('crypto.price'), sortable: true },
])

const sort = computed<TableSort | null>({
  get: () => ({ key: headerSort.value, direction: tableDirection.value }),
  set: next => {
    analytics.trackCryptoMarketClickSortEvent(CryptoMarketEvent.CLICK_SORT, {
      sortOption: (next?.key ?? headerSort.value).toLowerCase(),
    })
    headerSort.value = next?.key ?? 'MARKET_CAP'
    tableDirection.value = next?.direction ?? 'desc'
  },
})

// totalPages is stale until the fetch lands, so the page label stays blank.
const blankLabel = () => ''

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

const debounceFetchTokens = useDebounceFn(fetchTokenTable, 100)
const debounceFetchWatchlist = useDebounceFn(fetchAllWatchlist, 100)
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

// Serves both the token table and the watchlist. The two endpoints agree on
// every field except ondo.underlyingMarket.name, which the watchlist types as
// optional — normalize onto the table shape so both map to one DisplayToken.
// The alias wins over the underlying market's name wherever both are present.
const formatToken = (
  item: GetWebTokensTableResponseToken | GetWebTokensWatchlistResponseToken,
): DisplayToken => {
  return {
    ...item,
    price: item.price ? formatFiat(item.price).display : '-',
    marketCap: item.marketCap ? formatFiat(item.marketCap).display : '-',
    totalVolume: item.totalVolume ? formatFiat(item.totalVolume).display : '-',
    ondo: item.ondo
      ? {
          ...item.ondo,
          underlyingMarket: item.ondo.underlyingMarket
            ? {
                name:
                  item.ondo.stockAlias || item.ondo.underlyingMarket.name || '',
              }
            : null,
        }
      : null,
  }
}

const formatStock = (
  item: GetWebStocksWatchlistResponseStock,
): DisplayToken => {
  return {
    coinId: '',
    // Portfolio tokens have no single underlying market, so the API sends
    // underlyingMarket as null and the alias carries the display name.
    name: item.stockAlias || item.underlyingMarket?.name || '',
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
    totalVolume: item.underlyingMarket?.volume24h
      ? formatFiat(Number(item.underlyingMarket.volume24h)).display
      : '-',
    marketCap: item.underlyingMarket?.marketCap
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
      underlyingMarket: item.underlyingMarket
        ? { name: item.underlyingMarket.name }
        : null,
      constituentTokens: item.constituentTokens,
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

const getSparkLinePoints = (token: DisplayToken) => {
  // Stocks store their 24h series directly in `sparklineIn7d` (see formatStock),
  // so return it whole rather than slicing a 7d series down to ~24h.
  if (token.ondo !== null) {
    return token.sparklineIn7d || []
  }
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
