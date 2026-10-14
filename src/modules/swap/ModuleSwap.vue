<template>
  <div class="flex h-full flex-col">
    <div class="flex w-full flex-col gap-5">
      <!-- Header stays at full opacity when blocked: only the form below the
           unavailable card is dimmed. -->
      <AppContentGroup size="l" :title="title" :description="description" />
      <!-- Network Not Supported -->
      <app-unavailable-card
        v-if="swapLoaded && !supportedNetwork"
        :title="$t('swap.network-not-supported')"
        :description="
          isSwapView
            ? $t('swap.swapping-not-available', {
                network:
                  selectedChain?.nameLong ||
                  selectedChain?.name ||
                  $t('common.network'),
              })
            : $t('swap.bridging-not-available', {
                network:
                  selectedChain?.nameLong ||
                  selectedChain?.name ||
                  $t('common.network'),
              })
        "
      >
        <template #action>
          <select-chain-for-app
            :passed-chains="fromChains"
            :preselected-chain="defualtChainWhenNetworkUnsupported"
            :can-store="false"
            id="SWAP:NetworkNotSupported"
            class="w-full"
            @update:selected-chain="switchGlobalNetwork"
          />
        </template>
      </app-unavailable-card>

      <app-swap-form
        v-model:from-amount="fromAmount"
        v-model:from-token="fromTokenModel"
        v-model:from-error="fromAmountError"
        v-model:to-amount="toAmount"
        v-model:to-token="toTokenModel"
        v-model:to-error="toAmountError"
        :from-tokens="parsedFromTokens"
        :to-tokens="filteredToTokens"
        :from-network-name="selectedChain?.name"
        :to-network-name="selectedToChain?.name"
        :from-loading="fromLoadingState"
        :to-loading="toLoadingState"
        :show-balance="isWalletConnected"
        :is-pristine="isPristine"
        :quick-actions="quickActions"
        :show-from-network="!isSwapView"
        :from-chains="fromChains"
        :show-to-network="
          !(
            isSwapView &&
            selectedChain?.name === selectedToChain?.name &&
            !isBitcoinChain
          )
        "
        :to-chains="parsedToChains"
        :to-chain="selectedToChain"
        :cta-label="ctaLabel"
        :cta-disabled="isSwapDisabled"
        :class="['transition-all duration-300', blockedClass]"
        @percent="handleMaxClick"
        @update:to-chain="setToChain"
        @submit="swapButton"
      >
        <address-input
          v-if="(!isSwapView && isCrossChain) || isBitcoinChain"
          v-model:adr-input="userToAddress"
          :resolved-address="toAddress"
          :found-nick-name="foundNickName"
          :address-error-messages="toAddressError"
          :network="selectedToChain"
          :is-pristine="isPristine"
          filled
          @validate:address="validateToAddress"
        />
        <!-- Error Display -->
        <div
          v-if="!isLoading && priceImpactTooHigh"
          class="w-full p-4 bg-background-error-subtle border border-border-error rounded-12"
        >
          <p class="text-text-error text-s-14 text-center">
            {{
              t('swap.price-impact-too-high', {
                percent: priceImpact.toFixed(2),
              })
            }}
          </p>
        </div>
        <div
          v-if="!isLoading && generalError"
          class="w-full p-4 bg-background-error-subtle border border-border-error rounded-12"
        >
          <p class="text-text-error text-s-14 text-center">
            {{ generalError }}
          </p>
        </div>
        <template
          v-if="!isWalletConnected || isWatchOnly || !hasChainBalance"
          #cta
        >
          <app-base-button
            v-if="!isWalletConnected || isWatchOnly"
            class="w-full"
            @click="connectWalletForSwap"
          >
            {{ t('connect_wallet') }}</app-base-button
          >
          <app-no-chain-balance
            v-else
            :source="isSwapView ? 'swap' : 'bridge'"
          />
        </template>
      </app-swap-form>
    </div>

    <app-need-help
      :title="
        isSwapView ? t('swap.need-help-swapping') : t('swap.need-help-bridging')
      "
      help-link="https://help.myetherwallet.com/en/article/what-is-gas"
      class="mt-auto self-center pt-5"
      :class="blockedClass"
    />
    <best-offer-modal v-model:best-offer-open="bestSwapLoadingOpen" />
    <swap-offer-modal
      v-model:swap-offer-open="bestOfferSelectionOpen"
      v-model:selected-quote="selectedQuote"
      v-model:loading="txProceeding"
      @update:proceedWithSwap="proceedWithSwap"
      @update:declineSwap="cancelSwap"
      :quotes="providers"
      :amount="fromAmount"
      :from-chain="selectedChain"
      :to-chain="selectedToChain"
      :swap-info="swapInfo || undefined"
      :swap-gas-fee-quote="swapGasFeeQuote || undefined"
      :swap-fee-error="swapFeeError"
    />
    <swap-initiated-modal
      v-model:swap-initiated-open="swapInitiatedOpen"
      :from-chain="selectedChain"
      :to-chain="selectedToChain"
      :selected-quote="selectedQuote"
      :tx-hash="txHash"
      :to-address="toAddress"
      :from-address="userAddress"
      :swap-gas-fee-quote="swapGasFeeQuote"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
