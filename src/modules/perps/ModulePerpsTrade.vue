<template>
  <div class="w-full max-w-[500px] mx-auto relative h-full flex flex-col pb-6">
    <perps-signing-prompt
      :show="showSigningPrompt"
      :message="signingMessage"
      :is-hardware-wallet="isHardwareWalletSigning"
      :is-waiting-for-confirm="isWaitingForConfirm"
      @confirm="confirmSign"
      @cancel="cancelSign"
    />
    <!-- Header: Asset Info -->
    <div class="flex items-center justify-between mb-2 px-4 -mt-2">
      <div>
        <p class="font-bold text-s-28">{{ $t('perps.trade.perpetuals') }}</p>
        <p class="text-info text-s-12 ml-1">
          {{ $t('perps.trade.powered-by') }}
        </p>
      </div>
    </div>

    <!-- Active Trade Form -->
    <div class="flex flex-col pb-6">
      <!-- Scrollable content -->
      <div class="bg-mewBg rounded-20 px-4 pb-4 pt-4 flex flex-col gap-3">
        <!-- Asset Selector & Price & current Position Info if open -->
        <div>
          <!-- Token Selector -->
          <button
            :class="[
              isLoading || !selectedToken
                ? 'bg-grey-10 animate-pulse'
                : 'bg-white hoverBGWhite py-2 px-4 rounded-20 w-full shadow-button shadow-button-elevated transition-all',
              'rounded-20 px-1 transition-colors w-full flex items-center justify-between px-4 py-2',
            ]"
            type="button"
            @click="openTokenSelect"
            :aria-label="$t('select_token.title')"
            :disabled="isLoading || !selectedToken"
          >
            <div
              v-if="!isLoading && selectedToken"
              class="flex items-center justify-start"
            >
              <app-token-logo
                :url="selectedToken.logo_url"
                :alt="selectedToken.symbol"
                class="mr-2"
                :is-stock="selectedToken.ondo !== undefined"
              />
              <div>
                <app-token-symbol
                  :symbol="selectedToken.symbol"
                  :is-stock="selectedToken.ondo !== undefined"
                  class="!font-bold text-left"
                />
                <p class="text-info text-s-12">
                  {{ formatUsd(currentPrice) }}
                  <span
                    :class="priceChange >= 0 ? 'text-success' : 'text-error'"
                    class="pl-1"
                  >
                    ({{ priceChange.toFixed(2) }}%)
                  </span>
                </p>
              </div>
            </div>
            <chevron-down-icon
              v-if="!isLoading"
              class="text-info w-4 h-4 ml-4"
            />
          </button>

          <!-- Position Info -->
          <div v-if="activePosition" class="px-2 mt-3 flex flex-col gap-1">
            <div class="flex justify-between text-s-14 font-medium">
              <p class="text-info text-s-12">
                {{ $t('perps.trade.position-size') }}
              </p>
              <p class="font-medium">
                {{ formatUsd(positionNotionalValue) }}
              </p>
            </div>
            <div class="flex justify-between text-s-14 font-medium">
              <p class="text-info text-s-12">
                {{ $t('perps.trade.current-profit') }}
              </p>
              <p
                :class="positionPnl >= 0 ? 'text-success' : 'text-error'"
                class="font-medium"
              >
                {{ formatPnl(String(positionPnl)) }}
                <span class="text-s-12"
                  >({{ (positionRoe * 100).toFixed(2) }}%)</span
                >
              </p>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div
            v-if="!activePosition"
            class="flex w-full gap-1 bg-white p-1 rounded-full shadow-button shadow-button-elevated"
          >
            <button
              v-for="side in orderSideButtons"
              :key="side.value"
              class="flex items-center justify-center gap-1.5 px-5 py-2 text-s-14 font-bold transition-all duration-200 rounded-20 p-4 w-full"
              :class="[
                orderSide === side.value
                  ? 'text-white  shadow-button shadow-button-elevated'
                  : ' hoverNoBG ',
                {
                  'bg-success':
                    orderSide === side.value && side.value === 'buy',
                  'bg-error': orderSide === side.value && side.value === 'sell',
                },
              ]"
              @click="setOrderSide(side.value)"
            >
              {{ side.label }}
              <arrow-trending-up-icon
                v-if="side.value === 'buy'"
                class="w-4 h-4"
                :class="orderSide === side.value ? 'text-white' : 'text-black'"
              />
              <arrow-trending-down-icon
                v-if="side.value === 'sell'"
                class="w-4 h-4"
                :class="orderSide === side.value ? 'text-white' : 'text-black'"
              />
            </button>
          </div>
          <div
            v-else
            class="flex w-full gap-1 bg-white p-1 rounded-full shadow-button shadow-button-elevated"
          >
            <button
              class="flex items-center justify-center gap-1.5 px-5 py-2 text-s-14 font-bold transition-all duration-200 rounded-20 w-full"
              :class="[
                manageMode === 'add'
                  ? ' text-white shadow-button shadow-button-elevated'
                  : 'hoverNoBG',
                {
                  'bg-success': orderSide === 'buy' && manageMode === 'add',
                  'bg-error': orderSide === 'sell' && manageMode === 'add',
                },
              ]"
              @click="setSelectedTradeManageMode('add')"
            >
              {{ $t('perps.trade.tab-add') }}
            </button>
            <button
              class="flex items-center justify-center gap-1.5 px-5 py-2 text-s-14 font-bold transition-all duration-200 rounded-20 w-full"
              :class="[
                manageMode === 'close'
                  ? 'text-white shadow-button shadow-button-elevated'
                  : 'hoverNoBG',
                {
                  'bg-success': orderSide === 'buy' && manageMode === 'close',
                  'bg-error': orderSide === 'sell' && manageMode === 'close',
                },
              ]"
              @click="setSelectedTradeManageMode('close')"
            >
              {{ $t('perps.trade.tab-close') }}
            </button>
          </div>
          <app-pop-up-menu
            :placeholder="
              orderType === 'market'
                ? $t('perps.trade.market')
                : $t('perps.trade.limit')
            "
            location="right"
            class="ml-3"
            :class="{
              'opacity-0 pointer-events-none':
                activePosition && manageMode === 'close',
            }"
          >
            <template #menu-content="{ toggleMenu }">
              <div
                class="bg-white rounded-[20px] shadow-xl border border-[#e5e7eb] w-[260px] p-2 overflow-hidden"
              >
                <div
                  class="flex items-center justify-between gap-3 px-4 py-3 rounded-[14px] cursor-pointer transition-colors"
                  :class="
                    orderType === 'market' ? 'bg-mewBg' : 'hover:bg-[#f8f9fb]'
                  "
                  @click="[setOrderType('market'), toggleMenu()]"
                >
                  <div>
                    <p class="font-bold text-s-14">
                      {{ $t('perps.trade.market-order') }}
                    </p>
                    <p class="text-info text-s-12 mt-0.5">
                      {{ $t('perps.trade.market-order-description') }}
                    </p>
                  </div>
                  <check-icon
                    v-if="orderType === 'market'"
                    class="text-primary h-5 w-5"
                  ></check-icon>

                  <span v-else class="w-4 mt-0.5" />
                </div>
                <div
                  class="flex items-center justify-between gap-3 px-4 py-3 mt-1 rounded-[14px] cursor-pointer transition-colors"
                  :class="
                    orderType === 'limit' ? 'bg-mewBg' : 'hover:bg-[#f8f9fb]'
                  "
                  @click="[setOrderType('limit'), toggleMenu()]"
                >
                  <div>
                    <p class="font-bold text-s-14">
                      {{ $t('perps.trade.limit-order') }}
                    </p>
                    <p class="text-info text-s-12 mt-0.5">
                      {{ $t('perps.trade.limit-order-description') }}
                    </p>
                  </div>
                  <check-icon
                    v-if="orderType === 'limit'"
                    class="text-primary h-5 w-5"
                  ></check-icon>
                  <span v-else class="w-4 mt-0.5" />
                </div>
              </div>
            </template>
          </app-pop-up-menu>
        </div>
        <!-- Target Price (Limit Orders) -->
        <div
          v-if="orderType === 'limit'"
          class="w-full rounded-20 shadow-button shadow-button-elevated bg-white px-4 py-3 transition-all flex flex-col justify-between"
        >
          <p class="font-semibold text-s-12 text-info">
            {{ $t('perps.trade.target-price', { symbol: displaySymbol }) }}
          </p>
          <div class="flex items-center py-1">
            <span
              class="font-bold text-s-20 tracking-tight"
              :class="[
                !limitPrice || limitPrice === '' ? 'opacity-50' : '',
                limitPriceHasError ? 'text-error' : '',
              ]"
              >$</span
            >
            <input
              v-model="limitPrice"
              type="text"
              inputmode="decimal"
              placeholder="0.00"
              class="w-full font-bold text-s-20 tracking-tight outline-none bg-transparent"
              :class="{ 'text-error': limitPriceHasError }"
              @keydown="
                e => {
                  if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault()
                }
              "
              @input="onLimitPriceInput"
            />
          </div>

          <transition name="fade" mode="out-in">
            <div
              v-if="!limitPrice || parseFloat(limitPrice) === 0"
              class="text-error text-s-12 mb-1"
            >
              {{ $t('perps.errors.target-required') }}
            </div>
            <div
              v-else-if="
                isNaN(parseFloat(limitPrice)) || parseFloat(limitPrice) < 0
              "
              class="text-error text-s-12 mb-1"
            >
              {{ $t('perps.errors.invalid-price') }}
            </div>
            <div
              v-else-if="limitPrice && parseFloat(limitPrice) >= 10000000"
              class="text-error text-s-12 mb-1"
            >
              {{ $t('perps.errors.price-max', { max: '$10,000,000' }) }}
            </div>
            <div
              v-else-if="limitPricePrecisionError"
              class="text-error text-s-12 mb-1"
            >
              {{
                quoteDecimals === 0
                  ? $t('perps.errors.price-whole')
                  : $t('perps.errors.price-precision-decimals', {
                      decimals: quoteDecimals,
                      count: quoteDecimals,
                    })
              }}
            </div>
            <div
              v-else-if="limitPriceOutOfTolerance"
              class="text-error text-s-12 mb-1"
            >
              {{ $t('perps.errors.out-of-tolerance') }}
            </div>
          </transition>

          <div class="flex justify-start gap-2 mt-1">
            <button
              v-for="pct in [-5, -2.5, 0, 2.5, 5]"
              :key="pct"
              class="w-full px-[10px] py-1 text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
              @click="setLimitPricePct(pct)"
            >
              {{
                pct === 0
                  ? $t('perps.trade.mid')
                  : (pct > 0 ? '+' : '') + pct + '%'
              }}
            </button>
          </div>
        </div>

        <!-- Long / Short Toggle + Order Type on same row (no position) -->
        <template v-if="!activePosition || manageMode === 'add'">
          <!-- Margin -->
          <div
            class="w-full rounded-20 shadow-button shadow-button-elevated bg-white px-4 pt-4 pb-2 transition-all min-h-[120px] flex flex-col justify-between gap-2"
          >
            <p class="text-s-12 text-info mr-3 font-semibold">
              {{ $t('perps.trade.margin-available') }}
              <span class="font-medium ml-1 font-normal">
                {{ formatUsd(availableMargin) }}
              </span>
            </p>
            <div class="flex items-center justify-between -mt-1">
              <div
                class="flex items-center before:content-['$'] before:font-bold before:text-s-28 before:tracking-tight before:mr-1"
                :class="[
                  !inputAmount || inputAmount === '' ? 'before:opacity-50' : '',
                  marginPrecisionError ? 'before:text-error' : '',
                ]"
              >
                <input
                  v-model="inputAmount"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0.00"
                  class="font-bold text-s-28 bg-transparent outline-none w-full"
                  :class="{ 'text-error': marginPrecisionError }"
                  @keydown="
                    e => {
                      if (['e', 'E', '+', '-'].includes(e.key))
                        e.preventDefault()
                    }
                  "
                  @input="onInputAmount"
                />
              </div>
              <button
                class="flex items-center hoverNoBG gap-1 px-2 py-1 rounded-full bg-surface min-w-15"
                :disabled="isLoadingLeverage"
                @click="openLeverage"
              >
                <span
                  v-if="isLoadingLeverage"
                  class="ml-auto bg-grey-10 animate-pulse rounded-full h-4 w-8"
                />
                <p v-else class="ml-auto font-semibold text-s-14">
                  {{ manageMode === 'add' ? localLeverage : leverage }}&times;
                </p>
                <ChevronDownIcon class="w-3 h-3" />
              </button>
            </div>
            <p class="text-info text-s-12 -mt-2 mb-2 truncate">
              {{ $t('perps.trade.size') }}
              {{ positionSizeUsd ? formatUsd(positionSizeUsd) : '$0.00' }}
            </p>

            <!-- Error State -->
            <transition name="fade" mode="out-in">
              <div
                v-if="marginPrecisionError"
                class="text-error text-s-12 mb-1"
              >
                {{ $t('perps.errors.margin-precision') }}
              </div>
              <div
                v-else-if="
                  Number(inputAmount || '0') > availableMargin ||
                  isNaN(Number(inputAmount))
                "
                class="text-error text-s-12 mb-1"
              >
                {{
                  isNaN(Number(inputAmount))
                    ? $t('perps.errors.invalid-amount')
                    : $t('perps.errors.insufficient-margin')
                }}
              </div>
              <div
                v-else-if="
                  Number(inputAmount || '0') > 0 &&
                  positionSizeUsd < minOrderAmount
                "
                class="text-error text-s-12 mb-1"
              >
                {{
                  $t('perps.errors.min-amount', {
                    amount: formatUsd(minOrderAmount),
                  })
                }}
              </div>
            </transition>

            <!-- Slider -->
            <div class="relative mb-1 flex items-center gap-2">
              <input
                v-model="sliderValue"
                type="range"
                min="0"
                max="100"
                step="0.01"
                class="w-full h-2 rounded-full appearance-none cursor-pointer slider-input"
                :style="{
                  background: `linear-gradient(to right, ${orderSide === 'buy' ? 'rgba(5,192,165,1)' : 'rgba(228,12,91,1)'} 0%, ${orderSide === 'buy' ? 'rgba(5,192,165,1)' : 'rgba(228,12,91,1)'} ${sliderValue}%, #e5e7eb ${sliderValue}%, #e5e7eb 100%)`,
                  '--thumb-color':
                    orderSide === 'buy'
                      ? 'rgba(5,192,165,1)'
                      : 'rgba(228,12,91,1)',
                }"
                @input="onSliderInput"
              />
            </div>

            <!-- Size Pills -->
            <div class="flex justify-start gap-2">
              <button
                v-for="pct in [10, 25, 50, 75, 100]"
                :key="pct"
                class="w-full px-[10px] py-1 text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
                @click="setPercentage(pct)"
              >
                {{ pct + '%' }}
              </button>
            </div>
            <hr class="border-t border-grey-5 mt-1" />
            <!-- New size -->
            <div
              v-if="activePosition && manageMode === 'add'"
              class="flex justify-between text-s-14 py-1 font-medium"
            >
              <span class="font-bold text-s-12 text-info">{{
                $t('perps.trade.new-size')
              }}</span>
              <span class="font-bold">{{
                submitDisabled
                  ? '-'
                  : formatUsd(
                      (positionNotionalValue || 0) + (positionSizeUsd || 0),
                    )
              }}</span>
            </div>
            <!-- Est. Liquidation -->
            <div class="flex justify-between text-s-14 py-1 font-medium">
              <span class="font-bold text-s-12 text-info">{{
                $t('perps.trade.est-liquidation')
              }}</span>
              <span class="font-bold">{{
                submitDisabled
                  ? '-'
                  : estimatedLiquidation
                    ? formatUsd(estimatedLiquidation)
                    : '$0.00'
              }}</span>
            </div>
            <!-- Margin Ratio -->
            <div class="flex justify-between text-s-14 py-1 font-medium">
              <span class="font-bold text-s-12 text-info">{{
                $t('perps.trade.new-margin-ratio')
              }}</span>
              <span class="font-bold">{{
                submitDisabled
                  ? '-'
                  : newMarginRatio !== null
                    ? newMarginRatio.toFixed(2)
                    : '0'
              }}</span>
            </div>
          </div>
          <!-- Add take profit / stop loss -->
          <div class="flex items-center justify-center flex-wrap gap-2">
            <button
              v-if="takeProfitPrice === null && stopLossPrice === null"
              class="flex items-center hoverBGWhite gap-2 justify-between bg-white shadow-button shadow-button-elevated rounded-full px-4 py-1"
              @click="openAutoCloseModal"
            >
              <plus-circle-icon class="w-4 h-4" />
              <p class="text-s-12 font-medium">
                {{ $t('perps.trade.add-tp-sl') }}
              </p>
            </button>
            <div
              v-else
              class="flex items-center justify-center flex-wrap gap-2"
            >
              <button
                v-if="takeProfitPrice !== null"
                class="flex items-center hoverBGWhite bg-success text-white shadow-button shadow-button-elevated rounded-full px-4 py-1"
                @click="openAutoCloseModal"
              >
                <p class="text-s-12">
                  {{ $t('perps.trade.take-profit-label') }}
                  <span class="font-medium">{{
                    formatUsd(takeProfitPrice)
                  }}</span>
                </p>
              </button>

              <button
                v-if="stopLossPrice !== null"
                class="flex items-center hoverBGWhite bg-error text-white shadow-button shadow-button-elevated rounded-full px-4 py-1"
                @click="openAutoCloseModal"
              >
                <p class="text-s-12">
                  {{ $t('perps.trade.stop-loss-label') }}
                  <span class="font-medium">{{
                    formatUsd(stopLossPrice)
                  }}</span>
                </p>
              </button>
              <button
                v-if="takeProfitPrice === null || stopLossPrice === null"
                class="flex items-center hoverBGWhite gap-2 justify-between bg-white shadow-button shadow-button-elevated rounded-full px-4 py-1"
                @click="openAutoCloseModal"
              >
                <plus-circle-icon class="w-4 h-4" />
                <p class="text-s-12 font-medium">
                  {{
                    takeProfitPrice === null
                      ? $t('perps.trade.add-take-profit')
                      : $t('perps.trade.add-stop-loss')
                  }}
                </p>
              </button>
            </div>
          </div>
        </template>

        <!-- ========== ADD / CLOSE POSITION VIEW (has position) ========== -->
        <template v-if="activePosition && manageMode === 'close'">
          <!-- ADD MODE -->

          <!-- CLOSE MODE -->
          <div
            class="w-full rounded-20 shadow-button shadow-button-elevated bg-white px-4 pt-4 pb-2 transition-all min-h-[120px] flex flex-col justify-between"
          >
            <p class="font-semibold text-s-12 text-info mr-3">
              {{ $t('perps.trade.amount-to-close') }}
            </p>
            <!-- input -->
            <div
              class="flex items-center before:content-['$'] before:font-bold before:text-[28px] before:tracking-tight before:mr-1"
              :class="[
                !closeAmount || closeAmount === '' ? 'before:opacity-50' : '',
                closeAmountPrecisionError ? 'before:text-error' : '',
              ]"
            >
              <input
                v-model="closeAmount"
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                class="font-bold text-s-28 bg-transparent outline-none w-full"
                :class="{ 'text-error': closeAmountPrecisionError }"
                @keydown="
                  e => {
                    if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                  }
                "
                @input="onCloseAmountInput"
              />
            </div>
            <p class="text-info text-s-12 mb-2">
              {{ $t('perps.trade.new-size-close') }}
              {{
                formatUsd(
                  Math.max(
                    0,
                    positionNotionalValue - (parseFloat(closeAmount) || 0),
                  ),
                )
              }}
            </p>
            <transition name="fade" mode="out-in">
              <div
                v-if="closeAmountPrecisionError"
                class="text-error text-s-12 mb-1"
              >
                {{ $t('perps.errors.amount-precision') }}
              </div>
            </transition>
            <!--slider -->
            <input
              v-model="closeSliderValue"
              type="range"
              min="0"
              max="100"
              step="0.01"
              class="w-full h-2 rounded-full appearance-none cursor-pointer slider-input"
              :style="{
                background: `linear-gradient(to right, ${orderSide === 'buy' ? 'rgba(5,192,165,1)' : 'rgba(228,12,91,1)'} 0%, ${orderSide === 'buy' ? 'rgba(5,192,165,1)' : 'rgba(228,12,91,1)'} ${closeSliderValue}%, #e5e7eb ${closeSliderValue}%, #e5e7eb 100%)`,
                '--thumb-color':
                  orderSide === 'buy'
                    ? 'rgba(5,192,165,1)'
                    : 'rgba(228,12,91,1)',
              }"
              @input="onCloseSliderInput"
            />
            <!-- Size Pills -->
            <div class="flex justify-start gap-2 mt-4 mb-2">
              <button
                v-for="pct in [5, 25, 50, 75, 100]"
                :key="pct"
                :disabled="isClosePillDisabled(pct)"
                class="w-full px-[10px] py-1 text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
                :class="
                  isClosePillDisabled(pct)
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:border-grey-300 hover: '
                "
                @click="setClosePercentage(pct)"
              >
                {{ pct }}%
              </button>
            </div>
          </div>

          <!-- Close Error -->
          <div
            v-if="closeError"
            class="mx-4 mb-4 bg-[#fff0f0] border border-[#ffcccc] rounded-[16px] p-4"
          >
            <p class="text-error text-s-14 font-medium">
              {{ closeError }}
            </p>
          </div>
        </template>
      </div>
      <!-- Submit Button -->
      <template v-if="!isSupportedNetwork">
        <div
          class="bg-mewBg rounded-20 px-4 pb-6 pt-6 mx-auto w-full text-center w-[calc(100%-2rem)] mt-4"
        >
          <p class="text-info text-s-14 mb-4">
            {{ $t('perps.trade.eth-only') }}
          </p>
          <button
            class="bg-primary text-white rounded-full px-6 py-2.5 text-s-14 font-medium hoverOpacity w-full"
            @click="onSwitchToEthereum"
          >
            {{ $t('perps.trade.switch-to-ethereum') }}
          </button>
        </div>
      </template>
      <template v-else-if="isWatchOnly">
        <app-base-button
          v-if="!isWalletConnected || isWatchOnly"
          :class="['mx-auto w-full max-w-[340px] mt-4']"
          @click="connectWallet"
        >
          {{ t('connect_wallet') }}</app-base-button
        >
      </template>
      <template v-else-if="!token && !isWatchOnly">
        <div
          class="bg-mewBg rounded-20 px-4 pb-6 pt-6 mx-auto w-full text-center w-[calc(100%-2rem)] mt-4"
        >
          <button
            class="bg-primary text-white rounded-full px-6 py-2.5 text-s-14 font-medium hoverOpacity w-full"
            @click="login('Perps_Trade')"
          >
            {{ $t('perps.trade.sign-in') }}
          </button>
        </div>
      </template>
      <template v-else>
        <app-base-button
          v-if="!activePosition || manageMode === 'add'"
          :disabled="submitDisabled"
          @click="showConfirmation"
          :theme="orderSide === 'buy' ? 'success' : 'error'"
          class="w-full mt-4"
        >
          {{ getMainBtnText }}
        </app-base-button>
        <app-base-button
          v-if="activePosition && manageMode === 'close'"
          :theme="orderSide === 'buy' ? 'success' : 'error'"
          :disabled="closeDisabled"
          @click="showCloseConfirmation"
          class="w-full mt-4"
        >
          {{ closeButtonLabel }}
        </app-base-button>
      </template>
    </div>

    <!-- Order Confirmation Dialog -->
    <perps-order-confirmation-dialog
      v-model:is-open="showConfirmModal"
      :order-side="orderSide"
      :order-type="orderType"
      :display-symbol="displaySymbol"
      :current-price="currentPrice"
      :limit-price="limitPrice"
      :input-amount="inputAmount"
      :leverage="manageMode === 'add' ? tempLeverage : leverage"
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
      :take-profit-error="takeProfitPrecisionError"
      :stop-loss-error="stopLossPrecisionError"
      :quote-decimals="quoteDecimals"
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
import { computed, ref, watch } from 'vue'
import {
  ChevronDownIcon,
  CheckIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  PlusCircleIcon,
} from '@heroicons/vue/24/solid'
import { formatUsd, formatPnl } from './utils/formatters'
import { getLogoUrl } from './utils/market'
import { usePerpsTradeForm } from './composables/usePerpsTradeForm'
import { usePerpsAuth } from './composables/usePerpsAuth'
import PerpsSigningPrompt from './components/PerpsSigningPrompt.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
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
import { analytics, ConnectWalletEvent } from '@/analytics'

