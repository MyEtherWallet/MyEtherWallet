import { defineStore, storeToRefs } from 'pinia'
import { ref, watch, type Ref } from 'vue'

import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'
import {
  supportedSwapEnums,
  enumToChain,
} from '@/providers/ethereum/chainToEnum'
import Swapper, { WalletIdentifier } from '@enkryptcom/swap'
import {
  type TokenType,
  type TokenTypeTo,
  type SupportedNetworkName,
  type ProviderQuoteResponse,
  type ProviderSwapResponse,
  isSupportedNetwork,
} from '@enkryptcom/swap'
import Web3Eth from 'web3-eth'
import type { Chain } from '@/mew_api/types'
import BN from 'bn.js'
import { parseUnits } from 'viem'
import i18n from '@/i18n'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import {
  getRestrictedTokenAddresses,
} from '@/modules/trade/providers/ondoHelpers'
import { isTransientSwapInitError } from '@/utils/swapInitError'
import { hydrateTokenBalances } from '@/utils/tokenBalance'
import { reportModuleError } from '@/utils/reportModuleError'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'

// TODO: Import types from @enkryptcom/swap

// Done to temporarily override balance type with string instead of BN
export interface NewTokenInfo extends Omit<TokenTypeTo, 'balance'> {
  balance?: string
}

export interface ToTokenType {
  top: Record<SupportedNetworkName, TokenTypeTo[]> | Record<string, never>
  trending: Record<SupportedNetworkName, TokenTypeTo[]> | Record<string, never>
  all: Record<SupportedNetworkName, TokenTypeTo[]> | Record<string, never>
}

export interface QuoteParam {
  fromAddress: string
  toAddress: string
  amount: string | number
  fromToken: NewTokenInfo
  toToken: NewTokenInfo
  rank?: number
}

interface SwapStoreState {
  initSwapper: () => Promise<void>
  supportedNetwork: Ref<boolean>
  toTokens: Ref<ToTokenType | null>
  fromTokens: Ref<NewTokenInfo[] | null>
  toChains: Ref<Chain[]>
  swapLoaded: Ref<boolean>
  rawFromTokens: Ref<TokenType[]>
  rawToTokens: Ref<ToTokenType | null>
  restrictedAddressesLower: Ref<string[]>
  getQuote: (params: QuoteParam) => Promise<ProviderQuoteResponse[] | undefined>
  getSwap: (
    quote: ProviderQuoteResponse,
  ) => Promise<ProviderSwapResponse | null>
}

const NetworkNotSupportedError = new Error(
  'Selected network is not supported for swap',
)

// The swap SDK fetches token lists from a remote (GitHub raw) that can return
// transient errors; retry a couple of times before surfacing to the user.
const SWAP_INIT_RETRIES = 2
const SWAP_INIT_RETRY_DELAY_MS = 800

