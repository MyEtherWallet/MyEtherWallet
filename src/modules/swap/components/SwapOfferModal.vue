<template>
  <app-modal v-model="model" :title="title">
    <div class="flex flex-col gap-6 p-6">
      <expand-transition>
        <div v-if="showApproveMessage">
          <p
            key="confirmation-approve-message"
            class="text-center text-label-base text-text-brand animate-pulse"
          >
            {{ t('swap.swap-offer.approve-tx-on-device') }}
          </p>
        </div>
      </expand-transition>

      <div class="flex flex-col gap-8 pb-6">
        <div class="flex flex-col gap-3">
          <p class="text-label-base text-text-default">
            {{ providerLabel }}
          </p>
          <app-dropdown :title="providerName" bordered>
            <template #avatar="{ size }">
              <app-avatar
                type="cryptoAsset"
                :size="size"
                :url="providerLogo(selectedQuote?.provider)"
                :symbol="providerName"
              />
            </template>
            <template v-if="isBestQuote" #suffix>
              <app-tag
                type="success"
                variant="contrast"
                leading-icon="check-badge"
                :label="t('swap.swap-offer.best-value')"
              />
            </template>
            <app-cell
              v-for="(item, idx) in quotes"
              :key="idx + item.quote.provider + item.toTokenAmount"
              size="small"
              inset
              role="option"
              :aria-selected="item.quote.provider === selectedQuote?.provider"
              :selected="item.quote.provider === selectedQuote?.provider"
              :title="getProviderDisplayName(item.quote.provider)"
              :right-accessory="{
                kind: 'balance',
                primary: `≈ ${
                  getAmountData(
                    item.toTokenAmount,
                    item.quote?.options?.toToken?.decimals,
                  ).value
                } ${item.quote?.options?.toToken?.symbol ?? ''}`,
              }"
              @click="setItem(item)"
            >
              <template #avatar="{ size }">
                <app-avatar
                  type="cryptoAsset"
                  :size="size"
                  :url="providerLogo(item.quote.provider)"
                  :symbol="getProviderDisplayName(item.quote.provider)"
                />
              </template>
            </app-cell>
          </app-dropdown>
        </div>

        <div class="flex flex-col items-center gap-3">
          <p class="w-full text-label-base text-text-default">
            {{ t('swap.swap-offer.summary') }}
          </p>
          <div
            class="flex w-full flex-col overflow-hidden rounded-16 bg-background-default p-4"
          >
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-3">
                <app-content-group
                  :title="t('swap.swap-offer.youre-paying')"
                  class="flex-1"
                />
                <app-content-group
                  :title="String(amount)"
                  :description="`≈ ${currencySymbol}${fromAmountFiat}`"
                  align="right"
                  class="flex-1"
                >
                  <template #title>
                    <span class="inline-flex gap-1">
                      {{ amount }}
                      <app-token-symbol
                        :symbol="fromToken?.symbol || 'UNKNOWN'"
                        :address="tokenAddress(fromToken, fromChain)"
                        class="!text-label-base !font-semibold"
                      />
                    </span>
                  </template>
                </app-content-group>
                <app-token-logo
                  :url="fromToken?.logoURI"
                  :symbol="fromToken?.symbol"
                  :address="tokenAddress(fromToken, fromChain)"
                  width="w-10"
                  height="h-10"
                  no-shadow
                />
              </div>

              <app-divider variant="alternative" class="-my-1" />

              <div class="flex items-center gap-3">
                <app-content-group
                  :title="t('swap.swap-offer.expected-to-receive')"
                  class="flex-1"
                />
                <app-content-group
                  :title="toAmountFormatted.value"
                  :description="`≈ ${currencySymbol}${toAmountFiat}`"
                  align="right"
                  class="flex-1"
                >
                  <template #title>
                    <span class="inline-flex gap-1">
                      ≈ {{ toAmountFormatted.value }}
                      <app-token-symbol
                        :symbol="toToken?.symbol || 'UNKNOWN'"
                        :address="tokenAddress(toToken, toChain)"
                        class="!text-label-base !font-semibold"
                      />
                    </span>
                  </template>
                  <template
                    v-if="toAmountFormatted.tooltipText"
                    #title-icon="{ size }"
                  >
                    <app-tooltip :text="toAmountFormatted.tooltipText">
                      <AppIcon
                        name="information-circle"
                        :size="size"
                        class="cursor-pointer text-icon-default"
                      />
                    </app-tooltip>
                  </template>
                </app-content-group>
                <div class="relative shrink-0">
                  <app-token-logo
                    :url="toToken?.logoURI"
                    :symbol="toToken?.symbol"
                    :address="tokenAddress(toToken, toChain)"
                    width="w-10"
                    height="h-10"
                    no-shadow
                  />
                  <!-- Bridges land on another chain: badge the destination. -->
                  <div
                    v-if="isBridge"
                    class="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4"
                  >
                    <app-token-logo
                      :url="toChain?.icon"
                      symbol=""
                      width="w-4"
                      height="h-4"
                    />
                    <span class="sr-only">{{
                      toChain?.nameLong || toChain?.name
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <expand-transition>
              <div v-if="isBreakdownOpen" class="flex flex-col gap-4 pt-4">
                <app-divider variant="alternative" class="-my-1" />
                <div v-if="minimumReceived" class="flex items-center gap-2">
                  <p class="flex-1 truncate text-text-base text-text-subtle">
                    {{ t('swap.swap-offer.minimum-received') }}
                  </p>
                  <p class="text-label-base text-text-default">
                    {{ minimumReceived }} {{ toToken?.symbol ?? '' }}
                  </p>
                  <app-token-logo
                    :url="toToken?.logoURI"
                    :symbol="toToken?.symbol"
                    :address="tokenAddress(toToken, toChain)"
                    width="w-[18px]"
                    height="h-[18px]"
                    no-shadow
                  />
                </div>
                <div class="flex items-center gap-2">
                  <p class="flex-1 truncate text-text-base text-text-subtle">
                    {{ t('swap.swap-offer.rate') }}
                  </p>
                  <p class="text-label-base text-text-default">
                    1 {{ fromToken?.symbol ?? '' }} ≈ {{ exchangeRate }}
                    {{ toToken?.symbol ?? '' }}
                  </p>
                </div>
                <div v-if="swapInfo?.slippage" class="flex items-center gap-2">
                  <p class="flex-1 truncate text-text-base text-text-subtle">
                    {{ t('swap.swap-offer.max-slippage') }}
                  </p>
                  <p class="text-label-base text-text-default">
                    {{ swapInfo.slippage }}%
                  </p>
                </div>
              </div>
            </expand-transition>
          </div>

          <app-base-button
            type="tertiary"
            surface="alternative"
            size="small"
            @click="isBreakdownOpen = !isBreakdownOpen"
          >
            {{
              isBreakdownOpen
                ? t('swap.swap-offer.close-breakdown')
                : t('swap.swap-offer.expand-breakdown')
            }}
            <template #trailing>
              <AppIcon
                name="chevron-down"
                size="xxs"
                class="transition-transform"
                :class="{ 'rotate-180': isBreakdownOpen }"
              />
            </template>
          </app-base-button>
        </div>

        <div class="flex flex-col gap-3">
          <p class="text-label-base text-text-default">
            {{ t('swap.swap-offer.network-fee') }}
          </p>
          <app-select-tx-fee
            :fees="swapGasFeeQuote"
            v-model:gas-fee-error="gasFeeError"
            dropdown
          />
        </div>
      </div>

      <app-banner
        v-if="priceImpactTooHigh"
        type="alert"
        :description="
          t('swap.price-impact-too-high', {
            percent: priceImpact?.toFixed(2),
          })
        "
        class="w-full"
      />
      <app-banner
        v-else-if="priceImpact === null"
        type="warning"
        :description="t('swap.price-impact-unknown')"
        class="w-full"
      />
      <app-base-button
        class="w-full"
        @click="proceedWithSwap"
        :is-loading="loadingModel"
        :disabled="!canProceed"
      >
        {{ btnText }}
      </app-base-button>
    </div>
  </app-modal>
</template>

<script lang="ts" setup>
import ExpandTransition from '@/components/transitions/ExpandTransition.vue'
import AppModal from '@/components/modal/AppModal.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppTooltip from '@/components/tooltip/AppTooltip.vue'
import { computed, watch, ref } from 'vue'
import {
  type ProviderQuoteResponse,
  type ProviderSwapResponse,
} from '@enkryptcom/swap'
import { formatUnits } from 'viem'
import BigNumber from 'bignumber.js'
import { type Chain, type QuotesResponse } from '@/mew_api/types'
import BN from 'bn.js'
import { useI18n } from 'vue-i18n'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { analytics, SwapEvent, type SwapPayloadShared } from '@/analytics'
import { useWalletStore } from '@/stores/walletStore'
import { useGlobalStore } from '@/stores/globalStore'
import { storeToRefs } from 'pinia'
import { WalletType } from '@/providers/types'

import AppIcon from '@/components/icon/AppIcon.vue'
import AppTag from '@/components/tag/AppTag.vue'
import AppDropdown from '@/components/dropdown/AppDropdown.vue'
import AppCell from '@/components/cell/AppCell.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import AppBanner from '@/components/banner/AppBanner.vue'
import {
  isPriceImpactTooHigh,
  quotePriceImpact,
} from '@/modules/swap/swapPriceImpact'
import oneInchLogo from '@/assets/images/swap/providers/oneinch.png'
import paraswapLogo from '@/assets/images/swap/providers/paraswap.png'
import zeroxLogo from '@/assets/images/swap/providers/zerox.png'
import changellyLogo from '@/assets/images/swap/providers/changelly.png'
import rangoLogo from '@/assets/images/swap/providers/rango.png'
import jupiterLogo from '@/assets/images/swap/providers/jupiter.png'
import okxLogo from '@/assets/images/swap/providers/okx.png'
const { t } = useI18n()
const { formatFiat, currencySymbol } = useCurrency()

enum ProviderName {
  oneInch = 'oneInch',
  oneInchFusion = 'oneInchFusion',
  paraswap = 'paraswap',
  zerox = 'zerox',
  changelly = 'changelly',
  rango = 'rango',
  jupiter = 'jupiter',
  okx = 'okx',
}

enum DisplayProviderName {
  oneInch = '1inch',
  oneInchFusion = '1inch Fusion',
  paraswap = 'ParaSwap',
  zerox = '0x',
  changelly = 'Changelly',
  rango = 'Rango',
  jupiter = 'Jupiter',
  okx = 'OKX',
}

const walletStore = useWalletStore()
const { wallet } = storeToRefs(walletStore)
const { gasPriceType } = storeToRefs(useGlobalStore())

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
const emits = defineEmits(['update:proceedWithSwap'])

const isBreakdownOpen = ref(false)

const providerName = computed(() => {
  return getProviderDisplayName(selectedQuote.value?.provider || '')
})

// Icons copied from @enkryptcom/swap's dist: its PROVIDER_INFO only exposes
// unresolvable relative paths. Keyed by the library's provider name.
const PROVIDER_LOGOS: Record<string, string> = {
  oneInch: oneInchLogo,
  oneInchFusion: oneInchLogo,
  paraswap: paraswapLogo,
  zerox: zeroxLogo,
  changelly: changellyLogo,
  rango: rangoLogo,
  jupiter: jupiterLogo,
  okx: okxLogo,
}

const providerLogo = (name?: string) => (name && PROVIDER_LOGOS[name]) || null

// The quote list is ordered by minimum amount, not by output, so "Best value"
// goes to the quote that receives the most.
const bestQuote = computed(() =>
  props.quotes.reduce<(typeof props.quotes)[number] | undefined>(
    (best, quote) =>
      !best ||
      BigInt(quote.toTokenAmount.toString()) >
        BigInt(best.toTokenAmount.toString())
        ? quote
        : best,
    undefined,
  ),
)
const isBestQuote = computed(
  () =>
    !!bestQuote.value &&
    bestQuote.value.quote.provider === selectedQuote.value?.provider,
)

const tokenAddress = (
  token: { address: string } | undefined,
  chain: Chain | undefined,
) =>
  token && chain ? { address: token.address, network: chain.name } : undefined

const getProviderDisplayName = (name: string) => {
  switch (name) {
    case ProviderName.oneInch:
      return DisplayProviderName.oneInch
    case ProviderName.oneInchFusion:
      return DisplayProviderName.oneInchFusion
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
    case ProviderName.okx:
      return DisplayProviderName.okx
    default:
      return t('swap.swap-offer.unknown-provider')
  }
}

const isBridge = computed(() => {
  if (!props.fromChain || !props.toChain) return false
  return props.fromChain.name !== props.toChain.name
})

const providerLabel = computed(() =>
  isBridge.value
    ? t('swap.swap-offer.bridge-provider')
    : t('swap.swap-offer.swap-provider'),
)

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

const setItem = (item: ProviderQuoteResponse) => {
  selectedQuote.value = item
  const analyticsPayload = getAnalyticsPayload()
  analytics.trackSwapEvent(SwapEvent.OFFER_SELECT_NEW, analyticsPayload)
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

const fromAmountFiat = computed(() => {
  const fromTokenPrice = fromToken.value?.price || '0'
  const value = BigNumber(props.amount || 0).multipliedBy(fromTokenPrice)
  return formatFiat(value.toString()).value
})

// What the swap still pays out at the full slippage tolerance.
const minimumReceived = computed(() => {
  const slippage = props.swapInfo?.slippage
  if (!slippage || toAmount.value.isZero()) return ''
  const min = toAmount.value.multipliedBy(
    BigNumber(1).minus(BigNumber(slippage).dividedBy(100)),
  )
  return formatFloatingPointValue(min).value
})

const getAmountData = (amount: BN, decimals: number) => {
  if (!amount) return { value: '0' }
  const full = formatUnits(BigInt(amount.toString()), decimals ?? 18)
  return formatFloatingPointValue(BigNumber(full))
}

const exchangeRate = computed(() => {
  if (!fromToken.value || !toToken.value) return '0'
  const fromTokenPrice = fromToken.value.price || '0'
  const toTokenPrice = toToken.value.price || '0'
  if (BigNumber(toTokenPrice).isZero()) return '0'
  return formatFloatingPointValue(BigNumber(fromTokenPrice).div(toTokenPrice))
    .value
})

// The form checks the best quote; here the offer the user picked has to pass
// the same limit before it can be swapped (MEW-2648).
const priceImpact = computed(() =>
  quotePriceImpact(selectedQuote.value, fromToken.value, toToken.value),
)
const priceImpactTooHigh = computed(() =>
  isPriceImpactTooHigh(priceImpact.value),
)

const isProceeding = ref(false)
watch(
  () => model.value,
  () => {
    const analyticsPayload = getAnalyticsPayload()
    if (model.value) {
      isBreakdownOpen.value = false
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
// A quote can omit fee tiers; the selected one must be in it, or the tx would
// be requested for a tier the quote doesn't price.
const canProceed = computed(
  () =>
    !priceImpactTooHigh.value &&
    !gasFeeError.value &&
    !!props.swapGasFeeQuote?.quoteId &&
    !!props.swapGasFeeQuote.fees?.[gasPriceType.value],
)

const proceedWithSwap = () => {
  // Guard against proceeding without a resolved quote: an empty quoteId would
  // build a malformed unsigned-tx URL (…/multi-quotes//unsigned -> 404). The
  // button is disabled in this state; this also ignores any stray click.
  const quoteId = props.swapGasFeeQuote?.quoteId
  if (!quoteId || !canProceed.value) return
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

const gasFeeError = ref<string | undefined>('')
watch(
  () => props.swapFeeError,
  () => {
    gasFeeError.value = props.swapFeeError
  },
  { immediate: true },
)
</script>
