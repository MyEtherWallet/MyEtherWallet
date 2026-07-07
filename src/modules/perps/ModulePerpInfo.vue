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
              >({{ longName }})</span
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
    <div class="py-6">
      <div class="flex items-center justify-end mb-4 px-4 lg:px-10 sm:mb-4">
        <app-btn-group
          v-model:selected="selectedInterval"
          :btn-list="isXS ? chartIntervals.slice(0, 2) : chartIntervals"
          size="xs"
        >
          <template #btn-content="{ data }">
            {{ data.label }}
          </template>
          <template #custom>
            <app-select
              v-if="isXS"
              v-model:selected="selectedInterval"
              :options="chartIntervals.slice(2)"
              position="-right-1"
              class="text-s-12"
            >
              <template #select-button="{ toggleSelect }">
                <button
                  class="rounded-full hoverNoBG p-2 h-6 min-w-[46px] !text-s-12 flex items-center"
                  @click="toggleSelect"
                >
                  <p>More</p>
                  <chevron-down-icon class="w-4 h-4 ml-1" />
                </button>
              </template>
            </app-select>
          </template>
        </app-btn-group>
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
      <!-- Market Stats -->
      <div class="px-4 lg:px-10 pt-6">
        <div class="grid grid-cols-2 xl:grid-cols-5 gap-x-4 gap-y-6">
          <div>
            <p
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
            >
              Price
            </p>
            <p class="text-s-14 font-bold">
              {{ formatPrice(currentPrice) }}
            </p>
          </div>
          <div>
            <p
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
            >
              Mark Price
            </p>
            <p class="text-s-14 font-bold">
              {{ formatPrice(markPrice) }}
            </p>
          </div>
          <div>
            <p
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
            >
              24hr Trade Vol
            </p>
            <p class="text-s-14 font-bold">
              {{ formatVolume(contractData?.usdVolume) }}
            </p>
          </div>
          <div>
            <p
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
            >
              Open Interest
            </p>
            <p class="text-s-14 font-bold">
              {{ formatVolume(contractData?.openInterestUsd) }}
            </p>
          </div>
          <div>
            <p
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
            >
              Funding Countdown
            </p>
            <p class="text-s-14 font-bold">
              <span :class="pnlColor(contractData?.fundingRate || '0')">
                {{
                  contractData?.fundingRate
                    ? `${(parseFloat(contractData.fundingRate) * 100).toFixed(4)}%`
                    : '—'
                }}
              </span>
              <span v-if="fundingCountdown" class="text-info text-s-12">
                in {{ fundingCountdown }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- Position -->
    <div v-if="isWalletConnected && marketPosition" class="py-6">
      <!-- Position Info -->
      <div
        class="flex flex-col items-start gap-3 pt-6 bg-appBackground rounded-20 mx-2 px-2 sm:px-4 lg:mx-6 lg:px-6 py-6 mb-6"
      >
        <div
          class="flex flex-wrap items-center justify-between xs:justify-start px-2 gap-x-3 gap-y-1 w-full"
        >
          <h2 class="font-bold text-s-17 sm:text-s-20 leading-p-150 order-1">
            Open Position:
          </h2>
          <div
            class="order-3 xs:order-2 basis-full xs:basis-auto -ml-1 xs:ml-0"
          >
            <span
              :class="[
                marketPosition.direction === 'long'
                  ? 'text-success'
                  : 'text-error',
                ' capitalize bg-surface px-3 rounded-full sm:ml-2 text-s-17 sm:text-s-20 font-bold ',
              ]"
            >
              {{ marketPosition.direction }}
              {{ marketPosition.leverage }}x
            </span>
          </div>

          <app-select
            v-model:selected="selectedManageAction"
            :options="manageOptions"
            position="right-0"
            placeholder="Manage"
            class="ml-auto order-1 xs:order-3"
            v-if="!isWatchOnly"
          >
            <template #select-button="{ toggleSelect }">
              <button
                class="hidden xs:block rounded-full bg-white py-2 px-4 shadow-button text-s-14 font-medium"
                @click="toggleSelect"
              >
                <div class="flex items-center">
                  <span>Manage</span>
                  <chevron-down-icon class="w-4 h-4 ml-1" />
                </div>
              </button>
              <app-btn-icon
                class="block xs:hidden ml-auto bg-white shadow-button shadow-button-elevated"
                label="Manage Position"
                height="h-7 xs:h-8"
                width="w-7 xs:w-8"
                @click="toggleSelect"
              >
                <ellipsis-vertical-icon class="w-5 h-5" />
              </app-btn-icon>
            </template>
          </app-select>
          <div v-else class="ml-auto order-1 xs:order-3">
            <app-base-button @click="connectWallet" size="medium">
              Connect wallet</app-base-button
            >
          </div>
        </div>

        <div
          class="grid grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-6 w-full mt-2 px-2"
        >
          <div>
            <p
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
            >
              Value
            </p>
            <p class="text-s-14 font-bold">
              {{ formatUsd(marketPosition.notionalValue) }}
            </p>
          </div>
          <div>
            <p
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
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
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
            >
              Liquidation
            </p>
            <p class="text-s-14 font-bold">
              {{ formatPrice(marketPosition.liquidationPrice) }}
            </p>
          </div>
          <div>
            <p
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
            >
              Quantity
            </p>
            <p class="text-s-14 font-bold">
              {{ marketPosition.netQuantity }} {{ baseCurrency.toUpperCase() }}
            </p>
          </div>
        </div>
        <app-btn-text
          size="medium"
          class="font-medium mt-3 -ml-1"
          @click="showPositionMore = !showPositionMore"
          >More
          <chevron-down-icon
            class="w-4 h-4 ml-1 inline-block align-middle"
            :class="{ 'rotate-180 ': showPositionMore }"
          />
        </app-btn-text>
        <transition name="fade" mode="out-in">
          <div
            v-if="showPositionMore"
            class="grid grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-6 w-full px-2 border-t border-grey-10 pt-3 -mt-2"
          >
            <div>
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
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
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                Entry Price
              </p>
              <p class="text-s-14 font-bold">
                {{ formatPrice(marketPosition.averageEntryPrice) }}
              </p>
            </div>
            <div>
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                Mark Price
              </p>
              <p class="text-s-14 font-bold">
                {{ formatPrice(marketPosition.markPrice) }}
              </p>
            </div>

            <div>
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                Used Margin
              </p>
              <p class="text-s-14 font-bold">
                {{ formatUsd(marketPosition.usedMargin) }}
              </p>
            </div>

            <div>
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                Bankruptcy
              </p>
              <p class="text-s-14 font-bold">
                {{ formatPrice(marketPosition.bankruptcyPrice) }}
              </p>
            </div>
            <div>
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                Maint. Margin
              </p>
              <p class="text-s-14 font-bold">
                {{ formatUsd(marketPosition.maintenanceMargin) }}
              </p>
            </div>
            <div>
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                Funding
              </p>
              <p class="text-s-14 font-bold">
                {{ formatUsd(marketPosition.netFundingSinceNeutral) }}
              </p>
            </div>

            <div v-if="marketPosition.takeProfitTriggerPrice">
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                Take Profit
              </p>
              <p class="text-s-14 font-bold text-success">
                {{ formatPrice(marketPosition.takeProfitTriggerPrice) }}
              </p>
            </div>
            <div v-if="marketPosition.stopLossTriggerPrice">
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                Stop Loss
              </p>
              <p class="text-s-14 font-bold text-error">
                {{ formatPrice(marketPosition.stopLossTriggerPrice) }}
              </p>
            </div>
          </div>
        </transition>
      </div>
      <!-- Market Position Info Tabs -->
      <div
        class="flex flex-col items-start gap-3 bg-appBackground rounded-20 mx-2 px-2 lg:mx-6 py-6 mt-6"
      >
        <div class="hidden lg:flex lg:items-center">
          <app-btn-group
            v-model:selected="activeInfoTabObj"
            :btn-list="infoTabs"
            size="medium"
            class="ml-2"
          >
            <template #btn-content="{ data }">
              <span>
                {{ data.label }}
                <span
                  v-if="data.value === 'orders' && openOrdersCountForMarket > 0"
                  class="ml-1 text-info text-s-12"
                >
                  ·
                  {{
                    openOrdersCountIsCapped
                      ? `${OPEN_COUNT_LIMIT}+`
                      : openOrdersCountForMarket
                  }}
                </span>
              </span>
            </template>
          </app-btn-group>
        </div>
        <app-select
          v-model:selected="activeInfoTabObj"
          :options="infoTabs"
          position="left-0"
          placeholder="Tab"
          class="lg:hidden sm:mx-2 w-full sm:w-auto"
        >
          <template #select-button="{ toggleSelect }">
            <div class="bg-surface rounded-full p-1">
              <button
                class="rounded-full bg-white py-3 w-full sm:w-auto min-w-[180px] px-5 shadow-button"
                @click="toggleSelect"
              >
                <div class="flex items-center justify-between">
                  <span class="text-s-16 font-medium">
                    {{ activeInfoTabObj.label }}
                    <span
                      v-if="
                        activeInfoTab === 'orders' &&
                        openOrdersCountForMarket > 0
                      "
                      class="ml-1 text-info text-s-12"
                    >
                      ·
                      {{
                        openOrdersCountIsCapped
                          ? `${OPEN_COUNT_LIMIT}+`
                          : openOrdersCountForMarket
                      }}
                    </span>
                  </span>
                  <chevron-down-icon class="w-4 h-4 ml-1" />
                </div>
              </button>
            </div>
          </template>
        </app-select>
        <transition name="fade" mode="out-in">
          <!--Orders tab -->
          <div
            v-if="activeInfoTab === 'orders'"
            class="w-full"
            key="position-orders"
          >
            <div class="mb-4 xs:pl-4">
              <app-btn-group
                v-model:selected="selectedOrderFilter"
                :btn-list="orderFilterTabs"
                size="xs"
              >
                <template #btn-content="{ data }">
                  <span class="px-2"
                    >{{ data.label }}
                    <span
                      v-if="
                        data.value === 'pending' && openOrdersCountForMarket > 0
                      "
                      class="ml-1 text-info text-s-11"
                    >
                      ·
                      {{
                        openOrdersCountIsCapped
                          ? `${OPEN_COUNT_LIMIT}+`
                          : openOrdersCountForMarket
                      }}
                    </span></span
                  >
                </template>
              </app-btn-group>
            </div>
            <app-table-skeleton
              v-if="ordersLoading && marketOrders.length === 0"
              :rows="3"
              :columns="ordersSkeletonColumns"
            />
            <div
              v-else-if="
                filteredMarketOrders.length === 0 && ordersCurrentPage === 0
              "
              class="text-center py-8 text-info text-s-14"
            >
              No orders for {{ baseCurrency }}
            </div>
            <table
              v-else
              ref="ordersTable"
              class="w-full text-s-14 table-fixed"
            >
              <thead>
                <tr
                  class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold border-b border-grey-10"
                >
                  <th class="px-1 sm:pl-4 py-3 text-left font-bold">Side</th>
                  <th
                    class="px-1 py-3 text-left font-bold hidden 2xl:table-cell"
                  >
                    Status
                  </th>
                  <th
                    class="px-1 py-3 text-left font-bold hidden xl:table-cell"
                  >
                    Type
                  </th>
                  <th class="px-1 py-3 text-right font-bold">Price</th>
                  <th
                    class="px-1 py-3 text-right font-bold hidden lg:table-cell"
                  >
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
                  v-for="order in filteredMarketOrders"
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
                  <td
                    class="pl-2 xs:pl-4 pr-0 rounded-r-12 sm:pl-3 sm:pr-1 py-3"
                  >
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
                                  openCancelConfirmation(order),
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
          <!--Fills tab -->
          <div
            v-else-if="activeInfoTab === 'fills'"
            class="w-full"
            key="position-fills"
          >
            <app-table-skeleton
              v-if="fillsLoading && marketFills.length === 0"
              :rows="3"
              :columns="fillsSkeletonColumns"
            />
            <div
              v-else-if="marketFills.length === 0 && fillsCurrentPage === 0"
              class="text-center py-6 text-info text-s-14"
            >
              No fills for {{ baseCurrency }}
            </div>
            <div v-else class="w-full">
              <table ref="fillsTable" class="w-full text-s-14 table-fixed">
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
          </div>
        </transition>
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
      <div class="grid grid-cols-2 xl:grid-cols-5 gap-x-4 gap-y-6">
        <div>
          <p
            class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
          >
            Asset Name
          </p>
          <p class="text-s-14 font-bold">{{ assetName }}</p>
        </div>
        <div>
          <p
            class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
          >
            Ticker
          </p>
          <p class="text-s-14 font-bold">{{ baseCurrency }}</p>
        </div>
        <div>
          <p
            class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
          >
            Category
          </p>
          <p class="text-s-14 font-bold">{{ category }}</p>
        </div>
        <div>
          <p
            class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
          >
            24H High
          </p>
          <p class="text-s-14 font-bold">
            {{ formatPrice(perpInfo?.underlyingMarket?.high) }}
          </p>
        </div>
        <div>
          <p
            class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
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
  <perps-select-leverage-dialog
    v-model:is-open="showLeverageDialog"
    v-model="tempLeverage"
    :symbol="baseCurrency"
    :leverage-error="leverageError"
    :is-saving="isSavingLeverage"
    :max-leverage="marketMaxLeverage"
    mode="submit"
    @save="saveLeverage"
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
    :display-symbol="baseCurrency"
    :is-cancelling="cancellingOrderId === orderPendingCancel.orderId"
    @confirm="confirmCancelOrder"
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
import AppSelect from '@/components/AppSelect.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppTableSkeleton, {
  type SkeletonColumn,
} from '@/components/AppTableSkeleton.vue'
import PerpsOrderDialog from './components/PerpsOrderDialog.vue'
import PerpsCancelOrderConfirmationDialog from './components/PerpsCancelOrderConfirmationDialog.vue'
import PerpsFillDetailsDialog from './components/PerpsFillDetailsDialog.vue'
import PerpsSelectLeverageDialog from './components/PerpsSelectLeverageDialog.vue'
import PerpsPagination from './components/PerpsPagination.vue'
import { EllipsisVerticalIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import ChartPrice from '@/components/ChartPrice.vue'

import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'
import { perpsClient, PERPS_INFO_PAGE_SIZE } from './configs'
import { useCursorPaginate } from './composables/useCursorPaginate'
import {
  usePerpsMarkets,
  usePerpsContracts,
} from './composables/usePerpsMarkets'
import { usePerpsPositions } from './composables/usePerpsPositions'
import { usePerpsAuth } from './composables/usePerpsAuth'
import { usePerpsMarkPrices } from './composables/usePerpsMarkPrices'
import { usePerpsTradeForm } from './composables/usePerpsTradeForm'
import { usePerpsToasts } from './composables/usePerpsToasts'
import { perpsWs } from './sdk/ws'
import { ensurePerpsWsLifecycle } from './composables/usePerpsWsLifecycle'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import type { ApiOrder, ApiFill, MarketInfoData } from './sdk/types'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAccessStore } from '@/stores/accessStore'
import { analytics, ConnectWalletEvent, PerpsChangeLeverageEvent } from '@/analytics'
import type {
  PerpsChangeLeveragePayload,
  PerpsChangeLeverageFailPayload,
} from '@/analytics'

