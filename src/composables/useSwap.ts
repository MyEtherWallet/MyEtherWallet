import { storeToRefs } from 'pinia';
import { ref, type Ref, watch } from 'vue'

import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'
import { supportedSwapEnums, enumToChain } from '@/providers/ethereum/chainToEnum'
import Swapper, { WalletIdentifier } from '@enkryptcom/swap'
import type { TokenType, TokenTypeTo, SupportedNetworkName, ProviderQuoteResponse, ProviderSwapResponse } from '@enkryptcom/swap'
import Web3Eth from 'web3-eth'
import type { Chain } from '@/mew_api/types'
import BN from 'bn.js'
import { toBase } from '@/utils/unit'
import { useI18n } from 'vue-i18n';
import { useToastStore } from '@/stores/toastStore';
import { ToastType } from '@/types/notification';

// TODO: Import types from @enkryptcom/swap

// Done to temporarily override balance type with string instead of BN
export interface NewTokenInfo extends Omit<TokenTypeTo, 'balance'> {
  balance?: string;
}


export interface ToTokenType {
  top: Record<SupportedNetworkName, TokenTypeTo[]> | Record<string, never>;
  trending: Record<SupportedNetworkName, TokenTypeTo[]> | Record<string, never>;
  all: Record<SupportedNetworkName, TokenTypeTo[]> | Record<string, never>;
}

export interface QuoteParam {
  fromAddress: string;
  toAddress: string;
  amount: string | number;
  fromToken: NewTokenInfo;
  toToken: NewTokenInfo;
}


export const useSwap = (): {
  initSwapper: () => Promise<void>;
  supportedNetwork: Ref<boolean>;
  toTokens: Ref<ToTokenType | null>;
  fromTokens: Ref<NewTokenInfo[] | null>;
  toChains: Ref<Chain[]>;
  swapLoaded: Ref<boolean>;
  getQuote: (params: QuoteParam) => Promise<ProviderQuoteResponse[] | undefined>;
  getSwap: (quote: ProviderQuoteResponse) => Promise<ProviderSwapResponse | null>;
} => {
  const toastStore = useToastStore()
  const { t } = useI18n();
  const chainsStore = useChainsStore()
  const globalStore = useGlobalStore()
  const walletStore = useWalletStore()
  const swapInstance: Ref<Swapper | null> = ref(null);
  const { selectedChain, chains } = storeToRefs(chainsStore)
  const { selectedNetwork } = storeToRefs(globalStore)
  const { tokens, balance, isWalletConnected } = storeToRefs(walletStore)
  const supportedNetwork = ref<boolean>(false)
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
      swapInstance.value = new Swapper({
        network: supportedSwapEnums[
          (selectedChain.value?.name as string) ||
          (selectedNetwork.value as string)
        ] as SupportedNetworkName,
        api: new Web3Eth(rpc),
        walletIdentifier: WalletIdentifier.mew,
        evmOptions: {
          infiniteApproval: true,
        },
      })
      await swapInstance.value.initPromise
      const allFromTokens = swapInstance.value.getFromTokens()
      supportedNetwork.value = allFromTokens.all.length > 0
      toTokens.value = swapInstance.value.getToTokens()

      const toTokensNetworks = Object.keys(toTokens.value.all)
      toChains.value = toTokensNetworks
        .map((networkName) => {
          const chainName = enumToChain[networkName as SupportedNetworkName]
          const chain = chains.value.find((chain => chain.name === chainName))
          if (chain) return chain
        })
        .filter((chain): chain is Chain => chain !== undefined)
      const allFromTokensWithBalance = allFromTokens.all.map((token) => {
        let tokenBalance = '0'
        if (tokens.value.length > 0) {
          if (token.address.toLowerCase() === MAIN_TOKEN_CONTRACT) {
            tokenBalance = balance.value
          } else {
            const found = tokens.value.find(
              (t) => t.contract.toLowerCase() === token.address.toLowerCase()
            )
            tokenBalance = found?.balance || '0'
          }
        }

        return Object.freeze({
          ...token,
          balance: tokenBalance,
        }) as NewTokenInfo
      })

      const fromAllTokensToWalletTokens = allFromTokensWithBalance.filter((token) => {

        if (tokens.value.find((t) => t.contract.toLowerCase() === token.address.toLowerCase())) {
          return true;
        }
        if (token.address.toLowerCase() === MAIN_TOKEN_CONTRACT) { return true; }
        return false;
      })

      fromTokens.value = isWalletConnected.value ? fromAllTokensToWalletTokens : allFromTokensWithBalance
      swapLoaded.value = true
      return Promise.resolve()
    } catch {
      // TODO: add sentry to catch actual error
      toastStore.addToastMessage({
        type: ToastType.Error,
        text: t('swap.error.initializing-swap-failed'),
      })
    }
  }

  const getQuote = async (params: QuoteParam): Promise<ProviderQuoteResponse[] | undefined> => {
    if (!swapInstance.value) {
      return undefined;
    }

    const rawAmount = toBase(params.amount, params.fromToken.decimals ?? 18,) // Default to 18 decimals if not specified);
    return swapInstance.value.getQuotes(
      {
        fromAddress: params.fromAddress,
        toAddress: params.toAddress,
        amount: new BN(rawAmount),
        fromToken: params.fromToken as TokenType,
        toToken: params.toToken as TokenTypeTo
      }
    );
  }

  const getSwap = async (providerQuote: ProviderQuoteResponse): Promise<ProviderSwapResponse | null> => {
    if (!swapInstance.value) {
      return null;
    }

    try {
      const response = await swapInstance.value.getSwap(providerQuote.quote);
      return response;
    } catch {
      // TODO: add sentry to catch actual error
      toastStore.addToastMessage({
        type: ToastType.Error,
        text: t('swap.error.getting-swap'),
      });
      return null;
    }
  }

  watch(
    () => [selectedChain.value?.name, tokens.value],
    async (newChainName) => {
      if (newChainName) {
        await initSwapper()
      }
    },
    { immediate: true }
  )

  return {
    initSwapper,
    supportedNetwork,
    toTokens,
    fromTokens,
    toChains,
    swapLoaded,
    getQuote,
    getSwap
  }
}