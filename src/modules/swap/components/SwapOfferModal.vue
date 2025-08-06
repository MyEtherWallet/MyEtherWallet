<template>
  <app-dialog
    v-model:is-open="model"
    title="Swap"
    class="sm:max-w-[460px] sm:mx-auto h-[600px]"
  >
    <template #content>
      <div class="mx-4 mb-2">
        <div
          class="p-4 flex flex-col border border-solid border-grey-outline rounded-lg mb-2"
        >
          <h3 class="font-bold text-s-20">
            Best offer from {{ providerName }}
          </h3>
          <div class="font-normal text-s-20 my-2 mb-2 flex items-center gap-2">
            for
            <div
              class="w-[32px] h-[32px] p-1 bg-grey-8 rounded-[50%] inline-flex items-center justify-center overflow-hidden"
            >
              <img
                :src="fromToken?.logoURI"
                :alt="fromToken?.symbol"
                class="inline-block w-full h-[100%]"
              />
            </div>
            <span class="font-bold">
              {{ amount }}
              {{ fromToken?.symbol }}</span
            >
            you will get:
          </div>
          <div class="flex bg-grey-light-2 rounded-lg p-4 mb-2">
            <div class="relative">
              <div
                class="w-[64px] h-[64px] p-1 bg-grey-8 rounded-[50%] inline-flex items-center justify-center overflow-hidden"
              >
                <img
                  :src="toToken?.logoURI"
                  alt="ETH"
                  class="inline-block w-[90px] max-w-[200px]"
                />
              </div>
              <div
                class="w-[32px] h-[32px] p-1 bg-grey-8 rounded-[50%] inline-flex items-center justify-center absolute bottom-3 right-2 translate-x-1/2 translate-y-1/2 overflow-hidden"
              >
                <img
                  :src="toChain?.icon"
                  alt="ETH"
                  class="inline-block w-[28px] h-[28px]"
                />
              </div>
            </div>
            <div>
              <div class="font-bold text-s-24 ml-5">
                {{ toAmount }} {{ toToken?.symbol }}
              </div>
              <div class="text-s-12 text-grey-30 ml-5">
                ≈ ${{ toAmountFiat }}
              </div>
            </div>
          </div>
          <app-pop-up-menu
            :placeholder="`${quotes.length} other offers`"
            location="left"
          >
            <template #menu-content="{ toggleMenu }">
              <div class="px-4 pt-4 pb-2">
                <div
                  class="cursor-pointer"
                  v-for="(item, idx) in quotes"
                  :key="idx + item.quote.provider + item.toTokenAmount"
                  :class="{ 'pb-4': idx < quotes.length - 1 }"
                  @click="
                    () => {
                      setItem(item, toggleMenu)
                    }
                  "
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-grey-50 text-s-14">Offer {{ idx + 1 }}</p>
                      <p class="font-bold text-s-14">
                        ~{{
                          parseAmount(
                            item.toTokenAmount,
                            item.quote.options.toToken.decimals,
                          )
                        }}
                        {{ item.quote.options.toToken.symbol }}
                      </p>
                    </div>
                    <check-icon
                      v-if="item.quote.provider === selectedQuote?.provider"
                      class="w-8 h-8 text-primary ml-2"
                    />
                  </div>
                </div>
              </div>
            </template>
          </app-pop-up-menu>
          <div class="pt-3">
            <div class="text-s-14 text-grey-50">
              Rate: 1 {{ fromToken?.symbol }} ≈ {{ exchangeRate }}
              {{ toToken?.symbol }}
            </div>
            <!-- TODO: make library return these values -->
            <!-- <div class="text-s-14 text-grey-50">Price impact: -0.07%</div> -->
            <div class="text-s-14 text-grey-50">
              Max. slippage: {{ swapInfo?.slippage }}%
            </div>
            <!-- <div class="text-s-14 text-grey-50">
              Minimum received: 128.345 *tSym*
            </div> -->
            <div class="text-s-14 text-grey-50">
              Offer includes {{ swapInfo?.fee }}% fee
            </div>
          </div>
        </div>
        <app-select-tx-fee />
        <app-base-button
          class="w-full"
          @click="proceedWithSwap"
          :is-loading="isLoading"
        >
          Proceed with Swap
        </app-base-button>
      </div>
    </template>
  </app-dialog>
