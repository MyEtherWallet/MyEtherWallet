<template>
  <div>
    <app-sheet class="!p-2 !py-6 !sm:py-8" :is-elivated="false">
      <div
        class="flex flex-col xs:flex-row flex-wrap lg:justify-between lg:items-center gap-4 mb-5 xs:px-4"
      >
        <h1 class="text-s-24 xs:text-s-20 font-bold hidden lg:block">
          {{ selectedTab.label }}
        </h1>
        <div class="hidden lg:block">
          <AppSegmentedControl
            v-model="activeTab"
            :items="tabs"
            size="small"
            :label="$t('perps.positions.tabs-label')"
          >
            <template #label="{ item }">
              {{ item.label }}
              <span
                v-if="item.value === 'positions' && positions.length > 0"
                class="ml-1 text-text-subtle text-s-12"
              >
                · {{ positions.length }}
              </span>
              <span
                v-else-if="item.value === 'orders' && openOrdersCount > 0"
                class="ml-1 text-text-subtle text-s-12"
              >
                ·
                {{
                  openOrdersCountIsCapped
                    ? `${PERPS_PAGE_SIZE}+`
                    : openOrdersCount
                }}
              </span>
            </template>
          </AppSegmentedControl>
        </div>
        <app-select
          v-model:selected="selectedTab"
          :options="tabs"
          position="right-0"
          :placeholder="$t('perps.positions.tab-placeholder')"
          class="lg:hidden"
        >
          <template #select-button="{ toggleSelect }">
            <div
              class="bg-background-default-hover rounded-full p-1 w-full xs:w-auto"
            >
              <button
                class="rounded-full bg-white py-3 w-full xs:w-auto min-w-[200px] px-5 shadow-button"
                @click="toggleSelect"
              >
                <div class="flex items-center justify-between">
                  <span class="text-s-16 font-medium">
                    {{ selectedTab.label }}
                    <span
                      v-if="activeTab === 'positions' && positions.length > 0"
                      class="ml-1 text-text-subtle"
                    >
                      · {{ positions.length }}
                    </span>
                    <span
                      v-else-if="activeTab === 'orders' && openOrdersCount > 0"
                      class="ml-1 text-text-subtle"
                    >
                      ·
                      {{
                        openOrdersCountIsCapped
                          ? `${PERPS_PAGE_SIZE}+`
                          : openOrdersCount
                      }}
                    </span>
                  </span>
                  <AppIcon
                    name="chevron-down"
                    size="xxs"
                    variant="filled"
                    class="ml-2"
                  />
                </div>
              </button>
            </div>
          </template>
        </app-select>
      </div>

      <!-- Positions tab -->
      <template v-if="activeTab === 'positions'">
        <div
          v-if="positionsHasLoaded && positions.length === 0"
          class="text-center py-8 text-text-subtle text-s-14"
        >
          {{ $t('perps.positions.no-open-positions') }}
        </div>
        <AppTable
          v-else
          :page="positionsCurrentPage + 1"
          :columns="positionColumns"
          :pages="positionsTotalPages"
          :footer="positionsTotalPages > 1 ? 'pagination' : undefined"
          :aria-label="$t('perps.positions.tab-positions')"
          :loading="!positionsHasLoaded"
          :loading-rows="3"
          actions
          @update:page="positionsCurrentPage = $event - 1"
        >
          <AppTableRow
            v-for="pos in paginatedPositions"
            :key="pos.market"
            :title="getBase(pos.market)"
            :description="$t(sideKey(pos.direction))"
            :to="{ name: PERP_INFO_ROUTE_NAME, params: { market: pos.market } }"
          >
            <template #avatar="{ size: avatarSize }">
              <AppAvatar
                type="perpsAsset"
                :size="avatarSize"
                :url="getLogoUrl(getBase(pos.market))"
                :symbol="getBase(pos.market)"
              />
            </template>
            <template #title-icon>
              <AppTag
                :type="fillDirectionTagType(pos.direction)"
                variant="subtle"
                :label="`${pos.leverage}x`"
              />
            </template>
            <AppTableCell
              column="value"
              :value="formatUsd(pos.notionalValue)"
            />
            <!-- ROE: NaN (no equity yet) reads 0.00%, as formatRoe did. -->
            <AppTableCell
              column="upnl"
              :value="formatPnl(pos.unrealizedPnl)"
              :tone="trendOf(parseFloat(pos.unrealizedPnl))"
              :change="parseFloat(pos.returnOnEquity) * 100 || 0"
            />
            <AppTableCell
              column="entry"
              :value="formatPrice(pos.averageEntryPrice)"
            />
            <AppTableCell column="mark" :value="formatPrice(pos.markPrice)" />
            <AppTableCell column="liq">
              <p class="max-w-full truncate text-label-base text-text-warning">
                {{ formatPrice(pos.liquidationPrice) }}
              </p>
            </AppTableCell>
            <AppTableCell column="margin" :value="formatUsd(pos.usedMargin)" />
            <AppTableCell column="funding">
              <p
                :class="[
                  'max-w-full truncate text-label-base',
                  pnlColor(pos.netFundingSinceNeutral),
                ]"
              >
                {{ formatPnl(pos.netFundingSinceNeutral) }}
              </p>
            </AppTableCell>
            <template #actions="{ size: rowSize, surface }">
              <app-pop-up-menu
                :placeholder="$t('perps.market-list.actions-menu-label')"
                location="right"
              >
                <template #menu-button="{ toggleMenu }">
                  <AppBtnIcon
                    v-if="rowSize === 's'"
                    icon="ellipsis-horizontal"
                    :label="$t('perps.market-list.action-menu-label')"
                    @click="toggleMenu"
                  />
                  <AppBaseButton
                    v-else
                    type="secondary"
                    size="medium"
                    class="w-24"
                    :surface="surface"
                    :tone="pos.direction === 'long' ? 'success' : 'danger'"
                    :disabled="isWatchOnly"
                    @click="toggleMenu"
                  >
                    {{ $t('perps.positions.manage-label') }}
                  </AppBaseButton>
                </template>
                <template #menu-content="{ toggleMenu }">
                  <div
                    class="px-2 py-3 max-w-full bg-white rounded-xl min-w-60"
                  >
                    <ul>
                      <li
                        class="p-2 flex items-center hoverBGWhite rounded-12"
                        @click.stop="[toggleMenu(), openLeverage(pos)]"
                      >
                        <p>{{ $t('perps.market-list.change-leverage') }}</p>
                      </li>
                      <li
                        class="p-2 flex items-center hoverBGWhite rounded-12"
                        @click.stop="[
                          toggleMenu(),
                          openPositionAdd(pos, 'add'),
                        ]"
                      >
                        <p>
                          {{ $t('perps.positions.add-to-position-menu') }}
                        </p>
                      </li>
                      <li
                        class="p-2 flex items-center hoverBGWhite rounded-12"
                        @click.stop="[
                          toggleMenu(),
                          openPositionAdd(pos, 'close'),
                        ]"
                      >
                        <p>{{ $t('perps.market-list.close-position') }}</p>
                      </li>
                      <li
                        class="p-2 flex items-center hoverBGWhite rounded-12"
                        @click.stop="[
                          toggleMenu(),
                          $emit('openPosition', pos.market),
                        ]"
                      >
                        <p>
                          {{ $t('perps.market-list.view-market-info') }}
                        </p>
                      </li>
                    </ul>
                  </div>
                </template>
              </app-pop-up-menu>
            </template>
          </AppTableRow>
        </AppTable>
      </template>

      <!-- Orders tab -->
      <template v-else-if="activeTab === 'orders'">
        <div class="mb-4 xs:pl-4">
          <AppSegmentedControl
            v-model="selectedOrderFilterValue"
            :items="orderFilterTabs"
            size="small"
            :label="$t('perps.positions.order-filter-label')"
          >
            <template #label="{ item }">
              {{ item.label }}
              <span
                v-if="item.value === 'pending' && openOrdersCount > 0"
                class="ml-1 text-text-subtle text-s-11"
              >
                ·
                {{
                  openOrdersCountIsCapped
                    ? `${PERPS_PAGE_SIZE}+`
                    : openOrdersCount
                }}
              </span>
            </template>
          </AppSegmentedControl>
        </div>
        <div
          v-if="
            !ordersLoading && orders.length === 0 && ordersCurrentPage === 0
          "
          class="text-center py-8 text-text-subtle text-s-14"
        >
          {{ $t('perps.positions.no-orders') }}
        </div>

        <div v-else ref="ordersTable">
          <AppTable
            :columns="orderColumns"
            :aria-label="$t('perps.positions.tab-orders')"
            :loading="ordersLoading && orders.length === 0"
            actions
          >
            <AppTableRow
              v-for="order in orders"
              :key="order.orderId"
              :title="getBase(order.market)"
              :description="formatDate(order.createdAt)"
              @click="openOrderDialog(order)"
            >
              <template #avatar="{ size: avatarSize }">
                <AppAvatar
                  type="perpsAsset"
                  :size="avatarSize"
                  :url="getLogoUrl(getBase(order.market))"
                  :symbol="getBase(order.market)"
                />
              </template>
              <AppTableCell column="side">
                <p
                  :class="[
                    sideColor(order.side),
                    'max-w-full truncate text-label-base capitalize',
                  ]"
                >
                  {{ $t(sideKey(order.side)) }}
                </p>
              </AppTableCell>
              <AppTableCell column="status">
                <app-tag
                  :type="orderStatusTagType(order.status)"
                  variant="subtle"
                  :label="$t(formatOrderStatus(order.status))"
                />
              </AppTableCell>
              <AppTableCell
                column="type"
                :value="$t(formatOrderType(order.type))"
              />
              <AppTableCell
                column="price"
                :value="formatPrice(getOrderPrice(order))"
              />
              <AppTableCell column="filled">
                <p
                  class="max-w-full truncate text-label-base text-text-default"
                >
                  {{ order.filledSize }} {{ getBase(order.market) }}
                </p>
                <p class="max-w-full truncate text-label-xs text-text-subtle">
                  {{
                    $t('perps.positions.out-of', {
                      size: order.size,
                      symbol: getBase(order.market),
                    })
                  }}
                </p>
              </AppTableCell>
              <template #actions="{ size: rowSize, surface }">
                <PerpsOrderActions
                  :order="order"
                  :size="rowSize"
                  :surface="surface"
                  :cancelling="cancellingOrderId === order.orderId"
                  @view="openOrderDialog"
                  @cancel="openCancelConfirmation"
                />
              </template>
            </AppTableRow>
          </AppTable>
          <div
            v-if="ordersHasPrev || ordersHasNext"
            class="flex justify-end mt-4 px-2"
          >
            <perps-pagination
              :current-page="ordersCurrentPage"
              :has-prev="ordersHasPrev"
              :has-next="ordersHasNext"
              :disabled="ordersLoading"
              :scroll-target="ordersTable"
              @prev="ordersPrevPage"
              @next="ordersNextPage"
            />
          </div>
        </div>
      </template>

      <!-- Fills tab -->
      <template v-else-if="activeTab === 'fills'">
        <div
          v-if="!fillsLoading && fills.length === 0 && fillsCurrentPage === 0"
          class="text-center py-8 text-text-subtle text-s-14"
        >
          {{ $t('perps.positions.no-fills') }}
        </div>
        <div v-else ref="fillsTable">
          <AppTable
            :columns="fillColumns"
            :aria-label="$t('perps.positions.tab-fills')"
            :loading="fillsLoading && fills.length === 0"
            :loading-rows="3"
          >
            <AppTableRow
              v-for="fill in fills"
              :key="fill.id"
              :title="getBase(fill.market)"
              :description="formatDate(fill.time)"
              @click="openFillDialog(fill)"
            >
              <template #avatar="{ size: avatarSize }">
                <AppAvatar
                  type="perpsAsset"
                  :size="avatarSize"
                  :url="getLogoUrl(getBase(fill.market))"
                  :symbol="getBase(fill.market)"
                />
              </template>
              <AppTableCell column="direction">
                <app-tag
                  :type="fillDirectionTagType(fill.direction)"
                  variant="subtle"
                  :label="$t(directionKey(fill.direction))"
                />
              </AppTableCell>
              <AppTableCell column="price" :value="formatPrice(fill.price)" />
              <AppTableCell
                column="size"
                :value="`${fill.size} ${getBase(fill.market)}`"
              />
              <AppTableCell column="pnl">
                <p
                  :class="[
                    'max-w-full truncate text-label-base',
                    fill.pnl ? pnlColor(fill.pnl) : 'text-text-subtle',
                  ]"
                >
                  {{ fill.pnl ? formatPnl(fill.pnl) : '—' }}
                </p>
              </AppTableCell>
            </AppTableRow>
          </AppTable>
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
        <div
          v-if="!dwLoading && combinedDW.length === 0"
          class="text-center py-8 text-text-subtle text-s-14"
        >
          {{ $t('perps.positions.no-deposits-or-withdrawals') }}
        </div>
        <AppTable
          v-else
          :page="dwCurrentPage + 1"
          :columns="dwColumns"
          :pages="dwTotalPages"
          :footer="dwTotalPages > 1 ? 'pagination' : undefined"
          :aria-label="$t('perps.positions.tab-deposits')"
          :loading="dwLoading && combinedDW.length === 0"
          @update:page="dwCurrentPage = $event - 1"
        >
          <AppTableRow
            v-for="item in paginatedDW"
            :key="item.key"
            :title="formatDWType(item.type)"
            :description="item.coin"
          >
            <template #title>
              <span
                :class="
                  item.type === 'Deposit'
                    ? 'text-text-success'
                    : 'text-text-warning'
                "
              >
                {{ formatDWType(item.type) }}
              </span>
            </template>
            <template #avatar="{ size: avatarSize }">
              <AppAvatar
                type="cryptoAsset"
                :size="avatarSize"
                :url="USDC_LOGO"
                :symbol="item.coin"
              />
            </template>
            <AppTableCell column="time" :value="formatDate(item.time)" />
            <AppTableCell
              column="usd"
              :value="item.usdValue ? formatUsd(item.usdValue) : '—'"
            />
            <AppTableCell
              column="amount"
              :value="`${item.size} ${item.coin}`"
            />
            <AppTableCell column="status">
              <p
                :class="[
                  'max-w-full truncate text-label-base capitalize',
                  item.statusColor,
                ]"
              >
                {{ $t(statusKey(item.statusLabel)) }}
              </p>
            </AppTableCell>
          </AppTableRow>
        </AppTable>
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
      @cancel="openCancelConfirmation"
    />
    <perps-cancel-order-confirmation-dialog
      v-if="orderPendingCancel"
      v-model:is-open="showCancelConfirmation"
      :order="orderPendingCancel"
      :display-symbol="getBase(orderPendingCancel.market)"
      :is-cancelling="cancellingOrderId === orderPendingCancel.orderId"
      @confirm="confirmCancelOrder"
    />

    <perps-select-leverage-dialog
      v-model:is-open="showLeverageModal"
      v-model="localLeverage"
      :symbol="displaySymbol"
      :leverage-error="leverageError"
      :is-saving="isSavingLeverage"
      :max-leverage="localMaxLeverage"
      mode="submit"
      @save="saveLeverage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppSegmentedControl from '@components/segmented_control/AppSegmentedControl.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppSheet from '@/components/AppSheet.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppTable from '@/components/table/AppTable.vue'
