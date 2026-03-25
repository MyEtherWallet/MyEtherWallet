<template>
  <div class="w-full max-w-[500px] mx-auto relative h-full flex flex-col">
    <!-- Header: Asset Info -->
    <div class="flex items-center justify-between mb-4 px-4 pt-2">
      <div>
        <p class="font-bold text-s-28 tracking-tight">Perps</p>
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
    <div v-else class="flex flex-col flex-1 min-h-0">
      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Asset Selector & Price -->
        <div class="flex items-center justify-between mb-4 px-4">
          <div
            class="flex items-center gap-2 border border-[#e5e7eb] rounded-full py-1.5 px-3 cursor-pointer hover:bg-greyLight transition-colors bg-white"
            @click="openTokenSelect"
          >
            <img
              :src="getLogoUrl(displaySymbol)"
              :alt="displaySymbol"
              class="w-7 h-7 rounded-full"
            />
            <span class="font-bold text-s-16">{{ displaySymbol }}</span>
            <img
              src="@/assets/icons/chevron-down.svg"
              class="w-4 h-4 opacity-50"
            />
          </div>
          <div class="text-right">
            <p class="font-bold text-s-16 mb-[2px]">
              {{ formatUsd(currentPrice) }}
            </p>
            <p
              :class="priceChange >= 0 ? 'text-[#00c896]' : 'text-[#ff5b5a]'"
              class="text-s-12 font-medium text-right flex items-center justify-end gap-1"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <template v-if="priceChange >= 0">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </template>
                <template v-else>
                  <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
                  <polyline points="16 17 22 17 22 11"></polyline>
                </template>
              </svg>
              {{ priceChange.toFixed(2) }}%
            </p>
          </div>
        </div>

        <!-- Long / Short Toggle + Order Type on same row (no position) -->
        <template v-if="!activePosition">
          <div class="flex items-center justify-between mb-4 px-4">
            <div class="flex bg-[#eef1f8] rounded-full p-1 w-fit">
              <button
                class="flex items-center gap-1.5 px-5 py-2 rounded-full text-s-14 font-bold transition-all duration-200"
                :class="
                  orderSide === 'buy'
                    ? 'bg-[#00c896] text-white shadow-sm'
                    : 'text-textDark hover:bg-[#e4e9f4]'
                "
                @click="orderSide = 'buy'"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
                Long
              </button>
              <button
                class="flex items-center gap-1.5 px-5 py-2 rounded-full text-s-14 font-bold transition-all duration-200"
                :class="
                  orderSide === 'sell'
                    ? 'bg-[#ff5b5a] text-white shadow-sm'
                    : 'text-textDark hover:bg-[#e4e9f4]'
                "
                @click="orderSide = 'sell'"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
                  <polyline points="16 17 22 17 22 11"></polyline>
                </svg>
                Short
              </button>
            </div>
            <div
              class="flex items-center gap-1 cursor-pointer text-s-14 font-medium pr-1 text-textDark"
              @click="toggleOrderType"
            >
              {{ orderType === 'market' ? 'Market' : 'Limit' }}
              <img
                src="@/assets/icons/chevron-down.svg"
                class="w-5 h-5 opacity-50"
              />
            </div>
          </div>

          <!-- Main Blue Wrapper -->
          <div class="bg-[#edf2fa] rounded-[24px] pt-5 pb-5 px-4 mb-8">
            <!-- Position Size -->
            <p class="text-s-14 font-bold text-textDark mb-3 ml-2">
              Position size
            </p>

            <!-- Inner white card -->
            <div
              class="bg-white rounded-[20px] p-4 shadow-sm border border-[#e5e7eb] mb-4"
            >
              <p class="text-s-14 text-info mb-1 font-medium">
                Available
                <span class="text-textDark font-bold ml-1"
                  >{{ formatUsd(availableMargin) }}
                  <span class="text-info font-normal"
                    >({{ leverage }}x
                    {{ formatUsd(availableMargin * leverage) }})</span
                  ></span
                >
              </p>
              <p
                class="font-bold text-[36px] text-textDark mb-3 tracking-tight"
              >
                {{ inputAmount ? formatUsd(parseFloat(inputAmount)) : '$0.00' }}
              </p>

              <!-- Slider -->
              <div class="relative mb-6 px-1">
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
              <div class="flex justify-between gap-2">
                <button
                  v-for="pct in [10, 25, 50, 75, 100]"
                  :key="pct"
                  class="h-8 flex-1 border border-[#e5e7eb] hover:border-grey-300 hover:text-textDark rounded-full text-xs sm:text-[13px] font-bold text-textDark transition-all flex items-center justify-center bg-white"
                  @click="setPercentage(pct)"
                >
                  {{ pct === 100 ? 'Max' : pct + '%' }}
                </button>
              </div>
            </div>

            <!-- Leverage -->
            <div
              class="bg-white rounded-[20px] border border-[#e5e7eb] p-4 mb-4 flex justify-between items-center cursor-pointer shadow-sm"
              @click="openLeverageModal"
            >
              <span class="text-s-16 font-medium text-textDark ml-1"
                >Leverage</span
              >
              <div class="flex items-center gap-1">
                <span class="text-s-20 font-bold text-textDark"
                  >{{ leverage }}&times;</span
                >
                <img
                  src="@/assets/icons/chevron-down.svg"
                  class="w-5 h-5 opacity-40 mr-[-2px]"
                />
              </div>
            </div>

            <!-- Auto Close -->
            <div
              v-if="!hasAutoClose"
              class="bg-white rounded-[20px] border border-[#e5e7eb] p-4 mb-6 flex justify-between items-center cursor-pointer shadow-sm"
              @click="openAutoCloseModal"
            >
              <span class="text-s-16 font-medium text-textDark ml-1"
                >Auto close</span
              >
              <button
                class="flex items-center gap-1.5 text-[#0052ff] text-s-16 font-bold mr-1"
              >
                <span class="text-s-20 font-medium">+</span> Add
              </button>
            </div>
            <div
              v-else
              class="bg-white rounded-[20px] border border-[#e5e7eb] p-4 mb-6 shadow-sm"
            >
              <div class="flex justify-between items-center mb-3">
                <span class="text-s-16 font-medium text-textDark ml-1"
                  >Auto close</span
                >
                <button
                  class="flex items-center gap-1.5 text-[#0052ff] text-s-14 font-bold mr-1"
                  @click="openAutoCloseModal"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                    />
                    <path
                      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                    />
                  </svg>
                  Edit
                </button>
              </div>
              <div
                v-if="takeProfitPrice !== null"
                class="flex justify-between items-center text-s-14 mb-2 ml-1"
              >
                <span class="font-medium text-textDark">Take Profit</span>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-textDark">{{
                    formatUsd(takeProfitPrice)
                  }}</span>
                  <span
                    v-if="takeProfitPct !== null"
                    class="text-[#00c896] font-bold text-s-12"
                    >({{ takeProfitPct >= 0 ? '+' : ''
                    }}{{ takeProfitPct.toFixed(0) }}%)</span
                  >
                  <button
                    class="text-[#0052ff] font-bold text-s-16 ml-1 hover:opacity-70"
                    @click="clearTakeProfit"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div
                v-if="stopLossPrice !== null"
                class="flex justify-between items-center text-s-14 ml-1"
              >
                <span class="font-medium text-textDark">Stop Loss</span>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-textDark">{{
                    formatUsd(stopLossPrice)
                  }}</span>
                  <span
                    v-if="stopLossPct !== null"
                    class="text-[#ff5b5a] font-bold text-s-12"
                    >({{ stopLossPct >= 0 ? '+' : ''
                    }}{{ stopLossPct.toFixed(0) }}%)</span
                  >
                  <button
                    class="text-[#0052ff] font-bold text-s-16 ml-1 hover:opacity-70"
                    @click="clearStopLoss"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div class="flex justify-between text-s-14 px-3 mb-3.5 font-medium">
              <span class="text-[#58595b]">Position size</span>
              <span class="text-textDark font-bold">{{
                positionSizeUsd ? formatUsd(positionSizeUsd) : '$0.00'
              }}</span>
            </div>
            <div class="flex justify-between text-s-14 px-3 mb-2 font-medium">
              <span class="text-[#58595b]">Estimated Liquidation</span>
              <span class="text-textDark font-bold">{{
                estimatedLiquidation ? formatUsd(estimatedLiquidation) : '$0.00'
              }}</span>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pb-10 px-4">
            <button
              class="w-full text-white rounded-full py-4 text-s-18 font-bold hoverOpacity transition-all active:scale-[0.98]"
              :class="[
                orderSide === 'buy' ? 'bg-[#00c896]' : 'bg-[#ff5b5a]',
                submitDisabled
                  ? 'bg-[#e5e7eb] text-grey-40 cursor-not-allowed shadow-none opacity-80'
                  : '',
              ]"
              :disabled="submitDisabled"
              @click="showConfirmation"
            >
              {{ orderSide === 'buy' ? 'Long' : 'Short' }}
              {{ displaySymbol }}
            </button>
          </div>
        </template>

        <!-- ========== ADD / CLOSE POSITION VIEW (has position) ========== -->
        <template v-else>
          <!-- Add / Close Toggle + Order Type -->
          <div class="flex items-center justify-between mb-4 px-4">
            <div class="flex bg-[#eef1f8] rounded-full p-1 w-fit">
              <button
                class="px-5 py-2 rounded-full text-s-14 font-bold transition-all duration-200"
                :class="
                  manageMode === 'add'
                    ? 'bg-white text-textDark shadow-sm'
                    : 'text-textDark hover:bg-[#e4e9f4]'
                "
                @click="manageMode = 'add'"
              >
                Add
              </button>
              <button
                class="px-5 py-2 rounded-full text-s-14 font-bold transition-all duration-200"
                :class="
                  manageMode === 'close'
                    ? 'bg-white text-textDark shadow-sm'
                    : 'text-textDark hover:bg-[#e4e9f4]'
                "
                @click="manageMode = 'close'"
              >
                Close
              </button>
            </div>
            <div
              class="flex items-center gap-1 cursor-pointer text-s-14 font-medium pr-1 text-textDark"
              @click="toggleOrderType"
            >
              {{ orderType === 'market' ? 'Market' : 'Limit' }}
              <img
                src="@/assets/icons/chevron-down.svg"
                class="w-5 h-5 opacity-50"
              />
            </div>
          </div>

          <!-- Position Info -->
          <div class="flex justify-between text-s-14 px-4 mb-1.5 font-medium">
            <span class="text-[#58595b]">Position size</span>
            <span class="text-textDark font-bold">{{
              formatUsd(positionNotionalValue)
            }}</span>
          </div>
          <div class="flex justify-between text-s-14 px-4 mb-4 font-medium">
            <span class="text-[#58595b]">Current Profit</span>
            <span
              :class="positionPnl >= 0 ? 'text-[#00c896]' : 'text-[#ff5b5a]'"
              class="font-bold"
            >
              {{ formatPnl(String(positionPnl)) }}
              ({{ (positionRoe * 100).toFixed(2) }}%)
            </span>
          </div>

          <!-- ADD MODE -->
          <template v-if="manageMode === 'add'">
            <div class="bg-[#edf2fa] rounded-[24px] pt-5 pb-5 px-4 mb-8">
              <p class="text-s-14 font-bold text-textDark mb-3 ml-2">
                Add margin
              </p>

              <div
                class="bg-white rounded-[20px] p-4 shadow-sm border border-[#e5e7eb] mb-4"
              >
                <p class="text-s-14 text-info mb-1 font-medium">
                  Available
                  <span class="text-textDark font-bold ml-1"
                    >{{ formatUsd(availableMargin) }}
                    <span class="text-info font-normal"
                      >({{ leverage }}x
                      {{ formatUsd(availableMargin * leverage) }})</span
                    ></span
                  >
                </p>
                <p
                  class="font-bold text-[36px] text-textDark mb-3 tracking-tight"
                >
                  {{
                    inputAmount ? formatUsd(parseFloat(inputAmount)) : '$0.00'
                  }}
                </p>

                <div class="relative mb-6 px-1">
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

                <div class="flex justify-between gap-2">
                  <button
                    v-for="pct in [10, 25, 50, 75, 100]"
                    :key="pct"
                    class="h-8 flex-1 border border-[#e5e7eb] hover:border-grey-300 hover:text-textDark rounded-full text-xs sm:text-[13px] font-bold text-textDark transition-all flex items-center justify-center bg-white"
                    @click="setPercentage(pct)"
                  >
                    {{ pct === 100 ? 'Max' : pct + '%' }}
                  </button>
                </div>
              </div>

              <!-- Leverage -->
              <div
                class="bg-white rounded-[20px] border border-[#e5e7eb] p-4 mb-4 flex justify-between items-center cursor-pointer shadow-sm"
                @click="openLeverageModal"
              >
                <span class="text-s-16 font-medium text-textDark ml-1"
                  >Leverage</span
                >
                <div class="flex items-center gap-1">
                  <span class="text-s-20 font-bold text-textDark"
                    >{{ leverage }}&times;</span
                  >
                  <img
                    src="@/assets/icons/chevron-down.svg"
                    class="w-5 h-5 opacity-40 mr-[-2px]"
                  />
                </div>
              </div>

              <!-- Auto Close -->
              <div
                v-if="!hasAutoClose"
                class="bg-white rounded-[20px] border border-[#e5e7eb] p-4 mb-6 flex justify-between items-center cursor-pointer shadow-sm"
                @click="openAutoCloseModal"
              >
                <span class="text-s-16 font-medium text-textDark ml-1"
                  >Auto close</span
                >
                <button
                  class="flex items-center gap-1.5 text-[#0052ff] text-s-16 font-bold mr-1"
                >
                  <span class="text-s-20 font-medium">+</span> Add
                </button>
              </div>
              <div
                v-else
                class="bg-white rounded-[20px] border border-[#e5e7eb] p-4 mb-6 shadow-sm"
              >
                <div class="flex justify-between items-center mb-3">
                  <span class="text-s-16 font-medium text-textDark ml-1"
                    >Auto close</span
                  >
                  <button
                    class="flex items-center gap-1.5 text-[#0052ff] text-s-14 font-bold mr-1"
                    @click="openAutoCloseModal"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                    Edit
                  </button>
                </div>
                <div
                  v-if="takeProfitPrice !== null"
                  class="flex justify-between items-center text-s-14 mb-2 ml-1"
                >
                  <span class="font-medium text-textDark">Take Profit</span>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-textDark">{{
                      formatUsd(takeProfitPrice)
                    }}</span>
                    <span
                      v-if="takeProfitPct !== null"
                      class="text-[#00c896] font-bold text-s-12"
                      >({{ takeProfitPct >= 0 ? '+' : ''
                      }}{{ takeProfitPct.toFixed(0) }}%)</span
                    >
                    <button
                      class="text-[#0052ff] font-bold text-s-16 ml-1 hover:opacity-70"
                      @click="clearTakeProfit"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div
                  v-if="stopLossPrice !== null"
                  class="flex justify-between items-center text-s-14 ml-1"
                >
                  <span class="font-medium text-textDark">Stop Loss</span>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-textDark">{{
                      formatUsd(stopLossPrice)
                    }}</span>
                    <span
                      v-if="stopLossPct !== null"
                      class="text-[#ff5b5a] font-bold text-s-12"
                      >({{ stopLossPct >= 0 ? '+' : ''
                      }}{{ stopLossPct.toFixed(0) }}%)</span
                    >
                    <button
                      class="text-[#0052ff] font-bold text-s-16 ml-1 hover:opacity-70"
                      @click="clearStopLoss"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add to Position Button -->
            <div class="pb-10 px-4">
              <button
                class="w-full bg-[#00c896] text-white rounded-full py-4 text-s-16 font-bold hoverOpacity transition-all active:scale-[0.98] truncate px-4"
                :class="
                  submitDisabled
                    ? 'bg-[#e5e7eb] text-grey-40 cursor-not-allowed shadow-none opacity-80'
                    : ''
                "
                :disabled="submitDisabled"
                @click="showConfirmation"
              >
                {{ submitButtonLabel }}
              </button>
            </div>
          </template>

          <!-- CLOSE MODE -->
          <template v-else>
            <div class="bg-[#edf2fa] rounded-[24px] pt-5 pb-5 px-4 mb-8">
              <p class="text-s-14 font-bold text-textDark mb-3 ml-2">
                Amount to close
              </p>

              <div
                class="bg-white rounded-[20px] p-4 shadow-sm border border-[#e5e7eb]"
              >
                <p
                  class="font-bold text-[36px] text-textDark mb-3 tracking-tight"
                >
                  {{
                    closeAmount ? formatUsd(parseFloat(closeAmount)) : '$0.00'
                  }}
                </p>

                <div class="relative mb-6 px-1">
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
                </div>

                <div class="flex justify-between gap-2">
                  <button
                    v-for="pct in [0, 25, 50, 75, 100]"
                    :key="pct"
                    class="h-8 flex-1 border border-[#e5e7eb] hover:border-grey-300 hover:text-textDark rounded-full text-xs sm:text-[13px] font-bold text-textDark transition-all flex items-center justify-center bg-white"
                    @click="setClosePercentage(pct)"
                  >
                    {{ pct }}%
                  </button>
                </div>
              </div>
            </div>

            <!-- Close Error -->
            <div
              v-if="closeError"
              class="mx-4 mb-4 bg-[#fff0f0] border border-[#ffcccc] rounded-[16px] p-4"
            >
              <p class="text-[#ff5b5a] text-s-14 font-medium">
                {{ closeError }}
              </p>
            </div>

            <!-- Close Position Button -->
            <div class="pb-10 px-4">
              <button
                class="w-full bg-[#00c896] text-white rounded-full py-4 text-s-18 font-bold hoverOpacity transition-all active:scale-[0.98]"
                :class="
                  closeDisabled
                    ? 'bg-[#e5e7eb] text-grey-40 cursor-not-allowed shadow-none opacity-80'
                    : ''
                "
                :disabled="closeDisabled"
                @click="showCloseConfirmation"
              >
                {{ closeButtonLabel }}
              </button>
            </div>
          </template>
        </template>
      </div>
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
              <span class="font-bold text-s-20 text-textDark"
                >Confirm
                {{ orderSide === 'buy' ? 'Long' : 'Short' }}
                {{ displaySymbol }}</span
              >
            </div>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-greyLight transition-colors text-textDark"
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
          <div class="bg-[#edf2fa] rounded-[20px] p-5 mb-5 space-y-3">
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium">Side</span>
              <span
                class="font-bold"
                :class="
                  orderSide === 'buy' ? 'text-[#00c896]' : 'text-[#ff5b5a]'
                "
                >{{ orderSide === 'buy' ? 'Long' : 'Short' }}</span
              >
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium">Order type</span>
              <span class="text-textDark font-bold">{{
                orderType === 'market' ? 'Market' : 'Limit'
              }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium">Market price</span>
              <span class="text-textDark font-bold">{{
                formatUsd(currentPrice)
              }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium">Margin</span>
              <span class="text-textDark font-bold">{{
                formatUsd(parseFloat(inputAmount) || 0)
              }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium">Leverage</span>
              <span class="text-textDark font-bold">{{ leverage }}&times;</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium">Position size</span>
              <span class="text-textDark font-bold">{{
                formatUsd(positionSizeUsd)
              }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium"
                >Size ({{ displaySymbol }})</span
              >
              <span class="text-textDark font-bold">{{ orderSize }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium">Est. liquidation</span>
              <span class="text-textDark font-bold">{{
                estimatedLiquidation ? formatUsd(estimatedLiquidation) : '$0.00'
              }}</span>
            </div>
            <div
              v-if="takeProfitPrice !== null"
              class="flex justify-between text-s-14"
            >
              <span class="text-[#58595b] font-medium">Take Profit</span>
              <span class="text-[#00c896] font-bold">{{
                formatUsd(takeProfitPrice)
              }}</span>
            </div>
            <div
              v-if="stopLossPrice !== null"
              class="flex justify-between text-s-14"
            >
              <span class="text-[#58595b] font-medium">Stop Loss</span>
              <span class="text-[#ff5b5a] font-bold">{{
                formatUsd(stopLossPrice)
              }}</span>
            </div>
          </div>

          <!-- Error -->
          <div
            v-if="orderError"
            class="bg-[#fff0f0] border border-[#ffcccc] rounded-[16px] p-4 mb-5"
          >
            <p class="text-[#ff5b5a] text-s-14 font-medium">{{ orderError }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              class="flex-1 border border-[#e5e7eb] text-textDark rounded-full py-3.5 text-s-16 font-bold hover:bg-greyLight transition-colors"
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
              <span class="font-bold text-s-20 text-textDark"
                >Confirm Close
                {{ displaySymbol }}
                {{
                  activePosition?.direction === 'long' ? 'Long' : 'Short'
                }}</span
              >
            </div>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-greyLight transition-colors text-textDark"
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
          <div class="bg-[#edf2fa] rounded-[20px] p-5 mb-5 space-y-3">
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium">Side</span>
              <span
                class="font-bold"
                :class="
                  activePosition?.direction === 'long'
                    ? 'text-[#ff5b5a]'
                    : 'text-[#00c896]'
                "
                >{{
                  activePosition?.direction === 'long'
                    ? 'Sell (Close Long)'
                    : 'Buy (Close Short)'
                }}</span
              >
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium">Order type</span>
              <span class="text-textDark font-bold">Market</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium">Market price</span>
              <span class="text-textDark font-bold">{{
                formatUsd(currentPrice)
              }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium">Close amount</span>
              <span class="text-textDark font-bold">{{
                formatUsd(parseFloat(closeAmount) || 0)
              }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium"
                >Size ({{ displaySymbol }})</span
              >
              <span class="text-textDark font-bold">{{ closeOrderSize }}</span>
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium">Close percentage</span>
              <span class="text-textDark font-bold"
                >{{ Math.round(closeSliderValue) }}%</span
              >
            </div>
            <div class="flex justify-between text-s-14">
              <span class="text-[#58595b] font-medium">Current P&amp;L</span>
              <span
                class="font-bold"
                :class="positionPnl >= 0 ? 'text-[#00c896]' : 'text-[#ff5b5a]'"
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
            <p class="text-[#ff5b5a] text-s-14 font-medium">{{ closeError }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              class="flex-1 border border-[#e5e7eb] text-textDark rounded-full py-3.5 text-s-16 font-bold hover:bg-greyLight transition-colors"
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
            <span class="font-bold text-s-22 text-textDark">Select Market</span>
            <button
              class="absolute right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-greyLight transition-colors text-textDark"
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
                class="flex items-center gap-1 text-s-13 font-bold text-textDark whitespace-nowrap border border-[#e5e7eb] rounded-full px-3 py-1 hover:bg-greyLight transition-colors"
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
                    ? 'bg-white text-textDark shadow-sm'
                    : 'text-grey-40 hover:text-textDark'
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
                    <span class="font-bold text-s-15 text-textDark">{{
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
                <p class="font-bold text-s-15 text-textDark">
                  {{ formatContractPrice(contract) }}
                </p>
                <p
                  class="text-s-12 font-medium"
                  :class="
                    parseFloat(contract.priceChangePercent ?? '0') >= 0
                      ? 'text-[#00c896]'
                      : 'text-[#ff5b5a]'
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
              <span class="font-bold text-s-20 text-textDark"
                >{{ displaySymbol }} Leverage</span
              >
            </div>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-greyLight transition-colors text-textDark"
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
          <div class="bg-[#edf2fa] rounded-[20px] p-5 mb-5">
            <!-- +/- Controls -->
            <div class="flex items-center justify-center gap-6 mb-5">
              <button
                class="w-10 h-10 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center text-textDark hover:bg-greyLight transition-colors text-s-20"
                :disabled="tempLeverage <= 1"
                :class="{ 'opacity-30 cursor-not-allowed': tempLeverage <= 1 }"
                @click="tempLeverage = Math.max(1, tempLeverage - 1)"
              >
                &minus;
              </button>
              <span
                class="font-bold text-[40px] text-textDark tracking-tight min-w-[100px] text-center"
                >{{ tempLeverage }}&times;</span
              >
              <button
                class="w-10 h-10 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center text-textDark hover:bg-greyLight transition-colors text-s-20"
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
                :class="tempLeverage >= tick ? 'text-textDark' : 'text-grey-40'"
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
          <p class="text-s-14 text-[#58595b] mb-6 leading-relaxed">
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
            <p class="text-[#ff5b5a] text-s-14 font-medium">
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
            <span class="font-bold text-s-20 text-textDark">Auto close</span>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-greyLight transition-colors text-textDark"
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
              <span class="font-bold text-s-16 text-textDark">{{
                displaySymbol
              }}</span>
            </div>
            <div class="text-right">
              <span class="text-[#58595b] text-s-14 mr-2">Current price</span>
              <span class="font-bold text-s-16 text-textDark">{{
                formatUsd(currentPrice)
              }}</span>
            </div>
          </div>

          <!-- Take Profit -->
          <div class="bg-[#edf2fa] rounded-[20px] p-5 mb-4">
            <div class="flex justify-between items-center mb-3 px-1">
              <p class="text-s-14 font-bold text-textDark">
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
                  class="flex items-center gap-1 text-s-14 font-medium text-[#58595b]"
                >
                  Price
                </div>
                <p class="font-bold text-[28px] text-textDark tracking-tight">
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
                      : 'border-[#e5e7eb] text-textDark hover:border-grey-300'
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
                <span class="text-[#58595b]">Projected profit</span>
                <span class="text-[#00c896] font-bold ml-2"
                  >+{{ formatUsd(Math.abs(tempProjectedProfit)) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Stop Loss -->
          <div class="bg-[#edf2fa] rounded-[20px] p-5 mb-6">
            <div class="flex justify-between items-center mb-3 px-1">
              <p class="text-s-14 font-bold text-textDark">
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
                  class="flex items-center gap-1 text-s-14 font-medium text-[#58595b]"
                >
                  Price
                </div>
                <p class="font-bold text-[28px] text-textDark tracking-tight">
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
                      : 'border-[#e5e7eb] text-textDark hover:border-grey-300'
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
                <span class="text-[#58595b]">Projected loss</span>
                <span class="text-[#ff5b5a] font-bold ml-2"
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
import {
  formatUsd,
  formatPnl,
  formatContractPrice,
  formatPriceChange,
} from './utils/formatters'
import { getLogoUrl } from './utils/market'
import { usePerpsTradeForm } from './composables/usePerpsTradeForm'
import { useWalletStore } from '@/stores/walletStore'
import { useAccessStore } from '@/stores/accessStore'
import { storeToRefs } from 'pinia'

const walletStore = useWalletStore()
const { isWalletConnected, isWatchOnly } = storeToRefs(walletStore)
const accessStore = useAccessStore()

const connectWallet = () => {
  accessStore.openAccessDialog()
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
  orderType,
  inputAmount,
  leverage,
  sliderValue,
  positionSizeUsd,
  estimatedLiquidation,
  orderSize,
  availableMargin,
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
  setClosePercentage,
  onCloseSliderInput,
  confirmAndClosePosition,
  showCloseConfirmation,
  // Auto Close
  showAutoCloseModal,
  hasAutoClose,
  takeProfitPrice,
  stopLossPrice,
  takeProfitPct,
  stopLossPct,
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
  clearTakeProfit,
  clearStopLoss,
  // Submit
  isSubmitting,
  submitDisabled,
  submitButtonLabel,
  orderError,
  showConfirmModal,
  showConfirmation,
  confirmAndSubmitOrder,
  // Slider
  setPercentage,
  onSliderInput,
  toggleOrderType,
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
</script>

<style scoped>
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0052ff;
  border: 4px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: transform 0.1s;
}

.slider-input:active::-webkit-slider-thumb {
  transform: scale(1.1);
}

.slider-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0052ff;
  border: 4px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.leverage-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0052ff;
  border: 4px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: transform 0.1s;
}

.leverage-slider:active::-webkit-slider-thumb {
  transform: scale(1.1);
}

.leverage-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0052ff;
  border: 4px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.market-list-scroll::-webkit-scrollbar {
  width: 6px;
}

.market-list-scroll::-webkit-scrollbar-track {
  background: transparent;
  margin: 8px 0;
}

.market-list-scroll::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.market-list-scroll::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.market-list-scroll {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}
</style>
