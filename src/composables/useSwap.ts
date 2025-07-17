import { storeToRefs } from 'pinia';
import { ref, type Ref, watch } from 'vue'

import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'
import { supportedSwapEnums, enumToChain } from '@/providers/ethereum/chainToEnum'
import Swapper, { WalletIdentifier } from '@enkryptcom/swap'
import type { TokenType, TokenTypeTo, SupportedNetworkName, ProviderQuoteResponse } from '@enkryptcom/swap'
import Web3Eth from 'web3-eth'
import type { Chain } from '@/mew_api/types'
import BN from 'bn.js'
import { toBase } from '@/utils/unit'

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
} => {
  const chainsStore = useChainsStore()
  const globalStore = useGlobalStore()
  const walletStore = useWalletStore()
  const swapInstance: Ref<Swapper | null> = ref(null);
  const { selectedChain, chains } = storeToRefs(chainsStore)
  const { selectedNetwork } = storeToRefs(globalStore)
  const { tokens, balance } = storeToRefs(walletStore)
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
      // tokens.value length being 0 most likely means the user has not connected their wallet yet
      fromTokens.value = tokens.value.length > 0 ? allFromTokens.all.map((token) => {
        // make sure native evm token is included
        if (token.address.toLowerCase() === MAIN_TOKEN_CONTRACT) return {
          ...token,
          balance: balance.value
        }

        const tokenBalance = tokens.value.find(
          (t) => t.contract.toLowerCase() === token.address.toLowerCase()
        )

        if (tokenBalance) return {
          ...token,
          balance: tokenBalance ? tokenBalance.balance : '0',
        } as NewTokenInfo
      }).filter((token => token !== undefined)) as NewTokenInfo[] : allFromTokens.all.map((token) => {
        return {
          ...token,
          balance: '0',
        } as NewTokenInfo
      })
      swapLoaded.value = true
      return Promise.resolve()
    } catch (error) {
      console.log(error)
    }
  }

  const getQuote = async (params: QuoteParam): Promise<ProviderQuoteResponse[] | undefined> => {
    if (!swapInstance.value) {
      return undefined;
    }

    const rawAmount = toBase(params.amount, params.fromToken.decimals || 18,) // Default to 18 decimals if not specified);
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

  watch(
    () => selectedChain.value?.name,
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
    getQuote
  }
}