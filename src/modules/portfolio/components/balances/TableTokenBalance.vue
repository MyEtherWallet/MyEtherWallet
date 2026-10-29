<template>
  <div v-if="isWalletConnected">
    <!-- The coming-soon (earning) view has no search: unbound hides it. -->
    <AppTableWrapper
      :search="isComingSoon ? undefined : searchInput"
      :title="$t('portfolio.your_balances')"
      title-tag="h1"
      @update:search="searchInput = $event ?? ''"
    >
      <template #filters="{ size }">
        <slot name="filters" :size="size" />
        <app-pop-up-menu
          v-if="!isComingSoon && view !== 'watchlist'"
          :placeholder="$t('common.action_menu')"
          location="right"
        >
          <template #menu-button="{ toggleMenu }">
            <app-btn-icon
              :label="$t('common.action_menu')"
              @click.stop="toggleMenu"
            >
              <AppIcon name="ellipsis-vertical" variant="filled" size="s" />
            </app-btn-icon>
          </template>
          <template #menu-content="{ toggleMenu }">
            <div class="px-2 py-3 bg-white rounded-xl min-w-[230px]">
              <button
                class="flex items-center w-full p-2 hoverBGWhite rounded-12 text-s-14"
                @click.stop="[toggleShowBalance(), toggleMenu()]"
              >
                <span class="grow text-left">{{
                  $t('portfolio.table.hide_no_value')
                }}</span>
                <span
                  class="ml-2 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                  :class="
                    !hideLowBalance
                      ? 'bg-background-brand border-border-brand'
                      : 'border-border-hover'
                  "
                >
                  <svg
                    v-if="!hideLowBalance"
                    class="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 12 12"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </template>
        </app-pop-up-menu>
        <!-- TOTAL VALUE-->
        <div v-if="!isComingSoon" class="ml-auto text-right">
          <p
            class="font-bold text-text-subtle uppercase tracking-sp-06 text-s-14"
          >
            {{ $t('portfolio.table.total_value') }}
          </p>
          <p
            v-if="!isLoading"
            class="text-s-24 font-bold rounded-12 leading-none text-black"
          >
            {{ totalValue }}
          </p>
          <div
            v-else
            class="bg-background-default animate-pulse w-25 h-6 rounded-lg ml-auto"
          ></div>
        </div>
      </template>
      <template v-if="view === 'custom' && emptyState !== 'custom'" #action>
        <app-base-button size="medium" @click="openAddCustom"
          >{{ $t('portfolio.table.add_button') }}
        </app-base-button>
      </template>

      <div v-if="isComingSoon" class="text-center my-10">
        {{ $t('common.coming_soon') }}
      </div>
      <AppTable
        v-else-if="isLoading || !emptyState"
        v-model:sort="sort"
        v-model:page="page"
        :default-sort="DEFAULT_SORT"
        :columns="columns"
        :pages="totalPages"
        :pagination-label="resultsLabel"
        :loading="isLoading"
        :loading-rows="PER_PAGE"
        footer="pagination"
        watchlist
        actions
      >
        <!-- Trade/swap + buy at L, one button at M (the menu in the custom
             view), the menu at S: as the loaded rows. -->
        <template #loading-row="{ size }">
          <AppTableRow
            loading
            description="-"
            :loading-buttons="
              size === 'l' ? 2 : size === 'm' && view !== 'custom' ? 1 : 0
            "
          >
            <template #avatar />
          </AppTableRow>
        </template>
        <AppTableRow
          v-for="(token, index) in paginatedArray"
          :key="
            index +
            token.name +
            token.market_cap +
            token.coinId +
            token.contract
          "
          :title="token.symbol.toUpperCase()"
          :description="getTokenDisplayName(token)"
          :to="getTokenRoute(token)"
          :watchlisted="
            getWatchlistId(token)
              ? isWatchListed(getWatchlistId(token))
              : undefined
          "
          @update:watchlisted="setWatchlistToken(token)"
          @click="onTokenLinkClick(token)"
        >
          <template v-if="token.ondo" #title>
            {{ stockBaseSymbol(token.symbol)
            }}<span class="bg-stock-gradient bg-clip-text text-transparent"
              >on</span
            >
          </template>
          <template #avatar="{ size }">
            <AppAvatar
              :size="size"
              :type="token.ondo ? 'stocks' : 'cryptoAsset'"
              :url="token.logo_url"
              :symbol="token.symbol"
            />
          </template>
          <AppTableCell
            :column="SortValueString.MARKET_CAP"
            :value="
              token.market_cap ? formatFiat(token.market_cap).display : '-'
            "
          />
          <AppTableCell
            :column="SortValueString.PRICE"
            :value="token.price ? formatFiat(token.price).display : '-'"
          />
          <AppTableCell
            :column="SortValueString.PERCENT"
            :value="token.price_change_percentage_24h ? undefined : '-'"
            :change="token.price_change_percentage_24h || undefined"
            :series="
              token.sparkline_in_7d?.length ? token.sparkline_in_7d : undefined
            "
          />
          <AppTableCell :column="SortValueString.VALUE">
            <p class="max-w-full truncate text-label-base text-text-default">
              {{ token.fiatBalanceFormatted }}
            </p>
            <p class="max-w-full truncate text-label-xs text-text-subtle">
              {{ formatFloatingPointValue(token.balance).value }}
              <span class="uppercase">{{ truncate(token.symbol, 7) }}</span>
            </p>
          </AppTableCell>

          <template #actions="{ size, surface }">
            <!-- Overflow menu at S; custom rows keep it at M too so Delete stays reachable. -->
            <template
              v-if="size === 's' || (view === 'custom' && size === 'm')"
            >
              <app-pop-up-menu
                v-if="
                  view === 'custom' ||
                  hasPrimaryAction(token) ||
                  isBuyableOnCompatibleChain(token.coinId)
                "
                :placeholder="$t('common.action_menu')"
                location="right"
              >
                <template #menu-button="{ toggleMenu }">
                  <app-btn-icon
                    icon="ellipsis-horizontal"
                    :label="$t('common.action_menu')"
                    @click.stop="toggleMenu"
                  />
                </template>
                <template #menu-content="{ toggleMenu }">
                  <div
                    class="px-2 py-3 max-w-full bg-white rounded-xl min-w-60"
                  >
                    <ul v-if="view !== 'custom'">
                      <li v-if="isBuyableOnCompatibleChain(token.coinId)">
                        <button
                          type="button"
                          class="flex w-full items-center p-2 hoverBGWhite rounded-12"
                          @click.stop="[buyBtn(token, true), toggleMenu()]"
                        >
                          <icon-buy class="text-text-brand w-4 h-4 mr-2" />
                          <span>{{ $t('common.buy') }}</span>
                        </button>
                      </li>
                      <li v-if="token.ondo !== undefined">
                        <button
                          type="button"
                          class="flex w-full items-center p-2 hoverBGWhite rounded-12"
                          @click.stop="[tradeBtn(token, true), toggleMenu()]"
                        >
                          <icon-trade class="text-text-brand w-4 h-4 mr-2" />
                          <span>{{ $t('portfolio.table.trade') }}</span>
                        </button>
                      </li>
                      <li v-else-if="currentChainhasSwapSupport">
                        <button
                          type="button"
                          class="flex w-full items-center p-2 hoverBGWhite rounded-12"
                          @click.stop="[swapBtn(token, true), toggleMenu()]"
                        >
                          <icon-swap class="text-text-brand w-4 h-4 mr-2" />
                          <span>{{ $t('common.swap') }}</span>
                        </button>
                      </li>
                    </ul>
                    <ul v-else>
                      <li>
                        <button
                          type="button"
                          class="flex w-full items-center p-2 hoverBGWhite rounded-12"
                          @click.stop="[
                            customTokenAction('edit', token),
                            toggleMenu(),
                          ]"
                        >
                          <AppIcon
                            name="pencil"
                            variant="filled"
                            size="xxs"
                            class="mr-2"
                          />
                          <span>{{ $t('common.edit') }}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          class="flex w-full items-center p-2 hoverBGWhite rounded-12"
                          @click.stop="[
                            customTokenAction('delete', token),
                            toggleMenu(),
                          ]"
                        >
                          <AppIcon
                            name="trash"
                            variant="filled"
                            size="xxs"
                            class="mr-2"
                          />
                          <span>{{ $t('common.delete') }}</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </template>
              </app-pop-up-menu>
            </template>
            <template v-else-if="view === 'custom'">
              <app-base-button
                type="secondary"
                size="medium"
                class="w-24"
                :surface="surface"
                @click="customTokenAction('edit', token)"
                >{{ $t('common.edit') }}
              </app-base-button>
              <app-base-button
                type="secondary"
                size="medium"
                class="w-24"
                :surface="surface"
                @click="customTokenAction('delete', token)"
                >{{ $t('common.delete') }}
              </app-base-button>
            </template>
            <template v-else>
              <!-- L: trade/swap + buy. M: one button, trade/swap first. -->
              <app-base-button
                v-if="token.ondo !== undefined"
                type="secondary"
                size="medium"
                class="w-24"
                :surface="surface"
                @click="tradeBtn(token)"
                >{{ $t('portfolio.table.trade') }}
              </app-base-button>
              <app-base-button
                v-else-if="currentChainhasSwapSupport"
                type="secondary"
                size="medium"
                class="w-24"
                :surface="surface"
                @click="swapBtn(token)"
                >{{ $t('common.swap') }}
              </app-base-button>
              <app-base-button
                v-if="
                  isBuyableOnCompatibleChain(token.coinId) &&
                  (size === 'l' || !hasPrimaryAction(token))
                "
                type="secondary"
                size="medium"
                class="w-24"
                :surface="surface"
                @click="buyBtn(token)"
                >{{ $t('common.buy') }}
              </app-base-button>
            </template>
          </template>
        </AppTableRow>
      </AppTable>
      <div
        v-else-if="emptyState === 'watchlist'"
        class="text-nowrap mx-auto text-text-subtle text-center py-10 text-s-14"
      >
        <p class="mb-1">{{ $t('portfolio.table.empty_watchlist') }}</p>
        <router-link :to="{ name: ROUTES_MAIN.CRYPTO.NAME }" class="underline"
          >{{ $t('portfolio.table.discover_more_tokens') }}
          <AppIcon
            name="arrow-long-up"
            variant="filled"
            size="xxs"
            class="rotate-90 inline-flex"
          />
        </router-link>
      </div>
      <div
        v-else-if="emptyState === 'custom'"
        class="text-nowrap mx-auto text-text-subtle text-center py-10 text-s-14"
      >
        <p class="mb-6">{{ $t('portfolio.table.empty_custom') }}</p>
        <app-base-button size="medium" @click="openAddCustom">{{
          $t('portfolio.table.add_custom_token')
        }}</app-base-button>
      </div>
      <div
        v-else-if="emptyState === 'stocks'"
        class="text-nowrap mx-auto text-text-subtle text-center py-10 text-s-14"
      >
        <p class="mb-6">
          {{ $t('portfolio.table.empty_stocks') }}
        </p>
        <app-base-button
          size="medium"
          @click="$router.push({ name: ROUTES_MAIN.STOCKS.NAME })"
          >{{ $t('common.explore_stocks') }}</app-base-button
        >
      </div>
      <div
        v-else-if="emptyState === 'search'"
        class="text-nowrap mx-auto text-text-subtle text-center py-10 text-s-14"
      >
        <p class="mb-1">
          {{ $t('portfolio.table.no_results', { query: searchInput }) }}
        </p>
      </div>
    </AppTableWrapper>
    <custom-tokens-dialog />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'viem'

