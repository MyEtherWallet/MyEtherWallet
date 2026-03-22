<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <p class="font-bold text-s-28">Positions</p>
      <div class="flex bg-surface rounded-full p-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="[
            'px-4 py-1.5 rounded-full text-s-13 font-bold transition-colors',
            activeTab === tab.key ? 'bg-white shadow-container' : 'hoverNoBG',
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

    <div class="bg-white rounded-20 p-6 sm:p-8">
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
          <table class="w-full text-s-14 min-w-[900px]">
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
                <th class="px-6 sm:px-8 py-3 text-right font-medium">
                  Actions
                </th>
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
                    <span class="font-bold">{{ getBase(pos.market) }}</span>
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
                      'font-bold capitalize',
                    ]"
                  >
                    {{ pos.direction }} {{ pos.leverage }}x
                  </span>
                </td>
                <td class="px-3 py-4 text-right font-bold">
                  {{ formatUsd(pos.notionalValue) }}
                </td>
                <td class="px-3 py-4 text-right">
                  <span :class="pnlColor(pos.unrealizedPnl)" class="font-bold">
                    {{ formatPnl(pos.unrealizedPnl) }}
                    ({{ formatRoe(pos.returnOnEquity) }})
                  </span>
                </td>
                <td class="px-3 py-4 text-right font-bold">
                  {{ formatPrice(pos.averageEntryPrice) }}
                </td>
                <td class="px-3 py-4 text-right font-bold">
                  {{ formatPrice(pos.markPrice) }}
                </td>
                <td class="px-3 py-4 text-right">
                  <span class="text-warning font-bold">{{
                    formatPrice(pos.liquidationPrice)
                  }}</span>
                </td>
                <td class="px-3 py-4 text-right font-bold">
                  {{ formatUsd(pos.usedMargin) }}
                </td>
                <td class="px-3 py-4 text-right">
                  <span
                    :class="pnlColor(pos.netFundingSinceNeutral)"
                    class="font-bold"
                  >
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
                      class="bg-primary text-white rounded-full px-4 py-1.5 text-s-12 font-medium hoverOpacity disabled:opacity-50"
                      @click="handleClose(pos)"
                    >
                      {{
                        closingMarket === pos.market ? 'Closing...' : 'Close'
                      }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Orders tab -->
      <template v-else-if="activeTab === 'orders'">
        <div
          v-if="ordersLoading && orders.length === 0"
          class="text-center py-8 text-info text-s-14"
        >
          Loading orders...
        </div>
        <div
          v-else-if="orders.length === 0"
          class="text-center py-8 text-info text-s-14"
        >
          No orders
        </div>
        <div v-else class="overflow-x-auto -mx-6 sm:-mx-8">
          <table class="w-full text-s-14 min-w-[800px]">
            <thead>
              <tr
                class="border-b border-grey-10 text-info uppercase text-s-11 tracking-wider"
              >
                <th class="px-6 sm:px-8 py-3 text-left font-medium">Market</th>
                <th class="px-3 py-3 text-left font-medium">Side</th>
                <th class="px-3 py-3 text-left font-medium">Type</th>
                <th class="px-3 py-3 text-right font-medium">Price</th>
                <th class="px-3 py-3 text-right font-medium">Size</th>
                <th class="px-3 py-3 text-right font-medium">Filled</th>
                <th class="px-3 py-3 text-right font-medium">Fee</th>
                <th class="px-3 py-3 text-left font-medium">Status</th>
                <th class="px-6 sm:px-8 py-3 text-right font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in orders"
                :key="order.orderId"
                class="border-b border-grey-10 last:border-0"
              >
                <td class="px-6 sm:px-8 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      :src="getLogoUrl(getBase(order.market))"
                      :alt="order.market"
                      class="w-8 h-8 rounded-full"
                    />
                    <span class="font-bold">{{ getBase(order.market) }}</span>
                  </div>
                </td>
                <td class="px-3 py-4">
                  <span
                    :class="[
                      order.side === 'buy' ? 'text-success' : 'text-error',
                      'font-bold capitalize',
                    ]"
                  >
                    {{ order.side }}
                  </span>
                </td>
                <td class="px-3 py-4 capitalize font-bold">{{ order.type }}</td>
                <td class="px-3 py-4 text-right font-bold">
                  {{ formatPrice(order.price) }}
                </td>
                <td class="px-3 py-4 text-right font-bold">{{ order.size }}</td>
                <td class="px-3 py-4 text-right font-bold">
                  {{ order.filledSize }}
                </td>
                <td class="px-3 py-4 text-right font-bold">
                  {{ formatUsd(order.fee) }}
                </td>
                <td class="px-3 py-4">
                  <span
                    :class="[
                      'capitalize font-bold',
                      order.status === 'open'
                        ? 'text-primary'
                        : order.status === 'fullyfilled'
                          ? 'text-success'
                          : order.status === 'canceled'
                            ? 'text-info'
                            : '',
                    ]"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 sm:px-8 py-4 text-right text-info text-s-12">
                  {{ formatDate(order.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Fills tab -->
      <template v-else-if="activeTab === 'fills'">
        <div
          v-if="fillsLoading && fills.length === 0"
          class="text-center py-8 text-info text-s-14"
        >
          Loading fills...
        </div>
        <div
          v-else-if="fills.length === 0"
          class="text-center py-8 text-info text-s-14"
        >
          No fills
        </div>
        <div v-else class="overflow-x-auto -mx-6 sm:-mx-8">
          <table class="w-full text-s-14 min-w-[800px]">
            <thead>
              <tr
                class="border-b border-grey-10 text-info uppercase text-s-11 tracking-wider"
              >
                <th class="px-6 sm:px-8 py-3 text-left font-medium">Market</th>
                <th class="px-3 py-3 text-left font-medium">Side</th>
                <th class="px-3 py-3 text-right font-medium">Price</th>
                <th class="px-3 py-3 text-right font-medium">Size</th>
                <th class="px-3 py-3 text-right font-medium">Cost</th>
                <th class="px-3 py-3 text-right font-medium">Fee</th>
                <th class="px-3 py-3 text-right font-medium">PnL</th>
                <th class="px-3 py-3 text-left font-medium">Role</th>
                <th class="px-6 sm:px-8 py-3 text-right font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="fill in fills"
                :key="fill.id"
                class="border-b border-grey-10 last:border-0"
              >
                <td class="px-6 sm:px-8 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      :src="getLogoUrl(getBase(fill.market))"
                      :alt="fill.market"
                      class="w-8 h-8 rounded-full"
                    />
                    <span class="font-bold">{{ getBase(fill.market) }}</span>
                  </div>
                </td>
                <td class="px-3 py-4">
                  <span
                    :class="[
                      fill.side === 'buy' ? 'text-success' : 'text-error',
                      'font-bold capitalize',
                    ]"
                  >
                    {{ fill.side }}
                  </span>
                </td>
                <td class="px-3 py-4 text-right font-bold">
                  {{ formatPrice(fill.price) }}
                </td>
                <td class="px-3 py-4 text-right font-bold">{{ fill.size }}</td>
                <td class="px-3 py-4 text-right font-bold">
                  {{ formatUsd(fill.filledCost) }}
                </td>
                <td class="px-3 py-4 text-right font-bold">
                  {{ formatUsd(fill.fee) }}
                </td>
                <td class="px-3 py-4 text-right">
                  <span
                    v-if="fill.pnl"
                    :class="pnlColor(fill.pnl)"
                    class="font-bold"
                  >
                    {{ formatPnl(fill.pnl) }}
                  </span>
                  <span v-else class="text-info">—</span>
                </td>
                <td class="px-3 py-4 font-bold">
                  {{ fill.isMaker ? 'Maker' : 'Taker' }}
                </td>
                <td class="px-6 sm:px-8 py-4 text-right text-info text-s-12">
                  {{ formatDate(fill.time) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Deposits & Withdrawals tab -->
      <template v-else-if="activeTab === 'deposits'">
        <div
          v-if="dwLoading && deposits.length === 0 && withdrawals.length === 0"
          class="text-center py-8 text-info text-s-14"
        >
          Loading...
        </div>
        <div
          v-else-if="deposits.length === 0 && withdrawals.length === 0"
          class="text-center py-8 text-info text-s-14"
        >
          No deposits or withdrawals
        </div>
        <div v-else class="overflow-x-auto -mx-6 sm:-mx-8">
          <table class="w-full text-s-14 min-w-[700px]">
            <thead>
              <tr
                class="border-b border-grey-10 text-info uppercase text-s-11 tracking-wider"
              >
                <th class="px-6 sm:px-8 py-3 text-left font-medium">Type</th>
                <th class="px-3 py-3 text-left font-medium">Asset</th>
                <th class="px-3 py-3 text-right font-medium">Amount</th>
                <th class="px-3 py-3 text-right font-medium">USD Value</th>
                <th class="px-3 py-3 text-left font-medium">Status</th>
                <th class="px-6 sm:px-8 py-3 text-right font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in combinedDW"
                :key="item.key"
                class="border-b border-grey-10 last:border-0"
              >
                <td class="px-6 sm:px-8 py-4">
                  <span
                    :class="[
                      'font-bold',
                      item.type === 'Deposit' ? 'text-success' : 'text-warning',
                    ]"
                  >
                    {{ item.type }}
                  </span>
                </td>
                <td class="px-3 py-4 font-bold">{{ item.coin }}</td>
                <td class="px-3 py-4 text-right font-bold">{{ item.size }}</td>
                <td class="px-3 py-4 text-right font-bold">
                  {{ item.usdValue ? formatUsd(item.usdValue) : '—' }}
                </td>
                <td class="px-3 py-4">
                  <span :class="['capitalize font-bold', item.statusColor]">
                    {{ item.statusLabel }}
                  </span>
                </td>
                <td class="px-6 sm:px-8 py-4 text-right text-info text-s-12">
                  {{ formatDate(item.time) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePerpsAuth } from '../composables/usePerpsAuth'
import { usePerpsPositions } from '../composables/usePerpsPositions'
import {
  usePerpsOrders,
  usePerpsFills,
  usePerpsDepositsWithdrawals,
} from '../composables/usePerpsHistory'
import type { Position } from '../sdk/types'
import {
  formatUsd,
  formatPrice,
  formatPnl,
  formatRoe,
  pnlColor,
  formatDate,
} from '../utils/formatters'
import { getBase, getLogoUrl } from '../utils/market'

defineEmits<{
  openPosition: [market: string]
}>()

const { token } = usePerpsAuth()
const { positions, loading, closePosition } = usePerpsPositions()
const { orders, loading: ordersLoading } = usePerpsOrders()
const { fills, loading: fillsLoading } = usePerpsFills()
const {
  deposits,
  withdrawals,
  loading: dwLoading,
} = usePerpsDepositsWithdrawals()

const combinedDW = computed(() => {
  const items: Array<{
    key: string
    type: string
    coin: string
    size: string
    usdValue?: string
    statusLabel: string
    statusColor: string
    time: string
  }> = []
  for (const d of deposits.value) {
    items.push({
      key: `d-${d.txid ?? d.time}`,
      type: 'Deposit',
      coin: d.coin,
      size: d.size,
      usdValue: d.usdValue,
      statusLabel: d.status,
      statusColor:
        d.status === 'confirmed'
          ? 'text-success'
          : d.status === 'pending'
            ? 'text-warning'
            : 'text-info',
      time: d.time,
    })
  }
  for (const w of withdrawals.value) {
    items.push({
      key: `w-${w.withdrawal_id ?? w.time}`,
      type: 'Withdrawal',
      coin: w.coin,
      size: w.size,
      usdValue: w.usdValue,
      statusLabel: w.status,
      statusColor:
        w.status === 'confirmed'
          ? 'text-success'
          : w.status === 'pending'
            ? 'text-warning'
            : 'text-info',
      time: w.time,
    })
  }
  items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  return items
})

const activeTab = ref<string>('positions')
const closingMarket = ref<string | null>(null)

const tabs = [
  { key: 'positions', label: 'Positions' },
  { key: 'orders', label: 'Orders' },
  { key: 'fills', label: 'Fills' },
  { key: 'deposits', label: 'Deposits & Withdrawals' },
]

async function handleClose(pos: Position) {
  closingMarket.value = pos.market
  try {
    await closePosition(pos)
  } finally {
    closingMarket.value = null
  }
}
</script>
