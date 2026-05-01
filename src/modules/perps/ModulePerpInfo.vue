<template>
  <div class="flex flex-col w-full divide-y divide-grey-10">
    <!-- Header -->
    <div class="pb-3 xs:pb-5">
      <div
        class="flex items-center justify-end gap-3 mt-2 sm:mt-4 mb-2 mr-[72px] xs:mr-[80px] h-5 w-5"
      >
        <!-- <app-btn-icon label="Share">
          <share-icon class="h-5 w-5" />
        </app-btn-icon> -->
      </div>
      <div class="px-4 lg:px-10 py-0 flex items-start gap-4">
        <app-token-logo
          :url="getLogoUrl(baseCurrency)"
          :symbol="baseCurrency"
          width="w-10 xs:w-[56px]"
          height="h-10 xs:h-[56px]"
        />
        <div class="flex flex-col">
          <h1
            class="text-s-20 xs:text-s-24 leading-p-110 font-bold xl:text-s-28"
          >
            {{ baseCurrency.toUpperCase() }}
            <span class="text-s-17 xs:text-s-20 mr-1 font-semibold"
              >({{ displayName }})</span
            >
          </h1>
          <div>
            <p class="text-s-20 xs:text-s-24 inline">
              {{ formatPrice(currentPrice) }}
            </p>
            <div v-if="priceChangePercent !== null" class="inline-block ml-2">
              <ArrowTrendingDownIcon
                v-if="priceChangePercent < 0"
                class="w-4 h-4 inline-block text-error"
              />
              <ArrowTrendingUpIcon
                v-else
                class="w-4 h-4 inline-block text-success"
              />
              <span
                :class="[
                  {
                    'text-success': priceChangePercent >= 0,
                    'text-error': priceChangePercent < 0,
                  },
                  'ml-1 text-s-14 xs:text-s-17',
                ]"
              >
                {{ formatPercent(priceChangePercent) }}
              </span>
            </div>
          </div>
          <p
            class="text-s-8 xs:text-s-11 tracking-sp-06 font-bold uppercase text-info"
          >
            Perpetual
          </p>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="pb-6">
      <div class="flex items-center gap-1 mb-4 px-4 lg:px-10 py-6">
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
      <div class="h-[200px] sm:h-[320px] px-4 lg:px-10 py-6">
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
      <div
        v-if="isWalletConnected && marketPosition"
        class="flex flex-col items-start gap-3 pt-6 bg-appBackground rounded-20 mx-2 px-2 lg:mx-6 lg:px-6 py-6 mb-6 mt-2"
      >
        <h2 class="basis-full sm:basis-auto font-bold text-s-20 leading-p-150">
          Open Position
        </h2>

        <div
          class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6 w-full mt-2 px-2"
        >
          <div class="flex items-center gap-4">
            <app-token-logo
              :url="getLogoUrl(baseCurrency)"
              :symbol="baseCurrency"
              width="w-9"
              height="h-9"
            />
            <div>
              <p class="text-s-17 font-bold">
                {{ baseCurrency.toUpperCase() }}
              </p>
              <p
                :class="[
                  marketPosition.direction === 'long'
                    ? 'text-success'
                    : 'text-error',
                  'font-medium capitalize',
                ]"
              >
                {{ marketPosition.direction }}
                {{ marketPosition.leverage }}x
              </p>
            </div>
          </div>

          <div>
            <p
              class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
            >
              Size
            </p>
            <p class="text-s-14 font-bold">
              {{ formatUsd(marketPosition.notionalValue) }}
            </p>
          </div>
          <div>
            <p
              class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
            >
              uPnL
            </p>
            <p
              class="text-s-14 font-bold"
              :class="pnlColor(marketPosition.unrealizedPnl)"
            >
              {{ formatPnl(marketPosition.unrealizedPnl) }}
            </p>
          </div>
          <div>
            <p
              class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
            >
              Liquidation
            </p>
            <p class="text-s-14 font-bold">
              {{ formatPrice(marketPosition.liquidationPrice) }}
            </p>
          </div>
          <div>
            <p
              class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
            >
              Quantity
            </p>
            <p class="text-s-14 font-bold">
              {{ marketPosition.netQuantity }}
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="isWalletConnected && marketPosition"
        class="flex flex-col items-start gap-3 bg-appBackground rounded-20 mx-2 px-2 lg:mx-6 py-6 mt-6"
      >
        <app-btn-group
          v-model:selected="activeInfoTabObj"
          :btn-list="infoTabs"
          size="medium"
          class="ml-2"
        >
          <template #btn-content="{ data }">
            {{ data.label }}
          </template>
        </app-btn-group>

        <div
          v-if="activeInfoTab === 'more'"
          class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6 w-full mt-3 px-2"
        >
          <div>
            <p
              class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
            >
              ROE
            </p>
            <p
              class="text-s-14 font-bold"
              :class="pnlColor(marketPosition.returnOnEquity)"
            >
              {{
                formatPercent(parseFloat(marketPosition.returnOnEquity) * 100)
              }}
            </p>
          </div>
          <div>
            <p
              class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
            >
              Entry Price
            </p>
            <p class="text-s-14 font-bold">
              {{ formatPrice(marketPosition.averageEntryPrice) }}
            </p>
          </div>
          <div>
            <p
              class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
            >
              Mark Price
            </p>
            <p class="text-s-14 font-bold">
              {{ formatPrice(marketPosition.markPrice) }}
            </p>
          </div>

          <div>
            <p
              class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
            >
              Used Margin
            </p>
            <p class="text-s-14 font-bold">
              {{ formatUsd(marketPosition.usedMargin) }}
            </p>
          </div>

          <div>
            <p
              class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
            >
              Bankruptcy
            </p>
            <p class="text-s-14 font-bold">
              {{ formatPrice(marketPosition.bankruptcyPrice) }}
            </p>
          </div>
          <div>
            <p
              class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
            >
              Maint. Margin
            </p>
            <p class="text-s-14 font-bold">
              {{ formatUsd(marketPosition.maintenanceMargin) }}
            </p>
          </div>
          <div>
            <p
              class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
            >
              Funding
            </p>
            <p class="text-s-14 font-bold">
              {{ formatUsd(marketPosition.netFundingSinceNeutral) }}
            </p>
          </div>

          <div v-if="marketPosition.takeProfitTriggerPrice">
            <p
              class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
            >
              Take Profit
            </p>
            <p class="text-s-14 font-bold text-success">
              {{ formatPrice(marketPosition.takeProfitTriggerPrice) }}
            </p>
          </div>
          <div v-if="marketPosition.stopLossTriggerPrice">
            <p
              class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
            >
              Stop Loss
            </p>
            <p class="text-s-14 font-bold text-error">
              {{ formatPrice(marketPosition.stopLossTriggerPrice) }}
            </p>
          </div>
        </div>
        <!--Orders tab -->
        <div v-else-if="activeInfoTab === 'orders'" class="w-full">
          <div
            v-if="marketOrders.length === 0"
            class="text-center py-8 text-info text-s-14"
          >
            No orders for {{ baseCurrency }}
          </div>
          <table v-else class="w-full text-s-14 table-fixed">
            <thead>
              <tr
                class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold border-b border-grey-10"
              >
                <th class="px-1 sm:pl-4 py-3 text-left font-bold">Side</th>
                <th class="px-1 py-3 text-left font-bold hidden 2xl:table-cell">
                  Status
                </th>
                <th class="px-1 py-3 text-left font-bold hidden xl:table-cell">
                  Type
                </th>
                <th class="px-1 py-3 text-right font-bold">Price</th>
                <th class="px-1 py-3 text-right font-bold hidden lg:table-cell">
                  Filled / Size
                </th>
                <!--Actions -->
                <th
                  class="pr-1 sm:pr-4 py-3 text-right font-bold w-10 xl:w-12 2xl:w-[100px]"
                ></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in marketOrders"
                :key="order.orderId"
                class="hoverBGWhite"
                @click="openOrderDialog(order)"
              >
                <!-- Side -->
                <td class="px-1 sm:pl-4 py-3 rounded-l-12">
                  <p class="text-info text-s-12 mb-[2px]">
                    {{ formatDate(order.createdAt) }}
                  </p>
                  <p
                    :class="[
                      order.side === 'buy' ? 'text-success' : 'text-error',
                      'text-s-13 capitalize font-medium',
                    ]"
                  >
                    {{ order.side }}
                  </p>
                </td>
                <!-- Status -->
                <td class="px-1 py-3 hidden 2xl:table-cell">
                  <p
                    :class="[
                      'text-s-11 uppercase  font-bold tracking-sp-06  -ml-2 mt-1 rounded-full w-max px-2 py-[1px] bg-surface',
                      order.status === 'open' || order.status === 'pending'
                        ? 'text-primary '
                        : order.status === 'fullyfilled'
                          ? ' text-success'
                          : order.status === 'canceled' ||
                              order.status === 'untriggered'
                            ? ' text-info'
                            : '',
                    ]"
                  >
                    {{ formatOrderStatus(order.status) }}
                  </p>
                </td>
                <!-- Type -->
                <td
                  class="px-1 py-3 font-normal text-s-14 hidden xl:table-cell capitalize"
                >
                  <p>{{ formatOrderType(order.type) }}</p>

                  <p
                    :class="[
                      'text-s-11 uppercase  font-bold tracking-sp-06  -ml-2 mt-1 rounded-full w-max px-2 2xl:hidden py-[1px] bg-surface',
                      order.status === 'open' || order.status === 'pending'
                        ? 'text-primary '
                        : order.status === 'fullyfilled'
                          ? ' text-success'
                          : order.status === 'canceled' ||
                              order.status === 'untriggered'
                            ? ' text-info'
                            : '',
                    ]"
                  >
                    {{ formatOrderStatus(order.status) }}
                  </p>
                </td>
                <!-- Price -->
                <td class="px-1 py-3 text-right font-normal text-s-14">
                  <p>{{ formatPrice(getOrderPrice(order)) }}</p>
                </td>
                <!-- Filled / Size -->
                <td
                  class="px-1 py-3 text-right font-normal text-s-14 hidden lg:table-cell"
                >
                  <p>{{ order.filledSize }} {{ baseCurrency }}</p>
                  <p class="text-s-12 text-info">
                    out of {{ order.size }} {{ baseCurrency }}
                  </p>
                </td>
                <!-- Actions -->
                <td class="pl-2 xs:pl-4 pr-0 rounded-r-12 sm:pl-3 sm:pr-1 py-3">
                  <!-- Small screens: popup menu -->
                  <div class="flex items-center justify-end -mr-1 sm:mr-0">
                    <app-pop-up-menu
                      v-if="showCancelButton(order)"
                      placeholder="actions menu"
                      location="right"
                    >
                      <template #menu-button="{ toggleMenu }">
                        <app-btn-icon
                          label="action menu"
                          height="h-7 xs:h-8"
                          width="w-7 xs:w-8"
                          @click.stop="toggleMenu"
                        >
                          <ellipsis-vertical-icon class="w-5 h-5" />
                        </app-btn-icon>
                      </template>
                      <template #menu-content="{ toggleMenu }">
                        <div
                          class="px-2 py-3 max-w-full bg-white rounded-xl min-w-[240px]"
                        >
                          <ul>
                            <li
                              class="p-2 flex items-center hoverBGWhite rounded-12"
                              @click.stop="[
                                toggleMenu(),
                                openOrderDialog(order),
                              ]"
                            >
                              <p>View Order</p>
                            </li>
                            <li
                              v-if="showCancelButton(order)"
                              class="p-2 flex items-center hoverBGWhite rounded-12 text-error"
                              @click.stop="[
                                toggleMenu(),
                                cancelInfoOrder(order.orderId),
                              ]"
                            >
                              {{
                                cancellingOrderId === order.orderId
                                  ? 'Cancelling...'
                                  : 'Cancel'
                              }}
                            </li>
                          </ul>
                        </div>
                      </template>
                    </app-pop-up-menu>
                    <app-btn-icon
                      v-else
                      label="view order details"
                      height="h-7 xs:h-8"
                      width="w-7 xs:w-8"
                      :class="{ 'ml-auto': !showCancelButton(order) }"
                      @click.stop="openOrderDialog(order)"
                    >
                      <chevron-right-icon class="w-5 h-5" />
                    </app-btn-icon>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--Fills tab -->
        <div v-else-if="activeInfoTab === 'fills'" class="w-full">
          <div
            v-if="marketFills.length === 0"
            class="text-center py-6 text-info text-s-14"
          >
            No fills for {{ baseCurrency }}
          </div>
          <div v-else class="w-full">
            <table class="w-full text-s-14 table-fixed">
              <thead>
                <tr
                  class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold border-b border-grey-10"
                >
                  <th class="px-1 sm:pl-4 py-3 text-left font-bold">
                    Direction
                  </th>
                  <th class="px-1 py-3 text-right font-bold">Price</th>
                  <th
                    class="px-1 py-3 text-right font-bold hidden xl:table-cell"
                  >
                    Size
                  </th>
                  <th
                    class="px-1 py-3 text-right font-bold hidden xl:table-cell"
                  >
                    Fee
                  </th>
                  <th
                    class="px-1 py-3 text-right font-bold hidden lg:table-cell"
                  >
                    PnL
                  </th>
                  <th class="w-9 xs:w-12"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="fill in marketFills"
                  :key="fill.id"
                  class="cursor-pointer hoverBGWhite"
                  @click="openFillDialog(fill)"
                >
                  <td class="px-1 sm:pl-4 py-3 rounded-l-12">
                    <p class="text-s-12 text-info mb-1">
                      {{ formatDate(fill.time) }}
                    </p>
                    <p
                      :class="[
                        fill.direction?.toLowerCase().includes('long')
                          ? 'text-success'
                          : 'text-error',
                        'text-s-11 uppercase font-bold tracking-sp-06 rounded-full w-max px-2 py-[1px] bg-surface -ml-1',
                      ]"
                    >
                      {{ formatDirection(fill.direction) }}
                    </p>
                  </td>
                  <td class="px-1 py-3 text-right font-normal text-s-14">
                    <p>{{ formatPrice(fill.price) }}</p>
                  </td>
                  <td
                    class="px-1 py-3 text-right font-normal text-s-14 hidden xl:table-cell"
                  >
                    {{ fill.size }} {{ baseCurrency }}
                  </td>
                  <td
                    class="px-1 py-3 text-right font-normal text-s-14 hidden xl:table-cell"
                  >
                    {{ formatUsd(fill.fee) }}
                  </td>
                  <td
                    class="px-1 py-3 text-right font-normal text-s-14 hidden lg:table-cell"
                  >
                    <span v-if="fill.pnl" :class="pnlColor(fill.pnl)">
                      {{ formatPnl(fill.pnl) }}
                    </span>
                    <span v-else class="text-info">—</span>
                  </td>
                  <!-- Actions -->
                  <td class="pl-2 xs:pl-4 pr-0 sm:pl-3 sm:pr-1 rounded-r-12">
                    <app-btn-icon
                      label="view fill details"
                      height="h-7 xs:h-8"
                      width="w-7 xs:w-8"
                      class="ml-auto"
                      @click="openFillDialog(fill)"
                    >
                      <chevron-right-icon class="w-5 h-5" />
                    </app-btn-icon>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- Positions for this market -->
    <!-- Market Stats -->
    <div class="px-4 lg:px-10 py-6">
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
    <div class="px-4 lg:px-10 py-6">
      <h3 class="text-s-20 font-bold mb-3">About {{ baseCurrency }}</h3>
      <p class="text-s-14 text-info leading-relaxed">
        {{ stockDescription }}
      </p>
    </div>

    <!-- Instrument Info -->
    <div class="px-4 lg:px-10 py-6">
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
            {{ formatPrice(perpInfo?.underlyingMarket?.high) }}
          </p>
        </div>
        <div>
          <p
            class="text-info uppercase text-s-11 tracking-wider font-medium mb-1"
          >
            24H Low
          </p>
          <p class="text-s-14 font-bold">
            {{ formatPrice(perpInfo?.underlyingMarket?.low) }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <perps-order-dialog
    v-if="selectedOrder"
    :visible="showOrderDialog"
    :order="selectedOrder"
    :cancelling="cancellingOrderId === selectedOrder.orderId"
    @close="showOrderDialog = false"
    @cancel="cancelInfoOrder"
  />
  <perps-fill-details-dialog
    v-if="selectedFill"
    :visible="showFillDialog"
    :fill="selectedFill"
    @close="showFillDialog = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import PerpsOrderDialog from './components/PerpsOrderDialog.vue'
import PerpsFillDetailsDialog from './components/PerpsFillDetailsDialog.vue'
import { EllipsisVerticalIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import ChartPrice from '@/components/ChartPrice.vue'

import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/vue/24/outline'
import { perpsClient } from './configs'
import {
  usePerpsMarkets,
  usePerpsContracts,
} from './composables/usePerpsMarkets'
import { usePerpsPositions } from './composables/usePerpsPositions'
import { usePerpsAuth } from './composables/usePerpsAuth'
import { usePerpsMarkPrices } from './composables/usePerpsMarkPrices'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import type { ApiOrder, ApiFill, MarketInfoData } from './sdk/types'
import {
  formatUsd,
  formatPrice,
  formatPnl,
  pnlColor,
  formatPercent,
  formatVolume,
  getOrderPrice,
  formatDate,
  formatOrderStatus,
  formatOrderType,
  formatDirection,
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

const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)

const { token, refreshKey } = usePerpsAuth()
const { markets } = usePerpsMarkets()
const { contracts } = usePerpsContracts()
const { positions } = usePerpsPositions()
const { markPriceData } = usePerpsMarkPrices()

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
  if (!c) return 0
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

// Fetch perpetual info from Ondo API
const perpInfo = ref<MarketInfoData | undefined>(undefined)

async function fetchPerpetualInfo() {
  try {
    const res = await perpsClient.getPerpetualInfo(props.market)
    if (res.success) perpInfo.value = res.result
  } catch {
    perpInfo.value = undefined
  }
}

watch(() => props.market, fetchPerpetualInfo, { immediate: true })

const stockDescription = computed(
  () =>
    perpInfo.value?.description ??
    `${baseCurrency.value}-PERP is a perpetual futures contract tracking the ${displayName.value} asset. Trade with up to 20x leverage.`,
)

const marketPosition = computed(() => {
  const pos = positions.value.filter(p => p.market === props.market)
  return pos.length ? pos[0] : undefined
})

// Mark price
const markPrice = computed(() => {
  const mp = markPriceData.value[props.market]
  return mp?.price
})

// Orders and fills for this market
const marketOrders = ref<ApiOrder[]>([])
const marketFills = ref<ApiFill[]>([])

const cancellingOrderId = ref<string | null>(null)

const showFillDialog = ref(false)
const selectedFill = ref<ApiFill | null>(null)

const openFillDialog = (fill: ApiFill) => {
  selectedFill.value = fill
  showFillDialog.value = true
}

const showOrderDialog = ref(false)
const selectedOrder = ref<ApiOrder | null>(null)

function openOrderDialog(order: ApiOrder) {
  selectedOrder.value = order
  showOrderDialog.value = true
}

function showCancelButton(order: ApiOrder) {
  return (
    order.status === 'pending' ||
    order.status === 'untriggered' ||
    order.status === 'open'
  )
}

async function fetchMarketOrders() {
  if (!token.value) return
  try {
    const res = await perpsClient.getOrders({ market: props.market })
    marketOrders.value = res.result ?? []
  } catch {
    marketOrders.value = []
  }
}

async function cancelInfoOrder(orderId: string) {
  cancellingOrderId.value = orderId
  try {
    await perpsClient.cancelOrder(orderId)
    await fetchMarketOrders()
  } catch (e) {
    console.error('Failed to cancel order:', e)
  } finally {
    cancellingOrderId.value = null
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

let ordersPollTimer: ReturnType<typeof setInterval> | null = null
if (token.value) {
  ordersPollTimer = setInterval(fetchMarketOrders, 10_000)
}
watch(
  () => token.value,
  t => {
    if (ordersPollTimer) {
      clearInterval(ordersPollTimer)
      ordersPollTimer = null
    }
    if (t) {
      ordersPollTimer = setInterval(fetchMarketOrders, 10_000)
    }
  },
)

watch(refreshKey, () => {
  if (token.value) {
    fetchMarketOrders()
  }
})

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
  if (ordersPollTimer) clearInterval(ordersPollTimer)
})

// Tabs
const activeInfoTab = ref('positions')
const infoTabs = [
  { key: 'orders', label: 'Orders' },
  { key: 'fills', label: 'Fills' },
  { key: 'more', label: 'More' },
]
const activeInfoTabObj = computed({
  get: () => infoTabs.find(t => t.key === activeInfoTab.value) ?? infoTabs[0],
  set: (tab: (typeof infoTabs)[number]) => {
    activeInfoTab.value = tab.key
  },
})

// const closingMarket = ref<string | null>(null)

// async function handleClose(pos: Position) {
//   closingMarket.value = marketPosition.value?.market ?? null
//   try {
//     await closePosition(pos)
//   } finally {
//     closingMarket.value = null
//   }
// }

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
