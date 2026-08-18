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
            {{ $t('perps.info.perpetual-label') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="py-6">
      <div class="flex items-center justify-end mb-4 px-4 lg:px-10 sm:mb-4">
        <app-btn-group
          v-model:selected="selectedRange"
          :disabled="chartLoading"
          :btn-list="isXS ? chartRanges.slice(0, 3) : chartRanges"
          size="xs"
        >
          <template #btn-content="{ data }">
            {{ data.label }}
          </template>
          <template #custom>
            <app-select
              v-if="isXS"
              v-model:selected="selectedRange"
              :options="chartRanges.slice(3)"
              position="-right-1"
              class="text-s-12"
            >
              <template #select-button="{ toggleSelect }">
                <button
                  class="rounded-full hoverNoBG p-2 h-6 min-w-[46px] !text-s-12 flex items-center"
                  @click="toggleSelect"
                >
                  <p>{{ $t('perps.info.more-label') }}</p>
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
              {{ $t('perps.info.no-chart-data') }}
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
              {{ $t('perps.order.price-label') }}
            </p>
            <p class="text-s-14 font-bold">
              {{ formatPrice(currentPrice) }}
            </p>
          </div>
          <div>
            <p
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
            >
              {{ $t('perps.positions.mark-price-label') }}
            </p>
            <p class="text-s-14 font-bold">
              {{ formatPrice(markPrice) }}
            </p>
          </div>
          <div>
            <p
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
            >
              {{ $t('perps.info.volume-24h-label') }}
            </p>
            <p class="text-s-14 font-bold">
              {{ formatVolume(contractData?.usdVolume) }}
            </p>
          </div>
          <div>
            <p
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
            >
              {{ $t('perps.info.open-interest-label') }}
            </p>
            <p class="text-s-14 font-bold">
              {{ formatVolume(contractData?.openInterestUsd) }}
            </p>
          </div>
          <div>
            <p
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
            >
              {{ $t('perps.info.funding-countdown-label') }}
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
                {{ $t('perps.info.in-label') }} {{ fundingCountdown }}
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
            {{ $t('perps.info.open-position-label') }}
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
              {{
                marketPosition.direction === 'long'
                  ? $t('perps.trade.long')
                  : marketPosition.direction === 'short'
                    ? $t('perps.trade.short')
                    : marketPosition.direction
              }}
              {{ marketPosition.leverage }}x
            </span>
          </div>

          <app-select
            v-model:selected="selectedManageAction"
            :options="manageOptions"
            position="right-0"
            :placeholder="$t('perps.positions.manage-label')"
            class="ml-auto order-1 xs:order-3"
            v-if="!isWatchOnly"
          >
            <template #select-button="{ toggleSelect }">
              <button
                class="hidden xs:block rounded-full bg-white py-2 px-4 shadow-button text-s-14 font-medium"
                @click="toggleSelect"
              >
                <div class="flex items-center">
                  <span>{{ $t('perps.positions.manage-label') }}</span>
                  <chevron-down-icon class="w-4 h-4 ml-1" />
                </div>
              </button>
              <app-btn-icon
                class="block xs:hidden ml-auto bg-white shadow-button shadow-button-elevated"
                :label="$t('perps.info.manage-position-label')"
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
              {{ $t('perps.info.connect-wallet-label') }}</app-base-button
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
              {{ $t('perps.positions.value-label') }}
            </p>
            <p class="text-s-14 font-bold">
              {{ formatUsd(marketPosition.notionalValue) }}
            </p>
          </div>
          <div>
            <p
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
            >
              {{ $t('perps.info.upnl-label') }}
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
              {{ $t('perps.info.liquidation-label') }}
            </p>
            <p class="text-s-14 font-bold">
              {{ formatPrice(marketPosition.liquidationPrice) }}
            </p>
          </div>
          <div>
            <p
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
            >
              {{ $t('perps.info.quantity-label') }}
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
          >{{ $t('perps.info.more-label') }}
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
                {{ $t('perps.info.roe-label') }}
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
                {{ $t('perps.positions.entry-price-label') }}
              </p>
              <p class="text-s-14 font-bold">
                {{ formatPrice(marketPosition.averageEntryPrice) }}
              </p>
            </div>
            <div>
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                {{ $t('perps.positions.mark-price-label') }}
              </p>
              <p class="text-s-14 font-bold">
                {{ formatPrice(marketPosition.markPrice) }}
              </p>
            </div>

            <div>
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                {{ $t('perps.balance.used-margin-label') }}
              </p>
              <p class="text-s-14 font-bold">
                {{ formatUsd(marketPosition.usedMargin) }}
              </p>
            </div>

            <div>
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                {{ $t('perps.info.bankruptcy-label') }}
              </p>
              <p class="text-s-14 font-bold">
                {{ formatPrice(marketPosition.bankruptcyPrice) }}
              </p>
            </div>
            <div>
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                {{ $t('perps.info.maint-margin-label') }}
              </p>
              <p class="text-s-14 font-bold">
                {{ formatUsd(marketPosition.maintenanceMargin) }}
              </p>
            </div>
            <div>
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                {{ $t('perps.info.funding-label') }}
              </p>
              <p class="text-s-14 font-bold">
                {{ formatUsd(marketPosition.netFundingSinceNeutral) }}
              </p>
            </div>

            <div v-if="marketPosition.takeProfitTriggerPrice">
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                {{ $t('perps.confirm.take-profit') }}
              </p>
              <p class="text-s-14 font-bold text-success">
                {{ formatPrice(marketPosition.takeProfitTriggerPrice) }}
              </p>
            </div>
            <div v-if="marketPosition.stopLossTriggerPrice">
              <p
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
              >
                {{ $t('perps.confirm.stop-loss') }}
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
          :placeholder="$t('perps.positions.tab-placeholder')"
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
              {{ $t('perps.info.no-orders-for', { symbol: baseCurrency }) }}
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
                  <th class="px-1 sm:pl-4 py-3 text-left font-bold">
                    {{ $t('perps.confirm.side-label') }}
                  </th>
                  <th
                    class="px-1 py-3 text-left font-bold hidden 2xl:table-cell"
                  >
                    {{ $t('perps.order.status-label') }}
                  </th>
                  <th
                    class="px-1 py-3 text-left font-bold hidden xl:table-cell"
                  >
                    {{ $t('perps.order.type-label') }}
                  </th>
                  <th class="px-1 py-3 text-right font-bold">
                    {{ $t('perps.order.price-label') }}
                  </th>
                  <th
                    class="px-1 py-3 text-right font-bold hidden lg:table-cell"
                  >
                    {{ $t('perps.positions.filled-size-header') }}
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
                      {{
                        order.side === 'buy'
                          ? $t('perps.order.buy')
                          : order.side === 'sell'
                            ? $t('perps.order.sell')
                            : order.side
                      }}
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
                      {{ $t(formatOrderStatus(order.status)) }}
                    </p>
                  </td>
                  <!-- Type -->
                  <td
                    class="px-1 py-3 font-normal text-s-14 hidden xl:table-cell capitalize"
                  >
                    <p>{{ $t(formatOrderType(order.type)) }}</p>

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
                      {{ $t(formatOrderStatus(order.status)) }}
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
                      {{
                        $t('perps.positions.out-of', {
                          size: order.size,
                          symbol: baseCurrency,
                        })
                      }}
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
                        :placeholder="
                          $t('perps.market-list.actions-menu-label')
                        "
                        location="right"
                      >
                        <template #menu-button="{ toggleMenu }">
                          <app-btn-icon
                            :label="$t('perps.market-list.action-menu-label')"
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
                                <p>
                                  {{ $t('perps.positions.view-order-label') }}
                                </p>
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
                                    ? $t('perps.order.cancelling')
                                    : $t('perps.confirm.cancel')
                                }}
                              </li>
                            </ul>
                          </div>
                        </template>
                      </app-pop-up-menu>
                      <app-btn-icon
                        v-else
                        :label="$t('perps.positions.view-order-details-label')"
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
              {{ $t('perps.info.no-fills-for', { symbol: baseCurrency }) }}
            </div>
            <div v-else class="w-full">
              <table ref="fillsTable" class="w-full text-s-14 table-fixed">
                <thead>
                  <tr
                    class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold border-b border-grey-10"
                  >
                    <th class="px-1 sm:pl-4 py-3 text-left font-bold">
                      {{ $t('perps.positions.direction-header') }}
                    </th>
                    <th class="px-1 py-3 text-right font-bold">
                      {{ $t('perps.order.price-label') }}
                    </th>
                    <th
                      class="px-1 py-3 text-right font-bold hidden xl:table-cell"
                    >
                      {{ $t('perps.trade.size') }}
                    </th>
                    <th
                      class="px-1 py-3 text-right font-bold hidden xl:table-cell"
                    >
                      {{ $t('perps.fill.fee-label') }}
                    </th>
                    <th
                      class="px-1 py-3 text-right font-bold hidden lg:table-cell"
                    >
                      {{ $t('perps.positions.pnl-header') }}
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
                        {{ $t(directionKey(fill.direction)) }}
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
                        :label="$t('perps.positions.view-fill-details-label')"
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
      <h3 class="text-s-20 font-bold mb-3">
        {{ $t('perps.info.about-symbol', { symbol: baseCurrency }) }}
      </h3>
      <p class="text-s-14 text-info leading-relaxed">
        {{ stockDescription }}
      </p>
    </div>

    <!-- Instrument Info -->
    <div class="px-4 lg:px-10 py-6">
      <h3 class="text-s-20 font-bold mb-3">
        {{ $t('perps.info.instrument-information') }}
      </h3>
      <div class="grid grid-cols-2 xl:grid-cols-5 gap-x-4 gap-y-6">
        <div>
          <p
            class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
          >
            {{ $t('perps.info.asset-name-label') }}
          </p>
          <p class="text-s-14 font-bold">{{ assetName }}</p>
        </div>
        <div>
          <p
            class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
          >
            {{ $t('perps.info.ticker-label') }}
          </p>
          <p class="text-s-14 font-bold">{{ baseCurrency }}</p>
        </div>
        <div>
          <p
            class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
          >
            {{ $t('perps.info.category-label') }}
          </p>
          <p class="text-s-14 font-bold">{{ category }}</p>
        </div>
        <div>
          <p
            class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
          >
            {{ $t('perps.info.high-24h-label') }}
          </p>
          <p class="text-s-14 font-bold">
            {{ formatPrice(perpInfo?.underlyingMarket?.high) }}
          </p>
        </div>
        <div>
          <p
            class="text-s-11 uppercase text-info tracking-sp-06 font-bold mb-1"
          >
            {{ $t('perps.info.low-24h-label') }}
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
import { useI18n } from 'vue-i18n'
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
import type { WebTokenPriceChartInterval } from '@/mew_api/types'

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
import { usePerpsStatus } from './composables/usePerpsStatus'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import type { ApiOrder, ApiFill, MarketInfoData } from './sdk/types'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAccessStore } from '@/stores/accessStore'
import {
  analytics,
  ConnectWalletEvent,
  PerpsChangeLeverageEvent,
  PerpsEventSource,
  PerpsManageEvent,
  PerpsOrderEvent,
  PerpsEventLocation,
} from '@/analytics'
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
  directionKey,
} from './utils/formatters'
import {
  getLogoUrl,
  getCategory,
  midPrice as computeMidPrice,
} from './utils/market'

