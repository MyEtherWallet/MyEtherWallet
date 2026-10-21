<template>
  <div class="flex h-full flex-col sm:px-1 sm:pt-2">
    <perps-signing-prompt
      :show="showSigningPrompt"
      :message="signingMessage"
      :is-hardware-wallet="isHardwareWalletSigning"
      :is-waiting-for-confirm="isWaitingForConfirm"
      @confirm="confirmSign"
      @cancel="cancelSign"
    />
    <!-- The shared panel pads 16/24px; Figma side panels sit at 20/32 on desktop -->
    <div class="flex w-full flex-col gap-5">
      <AppContentGroup
        size="l"
        :title="$t('perps.trade.perpetuals')"
        :description="$t('perps.trade.powered-by')"
      />

      <!--
        Service outage notice. The panel opens without ViewPerps (and its
        PerpsStatusBanner) in the tree, so the outage needs saying here too — kept
        to a compact label since the panel is narrow.

        Suppressed while the region block shows, matching PerpsStatusBanner's
        precedence: the jurisdiction card already explains why the form is
        unusable, and a second notice would only compete with it.
      -->
      <div
        v-if="showStatusLabel"
        role="status"
        class="flex items-center gap-1.5 px-3 py-2 rounded-12 bg-background-warning-subtle"
      >
        <!-- Amber in the shell and icon only: `warning` on this tint is ~2:1,
             unreadable for copy, so the text stays near-black. -->
        <AppIcon
          name="exclamation-triangle"
          variant="filled"
          size="xxs"
          aria-hidden="true"
          class="shrink-0 text-text-warning"
        />
        <p class="text-s-12">{{ $t('perps.status.unavailable') }}</p>
      </div>

      <!-- Region-blocked: card explains why, form below stays visible but dimmed
           and inert so the panel reads as present-but-unusable. -->
      <app-unavailable-card
        v-if="isPerpsRestricted"
        :title="$t('perps.restricted.panel-title')"
        :description="$t('perps.restricted.panel-description')"
      >
        <template #icon>
          <div class="relative">
            <AppIcon
              name="globe-asia-australia"
              variant="filled"
              size="xxl"
              aria-hidden="true"
              class="text-black"
            />
            <!--
              Error-filled 28px circle behind a 20px WHITE solid icon: the icon's
              knocked-out "!" lets the red through, and the 4px the circle extends
              past the icon forms the red ring. Inverting these (white circle,
              red icon) loses the ring and reads as a solid red blob. Keep the
              two sizes 8px apart to preserve that ring width.
            -->
            <span
              class="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background-error flex items-center justify-center"
            >
              <AppIcon
                name="exclamation-circle"
                variant="filled"
                size="s"
                aria-hidden="true"
                class="text-white"
              />
            </span>
          </div>
        </template>
        <template #action>
          <app-learn-more-link
            :href="perpsHelpUrl"
            :label="$t('perps.restricted.learn-more')"
            @click="onRestrictedLearnMore"
          />
        </template>
      </app-unavailable-card>

      <!-- Active Trade Form -->
      <div
        class="flex flex-col gap-5"
        :class="blockedClass"
        :inert="isPerpsRestricted"
      >
        <!-- Market picker & current position info if open -->
        <div class="flex flex-col gap-3">
          <AppPicker
            size="l"
            surface="alternative"
            :title="displaySymbol"
            :description="marketName"
            :aria-label="$t('select_token.title')"
            @click="openTokenSelect"
          >
            <template #avatar>
              <app-token-logo
                :url="logoUrl"
                :symbol="displaySymbol"
                width="w-8"
                height="h-8"
                no-shadow
              />
            </template>
          </AppPicker>

          <div
            v-if="activePosition"
            class="flex flex-col gap-2 px-4 text-text-sm"
          >
            <div class="flex items-center justify-between gap-2">
              <p class="text-text-subtle">
                {{ $t('perps.trade.position-size') }}
              </p>
              <p class="text-label-sm">
                {{ formatUsd(positionNotionalValue) }}
              </p>
            </div>
            <div class="flex items-center justify-between gap-2">
              <p class="text-text-subtle">
                {{ $t('perps.trade.current-profit') }}
              </p>
              <p
                :class="
                  positionPnl >= 0 ? 'text-text-success' : 'text-text-error'
                "
                class="text-label-sm"
              >
                {{ formatPnl(String(positionPnl)) }}
                ({{ (positionRoe * 100).toFixed(2) }}%)
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <!-- Long / Short (or Add / Close with a position) + order type -->
          <div class="grid grid-cols-3 items-center gap-3">
            <AppSegmentedControl
              v-if="!activePosition"
              :model-value="orderSide"
              :items="orderSideItems"
              :label="$t('perps.confirm.side-label')"
              full-width
              class="col-span-2"
              @update:model-value="onClickOrderSide"
            />
            <AppSegmentedControl
              v-else
              :model-value="manageMode ?? 'add'"
              :items="manageModeItems"
              full-width
              class="col-span-2"
              @update:model-value="onClickManageMode"
            />
            <app-pop-up-menu
              :placeholder="orderTypeLabel"
              location="right"
              :class="{
                'opacity-0 pointer-events-none':
                  activePosition && manageMode === 'close',
              }"
            >
              <template #menu-button="{ toggleMenu }">
                <!-- Opens an inline menu, not a modal -->
                <AppPicker
                  size="s"
                  :title="orderTypeLabel"
                  :avatar="false"
                  aria-haspopup="listbox"
                  class="w-full justify-between"
                  @click="toggleMenu"
                />
              </template>
              <template #menu-content="{ toggleMenu }">
                <div
                  class="bg-white rounded-[20px] shadow-xl border border-border-default w-[260px] p-2 overflow-hidden"
                >
                  <div
                    class="flex items-center justify-between gap-3 px-4 py-3 rounded-[14px] cursor-pointer transition-colors"
                    :class="
                      orderType === 'market'
                        ? 'bg-background-brand-subtle'
                        : 'hover:bg-background-default'
                    "
                    @click="[setOrderType('market'), toggleMenu()]"
                  >
                    <div>
                      <p class="font-bold text-s-14">
                        {{ $t('perps.trade.market-order') }}
                      </p>
                      <p class="text-text-subtle text-s-12 mt-0.5">
                        {{ $t('perps.trade.market-order-description') }}
                      </p>
                    </div>
                    <AppIcon
                      name="check"
                      variant="filled"
                      size="s"
                      v-if="orderType === 'market'"
                      class="text-text-brand"
                    />

                    <span v-else class="w-4 mt-0.5" />
                  </div>
                  <div
                    class="flex items-center justify-between gap-3 px-4 py-3 mt-1 rounded-[14px] cursor-pointer transition-colors"
                    :class="
                      orderType === 'limit'
                        ? 'bg-background-brand-subtle'
                        : 'hover:bg-background-default'
                    "
                    @click="[setOrderType('limit'), toggleMenu()]"
                  >
                    <div>
                      <p class="font-bold text-s-14">
                        {{ $t('perps.trade.limit-order') }}
                      </p>
                      <p class="text-text-subtle text-s-12 mt-0.5">
                        {{ $t('perps.trade.limit-order-description') }}
                      </p>
                    </div>
                    <AppIcon
                      name="check"
                      variant="filled"
                      size="s"
                      v-if="orderType === 'limit'"
                      class="text-text-brand"
                    />
                    <span v-else class="w-4 mt-0.5" />
                  </div>
                </div>
              </template>
            </app-pop-up-menu>
          </div>

          <!-- Target Price (Limit Orders). The capture listener cleans the
               typed value before AppInput's v-model reads it. -->
          <AppInput
            v-if="orderType === 'limit'"
            v-model="limitPrice"
            :label="$t('perps.trade.target-price', { symbol: displaySymbol })"
            :error-message="limitPriceErrorMessage"
            @input.capture="onLimitPriceInput"
          />

          <!-- Margin (new position or add to it) -->
          <template v-if="!activePosition || manageMode === 'add'">
            <div class="flex flex-col gap-4 rounded-16 bg-background-default p-4">
              <div
                class="flex items-center justify-between gap-2 text-text-base text-text-subtle"
              >
                <p class="shrink-0">{{ $t('perps.trade.margin') }}</p>
                <p class="min-w-0 truncate">
                  {{
                    $t('perps.trade.available', {
                      amount: formatUsd(availableMargin),
                    })
                  }}
                </p>
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between gap-4">
                  <AppInputNaked
                    v-model="inputAmount"
                    :label="$t('perps.trade.margin-amount-label')"
                    :error="marginPrecisionError"
                    class="min-w-0 flex-1"
                  />
                  <AppPicker
                    size="s"
                    :title="`${manageMode === 'add' ? effectiveLeverage : leverage}×`"
                    :avatar="false"
                    :loading="isLoadingLeverage"
                    :disabled="isLoadingLeverage"
                    @click="openLeverage"
                  />
                </div>
                <transition name="fade" mode="out-in">
                  <AppInputFeedback
                    v-if="marginErrorMessage"
                    type="error"
                    :message="marginErrorMessage"
                    class="px-0!"
                  />
                </transition>
              </div>

              <div class="flex items-center gap-2">
                <div class="min-w-0 flex-1">
                  <AppSlider
                    :model-value="sliderValue"
                    :step="0.01"
                    :tone="sideTone"
                    :label="$t('perps.trade.size-percentage-label')"
                    @update:model-value="onSliderChange"
                  />
                </div>
                <p class="w-10 shrink-0 text-right text-label-sm">
                  {{ formatPercent(sliderValue) }}
                </p>
              </div>

              <hr class="border-t border-border-subtle" />
              <div class="flex flex-col gap-2 text-text-sm">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-text-subtle">
                    {{ $t('perps.trade.position-size') }}
                  </p>
                  <p class="text-label-sm">
                    {{ positionSizeUsd ? formatUsd(positionSizeUsd) : '$0.00' }}
                  </p>
                </div>
                <div
                  v-if="activePosition && manageMode === 'add'"
                  class="flex items-center justify-between gap-2"
                >
                  <p class="text-text-subtle">
                    {{ $t('perps.trade.new-size') }}
                  </p>
                  <p class="text-label-sm">
                    {{
                      submitDisabled
                        ? '--'
                        : formatUsd(
                            (positionNotionalValue || 0) +
                              (positionSizeUsd || 0),
                          )
                    }}
                  </p>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <p class="text-text-subtle">
                    {{ $t('perps.trade.est-liquidation') }}
                  </p>
                  <p class="text-label-sm">
                    {{
                      submitDisabled
                        ? '--'
                        : estimatedLiquidation
                          ? formatUsd(estimatedLiquidation)
                          : '$0.00'
                    }}
                  </p>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <p class="text-text-subtle">
                    {{ $t('perps.balance.margin-ratio-label') }}
                  </p>
                  <p class="text-label-sm">
                    {{
                      newMarginRatio !== null
                        ? `${(newMarginRatio * 100).toFixed(2)}%`
                        : '--'
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Take profit / stop loss: both open the same auto-close dialog -->
            <div class="flex gap-2">
              <AppPicker
                size="l"
                surface="alternative"
                :avatar="false"
                :title="$t('perps.trade.take-profit')"
                :description="
                  takeProfitPrice !== null
                    ? formatUsd(takeProfitPrice)
                    : undefined
                "
                class="h-14! min-w-0 flex-1"
                @click="openAutoCloseModal"
              />
              <AppPicker
                size="l"
                surface="alternative"
                :avatar="false"
                :title="$t('perps.trade.stop-loss')"
                :description="
                  stopLossPrice !== null ? formatUsd(stopLossPrice) : undefined
                "
                class="h-14! min-w-0 flex-1"
                @click="openAutoCloseModal"
              />
            </div>
          </template>

          <!-- Close part of the open position -->
          <template v-if="activePosition && manageMode === 'close'">
            <div class="flex flex-col gap-4 rounded-16 bg-background-default p-4">
              <p class="text-text-base text-text-subtle">
                {{ $t('perps.trade.amount-to-close') }}
              </p>
              <div class="flex flex-col gap-1">
                <AppInputNaked
                  :model-value="closeAmount"
                  :label="$t('perps.close.close-amount-label')"
                  :error="closeAmountPrecisionError"
                  @update:model-value="onCloseAmountChange"
                />
                <transition name="fade" mode="out-in">
                  <AppInputFeedback
                    v-if="closeAmountPrecisionError"
                    type="error"
                    :message="$t('perps.errors.amount-precision')"
                    class="px-0!"
                  />
                </transition>
              </div>

              <div class="flex items-center gap-2">
                <div class="min-w-0 flex-1">
                  <AppSlider
                    :model-value="closeSliderValue"
                    :step="0.01"
                    :tone="sideTone"
                    :label="$t('perps.close.close-percentage-label')"
                    @update:model-value="onCloseSliderChange"
                  />
                </div>
                <p class="w-10 shrink-0 text-right text-label-sm">
                  {{ formatPercent(closeSliderValue) }}
                </p>
              </div>

              <hr class="border-t border-border-subtle" />
              <div
                class="flex items-center justify-between gap-2 text-text-sm"
              >
                <p class="text-text-subtle">
                  {{ $t('perps.trade.new-size') }}
                </p>
                <p class="text-label-sm">
                  {{
                    formatUsd(
                      Math.max(
                        0,
                        positionNotionalValue - (parseFloat(closeAmount) || 0),
                      ),
                    )
                  }}
                </p>
              </div>
            </div>

            <!-- Close Error -->
            <AppInputFeedback
              v-if="closeError"
              type="error"
              :message="closeError"
              class="px-0!"
            />
          </template>
        </div>

        <!-- Submit Button -->
        <div
          v-if="!isSupportedNetwork"
          class="flex flex-col gap-3 text-center"
        >
          <p class="text-text-sm text-text-subtle">
            {{ $t('perps.trade.eth-only') }}
          </p>
          <app-base-button class="w-full" @click="onSwitchToEthereum">
            {{ $t('perps.trade.switch-to-ethereum') }}
          </app-base-button>
        </div>
        <!-- Stays enabled during an outage: connecting a wallet is a
             wallet-side action that doesn't touch the perps service, and it's
             useful across the rest of the app regardless. -->
        <app-base-button
          v-else-if="isWatchOnly"
          class="w-full"
          @click="connectWallet"
        >
          {{ t('connect_wallet') }}
        </app-base-button>
        <!-- Signing in hits the perps service, so during an outage it would
             only prompt for a signature the backend cannot redeem. The label
             at the top of the panel says why the button is dead. -->
        <app-base-button
          v-else-if="!token"
          class="w-full"
          :disabled="isServiceUnavailable"
          @click="login(PerpsEventSource.TRADE)"
        >
          {{ $t('perps.trade.sign-in') }}
        </app-base-button>
        <template v-else>
          <app-base-button
            v-if="!activePosition || manageMode === 'add'"
            :disabled="submitDisabled"
            :tone="sideTone"
            class="w-full min-w-0"
            @click="showConfirmation"
          >
            <span class="block truncate">{{ getMainBtnText }}</span>
          </app-base-button>
          <app-base-button
            v-if="activePosition && manageMode === 'close'"
            :tone="sideTone"
            :disabled="closeDisabled"
            class="w-full min-w-0"
            @click="showCloseConfirmation"
          >
            <span class="block truncate">{{ closeButtonLabel }}</span>
          </app-base-button>
        </template>
      </div>
    </div>

    <app-need-help
      :title="$t('perps.trade.need-help')"
      :help-link="perpsHelpUrl"
      variant="link"
      class="mt-auto self-center pt-5"
      :class="blockedClass"
    />

    <!-- Order Confirmation Dialog -->
    <perps-order-confirmation-dialog
      v-model:is-open="showConfirmModal"
      :order-side="orderSide"
      :order-type="orderType"
      :display-symbol="displaySymbol"
      :current-price="currentPrice"
      :limit-price="limitPrice"
      :input-amount="inputAmount"
      :leverage="manageMode === 'add' ? effectiveLeverage : leverage"
      :position-size-usd="positionSizeUsd"
      :order-size="orderSize"
      :estimated-liquidation="estimatedLiquidation"
      :take-profit-price="takeProfitPrice"
      :stop-loss-price="stopLossPrice"
      :order-error="orderError"
      :leverage-error="leverageError"
      :is-submitting="isSubmitting"
      :limit-price-out-of-tolerance="limitPriceOutOfTolerance"
      :maker-fee="activeContract?.makerFee"
      :taker-fee="activeContract?.takerFee"
      @confirm="confirmAndSubmitAndSetLeverage"
    />

    <!-- Close Confirmation Dialog -->
    <perps-close-confirmation-dialog
      v-model:is-open="showCloseConfirmModal"
      :display-symbol="displaySymbol"
      :direction="activePosition?.direction ?? 'long'"
      :current-price="currentPrice"
      :close-amount="closeAmount"
      :close-order-size="closeOrderSize"
      :close-slider-value="closeSliderValue"
      :position-pnl="positionPnl"
      :position-roe="positionRoe"
      :close-error="closeError"
      :is-closing="isClosing"
      @confirm="confirmAndClosePosition"
    />

    <!-- Market Selector Dialog -->
    <perps-select-market-dialog
      v-model:is-open="showMarketModal"
      v-model:search="marketSearch"
      v-model:active-filter="marketFilter"
      :sort-value="marketSortValue"
      :sort-direction="marketSortDirection"
      :sort-options="marketSortOptions"
      :selected-market-name="fullMarketName"
      :contracts="filteredMarketList"
      :filter-tabs="marketFilterTabs"
      :get-market-display-name="getMarketDisplayName"
      :get-market-leverage="getMarketLeverage"
      @set-sort="setMarketSort"
      @select="selectMarket"
    />

    <!-- Leverage Dialog -->
    <perps-select-leverage-dialog
      v-model:is-open="showLeverageModal"
      v-model="tempLeverage"
      :symbol="displaySymbol"
      :leverage-error="leverageError"
      :is-saving="isSavingLeverage"
      :max-leverage="marketMaxLeverage"
      :mode="manageMode === 'add' ? 'add' : 'create'"
      @save="onSaveLeverage"
    />

    <!-- Take Profit / Stop Loss Dialog -->
    <perps-take-profit-stop-loss-dialog
      v-model:is-open="showAutoCloseModal"
      v-model:take-profit-price="tempTakeProfitPrice"
      v-model:stop-loss-price="tempStopLossPrice"
      :display-symbol="displaySymbol"
      :current-price="currentPrice"
      :temp-projected-profit="tempProjectedProfit"
      :temp-projected-loss="tempProjectedLoss"
      :active-tp-pill="activeTpPill"
      :active-sl-pill="activeSlPill"
      :is-long="isTpSlLong"
      :max-short-take-profit-pct="maxShortTakeProfitPct"
      :take-profit-error="takeProfitErrorMessage"
      :stop-loss-error="stopLossErrorMessage"
      :has-edits="hasAutoCloseEdits"
      @clear-take-profit="clearTempTakeProfit"
      @clear-stop-loss="clearTempStopLoss"
      @set-take-profit-pct="setTakeProfitPct"
      @set-stop-loss-pct="setStopLossPct"
      @confirm="confirmAutoClose"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { formatUsd, formatPnl } from './utils/formatters'
import { getLogoUrl } from './utils/market'
import { usePerpsTradeForm } from './composables/usePerpsTradeForm'
import { usePerpsAuth } from './composables/usePerpsAuth'
import { usePerpsRestriction } from './composables/usePerpsRestriction'
import { usePerpsStatus } from './composables/usePerpsStatus'
import { useBlockedContent } from '@/composables/useBlockedContent'
import PerpsSigningPrompt from './components/PerpsSigningPrompt.vue'
import AppUnavailableCard from '@/components/AppUnavailableCard.vue'
import AppLearnMoreLink from '@/components/AppLearnMoreLink.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppPicker from '@/components/picker/AppPicker.vue'
import AppSegmentedControl from '@/components/segmented_control/AppSegmentedControl.vue'
import type { SegmentItem } from '@/components/segmented_control/types'
import AppSlider from '@/components/slider/AppSlider.vue'
import AppInput from '@/components/AppInput.vue'
import AppInputNaked from '@/components/input_naked/AppInputNaked.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import PerpsSelectLeverageDialog from './components/PerpsSelectLeverageDialog.vue'
import PerpsSelectMarketDialog from './components/PerpsSelectMarketDialog.vue'
import PerpsOrderConfirmationDialog from './components/PerpsOrderConfirmationDialog.vue'
import PerpsCloseConfirmationDialog from './components/PerpsCloseConfirmationDialog.vue'
import PerpsTakeProfitStopLossDialog from './components/PerpsTakeProfitStopLossDialog.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useAccessStore } from '@/stores/accessStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppInputFeedback from '@/components/input_feedback/AppInputFeedback.vue'
import {
  analytics,
  ConnectWalletEvent,
  PerpsEventSource,
  PerpsManageEvent,
  PerpsEventLocation,
  PerpsNewPositionAction,
  PerpsRestrictedEvent,
} from '@/analytics'

const walletStore = useWalletStore()
const { isWatchOnly } = storeToRefs(walletStore)
const {
  showSigningPrompt,
  signingMessage,
  isHardwareWalletSigning,
  isWaitingForConfirm,
  confirmSign,
  cancelSign,
} = usePerpsAuth()
const { isPerpsRestricted, perpsHelpUrl } = usePerpsRestriction()
const { blockedClass } = useBlockedContent(isPerpsRestricted)
// Also keeps `/status` polling alive while the trade panel is mounted, which is
// what gates every other perps request during an outage. The panel opens without
// ViewPerps (and its banner) in the tree, so without this the panel would keep
// firing orders and quotes at a service reporting 500.
const { isServiceUnavailable } = usePerpsStatus()
// Restricted outranks the outage: see the template comment on the label.
const showStatusLabel = computed(
  () => isServiceUnavailable.value && !isPerpsRestricted.value,
)
const accessStore = useAccessStore()
const globalStore = useGlobalStore()
const { selectedNetwork } = storeToRefs(globalStore)
const toastStore = useToastStore()
const isSupportedNetwork = computed(() => selectedNetwork.value === 'ETHEREUM')
const { t } = useI18n()

const onRestrictedLearnMore = () => {
  void analytics.trackPerpsRestrictedEvent(PerpsRestrictedEvent.LEARN_MORE, {
    source: PerpsEventSource.TRADE,
  })
}

const onSwitchToEthereum = () => {
  globalStore.setSelectedNetwork('ETHEREUM')
  toastStore.addToastMessage({
    text: t('perps.toast.switched-to-ethereum-title'),
    textSecondary: t('perps.toast.switched-to-ethereum-detail'),
    type: ToastType.Info,
  })
}

const { setSelectedTradeManageMode } = useWalletMenuStore()
const connectWallet = () => {
  analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
    source: PerpsEventSource.TRADE,
  })
  accessStore.openAccessDialog()
}