const { setSelectedTradeManageMode, setWalletPanel, setIsOpenSideMenu } =
  useWalletMenuStore()
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

const connectWallet = () => {
  analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
    source: 'Perps_Market_Info',
  })
  useAccessStore().openAccessDialog()
}

const props = defineProps({
  market: {
    type: String,
    required: true,
  },
})

const walletStore = useWalletStore()
const { isWalletConnected, isWatchOnly } = storeToRefs(walletStore)

const { isXS } = useAppBreakpoints()

const { token, refreshKey } = usePerpsAuth()
const { markets } = usePerpsMarkets()
const { contracts } = usePerpsContracts()
const { positions } = usePerpsPositions()
const { markPriceData } = usePerpsMarkPrices()
const { leverage } = usePerpsTradeForm()
const perpsToasts = usePerpsToasts()
ensurePerpsWsLifecycle()

const baseCurrency = computed(() => props.market.split('-')[0] ?? props.market)

const displayName = computed(() => {
  const pair = markets.value.find(m => m.market === props.market)
  return pair?.displayName ?? baseCurrency.value
})

const longName = computed(() => {
  const pair = markets.value.find(m => m.market === props.market)
  return pair?.longName ?? pair?.displayName ?? baseCurrency.value
})

const assetName = computed(
  () => perpInfo.value?.underlyingName ?? longName.value,
)

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