import AppTableRow from '@/components/table/AppTableRow.vue'
import AppTableCell from '@/components/table/AppTableCell.vue'
import type { TableColumn } from '@/components/table/types'
import { trendOf } from '@/components/cell/cellSizes'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppTag from '@/components/tag/AppTag.vue'
import { PERP_INFO_ROUTE_NAME } from '@/router/routeNames'
import PerpsFillDetailsDialog from './PerpsFillDetailsDialog.vue'
import PerpsOrderActions from './PerpsOrderActions.vue'
import PerpsOrderDialog from './PerpsOrderDialog.vue'
import PerpsCancelOrderConfirmationDialog from './PerpsCancelOrderConfirmationDialog.vue'
import PerpsPagination from './PerpsPagination.vue'
import PerpsSelectLeverageDialog from './PerpsSelectLeverageDialog.vue'
import { usePerpsPositions } from '../composables/usePerpsPositions'
import {
  usePerpsOrders,
  usePerpsFills,
  usePerpsDepositsWithdrawals,
  type OrdersStatusFilter,
} from '../composables/usePerpsHistory'
import { usePerpsToasts } from '../composables/usePerpsToasts'
import { usePerpsMarkets } from '../composables/usePerpsMarkets'
import {
  formatUsd,
  formatPrice,
  formatPnl,
  pnlColor,
  formatDate,
  getOrderPrice,
  formatOrderStatus,
  orderStatusTagType,
  formatOrderType,
  directionKey,
  fillDirectionTagType,
  sideKey,
  sideColor,
  withdrawalStatusColor,
} from '../utils/formatters'
import { getBase, getLogoUrl } from '../utils/market'
import { perpsClient, PERPS_PAGE_SIZE } from '../configs'
import { capturePerps } from '../sentry'
import { PERPS_FEATURE } from '@/sentry/constants'
import { usePaginate } from '@/composables/usePaginate'
import type { Position, ApiOrder, ApiFill } from '../sdk/types'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import {
  analytics,
  PerpsChangeLeverageEvent,
  PerpsManageEvent,
  PerpsOrderEvent,
  PerpsEventLocation,
} from '@/analytics'
import type {
  PerpsChangeLeveragePayload,
  PerpsChangeLeverageFailPayload,
} from '@/analytics'

