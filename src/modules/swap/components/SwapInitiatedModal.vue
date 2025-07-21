<template>
  <app-dialog
    v-model:is-open="model"
    class="sm:max-w-[400px] sm:mx-auto"
    persistent
  >
    <template #content>
      <div class="p-4 flex flex-col items-center pt-8 mb-8">
        <div
          class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
        >
          <img :src="swapInitiatedIcon" alt="Swap Initiated Icon" />
        </div>
        <h3 class="text-s-24 font-bold mb-2 text-p-120">Swap Initiated</h3>
        <p class="text-center text-s-14 text-grey-50">
          Once completed, {{ toTokenSymbol }} will be deposited to the <br />
          address you specified.
        </p>
      </div>
      <div class="flex-col justify-start px-8">
        <div class="flex gap-2 items-center">
          <div class="relative">
            <div
              class="w-[36px] h-[36px] p-1 bg-grey-8 rounded-[50%] inline-flex items-center justify-center"
            >
              <img
                :src="fromTokenIcon"
                alt="From Token Icon"
                class="inline-block w-full"
              />
            </div>
            <div
              class="w-[16px] h-[16px] p-1 bg-grey-8 rounded-[50%] inline-flex items-center justify-center absolute bottom-2 right-1 translate-x-1/2 translate-y-1/2"
            >
              <img
                :src="fromTokenChainImg"
                alt="From Token Chain"
                class="inline-block w-full"
              />
            </div>
          </div>
          <div class="text-s-20 font-bold leading-[15px]">
            {{ fromTokenAmount }} {{ fromTokenSymbol }} <br />
            <span class="text-s-14 font-normal text-grey-70"
              >on {{ fromTokenChain }}</span
            >
          </div>
        </div>
        <div>
          <arrow-down-icon class="w-5 h-5 m-2" />
        </div>
        <div class="flex gap-2 items-center">
          <div class="relative">
            <div
              class="w-[36px] h-[36px] p-1 bg-grey-8 rounded-[50%] inline-flex items-center justify-center"
            >
              <img
                :src="toTokenIcon"
                alt="Token Symbol"
                class="inline-block w-full"
              />
            </div>
            <div
              class="w-[16px] h-[16px] p-1 bg-grey-8 rounded-[50%] inline-flex items-center justify-center absolute bottom-2 right-1 translate-x-1/2 translate-y-1/2"
            >
              <img
                :src="toTokenChainImg"
                alt="To Token Network"
                class="inline-block w-full"
              />
            </div>
          </div>
          <div class="text-s-20 font-bold leading-[15px]">
            {{ toTokenAmount }} {{ toTokenSymbol }} <br />
            <span class="text-s-14 font-normal text-grey-70"
              >on {{ toTokenChain }}</span
            >
          </div>
        </div>
      </div>
      <div class="px-8 flex mt-10 gap-2">
        <app-base-button class="w-full" @click="openProgress">
          View Progress
        </app-base-button>
        <app-base-button class="w-full" @click="close"> Close </app-base-button>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import swapInitiatedIcon from '@/assets/icons/swap-initiated-icon.svg'
import ethSvg from '@/assets/icons/tokens/eth.svg' // Placeholder for token icon
import AppBaseButton from '@/components/AppBaseButton.vue'
import { ArrowDownIcon } from '@heroicons/vue/24/solid'
import { type Chain } from '@/mew_api/types'
import { type ProviderQuoteResponse } from '@enkryptcom/swap'
import { type HexPrefixedString } from '@/providers/types'
import { fromBase } from '@/utils/unit'

const props = defineProps<{
  fromChain: Chain
  toChain: Chain
  selectedQuote: ProviderQuoteResponse
  txHash: HexPrefixedString
}>()

const model = defineModel<boolean>('swapInitiatedOpen', {
  default: false,
  required: true,
})

const close = () => {
  model.value = false
}

const toTokenSymbol = computed(() => {
  return props.selectedQuote.quote.options.toToken.symbol || 'Unknown Token'
})

const toTokenAmount = computed(() => {
  return fromBase(
    props.selectedQuote.toTokenAmount.toString() || '0',
    props.selectedQuote.quote.options.toToken.decimals,
  )
})

const toTokenIcon = computed(() => {
  return props.selectedQuote.quote.options.toToken.logoURI || ethSvg // Fallback to ETH icon if no token icon is available
})

const toTokenChain = computed(() => {
  return props.toChain.name || 'Unknown Chain'
})

const toTokenChainImg = computed(() => {
  return props.toChain.icon || ethSvg // Fallback to ETH icon if no chain icon is available
})

const fromTokenSymbol = computed(() => {
  return props.selectedQuote.quote.options.fromToken.symbol || 'Unknown Token'
})
const fromTokenAmount = computed(() => {
  return fromBase(
    props.selectedQuote.fromTokenAmount.toString() || '0',
    props.selectedQuote.quote.options.fromToken.decimals,
  )
})
const fromTokenChain = computed(() => {
  return props.fromChain.name || 'Unknown Chain'
})
const fromTokenIcon = computed(() => {
  return props.selectedQuote.quote.options.fromToken.logoURI || ethSvg // Fallback to ETH icon if no token icon is available
})

const fromTokenChainImg = computed(() => {
  return props.fromChain.icon || ethSvg // Fallback to ETH icon if no chain icon is available
})

const openProgress = () => {
  // Logic to view progress can be added here
  window.open(
    `${props.toChain.blockExplorerTX.replace('[[txHash]]', props.txHash)}`,
    '_blank',
  )
  close()
}
</script>