// Components
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppTableWrapper from '@/components/table/AppTableWrapper.vue'
import AppTable from '@/components/table/AppTable.vue'
import AppTableRow from '@/components/table/AppTableRow.vue'
import AppTableCell from '@/components/table/AppTableCell.vue'
import type {
  TableColumn,
  TableSize,
  TableSort,
} from '@/components/table/types'
import CustomTokensDialog from './CustomTokensDialog.vue'
// Icons
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import IconTrade from '@/assets/icons/core_menu/icon-trade.vue'
// Composables & Utils
import { usePaginate } from '@/composables/usePaginate'
import { useFetchWatchlist } from '@/composables/useFetchWatchlist'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'
import { searchArrayByKeysStr } from '@/utils/searchArray'
import { truncate } from '@/utils/filters'
import { getTokenDisplayName, stockBaseSymbol } from '@/utils/tokenDisplayName'
import { getAPIPath } from '@/utils/constructAPIPath'
import {
  analytics,
  ClickTokenTradeEvent,
  ClickTokenTradeLocation,
} from '@/analytics'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { captureException } from '@sentry/vue'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'

// Types & Routes
import type {
  GetErc20AddressBalanceResponse,
  TokenBalance,
  GetWebStocksWatchlistResponseStock,
} from '@/mew_api/types'
import {
  ROUTES_MAIN,
  TOKEN_INFO_ROUTE_NAMES,
  STOCK_INFO_ROUTE_NAMES,
} from '@/router/routeNames'
import { type BalanceFilter } from '../../helpers/index'

