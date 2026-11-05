<template>
  <AppPicker
    size="s"
    :title="truncate(selectedToken?.symbol ?? '', 7)"
    :loading="isLoading || !selectedToken"
    :aria-label="$t('select_token.title')"
    @click="showAllTokens = true"
  >
    <template #avatar>
      <app-token-logo
        v-if="selectedToken"
        :url="selectedToken.logo_url"
        :alt="selectedToken.symbol"
        width="w-6"
        height="h-6"
        no-shadow
        :is-stock="selectedToken.ondo !== undefined"
      />
    </template>
  </AppPicker>
  <AppTokenSelectorModal
    v-model="showAllTokens"
    v-model:search="searchInput"
    :title="$t('select_token.title')"
    :items="items"
    :quick-picks="quickPicks"
    :recent-items="recentItems"
    :selected-id="selectedTokenContract?.toLowerCase()"
    :sort-options="sortOptions"
    :sort-value="activeSortValue"
    :sort-direction="activeSortDirection"
    :network-icon="selectedChain?.icon"
    :loading="isLoading"
    @sort="setActiveSort"
    @select="onSelect"
  />
</template>

<script setup lang="ts">
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { getTokenDisplayName } from '@/utils/tokenDisplayName'
import { type TokenBalance } from '@/mew_api/types'
import { ref, computed, onMounted, watch } from 'vue'
import BigNumber from 'bignumber.js'
import { storeToRefs } from 'pinia'
import { truncate } from '@/utils/filters'
import AppTokenLogo from './AppTokenLogo.vue'
import AppPicker from '@/components/picker/AppPicker.vue'
import AppTokenSelectorModal from '@/components/token_selector/AppTokenSelectorModal.vue'
import {
  pickQuickPicks,
  tokenRowAccessory,
} from '@/components/token_selector/tokenSelector'
import type { TokenSelectorItem } from '@/components/token_selector/types'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'
import { fuzzySearchByKeys } from '@/utils/searchArray'
import { useChainsStore } from '@/stores/chainsStore'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  externalLoading: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
const { formatFiat } = useCurrency()

const store = useWalletStore()
const {
  isLoadingBalances,
  tokens: erc20Tokens,
  safeMainTokenBalance,
} = storeToRefs(store)

const chainsStore = useChainsStore()
const { isLoaded, selectedChain } = storeToRefs(chainsStore)

const { recentlyViewedCrypto } = storeToRefs(useRecentlyViewedTokensStore())

const isLoading = computed(() => {
  return props.externalLoading || isLoadingBalances.value || !isLoaded.value
})

const tokens = computed<TokenBalance[]>(() => {
  if (!isLoaded.value || safeMainTokenBalance.value === null) return []
  return [safeMainTokenBalance.value, ...erc20Tokens.value]
})

const selectedTokenContract = defineModel<string>('selectedTokenContract')

const selectedToken = computed<TokenBalance | null>(() => {
  return store.getTokenBalance(
    selectedTokenContract.value || MAIN_TOKEN_CONTRACT,
  )
})

const showAllTokens = ref(false)
const searchInput = ref('')

onMounted(() => {
  if (tokens.value.length > 0)
    selectedTokenContract.value = tokens.value[0].contract
})

/** -------------------
 *   Search & Sort
 * -------------------*/
enum SortValueString {
  NAME = 'Name',
  SYMBOL = 'Symbol',
  USD = 'USD Balance',
  BALANCE = 'Balance',
}

const sortOptions = computed(() => {
  return [
    {
      value: SortValueString.NAME,
      label: t('common.name'),
    },
    {
      value: SortValueString.SYMBOL,
      label: t('common.symbol'),
    },
    {
      value: SortValueString.USD,
      label: t('common.usd_balance'),
    },
    {
      value: SortValueString.BALANCE,
      label: t('common.balance'),
    },
  ]
})

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

const activeSortValue = ref<SortValueString>(SortValueString.USD)
const activeSortDirection = ref<SortDirection>(SortDirection.DESC)

// The modal emits every pick, so a repeat pick flips the direction.
const setActiveSort = (value: string) => {
  if (value === activeSortValue.value) {
    activeSortDirection.value =
      activeSortDirection.value === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC
  } else {
    activeSortValue.value = value as SortValueString
    const isNumericSort = [
      SortValueString.USD,
      SortValueString.BALANCE,
    ].includes(activeSortValue.value)
    activeSortDirection.value = isNumericSort
      ? SortDirection.DESC
      : SortDirection.ASC
  }
}

interface TokenBalanceWithUsd extends TokenBalance {
  usd_balance: number
}
const sortedTokens = computed<TokenBalanceWithUsd[]>(() => {
  const items = tokens.value.map(token => {
    const usdBalance = BigNumber(
      BigNumber(token.price || 0).times(BigNumber(token.balance)),
    ).toNumber()
    return {
      ...token,
      usd_balance: usdBalance,
      price: token.price || 0,
    }
  })

  const sortKeyMap: Record<
    SortValueString,
    { key: keyof TokenBalanceWithUsd; type: 'string' | 'number' }
  > = {
    [SortValueString.NAME]: { key: 'name', type: 'string' },
    [SortValueString.SYMBOL]: { key: 'symbol', type: 'string' },
    [SortValueString.USD]: { key: 'usd_balance', type: 'number' },
    [SortValueString.BALANCE]: { key: 'balance', type: 'number' },
  }

  const { key, type } = sortKeyMap[activeSortValue.value]
  return type === 'string'
    ? sortObjectArrayString(items, key, activeSortDirection.value)
    : sortObjectArrayNumber(items, key, activeSortDirection.value)
})

type SendTokenItem = TokenSelectorItem<TokenBalanceWithUsd>

// Right column: the holding, or the price (+24h) when the token has no fiat value.
const toItem = (token: TokenBalanceWithUsd): SendTokenItem => ({
  id: token.contract.toLowerCase(),
  symbol: token.symbol,
  name: getTokenDisplayName(token),
  logo: token.logo_url,
  isStock: token.ondo !== undefined,
  rightAccessory: tokenRowAccessory({
    balanceFiat:
      token.usd_balance > 0 ? formatFiat(token.usd_balance).display : undefined,
    balance: `${formatFloatingPointValue(token.balance).value} ${token.symbol}`,
    price: token.price ? formatFiat(token.price).display : undefined,
    change: token.price_change_percentage_24h,
  }),
  raw: token,
})

const allItems = computed(() => sortedTokens.value.map(toItem))

// Same keys as before: the token's own name (not the Ondo alias) and symbol.
const items = computed(() =>
  fuzzySearchByKeys(allItems.value, ['raw.name', 'symbol'], searchInput.value),
)

const quickPicks = computed(() =>
  pickQuickPicks(allItems.value, safeMainTokenBalance.value?.symbol ?? ''),
)

// Store ids are the CoinGecko id or the contract (see AppSwapSelectedToken).
const RECENT_LIMIT = 6
const recentItems = computed(() => {
  const found = new Set<SendTokenItem>()
  for (const { id } of recentlyViewedCrypto.value) {
    const match = allItems.value.find(
      item => item.raw.coinId === id || item.id === id.toLowerCase(),
    )
    if (match) found.add(match)
  }
  return [...found].slice(0, RECENT_LIMIT)
})

const onSelect = (item: TokenSelectorItem) => {
  selectedTokenContract.value = (item.raw as TokenBalance).contract
}

const emit = defineEmits<{
  'open:selectToken': [isOpen: boolean]
}>()
watch(
  () => showAllTokens.value,
  () => {
    emit('open:selectToken', showAllTokens.value)
  },
)
</script>