const { t } = useI18n()

const connectWallet = () => {
  analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
    source: PerpsEventSource.MARKET_INFO,
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
// Side-effect only: keeps `/status` polling alive while this surface is mounted,
// which is what gates every other perps request during an outage. Without it
// this page fetches happily against a service that has reported it is down.
usePerpsStatus()

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

// getCategory() returns fixed enum-like tokens ('Equities' | 'Commodities' |
// 'Indices') also used as filter keys elsewhere (usePerpsTradeForm.ts) — do
// not translate its return value directly, map it through i18n here for
// display only.
const categoryLabelKeys: Record<string, string> = {
  Equities: 'perps.select-market.filter-tab-equities',
  Commodities: 'perps.select-market.filter-tab-commodities',
  Indices: 'perps.select-market.filter-tab-indices',
}
const category = computed(() => {
  const c = contractData.value
  const raw = c ? getCategory(c) : 'Equities'
  return t(categoryLabelKeys[raw] ?? categoryLabelKeys.Equities)
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
    t('perps.info.default-description', {
      symbol: baseCurrency.value,
      displayName: displayName.value,
    }),
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

const orderFilterTabs = computed(() => [
  { label: t('perps.select-market.filter-tab-all'), value: 'all' },
  { label: t('perps.positions.filter-pending'), value: 'pending' },
])

// Track the filter by value, not by object: labels are locale-dependent and
// AppBtnGroup compares the selection by structural equality.
const selectedOrderFilterValue = ref('all')
const selectedOrderFilter = computed({
  get: () =>
    orderFilterTabs.value.find(
      tab => tab.value === selectedOrderFilterValue.value,
    ) ?? orderFilterTabs.value[0],
  set: (tab: { label: string; value: string }) => {
    selectedOrderFilterValue.value = tab.value
  },
})

const filteredMarketOrders = computed(() => {
  if (selectedOrderFilterValue.value === 'all') return marketOrders.value
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
  void analytics.trackPerpsOrderViewInfoEvent(
    PerpsOrderEvent.CLICKED_VIEW_INFO,
    {
      assetName: order.market,
      status: order.status,
      orderId: order.orderId,
      type: order.type,
      location: PerpsEventLocation.ORDER_INFO,
    },
  )
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

const cancelInfoOrder = async (order: ApiOrder): Promise<boolean> => {
  if (cancellingOrderId.value === order.orderId) return false
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
    await Promise.all([ordersPagination.refetch(), fetchOpenOrdersCount()])
    return true
  } catch (e) {
    console.error('Failed to cancel order:', e)
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
    return false
  } finally {
    cancellingOrderId.value = null
  }
}

const orderPendingCancel = ref<ApiOrder | null>(null)
const showCancelConfirmation = ref(false)

const openCancelConfirmation = (order: ApiOrder) => {
  void analytics.trackPerpsOrderCancelClickedEvent(
    PerpsOrderEvent.CLICKED_CANCEL,
    {
      assetName: order.market,
      orderId: order.orderId,
      type: order.type,
      price: order.price,
      size: order.size,
      direction: order.side,
      location: PerpsEventLocation.ORDER_INFO,
    },
  )
  orderPendingCancel.value = order
  showCancelConfirmation.value = true
}

watch(showCancelConfirmation, isOpen => {
  if (isOpen) showOrderDialog.value = false
})

const confirmCancelOrder = async () => {
  if (!orderPendingCancel.value) return
  const succeeded = await cancelInfoOrder(orderPendingCancel.value)
  if (succeeded) showCancelConfirmation.value = false
}

const ordersSkeletonColumns = computed<SkeletonColumn[]>(() => [
  { header: t('perps.confirm.side-label') },
  { header: t('perps.order.status-label'), hidden: 'hidden 2xl:table-cell' },
  { header: t('perps.order.type-label'), hidden: 'hidden xl:table-cell' },
  { header: t('perps.order.price-label'), align: 'right' },
  {
    header: t('perps.positions.filled-size-header'),
    align: 'right',
    hidden: 'hidden lg:table-cell',
  },
  { header: '', width: '40px' },
])

const fillsSkeletonColumns = computed<SkeletonColumn[]>(() => [
  { header: t('perps.positions.direction-header') },
  { header: t('perps.order.price-label'), align: 'right' },
  {
    header: t('perps.trade.size'),
    align: 'right',
    hidden: 'hidden xl:table-cell',
  },
  {
    header: t('perps.fill.fee-label'),
    align: 'right',
    hidden: 'hidden xl:table-cell',
  },
  {
    header: t('perps.positions.pnl-header'),
    align: 'right',
    hidden: 'hidden lg:table-cell',
  },
  { header: '', width: '36px' },
])

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
    fundingCountdown.value = t('perps.info.countdown-now')
    return
  }
  const mins = Math.floor(diff / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  fundingCountdown.value = t('perps.info.countdown-minutes', { mins })
  if (mins === 0)
    fundingCountdown.value = t('perps.info.countdown-seconds', { secs })
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
const infoTabs = computed(() => [
  { key: 'orders', value: 'orders', label: t('perps.positions.tab-orders') },
  { key: 'fills', value: 'fills', label: t('perps.positions.tab-fills') },
  // { key: 'more', value: 'more', label: 'More' },
])
const activeInfoTabObj = computed({
  get: () =>
    infoTabs.value.find(tab => tab.key === activeInfoTab.value) ??
    infoTabs.value[0],
  set: (tab: { key: string; value: string; label: string }) => {
    activeInfoTab.value = tab.key
  },
})

// Close / Add Buttons

const manageOptions = computed(() => [
  { value: 'add', label: t('perps.market-list.add-to-position') },
  { value: 'leverage', label: t('perps.market-list.change-leverage') },
  { value: 'close', label: t('perps.market-list.close-position') },
])
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
      e instanceof Error
        ? e.message
        : t('perps.market-list.leverage-error-fallback')
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
  if (action.value === 'add') {
    void analytics.trackPerpsManageEvent(PerpsManageEvent.ADD_TO_POSITION, {
      assetName: props.market,
      location: PerpsEventLocation.MARKET_INFO,
    })
    setSelectedTradeManageMode(action.value)
    setWalletPanel('perps')
    setIsOpenSideMenu(true)
  } else if (action.value === 'close') {
    void analytics.trackPerpsManageEvent(PerpsManageEvent.CLOSE_POSITION, {
      assetName: props.market,
      location: PerpsEventLocation.MARKET_INFO,
    })
    setSelectedTradeManageMode(action.value)
    setWalletPanel('perps')
    setIsOpenSideMenu(true)
  } else if (action.value === 'leverage') {
    void analytics.trackPerpsManageEvent(PerpsManageEvent.CHANGE_LEVERAGE, {
      assetName: props.market,
      location: PerpsEventLocation.MARKET_INFO,
    })
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
// The selection is how far back the chart goes — same as the token and stock
// charts elsewhere in the app. Each range pairs its window with a candle
// resolution that keeps the bar count in a readable range.
const DAY_SECS = 24 * 60 * 60

interface ChartRange {
  label: string
  value: WebTokenPriceChartInterval
  /** Candle resolution passed to the history endpoint. */
  resolution: string
  /** How far back from now the chart reaches, in seconds. */
  windowSecs: number
}

const chartRanges = computed<ChartRange[]>(() => [
  {
    label: t('common.chart_1d'),
    value: '1D',
    resolution: '5',
    windowSecs: DAY_SECS,
  },
  {
    label: t('common.chart_7d'),
    value: '7D',
    resolution: '60',
    windowSecs: 7 * DAY_SECS,
  },
  {
    label: t('common.chart_1m'),
    value: '1M',
    resolution: '240',
    windowSecs: 30 * DAY_SECS,
  },
  {
    label: t('common.chart_3m'),
    value: '3M',
    resolution: '1D',
    windowSecs: 90 * DAY_SECS,
  },
  {
    label: t('common.chart_1y'),
    value: '1Y',
    resolution: '1W',
    windowSecs: 365 * DAY_SECS,
  },
  {
    // Markets are far younger than this, so the response is the full history.
    label: t('common.chart_all'),
    value: 'ALL',
    resolution: '1W',
    windowSecs: 10 * 365 * DAY_SECS,
  },
])

const selectedRange = ref<ChartRange>(chartRanges.value[0])

// Labels are locale-dependent, so re-resolve the selection when they change.
watch(chartRanges, ranges => {
  selectedRange.value =
    ranges.find(r => r.value === selectedRange.value.value) ?? ranges[0]
})

const chartLoading = ref(false)
const chartLabels = ref<number[]>([])
const chartPoints = ref<number[]>([])

const chartCache = new Map<string, { labels: number[]; points: number[] }>()

const chartTimeFrame = computed(() => selectedRange.value.value)

const fetchChart = async () => {
  const { value: range, resolution, windowSecs } = selectedRange.value
  const cacheKey = `${props.market}-${range}`
  const cached = chartCache.get(cacheKey)
  if (cached) {
    chartLabels.value = cached.labels
    chartPoints.value = cached.points
    return
  }

  chartLoading.value = true
  try {
    const to = Math.floor(Date.now() / 1000)
    const from = to - windowSecs
    const data = await perpsClient.getHistory(
      props.market,
      resolution,
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

watch(() => selectedRange.value.value, fetchChart)
watch(() => props.market, fetchChart, { immediate: true })

// Clear chart cache every 5 minutes
const cacheClearTimer = setInterval(() => chartCache.clear(), 5 * 60 * 1000)
onUnmounted(() => clearInterval(cacheClearTimer))
</script>
