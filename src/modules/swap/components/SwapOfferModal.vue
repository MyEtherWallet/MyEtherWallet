<template>
  <app-dialog
    v-model:is-open="model"
    title="Swap"
    class="sm:max-w-[460px] sm:mx-auto h-[600px]"
  >
    <template #content>
      <div class="mx-4 mb-2">
        <div
          class="p-4 flex flex-col border border-solid border-grey-10 rounded-20 mb-2"
        >
          <h3 class="font-bold text-s-20 ml-2">
            {{ t('swap.swap-offer.best-offer-from') }}
            {{ providerName }}
          </h3>
          <p
            class="font-normal text-s-20 my-2 mb-2 ml-2 flex flex-wrap items-center gap-2"
          >
            {{ t('swap.for') }}
            <span
              class="w-[32px] h-[32px] rounded-[50%] inline-flex items-center justify-center overflow-hidden shadow-token"
            >
              <img
                :src="fromToken?.logoURI"
                :alt="fromToken?.symbol"
                class="inline-block w-full h-[100%]"
              />
            </span>
            <span class="font-bold">
              {{ amount }}
              {{ fromToken?.symbol }}</span
            >
            {{ t('swap.swap-offer.you-will-get') }}:
          </p>
          <div class="flex bg-surface-light rounded-20 p-4 my-2">
            <div class="relative h-[64px] overflow-visible">
              <div
                class="w-[64px] h-[64px] rounded-[50%] inline-flex items-center justify-center overflow-hidden bg-white shadow-token"
              >
                <img
                  :src="toToken?.logoURI"
                  alt="ETH"
                  class="inline-block w-[64px]"
                />
              </div>
              <div
                class="w-[24px] h-[24px] bg-white shadow-token rounded-[50%] inline-flex items-center justify-center absolute bottom-[-3px] right-[-6px] overflow-hidden"
              >
                <img
                  :src="toChain?.icon"
                  alt="ETH"
                  class="inline-block w-[24px] h-[24px]"
                />
              </div>
            </div>
            <div>
              <div class="font-bold text-s-24 ml-5">
                ≈ {{ toAmount }} {{ toToken?.symbol }}
              </div>
              <div class="text-s-12 text-grey-30 ml-5">
                ≈ ${{ toAmountFiat }}
              </div>
            </div>
          </div>
          <app-pop-up-menu
            :placeholder="`${t('swap.swap-offer.offers', { count: quotes.length })}`"
            location="left"
            v-if="quotes.length > 1"
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
                      <p class="text-info text-s-14">
                        {{ t('swap.offer') }} {{ idx + 1 }}
                      </p>
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
          <div class="pt-3 ml-2">
            <div class="text-s-14 text-info">
              Rate: 1 {{ fromToken?.symbol }} ≈ {{ exchangeRate }}
              {{ toToken?.symbol }}
            </div>
            <!-- TODO: make library return these values -->
            <!-- <div class="text-s-14 text-info">Price impact: -0.07%</div> -->
            <div class="text-s-14 text-info">
              {{ t('swap.swap-offer.max-slippage') }}: {{ swapInfo?.slippage }}%
            </div>
            <!-- <div class="text-s-14 text-info">
              {{ t('swap.swap-offer.minimum-received') }}: 128.345 *tSym*
            </div> -->
            <div class="text-s-14 text-info">
              {{
                t('swap.swap-offer.offer-includes', {
                  feePercent: swapInfo?.fee,
                })
              }}
            </div>
          </div>
        </div>
        <app-select-tx-fee :fees="swapGasFeeQuote" />
        <app-base-button
          class="w-full"
          @click="proceedWithSwap"
          :is-loading="loadingModel"
        >
          {{ t('swap.swap-offer.proceed') }}
        </app-base-button>
        <app-base-button
          class="w-full mt-5"
          :is-outline="true"
          theme="error"
          @click="declineSwap"
        >
          {{ t('swap.swap-offer.decline') }}
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
import { computed, watch } from 'vue'
import {
  type ProviderQuoteResponse,
  type ProviderSwapResponse,
} from '@enkryptcom/swap'
import { fromBase } from '@/utils/unit'
import BigNumber from 'bignumber.js'
import { type Chain, type QuotesResponse } from '@/mew_api/types'
import BN from 'bn.js'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

const loadingModel = defineModel('loading', {
  type: Boolean,
  default: false,
})

const selectedQuote = defineModel('selectedQuote', {
  type: Object as () => ProviderQuoteResponse,
})

const props = defineProps({
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
  swapGasFeeQuote: {
    type: Object as () => QuotesResponse,
    default: () => ({}),
  },
})

const emits = defineEmits(['update:proceedWithSwap', 'update:declineSwap'])

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
      return t('swap.swap-offer.unknown-provider')
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
  return BigNumber(
    fromBase(
      selectedQuote.value?.toTokenAmount.toString() || '0',
      toToken.value?.decimals ?? 18,
    ),
  ).decimalPlaces(8)
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
        toToken.value?.decimals ?? 18,
      ),
    )
      .times(BigNumber(toToken.value?.price || '0'))
      .decimalPlaces(2) || '0'
  )
})

watch(
  () => model.value,
  () => {
    loadingModel.value = false
  },
)

// Let parent know when the swap is to be proceeded
const proceedWithSwap = () => {
  loadingModel.value = true
  emits('update:proceedWithSwap', props.swapGasFeeQuote?.quoteId || '')
}
const declineSwap = () => {
  emits('update:declineSwap')
}
</script>
