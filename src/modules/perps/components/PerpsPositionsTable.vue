<template>
  <div class="bg-white rounded-20 p-6 sm:p-8">
    <div class="flex items-center justify-between mb-4">
      <p class="font-bold text-s-24">Positions</p>
      <div class="flex bg-surface rounded-full p-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="[
            'px-4 py-1.5 rounded-full text-s-13 font-medium transition-colors',
            activeTab === tab.key
              ? 'bg-white shadow-container'
              : 'text-info hoverNoBG',
          ]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span
            v-if="tab.key === 'positions' && positions.length > 0"
            class="ml-1 text-info"
          >
            · {{ positions.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- Not authenticated -->
    <div v-if="!token" class="text-center py-8 text-info text-s-14">
      Sign in to view positions
    </div>

    <!-- Loading -->
    <div
      v-else-if="loading && positions.length === 0"
      class="text-center py-8 text-info text-s-14"
    >
      Loading positions...
    </div>

    <!-- Positions tab -->
    <template v-else-if="activeTab === 'positions'">
      <div
        v-if="positions.length === 0"
        class="text-center py-8 text-info text-s-14"
      >
        No open positions
      </div>
      <div v-else class="overflow-x-auto -mx-6 sm:-mx-8">
        <table class="w-full text-s-13 min-w-[900px]">
          <thead>
            <tr
              class="border-b border-grey-10 text-info uppercase text-s-11 tracking-wider"
            >
              <th class="px-6 sm:px-8 py-3 text-left font-medium">Market</th>
              <th class="px-3 py-3 text-left font-medium">Leverage</th>
              <th class="px-3 py-3 text-right font-medium">Value</th>
              <th class="px-3 py-3 text-right font-medium">Unrealized PnL</th>
              <th class="px-3 py-3 text-right font-medium">Entry Price</th>
              <th class="px-3 py-3 text-right font-medium">Mark Price</th>
              <th class="px-3 py-3 text-right font-medium">
                Liquidation Price
              </th>
              <th class="px-3 py-3 text-right font-medium">Margin Used</th>
              <th class="px-3 py-3 text-right font-medium">Total Funding</th>
              <th class="px-6 sm:px-8 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="pos in positions"
              :key="pos.market"
              class="border-b border-grey-10 last:border-0"
            >
              <td class="px-6 sm:px-8 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="getLogoUrl(getBase(pos.market))"
                    :alt="pos.market"
                    class="w-8 h-8 rounded-full"
                  />
                  <span class="font-medium">{{ getBase(pos.market) }}</span>
                </div>
              </td>
              <td class="px-3 py-4">
                <span
                  :class="[
                    pos.direction === 'long'
                      ? 'text-success'
                      : pos.direction === 'short'
                        ? 'text-error'
                        : 'text-info',
                    'font-medium capitalize',
                  ]"
                >
                  {{ pos.direction }} {{ pos.leverage }}x
                </span>
              </td>
              <td class="px-3 py-4 text-right">
                {{ formatUsd(pos.notionalValue) }}
              </td>
              <td class="px-3 py-4 text-right">
                <span :class="pnlColor(pos.unrealizedPnl)">
                  {{ formatPnl(pos.unrealizedPnl) }}
                  ({{ formatRoe(pos.returnOnEquity) }})
                </span>
              </td>
              <td class="px-3 py-4 text-right">
                {{ formatPrice(pos.averageEntryPrice) }}
              </td>
              <td class="px-3 py-4 text-right">
                {{ formatPrice(pos.markPrice) }}
              </td>
              <td class="px-3 py-4 text-right">
                <span class="text-error">{{
                  formatPrice(pos.liquidationPrice)
                }}</span>
              </td>
              <td class="px-3 py-4 text-right">
                {{ formatUsd(pos.usedMargin) }}
              </td>
              <td class="px-3 py-4 text-right">
                <span :class="pnlColor(pos.netFundingSinceNeutral)">
                  {{ formatPnl(pos.netFundingSinceNeutral) }}
                </span>
              </td>
              <td class="px-6 sm:px-8 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="bg-success text-white rounded-full px-4 py-1.5 text-s-12 font-medium hoverOpacity"
                    @click="$emit('openPosition', pos.market)"
                  >
                    Add
                  </button>
                  <button
                    :disabled="closingMarket === pos.market"
                    class="bg-error text-white rounded-full px-4 py-1.5 text-s-12 font-medium hoverOpacity disabled:opacity-50"
                    @click="handleClose(pos)"
                  >
                    {{ closingMarket === pos.market ? 'Closing...' : 'Close' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- Other tabs placeholder -->
    <div v-else class="text-center py-8 text-info text-s-14">Coming soon</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePerpsAuth } from '../composables/usePerpsAuth'
import { usePerpsPositions } from '../composables/usePerpsPositions'
import type { Position } from '../sdk/types'

defineEmits<{
  openPosition: [market: string]
}>()

const { token } = usePerpsAuth()
const { positions, loading, closePosition } = usePerpsPositions()

const activeTab = ref<string>('positions')
const closingMarket = ref<string | null>(null)

const tabs = [
  { key: 'positions', label: 'Positions' },
  { key: 'orders', label: 'Orders' },
  { key: 'fills', label: 'Fills' },
  { key: 'deposits', label: 'Deposits & Withdrawals' },
]

function getBase(market: string): string {
  return market.split('-')[0] ?? market
}

function getLogoUrl(base: string): string {
  return `https://cdn.ondoperps.xyz/symbol-icons/${encodeURIComponent(base)}.svg`
}

function formatUsd(val: string): string {
  const n = parseFloat(val)
  if (isNaN(n)) return '$0.00'
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })
}

function formatPrice(val: string): string {
  const n = parseFloat(val)
  if (isNaN(n)) return '—'
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatPnl(val: string): string {
  const n = parseFloat(val)
  if (isNaN(n)) return '$0.00'
  const sign = n >= 0 ? '+' : ''
  return `${sign}${formatUsd(val)}`
}

function formatRoe(val: string): string {
  const n = parseFloat(val)
  if (isNaN(n)) return '0.00%'
  const pct = n * 100
  return `${pct >= 0 ? '' : ''}${pct.toFixed(2)}%`
}

function pnlColor(val: string): string {
  const n = parseFloat(val)
  if (n > 0) return 'text-success'
  if (n < 0) return 'text-error'
  return 'text-info'
}

async function handleClose(pos: Position) {
  closingMarket.value = pos.market
  try {
    await closePosition(pos)
  } finally {
    closingMarket.value = null
  }
}
</script>