const fetchPerpetualInfo = async () => {
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

// Cursor-paginated orders & fills for this market (page size 5).
const ordersTable = ref<HTMLElement | null>(null)
const fillsTable = ref<HTMLElement | null>(null)

const ordersPagination = useCursorPaginate<ApiOrder>(
  opts => perpsClient.getOrders({ ...opts, market: props.market }),
  PERPS_INFO_PAGE_SIZE,
)
const {
  items: marketOrders,
  loading: ordersLoading,
  currentPage: ordersCurrentPage,
  hasPrev: ordersHasPrev,
  hasNext: ordersHasNext,
  nextPage: ordersNextPage,
  prevPage: ordersPrevPage,
} = ordersPagination

const fillsPagination = useCursorPaginate<ApiFill>(
  opts => perpsClient.getFills({ ...opts, market: props.market }),
  PERPS_INFO_PAGE_SIZE,
)
const {
  items: marketFills,
  loading: fillsLoading,
  currentPage: fillsCurrentPage,
  hasPrev: fillsHasPrev,
  hasNext: fillsHasNext,
  nextPage: fillsNextPage,
  prevPage: fillsPrevPage,
} = fillsPagination

// Open-orders count for the tab badge. The cursor-paginated table only loads
// 5 orders per page, so a separate fetch is needed to know how many open
// orders exist for this market. Limit caps the count at 50 ("50+" if more).
const OPEN_COUNT_LIMIT = 50
const PENDING_STATUSES = new Set(['pending', 'untriggered', 'open'])
const openOrdersCountForMarket = ref(0)
const openOrdersCountIsCapped = ref(false)
let openOrdersFetchSeq = 0

const orderFilterTabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
]
const selectedOrderFilter = ref(orderFilterTabs[0])

