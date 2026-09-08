<template>
  <div>
    <div
      :class="[
        'static w-full flex flex-col items-center justify-items-stretch gap-3',
      ]"
    >
      <div class="w-full max-w-[500px] relative">
        <rewards-small-banner location="small-banner-trade" />

        <!-- Header stays at full opacity when blocked: only the form below the
             unavailable card is dimmed. -->
        <div class="flex items-end justify-between mb-2 px-4">
          <div>
            <p class="font-bold text-s-28">{{ $t('trade.title') }}</p>
            <p class="text-info text-s-12 ml-1">
              {{ $t('trade.subtitle') }}
            </p>
          </div>
          <app-btn-text
            v-if="
              isTradingSessionOpen &&
              isCurrentNetworkSupported &&
              !isTradingRestrictedInRegion
            "
            class="text-primary text-s-14 pb-1"
            @click="clearValues"
            >{{ $t('common.clear_all') }}</app-btn-text
          >
        </div>
        <!-- Unavailable cards, one at a time by precedence: a region
             restriction can't be fixed by switching networks or waiting for
             the market, so it outranks both; an unsupported network outranks
             the market schedule. -->
        <!-- Market Closed -->
        <app-unavailable-card
          v-if="
            !isLoading &&
            marketStatus &&
            !isTradingSessionOpen &&
            isCurrentNetworkSupported &&
            !isTradingRestrictedInRegion
          "
          accent="primary"
          class="mb-3"
          :title="$t('trade.market_closed')"
          :description="marketStatus.reason?.message"
        >
          <template #action>
            <div class="text-center">
              <p
                v-if="countdownText"
                class="font-medium text-s-16 mb-1 tabular-nums"
              >
                {{ $t('trade.opens_in', { countdown: countdownText }) }}
              </p>
              <p class="text-grey-50 text-s-11 mt-1">
                {{ formatNextOpen(marketStatus.nextOpen) }}
              </p>
            </div>
          </template>
        </app-unavailable-card>

        <!-- Network Not Supported -->
        <app-unavailable-card
          v-if="
            !isLoading &&
            !isCurrentNetworkSupported &&
            !isTradingRestrictedInRegion
          "
          class="mb-3"
          :title="$t('trade.network_not_supported')"
          :description="
            $t('trade.trading_not_available_on', {
              network:
                selectedChain?.nameLong ||
                selectedChain?.name ||
                $t('common.network'),
            })
          "
        >
          <template #action>
            <div>
              <button
                v-for="chain in supportedChainsList"
                :key="chain.name"
                class="flex items-center gap-2 px-4 py-2 bg-primary-10 hover:bg-primary-20 font-medium text-s-14 rounded-full transition-colors shadow-button shadow-button-elevated mb-3 w-full"
                @click="switchToNetwork(chain)"
              >
                <app-token-logo
                  v-if="chain.icon"
                  :url="chain.icon"
                  :sumbol="chain.nameLong"
                  width="w-5"
                  height="h-5"
                />
                <span>{{ chain.nameLong || chain.name }}</span>
              </button>
            </div>
          </template>
        </app-unavailable-card>

        <!-- Trading Restricted -->
        <app-unavailable-card
          v-if="!isLoading && isTradingRestrictedInRegion"
          class="mb-3"
          :title="$t('trade.trading_not_available')"
          :description="$t('trade.trading_restricted')"
        >
          <template #icon>
            <div class="relative">
              <globe-asia-australia-icon
                class="w-12 h-12 text-black"
                aria-hidden="true"
              />
              <!--       Badge geometry is from the design: a 16px glyph, 4px of padding,
                and a 2px white ring. The ring is what separates the red disc
                from the dark globe behind it — drop it and the badge reads as a
                blob welded onto the globe's edge.
              -->

              <span
                class="absolute -top-2 -right-2 p-1 rounded-full bg-error border-2 border-white flex items-center justify-center"
              >
                <exclamation-circle-icon
                  class="w-4 h-4 text-white"
                  aria-hidden="true"
                />
              </span>
            </div>
          </template>
          <template #action>
            <app-learn-more-link
              :href="tradingRestrictedHelpUrl"
              :label="$t('trade.learn_more')"
            />
          </template>
        </app-unavailable-card>

        <div :class="['relative transition-all duration-300', blockedClass]">
          <div class="bg-mewBg rounded-20 p-4 mx-auto mb-2">
            <select-chain-for-app
              :can-store="false"
              :passed-chains="fromChains"
              :preselected-chain="selectedFromChain"
              @update:selected-chain="setFromChain"
            />
          </div>
          <!-- From Section -->
          <div
            v-if="supportedNetwork"
            class="bg-mewBg rounded-20 px-4 pb-4 pt-2 mx-auto"
          >
            <p class="text-s-12 mb-1 font-bold ml-3">
              {{ $t('trade.you_are_selling') }}
            </p>

            <div>
              <app-swap-enter-amount
                v-model:amount="fromAmount"
                v-model:selected-token="fromTokenModel"
                v-model:error="fromAmountError"
                @select:token="onFromTokenSelected"
                :external-loading="isLoading || !swapLoaded"
                :tokens="fromTokens"
                :show-balance="isWalletConnected"
                :network-name="selectedFromChain?.name"
                :is-pristine="isPristine"
                :disabled-tokens="disabledTokenAddresses"
                sort-context="trade"
                class="mt-2"
              >
                <!-- Percentage Buttons -->

                <template #header>
                  <div
                    v-if="isWalletConnected && fromTokenSelected"
                    class="flex justify-end gap-2 -mt-2 mr-1 mb-4"
                  >
                    <button
                      v-for="pct in [25, 50, 75, 100]"
                      :key="pct"
                      class="px-[10px] py-1 text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
                      :disabled="
                        pct === 100 &&
                        fromTokenSelected?.address === MAIN_TOKEN_CONTRACT
                      "
                      :class="{
                        'opacity-40 cursor-not-allowed':
                          pct === 100 &&
                          fromTokenSelected?.address === MAIN_TOKEN_CONTRACT,
                      }"
                      @click="setPercentageAmount(pct)"
                    >
                      {{ pct === 100 ? $t('common.max') : `${pct}%` }}
                    </button>
                  </div></template
                ></app-swap-enter-amount
              >
            </div>
          </div>

          <!-- Arrow Button -->
          <div class="relative h-0 z-10 flex justify-center items-center">
            <!-- <button
              :aria-label="$t('trade.swap_from_to')"
              :class="[
                'absolute right-[50%] top-1/2 bg-white rounded-xl h-10 w-10 flex justify-center items-center translate-x-1/2 -translate-y-1/4 shadow-button shadow-button-elevated transition-colors hoverBGWhite',
              ]"
              @click="swapTokens"
            >
              <arrows-up-down-icon class="w-5 h-5 text-primary" />
            </button> -->
            <!-- Arrow Button -->
            <div
              class="absolute right-[50%+20px] top-[calc(50%-11px)] bg-white rounded-xl h-10 w-10 flex justify-center items-center"
            >
              <arrow-down-icon class="w-5 h-5 text-primary" />
            </div>
          </div>

          <!-- To Section -->
          <div class="bg-mewBg rounded-20 px-4 pb-4 pt-2 mx-auto mt-2">
            <p class="text-s-12 mb-1 font-bold ml-3">
              {{ $t('trade.you_are_buying') }}
            </p>
            <app-swap-enter-amount
              v-model:amount="toAmount"
              v-model:selected-token="toTokenModel"
              v-model:error="toAmountError"
              @select:token="onToTokenSelected"
              :external-loading="isLoadingQuote"
              :show-balance="false"
              :tokens="toTokenSantized"
              :readonly="true"
              :network-name="selectedFromChain?.name"
              :is-estimate="true"
              :is-from-view="false"
              :is-pristine="isPristine"
              :disabled-tokens="disabledTokenAddresses"
              sort-context="trade"
              class="mt-2"
            />
          </div>
        </div>

        <!-- Market Closed Banner - Centered Overlay -->
        <div
          v-if="
            !isLoading &&
            marketStatus &&
            !isTradingSessionOpen &&
            isCurrentNetworkSupported &&
            !isTradingRestrictedInRegion
          "
          class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        >
          <div
            class="w-full max-w-[380px] px-3 py-5 bg-white border border-primary rounded-16 shadow-button shadow-button-elevated pointer-events-auto"
          >
            <div class="flex items-center gap-2 justify-center mb-2">
              <exclamation-circle-icon class="w-5 h-5 text-primary" />
              <p class="text-primary font-medium text-s-16">
                {{ $t('trade.market_closed') }}
              </p>
            </div>
            <p class="text-info text-s-14 text-center mb-4">
              {{ marketStatus.reason?.message }}
            </p>
            <div class="text-center">
              <p
                v-if="countdownText"
                class="font-medium text-s-16 mb-1 tabular-nums"
              >
                {{ $t('trade.opens_in', { countdown: countdownText }) }}
              </p>
              <p class="text-grey-50 text-s-11 mt-1">
                {{ formatNextOpen(marketStatus.nextOpen) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div
        v-if="!isLoading && displayGeneralError"
        :class="blockedClass"
        class="w-full max-w-[340px] p-4 bg-error-10 border border-error rounded-12 mb-2 max-h-[120px] overflow-y-auto"
      >
        <p class="text-error text-s-14 text-center break-words">
          {{ displayGeneralError }}
        </p>
      </div>

      <!-- Asset Not Tradeable Warning (only show when a session is open) -->
      <div
        v-if="
          !isLoading &&
          isTradingSessionOpen &&
          !isSelectedAssetTradeable &&
          nonTradeableAssetMessage
        "
        :class="blockedClass"
        class="w-full max-w-[340px] p-4 bg-warning-10 border border-warning rounded-12 mb-2"
      >
        <p class="text-warning text-s-14 text-center">
          <app-token-symbol
            :symbol="toTokenSelected?.symbol || 'UNKNOWN'"
            :address="
              toTokenSelected && selectedFromChain
                ? {
                    address: toTokenSelected.address,
                    network: selectedFromChain.name,
                  }
                : undefined
            "
            :has-gradient="false"
            class="inline-flex !text-s-14"
          />
          {{
            $t('trade.asset_not_tradable', { reason: nonTradeableAssetMessage })
          }}
        </p>
      </div>

      <div
        :class="[
          'w-full max-w-[340px] transition-all duration-300',
          blockedClass,
        ]"
      >
        <app-base-button
          v-if="!isWalletConnected || isWatchOnly"
          class="w-full"
          :disabled="!supportedNetwork"
          @click="connectWalletForTrade"
        >
          {{ $t('connect_wallet') }}
        </app-base-button>
        <div v-else>
          <transition name="fade" mode="out-in">
            <app-no-chain-balance
              v-if="!hasChainBalance"
              source="trade"
              class="mb-5 -mt-1"
            />
            <app-base-button
              v-else
              class="w-full"
              :disabled="isTradeDisabled || isApproving"
              @click="needsApproval ? handleApprove() : openTradeModal()"
            >
              <span
                v-if="isApproving"
                class="flex items-center justify-center gap-2"
              >
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ $t('trade.approving') }}
              </span>
              <span v-else>{{
                needsApproval ? $t('common.approve') : $t('trade.trade_button')
              }}</span>
            </app-base-button>
          </transition>
        </div>
      </div>
      <app-need-help
        :title="$t('trade.need_help')"
        help-link="https://help.myetherwallet.com/en/article/what-is-gas"
        class="mx-auto"
        :class="blockedClass"
      />
    </div>

    <!-- Trade Quote Modal -->
    <trade-quote-modal
      v-model:is-open="quoteModalOpen"
      :quote="currentQuote"
      :from-token="fromTokenSelected"
      :to-token="toTokenSelected"
      :from-amount="fromAmount"
      :loading="txProceeding"
      :chain="selectedFromChain"
      :is-cashout="isCashOutTradableAsset"
      @confirm="confirmTrade"
      @cancel="quoteModalOpen = false"
    />

    <!-- Trade Initiated Modal -->
    <trade-initiated-modal
      v-model:is-open="tradeInitiatedOpen"
      :order-hash="orderHash"
      :from-chain="selectedFromChain"
      :from-token="fromTokenSelected"
      :to-token="toTokenSelected"
      :from-amount="fromAmount"
      :to-amount="toAmount"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDownIcon, GlobeAsiaAustraliaIcon } from '@heroicons/vue/24/solid'
