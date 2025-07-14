import { storeToRefs } from 'pinia';
import { ref, type Ref, watch } from 'vue'

import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useWalletStore } from '@/stores/walletStore'
import { supportedSwapEnums, enumToChain } from '@/providers/ethereum/chainToEnum'
import Swapper, { WalletIdentifier } from '@enkryptcom/swap'
import type { TokenType, TokenTypeTo, SupportedNetworkName } from '@enkryptcom/swap'
import Web3Eth from 'web3-eth'
import type { Chain } from '@/mew_api/types'

// TODO: Import types from @enkryptcom/swap

export interface NewTokenInfo extends Omit<TokenType, 'balance'> {
  balance?: string;
}

export interface ToTokenType {
  top: Record<SupportedNetworkName, TokenTypeTo[]> | Record<string, never>;
  trending: Record<SupportedNetworkName, TokenTypeTo[]> | Record<string, never>;
  all: Record<SupportedNetworkName, TokenTypeTo[]> | Record<string, never>;
}

export const useSwap = (): {
  initSwapper: () => Promise<void>;
  supportedNetwork: Ref<boolean>;
  toTokens: Ref<ToTokenType | null>;
  fromTokens: Ref<NewTokenInfo[] | null>;
  toChains: Ref<Chain[]>;
  swapLoaded: Ref<boolean>;
} => {
  const chainsStore = useChainsStore()
  const globalStore = useGlobalStore()
  const walletStore = useWalletStore()
  const swapInstance: Ref<Swapper | null> = ref(null);
  const { selectedChain, chains } = storeToRefs(chainsStore)
  const { selectedNetwork } = storeToRefs(globalStore)
  const { tokens } = storeToRefs(walletStore)
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
    } catch (error) {
      console.log(error)
    }
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
    swapLoaded
  }
}