<template>
  <slot
    name="trigger"
    :open="openSelectAsset"
    :is-loading="isLoading"
    :selected-token="selectedToken"
  />

  <app-token-selector-modal
    v-model="isOpen"
    v-model:search="searchInput"
    :title="
      side === 'buy'
        ? $t('trade.select_asset.buy_title')
        : $t('trade.select_asset.sell_title')
    "
    :items="items"
    :list-title="listTitle"
    :recent-items="recentItems"
    :owned-items="ownedItems"
    :unavailable-items="unavailableItems"
    :unavailable-title="unavailableTitle"
    :selected-id="selectedToken ? tokenId(selectedToken) : undefined"
    :loading="!isLoaded"
    :sort-options="sortOptions"
    :sort-value="sortValue"
    :sort-direction="sortDirection"
    @sort="onSort"
    @select="selectAsset"
  >
    <template v-if="hasPausedAsset" #item-suffix="{ item }">
      <!-- The disabled row turns pointer events off; the tag keeps its tooltip. -->
      <app-tooltip
        v-if="itemPauseReason(item)"
        :text="$t(`trade.pause_reason.${itemPauseReason(item)}.tooltip`)"
        placement="right"
        class="pointer-events-auto"
      >
        <app-tag
          type="warning"
          variant="subtle"
          trailing-icon="information-circle"
          :label="$t(`trade.pause_reason.${itemPauseReason(item)}.tag`)"
        />
      </app-tooltip>
    </template>
  </app-token-selector-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'viem'
import { useI18n } from 'vue-i18n'

import AppTokenSelectorModal from '@/components/token_selector/AppTokenSelectorModal.vue'
import {
  pickRecentItems,
  tokenRowAccessory,
} from '@/components/token_selector/tokenSelector'
import type {
  TokenSelectorItem,
  TokenSelectorSortDirection,
} from '@/components/token_selector/types'
import AppTag from '@/components/tag/AppTag.vue'
import AppTooltip from '@/components/tooltip/AppTooltip.vue'

import { analytics, TradeClickSortEvent } from '@/analytics'
import { useWalletStore } from '@/stores/walletStore'
import { getTokenDisplayName } from '@/utils/tokenDisplayName'
import { useChainsStore } from '@/stores/chainsStore'
import { useStocksStore } from '@/stores/stocksStore'
import { useMarketStatusStore } from '@/stores/marketStatusStore'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'
import { useCurrency } from '@/composables/useCurrency'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { fuzzySearchByKeys } from '@/utils/searchArray'
import { truncate } from '@/utils/filters'
import { type NewTokenInfo } from '@/stores/swapStore'
import type { TradeAssetToken } from '../composables/useTradeTokens'
import { isPauseReason } from '../common/tradeSession'
import { tradeAssetLabel } from '../common/tradeAssetLabel'

const props = withDefaults(
  defineProps<{
    side: 'sell' | 'buy'
    externalLoading?: boolean
    chainTokens?: NewTokenInfo[]
    networkName?: string
    disabledTokens?: string[]
  }>(),
  {
    externalLoading: false,
    chainTokens: () => [],
    networkName: undefined,
    disabledTokens: () => [],
  },
)

const selectedToken = defineModel<NewTokenInfo>('selectedToken')

const emit = defineEmits<{
  'select:token': [token: NewTokenInfo]
  'open:selectToken': [isOpen: boolean]
}>()

const { t, locale } = useI18n()
const { formatFiat } = useCurrency()
const walletStore = useWalletStore()
const stocksStore = useStocksStore()
const { isLoadingBalances, isWalletConnected } = storeToRefs(walletStore)
const chainsStore = useChainsStore()
const { isLoaded } = storeToRefs(chainsStore)
const { currentSession } = storeToRefs(useMarketStatusStore())
const { recentlyViewedStocks } = storeToRefs(useRecentlyViewedTokensStore())

const isOpen = ref(false)
const searchInput = ref('')
const openSelectAsset = () => {
  isOpen.value = true
}