const { t } = useI18n()

const walletStore = useWalletStore()
const { isWatchOnly } = storeToRefs(walletStore)

const localLeverage = ref(1)
const localMaxLeverage = ref(20)
const localOldLeverage = ref(1)
const leverageError = ref('')
const isSavingLeverage = ref(false)
const fullMarketName = ref('')
const showLeverageModal = ref(false)

const saveLeverage = async () => {
  isSavingLeverage.value = true
  const payload: PerpsChangeLeveragePayload = {
    assetName: fullMarketName.value,
    oldLeverage: localOldLeverage.value,
    maxLeverage: localMaxLeverage.value,
    newLeverage: localLeverage.value,
  }
  void analytics.trackPerpsChangeLeverageEvent(
    PerpsChangeLeverageEvent.CLICKED_SUBMIT,
    payload,
  )
  try {
    await perpsClient.setLeverage(fullMarketName.value, localLeverage.value)
    showLeverageModal.value = false
    perpsToasts.toastLeverageUpdated(localLeverage.value, fullMarketName.value)
    void analytics.trackPerpsChangeLeverageEvent(
      PerpsChangeLeverageEvent.SUBMIT_SUCCESS,
      payload,
    )
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : String(e ?? t('perps.market-list.leverage-error-fallback'))
    leverageError.value = errorMessage
    perpsToasts.toastFailedToSetLeverage()
    const failPayload: PerpsChangeLeverageFailPayload = {
      ...payload,
      errorMessage,
    }
    void analytics.trackPerpsChangeLeverageFailEvent(
      PerpsChangeLeverageEvent.SUBMIT_FAIL,
      failPayload,
    )
    capturePerps(PERPS_FEATURE.LEVERAGE, e, {
      title: 'PERPS: Set leverage failed',
      extra: { market: fullMarketName.value, newLeverage: localLeverage.value },
    })
  } finally {
    isSavingLeverage.value = false
  }
}