const walletStore = useWalletStore()
const { isWalletConnected, isWatchOnly } = storeToRefs(walletStore)
const { showSigningPrompt, signingMessage, isHardwareWalletSigning, isWaitingForConfirm, confirmSign, cancelSign } = usePerpsAuth()
const accessStore = useAccessStore()
const globalStore = useGlobalStore()
const { selectedNetwork } = storeToRefs(globalStore)
const toastStore = useToastStore()
const isSupportedNetwork = computed(() => selectedNetwork.value === 'ETHEREUM')
const { t } = useI18n()

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
    source: 'Perps_Trade',
  })
  accessStore.openAccessDialog()
}

const onInputAmount = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (Number(target.value) < 0) target.value = '0'
}

const onCloseAmountInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  let val = parseFloat(target.value)
  const maxVal = positionNotionalValue.value
  if (isNaN(val) || val <= 0) {
    closeAmount.value = ''
    closeSliderValue.value = 0
    return
  }
  if (val > maxVal) {
    val = maxVal
    target.value = val.toFixed(2)
    closeAmount.value = val.toFixed(2)
  }
  closeSliderValue.value = maxVal > 0 ? (val / maxVal) * 100 : 0
}

const confirmAndSubmitAndSetLeverage = async () => {
  if (manageMode.value === 'add' && tempLeverage.value !== leverage.value) {
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
  priceChange,
  // Order form
  orderSide,
  orderSideButtons,
  orderType,
  inputAmount,
  leverage,
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
  isClosePillDisabled,
  setClosePercentage,
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
  limitPriceHasError,
  limitPriceOutOfTolerance,
  limitPricePrecisionError,
  marginPrecisionError,
  closeAmountPrecisionError,
  takeProfitPrecisionError,
  stopLossPrecisionError,
  quoteDecimals,
  orderError,
  showConfirmModal,
  showConfirmation,
  confirmAndSubmitOrder,
  newMarginRatio,
  // Slider
  setPercentage,
  onSliderInput,
  setOrderType,
  limitPrice,
  activeLimitPill,
  setLimitPricePct,
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

const localLeverage = ref(leverage.value)

// if this changed, it means that the marketinfo page changed leverage and should reflect
watch(
  () => leverage.value,
  val => {
    if (val) localLeverage.value = val
  },
)

// 'add' mode doesn't persist via the API on save — it stages a leverage for
// the next add order. Only commit to localLeverage on explicit save (never on
// dismiss). Non-add modes go through saveLeverage(), which updates the
// `leverage` singleton and the watcher above syncs localLeverage.
const onSaveLeverage = () => {
  if (manageMode.value === 'add') {
    localLeverage.value = tempLeverage.value
    closeLeverageModal()
  } else {
    saveLeverage()
  }
}

// Seed tempLeverage from localLeverage in add mode (which tracks the open
// position's leverage and any staged-but-unapplied change) instead of the
// singleton. The composable's openLeverageModal seeds from the singleton,
// which would jump the slider back to the user's preferred leverage and
// drop a staged add-mode value.
const openLeverage = () => {
  if (manageMode.value === 'add') {
    tempLeverage.value = Math.min(localLeverage.value, marketMaxLeverage.value)
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
    if (!val) tempLeverage.value = localLeverage.value
  },
)

const activeContract = computed(() =>
  contracts.value.find(c => c.market === fullMarketName.value),
)

const isLoading = computed(() => false)

const selectedToken = computed(() => ({
  logo_url: getLogoUrl(displaySymbol.value),
  symbol: displaySymbol.value,
  ondo: undefined,
}))

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
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--thumb-color, #0052ff);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.slider-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--thumb-color, #0052ff);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
