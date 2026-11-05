<template>
  <app-token-selector-modal
    v-model="isOpen"
    v-model:search="search"
    v-model:network="networkFilter"
    :title="
      side === 'sell'
        ? $t('purchase.select_token.title_sell')
        : $t('purchase.select_token.title_buy')
    "
    :items="items"
    :quick-picks="quickPicks"
    :recent-items="recentItems"
    :selected-id="selectedId"
    :networks="networkOptions"
    :loading="isLoading"
    :empty-text="$t('purchase.select_token.no_results')"
    @select="emit('update:selected', $event.raw as PurchaseAsset)"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppTokenSelectorModal from '@/components/token_selector/AppTokenSelectorModal.vue'
import {
  pickQuickPicks,
  tokenRowAccessory,
} from '@/components/token_selector/tokenSelector'
import type {
  TokenSelectorItem,
  TokenSelectorNetwork,
} from '@/components/token_selector/types'
import { useCurrency } from '@/composables/useCurrency'
import { useChainsStore } from '@/stores/chainsStore'
import { usePurchaseStore, type BuyNetwork } from '@/stores/purchaseStore'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'
import {
  getPurchaseChainIcon,
  getPurchaseTokenIcon,
} from '../helpers/purchaseIcons'
import { purchaseChainToChain } from '../helpers/chainMapping'
import type { PurchaseAsset } from '@/types/buyToken'

const props = defineProps<{
  side: 'buy' | 'sell'
  networks: BuyNetwork[]
  defaultChainCode: string | null
  selectedToken: PurchaseAsset | null
  compatibleChains?: string[]
  incompatibleChains?: string[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'update:selected': [token: PurchaseAsset]
}>()

const isOpen = defineModel('isOpen', { type: Boolean, required: true })

const { t } = useI18n()
const chainsStore = useChainsStore()
const { chains } = storeToRefs(chainsStore)
const { coinImages } = storeToRefs(usePurchaseStore())
const { recentlyViewedCrypto } = storeToRefs(useRecentlyViewedTokensStore())
const { formatFiat } = useCurrency()

const search = ref('')
const networkFilter = ref<string | null>(null)

// An empty compatible list means every network is allowed.
const compatibleNetworks = computed(() =>
  props.compatibleChains?.length
    ? props.networks.filter(n => props.compatibleChains!.includes(n.chain))
    : props.networks,
)

const chainIcon = (network: BuyNetwork) =>
  getPurchaseChainIcon(network.chain, network.tokens, chainsStore)

const networkOptions = computed<TokenSelectorNetwork[]>(() => [
  { value: null, name: t('purchase.select_token.filter_all_networks') },
  ...compatibleNetworks.value.map(network => ({
    value: network.chain,
    name: network.name,
    icon: chainIcon(network),
  })),
  ...props.networks
    .filter(
      network =>
        props.incompatibleChains?.includes(network.chain) &&
        !compatibleNetworks.value.includes(network),
    )
    .map(network => ({
      value: network.chain,
      name: network.name,
      icon: chainIcon(network),
      disabled: true,
    })),
])

watch(isOpen, value => {
  if (!value) return
  const { defaultChainCode } = props
  // Fall back to all networks so the dropdown and the list agree.
  networkFilter.value = compatibleNetworks.value.some(
    n => n.chain === defaultChainCode,
  )
    ? defaultChainCode
    : null
})

const toItem = (
  token: PurchaseAsset,
  network: BuyNetwork,
): TokenSelectorItem<PurchaseAsset> => {
  const { market_data: market } = token
  return {
    id: `${network.chain}:${token.symbol}`,
    symbol: token.symbol,
    name: token.name,
    logo: getPurchaseTokenIcon(
      token,
      network.tokens,
      chainsStore,
      coinImages.value,
    ),
    chainIcon: chainIcon(network),
    // market_data prices are in USD; formatFiat converts to the app currency.
    rightAccessory: tokenRowAccessory({
      price: market?.price ? formatFiat(market.price).display : undefined,
      change: parseFloat(market?.price_change_percentage_24h ?? ''),
    }),
    raw: token,
  }
}

// Every token of the chosen network(s), before search.
const networkItems = computed(() =>
  compatibleNetworks.value
    .filter(n => !networkFilter.value || n.chain === networkFilter.value)
    .flatMap(network => network.tokens.map(token => toItem(token, network))),
)

const items = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return networkItems.value
  return networkItems.value.filter(
    ({ symbol, name }) =>
      symbol.toLowerCase().includes(term) || name.toLowerCase().includes(term),
  )
})

const quickPicks = computed(() =>
  pickQuickPicks(
    networkItems.value,
    networkFilter.value
      ? (purchaseChainToChain(networkFilter.value, chains.value)
          ?.currencyName ?? networkFilter.value)
      : 'ETH',
  ),
)

// Recently viewed entries are keyed by coingecko id.
const recentItems = computed(() =>
  recentlyViewedCrypto.value.flatMap(
    ({ id }) =>
      networkItems.value.find(item => item.raw.coingecko_id === id) ?? [],
  ),
)

const selectedId = computed(() =>
  props.selectedToken
    ? `${props.selectedToken.chain}:${props.selectedToken.symbol}`
    : undefined,
)
</script>
