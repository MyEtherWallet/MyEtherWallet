<template>
  <div>
    <app-sheet class="!p-2 !py-6 !sm:py-8" :is-elivated="false">
      <div
        class="flex flex-col xs:flex-row flex-wrap lg:justify-between lg:items-center gap-4 mb-5 xs:px-4"
      >
        <h1 class="text-s-24 xs:text-s-20 font-bold hidden lg:block">
          {{ selectedTab.label }}
        </h1>
        <div class="hidden lg:flex lg:items-center bg-grey-5 rounded-full">
          <app-btn-group
            v-model:selected="selectedTab"
            :btn-list="tabs"
            size="medium"
            class="flex-wrap"
          >
            <template #btn-content="{ data }">
              <span class="px-2">
                {{ data.label }}
                <span
                  v-if="data.value === 'positions' && positions.length > 0"
                  class="ml-1 text-info"
                >
                  · {{ positions.length }}
                </span>
                <span
                  v-else-if="data.value === 'orders' && openOrdersCount > 0"
                  class="ml-1 text-info"
                >
                  · {{ openOrdersCount }}{{ openOrdersCountIsCapped ? '+' : '' }}
                </span>
              </span>
            </template>
          </app-btn-group>
        </div>
        <app-select
          v-model:selected="selectedTab"
          :options="tabs"
          position="right-0"
          placeholder="Tab"
          class="lg:hidden"
        >
          <template #select-button="{ toggleSelect }">
            <div class="bg-surface rounded-full p-1 w-full xs:w-auto">
              <button
                class="rounded-full bg-white py-3 w-full xs:w-auto min-w-[200px] px-5 shadow-button"
                @click="toggleSelect"
              >
                <div class="flex items-center justify-between">
                  <span class="text-s-16 font-medium">{{
                    selectedTab.label
                  }}</span>
                  <chevron-down-icon class="w-4 h-4 ml-2" />
                </div>
              </button>
            </div>
          </template>
        </app-select>
      </div>

      <!-- Positions loading -->
      <app-table-skeleton
        v-if="activeTab === 'positions' && loading && positions.length === 0"
        :rows="3"
        :columns="positionsSkeletonColumns"
      />

      <!-- Positions tab -->
      <template v-else-if="activeTab === 'positions'">
        <div
          v-if="positions.length === 0"
          class="text-center py-8 text-info text-s-14"
        >
          No open positions
        </div>
        <table
          v-else
          ref="positionsTable"
          class="w-full text-s-14 table-fixed"
        >
          <thead>
            <tr
              class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold"
            >
              <th class="px-1 sm:pl-4 py-3 text-left font-bold">Market</th>
              <th class="px-1 py-3 text-right font-bold">Value</th>
              <th
                class="px-1 py-3 text-right font-bold hidden xs:table-cell normal-case"
              >
                uPnl
              </th>
              <th class="px-1 py-3 text-right font-bold hidden 2xl:table-cell">
                Entry Price
              </th>
              <th class="px-1 py-3 text-right font-bold hidden lg:table-cell">
                Mark Price
              </th>
              <th class="px-1 py-3 text-right font-bold hidden sm:table-cell">
                Liq Price
              </th>
              <th class="px-1 py-3 text-right font-bold hidden 2xl:table-cell">
                Margin Used
              </th>
              <th class="px-1 py-3 text-right font-bold hidden 3xl:table-cell">
                Total Funding
              </th>
              <th
                class="px-1 sm:pr-4 py-3 text-right font-bold w-8 xs:w-10 md:w-12 lg:w-auto"
              >
                <p class="hidden lg:block font-bold">Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="pos in paginatedPositions"
              :key="pos.market"
              class="cursor-pointer hoverBGWhite"
              @click="$emit('viewMarket', pos.market)"
            >
              <!-- Market -->
              <td class="py-3 px-1 sm:pl-4 rounded-l-12">
                <div class="flex items-center gap-3">
                  <app-token-logo
                    :url="getLogoUrl(getBase(pos.market))"
                    :symbol="getBase(pos.market)"
                    class="rounded-full"
                  />
                  <div>
                    <p class="font-bold truncate">{{ getBase(pos.market) }}</p>
                    <p
                      :class="[
                        pos.direction === 'long'
                          ? 'text-success'
                          : pos.direction === 'short'
                            ? 'text-error'
                            : 'text-info',
                        'font-medium text-s-12 capitalize ',
                      ]"
                    >
                      {{ pos.direction }} {{ pos.leverage }}x
                    </p>
                  </div>
                </div>
              </td>
              <!-- Value -->
              <td class="px-1 py-3 text-right font-normal text-s-14">
                {{ formatUsd(pos.notionalValue) }}
              </td>
              <!-- Unrealized PnL -->
              <td class="px-1 py-3 text-right hidden xs:table-cell">
                <p
                  :class="pnlColor(pos.unrealizedPnl)"
                  class="font-normal text-s-14"
                >
                  {{ formatPnl(pos.unrealizedPnl) }}
                  <span class="block text-s-12 3xl"
                    >({{ formatRoe(pos.returnOnEquity) }})</span
                  >
                </p>
              </td>
              <!-- Entry Price -->
              <td
                class="px-1 py-3 text-right font-normal text-s-14 hidden 2xl:table-cell"
              >
                {{ formatPrice(pos.averageEntryPrice) }}
              </td>
              <!-- Mark Price -->
              <td
                class="px-1 py-3 text-right font-normal text-s-14 hidden lg:table-cell"
              >
                {{ formatPrice(pos.markPrice) }}
              </td>
              <!-- Liquidation Price -->
              <td class="px-1 py-3 text-right hidden sm:table-cell">
                <span class="text-warning font-normal text-s-14">{{
                  formatPrice(pos.liquidationPrice)
                }}</span>
              </td>
              <!-- Margin Used -->
              <td
                class="px-1 py-3 text-right font-normal text-s-14 hidden 2xl:table-cell"
              >
                {{ formatUsd(pos.usedMargin) }}
              </td>
              <!-- Total Funding -->
              <td class="px-1 py-3 text-right hidden 3xl:table-cell">
                <span
                  :class="pnlColor(pos.netFundingSinceNeutral)"
                  class="font-normal text-s-14"
                >
                  {{ formatPnl(pos.netFundingSinceNeutral) }}
                </span>
              </td>
              <!-- Actions -->
              <td class="px-1 py-3 text-right rounded-r-12">
                <div class="flex items-center justify-end lg:hidden -mr-1">
                  <app-pop-up-menu placeholder="actions menu" location="right">
                    <template #menu-button="{ toggleMenu }">
                      <app-btn-icon
                        label="action menu"
                        @click.stop="toggleMenu"
                        height="h-7 xs:h-8"
                        width="w-7 xs:w-8"
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
                              $emit('openPosition', pos.market),
                            ]"
                          >
                            <p>Manage Position</p>
                          </li>
                          <li
                            class="p-2 flex items-center hoverBGWhite rounded-12"
                            @click.stop="[
                              toggleMenu(),
                              $emit('viewMarket', pos.market),
                            ]"
                          >
                            <p>View Chart</p>
                          </li>
                        </ul>
                      </div>
                    </template>
                  </app-pop-up-menu>
                </div>
                <div class="hidden lg:flex flex-row gap-2 justify-end">
                  <AppBaseButton
                    size="small"
                    @click="$emit('openPosition', pos.market)"
                  >
                    Manage
                  </AppBaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          v-if="positions.length > 0 && positionsTotalPages > 1"
          class="flex justify-end mt-4 px-2"
        >
          <perps-pagination
            :current-page="positionsCurrentPage"
            :total-pages="positionsTotalPages"
            :scroll-target="positionsTable"
            @prev="positionsPrevPage"
            @next="positionsNextPage"
          />
        </div>
      </template>

      <!-- Orders tab -->
      <template v-else-if="activeTab === 'orders'">
        <div class="mb-4 xs:pl-4">
          <app-btn-group
            v-model:selected="selectedOrderFilter"
            :btn-list="orderFilterTabs"
            size="xs"
          >
            <template #btn-content="{ data }">
              <span class="px-2">{{ data.label }}</span>
            </template>
          </app-btn-group>
        </div>
        <app-table-skeleton
          v-if="ordersLoading && orders.length === 0"
          :rows="5"
          :columns="ordersSkeletonColumns"
        />
        <div
          v-else-if="filteredOrders.length === 0"
          class="text-center py-8 text-info text-s-14"
        >
          No orders
        </div>

        <table v-else class="w-full text-s-14 table-fixed">
          <thead>
            <tr
              class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold"
            >
              <th
                class="px-1 sm:pl-4 py-3 text-left font-bold xs:w-[150px] 3xl:w-auto"
              >
                Market
              </th>
              <th
                class="px-1 py-3 text-left font-bold w-[100px] 3xl:w-[120px] hidden xl:table-cell"
              >
                Side
              </th>
              <th class="px-1 py-3 text-left font-bold hidden xs:table-cell">
                Time
              </th>
              <th class="px-1 py-3 text-left font-bold hidden lg:table-cell">
                Status
              </th>
              <th class="px-1 py-3 text-left font-bold hidden 2xl:table-cell">
                Type
              </th>
              <th class="px-1 py-3 text-right font-bold 3xl:w-[120px]">
                Price
              </th>
              <th class="px-1 py-3 text-right font-bold hidden sm:table-cell">
                Filled / Size
              </th>
              <th class="w-9 xs:w-12"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in filteredOrders"
              :key="order.orderId"
              class="cursor-pointer hoverBGWhite"
              @click="openOrderDialog(order)"
            >
              <!-- Market -->
              <td class="px-1 sm:pl-4 py-3 rounded-l-12">
                <div class="flex items-center gap-3">
                  <app-token-logo
                    :url="getLogoUrl(getBase(order.market))"
                    :symbol="getBase(order.market)"
                    class="rounded-full"
                  />
                  <div>
                    <p class="font-bold truncate">
                      {{ getBase(order.market) }}
                    </p>
                    <p
                      :class="[
                        order.side === 'buy' ? 'text-success' : 'text-error',
                        ' text-s-12 capitalize xl:hidden font-medium',
                      ]"
                    >
                      {{ order.side }}
                    </p>
                  </div>
                </div>
              </td>
              <!-- Side -->
              <td class="px-1 py-3 hidden xl:table-cell">
                <span
                  :class="[
                    order.side === 'buy' ? 'text-success' : 'text-error',
                    'text-s-13 capitalize font-medium',
                  ]"
                >
                  {{ order.side }}
                </span>
              </td>
              <!-- Time -->
              <td class="px-1 py-3 text-info text-s-12 hidden xs:table-cell">
                {{ formatDate(order.createdAt) }}
              </td>
              <!-- Status -->
              <td class="px-1 py-3 hidden lg:table-cell">
                <p
                  :class="[
                    'text-s-11 uppercase font-bold tracking-sp-06 -ml-2 mt-1 rounded-full w-max px-2 py-[1px] bg-surface',
                    order.status === 'open' || order.status === 'pending'
                      ? 'text-primary'
                      : order.status === 'fullyfilled'
                        ? 'text-success'
                        : order.status === 'canceled' ||
                            order.status === 'untriggered'
                          ? 'text-info'
                          : '',
                  ]"
                >
                  {{ formatOrderStatus(order.status) }}
                </p>
              </td>
              <!-- Type -->
              <td class="px-1 py-3 font-normal text-s-14 hidden 2xl:table-cell">
                {{ formatOrderType(order.type) }}
              </td>
              <!-- Price -->
              <td class="px-1 py-3 text-right font-normal text-s-14">
                <p>{{ formatPrice(getOrderPrice(order)) }}</p>

                <p class="text-s-12 text-info xs:hidden">
                  {{ formatDate(order.createdAt) }}
                </p>
              </td>
              <!-- Filled Size  out of Size-->
              <td
                class="px-1 py-3 text-right font-normal text-s-14 hidden sm:table-cell"
              >
                <p>{{ order.filledSize }} {{ getBase(order.market) }}</p>
                <p class="text-s-12 text-info">
                  out of {{ order.size }} {{ getBase(order.market) }}
                </p>
              </td>

              <!--Actions-->
              <td class="pl-2 xs:pl-4 pr-0 rounded-r-12 sm:pl-3 sm:pr-1 py-3">
                <app-pop-up-menu
                  v-if="showCancelButton(order)"
                  placeholder="actions menu"
                  location="right"
                >
                  <template #menu-button="{ toggleMenu }">
                    <app-btn-icon
                      label="action menu"
                      @click.stop="toggleMenu"
                      height="h-7 xs:h-8"
                      width="w-7 xs:w-8"
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
                          @click.stop="[toggleMenu(), openOrderDialog(order)]"
                        >
                          <p>View Order</p>
                        </li>
                        <li
                          class="p-2 flex items-center hoverBGWhite rounded-12"
                          @click.stop="[toggleMenu(), cancelOrder(order)]"
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
                <!-- View order details button -->
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
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <!-- Fills tab -->
      <template v-else-if="activeTab === 'fills'">
        <app-table-skeleton
          v-if="fillsLoading && fills.length === 0"
          :rows="3"
          :columns="fillsSkeletonColumns"
        />
        <div
          v-else-if="fills.length === 0 && fillsCurrentPage === 0"
          class="text-center py-8 text-info text-s-14"
        >
          No fills
        </div>
        <div v-else class="overflow-x-auto">
          <table ref="fillsTable" class="w-full text-s-14 table-fixed">
            <thead>
              <tr
                class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold"
              >
                <th class="px-1 sm:pl-4 py-3 text-left font-bold">Market</th>
                <th class="px-1 py-3 text-left font-bold hidden lg:table-cell">
                  Direction
                </th>
                <th
                  class="px-1 py-3 text-right lg:text-left font-bold hidden xs:table-cell"
                >
                  Time
                </th>

                <th class="px-1 py-3 text-right font-bold">Price</th>
                <th class="px-1 py-3 text-right font-bold hidden sm:table-cell">
                  Size
                </th>
                <th class="px-1 py-3 text-right font-bold hidden md:table-cell">
                  PnL
                </th>
                <th class="w-9 xs:w-12"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="fill in fills"
                :key="fill.id"
                class="cursor-pointer hoverBGWhite"
                @click="openFillDialog(fill)"
              >
                <!-- Market -->
                <td class="px-1 sm:pl-4 py-3 rounded-l-12">
                  <div class="flex items-center gap-3">
                    <app-token-logo
                      :url="getLogoUrl(getBase(fill.market))"
                      :symbol="getBase(fill.market)"
                      class="rounded-full"
                    />
                    <div>
                      <p class="font-bold truncate">
                        {{ getBase(fill.market) }}
                      </p>
                      <p
                        :class="[
                          fill.direction?.toLowerCase().includes('long')
                            ? 'text-success'
                            : 'text-error',
                          'text-s-11 uppercase font-bold tracking-sp-06  -ml-1  mt-1 rounded-full w-max px-2 py-[1px] bg-surface lg:hidden',
                        ]"
                      >
                        {{ formatDirection(fill.direction) }}
                      </p>
                    </div>
                  </div>
                </td>
                <!-- Direction -->
                <td class="px-1 py-3 hidden lg:table-cell">
                  <span
                    :class="[
                      fill.direction?.toLowerCase().includes('long')
                        ? 'text-success'
                        : 'text-error',
                      'text-s-11 uppercase font-bold tracking-sp-06 rounded-full w-max px-2 py-[1px] bg-surface',
                    ]"
                  >
                    {{ formatDirection(fill.direction) }}
                  </span>
                </td>
                <!-- Time -->
                <td
                  class="px-1 py-3 text-right text-s-12 lg:text-left text-info hidden xs:table-cell"
                >
                  {{ formatDate(fill.time) }}
                </td>
                <!-- Price -->
                <td class="px-1 py-3 text-right">
                  <p>{{ formatPrice(fill.price) }}</p>
                  <p class="text-info text-s-12 xs:hidden">
                    {{ formatDate(fill.time) }}
                  </p>
                </td>
                <!-- Size -->
                <td class="px-1 py-3 text-right hidden sm:table-cell">
                  {{ fill.size }} {{ getBase(fill.market) }}
                </td>
                <!-- PnL -->
                <td class="px-1 py-3 text-right hidden md:table-cell">
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
          <div
            v-if="fillsHasPrev || fillsHasNext"
            class="flex justify-end mt-4 px-2"
          >
            <perps-pagination
              :current-page="fillsCurrentPage"
              :has-prev="fillsHasPrev"
              :has-next="fillsHasNext"
              :disabled="fillsLoading"
              :scroll-target="fillsTable"
              @prev="fillsPrevPage"
              @next="fillsNextPage"
            />
          </div>
        </div>
      </template>

      <!-- Deposits & Withdrawals tab -->
      <template v-else-if="activeTab === 'deposits'">
        <app-table-skeleton
          v-if="dwLoading && deposits.length === 0 && withdrawals.length === 0"
          :rows="5"
          :columns="dwSkeletonColumns"
        />
        <div
          v-else-if="deposits.length === 0 && withdrawals.length === 0"
          class="text-center py-8 text-info text-s-14"
        >
          No deposits or withdrawals
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-s-14 table-fixed">
            <thead>
              <tr
                class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold"
              >
                <th
                  class="px-1 sm:pl-4 py-3 text-left font-bold hidden xs:table-cell"
                >
                  Type
                </th>
                <th class="px-1 py-3 text-left font-bold">Asset</th>
                <th class="px-1 py-3 text-left font-bold hidden sm:table-cell">
                  Time
                </th>
                <th class="px-1 py-3 text-right font-bold hidden md:table-cell">
                  USD Value
                </th>
                <th class="px-1 py-3 text-right font-bold">Amount</th>

                <th
                  class="px-1 sm:pr-4 py-3 text-right font-bold hidden xs:table-cell"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in combinedDW" :key="item.key" class="">
                <!-- Type -->
                <td class="px-1 sm:pl-4 py-3 rounded-l-12 hidden xs:table-cell">
                  <span
                    :class="[
                      item.type === 'Deposit' ? 'text-success' : 'text-warning',
                      'font-medium text-s-13',
                    ]"
                  >
                    {{ item.type }}
                  </span>
                </td>
                <!-- Asset -->
                <td class="px-1 py-3 font-bold flex items-center">
                  <app-token-logo
                    :url="USDC_LOGO"
                    symbol="item.coin"
                    class="mr-2"
                  />
                  <div>
                    <p>{{ item.coin }}</p>

                    <p
                      :class="[
                        item.type === 'Deposit'
                          ? 'text-success'
                          : 'text-warning',
                        'font-medium text-s-12 xs:hidden',
                      ]"
                    >
                      {{ item.type }}
                    </p>
                  </div>
                </td>
                <!-- Time -->
                <td
                  class="px-1 py-3 text-left text-info text-s-12 hidden sm:table-cell"
                >
                  {{ formatDate(item.time) }}
                </td>
                <!-- USD Value -->
                <td class="px-1 py-3 text-right hidden md:table-cell">
                  {{ item.usdValue ? formatUsd(item.usdValue) : '—' }}
                </td>
                <!-- Amount -->
                <td class="px-1 py-3 text-right">
                  <p class="md:hidden">
                    {{ item.usdValue ? formatUsd(item.usdValue) : '—' }}
                  </p>
                  <p class="text-info text-s-12 md:text-black md:text-s-14">
                    {{ item.size }} {{ item.coin }}
                  </p>
                </td>
                <!-- Status -->
                <td
                  class="px-1 py-3 sm:pr-4 rounded-r-12 text-right hidden xs:table-cell"
                >
                  <span
                    :class="[
                      'capitalize font-medium text-s-13',
                      item.statusColor,
                    ]"
                  >
                    {{ item.statusLabel }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </app-sheet>
    <perps-fill-details-dialog
      v-if="selectedFill"
      :visible="showFillDialog"
      :fill="selectedFill"
      @close="showFillDialog = false"
    />
    <perps-order-dialog
      v-if="selectedOrder"
      :visible="showOrderDialog"
      :order="selectedOrder"
      :cancelling="cancellingOrderId === selectedOrder.orderId"
      @close="showOrderDialog = false"
      @cancel="cancelOrder"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppSheet from '@/components/AppSheet.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppTableSkeleton, {
  type SkeletonColumn,
} from '@/components/AppTableSkeleton.vue'
import PerpsFillDetailsDialog from './PerpsFillDetailsDialog.vue'
import PerpsOrderDialog from './PerpsOrderDialog.vue'
import PerpsPagination from './PerpsPagination.vue'
import { usePerpsPositions } from '../composables/usePerpsPositions'
import {
  usePerpsOrders,
  usePerpsFills,
  usePerpsDepositsWithdrawals,
} from '../composables/usePerpsHistory'
import { usePerpsToasts } from '../composables/usePerpsToasts'
import { usePerpsMarkets } from '../composables/usePerpsMarkets'
import {
  formatUsd,
  formatPrice,
  formatPnl,
  formatRoe,
  pnlColor,
  formatDate,
  getOrderPrice,
  formatOrderStatus,
  formatOrderType,
  formatDirection,
} from '../utils/formatters'
import { getBase, getLogoUrl } from '../utils/market'
import { perpsClient, PERPS_PAGE_SIZE } from '../configs'
import { usePaginate } from '@/composables/usePaginate'
import type { Position, ApiOrder, ApiFill } from '../sdk/types'