const filteredMarketOrders = computed(() => {
  if (selectedOrderFilter.value.value === 'all') return marketOrders.value
  return marketOrders.value.filter(o => PENDING_STATUSES.has(o.status))
})

async function fetchOpenOrdersCount() {
  if (!token.value) {
    openOrdersCountForMarket.value = 0
    openOrdersCountIsCapped.value = false
    return
  }
  // Snapshot context so a slow response from a previous market or auth
  // session can't overwrite the badge after the user has switched markets
  // or logged out. The token guard covers logout, where the auth/market
  // watcher clears values but doesn't kick off a new fetch (so doesn't
  // bump the seq).
  const seq = ++openOrdersFetchSeq
  const market = props.market
  const startToken = token.value
  try {
    const res = await perpsClient.getOrders({
      market,
      limit: OPEN_COUNT_LIMIT,
    })
    if (
      seq !== openOrdersFetchSeq ||
      market !== props.market ||
      startToken !== token.value
    )
      return
    const list = res.result ?? []
    // Cap on the pending count, not list.length — the fetch returns all order
    // statuses, so 50 fetched with only 5 pending must not render as "5 · 50+".
    const pendingCount = list.filter(o => PENDING_STATUSES.has(o.status)).length
    openOrdersCountForMarket.value = pendingCount
    openOrdersCountIsCapped.value =
      !!res.pageInfo?.nextCursor && pendingCount >= OPEN_COUNT_LIMIT
  } catch {
    if (
      seq !== openOrdersFetchSeq ||
      market !== props.market ||
      startToken !== token.value
    )
      return
    openOrdersCountForMarket.value = 0
    openOrdersCountIsCapped.value = false
  }
}

