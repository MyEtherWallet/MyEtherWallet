<template>
  <div class="w-full max-w-[500px] mx-auto relative h-full flex flex-col">
    <!-- Header: Asset Info -->
    <div class="flex items-center justify-between mb-4 px-4 pt-2">
      <div>
        <p class="font-bold text-s-28 tracking-tight">Perps</p>
      </div>
      <button
        class="text-[#0052ff] font-medium text-s-14 hover:opacity-80 transition-opacity"
      >
        Clear all
      </button>
    </div>

    <div
      v-if="!token"
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
              class="text-[#00c896] text-s-12 font-medium text-right flex items-center justify-end gap-1"
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
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
              {{ priceChange.toFixed(2) }}%
            </p>
          </div>
        </div>

        <!-- Long / Short Toggle + Order Type on same row -->
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
            <p class="font-bold text-[36px] text-textDark mb-3 tracking-tight">
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
            class="bg-white rounded-[20px] border border-[#e5e7eb] p-4 mb-6 flex justify-between items-center cursor-pointer shadow-sm"
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
            @click="submitOrder"
          >
            <span v-if="isSubmitting">Processing...</span>
            <span v-else
              >{{ orderSide === 'buy' ? 'Long' : 'Short' }}
              {{ displaySymbol }}</span
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import type { MaxOrderSizeResult } from './sdk/types'
import { perpsClient } from './configs'
import { usePerpsAuth, usePerpsBalance } from './composables/usePerpsAuth'
import {
  usePerpsMarkets,
  usePerpsContracts,
} from './composables/usePerpsMarkets'

type OrderSide = 'buy' | 'sell'
type OrderType = 'market' | 'limit'

const walletMenuStore = useWalletMenuStore()
const { token, login } = usePerpsAuth()
const { balance } = usePerpsBalance()
const { markets } = usePerpsMarkets()
const { contracts } = usePerpsContracts()

// State
const orderSide = ref<OrderSide>('buy')
const orderType = ref<OrderType>('market')
const inputAmount = ref('')
const leverage = ref(1)
const sliderValue = ref(0)

const isSubmitting = ref(false)
const markPriceData = ref<any>(null)
const maxOrderSize = ref<MaxOrderSizeResult | null>(null)

// Computed
const activeMarket = computed(
  () => walletMenuStore.selectedTradeTokenSymbol || 'AAPL-USD',
)
const displaySymbol = computed(() => activeMarket.value.split('-')[0])
const fullMarketName = computed(() => {
  const match = markets.value.find(m => m.pair.base === displaySymbol.value)
  return match?.market || activeMarket.value
})

const currentPrice = computed(() => {
  const contract = contracts.value.find(c => c.market === fullMarketName.value)
  if (contract) {
    const bid = parseFloat(contract.bid ?? '')
    const ask = parseFloat(contract.ask ?? '')
    if (!isNaN(bid) && !isNaN(ask)) return (bid + ask) / 2
    if (contract.indexPrice) return parseFloat(contract.indexPrice)
  }
  if (markPriceData.value?.[fullMarketName.value]) {
    return parseFloat(markPriceData.value[fullMarketName.value].price)
  }
  return 0
})

const priceChange = computed(() => {
  const contract = contracts.value.find(c => c.market === fullMarketName.value)
  if (contract?.priceChangePercent) {
    return parseFloat(contract.priceChangePercent)
  }
  return 0
})

const availableMargin = computed(() => {
  const bal = parseFloat(balance.value?.availableMargin || '0')
  return bal
})

const positionSizeUsd = computed(() => {
  const amt = parseFloat(inputAmount.value) || 0
  return amt * leverage.value
})

const estimatedLiquidation = computed(() => {
  if (!positionSizeUsd.value || !currentPrice.value) return 0
  const direction = orderSide.value === 'buy' ? -1 : 1
  return (
    currentPrice.value + direction * (currentPrice.value / leverage.value) * 0.9
  )
})

const submitDisabled = computed(() => {
  const amt = parseFloat(inputAmount.value)
  return !amt || amt <= 0 || amt > availableMargin.value || isSubmitting.value
})