const onCloseAmountChange = async (value: string) => {
  closeAmount.value = value
  const val = parseFloat(value)
  const maxVal = positionNotionalValue.value
  if (isNaN(val) || val <= 0) {
    closeAmount.value = ''
    closeSliderValue.value = 0
    return
  }
  if (val > maxVal) {
    // Let the typed value render first: clamping straight back to the same max
    // wouldn't change the model, and the input would keep the typed amount.
    await nextTick()
    closeAmount.value = maxVal.toFixed(2)
    closeSliderValue.value = 100
    return
  }
  closeSliderValue.value = maxVal > 0 ? (val / maxVal) * 100 : 0
}

const onCloseSliderChange = (value: number) => {
  closeSliderValue.value = value
  onCloseSliderInput()
}

const onSliderChange = (value: number) => {
  sliderValue.value = value
  onSliderInput()
}

const confirmAndSubmitAndSetLeverage = async () => {
  // In add mode `effectiveLeverage` is the authoritative, user-staged leverage
  // (what the panel and confirm modal show). `tempLeverage` is only the
  // leverage dialog's slider draft and can drift from the singleton via its
  // own watcher, so sync it to `effectiveLeverage` before saving to avoid
  // sending a stale value to setLeverage (MEW-1913).
  if (
    manageMode.value === 'add' &&
    effectiveLeverage.value !== leverage.value
  ) {
    tempLeverage.value = effectiveLeverage.value
    await saveLeverage()
    if (!leverageError.value) await confirmAndSubmitOrder()
  } else {
    await confirmAndSubmitOrder()
  }
}

const onLimitPriceInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  // Allow only digits and a single decimal point
  let val = target.value.replace(/[^0-9.]/g, '')
  const parts = val.split('.')
  if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('')
  target.value = val
  limitPrice.value = val
  activeLimitPill.value = null
}

const {
  // Auth
  token,
  login,
  // Market info
  displaySymbol,
  currentPrice,
  // Order form
  orderSide,
  orderSideButtons,
  orderType,
  inputAmount,
  leverage,
  effectiveLeverage,
  setStagedLeverage,
  sliderValue,
  positionSizeUsd,
  minOrderAmount,
  estimatedLiquidation,
  orderSize,
  availableMargin,
  setOrderSide,
  // Position
  activePosition,
  positionNotionalValue,
  positionPnl,
  positionRoe,
  manageMode,
  // Close
  closeAmount,
  closeSliderValue,
  closeDisabled,
  closeOrderSize,
  closeButtonLabel,
  closeError,
  isClosing,
  showCloseConfirmModal,
  onCloseSliderInput,
  confirmAndClosePosition,
  showCloseConfirmation,
  // Auto Close
  showAutoCloseModal,
  takeProfitPrice,
  stopLossPrice,
  tempProjectedProfit,
  tempProjectedLoss,
  tempTakeProfitPrice,
  tempStopLossPrice,
  activeTpPill,
  activeSlPill,
  isTpSlLong,
  maxShortTakeProfitPct,
  openAutoCloseModal,
  setTakeProfitPct,
  setStopLossPct,
  clearTempTakeProfit,
  clearTempStopLoss,
  confirmAutoClose,
  hasAutoCloseEdits,
  // Submit
  isSubmitting,
  submitDisabled,
  submitButtonLabel,
  limitPriceOutOfTolerance,
  limitPricePrecisionError,
  marginPrecisionError,
  closeAmountPrecisionError,
  takeProfitErrorMessage,
  stopLossErrorMessage,
  quoteDecimals,
  orderError,
  showConfirmModal,
  showConfirmation,
  confirmAndSubmitOrder,
  newMarginRatio,
  // Slider
  onSliderInput,
  setOrderType,
  limitPrice,
  activeLimitPill,
  // Market selector
  showMarketModal,
  marketSearch,
  marketFilter,
  marketSortValue,
  marketSortDirection,
  marketSortOptions,
  setMarketSort,
  marketFilterTabs,
  filteredMarketList,
  fullMarketName,
  contracts,
  getMarketDisplayName,
  getMarketLeverage,
  openTokenSelect,
  selectMarket,
  // Leverage
  showLeverageModal,
  tempLeverage,
  isSavingLeverage,
  isLoadingLeverage,
  leverageError,
  openLeverageModal,
  saveLeverage,
  closeLeverageModal,
  marketMaxLeverage,
} = usePerpsTradeForm()