// Stores
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWalletStore } from '@/stores/walletStore'
import { useTokenInfoStore } from '@/stores/tokenInfoStore'
import { useCustomTokenStore } from '@/stores/customTokenStore'
import { useChainsStore } from '@/stores/chainsStore'
import { usePurchaseStore } from '@/stores/purchaseStore'

import AppIcon from '@/components/icon/AppIcon.vue'
/** -------------------------------
 * Constants & Types
 -------------------------------*/
export interface DisplayToken extends TokenBalance {
  fiatBalance?: number
  fiatBalanceFormatted?: string
}

enum SortValueString {
  NAME = 'Name',
  PERCENT = '24h',
  MARKET_CAP = 'Market_Cap',
  VALUE = 'USD_Balance',
  PRICE = 'Price',
}

/** -------------------------------
 * Store & State Setup
 -------------------------------*/
const props = defineProps<{
  view: BalanceFilter
}>()

defineSlots<{
  /** Balance filter controls, placed in the table toolbar after the search. */
  filters?: (props: { size: TableSize }) => unknown
}>()

const { t } = useI18n()
const router = useRouter()
const chainStore = useChainsStore()
const walletStore = useWalletStore()
const walletMenu = useWalletMenuStore()
const watchListStore = useWatchlistStore()
const customTokenStore = useCustomTokenStore()
const tokenInfoStore = useTokenInfoStore()
const purchaseStore = usePurchaseStore()
const { isBuyableOnCompatibleChain } = purchaseStore