</template>

<script lang="ts" setup>
import AppDialog from '@/components/AppDialog.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { ref, computed } from 'vue'
import {
  type ProviderQuoteResponse,
  type ProviderSwapResponse,
} from '@enkryptcom/swap'
import { fromBase } from '@/utils/unit'
import BigNumber from 'bignumber.js'
import { type Chain } from '@/mew_api/types'
import BN from 'bn.js'
import { CheckIcon } from '@heroicons/vue/24/solid'

enum ProviderName {
  oneInch = 'oneInch',
  paraswap = 'paraswap',
  zerox = 'zerox',
  changelly = 'changelly',
  rango = 'rango',
  jupiter = 'jupiter',
}

enum DisplayProviderName {
  oneInch = '1inch',
  paraswap = 'ParaSwap',
  zerox = '0x',
  changelly = 'Changelly',
  rango = 'Rango',
  jupiter = 'Jupiter',
}

const model = defineModel('swapOfferOpen', {
  type: Boolean,
  required: true,
  default: false,
})

const selectedQuote = defineModel('selectedQuote', {
  type: Object as () => ProviderQuoteResponse,
})

defineProps({
  quotes: {
    type: Array as () => ProviderQuoteResponse[],
    default: () => [],
  },
  amount: {
    type: [String, Number],
    default: '0',
  },
  toChain: {
    type: Object as () => Chain,
  },
  swapInfo: {
    type: Object as () => ProviderSwapResponse,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:proceedWithSwap'])
const isLoading = ref(false)

const providerName = computed(() => {
  switch (selectedQuote.value?.provider) {
    case ProviderName.oneInch:
      return DisplayProviderName.oneInch
    case ProviderName.paraswap:
      return DisplayProviderName.paraswap
    case ProviderName.zerox:
      return DisplayProviderName.zerox
    case ProviderName.changelly:
      return DisplayProviderName.changelly
    case ProviderName.rango:
      return DisplayProviderName.rango
    case ProviderName.jupiter:
      return DisplayProviderName.jupiter
    default:
      return 'Unknown Provider'
  }
})

const setItem = (item: ProviderQuoteResponse, close: () => void) => {
  selectedQuote.value = item
  close()
}

const fromToken = computed(() => {
  return selectedQuote.value?.quote.options.fromToken
})

const toToken = computed(() => {
  return selectedQuote.value?.quote.options.toToken
})

const toAmount = computed(() => {
  return fromBase(
    selectedQuote.value?.toTokenAmount.toString() || '0',
    toToken.value?.decimals || 18,
  )
})

const parseAmount = (amount: BN, decimal: number) => {
  return fromBase(amount.toString(), decimal)
}

const exchangeRate = computed(() => {
  if (!fromToken.value || !toToken.value) return '0'
  const fromTokenPrice = fromToken.value.price || '0'
  const toTokenPrice = toToken.value.price || '0'
  if (BigNumber(toTokenPrice).isZero()) return '0'
  return BigNumber(fromTokenPrice).times(toTokenPrice).toString()
})

const toAmountFiat = computed(() => {
  return (
    BigNumber(
      fromBase(
        selectedQuote.value?.toTokenAmount.toString() || '0',
        toToken.value?.decimals || 18,
      ),
    )
      .times(BigNumber(toToken.value?.price || '0'))
      .decimalPlaces(2) || '0'
  )
})

// Let parent know when the swap is to be proceeded
const proceedWithSwap = () => {
  isLoading.value = true
  emits('update:proceedWithSwap')
}
</script>