// Components
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppSwapForm from '@/components/AppSwapForm.vue'
import BestOfferModal from './components/BestOfferModal.vue'
import SwapOfferModal from './components/SwapOfferModal.vue'
import SwapInitiatedModal from './components/SwapInitiatedModal.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import AppUnavailableCard from '@/components/AppUnavailableCard.vue'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import AddressInput from '@/components/address_book/AddressInput.vue'
import AppNoChainBalance from '@/components/AppNoChainBalance.vue'

import { useSwapModule } from './composables/useSwapModule'

const { t } = useI18n()
const {
  supportedNetwork,
  swapLoaded,
  selectedChain,
  isBitcoinChain,
  isWalletConnected,
  userAddress,
  isWatchOnly,
  hasChainBalance,
  selectedToChain,
  fromTokenSelected,
  toTokenSelected,
  toAddressError,
  generalError,
  fromAmount,
  toAmount,
  userToAddress,
  isPristine,
  foundNickName,
  providers,
  selectedQuote,
  swapInfo,
  swapGasFeeQuote,
  txHash,
  bestSwapLoadingOpen,
  bestOfferSelectionOpen,
  swapInitiatedOpen,
  txProceeding,
  isSwapView,
  isCrossChain,
  parsedFromTokens,
  filteredToTokens,
  parsedToChains,
  isLoading,
  fromChains,
  defualtChainWhenNetworkUnsupported,
  blockedClass,
  toAddress,
  toLoadingState,
  fromLoadingState,
  fromAmountError,
  toAmountError,
  priceImpact,
  priceImpactTooHigh,
  isSwapDisabled,
  swapFeeError,
  isInternalWallet,
  handleMaxClick,
  switchGlobalNetwork,
  validateToAddress,
  proceedWithSwap,
  swapButton,
  cancelSwap,
  setToChain,
  connectWalletForSwap,
  bindWatchers,
  initialize,
} = useSwapModule()

// The token selects are `v-model`-bound but hold `null` when nothing is picked,
// which the child prop types as `undefined`.
const fromTokenModel = computed({
  get: () => fromTokenSelected.value ?? undefined,
  set: value => {
    fromTokenSelected.value = value ?? null
  },
})
const toTokenModel = computed({
  get: () => toTokenSelected.value ?? undefined,
  set: value => {
    toTokenSelected.value = value ?? null
  },
})

const title = computed(() =>
  isSwapView.value ? t('common.swap') : t('common.bridge'),
)
const description = computed(() =>
  isSwapView.value
    ? t('swap.within-network', {
        network: selectedChain.value?.nameLong || selectedChain.value?.name,
      })
    : t('swap.between-chains'),
)

// % presets of the from balance; Max keeps its internal-wallet gate (it
// reserves the fee, which only internal wallets can estimate up front).
const quickActions = computed(() => {
  if (!isWalletConnected.value || isWatchOnly.value || !fromTokenSelected.value)
    return []
  return isInternalWallet() ? [25, 50, 75, 100] : [25, 50, 75]
})

const ctaLabel = computed(() => {
  if (!Number(fromAmount.value)) return t('common.enter_amount')
  return isSwapView.value ? t('swap.review-swap') : t('swap.review-bridge')
})

bindWatchers()
onBeforeMount(initialize)
</script>