const displaySymbol = computed(() => fullMarketName.value.split('-')[0])

const openLeverage = (pos: Position) => {
  void analytics.trackPerpsManageEvent(PerpsManageEvent.CHANGE_LEVERAGE, {
    assetName: pos.market,
    location: PerpsEventLocation.POSITIONS_TABLE,
  })
  const pair = markets.value.find(m => m.market === pos.market)
  const parsedMax = parseInt(pair?.defaultLeverage ?? '')
  const maxLev = Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : 20
  localMaxLeverage.value = maxLev
  const parsedPos = Number(pos.leverage)
  const initial =
    Number.isFinite(parsedPos) && parsedPos > 0 ? parsedPos : maxLev
  localLeverage.value = Math.min(initial, maxLev)
  localOldLeverage.value = localLeverage.value
  fullMarketName.value = pos.market
  showLeverageModal.value = true
}

watch(
  () => showLeverageModal.value,
  val => {
    if (!val) {
      localLeverage.value = 1
      localMaxLeverage.value = 20
      leverageError.value = ''
      isSavingLeverage.value = false
      fullMarketName.value = ''
    }
  },
)

const USDC_LOGO =
  'https://coin-images.coingecko.com/coins/images/6319/large/USDC.png?1769615602'
const emits = defineEmits<{
  openPosition: [market: string]
  openSideMenu: [market: string, type: 'add' | 'close' | undefined]
}>()

