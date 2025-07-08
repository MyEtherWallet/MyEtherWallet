<template>
  <div class="relative max-w-[478px] mx-auto">
    <app-swap-input />
    <div
      class="bg-white border border-solid border-grey-10 rounded-[12px] h-[40px] w-[40px] mx-auto flex justify-center items-center absolute shadow-lg right-[45%]"
      :class="{
        'top-[45%]': !isWalletConnected,
        'top-[41%]': isWalletConnected,
      }"
    >
      <arrows-up-down-icon class="w-6 h-6" />
    </div>
    <div class="pt-2"></div>
    <app-swap-input label="To" />
    <div class="pt-4"></div>
    <app-base-button
      class="w-full"
      v-if="isWalletConnected"
      @click="swapButton"
    >
      Swap</app-base-button
    >
  </div>
  <best-offer-modal v-model:best-offer-open="bestSwapLoadingOpen" />
  <swap-offer-modal
    v-model:swap-offer-open="bestOfferSelectionOpen"
    @update:proceedWithSwap="swapInitiatedOpen = true"
  />
  <swap-initiated-modal v-model:swap-initiated-open="swapInitiatedOpen" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppSwapInput from '@/components/AppSwapInput.vue'
import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid' // Importing the arrowsUpDown icon from Heroicons
import AppBaseButton from '@/components/AppBaseButton.vue'
import BestOfferModal from './components/BestOfferModal.vue'
import SwapOfferModal from './components/SwapOfferModal.vue'
import SwapInitiatedModal from './components/SwapInitiatedModal.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { supportedSwapEnums } from '@/providers/ethereum/chainToEnum'
import Swapper, { WalletIdentifier } from '@enkryptcom/swap'
import { SupportedNetworkName } from '@enkryptcom/swap'
import { NetworkNames } from '@enkryptcom/types'
import Web3Eth from 'web3-eth'

const walletStore = useWalletStore()
const chainsStore = useChainsStore()
const globalStore = useGlobalStore()
const { isWalletConnected } = storeToRefs(walletStore)
const { selectedChain } = storeToRefs(chainsStore)
const { selectedNetwork } = storeToRefs(globalStore)
const swapInstance = ref<Swapper | null>(null)

onMounted(async () => {
  try {
    const rpc = selectedChain.value?.rpcUrls[0] || ''
    swapperInstance.value = new Swapper({
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
    await swapperInstance.value.initPromise
    console.log(swapperInstance.value.getFromTokens())
  } catch (error) {
    console.log(error)
  }
})

const bestSwapLoadingOpen = ref(false)
const bestOfferSelectionOpen = ref(false)
const swapInitiatedOpen = ref(false)

const swapButton = () => {
  // bestSwapLoadingOpen.value = true
  // bestOfferSelectionOpen.value = true
  swapInitiatedOpen.value = true
}
</script>