const onClickOrderSide = (side: 'buy' | 'sell') => {
  void analytics.trackPerpsNewPositionEvent(PerpsManageEvent.NEW_POSITION, {
    assetName: fullMarketName.value,
    location: PerpsEventLocation.TRADE,
    action:
      side === 'buy'
        ? PerpsNewPositionAction.LONG
        : PerpsNewPositionAction.SHORT,
  })
  setOrderSide(side)
}

const onClickManageMode = (mode: 'add' | 'close') => {
  void analytics.trackPerpsManageEvent(
    mode === 'add'
      ? PerpsManageEvent.ADD_TO_POSITION
      : PerpsManageEvent.CLOSE_POSITION,
    {
      assetName: fullMarketName.value,
      location: PerpsEventLocation.TRADE,
    },
  )
  setSelectedTradeManageMode(mode)
}

// 'add' mode doesn't persist via the API on save — it stages a leverage (in
// the composable) for the next add order so sizing/liquidation reflect it while
// surviving the fetchLeverage/position-sync writes to the singleton. Non-add
// modes go through saveLeverage(), which updates the `leverage` singleton (and
// clears any staged value via the composable's watcher).
const onSaveLeverage = () => {
  if (manageMode.value === 'add') {
    setStagedLeverage(tempLeverage.value)
    closeLeverageModal()
  } else {
    saveLeverage()
  }
}

