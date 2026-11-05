<template>
  <slot
    name="trigger"
    :open="openSelectToken"
    :is-loading="isLoading"
    :selected-token="selectedToken"
  >
    <AppPicker
      size="s"
      :title="truncate(selectedToken?.symbol ?? '', 7)"
      :loading="isLoading || !selectedToken"
      :aria-label="$t('select_token.title')"
      @click="openSelectToken"
    >
      <template #avatar>
        <app-token-logo
          v-if="selectedToken"
          :url="selectedToken.logoURI"
          :symbol="selectedToken.symbol"
          :address="
            networkName
              ? { address: selectedToken.address, network: networkName }
              : undefined
          "
          width="w-6"
          height="h-6"
          no-shadow
        />
      </template>
    </AppPicker>
  </slot>
  <AppTokenSelectorModal
    v-model="showAllTokens"
    v-model:search="searchInput"
    v-model:network="network"
    :title="
      isFromView ? $t('select_token.swap_from') : $t('select_token.swap_to')
    "
    :items="items"
    :quick-picks="quickPicks"
    :recent-items="recentItems"
    :selected-id="selectedToken?.address"
    :sort-options="sortOptions"
    :sort-value="activeSortValue"
    :sort-direction="activeSortDirection"
    :networks="networks"
    :network-icon="currentChain?.icon"
    :loading="!isLoaded"
    :has-more="tokens.length > endingPagination && !searchInput"
    :loading-more="loadingMoreItems"
    :disabled-group-title="disabledGroupLabel"
    @select="setSelectedToken"
    @sort="setActiveSort($event as SortValueString)"
    @load-more="loadMoreItems"
  />
</template>

<script setup lang="ts">
import { useWalletStore } from '@/stores/walletStore'
import { type NewTokenInfo } from '@/stores/swapStore'
import { type PropType, ref, computed, onMounted, watch } from 'vue'
import BigNumber from 'bignumber.js'
import { storeToRefs } from 'pinia'
import { truncate } from '@/utils/filters'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'
import { fuzzySearchByKeys } from '@/utils/searchArray'
import { useChainsStore } from '@/stores/chainsStore'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'
import { useI18n } from 'vue-i18n'
import { refDebounced } from '@vueuse/core'
import AppTokenLogo from './AppTokenLogo.vue'
import { formatUnits } from 'viem'
import { analytics, TradeClickSortEvent, SwapClickSortEvent } from '@/analytics'
import AppPicker from '@/components/picker/AppPicker.vue'
import AppTokenSelectorModal from '@/components/token_selector/AppTokenSelectorModal.vue'
import {
  pickQuickPicks,
  tokenRowAccessory,
} from '@/components/token_selector/tokenSelector'
import type {
  TokenSelectorItem,
  TokenSelectorNetwork,
  TokenSelectorSortDirection,
} from '@/components/token_selector/types'

const props = defineProps({
  selectedToken: {
    type: Object as () => NewTokenInfo,
  },
  externalLoading: {
    type: Boolean,
    default: false,
  },
  chainTokens: {
    type: Array as () => NewTokenInfo[],
    default: () => [],
  },
  isFromView: {
    type: Boolean,
    default: true,
  },
  networkName: {
    type: String,
    required: false,
  },
  sortContext: {
    type: String as () => 'trade' | 'swap' | undefined,
    default: undefined,
  },
  // Token addresses (any case) to render disabled under `disabledGroupTitle`.
  // Generic so Trade (and later Swap) can gray out non-selectable tokens.
  disabledTokens: {
    type: Array as () => string[],
    default: () => [],
  },
  disabledGroupTitle: {
    type: String,
    required: false,
  },
  // Network dropdown inside the modal (Bridge "to"); empty hides it.
  networks: {
    type: Array as PropType<TokenSelectorNetwork[]>,
    default: () => [],
  },
})

// The dropdown's chain name; the parent switches the list on update.
const network = defineModel<string | null>('network', { default: null })

const { t } = useI18n()
const { formatFiat } = useCurrency()
const emit = defineEmits<{
  'update:selectedToken': [token: NewTokenInfo]
  // Fired only on an explicit user pick from the list (not on programmatic
  // defaulting like the networkName watcher below), so parents can react to
  // genuine user selections without false positives.
  'select:token': [token: NewTokenInfo]
  'open:selectToken': [isOpen: boolean]
}>()

const store = useWalletStore()
const {
  isLoadingBalances,
  isWalletConnected,
  allTokens: walletTokens,
} = storeToRefs(store)

const chainsStore = useChainsStore()
const { isLoaded, allChains } = storeToRefs(chainsStore)
// allChains, not chains: the bridge "to" side can be Solana.
const currentChain = computed(() =>
  allChains.value.find(chain => chain.name === props.networkName),
)

const recentlyViewedTokensStore = useRecentlyViewedTokensStore()
const { recentlyViewedCrypto } = storeToRefs(recentlyViewedTokensStore)

const isLoading = computed(() => {
  if (isWalletConnected.value) {
    return props.externalLoading || isLoadingBalances.value || !isLoaded.value
  }
  return props.externalLoading || !isLoaded.value
})

