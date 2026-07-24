import { storeToRefs } from 'pinia'
import { ref, type Ref, watch } from 'vue'

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
import { useI18n } from 'vue-i18n'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import {
  getRestrictedTokenAddresses,
} from '@/modules/trade/providers/ondoHelpers'
import * as Sentry from '@sentry/vue'
import { isTransientSwapInitError } from '@/composables/swapInitError'

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

const NetworkNotSupportedError = new Error(
  'Selected network is not supported for swap',
)

// The swap SDK fetches token lists from a remote (GitHub raw) that can return
// transient errors; retry a couple of times before surfacing to the user.
const SWAP_INIT_RETRIES = 2
const SWAP_INIT_RETRY_DELAY_MS = 800

export const useSwap = (): {
  initSwapper: () => Promise<void>
  supportedNetwork: Ref<boolean>
  toTokens: Ref<ToTokenType | null>
  fromTokens: Ref<NewTokenInfo[] | null>
  toChains: Ref<Chain[]>
  swapLoaded: Ref<boolean>
  getQuote: (params: QuoteParam) => Promise<ProviderQuoteResponse[] | undefined>
  getSwap: (
    quote: ProviderQuoteResponse,
  ) => Promise<ProviderSwapResponse | null>
} => {
  const toastStore = useToastStore()
  const { t } = useI18n()
  const chainsStore = useChainsStore()
  const globalStore = useGlobalStore()
  const walletStore = useWalletStore()
  const swapInstance: Ref<Swapper | null> = ref(null)
  const { selectedChain, allChains, swapChains } = storeToRefs(chainsStore)
  const { selectedNetwork, isTradingRestrictedInRegion } = storeToRefs(globalStore)
  const { tokens, balanceWei, isWalletConnected } = storeToRefs(walletStore)
  const supportedNetwork = ref<boolean>(true)
  const toChains = ref<Chain[]>([])
  const toTokens = ref<ToTokenType | null>(null)
  const fromTokens = ref<NewTokenInfo[] | null>(null)
  const swapLoaded = ref<boolean>(false)
  // Cached raw data used to update balances without re-fetching swaplists
  const rawFromTokens = ref<TokenType[]>([])
  const restrictedAddressesLower = ref<string[]>([])
  // Per-instance guard: deduplicates concurrent initSwapper calls
  let inflightInit: Promise<void> | null = null
  let inflightInitChain: string | null = null

  // Updates fromTokens with current wallet balances without re-fetching swaplists.
  // Called after init and when wallet tokens/native balance change reactively.
  const applyTokenBalances = () => {
    if (!swapInstance.value || !swapLoaded.value || !rawFromTokens.value.length) return

    const allFromTokensWithBalance = rawFromTokens.value.map(token => {
      let tokenBalance = '0'
      let tokenPrice = token.price
      if (tokens.value.length > 0 || balanceWei.value !== '0') {
        if (token.address.toLowerCase() === MAIN_TOKEN_CONTRACT) {
          tokenBalance = balanceWei.value
          tokenPrice = tokenPrice || selectedChain.value?.price || 0
        } else {
          const found = tokens.value.find(
            t => t.contract.toLowerCase() === token.address.toLowerCase(),
          )
          if (found) {
            tokenBalance = found.balanceWei
            tokenPrice = tokenPrice || (found as any).price || 0
          }
        }
      }
      return Object.freeze({
        ...token,
        balance: tokenBalance,
        price: tokenPrice,
      }) as NewTokenInfo
    })

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

  // Initialize the Swapper instance
  // parses tokens and to networks available for swapping
  const doInitSwapper = async (retriesLeft = SWAP_INIT_RETRIES) => {
    try {
      swapLoaded.value = false
      const rpc = selectedChain.value?.rpcUrls?.[0] || ''
      const activeNetworkName =
        selectedChain.value?.name || selectedNetwork.value
      const activeNetworkEnum = supportedSwapEnums[
        activeNetworkName
      ] as SupportedNetworkName
      const isSupported = isSupportedNetwork(activeNetworkEnum)
      if (!activeNetworkEnum || !isSupported) {
        supportedNetwork.value = false
        throw NetworkNotSupportedError
      }

      swapInstance.value = new Swapper({
        network: activeNetworkEnum,
        api: new Web3Eth(rpc) as any,
        walletIdentifier: WalletIdentifier.mew,
        evmOptions: {
          infiniteApproval: true,
        },
      })
      await swapInstance.value.initPromise
      const allFromTokens = swapInstance.value.getFromTokens()
      supportedNetwork.value = allFromTokens.all.length > 0
      rawFromTokens.value = allFromTokens.all
      let swapToTokens = swapInstance.value.getToTokens()

      // Check if trading is restricted and filter out restricted token addresses
      const fetchedRestrictedAddresses = await getRestrictedTokenAddresses()
      restrictedAddressesLower.value = fetchedRestrictedAddresses.map(addr =>
        addr.toLowerCase(),
      )

      // Filter toTokens if trading is restricted
      if (isTradingRestrictedInRegion.value && restrictedAddressesLower.value.length > 0) {
        const filterTokenArray = (tkns: TokenTypeTo[]) =>
          tkns.filter(
            token =>
              !restrictedAddressesLower.value.includes(token.address.toLowerCase()),
          )

        swapToTokens = {
          top: Object.fromEntries(
            Object.entries(swapToTokens.top).map(([network, tkns]) => [
              network,
              filterTokenArray(tkns as TokenTypeTo[]),
            ]),
          ) as typeof swapToTokens.top,
          trending: Object.fromEntries(
            Object.entries(swapToTokens.trending).map(([network, tkns]) => [
              network,
              filterTokenArray(tkns as TokenTypeTo[]),
            ]),
          ) as typeof swapToTokens.trending,
          all: Object.fromEntries(
            Object.entries(swapToTokens.all).map(([network, tkns]) => [
              network,
              filterTokenArray(tkns as TokenTypeTo[]),
            ]),
          ) as typeof swapToTokens.all,
        }
      }

      toTokens.value = swapToTokens

      const toTokensNetworks = Object.keys(toTokens.value.all)
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
        text: 'Something went wrong',
        textSecondary: t('swap.error.initializing-swap-failed'),
      })
      // Expected external flakiness (transient fetch / JSON parse of a non-JSON
      // upstream body) is surfaced via the toast above but is pure Sentry noise
      // — only report genuinely unexpected init failures.
      if (!isTransientSwapInitError(e)) {
        Sentry.withScope(function (scope) {
          scope.setTag('swap', 'initSwapper failed')
          Sentry.captureException(e)
        })
      }
    }
  }

  const getQuote = async (
    params: QuoteParam,
  ): Promise<ProviderQuoteResponse[] | undefined> => {
    if (!swapInstance.value || !swapLoaded.value) {
      return undefined
    }

    const rawAmount = parseUnits(
      params.amount.toString(),
      params.fromToken.decimals ?? 18,
    ).toString() // Default to 18 decimals if not specified);
    const quotes = await swapInstance.value.getQuotes({
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
    if (!swapInstance.value) {
      return null
    }

    try {
      const response = await swapInstance.value.getSwap(providerQuote.quote)
      return response
    } catch (err) {
      Sentry.withScope(function (scope) {
        scope.setTag('swap', 'getSwap failed')
        // will be tagged with my-tag="my value"
        Sentry.captureException(err)
      })
      toastStore.addToastMessage({
        type: ToastType.Error,
        text: 'Something went wrong',
        textSecondary: t('swap.error.getting-swap'),
      })
      return null
    }
  }

  // Deduplicates concurrent calls — if initialization is already in progress
  // for the same chain, returns the same promise rather than starting a second
  // fetch of swaplists. When the requested chain differs, a fresh init starts so
  // a network change is never served the previous chain's in-flight promise.
  const initSwapper = async (): Promise<void> => {
    const targetChain = selectedChain.value?.name ?? null
    if (inflightInit && inflightInitChain === targetChain) return inflightInit
    inflightInitChain = targetChain
    const p = doInitSwapper() as Promise<void>
    inflightInit = p
    p.finally(() => {
      // Only clear if this run is still the current in-flight one; a newer
      // init (e.g. for a different chain) must survive a stale completion.
      if (inflightInit === p) {
        inflightInit = null
        inflightInitChain = null
      }
    })
    return p
  }

  // Re-initialize swapper only when the network changes, not on every token/balance update.
  watch(
    () => selectedChain.value?.name,
    async chainName => {
      if (chainName) {
        await initSwapper()
      }
    },
    { immediate: true },
  )

  // Update fromTokens balances reactively when wallet tokens or native balance change,
  // without re-fetching swaplists from the network.
  watch(
    () => [tokens.value, balanceWei.value] as const,
    () => applyTokenBalances(),
  )

  return {
    initSwapper,
    supportedNetwork,
    toTokens,
    fromTokens,
    toChains,
    swapLoaded,
    getQuote,
    getSwap,
  }
}