const { formatFiat } = useCurrency()

const { selectedChain, currentChainhasSwapSupport } = storeToRefs(chainStore)
const {
  setWalletPanel,
  setSelectedTradeTokenSymbol,
  setSelectedPurchaseCoinId,
  toggleShowBalance,
} = walletMenu
const { isOpenSideMenu, hideLowBalance } = storeToRefs(walletMenu)
const {
  isWalletConnected,
  formattedTotalFiatPortfolioValue,
  isLoadingBalances,
  allTokens,
  allStocks,
  walletAddress,
} = storeToRefs(walletStore)

const { isWatchListed, setWatchlistItem } = watchListStore
const { watchListedTokens, watchListedStocks } = storeToRefs(watchListStore)
const { customTokens } = storeToRefs(customTokenStore)
const { openCustomTokenDialog, setCurrentView } = customTokenStore

// Local State
const searchInput = ref('')
// Header sort; a third click goes back to the default order.
const DEFAULT_SORT: TableSort = {
  key: SortValueString.MARKET_CAP,
  direction: 'asc',
}
const sort = ref<TableSort | null>(DEFAULT_SORT)
const extraCustomBalances = ref<Record<string, GetErc20AddressBalanceResponse>>(
  {},
)

/** -------------------------------
 * Computed Values
 -------------------------------*/
const chainCustomTokens = computed(() => {
  const chainName = chainStore.selectedChain?.name || ''
  return customTokens.value[chainName] || []
})

// The earning filter has no table yet.
const isComingSoon = computed(() => props.view === 'earning')

const columns = computed<TableColumn[]>(() => [
  {
    key: SortValueString.NAME,
    label: t('portfolio.table.token_header'),
    sortable: true,
  },
  {
    key: SortValueString.MARKET_CAP,
    label: t('portfolio.table.market_cap_header'),
    sortable: true,
    largeOnly: true,
  },
  {
    key: SortValueString.PRICE,
    label: t('portfolio.table.price_header'),
    sortable: true,
  },
  {
    key: SortValueString.PERCENT,
    label: t('portfolio.table.24h_header'),
    sortable: true,
  },
  {
    key: SortValueString.VALUE,
    label: t('portfolio.table.balance_header'),
    sortable: true,
    primary: true,
  },
])

const isLoading = computed(() =>
  props.view === 'watchlist'
    ? isLoadingBalances.value || isLoadingWatchlist.value
    : isLoadingBalances.value,
)

/** -------------------------------
 * Fetching & Watchers
 -------------------------------*/
const selectedChainForWatchlist = computed(() => selectedChain.value ?? null)

