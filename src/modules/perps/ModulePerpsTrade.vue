<template>
  <div class="w-full max-w-[500px] mx-auto relative h-full flex flex-col pb-6">
    <!-- Header: Asset Info -->
    <div class="flex items-center justify-between mb-2 px-4 -mt-2">
      <div>
        <p class="font-bold text-s-28">Perpetuals</p>
        <p class="text-info text-s-12 ml-1">Powered by Ondo Perps</p>
      </div>
    </div>

    <div
      v-if="!isWalletConnected || isWatchOnly"
      class="bg-mewBg rounded-20 px-4 pb-6 pt-6 mx-auto text-center w-[calc(100%-2rem)]"
    >
      <p class="text-info text-s-14 mb-4">
        Connect your wallet to start trading
      </p>
      <button
        class="bg-primary text-white rounded-full px-6 py-2.5 text-s-14 font-medium hoverOpacity w-full"
        @click="connectWallet"
      >
        Connect Wallet
      </button>
    </div>

    <div
      v-else-if="!token"
      class="bg-mewBg rounded-20 px-4 pb-6 pt-6 mx-auto text-center w-[calc(100%-2rem)]"
    >
      <p class="text-info text-s-14 mb-4">Sign in to start trading</p>
      <button
        class="bg-primary text-white rounded-full px-6 py-2.5 text-s-14 font-medium hoverOpacity w-full"
        @click="login"
      >
        Sign in to Perps
      </button>
    </div>

    <!-- Active Trade Form -->
    <div v-else class="flex flex-col">
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
              <p class="text-info text-s-12">Position size</p>
              <p class="font-medium">
                {{ formatUsd(positionNotionalValue) }}
              </p>
            </div>
            <div class="flex justify-between text-s-14 font-medium">
              <p class="text-info text-s-12">Current Profit</p>
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
              @click="manageMode = 'add'"
            >
              Add
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
              @click="manageMode = 'close'"
            >
              Close
            </button>
          </div>
          <app-pop-up-menu
            :placeholder="orderType === 'market' ? 'Market' : 'Limit'"
            location="right"
            class="ml-3"
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
                    <p class="font-bold text-s-14">Market Order</p>
                    <p class="text-info text-s-12 mt-0.5">
                      Long or Short immediately
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
                    <p class="font-bold text-s-14">Limit Order</p>
                    <p class="text-info text-s-12 mt-0.5">
                      You set the price to enter a Long or Short
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
            Target {{ displaySymbol }} price
          </p>
          <div class="flex items-center py-1">
            <span
              class="font-bold text-s-20 tracking-tight"
              :class="!limitPrice || limitPrice === '' ? 'opacity-50' : ''"
              >$</span
            >
            <input
              v-model="limitPrice"
              type="text"
              inputmode="decimal"
              placeholder="0.00"
              class="w-full font-bold text-s-20 tracking-tight outline-none bg-transparent"
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
              v-if="
                limitPrice &&
                (isNaN(parseFloat(limitPrice)) || parseFloat(limitPrice) <= 0)
              "
              class="text-error text-s-12 mb-1"
            >
              Invalid price
            </div>
            <div
              v-else-if="limitPrice && parseFloat(limitPrice) >= 10000000"
              class="text-error text-s-12 mb-1"
            >
              Price must be less than $10,000,000
            </div>
          </transition>

          <div class="flex justify-start gap-2 mt-1">
            <button
              v-for="pct in [-10, -5, 0, 5, 10]"
              :key="pct"
              class="px-[10px] py-1 text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
              @click="setLimitPricePct(pct)"
            >
              {{ pct === 0 ? 'Mid' : (pct > 0 ? '+' : '') + pct + '%' }}
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
              Margin:
              <span class="font-medium ml-1 font-normal">
                available {{ formatUsd(availableMargin) }}
              </span>
            </p>
            <div class="flex items-center justify-between -mt-2">
              <div class="">
                <div
                  class="flex items-center before:content-['$'] before:font-bold before:text-s-28 before:tracking-tight before:mr-1"
                  :class="
                    !inputAmount || inputAmount === ''
                      ? 'before:opacity-50'
                      : ''
                  "
                >
                  <input
                    v-model="inputAmount"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    class="font-bold text-s-28 bg-transparent outline-none w-full"
                    @keydown="
                      e => {
                        if (['e', 'E', '+', '-'].includes(e.key))
                          e.preventDefault()
                      }
                    "
                    @input="onInputAmount"
                  />
                </div>
                <p class="text-info text-s-12">
                  Size
                  {{ positionSizeUsd ? formatUsd(positionSizeUsd) : '$0.00' }}
                </p>
              </div>
              <button
                class="flex items-center hoverNoBG gap-1 px-2 py-1 rounded-full bg-surface min-w-15"
                @click="openLeverageModal"
              >
                <p class="ml-auto font-semibold text-s-14">
                  {{ leverage }}&times;
                </p>
                <ChevronDownIcon class="w-3 h-3" />
              </button>
            </div>

            <!-- Error State -->
            <transition name="fade" mode="out-in">
              <div
                v-if="
                  Number(inputAmount || '0') > availableMargin ||
                  isNaN(Number(inputAmount))
                "
                class="text-error text-s-12 mb-1"
              >
                {{
                  isNaN(Number(inputAmount))
                    ? 'Invalid amount'
                    : 'Insufficient margin available'
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
                  background: `linear-gradient(to right, #0052ff 0%, #0052ff ${sliderValue}%, #e5e7eb ${sliderValue}%, #e5e7eb 100%)`,
                }"
                @input="onSliderInput"
              />
            </div>

            <!-- Size Pills -->
            <div class="flex justify-start gap-2">
              <button
                v-for="pct in [10, 25, 50, 75, 100]"
                :key="pct"
                class="px-[10px] py-1 text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
                @click="setPercentage(pct)"
              >
                {{ pct === 100 ? 'Max' : pct + '%' }}
              </button>
            </div>
            <hr class="border-t border-grey-5 mt-1" />
            <!-- New size -->
            <div class="flex justify-between text-s-14 py-1 font-medium">
              <span class="font-bold text-s-12 text-info">New size</span>
              <span class="font-bold">{{
                formatUsd((positionNotionalValue || 0) + (positionSizeUsd || 0))
              }}</span>
            </div>
            <!-- Est. Liquidation -->
            <div class="flex justify-between text-s-14 py-1 font-medium">
              <span class="font-bold text-s-12 text-info"
                >Est. Liquidation</span
              >
              <span class="font-bold">{{
                estimatedLiquidation ? formatUsd(estimatedLiquidation) : '$0.00'
              }}</span>
            </div>
            <!-- Margin Ratio -->
            <div class="flex justify-between text-s-14 py-1 font-medium">
              <span class="font-bold text-s-12 text-info"
                >New Margin Ratio</span
              >
              <span class="font-bold">{{
                newMarginRatio !== null ? newMarginRatio.toFixed(2) : '0.00'
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
              <p class="text-s-12 font-medium">Add take profit or stop loss</p>
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
                  Take profit:
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
                  Stop loss:
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
                      ? 'Add take profit'
                      : 'Add stop loss'
                  }}
                </p>
              </button>
            </div>
          </div>
        </template>

        <!-- ========== ADD / CLOSE POSITION VIEW (has position) ========== -->
        <template v-if="manageMode === 'close'">
          <!-- ADD MODE -->

          <!-- CLOSE MODE -->
          <div
            class="w-full rounded-20 shadow-button shadow-button-elevated bg-white px-4 pt-4 pb-2 transition-all min-h-[120px] flex flex-col justify-between"
          >
            <p class="font-semibold text-s-12 text-info mr-3">
              Amount to close
            </p>
            <!-- input -->
            <div
              class="flex items-center before:content-['$'] before:font-bold before:text-[28px] before:tracking-tight before:mr-1"
              :class="
                !closeAmount || closeAmount === '' ? 'before:opacity-50' : ''
              "
            >
              <input
                v-model="closeAmount"
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                class="font-bold text-s-28 bg-transparent outline-none w-full"
                @keydown="
                  e => {
                    if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                  }
                "
                @input="onCloseAmountInput"
              />
            </div>
            <p class="text-info text-s-12 mb-2">
              New Size
              {{
                formatUsd(
                  Math.max(
                    0,
                    positionNotionalValue - (parseFloat(closeAmount) || 0),
                  ),
                )
              }}
            </p>
            <!--slider -->
            <input
              v-model="closeSliderValue"
              type="range"
              min="0"
              max="100"
              step="0.01"
              class="w-full h-2 rounded-full appearance-none cursor-pointer slider-input"
              :style="{
                background: `linear-gradient(to right, #0052ff 0%, #0052ff ${closeSliderValue}%, #e5e7eb ${closeSliderValue}%, #e5e7eb 100%)`,
              }"
              @input="onCloseSliderInput"
            />
            <!-- Size Pills -->
            <div class="flex justify-start gap-2 mt-4 mb-2">
              <button
                v-for="pct in [0, 25, 50, 75, 100]"
                :key="pct"
                :disabled="isClosePillDisabled(pct)"
                class="px-[10px] py-1 text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
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
        v-if="manageMode === 'close'"
        :theme="orderSide === 'buy' ? 'success' : 'error'"
        :disabled="closeDisabled"
        @click="showCloseConfirmation"
        class="w-full mt-4"
      >
        {{ closeButtonLabel }}
      </app-base-button>
    </div>

    <!-- Order Confirmation Overlay -->
    <Teleport to="body">
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center"
        @click.self="showConfirmModal = false"
      >
        <div class="absolute inset-0 bg-black/40" />
        <div
          class="relative bg-white rounded-[24px] w-full max-w-[440px] mx-4 p-6 shadow-xl z-10"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-2.5">
              <img
                :src="getLogoUrl(displaySymbol)"
                :alt="displaySymbol"
                class="w-8 h-8 rounded-full"
              />
              <span class="font-bold text-s-20"
                >Confirm
                {{ orderSide === 'buy' ? 'Long' : 'Short' }}
                {{ displaySymbol }}</span
              >
            </div>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-greyLight transition-colors"
              @click="showConfirmModal = false"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Order Details -->
          <div class="bg-mewBg rounded-[20px] p-5 mb-5 space-y-3">
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium">Side</span>
              <span
                class="font-bold"
                :class="orderSide === 'buy' ? 'text-success' : 'text-error'"
                >{{ orderSide === 'buy' ? 'Long' : 'Short' }}</span
              >
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium">Order type</span>
              <span class="font-bold">{{
                orderType === 'market' ? 'Market' : 'Limit'
              }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium">Market price</span>
              <span class="font-bold">{{ formatUsd(currentPrice) }}</span>
            </div>
            <div
              v-if="orderType === 'limit'"
              class="flex justify-between text-s-14"
            >
              <span class="text-info font-medium">Limit price</span>
              <span class="font-bold">${{ limitPrice }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium">Margin</span>
              <span class="font-bold">{{
                formatUsd(parseFloat(inputAmount) || 0)
              }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium">Leverage</span>
              <span class="font-bold">{{ leverage }}&times;</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium">Position size</span>
              <span class="font-bold">{{ formatUsd(positionSizeUsd) }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium"
                >Size ({{ displaySymbol }})</span
              >
              <span class="font-bold">{{ orderSize }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium">Est. liquidation</span>
              <span class="font-bold">{{
                estimatedLiquidation ? formatUsd(estimatedLiquidation) : '$0.00'
              }}</span>
            </div>
            <div
              v-if="takeProfitPrice !== null"
              class="flex justify-between text-s-14"
            >
              <span class="text-info font-medium">Take Profit</span>
              <span class="text-success font-bold">{{
                formatUsd(takeProfitPrice)
              }}</span>
            </div>
            <div
              v-if="stopLossPrice !== null"
              class="flex justify-between text-s-14"
            >
              <span class="text-info font-medium">Stop Loss</span>
              <span class="text-error font-bold">{{
                formatUsd(stopLossPrice)
              }}</span>
            </div>
          </div>

          <!-- Error -->
          <div
            v-if="orderError"
            class="bg-[#fff0f0] border border-[#ffcccc] rounded-[16px] p-4 mb-5"
          >
            <p class="text-error text-s-14 font-medium">{{ orderError }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              class="flex-1 border border-[#e5e7eb] rounded-full py-3.5 text-s-16 font-bold hover:bg-greyLight transition-colors"
              :disabled="isSubmitting"
              @click="showConfirmModal = false"
            >
              Cancel
            </button>
            <button
              class="flex-1 text-white rounded-full py-3.5 text-s-16 font-bold hoverOpacity transition-all active:scale-[0.98]"
              :class="orderSide === 'buy' ? 'bg-[#00c896]' : 'bg-[#ff5b5a]'"
              :disabled="isSubmitting"
              @click="confirmAndSubmitOrder"
            >
              <span v-if="isSubmitting">Processing...</span>
              <span v-else>Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Close Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showCloseConfirmModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center"
        @click.self="showCloseConfirmModal = false"
      >
        <div class="absolute inset-0 bg-black/40" />
        <div
          class="relative bg-white rounded-[24px] w-full max-w-[440px] mx-4 p-6 shadow-xl z-10"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-2.5">
              <img
                :src="getLogoUrl(displaySymbol)"
                :alt="displaySymbol"
                class="w-8 h-8 rounded-full"
              />
              <span class="font-bold text-s-20"
                >Confirm Close
                {{ displaySymbol }}
                {{
                  activePosition?.direction === 'long' ? 'Long' : 'Short'
                }}</span
              >
            </div>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-greyLight transition-colors"
              @click="showCloseConfirmModal = false"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Close Details -->
          <div class="bg-mewBg rounded-[20px] p-5 mb-5 space-y-3">
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium">Side</span>
              <span
                class="font-bold"
                :class="
                  activePosition?.direction === 'long'
                    ? 'text-error'
                    : 'text-success'
                "
                >{{
                  activePosition?.direction === 'long'
                    ? 'Sell (Close Long)'
                    : 'Buy (Close Short)'
                }}</span
              >
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium">Order type</span>
              <span class="font-bold">Market</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium">Market price</span>
              <span class="font-bold">{{ formatUsd(currentPrice) }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium">Close amount</span>
              <span class="font-bold">{{
                formatUsd(parseFloat(closeAmount) || 0)
              }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium"
                >Size ({{ displaySymbol }})</span
              >
              <span class="font-bold">{{ closeOrderSize }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium">Close percentage</span>
              <span class="font-bold">{{ Math.round(closeSliderValue) }}%</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-info font-medium">Current P&amp;L</span>
              <span
                class="font-bold"
                :class="positionPnl >= 0 ? 'text-success' : 'text-error'"
                >{{ formatPnl(String(positionPnl)) }} ({{
                  (positionRoe * 100).toFixed(2)
                }}%)</span
              >
            </div>
          </div>

          <!-- Error -->
          <div
            v-if="closeError"
            class="bg-[#fff0f0] border border-[#ffcccc] rounded-[16px] p-4 mb-5"
          >
            <p class="text-error text-s-14 font-medium">{{ closeError }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              class="flex-1 border border-[#e5e7eb] rounded-full py-3.5 text-s-16 font-bold hover:bg-greyLight transition-colors"
              :disabled="isClosing"
              @click="showCloseConfirmModal = false"
            >
              Cancel
            </button>
            <button
              class="flex-1 bg-[#ff5b5a] text-white rounded-full py-3.5 text-s-16 font-bold hoverOpacity transition-all active:scale-[0.98]"
              :disabled="isClosing"
              @click="confirmAndClosePosition"
            >
              <span v-if="isClosing">Closing...</span>
              <span v-else>Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Market Selector Modal -->
    <Teleport to="body">
      <div
        v-if="showMarketModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center"
        @click.self="showMarketModal = false"
      >
        <div class="absolute inset-0 bg-black/40" />
        <div
          class="relative bg-white rounded-[24px] w-full max-w-[480px] mx-4 shadow-xl z-10 flex flex-col"
          style="max-height: 60vh"
        >
          <!-- Header -->
          <div class="relative flex items-center justify-center px-6 pt-6 pb-4">
            <span class="font-bold text-s-22">Select Market</span>
            <button
              class="absolute right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-greyLight transition-colors"
              @click="showMarketModal = false"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Search -->
          <div class="px-6 mb-3">
            <div
              class="flex items-center gap-2 bg-[#f5f5f5] rounded-full px-4 py-2.5"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                v-model="marketSearch"
                type="text"
                placeholder="Search"
                class="w-full bg-transparent text-s-14 outline-none placeholder:text-grey-40"
              />
              <button
                class="flex items-center gap-1 text-s-13 font-bold whitespace-nowrap border border-[#e5e7eb] rounded-full px-3 py-1 hover:bg-greyLight transition-colors"
                @click="marketSortAsc = !marketSortAsc"
              >
                Name
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :style="{
                    transform: marketSortAsc
                      ? 'rotate(0deg)'
                      : 'rotate(180deg)',
                    transition: 'transform 0.2s',
                  }"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Filter Tabs -->
          <div class="px-6 mb-3">
            <div class="flex gap-1 bg-[#f0f0f0] rounded-full p-1">
              <button
                v-for="tab in marketFilterTabs"
                :key="tab.key"
                class="flex-1 px-3 py-1.5 text-s-14 font-bold transition-colors rounded-full"
                :class="
                  marketFilter === tab.key
                    ? 'bg-white   shadow-sm'
                    : 'text-grey-40 hover: '
                "
                @click="marketFilter = tab.key"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <!-- Market List -->
          <div class="overflow-y-auto flex-1 px-2 pb-4 mr-1 market-list-scroll">
            <div
              v-for="contract in filteredMarketList"
              :key="contract.market"
              class="flex items-center justify-between px-4 py-3 rounded-[16px] cursor-pointer hover:bg-[#f5f5f5] transition-colors"
              @click="selectMarket(contract)"
            >
              <div class="flex items-center gap-3">
                <img
                  :src="getLogoUrl(contract.baseCurrency)"
                  :alt="contract.baseCurrency"
                  class="w-10 h-10 rounded-full"
                />
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-s-15">{{
                      contract.baseCurrency
                    }}</span>
                    <span
                      class="bg-[#f0f0f0] text-grey-40 rounded px-1.5 py-0.5 text-[11px] font-medium"
                      >20x</span
                    >
                  </div>
                  <span class="text-grey-40 text-s-12">{{
                    getMarketDisplayName(contract)
                  }}</span>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-s-15">
                  {{ formatContractPrice(contract) }}
                </p>
                <p
                  class="text-s-12 font-medium"
                  :class="
                    parseFloat(contract.priceChangePercent ?? '0') >= 0
                      ? 'text-success'
                      : 'text-error'
                  "
                >
                  {{ formatPriceChange(contract.priceChangePercent) }}
                </p>
              </div>
            </div>
            <div
              v-if="filteredMarketList.length === 0"
              class="text-center py-8 text-grey-40 text-s-14"
            >
              No markets found
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Leverage Modal Overlay -->
    <Teleport to="body">
      <div
        v-if="showLeverageModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center"
        @click.self="showLeverageModal = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40" />

        <!-- Modal -->
        <div
          class="relative bg-white rounded-[24px] w-full max-w-[440px] mx-4 p-6 shadow-xl z-10"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2.5">
              <img
                :src="getLogoUrl(displaySymbol)"
                :alt="displaySymbol"
                class="w-8 h-8 rounded-full"
              />
              <span class="font-bold text-s-20"
                >{{ displaySymbol }} Leverage</span
              >
            </div>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-greyLight transition-colors"
              @click="showLeverageModal = false"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Leverage Card -->
          <div class="bg-mewBg rounded-[20px] p-5 mb-5">
            <!-- +/- Controls -->
            <div class="flex items-center justify-center gap-6 mb-5">
              <button
                class="w-10 h-10 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center hover:bg-greyLight transition-colors text-s-20"
                :disabled="tempLeverage <= 1"
                :class="{ 'opacity-30 cursor-not-allowed': tempLeverage <= 1 }"
                @click="tempLeverage = Math.max(1, tempLeverage - 1)"
              >
                &minus;
              </button>
              <span
                class="font-bold text-[40px] tracking-tight min-w-[100px] text-center"
                >{{ tempLeverage }}&times;</span
              >
              <button
                class="w-10 h-10 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center hover:bg-greyLight transition-colors text-s-20"
                :disabled="tempLeverage >= 20"
                :class="{
                  'opacity-30 cursor-not-allowed': tempLeverage >= 20,
                }"
                @click="tempLeverage = Math.min(20, tempLeverage + 1)"
              >
                +
              </button>
            </div>

            <!-- Tick Labels -->
            <div class="flex justify-between px-1 mb-1.5">
              <span
                v-for="tick in [1, 5, 10, 15, 20]"
                :key="tick"
                class="text-[11px] font-medium"
                :class="tempLeverage >= tick ? ' ' : 'text-grey-40'"
                >{{ tick }}&times;</span
              >
            </div>

            <!-- Slider -->
            <div class="relative px-0">
              <input
                v-model.number="tempLeverage"
                type="range"
                min="1"
                max="20"
                step="1"
                class="w-full h-2 rounded-full appearance-none cursor-pointer leverage-slider"
                :style="{
                  background: `linear-gradient(to right, #0052ff 0%, #0052ff ${((tempLeverage - 1) / 19) * 100}%, #e5e7eb ${((tempLeverage - 1) / 19) * 100}%, #e5e7eb 100%)`,
                }"
              />
            </div>
          </div>

          <!-- Description -->
          <p class="text-s-14 text-info mb-6 leading-relaxed">
            Leverage increases both your potential profits and losses. Using
            higher leverage means higher risk of losing your position.
            <a href="#" class="text-[#0052ff] font-medium hover:underline"
              >Learn more</a
            >
          </p>

          <!-- Leverage Error -->
          <div
            v-if="leverageError"
            class="bg-[#fff0f0] border border-[#ffcccc] rounded-[16px] p-4 mb-5"
          >
            <p class="text-error text-s-14 font-medium">
              {{ leverageError }}
            </p>
          </div>

          <!-- Save Button -->
          <button
            class="w-full bg-[#0052ff] text-white rounded-full py-3.5 text-s-16 font-bold hoverOpacity transition-all active:scale-[0.98]"
            :disabled="isSavingLeverage"
            @click="saveLeverage"
          >
            {{ isSavingLeverage ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Auto Close Modal -->
    <Teleport to="body">
      <div
        v-if="showAutoCloseModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center"
        @click.self="showAutoCloseModal = false"
      >
        <div class="absolute inset-0 bg-black/40" />
        <div
          class="relative bg-white rounded-[24px] w-full max-w-[440px] mx-4 p-6 shadow-xl z-10"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-5">
            <span class="font-bold text-s-20">Auto close</span>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-greyLight transition-colors"
              @click="showAutoCloseModal = false"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Asset & Price -->
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-2">
              <img
                :src="getLogoUrl(displaySymbol)"
                :alt="displaySymbol"
                class="w-7 h-7 rounded-full"
              />
              <span class="font-bold text-s-16">{{ displaySymbol }}</span>
            </div>
            <div class="text-right">
              <span class="text-info text-s-14 mr-2">Current price</span>
              <span class="font-bold text-s-16">{{
                formatUsd(currentPrice)
              }}</span>
            </div>
          </div>

          <!-- Take Profit -->
          <div class="bg-mewBg rounded-[20px] p-5 mb-4">
            <div class="flex justify-between items-center mb-3 px-1">
              <p class="text-s-14 font-bold">
                Take profit if {{ displaySymbol }} reaches
              </p>
              <button
                class="text-[#0052ff] text-s-14 font-bold hover:opacity-70"
                @click="clearTempTakeProfit"
              >
                Clear
              </button>
            </div>
            <div
              class="bg-white rounded-[16px] p-5 shadow-sm border border-[#e5e7eb]"
            >
              <div class="flex items-center justify-between mb-4">
                <div
                  class="flex items-center gap-1 text-s-14 font-medium text-info"
                >
                  Price
                </div>
                <p class="font-bold text-[28px] tracking-tight">
                  {{
                    tempTakeProfitPrice !== null
                      ? formatUsd(tempTakeProfitPrice)
                      : '—'
                  }}
                </p>
              </div>
              <div class="flex justify-between gap-2 mb-3">
                <button
                  v-for="pct in [10, 20, 30, 50, 100]"
                  :key="pct"
                  class="h-[34px] flex-1 border rounded-full text-[13px] font-bold transition-all flex items-center justify-center bg-white"
                  :class="
                    activeTpPill === pct
                      ? 'border-[#0052ff] text-[#0052ff]'
                      : 'border-[#e5e7eb]   hover:border-grey-300'
                  "
                  @click="setTakeProfitPct(pct)"
                >
                  +{{ pct }}%
                </button>
              </div>
              <div
                v-if="
                  tempProjectedProfit !== null && tempTakeProfitPrice !== null
                "
                class="text-right text-s-13 mt-2"
              >
                <span class="text-info">Projected profit</span>
                <span class="text-success font-bold ml-2"
                  >+{{ formatUsd(Math.abs(tempProjectedProfit)) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Stop Loss -->
          <div class="bg-mewBg rounded-[20px] p-5 mb-6">
            <div class="flex justify-between items-center mb-3 px-1">
              <p class="text-s-14 font-bold">
                Stop loss if {{ displaySymbol }} reaches
              </p>
              <button
                class="text-[#0052ff] text-s-14 font-bold hover:opacity-70"
                @click="clearTempStopLoss"
              >
                Clear
              </button>
            </div>
            <div
              class="bg-white rounded-[16px] p-5 shadow-sm border border-[#e5e7eb]"
            >
              <div class="flex items-center justify-between mb-4">
                <div
                  class="flex items-center gap-1 text-s-14 font-medium text-info"
                >
                  Price
                </div>
                <p class="font-bold text-[28px] tracking-tight">
                  {{
                    tempStopLossPrice !== null
                      ? formatUsd(tempStopLossPrice)
                      : '—'
                  }}
                </p>
              </div>
              <div class="flex justify-between gap-2 mb-3">
                <button
                  v-for="pct in [1, 2, 3, 4, 5]"
                  :key="pct"
                  class="h-[34px] flex-1 border rounded-full text-[13px] font-bold transition-all flex items-center justify-center bg-white"
                  :class="
                    activeSlPill === pct
                      ? 'border-[#c9379d] text-[#c9379d]'
                      : 'border-[#e5e7eb]   hover:border-grey-300'
                  "
                  @click="setStopLossPct(pct)"
                >
                  -{{ pct }}%
                </button>
              </div>
              <div
                v-if="tempProjectedLoss !== null && tempStopLossPrice !== null"
                class="text-right text-s-13 mt-2"
              >
                <span class="text-info">Projected loss</span>
                <span class="text-error font-bold ml-2"
                  >-{{ formatUsd(Math.abs(tempProjectedLoss)) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Add Button -->
          <button
            class="w-full bg-[#0052ff] text-white rounded-full py-3.5 text-s-16 font-bold hoverOpacity transition-all active:scale-[0.98]"
            @click="confirmAutoClose"
          >
            Add
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ChevronDownIcon,
  CheckIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  PlusCircleIcon,
} from '@heroicons/vue/24/solid'
import {
  formatUsd,
  formatPnl,
  formatContractPrice,
  formatPriceChange,
} from './utils/formatters'
import { getLogoUrl } from './utils/market'
import { usePerpsTradeForm } from './composables/usePerpsTradeForm'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useAccessStore } from '@/stores/accessStore'
import { storeToRefs } from 'pinia'

const walletStore = useWalletStore()
const { isWalletConnected, isWatchOnly } = storeToRefs(walletStore)
const accessStore = useAccessStore()

const connectWallet = () => {
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
  // Submit
  isSubmitting,
  submitDisabled,
  submitButtonLabel,
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
  marketSortAsc,
  marketFilterTabs,
  filteredMarketList,
  getMarketDisplayName,
  openTokenSelect,
  selectMarket,
  // Leverage
  showLeverageModal,
  tempLeverage,
  isSavingLeverage,
  leverageError,
  openLeverageModal,
  saveLeverage,
} = usePerpsTradeForm()

const isLoading = computed(() => false)

const selectedToken = computed(() => ({
  logo_url: getLogoUrl(displaySymbol.value),
  symbol: displaySymbol.value,
  ondo: undefined,
}))

const getMainBtnText = computed(() => {
  if (!activePosition.value) {
    const side = orderSide.value === 'buy' ? 'Long' : 'Short'
    return `${side} ${displaySymbol.value}`
  }
  if (manageMode.value === 'close') {
    return closeButtonLabel.value
  }
  return submitButtonLabel.value
})
</script>