const USDC_LOGO =
  'https://coin-images.coingecko.com/coins/images/6319/large/USDC.png?1769615602'
defineEmits<{
  openPosition: [market: string]
  viewMarket: [market: string]
}>()

const positionsTable = ref<HTMLElement | null>(null)
const fillsTable = ref<HTMLElement | null>(null)

const positionsSkeletonColumns: SkeletonColumn[] = [
  { header: 'Market' },
  { header: 'Value', align: 'right' },
  { header: 'uPnl', align: 'right', hidden: 'hidden xs:table-cell' },
  { header: 'Entry Price', align: 'right', hidden: 'hidden 2xl:table-cell' },
  { header: 'Mark Price', align: 'right', hidden: 'hidden lg:table-cell' },
  { header: 'Liq Price', align: 'right', hidden: 'hidden sm:table-cell' },
  { header: 'Margin Used', align: 'right', hidden: 'hidden 2xl:table-cell' },
  { header: 'Total Funding', align: 'right', hidden: 'hidden 3xl:table-cell' },
  { header: 'Actions', align: 'right' },
]

const fillsSkeletonColumns: SkeletonColumn[] = [
  { header: 'Market' },
  { header: 'Direction', hidden: 'hidden lg:table-cell' },
  { header: 'Time', hidden: 'hidden xs:table-cell' },
  { header: 'Price', align: 'right' },
  { header: 'Size', align: 'right', hidden: 'hidden sm:table-cell' },
  { header: 'PnL', align: 'right', hidden: 'hidden md:table-cell' },
]