const isLoading = computed(() => {
  if (isWalletConnected.value) {
    return props.externalLoading || isLoadingBalances.value || !isLoaded.value
  }
  return props.externalLoading || !isLoaded.value
})

const isBuy = computed(() => props.side === 'buy')

// Lowercase, as the Figma reads it: "Available in post-market".
const sessionName = computed(() => {
  const session = currentSession.value
  if (!session || session === 'regular') return ''
  const name = t(`trade.market_status.${session}`)
  return name.startsWith('trade.') ? '' : name.toLocaleLowerCase(locale.value)
})

const listTitle = computed(() =>
  isBuy.value && sessionName.value
    ? t('trade.select_asset.available_in', { marketStatus: sessionName.value })
    : undefined,
)

const unavailableTitle = computed(() =>
  sessionName.value
    ? t('trade.select_asset.unavailable_in', {
        marketStatus: sessionName.value,
      })
    : t('trade.select_asset.unavailable'),
)

const tokenId = (token: NewTokenInfo) =>
  (token.address || token.symbol).toLowerCase()

const disabledAddresses = computed(
  () => new Set(props.disabledTokens.map(address => address.toLowerCase())),
)
const isSessionUnavailable = (token: TradeAssetToken) =>
  disabledAddresses.value.has(token.address?.toLowerCase())

const pauseReasonOf = (token: TradeAssetToken) =>
  token.pauseReason && isPauseReason(token.pauseReason)
    ? token.pauseReason
    : null
const itemPauseReason = (item: TokenSelectorItem) =>
  pauseReasonOf(item.raw as TradeAssetToken)

interface TradeAsset {
  token: TradeAssetToken
  amount: string
  fiatValue: BigNumber
  marketCap: number
  change?: number
}

const assets = computed<TradeAsset[]>(() => {
  if (!isLoaded.value) return []
  return (props.chainTokens as TradeAssetToken[]).map(token => {
    const amount = token.balance
      ? formatUnits(BigInt(token.balance), token.decimals)
      : '0'
    // The wallet's market data fills in what the trade feed lacks (crypto).
    const walletToken = walletStore.getTokenBalance(token.address)
    return {
      token:
        props.side === 'sell'
          ? {
              ...token,
              name: getTokenDisplayName({
                name: token.name,
                ondo: walletToken?.ondo,
              }),
            }
          : token,
      amount,
      fiatValue: BigNumber(amount).multipliedBy(token.price || 0),
      marketCap: token.marketCap || walletToken?.market_cap || 0,
      change:
        token.priceChangePercentage24h ??
        walletToken?.price_change_percentage_24h,
    }
  })
})

// Values double as the analytics `sortOption`.
const SORT = {
  MARKET_CAP: 'Market Cap',
  PRICE: 'Price',
  CHANGE: '24H Change',
  NAME: 'Name',
} as const

const sortOptions = computed(() => [
  { value: SORT.MARKET_CAP, label: t('stocks.market_cap') },
  { value: SORT.PRICE, label: t('stocks.price') },
  { value: SORT.CHANGE, label: t('stocks.twenty_four_h_change') },
  { value: SORT.NAME, label: t('stocks.name') },
])
const sortValue = ref<string>(SORT.MARKET_CAP)
const sortDirection = ref<TokenSelectorSortDirection>('desc')

const onSort = (value: string) => {
  analytics.trackTradeClickSortEvent(TradeClickSortEvent, {
    sortOption: value,
    isFromView: props.side === 'sell',
  })
  if (value === sortValue.value) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortValue.value = value
    sortDirection.value = value === SORT.NAME ? 'asc' : 'desc'
  }
}

const sortNumber: Record<string, (asset: TradeAsset) => number> = {
  [SORT.MARKET_CAP]: asset => asset.marketCap,
  [SORT.PRICE]: asset => asset.token.price || 0,
  [SORT.CHANGE]: asset => asset.change ?? 0,
}