// Seed tempLeverage from effectiveLeverage in add mode (which tracks the open
// position's leverage and any staged-but-unapplied change) instead of the
// singleton. The composable's openLeverageModal seeds from the singleton,
// which would jump the slider back to the user's preferred leverage and
// drop a staged add-mode value.
const openLeverage = () => {
  if (manageMode.value === 'add') {
    tempLeverage.value = Math.min(
      effectiveLeverage.value,
      marketMaxLeverage.value,
    )
    leverageError.value = ''
    showLeverageModal.value = true
  } else {
    openLeverageModal()
  }
}

// Reset tempLeverage on dismiss so the confirm modal and submit-path leverage
// check don't fire on an abandoned slider value.
watch(
  () => showLeverageModal.value,
  val => {
    if (!val) tempLeverage.value = effectiveLeverage.value
  },
)

const activeContract = computed(() =>
  contracts.value.find(c => c.market === fullMarketName.value),
)

const logoUrl = computed(() => getLogoUrl(displaySymbol.value))
const marketName = computed(() =>
  activeContract.value ? getMarketDisplayName(activeContract.value) : '',
)

const sideTone = computed(() =>
  orderSide.value === 'buy' ? 'success' : 'danger',
)
const orderSideItems = computed<SegmentItem<'buy' | 'sell'>[]>(() =>
  orderSideButtons.value.map(({ label, value }) => ({
    label,
    value,
    tone: value === 'buy' ? 'success' : 'danger',
  })),
)
// Add / Close share the open position's side colour
const manageModeItems = computed<SegmentItem<'add' | 'close'>[]>(() => [
  { label: t('perps.trade.tab-add'), value: 'add', tone: sideTone.value },
  { label: t('perps.trade.tab-close'), value: 'close', tone: sideTone.value },
])
const orderTypeLabel = computed(() =>
  orderType.value === 'market'
    ? t('perps.trade.market')
    : t('perps.trade.limit'),
)