const ordersSkeletonColumns: SkeletonColumn[] = [
  { header: 'Market' },
  { header: 'Side', hidden: 'hidden xl:table-cell', width: '100px' },
  { header: 'Time', hidden: 'hidden xs:table-cell' },
  { header: 'Status', hidden: 'hidden lg:table-cell' },
  { header: 'Type', hidden: 'hidden 2xl:table-cell' },
  { header: 'Price', align: 'right' },
  { header: 'Filled / Size', align: 'right', hidden: 'hidden sm:table-cell' },
  { header: '', width: '48px' },
]

const dwSkeletonColumns: SkeletonColumn[] = [
  { header: 'Type', hidden: 'hidden xs:table-cell' },
  { header: 'Asset' },
  { header: 'Time', hidden: 'hidden sm:table-cell' },
  { header: 'USD Value', align: 'right', hidden: 'hidden md:table-cell' },
  { header: 'Amount', align: 'right' },
  { header: 'Status', align: 'right', hidden: 'hidden xs:table-cell' },
]

const { positions, loading } = usePerpsPositions()

const {
  currentPage: positionsCurrentPage,
  paginatedArray: paginatedPositions,
  totalPages: positionsTotalPages,
  nextPage: positionsNextPage,
  prevPage: positionsPrevPage,
} = usePaginate<Position>(positions, PERPS_PAGE_SIZE)

