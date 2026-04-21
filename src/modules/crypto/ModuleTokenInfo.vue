<template>
  <div class="flex flex-col mb-10 w-full divide-y divide-grey-10">
    <div class="pb-3 xs:pb-5">
      <!-- Header: Share and Watchlist (Placeholders) -->
      <div
        class="flex items-center justify-end gap-3 mt-2 sm:mt-4 mb-2 mr-[72px] xs:mr-[80px]"
      >
        <app-pop-up-menu placeholder="Share" location="right">
          <template #menu-button="{ toggleMenu }">
            <app-btn-icon
              label="Share"
              :disabled="isLoading"
              @click="toggleMenu"
            >
              <share-icon class="h-5 w-5" />
            </app-btn-icon>
          </template>
          <template #menu-content="{ toggleMenu }">
            <div class="py-2 min-w-[200px]">
              <ul class="px-2 text-s-14">
                <li
                  class="text-black p-2 rounded-8 hoverNoBG cursor-pointer flex items-center gap-2"
                  @click="
                    () => {
                      shareOn('x')
                      toggleMenu()
                    }
                  "
                >
                  <svg
                    class="w-5 h-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    />
                  </svg>
                  Share on X
                </li>
                <li
                  class="text-black p-2 rounded-8 hoverNoBG cursor-pointer flex items-center gap-2"
                  @click="
                    () => {
                      shareOn('telegram')
                      toggleMenu()
                    }
                  "
                >
                  <svg
                    class="w-5 h-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
                    />
                  </svg>
                  Share on Telegram
                </li>
                <li
                  class="text-black p-2 rounded-8 hoverNoBG cursor-pointer flex items-center gap-2"
                  @click="
                    () => {
                      shareOn('reddit')
                      toggleMenu()
                    }
                  "
                >
                  <svg
                    class="w-5 h-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"
                    />
                  </svg>
                  Share on Reddit
                </li>
                <li
                  class="text-black p-2 rounded-8 hoverNoBG cursor-pointer flex items-center gap-2"
                  @click="
                    () => {
                      copyShareLink()
                      toggleMenu()
                    }
                  "
                >
                  <check-icon
                    v-if="linkCopied"
                    class="w-5 h-5 shrink-0 text-success"
                  />
                  <clipboard-icon v-else class="w-5 h-5 shrink-0" />
                  {{ linkCopied ? 'Copied!' : 'Copy link' }}
                </li>
              </ul>
            </div>
          </template>
        </app-pop-up-menu>
        <app-btn-icon
          :label="isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'"
          :disabled="isLoading"
          @click="toggleWatchlist"
        >
          <star-solid-icon v-if="isWatchlisted" class="h-5 w-5" />
          <star-outline-icon v-else class="h-5 w-5" />
        </app-btn-icon>
      </div>
      <!-- Token logo, name, price, price change -->
      <div
        v-if="isLoading || tokenData === null"
        class="mx-3 xs:mx-6 md:mx-4 lg:mx-10 h-[63px] lg:h-[65px] xl:h-[67px] animate-pulse bg-surface rounded-12 w-[60%]"
      ></div>
      <div
        v-else
        :class="[
          isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10',
          'px-4 py-0 flex items-start gap-4',
        ]"
      >
        <div class="relative">
          <app-token-logo
            :url="tokenData.iconUrl"
            :symbol="tokenData.symbol"
            width="w-10 xs:w-[56px]"
            height="h-10 xs:h-[56px]"
          />
          <div
            class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
          >
            <app-token-logo
              v-if="selectedChain && existsOnCurrentChain"
              :url="selectedChain.icon"
              :symbol="selectedChain.name"
              width="w-5"
              height="h-5"
            />
          </div>
        </div>

        <div class="flex flex-col">
          <h1
            class="text-s-20 xs:text-s-24 leading-p-110 font-bold xl:text-s-28"
          >
            {{ tokenData.symbol.toUpperCase() }}
            <span class="text-s-17 xs:text-s-20 mr-1 font-semibold"
              >({{ tokenData.name }})</span
            >
          </h1>
          <div>
            <p class="text-s-20 xs:text-s-24 inline">
              ${{
                tokenData.currentPrice
                  ? formatFiatValue(tokenData.currentPrice).value
                  : '--'
              }}
            </p>
            <div
              v-if="tokenData.priceChangePercentage24h"
              class="inline-block ml-2"
            >
              <ArrowTrendingDownIcon
                v-if="tokenData.priceChangePercentage24h < 0"
                class="w-4 h-4 inline-block text-error"
              />
              <ArrowTrendingUpIcon
                v-else
                class="w-4 h-4 inline-block text-success"
              />
              <span
                :class="[
                  {
                    'text-success': tokenData.priceChangePercentage24h >= 0,
                    'text-error': tokenData.priceChangePercentage24h < 0,
                  },
                  'ml-1 text-s-14 xs:text-s-17 ',
                ]"
              >
                {{ tokenData.priceChangePercentage24h.toFixed(2) }}%
              </span>
            </div>
          </div>
          <p
            v-if="!isLoading && existsOnCurrentChain"
            class="text-s-8 xs:text-s-11 tracking-sp-06 font-bold uppercase text-info"
          >
            on {{ selectedChain?.name }}
          </p>
        </div>
      </div>
    </div>
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
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import TokenInfoMarketData from './components/token_info/TokenInfoMarketData.vue'
import TokenInfoSupportedChains from './components/token_info/TokenInfoSupportedChains.vue'
import TokenInfoChart from './components/token_info/TokenInfoChart.vue'
import { ShareIcon, StarIcon as StarSolidIcon } from '@heroicons/vue/24/solid'
import {
  StarIcon as StarOutlineIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ClipboardIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'
import { computed, ref, watch } from 'vue'
import { formatFiatValue } from '@/utils/numberFormatHelper'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
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
const linkCopied = ref(false)

const shareText = computed(() => {
  const symbol = tokenData.value?.symbol?.toUpperCase() ?? ''
  const price = tokenData.value?.currentPrice
    ? `$${formatFiatValue(tokenData.value.currentPrice).value}`
    : ''
  return `Check out ${symbol} ${price} on MyEtherWallet`
})

const shareUrls: Record<string, (url: string, text: string) => string> = {
  x: (url, text) =>
    `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  telegram: (url, text) =>
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  reddit: (url, text) =>
    `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
}

const shareOn = (platform: 'x' | 'telegram' | 'reddit') => {
  const url = window.location.href
  window.open(
    shareUrls[platform](url, shareText.value),
    '_blank',
    'noopener,noreferrer',
  )
}

const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch {
    // clipboard unavailable
  }
}
</script>
