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
                  class="ml-1 text-info text-s-12"
                >
                  · {{ positions.length }}
                </span>
                <span
                  v-else-if="data.value === 'orders' && openOrdersCount > 0"
                  class="ml-1 text-info text-s-12"
                >
                  ·
                  {{
                    openOrdersCountIsCapped
                      ? `${PERPS_PAGE_SIZE}+`
                      : openOrdersCount
                  }}
                </span>
              </span>
            </template>
          </app-btn-group>
        </div>
        <app-select
          v-model:selected="selectedTab"
          :options="tabs"
          position="right-0"
          :placeholder="$t('perps.positions.tab-placeholder')"
          class="lg:hidden"
        >
          <template #select-button="{ toggleSelect }">
            <div class="bg-surface rounded-full p-1 w-full xs:w-auto">
              <button
                class="rounded-full bg-white py-3 w-full xs:w-auto min-w-[200px] px-5 shadow-button"
                @click="toggleSelect"
              >
                <div class="flex items-center justify-between">
                  <span class="text-s-16 font-medium">
                    {{ selectedTab.label }}
                    <span
                      v-if="activeTab === 'positions' && positions.length > 0"
                      class="ml-1 text-info"
                    >
                      · {{ positions.length }}
                    </span>
                    <span
                      v-else-if="activeTab === 'orders' && openOrdersCount > 0"
                      class="ml-1 text-info"
                    >
                      ·
                      {{
                        openOrdersCountIsCapped
                          ? `${PERPS_PAGE_SIZE}+`
                          : openOrdersCount
                      }}
                    </span>
                  </span>
                  <chevron-down-icon class="w-4 h-4 ml-2" />
                </div>
              </button>
            </div>
          </template>
        </app-select>
      </div>

      <!-- Positions loading -->
      <app-table-skeleton
        v-if="activeTab === 'positions' && !positionsHasLoaded"
        :rows="3"
        :columns="positionsSkeletonColumns"
      />

      <!-- Positions tab -->
      <template v-else-if="activeTab === 'positions'">
        <div
          v-if="positions.length === 0"
          class="text-center py-8 text-info text-s-14"
        >
          {{ $t('perps.positions.no-open-positions') }}
        </div>
        <table v-else ref="positionsTable" class="w-full text-s-14 table-fixed">
          <thead>
            <tr
              class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold"
            >
              <th class="px-1 sm:pl-4 py-3 text-left font-bold">
                {{ $t('perps.positions.market-header') }}
              </th>
              <th class="px-1 py-3 text-right font-bold">
                {{ $t('perps.positions.value-label') }}
              </th>
              <th
                class="px-1 py-3 text-right font-bold hidden xs:table-cell normal-case"
              >
                {{ $t('perps.positions.upnl-header') }}
              </th>
              <th class="px-1 py-3 text-right font-bold hidden 2xl:table-cell">
                {{ $t('perps.positions.entry-price-label') }}
              </th>
              <th class="px-1 py-3 text-right font-bold hidden lg:table-cell">
                {{ $t('perps.positions.mark-price-label') }}
              </th>
              <th class="px-1 py-3 text-right font-bold hidden sm:table-cell">
                {{ $t('perps.positions.liq-price-header') }}
              </th>
              <th class="px-1 py-3 text-right font-bold hidden 2xl:table-cell">
                {{ $t('perps.positions.margin-used-header') }}
              </th>
              <th class="px-1 py-3 text-right font-bold hidden 3xl:table-cell">
                {{ $t('perps.positions.total-funding-header') }}
              </th>
              <th
                class="px-1 sm:pr-4 py-3 text-right font-bold w-8 xs:w-10 md:w-12 lg:w-auto"
              >
                <p class="hidden lg:block font-bold">
                  {{ $t('perps.market-list.column-actions') }}
                </p>
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
                        'font-medium text-s-12 capitalize hooverOpacity cursor-pointer',
                      ]"
                      @click.stop="openLeverage(pos)"
                    >
                      {{
                        pos.direction === 'long'
                          ? $t('perps.trade.long')
                          : pos.direction === 'short'
                            ? $t('perps.trade.short')
                            : pos.direction
                      }}
                      {{ pos.leverage }}x
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
                <div
                  class="flex items-center justify-end -mr-1 lg:mr-0 lg:flex-row lg:gap-2"
                >
                  <app-pop-up-menu
                    :placeholder="$t('perps.market-list.actions-menu-label')"
                    location="right"
                  >
                    <template #menu-button="{ toggleMenu }">
                      <app-btn-icon
                        :label="$t('perps.market-list.action-menu-label')"
                        @click.stop="toggleMenu"
                        height="h-7 xs:h-8"
                        width="w-7 xs:w-8"
                        class="flex lg:hidden"
                      >
                        <ellipsis-vertical-icon class="w-5 h-5" />
                      </app-btn-icon>
                      <AppBaseButton
                        class="hidden lg:flex"
                        size="small"
                        :disabled="isWatchOnly"
                        @click="toggleMenu"
                        :theme="pos.direction === 'long' ? 'success' : 'error'"
                      >
                        {{ $t('perps.positions.manage-label') }}
                      </AppBaseButton>
                    </template>
                    <template #menu-content="{ toggleMenu }">
                      <div
                        class="px-2 py-3 max-w-full bg-white rounded-xl min-w-[240px]"
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
              <span class="px-2"
                >{{ data.label }}
                <span
                  v-if="data.value === 'pending' && openOrdersCount > 0"
                  class="ml-1 text-info text-s-11"
                >
                  ·
                  {{
                    openOrdersCountIsCapped
                      ? `${PERPS_PAGE_SIZE}+`
                      : openOrdersCount
                  }}
                </span></span
              >
            </template>
          </app-btn-group>
        </div>
        <app-table-skeleton
          v-if="ordersLoading && orders.length === 0"
          :rows="5"
          :columns="ordersSkeletonColumns"
        />
        <div
          v-else-if="orders.length === 0 && ordersCurrentPage === 0"
          class="text-center py-8 text-info text-s-14"
        >
          {{ $t('perps.positions.no-orders') }}
        </div>

        <table v-else ref="ordersTable" class="w-full text-s-14 table-fixed">
          <thead>
            <tr
              class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold"
            >
              <th
                class="px-1 sm:pl-4 py-3 text-left font-bold xs:w-[150px] 3xl:w-auto"
              >
                {{ $t('perps.positions.market-header') }}
              </th>
              <th
                class="px-1 py-3 text-left font-bold w-[100px] 3xl:w-[120px] hidden xl:table-cell"
              >
                {{ $t('perps.confirm.side-label') }}
              </th>
              <th class="px-1 py-3 text-left font-bold hidden xs:table-cell">
                {{ $t('perps.fill.time-label') }}
              </th>
              <th class="px-1 py-3 text-left font-bold hidden lg:table-cell">
                {{ $t('perps.order.status-label') }}
              </th>
              <th class="px-1 py-3 text-left font-bold hidden 2xl:table-cell">
                {{ $t('perps.order.type-label') }}
              </th>
              <th class="px-1 py-3 text-right font-bold 3xl:w-[120px]">
                {{ $t('perps.order.price-label') }}
              </th>
              <th class="px-1 py-3 text-right font-bold hidden sm:table-cell">
                {{ $t('perps.positions.filled-size-header') }}
              </th>
              <th class="w-9 xs:w-12"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in orders"
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
                      {{
                        order.side === 'buy'
                          ? $t('perps.order.buy')
                          : order.side === 'sell'
                            ? $t('perps.order.sell')
                            : order.side
                      }}
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
                  {{
                    order.side === 'buy'
                      ? $t('perps.order.buy')
                      : order.side === 'sell'
                        ? $t('perps.order.sell')
                        : order.side
                  }}
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
                  {{ $t(formatOrderStatus(order.status)) }}
                </p>
              </td>
              <!-- Type -->
              <td class="px-1 py-3 font-normal text-s-14 hidden 2xl:table-cell">
                {{ $t(formatOrderType(order.type)) }}
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
                  {{
                    $t('perps.positions.out-of', {
                      size: order.size,
                      symbol: getBase(order.market),
                    })
                  }}
                </p>
              </td>

              <!--Actions-->
              <td class="pl-2 xs:pl-4 pr-0 rounded-r-12 sm:pl-3 sm:pr-1 py-3">
                <app-pop-up-menu
                  v-if="showCancelButton(order)"
                  :placeholder="$t('perps.market-list.actions-menu-label')"
                  location="right"
                >
                  <template #menu-button="{ toggleMenu }">
                    <app-btn-icon
                      :label="$t('perps.market-list.action-menu-label')"
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
                          <p>{{ $t('perps.positions.view-order-label') }}</p>
                        </li>
                        <li
                          class="p-2 flex items-center hoverBGWhite rounded-12"
                          @click.stop="[
                            toggleMenu(),
                            openCancelConfirmation(order),
                          ]"
                        >
                          {{
                            cancellingOrderId === order.orderId
                              ? $t('perps.order.cancelling')
                              : $t('perps.order.cancel-order-button')
                          }}
                        </li>
                      </ul>
                    </div>
                  </template>
                </app-pop-up-menu>
                <!-- View order details button -->
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
          {{ $t('perps.positions.no-fills') }}
        </div>
        <div v-else class="overflow-x-auto">
          <table ref="fillsTable" class="w-full text-s-14 table-fixed">
            <thead>
              <tr
                class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold"
              >
                <th class="px-1 sm:pl-4 py-3 text-left font-bold">
                  {{ $t('perps.positions.market-header') }}
                </th>
                <th class="px-1 py-3 text-left font-bold hidden lg:table-cell">
                  {{ $t('perps.positions.direction-header') }}
                </th>
                <th
                  class="px-1 py-3 text-right lg:text-left font-bold hidden xs:table-cell"
                >
                  {{ $t('perps.fill.time-label') }}
                </th>

                <th class="px-1 py-3 text-right font-bold">
                  {{ $t('perps.order.price-label') }}
                </th>
                <th class="px-1 py-3 text-right font-bold hidden sm:table-cell">
                  {{ $t('perps.trade.size') }}
                </th>
                <th class="px-1 py-3 text-right font-bold hidden md:table-cell">
                  {{ $t('perps.positions.pnl-header') }}
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
                        {{ $t(directionKey(fill.direction)) }}
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
                    {{ $t(directionKey(fill.direction)) }}
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
          {{ $t('perps.positions.no-deposits-or-withdrawals') }}
        </div>
        <div v-else class="overflow-x-auto">
          <table ref="dwTable" class="w-full text-s-14 table-fixed">
            <thead>
              <tr
                class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold"
              >
                <th
                  class="px-1 sm:pl-4 py-3 text-left font-bold hidden xs:table-cell"
                >
                  {{ $t('perps.order.type-label') }}
                </th>
                <th class="px-1 py-3 text-left font-bold">
                  {{ $t('perps.positions.asset-header') }}
                </th>
                <th class="px-1 py-3 text-left font-bold hidden sm:table-cell">
                  {{ $t('perps.fill.time-label') }}
                </th>
                <th class="px-1 py-3 text-right font-bold hidden md:table-cell">
                  {{ $t('perps.positions.usd-value-header') }}
                </th>
                <th class="px-1 py-3 text-right font-bold">
                  {{ $t('perps.positions.amount-header') }}
                </th>

                <th
                  class="px-1 sm:pr-4 py-3 text-right font-bold hidden xs:table-cell"
                >
                  {{ $t('perps.order.status-label') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginatedDW" :key="item.key" class="">
                <!-- Type -->
                <td class="px-1 sm:pl-4 py-3 rounded-l-12 hidden xs:table-cell">
                  <span
                    :class="[
                      item.type === 'Deposit' ? 'text-success' : 'text-warning',
                      'font-medium text-s-13',
                    ]"
                  >
                    {{ formatDWType(item.type) }}
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
                      {{ formatDWType(item.type) }}
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
                    {{ $t(statusKey(item.statusLabel)) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="dwTotalPages > 1" class="flex justify-end mt-4 px-2">
            <perps-pagination
              :current-page="dwCurrentPage"
              :total-pages="dwTotalPages"
              :disabled="dwLoading"
              :scroll-target="dwTable"
              @prev="dwPrevPage"
              @next="dwNextPage"
            />
          </div>
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
  formatRoe,
  pnlColor,
  formatDate,
  getOrderPrice,
  formatOrderStatus,
  formatOrderType,
  directionKey,
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
  viewMarket: [market: string]
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

const positionsTable = ref<HTMLElement | null>(null)
const fillsTable = ref<HTMLElement | null>(null)
const ordersTable = ref<HTMLElement | null>(null)
const dwTable = ref<HTMLElement | null>(null)

const positionsSkeletonColumns = computed<SkeletonColumn[]>(() => [
  { header: t('perps.positions.market-header') },
  { header: t('perps.positions.value-label'), align: 'right' },
  {
    header: t('perps.positions.upnl-header'),
    align: 'right',
    hidden: 'hidden xs:table-cell',
  },
  {
    header: t('perps.positions.entry-price-label'),
    align: 'right',
    hidden: 'hidden 2xl:table-cell',
  },
  {
    header: t('perps.positions.mark-price-label'),
    align: 'right',
    hidden: 'hidden lg:table-cell',
  },
  {
    header: t('perps.positions.liq-price-header'),
    align: 'right',
    hidden: 'hidden sm:table-cell',
  },
  {
    header: t('perps.positions.margin-used-header'),
    align: 'right',
    hidden: 'hidden 2xl:table-cell',
  },
  {
    header: t('perps.positions.total-funding-header'),
    align: 'right',
    hidden: 'hidden 3xl:table-cell',
  },
  { header: t('perps.market-list.column-actions'), align: 'right' },
])

const fillsSkeletonColumns = computed<SkeletonColumn[]>(() => [
  { header: t('perps.positions.market-header') },
  {
    header: t('perps.positions.direction-header'),
    hidden: 'hidden lg:table-cell',
  },
  { header: t('perps.fill.time-label'), hidden: 'hidden xs:table-cell' },
  { header: t('perps.order.price-label'), align: 'right' },
  {
    header: t('perps.trade.size'),
    align: 'right',
    hidden: 'hidden sm:table-cell',
  },
  {
    header: t('perps.positions.pnl-header'),
    align: 'right',
    hidden: 'hidden md:table-cell',
  },
])

const ordersSkeletonColumns = computed<SkeletonColumn[]>(() => [
  { header: t('perps.positions.market-header') },
  {
    header: t('perps.confirm.side-label'),
    hidden: 'hidden xl:table-cell',
    width: '100px',
  },
  { header: t('perps.fill.time-label'), hidden: 'hidden xs:table-cell' },
  { header: t('perps.order.status-label'), hidden: 'hidden lg:table-cell' },
  { header: t('perps.order.type-label'), hidden: 'hidden 2xl:table-cell' },
  { header: t('perps.order.price-label'), align: 'right' },
  {
    header: t('perps.positions.filled-size-header'),
    align: 'right',
    hidden: 'hidden sm:table-cell',
  },
  { header: '', width: '48px' },
])

const dwSkeletonColumns = computed<SkeletonColumn[]>(() => [
  { header: t('perps.order.type-label'), hidden: 'hidden xs:table-cell' },
  { header: t('perps.positions.asset-header') },
  { header: t('perps.fill.time-label'), hidden: 'hidden sm:table-cell' },
  {
    header: t('perps.positions.usd-value-header'),
    align: 'right',
    hidden: 'hidden md:table-cell',
  },
  { header: t('perps.positions.amount-header'), align: 'right' },
  {
    header: t('perps.order.status-label'),
    align: 'right',
    hidden: 'hidden xs:table-cell',
  },
])

const { positions, hasLoaded: positionsHasLoaded } = usePerpsPositions()

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
  nextPage: dwNextPage,
  prevPage: dwPrevPage,
} = usePaginate<CombinedDWRow>(combinedDW, PERPS_PAGE_SIZE)

const tabs = computed(() => [
  { label: t('perps.positions.tab-positions'), value: 'positions' },
  { label: t('perps.positions.tab-orders'), value: 'orders' },
  { label: t('perps.positions.tab-fills'), value: 'fills' },
  { label: t('perps.positions.tab-deposits'), value: 'deposits' },
])

// Track the tab by value, not by object: labels are locale-dependent and
// AppBtnGroup/AppSelect compare the selection by structural equality.
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