const showFillDialog = ref(false)
const selectedFill = ref<ApiFill | null>(null)

function openFillDialog(fill: ApiFill) {
  selectedFill.value = fill
  showFillDialog.value = true
}

const showOrderDialog = ref(false)
const selectedOrder = ref<ApiOrder | null>(null)

function openOrderDialog(order: ApiOrder) {
  selectedOrder.value = order
  showOrderDialog.value = true
}

const {
  orders,
  loading: ordersLoading,
  refetch: refetchOrders,
} = usePerpsOrders()

const showCancelButton = (order: ApiOrder) => {
  return (
    order.status === 'pending' ||
    order.status === 'untriggered' ||
    order.status === 'open'
  )
}

const {
  fills,
  loading: fillsLoading,
  currentPage: fillsCurrentPage,
  hasPrev: fillsHasPrev,
  hasNext: fillsHasNext,
  nextPage: fillsNextPage,
  prevPage: fillsPrevPage,
} = usePerpsFills()
const {
  deposits,
  withdrawals,
  loading: dwLoading,
} = usePerpsDepositsWithdrawals()

const cancellingOrderId = ref<string | null>(null)
const perpsToasts = usePerpsToasts()
const { markets } = usePerpsMarkets()

async function cancelOrder(order: ApiOrder) {
  if (cancellingOrderId.value === order.orderId) return
  cancellingOrderId.value = order.orderId
  const market = markets.value.find(m => m.market === order.market)
  const displayMarket =
    market?.longName ?? market?.displayName ?? order.market
  try {
    await perpsClient.cancelOrder(order.orderId)
    perpsToasts.toastOrderCanceled({
      side: order.side,
      size: order.size,
      category: order.type,
      market: displayMarket,
      price: order.price,
    })
    showOrderDialog.value = false
    await refetchOrders()
  } catch (e) {
    console.error('Failed to cancel order:', e)
    const msg = (e instanceof Error ? e.message : String(e)).toLowerCase()
    if (
      msg.includes('invalid') &&
      (msg.includes('order') || msg.includes('id'))
    ) {
      perpsToasts.toastCancelFailedInvalidOrderId()
    } else if (msg.startsWith('http ')) {
      perpsToasts.toastCancelFailed()
    } else {
      perpsToasts.toastCancelFailedGeneric()
    }
  } finally {
    cancellingOrderId.value = null
  }
}

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

const tabs = [
  { label: 'Positions', value: 'positions' },
  { label: 'Orders', value: 'orders' },
  { label: 'Fills', value: 'fills' },
  { label: 'Deposits & Withdrawals', value: 'deposits' },
]

const selectedTab = ref(tabs[0])
const activeTab = computed(() => selectedTab.value.value)

const orderFilterTabs = [
  { label: 'All', value: 'all' },

  { label: 'Pending', value: 'pending' },
]
const selectedOrderFilter = ref(orderFilterTabs[0])

const pendingStatuses = new Set(['pending', 'untriggered', 'open'])
const filteredOrders = computed(() => {
  if (selectedOrderFilter.value.value === 'all') return orders.value
  return orders.value.filter(o => pendingStatuses.has(o.status))
})

// Open-orders count for the Orders tab badge. Source is the polled orders
// list (limit 100 in usePerpsOrders); count saturates at 100 and is flagged
// with "+" when so.
const ORDERS_FETCH_LIMIT = 100
const openOrdersCount = computed(
  () => orders.value.filter(o => pendingStatuses.has(o.status)).length,
)
const openOrdersCountIsCapped = computed(
  () => orders.value.length >= ORDERS_FETCH_LIMIT,
)
</script>
