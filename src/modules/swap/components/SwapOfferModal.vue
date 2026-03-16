<template>
  <app-dialog
    v-model:is-open="model"
    :title="title"
    class="lg:min-h-[614px] xs:min-w-[450px]"
  >
    <template #content>
      <div class="mx-4 mb-2">
        <div
          class="p-4 flex flex-col border border-solid border-grey-10 rounded-20 mb-2"
        >
          <h3 class="font-bold text-s-17 lg:text-s-20 ml-2">
            {{ t('swap.swap-offer.best-offer-from') }}
            {{ providerName }}
          </h3>
          <p
            class="font-normal text-s-17 lg:text-s-20 my-2 mb-2 ml-2 flex flex-wrap items-center gap-2"
          >
            {{ t('swap.for') }}
            <app-token-logo
              :url="fromToken?.logoURI"
              :symbol="fromToken?.symbol"
              :address="
                fromToken && fromChain
                  ? { address: fromToken.address, network: fromChain.name }
                  : undefined
              "
              width="w-6 lg:w-8"
              height="h-6 lg:h-8"
            />
            <span class="font-bold">
              {{ amount }}
            </span>
            <app-token-symbol
              :symbol="fromToken?.symbol || 'UNKNOWN'"
              :address="
                fromToken && fromChain
                  ? { address: fromToken.address, network: fromChain.name }
                  : undefined
              "
              class="text-s-17 lg:text-s-20 !font-bold !leading-p-100 inline-block align-middle"
            />
            {{ t('swap.swap-offer.you-will-get') }}:
          </p>
          <div class="flex items-center bg-mewBg rounded-20 p-4 my-2">
            <div class="relative">
              <app-token-logo
                :url="toToken?.logoURI"
                :symbol="toToken?.symbol"
                :address="
                  toToken && toChain
                    ? { address: toToken.address, network: toChain.name }
                    : undefined
                "
                width="w-8 lg:w-[48px]"
                height="h-8 lg:h-[48px]"
              />
              <div
                class="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4"
              >
                <app-token-logo
                  :url="toChain?.icon"
                  symbol=""
                  width="w-4 lg:w-6"
                  height="h-4 lg:h-6"
                />
              </div>
            </div>
            <div class="ml-5 min-w-0">
              <div
                class="font-bold text-s-20 lg:text-s-24 flex items-center gap-1 min-w-0"
              >
                <span class="flex-none">≈</span>
                <span class="cursor-pointer truncate">{{
                  toAmountFormatted.truncated
                }}</span>
                <app-token-symbol
                  :symbol="toToken?.symbol || 'UNKNOWN'"
                  :address="
                    toToken && toChain
                      ? { address: toToken.address, network: toChain.name }
                      : undefined
                  "
                  class="text-s-20 lg:text-s-24 !font-bold !leading-p-100 inline-block align-middle"
                />
                <app-tooltip
                  v-if="toAmountFormatted.hasMore"
                  :text="toAmountFormatted.full"
                  class="truncate"
                >
                </app-tooltip>
              </div>
              <div class="text-s-12 text-info">≈ ${{ toAmountFiat }}</div>
            </div>
          </div>
          <app-pop-up-menu
            :placeholder="`${t('swap.swap-offer.offers', { count: quotes.length - 1 })}`"
            location="left"
            v-if="quotes.length > 1"
          >
            <template #menu-content="{ toggleMenu }">
              <div class="p-2">
                <button
                  v-for="(item, idx) in quotes"
                  :key="idx + item.quote.provider + item.toTokenAmount"
                  class="w-full text-left p-3 rounded-12 mb-2 hoverBGWhite"
                  :class="{
                    'bg-mewBg': item.quote.provider === selectedQuote?.provider,
                  }"
                  @click="
                    () => {
                      setItem(item, toggleMenu)
                    }
                  "
                >
                  <div class="flex items-center justify-between w-full">
                    <div class="grow min-w-0">
                      <div class="flex items-center gap-2">
                        <p
                          class="text-info text-s-12 font-medium truncate uppercase tracking-sp-06 leading-p-160"
                        >
                          {{
                            t('swap.swap-offer.offer_from', {
                              provider: getProviderDisplayName(
                                item.quote.provider,
                              ),
                            })
                          }}
                        </p>
                        <p
                          v-if="idx === 0"
                          class="bg-primary text-white rounded-full px-2 py-0.5 !text-[8px] font-bold uppercase tracking-sp-06 whitespace-nowrap ml-1"
                        >
                          best rate
                        </p>
                      </div>
                      <div
                        class="font-semibold text-s-14 flex items-center gap-1"
                      >
                        <span>~</span>
                        <span>
                          {{
                            getAmountData(
                              item.toTokenAmount,
                              item.quote?.options?.toToken?.decimals,
                            ).truncated
                          }}
                        </span>

                        <app-token-symbol
                          :symbol="
                            item.quote?.options?.toToken?.symbol || 'UNKNOWN'
                          "
                          :address="
                            item.quote?.options?.toToken && toChain
                              ? {
                                  address: item.quote.options.toToken.address,
                                  network: toChain.name,
                                }
                              : undefined
                          "
                          class="text-s-14 !font-semibold !leading-p-160 inline-block align-middle"
                        />
                        <app-tooltip
                          v-if="
                            getAmountData(
                              item.toTokenAmount,
                              item.quote?.options?.toToken?.decimals,
                            ).hasMore
                          "
                          :text="
                            getAmountData(
                              item.toTokenAmount,
                              item.quote?.options?.toToken?.decimals,
                            ).full
                          "
                        >
                        </app-tooltip>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 flex-none ml-auto">
                      <span
                        v-if="idx > 0"
                        class="text-error text-s-12 whitespace-nowrap text-right mr-2"
                      >
                        ({{
                          getPercentageDiff(
                            item.toTokenAmount,
                            item.quote?.options?.toToken?.decimals,
                          )
                        }}%)
                      </span>
                      <CheckIcon
                        v-if="item.quote.provider === selectedQuote?.provider"
                        class="w-5 h-5 text-primary"
                      />
                      <div v-else class="w-4 h-4" />
                    </div>
                  </div>
                </button>
              </div>
            </template>
          </app-pop-up-menu>
          <div class="pt-3 ml-2">
            <div class="text-s-14 text-info flex items-center gap-1">
              <span>Rate: 1</span>
              <app-token-symbol
                :symbol="fromToken?.symbol || 'UNKNOWN'"
                :address="
                  fromToken && fromChain
                    ? { address: fromToken.address, network: fromChain.name }
                    : undefined
                "
                :has-gradient="false"
                class="!text-s-14 !font-normal !leading-p-100"
              />
              <span>≈ {{ exchangeRate }}</span>
              <app-token-symbol
                :symbol="toToken?.symbol || 'UNKNOWN'"
                :address="
                  toToken && toChain
                    ? { address: toToken.address, network: toChain.name }
                    : undefined
                "
                :has-gradient="false"
                class="!text-s-14 !font-normal !leading-p-100"
              />
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
        <app-select-tx-fee
          :fees="swapGasFeeQuote"
          v-model:gas-fee-error="gasFeeError"
          class="mb-2"
        />
        <app-base-button
          class="w-full"
          @click="proceedWithSwap"
          :is-loading="loadingModel"
          :disabled="!!gasFeeError"
        >
          {{ btnText }}
        </app-base-button>
        <app-btn-text
          class="mx-auto w-full mt-2 text-error"
          is-large
          @click="declineSwap"
        >
          Cancel
        </app-btn-text>
      </div>
    </template>
  </app-dialog>