const {
  tokensWatchlistData,
  stocksWatchlistData,
  isFetchingTokensWatchlist,
  isFetchingStocksWatchlist,
  fetchAllWatchlist,
} = useFetchWatchlist(selectedChainForWatchlist)

const isLoadingWatchlist = computed(
  () => isFetchingTokensWatchlist.value || isFetchingStocksWatchlist.value,
)

const formatStock = (
  item: GetWebStocksWatchlistResponseStock,
): DisplayToken => {
  return {
    // Portfolio tokens have no single underlying market, so the API sends
    // underlyingMarket as null and the alias carries the display name.
    name: item.stockAlias || item.underlyingMarket?.name || '',
    symbol: item.primaryMarket.symbol,
    logo_url: item.iconPngUrl || item.iconSvgUrl || '',
    price: item.primaryMarket.price ? Number(item.primaryMarket.price) : 0,
    price_change_percentage_24h: item.primaryMarket.priceChangePercentage24h
      ? Number(item.primaryMarket.priceChangePercentage24h)
      : 0,
    market_cap: item.underlyingMarket?.marketCap
      ? Number(item.underlyingMarket.marketCap)
      : 0,
    sparkline_in_7d: item.primaryMarket.sparkline24h || [],
    balanceWei: '0x',
    balance: '0',
    contract: '',
    fiatBalance: 0,
    fiatBalanceFormatted: formatFiat(0).display,
    ondo: {
      stockAlias: item.stockAlias,
      iconPngUrl: item.iconPngUrl,
      iconSvgUrl: item.iconSvgUrl,
      primaryMarket: {
        symbol: item.primaryMarket.symbol,
      },
      underlyingMarket: {
        name: item.underlyingMarket?.name,
      },
    },
  } as DisplayToken
}

const getCustomTokenBalance = async (
  contractAddress: string,
): Promise<GetErc20AddressBalanceResponse> => {
  const path = getAPIPath(
    `/v1/evm/chains/${selectedChain.value?.chainID}/erc20/${contractAddress}/addresses/${walletAddress.value}/balance`,
  )
  const response = await fetch(path)
  if (!response.ok) throw new Error('Failed to fetch balance')
  return response.json()
}

watch(selectedChain, () => (extraCustomBalances.value = {}))

// Fetch watchlist when view is 'watchlist'
watch(
  () => props.view,
  newView => {
    if (
      newView === 'watchlist' &&
      (watchListedTokens.value.length > 0 || watchListedStocks.value.length > 0)
    ) {
      fetchAllWatchlist()
    }
  },
  { immediate: true },
)

watch(
  [chainCustomTokens, walletAddress],
  async () => {
    if (props.view !== 'custom') return

    const existingAddresses = new Set(
      allTokens.value.map(t => t.contract?.toLowerCase()),
    )

    for (const token of chainCustomTokens.value) {
      const addr = token.address.toLowerCase()
      if (!existingAddresses.has(addr) && !extraCustomBalances.value[addr]) {
        try {
          extraCustomBalances.value[addr] = await getCustomTokenBalance(
            token.address,
          )
        } catch (e) {
          captureException(e, {
            ...SENTRY_MODULE_TAGS.PORTFOLIO,
            extra: {
              title: 'Error fetching custom token balance',
              tokenAddress: token.address,
              chainId: selectedChain.value?.chainID,
            },
          })
        }
      }
    }
  },
  { immediate: true },
)

/** -------------------------------
 * Table Logic
 -------------------------------*/
const getFiatValue = (token: TokenBalance): BigNumber => {
  return BigNumber(token.price || 0).multipliedBy(token.balance)
}

const mapToDisplay = (token: TokenBalance): DisplayToken => {
  const fiat = getFiatValue(token)
  return {
    ...token,
    fiatBalance: fiat.toNumber(),
    fiatBalanceFormatted: formatFiat(fiat).display,
  }
}

