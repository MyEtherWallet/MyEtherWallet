<template>
  <div
    class="flex flex-col -mx-4 -mb-6 sm:-mt-6 min-h-[calc(100%+24px)] sm:min-h-[calc(100%+48px)]"
  >
    <div class="flex flex-col gap-1 pt-8 px-5 w-full max-w-[540px] mx-auto">
      <p class="text-s-20 font-bold leading-[22px] tracking-[-0.4px]">
        {{ $t('trade.title') }}
      </p>
      <p class="text-s-12 text-info leading-[18px]">
        {{ $t('trade.subtitle') }}
      </p>
    </div>
    <div
      :class="[
        'static w-full flex flex-col items-center justify-items-stretch gap-3 p-5',
      ]"
    >
      <div class="w-full max-w-[500px] relative">
        <trade-market-status-pill
          :status="pillStatus"
          :until-text="untilText"
          :next-open-text="nextOpenText"
          :day-label="dayLabel"
          :marker-pct="markerPct"
          :time-label="timeLabel"
          :session-ranges="sessionRanges"
          class="mb-3"
        />

        <!-- Network Not Supported -->
        <app-unavailable-card
          v-if="!isLoading && !isCurrentNetworkSupported"
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
                  no-shadow
                />
                <span>{{ chain.nameLong || chain.name }}</span>
              </button>
            </div>
          </template>
        </app-unavailable-card>

        <!-- Trading Restricted -->
        <app-unavailable-card
          v-if="
            !isLoading &&
            isTradingRestrictedInRegion &&
            isCurrentNetworkSupported
          "
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
          <!-- Sell Section -->
          <trade-amount-card
            v-if="supportedNetwork"
            v-model:amount="fromAmount"
            v-model:selected-token="fromTokenModel"
            v-model:error="fromAmountError"
            side="sell"
            :external-loading="isLoading || !swapLoaded"
            :fiat-loading="isLoadingQuote"
            :balance-error="isInsufficientBalanceError"
            :tokens="fromTokens"
            :show-balance="isWalletConnected"
            :network-name="selectedFromChain?.name"
            :is-pristine="isPristine"
            :disabled-tokens="disabledTokenAddresses"
            :max-disabled="fromTokenSelected?.address === MAIN_TOKEN_CONTRACT"
            @percent="setPercentageAmount"
            @select:token="onFromTokenSelected"
          />

          <!-- Swap Direction Indicator -->
          <div class="relative h-0 z-10 flex justify-center">
            <div
              aria-hidden="true"
              class="absolute top-[6px] -translate-y-1/2 bg-bgBase border-4 border-white rounded-12 p-2.5"
            >
              <arrow-down-icon class="w-5 h-5" />
            </div>
          </div>

          <!-- Buy Section -->
          <trade-amount-card
            v-model:amount="toAmount"
            v-model:selected-token="toTokenModel"
            v-model:error="toAmountError"
            side="buy"
            :external-loading="isLoadingQuote"
            :tokens="toTokenSantized"
            :show-balance="isWalletConnected"
            :network-name="selectedFromChain?.name"
            :is-pristine="isPristine"
            :disabled-tokens="disabledTokenAddresses"
            class="mt-3"
            @select:token="onToTokenSelected"
          />
        </div>
      </div>

      <!-- Error Display -->
      <div
        v-if="!isLoading && displayGeneralError && !isPairUnavailable"
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
            <button
              v-else-if="isTradeDisabled"
              type="button"
              disabled
              class="w-full h-12 flex items-center justify-center rounded-24 bg-bgBase text-neutral-500 text-s-16 font-semibold leading-[22px] tracking-[-0.32px]"
            >
              {{ ctaDisabledLabel }}
            </button>
            <app-base-button
              v-else
              class="w-full !font-semibold !py-[13px] text-s-16 leading-[22px] tracking-[-0.32px]"
              @click="startTradeFlow"
            >
              {{ $t('trade.review_trade') }}
            </app-base-button>
          </transition>

          <div
            v-if="isPairUnavailable"
            class="flex items-start gap-3 w-full mt-3 px-4 py-3 rounded-12 bg-warning-subtle"
          >
            <exclamation-triangle-icon
              class="w-5 h-5 flex-none text-orange-600"
            />
            <p class="text-s-14 leading-[20px] text-black">
              {{ $t('trade.pair_unavailable.notice') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showHelpLink" class="mt-auto flex justify-center px-5 pb-5">
      <a
        href="https://help.myetherwallet.com/en/article/what-is-gas"
        target="_blank"
        rel="noopener noreferrer"
        class="flex h-10 items-center px-3 rounded-24 text-primary text-s-14 font-semibold tracking-[-0.28px] hoverNoBG"
      >
        {{ $t('trade.need_help') }}
      </a>
    </div>

    <!-- Trade Quote Modal -->
    <trade-review-modal
      v-model:is-open="reviewModalOpen"
      :quote="currentQuote"
      :from-token="fromTokenSelected"
      :to-token="toTokenSelected"
      :from-amount="fromAmount"
      :loading="txProceeding"
      :chain="selectedFromChain"
      :is-cashout="isCashOutTradableAsset"
      :expires-at="quoteExpiresAt"
      @confirm="confirmTrade"
      @cancel="reviewModalOpen = false"
      @expired="refreshExpiredQuote"
    />

    <!-- Trade Progress Modal -->
    <trade-progress-modal
      v-model:is-open="progressModalOpen"
      :order-hash="orderHash"
      :from-chain="selectedFromChain"
      :from-token="fromTokenSelected"
      :to-token="toTokenSelected"
    />

    <!-- Approve Spending Modal -->
    <trade-approve-spending-modal
      v-model:is-open="approvalIntroOpen"
      :token-symbol="fromTokenSelected?.symbol"
      :token-address="fromTokenSelected?.address"
      :chain-id="selectedFromChain?.chainID"
      @approve="confirmApproval"
    />

    <!-- Waiting Approval Modal -->
    <trade-waiting-approval-modal v-model:is-open="waitingApprovalOpen" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDownIcon } from '@heroicons/vue/24/solid'
import { GlobeAsiaAustraliaIcon } from '@heroicons/vue/24/solid'
import { ExclamationCircleIcon } from '@heroicons/vue/16/solid'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
import TradeAmountCard from './components/TradeAmountCard.vue'
import TradeMarketStatusPill from './components/TradeMarketStatusPill.vue'
import TradeReviewModal from './components/TradeReviewModal.vue'
import TradeProgressModal from './components/TradeProgressModal.vue'
import TradeWaitingApprovalModal from './components/TradeWaitingApprovalModal.vue'
import TradeApproveSpendingModal from './components/TradeApproveSpendingModal.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppNoChainBalance from '@/components/AppNoChainBalance.vue'
import AppUnavailableCard from '@/components/AppUnavailableCard.vue'
import AppLearnMoreLink from '@/components/AppLearnMoreLink.vue'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
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
  isTradingSessionOpen,
  tradingRestrictedHelpUrl,
  supportedNetwork,
  isCurrentNetworkSupported,
  supportedChainsList,
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
  txProceeding,
  approvalIntroOpen,
  waitingApprovalOpen,
  reviewModalOpen,
  progressModalOpen,
  quoteExpiresAt,
  refreshExpiredQuote,
  ctaDisabledLabel,
  showHelpLink,
  isInsufficientBalanceError,
  isPairUnavailable,
  pillStatus,
  untilText,
  nextOpenText,
  dayLabel,
  markerPct,
  timeLabel,
  sessionRanges,
  orderHash,
  startTradeFlow,
  confirmApproval,
  confirmTrade,
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
