<template>
  <div class="flex flex-col mb-10 w-full divide-y divide-grey-10">
    <app-asset-info-header
      :is-loading="isLoading"
      :has-data="tokenData !== null"
      :share-text="shareText"
      :is-watchlisted="isWatchlisted"
      :icon-url="tokenData?.iconUrl || undefined"
      :symbol="tokenData?.symbol || ''"
      :name="tokenData?.name || ''"
      :current-price="tokenData?.currentPrice ?? null"
      :price-change-percentage="tokenData?.priceChangePercentage24h ?? null"
      :selected-chain="selectedChain"
      :exists-on-current-chain="existsOnCurrentChain"
      :is-open-side-menu="isOpenSideMenu"
      @toggle-watchlist="toggleWatchlist"
    />
    <!-- Chart and balance -->
    <div class="flex flex-col py-6" v-if="tokenId">
      <div
        :class="[
          isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10',
          'px-4  w-full',
        ]"
      >
        <token-info-chart :token-id="tokenId" />
      </div>
      <token-info-balance
        :is-loading="isLoading"
        :chain-balances="tokenData?.chainBalances"
        :token-icon-url="tokenData?.iconUrl || undefined"
        :token-symbol="tokenData?.symbol"
        :supported-chains="tokenData?.supportedChains"
        :current-price="tokenData?.currentPrice?.toString() || undefined"
        :is-stock-view="false"
        @bridge-to-chain="setBridgeWalletStore"
      />
    </div>
    <!-- Market Data -->
    <token-info-market-data :is-loading="isLoading" :token-data="tokenData" />
    <!-- Supported Chains -->
    <token-info-supported-chains
      v-if="!isLoading"
      :is-loading="isFetching"
      :token-icon-url="tokenData?.iconUrl || undefined"
      :token-symbol="tokenData?.symbol || undefined"
      :supported-chains="tokenData?.supportedChains"
      :token-id="tokenData?.coinId"
      :is-stock-view="false"
      @bridge-to-chain="setBridgeWalletStore"
    />
  </div>
</template>

<script setup lang="ts">
import AppAssetInfoHeader from '@/components/AppAssetInfoHeader.vue'
import TokenInfoMarketData from './components/token_info/TokenInfoMarketData.vue'
import TokenInfoSupportedChains from './components/token_info/TokenInfoSupportedChains.vue'
import TokenInfoChart from './components/token_info/TokenInfoChart.vue'
import { computed, ref, watch } from 'vue'
import { formatFiatValue } from '@/utils/numberFormatHelper'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { type GetWebTokenInfo, type TokenBalanceRaw } from '@/mew_api/types'
import { useWalletStore } from '@/stores/walletStore'
import TokenInfoBalance from './components/token_info/TokenInfoBalance.vue'
import { useTokenInfoStore } from '@/stores/tokenInfoStore'
import type { DisplayToken } from '../portfolio/components/balances/TableTokenBalance.vue'
import { useInputStore } from '@/stores/inputStore'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import type { Chain, TokenSupportedChain } from '@/mew_api/types'
import type { NewTokenInfo } from '@/composables/useSwap'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  tokenId: {
    type: String,
    required: true,
  },
})

const walletStore = useWalletStore()
const { walletAddress, isWalletConnected } = storeToRefs(walletStore)
const recentlyViewedTokensStore = useRecentlyViewedTokensStore()
/** --------------------
 * Wallet Menu Buttons
 --------------------*/
const walletMenu = useWalletMenuStore()
const { isOpenSideMenu, walletPanel } = storeToRefs(walletMenu)

/** --------------------
 * Input Store
 --------------------*/
const inputStore = useInputStore()
const { storeSwapValues } = inputStore

const isInSwapPackage = (chainName: string): boolean => {
  return chainsStore.chainHasSwapSupport(chainName)
}