const cancellingOrderId = ref<string | null>(null)

const showFillDialog = ref(false)
const selectedFill = ref<ApiFill | null>(null)

const openFillDialog = (fill: ApiFill) => {
  selectedFill.value = fill
  showFillDialog.value = true
}

const showOrderDialog = ref(false)
const selectedOrder = ref<ApiOrder | null>(null)

const openOrderDialog = (order: ApiOrder) => {
  selectedOrder.value = order
  showOrderDialog.value = true
}

const showCancelButton = (order: ApiOrder) => {
  return (
    order.status === 'pending' ||
    order.status === 'untriggered' ||
    order.status === 'open'
  )
}

const cancelInfoOrder = async (order: ApiOrder) => {
  if (cancellingOrderId.value === order.orderId) return
  cancellingOrderId.value = order.orderId
  const market = markets.value.find(m => m.market === order.market)
  const displayMarket = market?.longName ?? market?.displayName ?? order.market
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
    await Promise.all([ordersPagination.refetch(), fetchOpenOrdersCount()])
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

const orderPendingCancel = ref<ApiOrder | null>(null)
const showCancelConfirmation = ref(false)

const openCancelConfirmation = (order: ApiOrder) => {
  orderPendingCancel.value = order
  showCancelConfirmation.value = true
}

watch(showCancelConfirmation, isOpen => {
  if (isOpen) showOrderDialog.value = false
})

const confirmCancelOrder = async () => {
  if (!orderPendingCancel.value) return
  await cancelInfoOrder(orderPendingCancel.value)
  showCancelConfirmation.value = false
}

const ordersSkeletonColumns: SkeletonColumn[] = [
  { header: 'Side' },
  { header: 'Status', hidden: 'hidden 2xl:table-cell' },
  { header: 'Type', hidden: 'hidden xl:table-cell' },
  { header: 'Price', align: 'right' },
  { header: 'Filled / Size', align: 'right', hidden: 'hidden lg:table-cell' },
  { header: '', width: '40px' },
]

const fillsSkeletonColumns: SkeletonColumn[] = [
  { header: 'Direction' },
  { header: 'Price', align: 'right' },
  { header: 'Size', align: 'right', hidden: 'hidden xl:table-cell' },
  { header: 'Fee', align: 'right', hidden: 'hidden xl:table-cell' },
  { header: 'PnL', align: 'right', hidden: 'hidden lg:table-cell' },
  { header: '', width: '36px' },
]

let ordersIsRefreshing = false
let fillsIsRefreshing = false

async function refreshOrdersPageZero() {
  if (ordersIsRefreshing) return
  if (ordersLoading.value) return
  if (ordersCurrentPage.value !== 0) return
  ordersIsRefreshing = true
  try {
    await ordersPagination.refetch()
  } finally {
    ordersIsRefreshing = false
  }
}

async function refreshFillsPageZero() {
  if (fillsIsRefreshing) return
  if (fillsLoading.value) return
  if (fillsCurrentPage.value !== 0) return
  fillsIsRefreshing = true
  try {
    await fillsPagination.refetch()
  } finally {
    fillsIsRefreshing = false
  }
}

// Hard reset only on auth or market change — those genuinely invalidate the
// current view. triggerRefresh() (place/cancel/close) bumps refreshKey but
// must not yank the user back to page 0; that mutation-driven path falls
// through to the in-place refetch below.
watch(
  [token, () => props.market],
  () => {
    ordersPagination.reset()
    fillsPagination.reset()
    openOrdersCountForMarket.value = 0
    openOrdersCountIsCapped.value = false
    if (!token.value) return
    void ordersPagination.refetch()
    void fillsPagination.refetch()
    void fetchOpenOrdersCount()
  },
  { immediate: true },
)

// Post-mutation refresh: refetch first page in place if visible, and update
// the badge regardless of which page the user is on.
watch(refreshKey, () => {
  if (!token.value) return
  void refreshOrdersPageZero()
  void refreshFillsPageZero()
  void fetchOpenOrdersCount()
})

const unsubscribeOrdersWs = perpsWs.subscribe<ApiOrder>('ordersPerps', () => {
  if (!token.value) return
  void refreshOrdersPageZero()
  void fetchOpenOrdersCount()
})
const unsubscribeFillsWs = perpsWs.subscribe<ApiFill>('fillsPerps', () => {
  if (!token.value) return
  void refreshFillsPageZero()
})

// Funding countdown timer
const fundingCountdown = ref('')
let countdownTimer: ReturnType<typeof setInterval> | null = null

const updateFundingCountdown = () => {
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
  unsubscribeOrdersWs()
  unsubscribeFillsWs()
})

