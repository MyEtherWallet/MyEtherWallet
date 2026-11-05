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
    :title="$t('trade.select_asset.title')"
    :subtitle="side === 'buy' ? $t('trade.select_asset.subtitle') : undefined"
    :items="items"
    :quick-picks="quickPicks"
    :selected-id="selectedToken ? tokenId(selectedToken) : undefined"
    :network-icon="networkIcon"
    :loading="!isLoaded"
    :disabled-group-title="$t('trade.select_asset.unavailable')"
    @select="selectAsset"
  >
    <template v-if="sectionHeader" #before-list>
      <p class="text-label-base text-text-default">{{ sectionHeader }}</p>
    </template>

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
  pickQuickPicks,
  tokenRowAccessory,
} from '@/components/token_selector/tokenSelector'
import type { TokenSelectorItem } from '@/components/token_selector/types'
import AppTag from '@/components/tag/AppTag.vue'
import AppTooltip from '@/components/tooltip/AppTooltip.vue'

import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'
import { getTokenDisplayName } from '@/utils/tokenDisplayName'
import { useChainsStore } from '@/stores/chainsStore'
import { useStocksStore } from '@/stores/stocksStore'
import { useMarketStatusStore } from '@/stores/marketStatusStore'
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

const { t } = useI18n()
const { formatFiat } = useCurrency()
const walletStore = useWalletStore()
const stocksStore = useStocksStore()
const { isLoadingBalances, isWalletConnected } = storeToRefs(walletStore)
const chainsStore = useChainsStore()
const { isLoaded } = storeToRefs(chainsStore)
const { currentSession } = storeToRefs(useMarketStatusStore())

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

const sectionHeader = computed(() => {
  if (props.side !== 'buy') return ''
  const session = currentSession.value
  if (!session || session === 'regular') return ''
  const name = t(`trade.market_status.${session}`)
  return name.startsWith('trade.')
    ? ''
    : t('trade.select_asset.available_in', { marketStatus: name })
})

const networkIcon = computed(() =>
  props.networkName ? chainsStore.getChainIcon(props.networkName) : undefined,
)

const tokenId = (token: NewTokenInfo) =>
  (token.address || token.symbol).toLowerCase()

const disabledAddresses = computed(
  () => new Set(props.disabledTokens.map(address => address.toLowerCase())),
)

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
}

const assets = computed<TradeAsset[]>(() => {
  if (!isLoaded.value) return []
  const assets = (props.chainTokens as TradeAssetToken[]).map(token => {
    const amount = token.balance
      ? formatUnits(BigInt(token.balance), token.decimals)
      : '0'
    return {
      token:
        props.side === 'sell'
          ? {
              ...token,
              name: getTokenDisplayName({
                name: token.name,
                ondo: walletStore.getTokenBalance(token.address)?.ondo,
              }),
            }
          : token,
      amount,
      fiatValue: BigNumber(amount).multipliedBy(token.price || 0),
    }
  })
  if (props.side === 'buy') return assets
  return (
    assets
      // Filter on balance, not fiat value: a held token whose price feed is
      // missing must stay sellable. With no wallet connected there are no
      // balances at all — show the list rather than an empty "no tokens" state.
      .filter(
        ({ amount }) =>
          !isWalletConnected.value || BigNumber(amount).isGreaterThan(0),
      )
      .sort((a, b) => b.fiatValue.comparedTo(a.fiatValue) ?? 0)
  )
})

const toItem = ({
  token,
  amount,
  fiatValue,
}: TradeAsset): TokenSelectorItem<TradeAssetToken> => {
  const { isStock, symbol } = tradeAssetLabel(
    token,
    props.side,
    props.networkName,
    stocksStore.isStock,
  )
  const held = BigNumber(amount).isGreaterThan(0)
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
          balanceFiat: held ? formatFiat(fiatValue).display : undefined,
          balance: held
            ? `${formatFloatingPointValue(amount).value} ${truncate(token.symbol, 7)}`
            : undefined,
          price: formatFiat(BigNumber(token.price || 0)).display,
          change: token.priceChangePercentage24h,
        }),
    disabled:
      paused || disabledAddresses.value.has(token.address?.toLowerCase()),
    raw: token,
  }
}

const allItems = computed(() => assets.value.map(toItem))

const items = computed(() =>
  fuzzySearchByKeys(allItems.value, ['name', 'symbol'], searchInput.value),
)

const quickPicks = computed(() =>
  pickQuickPicks(
    allItems.value,
    assets.value.find(
      ({ token }) => token.address?.toLowerCase() === MAIN_TOKEN_CONTRACT,
    )?.token.symbol ?? '',
  ),
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