const openPositionAdd = (pos: Position, type: 'add' | 'close' | undefined) => {
  if (type === 'add') {
    void analytics.trackPerpsManageEvent(PerpsManageEvent.ADD_TO_POSITION, {
      assetName: pos.market,
      location: PerpsEventLocation.POSITIONS_TABLE,
    })
  } else if (type === 'close') {
    void analytics.trackPerpsManageEvent(PerpsManageEvent.CLOSE_POSITION, {
      assetName: pos.market,
      location: PerpsEventLocation.POSITIONS_TABLE,
    })
  }
  emits('openSideMenu', pos.market, type)
}

const fillsTable = ref<HTMLElement | null>(null)
const ordersTable = ref<HTMLElement | null>(null)

// Four data columns fit at M (768px); `largeOnly` ones join at L (1280px) and
// the rest live in the row's detail (market page, order / fill dialog). At S
// only the leading and `primary` columns remain.
const positionColumns = computed<TableColumn[]>(() => [
  { key: 'market', label: t('perps.positions.market-header') },
  { key: 'value', label: t('perps.positions.value-label') },
  { key: 'upnl', label: t('perps.positions.upnl-header'), primary: true },
  {
    key: 'entry',
    label: t('perps.positions.entry-price-label'),
    largeOnly: true,
  },
  { key: 'mark', label: t('perps.positions.mark-price-label') },
  { key: 'liq', label: t('perps.positions.liq-price-header') },
  {
    key: 'margin',
    label: t('perps.positions.margin-used-header'),
    largeOnly: true,
  },
  {
    key: 'funding',
    label: t('perps.positions.total-funding-header'),
    largeOnly: true,
  },
])