const formatPercent = (value: number) => `${+Number(value).toFixed(1)}%`

const marginErrorMessage = computed(() => {
  if (marginPrecisionError.value) return t('perps.errors.margin-precision')
  const amount = Number(inputAmount.value || '0')
  if (isNaN(amount)) return t('perps.errors.invalid-amount')
  if (amount > availableMargin.value)
    return t('perps.errors.insufficient-margin')
  if (amount > 0 && positionSizeUsd.value < minOrderAmount.value)
    return t('perps.errors.min-amount', {
      amount: formatUsd(minOrderAmount.value),
    })
  return ''
})

const limitPriceErrorMessage = computed(() => {
  const price = parseFloat(limitPrice.value)
  if (!limitPrice.value || price === 0) return t('perps.errors.target-required')
  if (isNaN(price) || price < 0) return t('perps.errors.invalid-price')
  if (price >= 10000000)
    return t('perps.errors.price-max', { max: '$10,000,000' })
  if (limitPricePrecisionError.value)
    return quoteDecimals.value === 0
      ? t('perps.errors.price-whole')
      : t('perps.errors.price-precision-decimals', {
          decimals: quoteDecimals.value,
          count: quoteDecimals.value,
        })
  if (limitPriceOutOfTolerance.value) return t('perps.errors.out-of-tolerance')
  return undefined
})

const getMainBtnText = computed(() => {
  if (manageMode.value === 'close') {
    return closeButtonLabel.value
  }
  return submitButtonLabel.value
})
</script>
<style scoped>
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: var(--size-4);
  height: var(--size-4);
  border-radius: 50%;
  background: var(--thumb-color, var(--color-background-brand));
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.slider-input::-moz-range-thumb {
  width: var(--size-4);
  height: var(--size-4);
  border-radius: 50%;
  background: var(--thumb-color, var(--color-background-brand));
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