const tokens = computed<NewTokenInfo[]>(() => {
  if (!isLoaded.value) return []
  return [...props.chainTokens]
})

const showAllTokens = ref(false)
const openSelectToken = () => {
  showAllTokens.value = true
}
const searchInput = ref('')
// Debounced query drives the (expensive) sort + fuzzy search so heavy work runs
// after the user pauses typing instead of on every keystroke — the untouched
// `searchInput` keeps the input field responsive.
const debouncedSearchInput = refDebounced(searchInput, 250)
const loadingMoreItems = ref(false)

onMounted(() => {
  if (!props.isFromView || !isWalletConnected.value) {
    if (
      props.sortContext !== 'trade' ||
      (props.isFromView && !isWalletConnected.value)
    ) {
      activeSortValue.value = SortValueString.RANK
    } else {
      activeSortValue.value = SortValueString.PRICE
      activeSortDirection.value = 'desc'
    }
  }
})

// Set default token to the top of the sorted list on network change
watch(
  () => props.networkName,
  () => {
    if (tokens.value.length > 0) {
      // Prefer an enabled token; never default-select a disabled one. Fall back
      // to the full list only when nothing is enabled.
      const top =
        searchResults.value.find(token => !isTokenDisabled(token)) ??
        searchResults.value[0]
      if (top) emit('update:selectedToken', top)
    }
  },
)

watch(
  () => showAllTokens.value,
  () => {
    emit('open:selectToken', showAllTokens.value)
  },
)

// pagination
const endingPagination = ref(100)

/** -------------------
 *   Search & Sort
 * -------------------*/
enum SortValueString {
  RANK = 'Rank',
  NAME = 'Name',
  SYMBOL = 'Symbol',
  PRICE = 'Price',
  MARKET_CAP = 'Market Cap',
  VOLUME = '24H Volume',
  USD = 'USD Balance',
  BALANCE = 'Balance',
}

const sortOptions = computed(() => {
  const shared = [
    {
      value: SortValueString.NAME,
      label: t('common.name'),
    },
    {
      value: SortValueString.SYMBOL,
      label: t('common.symbol'),
    },
  ]
  if (props.isFromView || props.sortContext !== 'trade') {
    shared.unshift({
      value: SortValueString.RANK,
      label: t('common.rank'),
    })
  }
  const marketOptions = [
    { value: SortValueString.PRICE, label: t('common.price') },
    { value: SortValueString.MARKET_CAP, label: t('common.market_cap') },
    { value: SortValueString.VOLUME, label: t('common.volume_24h') },
  ]

  if (isWalletConnected.value && props.isFromView) {
    return [
      ...shared,
      { value: SortValueString.USD, label: t('common.usd_balance') },
      { value: SortValueString.BALANCE, label: t('common.balance') },
    ]
  }

  return [...shared, ...marketOptions]
})

const activeSortValue = ref<SortValueString>(SortValueString.RANK)
const activeSortDirection = ref<TokenSelectorSortDirection>('asc')

const setActiveSort = (value: SortValueString) => {
  if (props.sortContext === 'trade') {
    analytics.trackTradeClickSortEvent(TradeClickSortEvent, {
      sortOption: value,
      isFromView: props.isFromView,
    })
  } else if (props.sortContext === 'swap') {
    analytics.trackSwapClickSortEvent(SwapClickSortEvent, {
      sortOption: value,
      isFromView: props.isFromView,
    })
  }
  if (value === activeSortValue.value) {
    activeSortDirection.value =
      activeSortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    activeSortValue.value = value
    const isNumericSort = [
      SortValueString.RANK,
      SortValueString.PRICE,
      SortValueString.MARKET_CAP,
      SortValueString.VOLUME,
      SortValueString.USD,
      SortValueString.BALANCE,
    ].includes(value)
    activeSortDirection.value = isNumericSort ? 'desc' : 'asc'
  }
}

interface TokenBalanceWithUsd extends NewTokenInfo {
  usd_balance: number
  market_cap: number
  volume24h: number
  change24h?: number
}

const marketByContract = computed(
  () =>
    new Map(
      walletTokens.value.map(wt => [wt.contract?.toLowerCase(), wt] as const),
    ),
)

// Enriched token list (adds usd_balance and the wallet's market data). Shared by
// the main results, the quick picks and the recently viewed rows.
const enrichedTokens = computed<TokenBalanceWithUsd[]>(() => {
  return tokens.value.map(token => {
    const usdBalance = BigNumber(
      BigNumber(token.price || 0).times(
        BigNumber(
          token.balance
            ? formatUnits(BigInt(token.balance!), token.decimals)
            : '0',
        ),
      ),
    ).toNumber()
    const market = marketByContract.value.get(token.address?.toLowerCase())
    return {
      ...token,
      usd_balance: usdBalance,
      price: token.price || 0,
      market_cap: market?.market_cap ?? 0,
      volume24h: market?.volume_24h ?? 0,
      change24h: market?.price_change_percentage_24h,
    }
  })
})