const setSwapWalletStore = () => {
  if (fetchedTokenData.value === null || tokenData.value === null) {
    return
  }
  const currentChainToken = fetchedTokenData.value.supportedChains.find(
    chain => chain.chainName === selectedChain.value?.name,
  )
  const currentBalance = fetchedTokenData.value.chainBalances?.find(
    chain => chain.chainName === selectedChain.value?.name,
  )
  if (
    currentChainToken &&
    currentChainToken.contract &&
    isInSwapPackage(currentChainToken.chainName) &&
    currentBalance &&
    currentBalance.result.ok
  ) {
    storeSwapValues({
      fromToken: {} as NewTokenInfo,
      toToken: {
        address: currentChainToken.contract,
        symbol: fetchedTokenData.value.symbol,
        decimals: currentBalance.result.value.decimals || 18,
        name: fetchedTokenData.value.name,
      } as NewTokenInfo,
      fromAmount: '',
      toChain: selectedChain.value as Chain,
    })
  }
}

interface BridgeValues {
  fromToken: NewTokenInfo
  toToken: NewTokenInfo
  fromAmount: string
  toChain: Chain
}
const bridgeValues = ref<BridgeValues | undefined>(undefined)

const setBridgeValues = (
  _chain: TokenSupportedChain | undefined = undefined,
) => {
  if (fetchedTokenData.value === null || tokenData.value === null) {
    return
  }
  //if no chain is provided and local values exhist dont override them, this allows to switch between swap and bridge view without losing selected chain in bridge
  if (!_chain && bridgeValues.value) {
    return
  }
  const targetToChain = _chain
    ? _chain
    : fetchedTokenData.value.supportedChains.find(
        chain =>
          chain.chainName !== selectedChain.value?.name &&
          isInSwapPackage(chain.chainName),
      )
  if (targetToChain) {
    const chainInstore = chainsStore.allChains.find(
      c => c.name === targetToChain.chainName,
    )
    if (!chainInstore) {
      return
    }
    const _contract = targetToChain?.contract || MAIN_TOKEN_CONTRACT
    const chainBalance = fetchedTokenData.value.chainBalances?.find(
      chain => chain.chainName === targetToChain.chainName,
    )
    if (!chainBalance || !chainBalance.result.ok) {
      return
    }
    bridgeValues.value = {
      fromToken: {} as NewTokenInfo,
      toToken: {
        address: _contract,
        symbol: fetchedTokenData.value.symbol,
        decimals: chainBalance.result.value.decimals || 18,
        name: fetchedTokenData.value.name,
      } as NewTokenInfo,
      fromAmount: '',
      toChain: chainInstore,
    }
  }
}

const setBridgeWalletStore = (
  _chain: TokenSupportedChain | undefined = undefined,
) => {
  setBridgeValues(_chain)
  if (bridgeValues.value) {
    storeSwapValues(bridgeValues.value)
  }
  if (walletPanel.value !== 'bridge') {
    walletMenu.setWalletPanel('bridge')
  }
}

watch(walletPanel, () => {
  if (walletPanel.value === 'swap') {
    setSwapWalletStore()
  } else if (walletPanel.value === 'bridge') {
    setBridgeWalletStore()
  }
})

/** --------------------
 * Fetch Data
 --------------------*/
/**
 * Used to store fetched token data locally when switching between addresses
 */
const tokenLocalStore = ref<GetWebTokenInfo | undefined>(undefined)

const endpoint = computed(() => {
  const wallet =
    isWalletConnected.value && walletAddress.value
      ? `?evmAddresses=${walletAddress.value}`
      : ''
  return `/v1/web/pages/token-info/coins/${props.tokenId}${wallet}`
})
const isLoadedData = ref(false)

const { useMEWFetch } = useFetchMewApi()
const {
  data: fetchedTokenData,
  isFetching,
  onFetchResponse,
} = useMEWFetch(endpoint, { refetch: true }).get().json<GetWebTokenInfo>()

const isLoading = computed(() => {
  return !isLoadedData.value
})
onFetchResponse(() => {
  if (fetchedTokenData.value === null) {
    return
  }
  const currentChainToken = fetchedTokenData.value.supportedChains.find(
    chain => chain.chainName === selectedChain.value?.name,
  )
  recentlyViewedTokensStore.addToken({
    id: fetchedTokenData.value.coinId,
    symbol: fetchedTokenData.value.symbol,
    icon: fetchedTokenData.value.iconUrl || undefined,
    name: fetchedTokenData.value.name,
    isStock: false,
  })
  if (currentChainToken) {
    setSwapWalletStore()
    walletMenu.setWalletPanel('swap')
  } else {
    setBridgeWalletStore(currentChainToken)
    walletMenu.setWalletPanel('bridge')
  }
  tokenLocalStore.value = fetchedTokenData.value
  isLoadedData.value = true
})