// 16px variant: the badge glyph is drawn at 16px in the design, and the 24px
// icon's strokes render muddy when scaled down that far.
import { ExclamationCircleIcon } from '@heroicons/vue/16/solid'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'

// Components
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import AppUnavailableCard from '@/components/AppUnavailableCard.vue'
import AppLearnMoreLink from '@/components/AppLearnMoreLink.vue'
import RewardsSmallBanner from '@/modules/rewards/RewardsSmallBanner.vue'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import AppSwapEnterAmount from '@/components/AppSwapEnterAmount.vue'
import TradeQuoteModal from './components/TradeQuoteModal.vue'
import TradeInitiatedModal from './components/TradeInitiatedModal.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppNoChainBalance from '@/components/AppNoChainBalance.vue'

import { useTradeModule } from './composables/useTradeModule'

const {
  selectedChain,
  swapLoaded,
  isWalletConnected,
  isWatchOnly,
  hasChainBalance,
  isTradingRestrictedInRegion,
  selectedFromChain,
  fromTokenSelected,
  toTokenSelected,
  fromAmount,
  toAmount,
  toAmountError,
  isPristine,
  marketStatus,
  isTradingSessionOpen,
  tradingRestrictedHelpUrl,
  countdownText,
  formatNextOpen,
  supportedNetwork,
  isCurrentNetworkSupported,
  supportedChainsList,
  fromChains,
  fromTokens,
  toTokenSantized,
  displayGeneralError,
  isLoading,
  isLoadingQuote,
  isSelectedAssetTradeable,
  isCashOutTradableAsset,
  nonTradeableAssetMessage,
  disabledTokenAddresses,
  fromAmountError,
  isTradeDisabled,
  currentQuote,
  needsApproval,
  isApproving,
  txProceeding,
  quoteModalOpen,
  tradeInitiatedOpen,
  orderHash,
  handleApprove,
  openTradeModal,
  confirmTrade,
  clearValues,
  setFromChain,
  switchToNetwork,
  setPercentageAmount,
  connectWalletForTrade,
  blockedClass,
  onFromTokenSelected,
  onToTokenSelected,
} = useTradeModule()

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
</script>