const searchResults = computed<TokenBalanceWithUsd[]>(() => {
  const allItems: TokenBalanceWithUsd[] = enrichedTokens.value

  const sortKeyMap: Record<
    SortValueString,
    { key: keyof TokenBalanceWithUsd; type: 'string' | 'number' }
  > = {
    [SortValueString.RANK]: { key: 'rank', type: 'number' },
    [SortValueString.NAME]: { key: 'name', type: 'string' },
    [SortValueString.SYMBOL]: { key: 'symbol', type: 'string' },
    [SortValueString.PRICE]: { key: 'price', type: 'number' },
    [SortValueString.MARKET_CAP]: { key: 'market_cap', type: 'number' },
    [SortValueString.VOLUME]: { key: 'volume24h', type: 'number' },
    [SortValueString.USD]: { key: 'usd_balance', type: 'number' },
    [SortValueString.BALANCE]: { key: 'balance', type: 'number' },
  }

  const { key, type } = sortKeyMap[activeSortValue.value]
  const sorted =
    type === 'string'
      ? sortObjectArrayString(allItems, key, activeSortDirection.value)
      : sortObjectArrayNumber(allItems, key, activeSortDirection.value)

  if (debouncedSearchInput.value) {
    return fuzzySearchByKeys(
      sorted,
      ['name', 'symbol'],
      debouncedSearchInput.value,
    )
  }

  const enabledSorted = sorted.filter(t => !isTokenDisabled(t))
  const disabledSorted = sorted.filter(t => isTokenDisabled(t))
  const combinedSorted = [...enabledSorted, ...disabledSorted]
  return combinedSorted.slice(0, endingPagination.value)
})

// Disabled tokens render under the modal's disabled group at the bottom.
const disabledSet = computed(
  () => new Set(props.disabledTokens.map(a => a.toLowerCase())),
)
const isTokenDisabled = (token: NewTokenInfo) =>
  disabledSet.value.has(token.address?.toLowerCase())
const disabledGroupLabel = computed(
  () => props.disabledGroupTitle || t('trade.trading_paused_session'),
)

const getBalance = (value: string, decimals: number) => {
  return formatFloatingPointValue(formatUnits(BigInt(value), decimals)).value
}

// Holdings on the from side (and for any held token), the price otherwise.
// Tokens without a price show nothing on the right, as before.
const rowAccessory = (token: TokenBalanceWithUsd) => {
  if (!token.price) return undefined
  const showBalance =
    isWalletConnected.value && (props.isFromView || token.usd_balance > 0)
  return tokenRowAccessory({
    balanceFiat: showBalance
      ? formatFiat(token.usd_balance).display
      : undefined,
    balance: showBalance
      ? `${getBalance(token.balance || '0', token.decimals)} ${truncate(token.symbol, 7)}`
      : undefined,
    price: formatFiat(token.price).display,
    change: token.change24h,
  })
}

const toItem = (
  token: TokenBalanceWithUsd,
): TokenSelectorItem<TokenBalanceWithUsd> => ({
  id: token.address,
  symbol: token.symbol,
  name: token.name,
  logo: token.logoURI,
  disabled: isTokenDisabled(token),
  rightAccessory: rowAccessory(token),
  raw: token,
})

const items = computed(() => searchResults.value.map(toItem))

// Rank order so a duplicate symbol resolves to the better-ranked token; the
// bare rows keep the scan cheap and only the picks get formatted.
const quickPicks = computed(() =>
  pickQuickPicks(
    sortObjectArrayNumber(enrichedTokens.value, 'rank', 'asc').map(token => ({
      id: token.address,
      symbol: token.symbol,
      name: token.name,
      disabled: isTokenDisabled(token),
      raw: token,
    })),
    currentChain.value?.currencyName ?? '',
  ).map(({ raw }) => toItem(raw)),
)

const RECENT_LIMIT = 6

// Recently viewed reuses the shared store, resolving each entry against the
// current chain's tokens (by coingecko id, falling back to address) so only
// selectable tokens are shown.
const recentItems = computed(() => {
  const resolved: TokenBalanceWithUsd[] = []
  const seen = new Set<string>()
  for (const entry of recentlyViewedCrypto.value) {
    if (resolved.length >= RECENT_LIMIT) break
    const match = enrichedTokens.value.find(
      token =>
        (token.cgId && token.cgId === entry.id) ||
        token.address?.toLowerCase() === entry.id?.toLowerCase(),
    )
    if (
      match &&
      !isTokenDisabled(match) &&
      !seen.has(match.address.toLowerCase())
    ) {
      seen.add(match.address.toLowerCase())
      resolved.push(match)
    }
  }
  return resolved.map(toItem)
})

const loadMoreItems = () => {
  loadingMoreItems.value = true
  // false loading
  setTimeout(() => {
    loadingMoreItems.value = false
    endingPagination.value += 100
  }, 500)
}

const setSelectedToken = ({ raw }: TokenSelectorItem) => {
  const token = raw as NewTokenInfo
  recentlyViewedTokensStore.addToken({
    id: token.cgId || token.address,
    symbol: token.symbol,
    name: token.name,
    icon: token.logoURI || undefined,
    isStock: false,
  })
  emit('update:selectedToken', token)
  emit('select:token', token)
}
</script>
