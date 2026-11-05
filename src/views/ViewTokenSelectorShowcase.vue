<script setup lang="ts">
// Preview for the Token Selector (MEW-2554) at /dev/token-selector, Figma
// 12526:110349. Mock data only: search and sort run here the way a flow would.
import { computed, ref } from 'vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppToggle from '@/components/AppToggle.vue'
import AppTokenSelectorModal from '@/components/token_selector/AppTokenSelectorModal.vue'
import {
  pickQuickPicks,
  tokenRowAccessory,
} from '@/components/token_selector/tokenSelector'
import type {
  TokenSelectorItem,
  TokenSelectorSortDirection,
} from '@/components/token_selector/types'
import ethLogo from '@/assets/icons/tokens/eth.svg'
import usdcLogo from '@/assets/images/rwa-rewards/usdc-icon.png'

interface MockToken {
  symbol: string
  name: string
  price: number
  change: number
  marketCap: number
  balance?: number
  logo?: string
  paused?: boolean
  unavailable?: boolean
}

const TOKENS: MockToken[] = [
  {
    symbol: 'USDC',
    name: 'USD Circle',
    price: 1,
    change: -0.01,
    marketCap: 74,
    balance: 1230,
    logo: usdcLogo,
  },
  {
    symbol: 'USDT',
    name: 'USD Tether',
    price: 1,
    change: 0.02,
    marketCap: 140,
  },
  {
    symbol: 'ETH',
    name: 'Ether',
    price: 3188.05,
    change: 1.23,
    marketCap: 380,
    logo: ethLogo,
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    price: 98189.37,
    change: -0.04,
    marketCap: 12,
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    price: 3190.1,
    change: 0.1,
    marketCap: 9,
    logo: ethLogo,
  },
  { symbol: 'DAI', name: 'Dai', price: 1, change: 0, marketCap: 5 },
  { symbol: 'LINK', name: 'Chainlink', price: 14.2, change: 3.4, marketCap: 8 },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    price: 7.9,
    change: -2.21,
    marketCap: 4,
    paused: true,
  },
  {
    symbol: 'AAVE',
    name: 'Aave',
    price: 152.3,
    change: 0.8,
    marketCap: 3,
    unavailable: true,
  },
]

const usd = (value: number) =>
  `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`

const open = ref(false)
const search = ref('')
const withNetworks = ref(true)
const withSort = ref(true)
const loading = ref(false)
const network = ref<string | null>('Ethereum')
const sortValue = ref('market_cap')
const sortDirection = ref<TokenSelectorSortDirection>('desc')
const selectedId = ref('eth')

const toItem = (token: MockToken): TokenSelectorItem<MockToken> => ({
  id: token.symbol.toLowerCase(),
  symbol: token.symbol,
  name: token.name,
  logo: token.logo,
  disabled: token.paused,
  rightAccessory: tokenRowAccessory({
    price: usd(token.price),
    change: token.change,
  }),
  raw: token,
})

const sorted = computed(() => {
  const dir = sortDirection.value === 'asc' ? 1 : -1
  const key = sortValue.value === 'price' ? 'price' : 'marketCap'
  return [...TOKENS].sort((a, b) => (a[key] - b[key]) * dir).map(toItem)
})
const matching = (list: TokenSelectorItem<MockToken>[]) => {
  const query = search.value.trim().toLowerCase()
  return query
    ? list.filter(
        item =>
          item.symbol.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query),
      )
    : list
}
const allItems = computed(() =>
  sorted.value.filter(item => !item.raw.unavailable),
)
const items = computed(() => matching(allItems.value))
const unavailableItems = computed(() =>
  matching(sorted.value.filter(item => item.raw.unavailable)),
)
const quickPicks = computed(() => pickQuickPicks(allItems.value, 'ETH'))
const recentItems = computed(() =>
  allItems.value.filter(item => ['wbtc', 'weth'].includes(item.id)),
)
// "Your assets" rows show the holding instead of the price.
const ownedItems = computed(() =>
  TOKENS.filter(token => token.balance).map(token => ({
    ...toItem(token),
    rightAccessory: tokenRowAccessory({
      balanceFiat: usd((token.balance ?? 0) * token.price),
      balance: `${token.balance} ${token.symbol}`,
    }),
  })),
)

const onSort = (value: string) => {
  if (value === sortValue.value)
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  else {
    sortValue.value = value
    sortDirection.value = 'desc'
  }
}

const picked = ref<string>()
const onSelect = (item: TokenSelectorItem) => {
  selectedId.value = item.id
  picked.value = item.symbol
}
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Token Selector</h1>
      <p class="text-text-sm text-text-subtle">
        Shared modal for picking a token in Swap, Bridge, Send, Trade and
        Buy/Sell. The flows filter and sort the list; the modal renders it.
      </p>
    </header>

    <section class="flex flex-col gap-4 rounded-12 bg-background-default p-6">
      <div class="flex items-center gap-3 text-text-sm">
        <AppToggle v-model="withNetworks" aria-label="Network dropdown" />
        Network dropdown
      </div>
      <div class="flex items-center gap-3 text-text-sm">
        <AppToggle v-model="withSort" aria-label="Sort control" />
        Sort control
      </div>
      <div class="flex items-center gap-3 text-text-sm">
        <AppToggle v-model="loading" aria-label="Loading" />
        Loading
      </div>
      <div class="flex items-center gap-4">
        <AppBaseButton @click="open = true">Open token selector</AppBaseButton>
        <span v-if="picked" class="text-text-sm text-text-subtle">
          Picked: {{ picked }}
        </span>
      </div>
    </section>

    <AppTokenSelectorModal
      v-model="open"
      v-model:search="search"
      v-model:network="network"
      title="Select asset to buy"
      :items="items"
      :quick-picks="quickPicks"
      :recent-items="recentItems"
      :owned-items="ownedItems"
      :unavailable-items="unavailableItems"
      unavailable-title="Unavailable during post-market"
      :selected-id="selectedId"
      :network-icon="ethLogo"
      :networks="
        withNetworks
          ? [
              { value: null, name: 'All networks' },
              { value: 'Ethereum', name: 'Ethereum', icon: ethLogo },
              { value: 'Base', name: 'Base' },
              { value: 'Solana', name: 'Solana', disabled: true },
            ]
          : []
      "
      :sort-options="
        withSort
          ? [
              { value: 'market_cap', label: 'Market cap' },
              { value: 'price', label: 'Price' },
            ]
          : []
      "
      :sort-value="sortValue"
      :sort-direction="sortDirection"
      :loading="loading"
      @sort="onSort"
      @select="onSelect"
    />
  </div>
</template>