const tokens = computed<DisplayToken[]>(() => {
  let list: DisplayToken[] = []

  // Create lookups for faster access
  const balanceMap = new Map(
    allTokens.value.map(t => [t.contract?.toLowerCase(), t]),
  )
  const coinIdMap = new Map(allTokens.value.map(t => [t.coinId, t]))

  // Create lookup for stocks by ondo symbol
  const stocksMap = new Map(
    allStocks.value.map(s => [s.ondo?.primaryMarket?.symbol?.toLowerCase(), s]),
  )

  if (props.view === 'watchlist') {
    // make sure that response is array, if not set to empty array
    const watchlistTokenResponse = Array.isArray(tokensWatchlistData.value)
      ? tokensWatchlistData.value
      : []
    // Map tokens watchlist
    const tokensList =
      watchlistTokenResponse
        .filter(token => watchListedTokens.value.includes(token.coinId))
        .map(token => {
          const balanceToken = coinIdMap.get(token.coinId)
          if (balanceToken) return mapToDisplay(balanceToken)

          return {
            ...token,
            fiatBalance: 0,
            fiatBalanceFormatted: formatFiat(0).display,
            balanceWei: '0x',
            balance: '0',
            contract: '',
            price: token.price || undefined,
            market_cap: token.marketCap || undefined,
            price_change_percentage_24h: token.priceChangePercentage24h || 0,
            sparkline_in_7d: token.sparklineIn7d || [],
            logo_url: token.logoUrl || '',
            // Watchlist tokens return ondo: null for non-stocks. Downstream
            // stock checks use `ondo !== undefined`, so keep null out or they
            // treat it as a stock and read primaryMarket off null.
            ondo: token.ondo ?? undefined,
          } as DisplayToken
        }) || []

    // Map stocks watchlist
    const stocksList =
      (stocksWatchlistData.value || [])
        .filter(stock => {
          return watchListedStocks.value
            .map(s => s.toLowerCase())
            .includes(stock.primaryMarket.symbol.toLowerCase())
        })
        .map(stock => {
          // Check if user has balance for this stock
          const balanceStock = stocksMap.get(
            stock.primaryMarket.symbol.toLowerCase(),
          )
          if (balanceStock) return mapToDisplay(balanceStock)

          return formatStock(stock)
        }) || []
    list = [...tokensList, ...stocksList]
  } else if (props.view === 'custom') {
    list = chainCustomTokens.value.map(customToken => {
      const balanceToken = balanceMap.get(customToken.address.toLowerCase())
      if (balanceToken) {
        return {
          ...mapToDisplay(balanceToken),
          symbol: customToken.symbol,
        }
      }

      const extra = extraCustomBalances.value[customToken.address.toLowerCase()]
      if (extra) {
        const balance = formatUnits(
          BigInt(extra.nativeValue),
          customToken.decimals,
        )
        const fiat = BigNumber(extra.fiatValue || 0)
        return {
          name: customToken.name,
          symbol: customToken.symbol,
          contract: customToken.address,
          decimals: customToken.decimals,
          balanceWei: extra.nativeValue,
          balance,
          fiatBalance: fiat.toNumber(),
          fiatBalanceFormatted: formatFiat(fiat).display,
          price: extra.priceFiatPerNative || 0,
        } as DisplayToken
      }

      return {
        name: customToken.name,
        symbol: customToken.symbol,
        contract: customToken.address,
        decimals: customToken.decimals,
        balanceWei: '0x',
        balance: '0',
        fiatBalance: 0,
        fiatBalanceFormatted: formatFiat(0).display,
      } as DisplayToken
    })
  } else if (props.view === 'stocks') {
    list = allStocks.value.map(mapToDisplay)
  } else {
    list = allTokens.value.map(mapToDisplay)
  }

  if (!hideLowBalance.value && props.view !== 'watchlist') {
    list = list.filter(t => (t.fiatBalance ?? 0) > 0)
  }

  if (searchInput.value) {
    list = searchArrayByKeysStr(list, ['name', 'symbol'], searchInput.value)
  }

  // Sorting logic
  const { key, direction } = sort.value ?? DEFAULT_SORT
  const sortMap: Record<SortValueString, () => DisplayToken[]> = {
    [SortValueString.NAME]: () =>
      sortObjectArrayString(list, 'name', direction),
    [SortValueString.PERCENT]: () =>
      sortObjectArrayNumber(list, 'price_change_percentage_24h', direction),
    [SortValueString.MARKET_CAP]: () =>
      sortObjectArrayNumber(list, 'market_cap', direction),
    [SortValueString.VALUE]: () =>
      sortObjectArrayNumber(list, 'fiatBalance', direction),
    [SortValueString.PRICE]: () =>
      sortObjectArrayNumber(list, 'price', direction),
  }

  return sortMap[key as SortValueString]?.() ?? list
})