// Tabs
const showPositionMore = ref<boolean>(false)
const activeInfoTab = ref('orders')
const infoTabs = [
  { key: 'orders', value: 'orders', label: 'Orders' },
  { key: 'fills', value: 'fills', label: 'Fills' },
  // { key: 'more', value: 'more', label: 'More' },
]
const activeInfoTabObj = computed({
  get: () => infoTabs.find(t => t.key === activeInfoTab.value) ?? infoTabs[0],
  set: (tab: (typeof infoTabs)[number]) => {
    activeInfoTab.value = tab.key
  },
})

// Close / Add Buttons

const manageOptions = [
  { value: 'add', label: 'Add to Position' },
  { value: 'leverage', label: 'Change Leverage' },
  { value: 'close', label: 'Close Position' },
]
const selectedManageAction = ref<{ value: string; label: string } | undefined>(
  undefined,
)

const showLeverageDialog = ref(false)
const tempLeverage = ref(1)
const isSavingLeverage = ref(false)
const leverageError = ref('')

const marketMaxLeverage = computed(() => {
  const pair = markets.value.find(m => m.market === props.market)
  const parsed = parseInt(pair?.defaultLeverage ?? '')
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 20
})

const saveLeverage = async () => {
  isSavingLeverage.value = true
  leverageError.value = ''
  const payload: PerpsChangeLeveragePayload = {
    assetName: props.market,
    oldLeverage: leverage.value,
    maxLeverage: marketMaxLeverage.value,
    newLeverage: tempLeverage.value,
  }
  void analytics.trackPerpsChangeLeverageEvent(
    PerpsChangeLeverageEvent.CLICKED_SUBMIT,
    payload,
  )
  try {
    await perpsClient.setLeverage(props.market, tempLeverage.value)
    showLeverageDialog.value = false
    leverage.value = tempLeverage.value
    perpsToasts.toastLeverageUpdated(tempLeverage.value, props.market)
    void analytics.trackPerpsChangeLeverageEvent(
      PerpsChangeLeverageEvent.SUBMIT_SUCCESS,
      payload,
    )
  } catch (e) {
    leverageError.value =
      e instanceof Error ? e.message : 'Failed to set leverage'
    perpsToasts.toastFailedToSetLeverage()
    const failPayload: PerpsChangeLeverageFailPayload = {
      ...payload,
      errorMessage: leverageError.value,
    }
    void analytics.trackPerpsChangeLeverageFailEvent(
      PerpsChangeLeverageEvent.SUBMIT_FAIL,
      failPayload,
    )
  } finally {
    isSavingLeverage.value = false
  }
}