const sortAssets = (list: TradeAsset[]) => {
  const direction = sortDirection.value === 'asc' ? 1 : -1
  const byNumber = sortNumber[sortValue.value]
  return [...list].sort(
    (a, b) =>
      (byNumber
        ? byNumber(a) - byNumber(b)
        : a.token.name.localeCompare(b.token.name)) * direction,
  )
}

// Holdings only in "Your assets"; every other row shows price and 24h change.
const toItem = (
  { token, amount, fiatValue, change }: TradeAsset,
  showHolding = false,
): TokenSelectorItem<TradeAssetToken> => {
  const { isStock, symbol } = tradeAssetLabel(
    token,
    props.networkName,
    stocksStore.isStock,
  )
  const paused = !!pauseReasonOf(token)
  return {
    id: tokenId(token),
    symbol,
    name: token.name,
    logo: token.logoURI,
    isStock,
    // A paused row shows its pause tag in place of the numbers.
    rightAccessory: paused
      ? undefined
      : tokenRowAccessory({
          balanceFiat: showHolding ? formatFiat(fiatValue).display : undefined,
          balance: showHolding
            ? `${formatFloatingPointValue(amount).value} ${truncate(symbol, 7)}`
            : undefined,
          price: formatFiat(BigNumber(token.price || 0)).display,
          change,
        }),
    disabled: paused || isSessionUnavailable(token),
    raw: token,
  }
}

const search = (list: TokenSelectorItem<TradeAssetToken>[]) =>
  fuzzySearchByKeys(list, ['name', 'symbol'], searchInput.value)

// Sell lists what can be sold: the held assets once a wallet is connected (by
// balance, not fiat value, so a held token with no price feed stays sellable),
// every asset otherwise since there are no balances yet.
const isSellable = ({ amount }: TradeAsset) =>
  !isWalletConnected.value || BigNumber(amount).isGreaterThan(0)

// Buy moves the session-unavailable assets to a group of their own; sell keeps
// them in place, disabled.
const listedItems = computed(() =>
  sortAssets(
    isBuy.value
      ? assets.value.filter(({ token }) => !isSessionUnavailable(token))
      : assets.value.filter(isSellable),
  ).map(asset => toItem(asset)),
)

const items = computed(() => search(listedItems.value))

const unavailableItems = computed(() =>
  isBuy.value
    ? search(
        sortAssets(
          assets.value.filter(({ token }) => isSessionUnavailable(token)),
        ).map(asset => toItem(asset)),
      )
    : [],
)

// The stock page and global search store a stock by its tokenized symbol.
const recentItems = computed(() =>
  isBuy.value
    ? pickRecentItems(
        listedItems.value,
        recentlyViewedStocks.value.map(({ id }) => id),
        ({ raw }, id) => raw.symbol.toUpperCase() === id.toUpperCase(),
      )
    : [],
)

// Balance, not fiat value: a held token without a price feed is still held.
const ownedItems = computed(() =>
  !isBuy.value && isWalletConnected.value
    ? assets.value
        .filter(({ amount }) => BigNumber(amount).isGreaterThan(0))
        .sort((a, b) => b.fiatValue.comparedTo(a.fiatValue) ?? 0)
        .map(asset => toItem(asset, true))
    : [],
)

// Only pass the suffix slot when it has something to draw: the row reserves
// room for it otherwise.
const hasPausedAsset = computed(() =>
  assets.value.some(({ token }) => pauseReasonOf(token)),
)

const selectAsset = (item: TokenSelectorItem) => {
  const token = item.raw as TradeAssetToken
  selectedToken.value = token
  emit('select:token', token)
}

watch(isOpen, value => emit('open:selectToken', value))

// Deliberately no networkName watcher here: on a chain switch this fires while
// `chainTokens` still holds the previous chain's list (the swap store re-inits
// asynchronously), so defaulting from it wrote a stale-chain token into the
// parent's v-model and blocked the parent's own repopulation (which is gated on
// the selection being empty). Default selection is the parent's job — see the
// swapLoaded / disabledTokenAddresses watchers in useTradeModule.
</script>