// Methods
function formatUsd(val: number): string {
  if (isNaN(val)) return '$0.00'
  return val.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: val % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

function getBaseSizeForPercent(pct: number): number | null {
  if (!maxOrderSize.value) return null
  const side = orderSide.value === 'buy' ? 'maxAskBaseSize' : 'maxBidBaseSize'
  const levels: Record<number, keyof MaxOrderSizeResult> = {
    25: 'percent25',
    50: 'percent50',
    75: 'percent75',
    100: 'percent100',
  }
  const levelKey = levels[pct]
  if (levelKey) {
    return parseFloat(maxOrderSize.value[levelKey][side]) || 0
  }
  // For 10%, derive from max (percent100) * 0.1
  const maxBase = parseFloat(maxOrderSize.value.percent100[side]) || 0
  return maxBase * (pct / 100)
}

function setPercentage(pct: number) {
  const baseSize = getBaseSizeForPercent(pct)
  console.log(baseSize, currentPrice)
  if (baseSize !== null && baseSize > 0 && currentPrice.value > 0) {
    const usdValue = baseSize * currentPrice.value
    inputAmount.value = usdValue.toFixed(2)
    // Update slider proportionally to max
    const maxBase = getBaseSizeForPercent(100) || 1
    sliderValue.value = Math.min((baseSize / maxBase) * 100, 100)
  }
}

function onSliderInput() {
  const maxBase = getBaseSizeForPercent(100)
  if (maxBase && maxBase > 0 && currentPrice.value > 0) {
    const baseSize = maxBase * (sliderValue.value / 100)
    const usdValue = baseSize * currentPrice.value
    inputAmount.value = usdValue.toFixed(2)
  } else if (availableMargin.value > 0) {
    inputAmount.value = (
      (availableMargin.value * sliderValue.value) /
      100
    ).toFixed(2)
  }
}

function toggleOrderType() {
  orderType.value = orderType.value === 'market' ? 'limit' : 'market'
}

function openTokenSelect() {
  // Can implement token selector modal later
}

function getLogoUrl(base: string): string {
  return `https://cdn.ondoperps.xyz/symbol-icons/${encodeURIComponent(base)}.svg`
}

async function fetchLeverage() {
  if (!token.value) return
  if (!markets.value.length) return
  try {
    const res = await perpsClient.getLeverage(fullMarketName.value)
    if (res.success && res.result?.length) {
      leverage.value = parseInt(res.result[0].leverage) || 1
    }
  } catch (e) {
    console.error('Failed to fetch leverage:', e)
  }
}

async function fetchMaxOrderSize() {
  if (!token.value) return
  // Wait for markets data so fullMarketName resolves properly
  if (!markets.value.length) return
  try {
    const res = await perpsClient.getMaxOrderSize(fullMarketName.value)
    if (res.success) {
      maxOrderSize.value = res.result
      setPercentage(10)
    }
  } catch (e) {
    console.error('Failed to fetch max order size:', e)
  }
}

async function fetchMarkPrices() {
  try {
    const res = await perpsClient.getMarkPrices()
    markPriceData.value = res.result ?? {}
  } catch (e) {
    console.error('Failed to fetch mark prices:', e)
  }
}

async function submitOrder() {
  if (submitDisabled.value) return

  isSubmitting.value = true
  try {
    const size = (positionSizeUsd.value / currentPrice.value).toFixed(4)

    await perpsClient.createOrder({
      market: fullMarketName.value,
      side: orderSide.value,
      type: orderType.value,
      size: size,
      timeInForce: 'GTC',
      postOnly: false,
      reduceOnly: false,
    })

    // Reset form on success
    inputAmount.value = ''
    // Trigger toast/notification here
  } catch (error) {
    console.error('Order failed:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchMarkPrices()
  fetchLeverage()
  fetchMaxOrderSize()
  // Poll mark prices every 5s
  setInterval(fetchMarkPrices, 5000)
})

watch(
  () => activeMarket.value,
  () => {
    // Reset form when changing markets
    inputAmount.value = ''
    sliderValue.value = 0
    maxOrderSize.value = null
    fetchLeverage()
    fetchMaxOrderSize()
  },
)

watch(
  () => token.value,
  () => {
    if (token.value) {
      fetchLeverage()
      fetchMaxOrderSize()
    }
  },
)

watch(
  () => markets.value,
  () => {
    if (markets.value.length && token.value) {
      fetchLeverage()
      fetchMaxOrderSize()
    }
  },
)
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
</style>