watch(selectedManageAction, action => {
  if (!action) return
  if (action.value === 'add' || action.value === 'close') {
    setSelectedTradeManageMode(action.value)
    setWalletPanel('perps')
    setIsOpenSideMenu(true)
  } else if (action.value === 'leverage') {
    const parsedPosition = parseInt(marketPosition.value?.leverage ?? '')
    tempLeverage.value =
      Number.isFinite(parsedPosition) && parsedPosition > 0
        ? Math.min(parsedPosition, marketMaxLeverage.value)
        : marketMaxLeverage.value
    leverageError.value = ''
    showLeverageDialog.value = true
  }
  selectedManageAction.value = undefined
})

// Chart
const chartIntervals = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '1h', value: '60' },
  { label: '4h', value: '240' },
  { label: '1d', value: '1D' },
  { label: '1w', value: '1W' },
]
const selectedInterval = ref(chartIntervals[2])
const chartLoading = ref(false)
const chartLabels = ref<number[]>([])
const chartPoints = ref<number[]>([])

const chartCache = new Map<string, { labels: number[]; points: number[] }>()

const chartTimeFrame = computed(() => {
  const v = selectedInterval.value.value
  if (v === '1D') return '1D' as const
  if (v === '1W') return '7D' as const
  const mins = parseInt(v)
  if (mins <= 60) return '1D' as const
  if (mins <= 480) return '7D' as const
  return '1M' as const
})

const getResolutionSeconds = (res: string): number => {
  if (res === '1D') return 86400
  if (res === '1W') return 604800
  return parseInt(res) * 60
}

const fetchChart = async () => {
  const cacheKey = `${props.market}-${selectedInterval.value.value}`
  const cached = chartCache.get(cacheKey)
  if (cached) {
    chartLabels.value = cached.labels
    chartPoints.value = cached.points
    return
  }

  chartLoading.value = true
  try {
    const to = Math.floor(Date.now() / 1000)
    const resSecs = getResolutionSeconds(selectedInterval.value.value)
    const from = to - resSecs * 200
    const data = await perpsClient.getHistory(
      props.market,
      selectedInterval.value.value,
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