const orderColumns = computed<TableColumn[]>(() => [
  { key: 'market', label: t('perps.positions.market-header') },
  { key: 'side', label: t('perps.confirm.side-label') },
  { key: 'status', label: t('perps.order.status-label') },
  { key: 'type', label: t('perps.order.type-label'), largeOnly: true },
  { key: 'price', label: t('perps.order.price-label'), primary: true },
  { key: 'filled', label: t('perps.positions.filled-size-header') },
])

const fillColumns = computed<TableColumn[]>(() => [
  { key: 'market', label: t('perps.positions.market-header') },
  { key: 'direction', label: t('perps.positions.direction-header') },
  { key: 'price', label: t('perps.order.price-label'), primary: true },
  { key: 'size', label: t('perps.trade.size') },
  { key: 'pnl', label: t('perps.positions.pnl-header') },
])

const dwColumns = computed<TableColumn[]>(() => [
  { key: 'type', label: t('perps.order.type-label') },
  { key: 'time', label: t('perps.fill.time-label') },
  { key: 'usd', label: t('perps.positions.usd-value-header') },
  { key: 'amount', label: t('perps.positions.amount-header'), primary: true },
  { key: 'status', label: t('perps.order.status-label') },
])

const { positions, hasLoaded: positionsHasLoaded } = usePerpsPositions()

