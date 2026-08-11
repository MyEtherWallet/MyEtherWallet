<template>
  <app-dialog
    v-model:is-open="model"
    :title="title"
    class="lg:min-h-[614px] xs:min-w-[450px]"
  >
    <template #content>
      <div class="mx-4 mb-2">
        <expand-transition>
          <div v-if="showApproveMessage">
            <div
              class="flex items-center justify-center gap-5 my-4 font-bold text-brand animate-pulse"
              key="confirmation-approve-message"
            >
              {{ t('swap.swap-offer.approve-tx-on-device') }}
            </div>
          </div>
        </expand-transition>
        <div
          class="p-4 flex flex-col border border-solid border-line rounded-20 mb-2"
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
          <div class="flex items-center bg-brand-subtle rounded-20 p-4 my-2">
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
                  toAmountFormatted.value
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
                  v-if="toAmountFormatted.tooltipText"
                  :text="toAmountFormatted.tooltipText"
                  class="truncate"
                >
                </app-tooltip>
              </div>
              <div class="text-s-12 text-fg-subtle">≈ {{ currencySymbol }}{{ toAmountFiat }}</div>
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
                    'bg-brand-subtle': item.quote.provider === selectedQuote?.provider,
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
                          class="text-fg-subtle text-s-12 font-medium truncate uppercase tracking-sp-06 leading-p-160"
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
                          class="bg-brand text-fg-on-fill rounded-full px-2 py-0.5 !text-[8px] font-bold uppercase tracking-sp-06 whitespace-nowrap ml-1"
                        >
                          {{ t('swap.swap-offer.best-rate') }}
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
                            ).value
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
                            ).tooltipText
                          "
                          :text="
                            getAmountData(
                              item.toTokenAmount,
                              item.quote?.options?.toToken?.decimals,
                            ).tooltipText
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
                        class="w-5 h-5 text-brand"
                      />
                      <div v-else class="w-4 h-4" />
                    </div>
                  </div>
                </button>
              </div>
            </template>
          </app-pop-up-menu>
          <div class="pt-3 ml-2">
            <div class="text-s-14 text-fg-subtle flex items-center gap-1">
              <span>{{ t('swap.swap-offer.rate') }}: 1</span>
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
            <!-- <div class="text-s-14 text-fg-subtle">Price impact: -0.07%</div> -->
            <div class="text-s-14 text-fg-subtle">
              {{ t('swap.swap-offer.max-slippage') }}: {{ swapInfo?.slippage }}%
            </div>
            <!-- <div class="text-s-14 text-fg-subtle">
              {{ t('swap.swap-offer.minimum-received') }}: 128.345 *tSym*
            </div> -->
            <div class="text-s-14 text-fg-subtle">
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
          :disabled="!!gasFeeError || !swapGasFeeQuote?.quoteId"
        >
          {{ btnText }}
        </app-base-button>
        <app-btn-text
          class="mx-auto w-full mt-2 text-error"
          is-large
          @click="declineSwap"
        >
          {{ t('common.cancel') }}
        </app-btn-text>
      </div>
    </template>
  </app-dialog>
</template>

<script lang="ts" setup>
import ExpandTransition from '@/components/transitions/ExpandTransition.vue'
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
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { analytics, SwapEvent, type SwapPayloadShared } from '@/analytics'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { WalletType } from '@/providers/types'

const { t } = useI18n()
const { formatFiat, currencySymbol } = useCurrency()

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

const walletStore = useWalletStore()
const { wallet } = storeToRefs(walletStore)

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

const showApproveMessage = ref(false)
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
  return isBridge.value
    ? t('swap.swap-offer.title-bridge')
    : t('swap.swap-offer.title-swap')
})

const btnText = computed(() => {
  return isBridge.value
    ? t('swap.swap-offer.proceed-bridge')
    : t('swap.swap-offer.proceed')
})

const getAnalyticsPayload = (): SwapPayloadShared => {
  return {
    isBridge: isBridge.value,
    providerName: providerName.value,
    fromAmount: props.amount.toString(),
    toAmount: toAmountFormatted.value.value,
    fromToken: fromToken.value?.symbol || 'N/A',
    toToken: toToken.value?.symbol || 'N/A',
    fromNetwork: props.fromChain?.name || 'N/A',
    toNetwork: props.toChain?.name || 'N/A',
    swapPair: `${fromToken.value?.symbol || 'N/A'}-${toToken.value?.symbol || 'N/A'}`,
  }
}

const setItem = (item: ProviderQuoteResponse, close: () => void) => {
  selectedQuote.value = item
  const analyticsPayload = getAnalyticsPayload()
  analytics.trackSwapEvent(SwapEvent.OFFER_SELECT_NEW, analyticsPayload)
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
  )
})

const toAmountFormatted = computed(() => {
  const full = formatUnits(
    BigInt(selectedQuote.value?.toTokenAmount.toString() || '0'),
    toToken.value?.decimals ?? 18,
  )

  const BigNumberVal = BigNumber(full)
  return formatFloatingPointValue(BigNumberVal)
})

const toAmountFiat = computed(() => {
  const toTokenPrice = toToken.value?.price || '0'
  const value = BigNumber(toAmount.value).multipliedBy(toTokenPrice)
  return formatFiat(value.toString()).value
})

const getAmountData = (amount: BN, decimals: number) => {
  if (!amount) return { value: '0' }
  const full = formatUnits(BigInt(amount.toString()), decimals || 18)
  return formatFloatingPointValue(BigNumber(full))
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

const isProceeding = ref(false)
watch(
  () => model.value,
  () => {
    const analyticsPayload = getAnalyticsPayload()
    if (model.value) {
      analytics.trackSwapEvent(SwapEvent.OFFER_SHOWN, { ...analyticsPayload })
    } else if (!isProceeding.value) {
      analytics.trackSwapEvent(SwapEvent.OFFER_DECLINED, {
        ...analyticsPayload,
      })
    }
    isProceeding.value = false
    loadingModel.value = false
  },
)

// Let parent know when the swap is to be proceeded
const proceedWithSwap = () => {
  // Guard against proceeding without a resolved quote: an empty quoteId would
  // build a malformed unsigned-tx URL (…/multi-quotes//unsigned -> 404). The
  // button is disabled in this state; this also ignores any stray click.
  const quoteId = props.swapGasFeeQuote?.quoteId
  if (!quoteId) return
  isProceeding.value = true
  loadingModel.value = true
  if (
    wallet.value?.getWalletType() === WalletType.TREZOR ||
    wallet.value?.getWalletType() === WalletType.LEDGER
  ) {
    showApproveMessage.value = true
  }
  emits('update:proceedWithSwap', quoteId)
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