/** --------------------
 * Balances
 --------------------*/
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

const existsOnCurrentChain = computed(() => {
  if (
    tokenData.value &&
    tokenData.value.supportedChains &&
    selectedChain.value
  ) {
    return tokenData.value.supportedChains.some(
      chain => chain.chainName === selectedChain.value?.name,
    )
  }
  return false
})

const tokenData = computed(() => {
  const store = useTokenInfoStore()
  const { tokenInfo } = storeToRefs(store)
  if (!tokenLocalStore.value && !tokenInfo.value) return null
  if (tokenLocalStore.value) {
    return tokenLocalStore.value
  }
  const isInStore =
    tokenInfo.value?.symbol === props.tokenId ||
    tokenInfo.value?.coinId === props.tokenId
  const _tokenInfo = tokenInfo.value as TokenBalanceRaw & DisplayToken
  const parsedTokenInfo: {
    name: string
    symbol: string
    coinId: string
    contract: string
    iconUrl: string
    currentPrice: string | number
    balance: string
    balanceWei: string
    decimals: string | number
    chainBalances?: Array<{
      chainName: string
      chainNameLong: string
      chainType: string
      iconUrl: string
      result: {
        ok: boolean
        value: {
          balances: Array<{
            ok: boolean
            value: {
              owner: string
              value: string
            }
          }>
          decimals: number
        }
      }
    }>
    supportedChains?: Array<{
      chainName: string
      chainNameLong: string
      chainType: string
      contract: string
      iconUrl: string
    }>
  } = {
    name: isInStore
      ? _tokenInfo?.name || ''
      : `${props.tokenId} token not found`,
    symbol: isInStore ? _tokenInfo?.symbol || '' : 'N/A',
    coinId: isInStore ? _tokenInfo?.coinId || props.tokenId : props.tokenId,
    contract: isInStore ? _tokenInfo?.contract || '' : '',
    iconUrl: isInStore ? _tokenInfo?.logo_url || '' : '',
    currentPrice: isInStore ? _tokenInfo?.price || 0 : 0,
    balance: isInStore ? _tokenInfo?.balance || '0' : 'N/A',
    balanceWei: isInStore ? _tokenInfo?.balanceWei || '0' : 'N/A',
    decimals: isInStore ? _tokenInfo?.decimals || 18 : 'N/A',
  }
  if (isInStore) {
    parsedTokenInfo['chainBalances'] = [
      {
        chainName: selectedChain.value?.name || '',
        chainNameLong: selectedChain.value?.name || '',
        chainType: selectedChain.value?.type || '',
        iconUrl: selectedChain.value?.icon || '',
        result: {
          ok: true,
          value: {
            balances: [
              {
                ok: true,
                value: {
                  owner: walletAddress.value || '',
                  value: _tokenInfo?.balanceWei || '0',
                },
              },
            ],
            decimals: _tokenInfo?.decimals || 18,
          },
        },
      },
    ]
    parsedTokenInfo['supportedChains'] = [
      {
        chainName: selectedChain.value?.name || '',
        chainNameLong: selectedChain.value?.name || '',
        chainType: selectedChain.value?.type || '',
        contract: _tokenInfo?.contract || '',
        iconUrl: selectedChain.value?.icon || '',
      },
    ]
  }
  // force instance as its fake data
  return parsedTokenInfo as unknown as GetWebTokenInfo
})

/** --------------------
 * Watchlist
 --------------------*/
const watchlistStore = useWatchlistStore()
const { isWatchListed, setWatchlistItem } = watchlistStore

const isWatchlisted = computed(() => {
  const coinId = tokenData.value?.coinId
  if (!coinId) return false
  return isWatchListed(coinId)
})

const toggleWatchlist = () => {
  const coinId = tokenData.value?.coinId
  if (!coinId) return
  setWatchlistItem(coinId, false) // false = not a stock
}

/** --------------------
 * Share
 --------------------*/
const shareText = computed(() => {
  const ticker = tokenData.value?.symbol?.toUpperCase() ?? ''
  const price = tokenData.value?.currentPrice
    ? `$${formatFiatValue(tokenData.value.currentPrice).value}`
    : ''
  return t('common.share_message', { ticker, price })
})
</script>