const {
  currentPage: positionsCurrentPage,
  paginatedArray: paginatedPositions,
  totalPages: positionsTotalPages,
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
  void analytics.trackPerpsOrderViewInfoEvent(
    PerpsOrderEvent.CLICKED_VIEW_INFO,
    {
      assetName: order.market,
      status: order.status,
      orderId: order.orderId,
      type: order.type,
      location: PerpsEventLocation.POSITIONS_TABLE,
    },
  )
  selectedOrder.value = order
  showOrderDialog.value = true
}

const orderFilterTabs = computed(() => [
  { label: t('perps.select-market.filter-tab-all'), value: 'all' },

  { label: t('perps.positions.filter-pending'), value: 'pending' },
])

const selectedOrderFilterValue = ref('all')

const ordersStatusFilter = computed<OrdersStatusFilter>(() =>
  selectedOrderFilterValue.value === 'pending' ? 'pending' : 'all',
)

const {
  orders,
  loading: ordersLoading,
  refetch: refetchOrders,
  currentPage: ordersCurrentPage,
  hasPrev: ordersHasPrev,
  hasNext: ordersHasNext,
  nextPage: ordersNextPage,
  prevPage: ordersPrevPage,
} = usePerpsOrders(ordersStatusFilter)

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
const orderPendingCancel = ref<ApiOrder | null>(null)
const showCancelConfirmation = ref(false)
const perpsToasts = usePerpsToasts()
const { markets } = usePerpsMarkets()

function openCancelConfirmation(order: ApiOrder) {
  void analytics.trackPerpsOrderCancelClickedEvent(
    PerpsOrderEvent.CLICKED_CANCEL,
    {
      assetName: order.market,
      orderId: order.orderId,
      type: order.type,
      price: order.price,
      size: order.size,
      direction: order.side,
      location: PerpsEventLocation.POSITIONS_TABLE,
    },
  )
  orderPendingCancel.value = order
  showCancelConfirmation.value = true
}

watch(showCancelConfirmation, isOpen => {
  if (isOpen) showOrderDialog.value = false
})

async function confirmCancelOrder() {
  if (!orderPendingCancel.value) return
  await cancelOrder(orderPendingCancel.value)
  showCancelConfirmation.value = false
}