const totalValue = computed(() => {
  if (props.view === 'all') return formattedTotalFiatPortfolioValue.value
  const sum = tokens.value.reduce(
    (acc, t) => acc.plus(t.fiatBalance || 0),
    new BigNumber(0),
  )
  return formatFiat(sum).display
})

/** -------------------------------
 * Pagination Logic
 -------------------------------*/
// Fixed page size: the table footer has no page-size picker.
const PER_PAGE = 10

const { currentPage, paginatedArray, totalPages } = usePaginate<DisplayToken>(
  tokens,
  PER_PAGE,
)

// AppTable pages are 1-based, usePaginate's are 0-based.
const page = computed({
  get: () => currentPage.value + 1,
  set: (value: number) => {
    currentPage.value = value - 1
  },
})

// "20 of 34 results": rows shown up to this page, out of all of them.
const resultsLabel = (current: number) =>
  t('portfolio.table.results_of', {
    count: Math.min(PER_PAGE * current, tokens.value.length),
    total: tokens.value.length,
  })

type EmptyState = 'search' | 'watchlist' | 'custom' | 'stocks'
const emptyState = computed<EmptyState | null>(() => {
  if (paginatedArray.value.length) return null
  if (searchInput.value) return 'search'
  const view = props.view
  return view === 'watchlist' || view === 'custom' || view === 'stocks'
    ? view
    : null
})

/** -------------------------------
 * Navigation & Handlers
 -------------------------------*/
// A token has a "primary" action (trade / swap) in the actions cell. At M only
// one button fits, so Buy shows there only when there's no trade / swap.
const hasPrimaryAction = (token: DisplayToken): boolean =>
  !!token.ondo || currentChainhasSwapSupport.value
const buyBtn = (token?: DisplayToken, isMobile = false) => {
  analytics.trackClickTokenTradeEvent(ClickTokenTradeEvent.BUY, {
    location: ClickTokenTradeLocation.BALANCE_TABLE,
    token: token?.symbol,
    isMobile,
  })
  setSelectedPurchaseCoinId(token?.coinId ?? null)
  walletMenu.openPanel('purchase')
}

const getTokenRoute = (token: DisplayToken) => {
  if (token.ondo) {
    return {
      name: STOCK_INFO_ROUTE_NAMES.home,
      params: { symbol: token.ondo.primaryMarket.symbol },
    }
  }
  return {
    name: TOKEN_INFO_ROUTE_NAMES.home,
    params: { tokenId: token.coinId || token.symbol },
  }
}

const onTokenLinkClick = (token: DisplayToken) => {
  if (!token.ondo) {
    tokenInfoStore.setTokenInfo(token)
  }
}

const goToTokenPage = (token: DisplayToken) => {
  onTokenLinkClick(token)
  router.push(getTokenRoute(token))
}

const getWatchlistId = (token: DisplayToken): string => {
  return token.ondo?.primaryMarket?.symbol || token.coinId || ''
}

const isTokenStock = (token: DisplayToken): boolean => {
  return !!token.ondo?.primaryMarket?.symbol
}

const setWatchlistToken = (token: DisplayToken) => {
  const id = getWatchlistId(token)
  if (!id) return
  const isStock = isTokenStock(token)
  setWatchlistItem(id, isStock)
  if (!isWatchListed(id)) {
    fetchAllWatchlist()
  }
}

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

const swapBtn = (token: DisplayToken, isMobile = false) => {
  analytics.trackClickTokenTradeEvent(ClickTokenTradeEvent.SWAP, {
    location: ClickTokenTradeLocation.BALANCE_TABLE,
    token: token.symbol,
    isMobile,
  })
  setWalletPanel('swap')
  if (!isOpenSideMenu.value) walletMenu.setIsOpenSideMenu(true)
  if (!isMobile) goToTokenPage(token)
}

const tradeBtn = (token: DisplayToken, isMobile = false) => {
  analytics.trackClickTokenTradeEvent(ClickTokenTradeEvent.TRADE, {
    location: ClickTokenTradeLocation.BALANCE_TABLE,
    token: token.symbol,
    isMobile,
    stock: token.ondo?.stockAlias || token.ondo?.underlyingMarket?.name,
  })
  setSelectedTradeTokenSymbol(token.symbol)
  setWalletPanel('trade')
  if (!isOpenSideMenu.value) walletMenu.setIsOpenSideMenu(true)
  if (!isMobile) goToTokenPage(token)
}
</script>