export const useSwapStore = defineStore('swapStore', (): SwapStoreState => {
  const toastStore = useToastStore()
  const { t } = i18n.global
  const chainsStore = useChainsStore()
  const globalStore = useGlobalStore()
  const walletStore = useWalletStore()
  const { selectedChain, allChains, swapChains } = storeToRefs(chainsStore)
  const { selectedNetwork, isTradingRestrictedInRegion } = storeToRefs(globalStore)
  const { tokens, balanceWei, isWalletConnected } = storeToRefs(walletStore)

  let swapInstance: Swapper | null = null
  const supportedNetwork = ref(true)
  const toChains = ref<Chain[]>([])
  const toTokens = ref<ToTokenType | null>(null)
  const fromTokens = ref<NewTokenInfo[] | null>(null)
  const swapLoaded = ref(false)
  const rawFromTokens = ref<TokenType[]>([])
  const rawToTokens = ref<ToTokenType | null>(null)
  const restrictedAddressesLower = ref<string[]>([])
  let inflightInit: Promise<void> | null = null

  // Updates fromTokens with current wallet balances without re-fetching swaplists.
  // Called after init and when wallet tokens/native balance change reactively.
  const applyTokenBalances = () => {
    if (!swapInstance || !swapLoaded.value || !rawFromTokens.value.length) return

    const allFromTokensWithBalance = hydrateTokenBalances(
      rawFromTokens.value,
      {
        balanceSources: tokens.value.map(token => ({
          address: token.contract,
          balance: token.balanceWei,
          price: token.price ?? undefined,
        })),
        mainTokenAddress: MAIN_TOKEN_CONTRACT,
        nativeBalance: balanceWei.value,
        nativePrice: selectedChain.value?.price ?? undefined,
        hydrate: tokens.value.length > 0 || balanceWei.value !== '0',
        freeze: true,
      },
    ) as unknown as NewTokenInfo[]

    const fromAllTokensToWalletTokens = allFromTokensWithBalance.filter(
      token => {
        if (
          tokens.value.find(
            t => t.contract.toLowerCase() === token.address.toLowerCase(),
          )
        ) {
          return true
        }
        if (token.address.toLowerCase() === MAIN_TOKEN_CONTRACT) {
          return true
        }
        return false
      },
    )

    let finalFromTokens = isWalletConnected.value
      ? fromAllTokensToWalletTokens
      : allFromTokensWithBalance

    if (isTradingRestrictedInRegion.value && restrictedAddressesLower.value.length > 0) {
      finalFromTokens = finalFromTokens.filter(
        token =>
          !restrictedAddressesLower.value.includes(token.address.toLowerCase()),
      )
    }

    fromTokens.value = finalFromTokens
  }

  const applyTradingRestrictionToToTokens = () => {
    if (!rawToTokens.value) return
    if (
      !isTradingRestrictedInRegion.value ||
      restrictedAddressesLower.value.length === 0
    ) {
      toTokens.value = rawToTokens.value
      return
    }

    const filterTokenArray = (tokens: TokenTypeTo[]) =>
      tokens.filter(
        token =>
          !restrictedAddressesLower.value.includes(token.address.toLowerCase()),
      )

    toTokens.value = {
      top: Object.fromEntries(
        Object.entries(rawToTokens.value.top).map(([network, tokens]) => [
          network,
          filterTokenArray(tokens as TokenTypeTo[]),
        ]),
      ) as ToTokenType['top'],
      trending: Object.fromEntries(
        Object.entries(rawToTokens.value.trending).map(([network, tokens]) => [
          network,
          filterTokenArray(tokens as TokenTypeTo[]),
        ]),
      ) as ToTokenType['trending'],
      all: Object.fromEntries(
        Object.entries(rawToTokens.value.all).map(([network, tokens]) => [
          network,
          filterTokenArray(tokens as TokenTypeTo[]),
        ]),
      ) as ToTokenType['all'],
    }
  }

  // Initialize the Swapper instance
  // parses tokens and to networks available for swapping
  const doInitSwapper = async (retriesLeft = SWAP_INIT_RETRIES) => {
    const activeNetworkName = selectedChain.value?.name || selectedNetwork.value
    try {
      swapLoaded.value = false
      const rpc = selectedChain.value?.rpcUrls?.[0] || ''
      const activeNetworkEnum = supportedSwapEnums[
        activeNetworkName
      ] as SupportedNetworkName
      const isSupported = isSupportedNetwork(activeNetworkEnum)
      if (!activeNetworkEnum || !isSupported) {
        supportedNetwork.value = false
        throw NetworkNotSupportedError
      }

      swapInstance = new Swapper({
        network: activeNetworkEnum,
        api: new Web3Eth(rpc) as any,
        walletIdentifier: WalletIdentifier.mew,
        evmOptions: {
          infiniteApproval: true,
        },
      })
      await swapInstance.initPromise
      const allFromTokens = swapInstance.getFromTokens()
      supportedNetwork.value = allFromTokens.all.length > 0
      rawFromTokens.value = allFromTokens.all
      rawToTokens.value = swapInstance.getToTokens()

      // Check if trading is restricted and filter out restricted token addresses
      const fetchedRestrictedAddresses = await getRestrictedTokenAddresses()
      restrictedAddressesLower.value = fetchedRestrictedAddresses.map(addr =>
        addr.toLowerCase(),
      )

      applyTradingRestrictionToToTokens()

      const toTokensNetworks = Object.keys(toTokens.value?.all ?? {})
      toChains.value = toTokensNetworks
        .map(networkName => {
          const chainName = enumToChain[networkName as SupportedNetworkName]
          const chain = allChains.value.find(chain => chain.name === chainName)
          if (chain) return chain
        })
        .filter((chain): chain is Chain => chain !== undefined)
      swapChains.value = toChains.value

      swapLoaded.value = true
      applyTokenBalances()
      return Promise.resolve()
    } catch (e) {
      if (
        e instanceof Error &&
        e.message === NetworkNotSupportedError.message
      ) {
        supportedNetwork.value = false
        swapLoaded.value = true
        return
      }
      // Transient upstream failure (the swaplist fetch returned a non-JSON
      // body / dropped) — these recover on their own, so retry before
      // surfacing anything.
      if (isTransientSwapInitError(e) && retriesLeft > 0) {
        await new Promise(resolve =>
          setTimeout(resolve, SWAP_INIT_RETRY_DELAY_MS),
        )
        return doInitSwapper(retriesLeft - 1)
      }
      toastStore.addToastMessage({
        type: ToastType.Error,
        text: t('common.something_went_wrong'),
        textSecondary: t('swap.error.initializing-swap-failed'),
      })
      // Expected external flakiness (transient fetch / JSON parse of a non-JSON
      // upstream body) is surfaced via the toast above but is pure Sentry noise
      // — only report genuinely unexpected init failures.
      reportModuleError({
        tag: SENTRY_MODULE_TAGS.SWAP,
        title: 'SWAP: initSwapper failed',
        error: e,
        expected: isTransientSwapInitError(e),
      })
    }
  }

  const getQuote = async (
    params: QuoteParam,
  ): Promise<ProviderQuoteResponse[] | undefined> => {
    if (!swapInstance || !swapLoaded.value) {
      return undefined
    }

    const rawAmount = parseUnits(
      params.amount.toString(),
      params.fromToken.decimals ?? 18,
    ).toString() // Default to 18 decimals if not specified);
    const quotes = await swapInstance.getQuotes({
      fromAddress: params.fromAddress,
      toAddress: params.toAddress,
      amount: new BN(rawAmount),
      fromToken: params.fromToken as TokenType,
      toToken: params.toToken as TokenTypeTo,
    })
    return quotes.filter(q => q.provider !== 'oneInchFusion') // disable fusion swaps for now
  }

  const getSwap = async (
    providerQuote: ProviderQuoteResponse,
  ): Promise<ProviderSwapResponse | null> => {
    if (!swapInstance) {
      return null
    }

    try {
      const response = await swapInstance.getSwap(providerQuote.quote)
      return response
    } catch (err) {
      reportModuleError({
        tag: SENTRY_MODULE_TAGS.SWAP,
        title: 'SWAP: getSwap failed',
        error: err,
      })
      toastStore.addToastMessage({
        type: ToastType.Error,
        text: t('common.something_went_wrong'),
        textSecondary: t('swap.error.getting-swap'),
      })
      return null
    }
  }

  // Concurrent callers share one initialization. Network changes reset
  // swapLoaded in the store watcher below before requesting a fresh instance.
  const initSwapper = async (): Promise<void> => {
    if (swapLoaded.value) return
    if (inflightInit) return inflightInit

    const initPromise = doInitSwapper()
    inflightInit = initPromise
    try {
      await initPromise
    } finally {
      if (inflightInit === initPromise) inflightInit = null
    }
  }

  watch(
    () => selectedChain.value?.name,
    async chainName => {
      if (!chainName) return
      if (inflightInit) await inflightInit
      swapLoaded.value = false
      await initSwapper()
    },
    { immediate: true },
  )

  watch(
    () => [tokens.value, balanceWei.value] as const,
    () => applyTokenBalances(),
  )

  watch(isTradingRestrictedInRegion, () => {
    applyTokenBalances()
    applyTradingRestrictionToToTokens()
  })

  return {
    initSwapper,
    supportedNetwork,
    toTokens,
    fromTokens,
    toChains,
    swapLoaded,
    getQuote,
    getSwap,
    rawFromTokens,
    rawToTokens,
    restrictedAddressesLower,
  }
})