async function cancelOrder(order: ApiOrder) {
  if (cancellingOrderId.value === order.orderId) return
  cancellingOrderId.value = order.orderId
  const market = markets.value.find(m => m.market === order.market)
  const displayMarket = market?.longName ?? market?.displayName ?? order.market
  const cancelPayload = {
    assetName: order.market,
    orderId: order.orderId,
    type: order.type,
    price: order.price,
    size: order.size,
    direction: order.side,
  }
  void analytics.trackPerpsOrderCancelSubmitEvent(
    PerpsOrderEvent.CANCEL_SUBMIT,
    cancelPayload,
  )
  try {
    await perpsClient.cancelOrder(order.orderId)
    void analytics.trackPerpsOrderCancelSubmitEvent(
      PerpsOrderEvent.CANCEL_SUBMIT_SUCCESS,
      cancelPayload,
    )
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
    capturePerps(PERPS_FEATURE.ORDER, e, {
      title: 'PERPS: Cancel order failed',
    })
    const errorMessage = e instanceof Error ? e.message : String(e)
    void analytics.trackPerpsOrderCancelErrorEvent(
      PerpsOrderEvent.CANCEL_SUBMIT_ERROR,
      { ...cancelPayload, errorMessage },
    )
    const msg = errorMessage.toLowerCase()
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

type CombinedDWRow = {
  key: string
  type: string
  coin: string
  size: string
  usdValue?: string
  statusLabel: string
  statusColor: string
  time: string
}

// Maps a raw deposit/withdrawal status enum to its i18n key. Deposit statuses
// ('pending' | 'confirmed') and withdrawal statuses ('WITHDRAWAL_*') never
// collide, so a single map suffices. `WITHDRAWAL_PENDING` reuses the shared
// 'pending' key. Unmapped statuses fall back to the raw value ($t renders it
// verbatim), so the raw enum still shows unchanged.
const dwStatusKeys: Record<string, string> = {
  pending: 'perps.positions.dw-status.pending',
  confirmed: 'perps.positions.dw-status.confirmed',
  WITHDRAWAL_SUCCESS: 'perps.positions.dw-status.completed',
  WITHDRAWAL_FAILURE: 'perps.positions.dw-status.failed',
  WITHDRAWAL_PENDING: 'perps.positions.dw-status.pending',
  WITHDRAWAL_CANCELLED: 'perps.positions.dw-status.cancelled',
  WITHDRAWAL_UNKNOWN: 'perps.positions.dw-status.unknown',
}
const statusKey = (status: string): string => dwStatusKeys[status] ?? status

// `type` stays 'Deposit' | 'Withdrawal' internally (used for the success/
// warning color comparisons above), this only translates it for display.
const formatDWType = (type: string) =>
  type === 'Deposit'
    ? t('perps.positions.deposit-label')
    : t('perps.positions.withdrawal-label')

const combinedDW = computed<CombinedDWRow[]>(() => {
  const items: CombinedDWRow[] = []
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
          ? 'text-text-success'
          : d.status === 'pending'
            ? 'text-text-warning'
            : 'text-text-subtle',
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
      statusColor: withdrawalStatusColor(w.status),
      time: w.time,
    })
  }
  items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  return items
})

const {
  currentPage: dwCurrentPage,
  paginatedArray: paginatedDW,
  totalPages: dwTotalPages,
} = usePaginate<CombinedDWRow>(combinedDW, PERPS_PAGE_SIZE)

const tabs = computed(() => [
  { label: t('perps.positions.tab-positions'), value: 'positions' },
  { label: t('perps.positions.tab-orders'), value: 'orders' },
  { label: t('perps.positions.tab-fills'), value: 'fills' },
  { label: t('perps.positions.tab-deposits'), value: 'deposits' },
])

// Track the tab by value, not by object: labels are locale-dependent and
// AppSelect compares the selection by structural equality.
const activeTab = ref('positions')
const selectedTab = computed({
  get: () =>
    tabs.value.find(tab => tab.value === activeTab.value) ?? tabs.value[0],
  set: (tab: { label: string; value: string }) => {
    activeTab.value = tab.value
  },
})

// Open-orders count for the Orders tab badge. Sourced from the current cursor
// page. When the Pending filter is active the API already restricts the page
// to open orders, so the count is just the page length. When "All" is active
// the page mixes open + closed orders so we filter client-side. The "+" cap
// only triggers when the page is full AND a next page exists.
const openOrdersCount = computed(() => {
  if (ordersStatusFilter.value === 'pending') return orders.value.length
  return orders.value.filter(
    o =>
      o.status === 'pending' ||
      o.status === 'untriggered' ||
      o.status === 'open',
  ).length
})
const openOrdersCountIsCapped = computed(
  () => ordersHasNext.value && openOrdersCount.value >= PERPS_PAGE_SIZE,
)
</script>
