<template>
  <app-dialog v-model:is-open="model" class="sm:max-w-[420px] sm:mx-auto">
    <template #content>
      <div class="px-6 pb-8 pt-4">
        <div class="flex flex-col items-center pt-8 mb-10 text-center">
          <div
            class="w-16 h-16 bg-[#e6f6f4] rounded-full flex items-center justify-center mb-6"
          >
            <img
              :src="swapInitiatedIcon"
              alt="Swap Initiated Icon"
              class="w-8 h-8"
            />
          </div>
          <h3 class="text-s-24 font-bold mb-3 text-p-120">
            {{ t('swap.initiated.swap-initiated') }}
          </h3>
          <p class="text-s-16 text-grey-50 px-4 leading-relaxed">
            {{ t('swap.initiated.completed-note', { symbol: toTokenSymbol }) }}
          </p>
        </div>

        <div class="flex flex-col gap-0 px-4">
          <!-- From Row -->
          <div class="flex items-center gap-4">
            <div class="relative">
              <app-token-logo
                :url="fromTokenIcon"
                :symbol="fromTokenSymbol"
                width="w-12"
                height="h-12"
              />
              <div
                class="w-5 h-5 p-0.5 bg-white border border-grey-10 rounded-full flex items-center justify-center absolute -bottom-1 -right-1 overflow-hidden"
              >
                <img
                  :src="fromTokenChainImg"
                  alt=""
                  class="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <div class="text-s-20 font-bold leading-tight">
                {{ fromTokenAmount }} {{ fromTokenSymbol }}
              </div>
              <div class="text-s-12 font-medium text-grey-50 uppercase">
                {{ t('swap.on') }} {{ fromTokenChain }}
              </div>
            </div>
          </div>

          <!-- Divider Arrow -->
          <div class="flex justify-start ml-[22px] my-1">
            <arrow-down-icon class="w-4 h-4 text-grey-40" />
          </div>

          <!-- To Row -->
          <div class="flex items-center gap-4">
            <div class="relative">
              <app-token-logo
                :url="toTokenIcon"
                :symbol="toTokenSymbol"
                width="w-12"
                height="h-12"
              />
              <div
                class="w-5 h-5 p-0.5 bg-white border border-grey-10 rounded-full flex items-center justify-center absolute -bottom-1 -right-1 overflow-hidden"
              >
                <img
                  :src="toTokenChainImg"
                  alt=""
                  class="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <div class="text-s-20 font-bold leading-tight">
                {{ toTokenAmount }} {{ toTokenSymbol }}
              </div>
              <div class="text-s-12 font-medium text-grey-50 uppercase">
                {{ t('swap.on') }} {{ toTokenChain }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row mt-10 gap-3">
          <app-base-button
            class="flex-1 order-2 sm:order-1"
            @click="openProgress"
          >
            {{ t('swap.initiated.view-progress') }}
          </app-base-button>
          <app-base-button
            class="flex-1 order-1 sm:order-2"
            :is-outline="true"
            @click="close"
          >
            {{ t('common.close') }}
          </app-base-button>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import swapInitiatedIcon from '@/assets/icons/swap-initiated-icon.svg'
import ethSvg from '@/assets/icons/tokens/eth.svg'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { ArrowDownIcon } from '@heroicons/vue/24/solid'
import { type Chain } from '@/mew_api/types'
import { type ProviderQuoteResponse } from '@enkryptcom/swap'
import { type HexPrefixedString } from '@/providers/types'
import { formatUnits } from 'viem'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  fromChain: Chain | undefined
  toChain: Chain | undefined
  selectedQuote: ProviderQuoteResponse | undefined
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
  return props.selectedQuote?.quote.options.toToken.symbol || 'Unknown Token'
})

const toTokenAmount = computed(() => {
  return formatUnits(
    BigInt(props.selectedQuote?.toTokenAmount.toString() || '0'),
    props.selectedQuote?.quote.options.toToken.decimals ?? 18,
  )
})

const toTokenIcon = computed(() => {
  return props.selectedQuote?.quote.options.toToken.logoURI || ethSvg // Fallback to ETH icon if no token icon is available
})

const toTokenChain = computed(() => {
  return props.toChain?.name || 'Unknown Chain'
})

const toTokenChainImg = computed(() => {
  return props.toChain?.icon || ethSvg // Fallback to ETH icon if no chain icon is available
})

const fromTokenSymbol = computed(() => {
  return props.selectedQuote?.quote.options.fromToken.symbol || 'Unknown Token'
})
const fromTokenAmount = computed(() => {
  return formatUnits(
    BigInt(props.selectedQuote?.fromTokenAmount.toString() || '0'),
    props.selectedQuote?.quote.options.fromToken.decimals ?? 18,
  )
})
const fromTokenChain = computed(() => {
  return props.fromChain?.name || 'Unknown Chain'
})
const fromTokenIcon = computed(() => {
  return props.selectedQuote?.quote.options.fromToken.logoURI || ethSvg // Fallback to ETH icon if no token icon is available
})

const fromTokenChainImg = computed(() => {
  return props.fromChain?.icon || ethSvg // Fallback to ETH icon if no chain icon is available
})

const openProgress = () => {
  // Logic to view progress can be added here
  window.open(
    `${props.fromChain?.blockExplorerTX.replace('[[txHash]]', props.txHash)}`,
    '_blank',
  )
  close()
}
</script>
