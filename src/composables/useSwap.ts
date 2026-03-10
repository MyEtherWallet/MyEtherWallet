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
  isTradingRestricted,
  getRestrictedTokenAddresses,
} from '@/modules/trade/providers/ondoHelpers'

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
}

const NetworkNotSupportedError = new Error(
  'Selected network is not supported for swap',
)

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
  const { selectedNetwork } = storeToRefs(globalStore)
  const { tokens, balanceWei, isWalletConnected } = storeToRefs(walletStore)
  const supportedNetwork = ref<boolean>(true)
  const toChains = ref<Chain[]>([])
  const toTokens = ref<ToTokenType | null>(null)
  const fromTokens = ref<NewTokenInfo[] | null>(null)
  const swapLoaded = ref<boolean>(false)

  // Initialize the Swapper instance
  // parses tokens and to networks available for swapping
  const initSwapper = async () => {
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
      let swapToTokens = swapInstance.value.getToTokens()

      // Check if trading is restricted and filter out restricted token addresses
      const [isRestricted, restrictedAddresses] = await Promise.all([
        isTradingRestricted(),
        getRestrictedTokenAddresses(),
      ])

      const restrictedAddressesLower = restrictedAddresses.map(addr =>
        addr.toLowerCase(),
      )

      // Filter toTokens if trading is restricted
      if (isRestricted && restrictedAddressesLower.length > 0) {
        const filterTokenArray = (tokens: TokenTypeTo[]) =>
          tokens.filter(
            token =>
              !restrictedAddressesLower.includes(token.address.toLowerCase()),
          )

        swapToTokens = {
          top: Object.fromEntries(
            Object.entries(swapToTokens.top).map(([network, tokens]) => [
              network,
              filterTokenArray(tokens as TokenTypeTo[]),
            ]),
          ) as typeof swapToTokens.top,
          trending: Object.fromEntries(
            Object.entries(swapToTokens.trending).map(([network, tokens]) => [
              network,
              filterTokenArray(tokens as TokenTypeTo[]),
            ]),
          ) as typeof swapToTokens.trending,
          all: Object.fromEntries(
            Object.entries(swapToTokens.all).map(([network, tokens]) => [
              network,
              filterTokenArray(tokens as TokenTypeTo[]),
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
      const allFromTokensWithBalance = allFromTokens.all.map(token => {
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

      // Filter out restricted addresses from fromTokens if trading is restricted
      let finalFromTokens = isWalletConnected.value
        ? fromAllTokensToWalletTokens
        : allFromTokensWithBalance

      if (isRestricted && restrictedAddressesLower.length > 0) {
        finalFromTokens = finalFromTokens.filter(
          token =>
            !restrictedAddressesLower.includes(token.address.toLowerCase()),
        )
      }

      fromTokens.value = finalFromTokens
      swapLoaded.value = true
      return Promise.resolve()
    } catch (e) {
      if (
        e instanceof Error &&
        e.message === NetworkNotSupportedError.message
      ) {
        supportedNetwork.value = false
        swapLoaded.value = true
      } else {
        toastStore.addToastMessage({
          type: ToastType.Error,
          text: 'Something went wrong',
          textSecondary: t('swap.error.initializing-swap-failed'),
        })
        // TODO: add sentry to catch actual error
      }
    }
  }

  const getQuote = async (
    params: QuoteParam,
  ): Promise<ProviderQuoteResponse[] | undefined> => {
    if (!swapInstance.value) {
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
    } catch {
      // TODO: add sentry to catch actual error
      toastStore.addToastMessage({
        type: ToastType.Error,
        text: 'Something went wrong',
        textSecondary: t('swap.error.getting-swap'),
      })
      return null
    }
  }

  watch(
    () => [selectedChain.value?.name, tokens.value],
    async newChainName => {
      if (newChainName) {
        await initSwapper()
      }
    },
    { immediate: true },
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