</template>

<script lang="ts" setup>
import AppDialog from '@/components/AppDialog.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import { computed, watch, ref } from 'vue'
import {
  type ProviderQuoteResponse,
  type ProviderSwapResponse,
} from '@enkryptcom/swap'
import { formatUnits } from 'viem'
import BigNumber from 'bignumber.js'
import { type Chain, type QuotesResponse } from '@/mew_api/types'
import BN from 'bn.js'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { useI18n } from 'vue-i18n'
import { formatFiatValue } from '@/utils/numberFormatHelper'

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
  fromChain: {
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
  swapFeeError: {
    type: String,
  },
})

const emits = defineEmits(['update:proceedWithSwap', 'update:declineSwap'])

const providerName = computed(() => {
  return getProviderDisplayName(selectedQuote.value?.provider || '')
})

const getProviderDisplayName = (name: string) => {
  switch (name) {
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
}

const isBridge = computed(() => {
  if (!props.fromChain || !props.toChain) return false
  return props.fromChain.name !== props.toChain.name
})

const title = computed(() => {
  return isBridge.value ? 'Bridge' : 'Swap'
})

const btnText = computed(() => {
  return isBridge.value
    ? t('swap.swap-offer.proceed-bridge')
    : t('swap.swap-offer.proceed')
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
    formatUnits(
      BigInt(selectedQuote.value?.toTokenAmount.toString() || '0'),
      toToken.value?.decimals ?? 18,
    ),
  ).decimalPlaces(4)
})

