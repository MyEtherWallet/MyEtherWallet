import { storeToRefs } from 'pinia';
import { ref, type Ref, watch } from 'vue'

import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { supportedSwapEnums } from '@/providers/ethereum/chainToEnum'
import Swapper, { WalletIdentifier } from '@enkryptcom/swap'
import { SupportedNetworkName } from '@enkryptcom/swap'
import Web3Eth from 'web3-eth'

export const useSwap = () => {
  const chainsStore = useChainsStore()
  const globalStore = useGlobalStore()
  const swapInstance: Ref<Swapper | null> = ref(null);
  const { selectedChain } = storeToRefs(chainsStore)
  const { selectedNetwork } = storeToRefs(globalStore)
  const supportedNetwork = ref<boolean>(false)

  const initSwapper = async () => {
    try {
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
      const fromTokens = swapInstance.value.getFromTokens()
      supportedNetwork.value = fromTokens.all.length > 0
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
    supportedNetwork
  }
}