<template>
  <div class="flex flex-col w-full">
    <!-- Header -->
    <div class="px-4 lg:px-10 pt-6 pb-4 mr-[72px] xs:mr-[80px]">
      <div class="flex items-start gap-4">
        <img
          :src="getLogoUrl(baseCurrency)"
          :alt="baseCurrency"
          class="w-10 h-10 xs:w-14 xs:h-14 rounded-full"
        />
        <div class="flex flex-col">
          <div class="flex items-end gap-2">
            <span
              class="text-s-20 xs:text-s-24 xl:text-s-28 font-bold leading-tight"
            >
              {{ displayName }} &bull; Perpetual
            </span>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-s-20 xs:text-s-24">
              {{ formatPrice(currentPrice) }}
            </span>
            <span
              v-if="priceChangePercent !== null"
              :class="[
                priceChangePercent >= 0 ? 'text-success' : 'text-error',
                'text-s-14',
              ]"
            >
              {{ priceChangePercent >= 0 ? '↗' : '↘' }}
              {{ formatPercent(priceChangePercent) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="px-4 lg:px-10 py-4 border-t border-grey-10">
      <div class="flex items-center gap-1 mb-4">
        <button
          v-for="interval in chartIntervals"
          :key="interval.value"
          :class="[
            'px-3 py-1 rounded-full text-s-12 font-medium transition-colors',
            selectedInterval === interval.value
              ? 'bg-primary text-white'
              : 'text-info hoverNoBG',
          ]"
          @click="selectedInterval = interval.value"
        >
          {{ interval.label }}
        </button>
      </div>
      <div class="h-[200px] sm:h-[320px]">
        <chart-price
          v-if="!chartLoading && chartLabels.length > 0"
          :labels="chartLabels"
          :points="chartPoints"
          :time-frame="chartTimeFrame"
          class="w-full h-full"
        />
        <div
          v-else
          class="w-full bg-surface h-full rounded-lg"
          :class="{ 'animate-pulse': chartLoading }"
        >
          <div class="flex flex-col items-center h-full justify-center gap-2">
            <p v-if="!chartLoading" class="text-s-14 text-info">
              No chart data
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Positions for this market -->
    <div class="px-4 lg:px-10 py-4 border-t border-grey-10">
      <div class="flex bg-surface rounded-full p-1 w-fit mb-4">
        <button
          v-for="tab in infoTabs"
          :key="tab.key"
          :class="[
            'px-4 py-1.5 rounded-full text-s-13 font-bold transition-colors',
            activeInfoTab === tab.key
              ? 'bg-white shadow-container'
              : 'hoverNoBG',
          ]"
          @click="activeInfoTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="bg-white rounded-20 p-6 sm:p-8">
        <template v-if="activeInfoTab === 'positions'">
          <div v-if="!token" class="text-center py-6 text-info text-s-14">
            Sign in to view positions
          </div>
          <div
            v-else-if="marketPositions.length === 0"
            class="text-center py-6 text-info text-s-14"
          >
            You don't have any active {{ baseCurrency }} positions
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-s-14 min-w-[600px]">
              <thead>
                <tr
                  class="border-b border-grey-10 text-info uppercase text-s-11 tracking-wider"
                >
                  <th class="py-2 text-left font-medium">Side</th>
                  <th class="py-2 text-right font-medium">Size</th>
                  <th class="py-2 text-right font-medium">Entry</th>
                  <th class="py-2 text-right font-medium">Mark</th>
                  <th class="py-2 text-right font-medium">PnL</th>
                  <th class="py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="pos in marketPositions"
                  :key="pos.market"
                  class="border-b border-grey-10 last:border-0"
                >
                  <td class="py-3">
                    <span
                      :class="[
                        pos.direction === 'long'
                          ? 'text-success'
                          : 'text-error',
                        'font-bold capitalize',
                      ]"
                    >
                      {{ pos.direction }} {{ pos.leverage }}x
                    </span>
                  </td>
                  <td class="py-3 text-right font-bold">
                    {{ formatUsd(pos.notionalValue) }}
                  </td>
                  <td class="py-3 text-right font-bold">
                    {{ formatPrice(pos.averageEntryPrice) }}
                  </td>
                  <td class="py-3 text-right font-bold">
                    {{ formatPrice(pos.markPrice) }}
                  </td>
                  <td class="py-3 text-right">
                    <span
                      :class="pnlColor(pos.unrealizedPnl)"
                      class="font-bold"
                    >
                      {{ formatPnl(pos.unrealizedPnl) }}
                    </span>
                  </td>
                  <td class="py-3 text-right">
                    <button
                      class="bg-primary text-white rounded-full px-3 py-1 text-s-12 font-medium hoverOpacity"
                      :disabled="closingMarket === pos.market"
                      @click="handleClose(pos)"
                    >
                      {{
                        closingMarket === pos.market ? 'Closing...' : 'Close'
                      }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <template v-else-if="activeInfoTab === 'orders'">
          <div v-if="!token" class="text-center py-6 text-info text-s-14">
            Sign in to view orders
          </div>
          <div
            v-else-if="marketOrders.length === 0"
            class="text-center py-6 text-info text-s-14"
          >
            No orders for {{ baseCurrency }}
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-s-14 min-w-[600px] table-fixed">
              <thead>
                <tr
                  class="border-b border-grey-10 text-info uppercase text-s-11 tracking-wider"
                >
                  <th class="py-2 pr-4 text-left font-medium w-[15%]">Side</th>
                  <th class="py-2 px-4 text-left font-medium w-[15%]">Type</th>
                  <th class="py-2 px-4 text-right font-medium w-[25%]">
                    Price
                  </th>
                  <th class="py-2 px-4 text-right font-medium w-[20%]">Size</th>
                  <th class="py-2 pl-4 text-right font-medium w-[25%]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="order in marketOrders"
                  :key="order.orderId"
                  class="border-b border-grey-10 last:border-0"
                >
                  <td class="py-3 pr-4">
                    <span
                      :class="[
                        order.side === 'buy' ? 'text-success' : 'text-error',
                        'font-bold capitalize',
                      ]"
                    >
                      {{ order.side }}
                    </span>
                  </td>
                  <td class="py-3 px-4 capitalize font-bold">
                    {{ order.type }}
                  </td>
                  <td class="py-3 px-4 text-right font-bold">
                    {{ formatPrice(order.price) }}
                  </td>
                  <td class="py-3 px-4 text-right font-bold">
                    {{ order.size }}
                  </td>
                  <td class="py-3 pl-4 text-right capitalize font-bold">
                    {{ order.status }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <template v-else-if="activeInfoTab === 'fills'">
          <div v-if="!token" class="text-center py-6 text-info text-s-14">
            Sign in to view fills
          </div>
          <div
            v-else-if="marketFills.length === 0"
            class="text-center py-6 text-info text-s-14"
          >
            No fills for {{ baseCurrency }}
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-s-14 min-w-[500px]">
              <thead>
                <tr
                  class="border-b border-grey-10 text-info uppercase text-s-11 tracking-wider"
                >
                  <th class="py-2 text-left font-medium">Side</th>
                  <th class="py-2 text-right font-medium">Price</th>
                  <th class="py-2 text-right font-medium">Size</th>
                  <th class="py-2 text-right font-medium">Fee</th>
                  <th class="py-2 text-right font-medium">PnL</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="fill in marketFills"
                  :key="fill.id"
                  class="border-b border-grey-10 last:border-0"
                >
                  <td class="py-3">
                    <span
                      :class="[
                        fill.side === 'buy' ? 'text-success' : 'text-error',
                        'font-bold capitalize',
                      ]"
                    >
                      {{ fill.side }}
                    </span>
                  </td>
                  <td class="py-3 text-right font-bold">
                    {{ formatPrice(fill.price) }}
                  </td>
                  <td class="py-3 text-right font-bold">{{ fill.size }}</td>
                  <td class="py-3 text-right font-bold">
                    {{ formatUsd(fill.fee) }}
                  </td>
                  <td class="py-3 text-right">
                    <span
                      v-if="fill.pnl"
                      :class="pnlColor(fill.pnl)"
                      class="font-bold"
                    >
                      {{ formatPnl(fill.pnl) }}
                    </span>
                    <span v-else class="text-info">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>

    <!-- Market Stats -->
    <div class="px-4 lg:px-10 py-4 border-t border-grey-10">
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div>
          <p
            class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
          >
            Price
          </p>
          <p class="text-s-14 font-bold">
            {{ formatPrice(currentPrice) }}
          </p>
        </div>
        <div>
          <p
            class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
          >
            Mark Price
          </p>
          <p class="text-s-14 font-bold">
            {{ formatPrice(markPrice) }}
          </p>
        </div>
        <div>
          <p
            class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
          >
            24hr Trade Vol
          </p>
          <p class="text-s-14 font-bold">
            {{ formatVolume(contractData?.usdVolume) }}
          </p>
        </div>
        <div>
          <p
            class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
          >
            Open Interest
          </p>
          <p class="text-s-14 font-bold">
            {{ formatVolume(contractData?.openInterestUsd) }}
          </p>
        </div>
        <div>
          <p
            class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
          >
            Funding Countdown
          </p>
          <p class="text-s-14 font-bold">
            {{
              contractData?.fundingRate
                ? `${(parseFloat(contractData.fundingRate) * 100).toFixed(4)}%`
                : '—'
            }}
            <span v-if="fundingCountdown" class="text-info text-s-12">
              in {{ fundingCountdown }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- About -->
    <div class="px-4 lg:px-10 py-4 border-t border-grey-10">
      <h3 class="text-s-20 font-bold mb-3">About {{ baseCurrency }}</h3>
      <p class="text-s-14 text-info leading-relaxed">
        {{ stockDescription }}
      </p>
    </div>

    <!-- Instrument Info -->
    <div class="px-4 lg:px-10 py-4 border-t border-grey-10">
      <h3 class="text-s-20 font-bold mb-3">Instrument Information</h3>
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div>
          <p
            class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
          >
            Asset Name
          </p>
          <p class="text-s-14 font-bold">{{ displayName }}</p>
        </div>
        <div>
          <p
            class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
          >
            Ticker
          </p>
          <p class="text-s-14 font-bold">{{ baseCurrency }}</p>
        </div>
        <div>
          <p
            class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
          >
            Category
          </p>
          <p class="text-s-14 font-bold">{{ category }}</p>
        </div>
        <div>
          <p
            class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
          >
            24H High
          </p>
          <p class="text-s-14 font-bold">
            {{ formatPrice(stockData?.primaryMarket?.high24h) }}
          </p>
        </div>
        <div>
          <p
            class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
          >
            24H Low
          </p>
          <p class="text-s-14 font-bold">
            {{ formatPrice(stockData?.primaryMarket?.low24h) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import ChartPrice from '@/components/ChartPrice.vue'
import { perpsClient } from './configs'
import {
  usePerpsMarkets,
  usePerpsContracts,
} from './composables/usePerpsMarkets'
import { usePerpsPositions } from './composables/usePerpsPositions'
import { usePerpsAuth } from './composables/usePerpsAuth'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import type { GetWebStocksInfoSummaryResponse } from '@/mew_api/types'
import type { Position, ApiOrder, ApiFill, MarkPrice } from './sdk/types'
import {
  formatUsd,
  formatPrice,
  formatPnl,
  pnlColor,
  formatPercent,
  formatVolume,
} from './utils/formatters'
import {
  getLogoUrl,
  getCategory,
  midPrice as computeMidPrice,
} from './utils/market'

const props = defineProps({
  market: {
    type: String,
    required: true,
  },
})

const { token } = usePerpsAuth()
const { markets } = usePerpsMarkets()
const { contracts } = usePerpsContracts()
const { positions, closePosition } = usePerpsPositions()

const baseCurrency = computed(() => props.market.split('-')[0] ?? props.market)

const displayName = computed(() => {
  const pair = markets.value.find(m => m.market === props.market)
  return pair?.displayName ?? baseCurrency.value
})

const contractData = computed(() =>
  contracts.value.find(c => c.market === props.market),
)

const currentPrice = computed(() => {
  const c = contractData.value
  if (!c) return undefined
  return computeMidPrice(c)
})

const priceChangePercent = computed(() => {
  const pct = contractData.value?.priceChangePercent
  if (!pct) return null
  return parseFloat(pct)
})

const category = computed(() => {
  const c = contractData.value
  return c ? getCategory(c) : 'Equities'
})

// Fetch stock description from MEW API
const { useMEWFetch } = useFetchMewApi()
const stockFetchUrl = computed(
  () => `/v1/web/pages/stocks-info/stocks/${baseCurrency.value}on/summary`,
)
const stockData = ref<GetWebStocksInfoSummaryResponse | undefined>(undefined)
const { data: stockResponse, onFetchResponse } = useMEWFetch(stockFetchUrl, {
  refetch: true,
})
  .get()
  .json<GetWebStocksInfoSummaryResponse>()
onFetchResponse(() => {
  if (stockResponse.value) stockData.value = stockResponse.value
})
const stockDescription = computed(
  () =>
    stockData.value?.description ??
    `${baseCurrency.value}-PERP is a perpetual futures contract tracking the ${displayName.value} asset. Trade with up to 20x leverage.`,
)

const marketPositions = computed(() =>
  positions.value.filter(p => p.market === props.market),
)

// Mark price
const markPrices = ref<Record<string, MarkPrice>>({})

async function fetchMarkPrices() {
  try {
    const res = await perpsClient.getMarkPrices()
    markPrices.value = res.result ?? {}
  } catch {
    markPrices.value = {}
  }
}

fetchMarkPrices()

const markPrice = computed(() => {
  const mp = markPrices.value[props.market]
  return mp?.price
})

// Orders and fills for this market
const marketOrders = ref<ApiOrder[]>([])
const marketFills = ref<ApiFill[]>([])

async function fetchMarketOrders() {
  if (!token.value) return
  try {
    const res = await perpsClient.getOrders({ market: props.market })
    marketOrders.value = res.result ?? []
  } catch {
    marketOrders.value = []
  }
}

async function fetchMarketFills() {
  if (!token.value) return
  try {
    const res = await perpsClient.getFills({ market: props.market })
    marketFills.value = res.result ?? []
  } catch {
    marketFills.value = []
  }
}

watch(
  () => token.value,
  t => {
    if (t) {
      fetchMarketOrders()
      fetchMarketFills()
    }
  },
  { immediate: true },
)

// Funding countdown timer
const fundingCountdown = ref('')
let countdownTimer: ReturnType<typeof setInterval> | null = null

function updateFundingCountdown() {
  const ts = contractData.value?.nextFundingRateTimestamp
  if (!ts) {
    fundingCountdown.value = ''
    return
  }
  const diff = new Date(ts).getTime() - Date.now()
  if (diff <= 0) {
    fundingCountdown.value = 'now'
    return
  }
  const mins = Math.floor(diff / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  fundingCountdown.value = `${mins} min`
  if (mins === 0) fundingCountdown.value = `${secs}s`
}

countdownTimer = setInterval(updateFundingCountdown, 5000)
updateFundingCountdown()

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

// Tabs
const activeInfoTab = ref('positions')
const infoTabs = [
  { key: 'positions', label: 'Positions' },
  { key: 'orders', label: 'Orders' },
  { key: 'fills', label: 'Fills' },
]

const closingMarket = ref<string | null>(null)

async function handleClose(pos: Position) {
  closingMarket.value = pos.market
  try {
    await closePosition(pos)
  } finally {
    closingMarket.value = null
  }
}

// Chart
const chartIntervals = [
  { label: '1M', value: '1' },
  { label: '5M', value: '5' },
  { label: '1H', value: '60' },
  { label: '4H', value: '240' },
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
]
const selectedInterval = ref('15')
const chartLoading = ref(false)
const chartLabels = ref<number[]>([])
const chartPoints = ref<number[]>([])

const chartCache = new Map<string, { labels: number[]; points: number[] }>()

const chartTimeFrame = computed(() => {
  const v = selectedInterval.value
  if (v === '1D') return '1D' as const
  if (v === '1W') return '7D' as const
  const mins = parseInt(v)
  if (mins <= 60) return '1D' as const
  if (mins <= 480) return '7D' as const
  return '1M' as const
})

function getResolutionSeconds(res: string): number {
  if (res === '1D') return 86400
  if (res === '1W') return 604800
  return parseInt(res) * 60
}

async function fetchChart() {
  const cacheKey = `${props.market}-${selectedInterval.value}`
  const cached = chartCache.get(cacheKey)
  if (cached) {
    chartLabels.value = cached.labels
    chartPoints.value = cached.points
    return
  }

  chartLoading.value = true
  try {
    const to = Math.floor(Date.now() / 1000)
    const resSecs = getResolutionSeconds(selectedInterval.value)
    const from = to - resSecs * 200
    const data = await perpsClient.getHistory(
      props.market,
      selectedInterval.value,
      from,
      to,
    )
    if (data.s === 'ok' && data.t.length > 0) {
      const labels = data.t.map(t => t * 1000)
      chartLabels.value = labels
      chartPoints.value = data.c
      chartCache.set(cacheKey, { labels, points: data.c })
    } else {
      chartLabels.value = []
      chartPoints.value = []
    }
  } catch {
    chartLabels.value = []
    chartPoints.value = []
  } finally {
    chartLoading.value = false
  }
}

watch(selectedInterval, fetchChart)
watch(() => props.market, fetchChart, { immediate: true })

// Clear chart cache every 5 minutes
const cacheClearTimer = setInterval(() => chartCache.clear(), 5 * 60 * 1000)
onUnmounted(() => clearInterval(cacheClearTimer))
</script>