const toAmountFormatted = computed(() => {
  const full = formatUnits(
    BigInt(selectedQuote.value?.toTokenAmount.toString() || '0'),
    toToken.value?.decimals ?? 18,
  )

  const BigNumberVal = BigNumber(full)
  const decimalPlaces = BigNumberVal.decimalPlaces()

  let truncated = BigNumberVal.toFixed(6) // Limit to 8 decimals for display
  let hasMore = decimalPlaces !== null && decimalPlaces > 6

  if (BigNumberVal.gte(100000)) {
    truncated = BigNumberVal.toFixed(0) // No decimals for very large numbers
    hasMore = decimalPlaces !== null && decimalPlaces > 0
  } else if (BigNumberVal.gte(10)) {
    truncated = BigNumberVal.toFixed(2) // 2 decimals for numbers >= 10
    hasMore = decimalPlaces !== null && decimalPlaces > 2
  } else if (BigNumberVal.gte(1)) {
    truncated = BigNumberVal.toFixed(4) // 4 decimals for numbers between 0 and 10
    hasMore = decimalPlaces !== null && decimalPlaces > 4
  }

  return { full, truncated, hasMore }
})

const toAmountFiat = computed(() => {
  const toTokenPrice = toToken.value?.price || '0'
  const value = BigNumber(toAmount.value).multipliedBy(toTokenPrice)
  return formatFiatValue(value.toString()).value
})

const getAmountData = (amount: BN, decimals: number) => {
  if (!amount) return { full: '0', truncated: '0', hasMore: false }
  const full = formatUnits(BigInt(amount.toString()), decimals || 18)
  const bn = BigNumber(full)
  const decimalPlaces = bn.decimalPlaces()

  let truncated = bn.toFixed(6)
  let hasMore = decimalPlaces !== null && decimalPlaces > 6

  if (bn.gte(100000)) {
    truncated = bn.toFixed(0)
    hasMore = decimalPlaces !== null && decimalPlaces > 0
  } else if (bn.gte(10)) {
    truncated = bn.toFixed(2)
    hasMore = decimalPlaces !== null && decimalPlaces > 2
  } else if (bn.gte(1)) {
    truncated = bn.toFixed(4)
    hasMore = decimalPlaces !== null && decimalPlaces > 4
  }

  return { full, truncated, hasMore }
}

const getPercentageDiff = (amount: BN, decimals: number) => {
  if (!props.quotes || !props.quotes.length) return '0'
  const bestQuote = props.quotes[0]
  if (!bestQuote?.quote?.options?.toToken) return '0'
  const bestAmount = BigNumber(
    formatUnits(
      BigInt(bestQuote.toTokenAmount.toString()),
      bestQuote.quote.options.toToken.decimals || 18,
    ),
  )
  const currentAmount = BigNumber(
    formatUnits(BigInt(amount.toString()), decimals || 18),
  )
  if (bestAmount.isZero()) return '0'
  const diff = currentAmount.div(bestAmount).minus(1).multipliedBy(100)
  return diff.toFormat(2)
}

const exchangeRate = computed(() => {
  if (!fromToken.value || !toToken.value) return '0'
  const fromTokenPrice = fromToken.value.price || '0'
  const toTokenPrice = toToken.value.price || '0'
  if (BigNumber(toTokenPrice).isZero()) return '0'
  return BigNumber(fromTokenPrice).div(toTokenPrice).toFormat(2)
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

const gasFeeError = ref<string | undefined>('')
watch(
  () => props.swapFeeError,
  () => {
    gasFeeError.value = props.swapFeeError
  },
  { immediate: true },
)
</script>
