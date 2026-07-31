<template>
  <div>
    <div
      :class="[
        'static w-full flex flex-col items-center justify-items-stretch gap-3',
      ]"
    >
      <div class="w-full max-w-[500px] relative">
        <!-- <rewards-small-banner
          :class="blurClass"
          :location="'small-banner-swap'"
        /> -->

        <div :class="['flex items-end justify-between mb-2 px-4', blurClass]">
          <p class="font-bold text-s-28">
            {{ isSwapView ? $t('common.swap') : $t('common.bridge') }}
          </p>
          <app-btn-text
            v-if="supportedNetwork"
            class="text-primary text-s-14 pb-1"
            @click="clearValues"
            >{{ $t('common.clear_all') }}</app-btn-text
          >
        </div>
        <div :class="['relative transition-all duration-300', blurClass]">
          <!-- From Section -->
          <div class="bg-mewBg rounded-20 px-4 pb-4 pt-2 mx-auto">
            <p
              class="text-s-12 font-bold ml-3"
              :class="{ 'mb-1': !isSwapView }"
            >
              {{ $t('swap.you-are-selling') }}
            </p>
            <select-chain-for-app
              v-if="!isSwapView"
              :passed-chains="fromChains"
            />
            <app-swap-enter-amount
              v-model:amount="fromAmount"
              v-model:selected-token="fromTokenModel"
              v-model:error="fromAmountError"
              :network-name="selectedChain?.name"
              :external-loading="fromLoadingState"
              :tokens="parsedFromTokens"
              :show-balance="isWalletConnected"
              :is-pristine="isPristine"
              sort-context="swap"
              :class="isSwapView ? 'mt-1' : 'mt-3'"
            >
              <template #balance-action>
                <div
                  v-if="
                    isWalletConnected &&
                    !isWatchOnly &&
                    fromTokenSelected &&
                    isInternalWallet()
                  "
                >
                  <button
                    type="button"
                    class="px-2.5 py-0.5 text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
                    @click="handleMaxClick"
                  >
                    {{ $t('common.max') }}
                  </button>
                </div>
              </template>
            </app-swap-enter-amount>
          </div>

          <!-- Arrow Button -->
          <div class="relative h-0 z-10 flex justify-center items-center">
            <div
              class="absolute right-[50%+20px] top-[calc(50%-11px)] bg-white rounded-xl h-10 w-10 flex justify-center items-center"
            >
              <arrow-down-icon class="w-5 h-5 text-primary" />
            </div>
          </div>

          <!-- To Section -->
          <div class="bg-mewBg rounded-20 px-4 pb-4 pt-2 mx-auto mt-2">
            <p class="text-s-12 font-bold ml-3">
              {{ $t('swap.you-are-buying') }}
            </p>
            <select-chain-for-app
              :can-store="false"
              :passed-chains="parsedToChains"
              :preselected-chain="selectedToChain"
              :class="{
                hidden:
                  isSwapView &&
                  selectedChain?.name === selectedToChain?.name &&
                  !isBitcoinChain,
              }"
              @update:selected-chain="setToChain"
            />
            <app-swap-enter-amount
              v-model:amount="toAmount"
              v-model:selected-token="toTokenModel"
              v-model:error="toAmountError"
              :external-loading="toLoadingState"
              :show-balance="false"
              :tokens="filteredToTokens"
              :readonly="true"
              :is-estimate="true"
              :is-from-view="false"
              :network-name="selectedToChain?.name"
              :is-pristine="isPristine"
              sort-context="swap"
              :class="
                isSwapView &&
                selectedChain?.name === selectedToChain?.name &&
                !isBitcoinChain
                  ? 'mt-1'
                  : 'mt-3'
              "
            />
            <div
              class="pt-4"
              v-if="(!isSwapView && isCrossChain) || isBitcoinChain"
            ></div>
            <address-input
              v-if="(!isSwapView && isCrossChain) || isBitcoinChain"
              v-model:adr-input="userToAddress"
              :resolved-address="toAddress"
              :found-nick-name="foundNickName"
              :address-error-messages="toAddressError"
              :network="selectedToChain"
              :is-pristine="isPristine"
              @validate:address="validateToAddress"
            />
          </div>
        </div>

        <!-- Network Not Supported Banner - Centered Overlay -->
        <div
          v-if="swapLoaded && !supportedNetwork"
          class="absolute flex top-[100px] z-20 pointer-events-none"
        >
          <div
            class="w-full max-w-[380px] px-5 py-5 bg-white border border-warning rounded-16 shadow-button shadow-button-elevated pointer-events-auto"
          >
            <div class="flex items-center gap-2 justify-center mb-2">
              <exclamation-circle-icon class="w-5 h-5 text-warning" />
              <p class="text-warning font-medium text-s-16">
                {{ $t('swap.network-not-supported') }}
              </p>
            </div>
            <p class="text-info text-s-14 text-center mb-4">
              {{
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
              }}
            </p>

            <select-chain-for-app
              :passed-chains="fromChains"
              :preselected-chain="defualtChainWhenNetworkUnsupported"
              :can-store="false"
              id="SWAP:NetworkNotSupported"
              class="mt-4"
              @update:selected-chain="switchGlobalNetwork"
            />
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div
        v-if="!isLoading && priceImpactTooHigh"
        :class="blurClass"
        class="w-full max-w-[340px] p-4 bg-error-10 border border-error rounded-12 mb-2"
      >
        <p class="text-error text-s-14 text-center">
          {{
            t('swap.price-impact-too-high', { percent: priceImpact.toFixed(2) })
          }}
        </p>
      </div>
      <div
        v-if="!isLoading && generalError"
        :class="blurClass"
        class="w-full max-w-[340px] p-4 bg-error-10 border border-error rounded-12 mb-2"
      >
        <p class="text-error text-s-14 text-center">
          {{ generalError }}
        </p>
      </div>
      <app-base-button
        v-if="!isWalletConnected || isWatchOnly"
        :class="['mx-auto w-full max-w-[340px]', blurClass]"
        @click="connectWalletForSwap"
      >
        {{ t('connect_wallet') }}</app-base-button
      >
      <div v-else :class="['w-full max-w-[340px]', blurClass]">
        <transition name="fade" mode="out-in">
          <app-no-chain-balance
            v-if="!hasChainBalance"
            :source="isSwapView ? 'swap' : 'bridge'"
            class="mb-5 -mt-1"
          />
          <app-base-button
            v-else
            :disabled="isSwapDisabled"
            @click="swapButton"
            class="w-full"
          >
            {{
              isSwapView ? $t('common.swap') : $t('common.bridge')
            }}</app-base-button
          >
        </transition>
      </div>

      <app-need-help
        :title="t('swap.need-help-swapping')"
        help-link="https://help.myetherwallet.com/en/article/what-is-gas"
        class="mx-auto"
        :class="blurClass"
      />
    </div>
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
import { ArrowDownIcon, ExclamationCircleIcon } from '@heroicons/vue/24/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
import BestOfferModal from './components/BestOfferModal.vue'
import SwapOfferModal from './components/SwapOfferModal.vue'
import SwapInitiatedModal from './components/SwapInitiatedModal.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import AppSwapEnterAmount from '@/components/AppSwapEnterAmount.vue'
import AddressInput from '@/components/address_book/AddressInput.vue'
import AppNoChainBalance from '@/components/AppNoChainBalance.vue'
import { useI18n } from 'vue-i18n'
import { useSwapModule } from './composables/useSwapModule'
import { computed, onBeforeMount } from 'vue'

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
  blurClass,
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
  clearValues,
  validateToAddress,
  proceedWithSwap,
  swapButton,
  cancelSwap,
  setToChain,
  connectWalletForSwap,
  bindWatchers,
  initialize,
} = useSwapModule()

const fromTokenModel = computed({
  get: () => fromTokenSelected.value ?? undefined,
  set: value => { fromTokenSelected.value = value ?? null },
})
const toTokenModel = computed({
  get: () => toTokenSelected.value ?? undefined,
  set: value => { toTokenSelected.value = value ?? null },
})

bindWatchers()
onBeforeMount(initialize)
</script>
