<template>
  <div>
    <div
      class="flex flex-col xs:flex-row flex-wrap justify-between sm:items-center gap-4 mt-8 mb-6 px-2"
    >
      <h1 class="text-s-24 xs:text-s-32 font-bold">Perpetuals Markets</h1>
      <!--Filter Lists-->
      <div class="hidden lg:flex lg:items-center bg-grey-5 rounded-full">
        <app-btn-group
          v-model:selected="selectedFilter"
          :btn-list="filterOptions"
          size="large"
          class="flex-wrap"
        >
          <template #btn-content="{ data }">
            <span class="px-2">{{ data.label }}</span>
          </template>
        </app-btn-group>
      </div>
      <app-select
        v-model:selected="selectedFilter"
        :options="filterOptions"
        position="right-0"
        placeholder="Filter"
        class="lg:hidden"
      >
        <template #select-button="{ toggleSelect }">
          <div class="bg-surface rounded-full p-1 w-full xs:w-auto">
            <button
              class="rounded-full bg-white py-3 w-full xs:w-auto min-w-[180px] px-5 shadow-button"
              @click="toggleSelect"
            >
              <div class="flex items-center justify-between">
                <span class="text-s-16 font-medium">{{
                  selectedFilter.label
                }}</span>
                <chevron-down-icon class="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
        </template>
      </app-select>
    </div>

    <div class="mt-3 bg-white rounded-16 py-4 px-2">
      <!-- Search -->
      <div class="flex items-center px-2 pt-2 pb-6 mb-4 border-b border-grey-5">
        <div
          class="flex grow gap-4 justify-between items-center bg-surface rounded-full p-1 w-full md:max-w-[500px]"
        >
          <app-search-input
            v-model="searchQuery"
            class="grow"
            placeholder="Search"
          />
        </div>
      </div>

      <!-- Loading -->
      <app-table-skeleton
        v-if="contractsLoading"
        :rows="8"
        :columns="marketSkeletonColumns"
      />

      <!-- Error -->
      <div
        v-else-if="contractsError"
        class="text-center py-8 text-error text-s-14"
      >
        {{ contractsError }}
      </div>

      <!-- Markets table -->
      <div v-else>
        <table ref="marketsTable" class="w-full text-sm table-fixed">
          <thead class="bg-white">
            <tr
              class="text-left text-s-11 uppercase text-info tracking-sp-06 font-bold"
            >
              <th class="hidden xs:table-cell xs:w-10 py-2 text-center"></th>
              <!-- Name -->
              <th
                class="cursor-pointer px-1 py-2 hover:text-black transition-colors"
                @click="setHeaderSort(SortValue.NAME)"
              >
                <div
                  class="flex items-center gap-1 ml-11 font-bold"
                  :class="{
                    'text-black': headerSort === SortValue.NAME,
                  }"
                >
                  Name
                  <arrow-long-down-icon
                    v-if="
                      headerSort === SortValue.NAME && tableDirection === 'desc'
                    "
                    class="w-3.5 h-3.5"
                  />
                  <arrow-long-up-icon
                    v-if="
                      headerSort === SortValue.NAME && tableDirection === 'asc'
                    "
                    class="w-3.5 h-3.5"
                  />
                </div>
              </th>
              <!-- Price -->
              <th
                class="cursor-pointer px-1 py-2 hover:text-black transition-colors"
                @click="setHeaderSort(SortValue.PRICE)"
              >
                <div
                  class="flex items-center gap-1 justify-end relative font-bold"
                  :class="{
                    'text-black': headerSort === SortValue.PRICE,
                  }"
                >
                  Price
                  <arrow-long-down-icon
                    v-if="
                      headerSort === SortValue.PRICE &&
                      tableDirection === 'desc'
                    "
                    class="w-3.5 h-3.5 absolute -right-4"
                  />
                  <arrow-long-up-icon
                    v-if="
                      headerSort === SortValue.PRICE && tableDirection === 'asc'
                    "
                    class="w-3.5 h-3.5 absolute -right-4"
                  />
                </div>
              </th>
              <!-- 24H -->
              <th
                class="hidden xs:table-cell cursor-pointer px-1 py-2 hover:text-black transition-colors"
                @click="setHeaderSort(SortValue.PERCENT)"
              >
                <div
                  class="flex items-center gap-1 justify-end relative font-bold"
                  :class="{
                    'text-black': headerSort === SortValue.PERCENT,
                  }"
                >
                  24H
                  <arrow-long-down-icon
                    v-if="
                      headerSort === SortValue.PERCENT &&
                      tableDirection === 'desc'
                    "
                    class="w-3.5 h-3.5 absolute -right-4"
                  />
                  <arrow-long-up-icon
                    v-if="
                      headerSort === SortValue.PERCENT &&
                      tableDirection === 'asc'
                    "
                    class="w-3.5 h-3.5 absolute -right-4"
                  />
                </div>
              </th>
              <!-- Volume -->
              <th
                class="hidden 2xl:table-cell cursor-pointer px-1 py-2 hover:text-black transition-colors"
                @click="setHeaderSort(SortValue.VOLUME)"
              >
                <div
                  class="flex items-center gap-1 justify-end relative font-bold"
                  :class="{
                    'text-black': headerSort === SortValue.VOLUME,
                  }"
                >
                  Volume
                  <arrow-long-down-icon
                    v-if="
                      headerSort === SortValue.VOLUME &&
                      tableDirection === 'desc'
                    "
                    class="w-3.5 h-3.5 absolute -right-4"
                  />
                  <arrow-long-up-icon
                    v-if="
                      headerSort === SortValue.VOLUME &&
                      tableDirection === 'asc'
                    "
                    class="w-3.5 h-3.5 absolute -right-4"
                  />
                </div>
              </th>
              <!-- Market Cap -->
              <th
                class="hidden md:table-cell cursor-pointer px-1 py-2 hover:text-black transition-colors"
                @click="setHeaderSort(SortValue.MARKET_CAP)"
              >
                <div
                  class="flex items-center gap-1 justify-end relative font-bold"
                  :class="{
                    'text-black': headerSort === SortValue.MARKET_CAP,
                  }"
                >
                  Market Cap
                  <arrow-long-down-icon
                    v-if="
                      headerSort === SortValue.MARKET_CAP &&
                      tableDirection === 'desc'
                    "
                    class="w-3.5 h-3.5 absolute -right-4"
                  />
                  <arrow-long-up-icon
                    v-if="
                      headerSort === SortValue.MARKET_CAP &&
                      tableDirection === 'asc'
                    "
                    class="w-3.5 h-3.5 absolute -right-4"
                  />
                </div>
              </th>
              <!-- Actions -->
              <th
                class="lg:pl-6 lg:pr-4 py-2 text-right w-7 xs:w-10 md:w-12 lg:w-[200px] 2xl:w-[240px]"
              >
                <p class="hidden lg:block font-bold">Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="contract in paginatedContracts"
              :key="contract.market"
              class="h-14 hoverBGWhite cursor-pointer"
              @click="$emit('viewMarket', contract.market)"
            >
              <!-- Watchlist -->
              <td class="hidden xs:table-cell xs:w-10 rounded-l-12 text-center">
                <button
                  :aria-label="
                    watchlist.has(contract.baseCurrency)
                      ? 'Remove from Watchlist'
                      : 'Add to Watchlist'
                  "
                  class="p-2 text-black rounded-full hover:bg-grey-5 transition-colors duration-300 ease-in-out"
                  @click.stop="toggleWatchlist(contract.baseCurrency)"
                >
                  <star-outline-icon
                    v-if="!watchlist.has(contract.baseCurrency)"
                    class="h-4 w-4 cursor-pointer"
                  />
                  <star-solid-icon v-else class="h-4 w-4 cursor-pointer" />
                </button>
              </td>
              <!-- Name -->
              <td class="px-1 py-2 rounded-l-12 xs:rounded-none">
                <div class="flex items-center gap-3">
                  <app-token-logo
                    :url="getLogoUrl(contract.baseCurrency)"
                    :symbol="contract.baseCurrency"
                    class="rounded-full"
                  />
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-bold whitespace-nowrap">{{
                        contract.baseCurrency
                      }}</span>
                      <span
                        class="shrink-0 bg-surface text-info font-bold rounded px-[6px] py-[1px] text-s-9"
                      >
                        {{ contract.defaultLeverage }}x
                      </span>
                    </div>
                    <span class="text-info text-s-12 truncate block">{{
                      contract.longName
                    }}</span>
                  </div>
                </div>
              </td>
              <!-- Price -->
              <td class="px-1 py-2 text-right">
                <p class="text-right">
                  {{ formatPrice(midPrice(contract)) }}
                </p>
                <p
                  class="text-s-12 font-normal mb-1 xs:hidden"
                  :class="
                    parseFloat(contract.priceChangePercent ?? '0') >= 0
                      ? 'text-success'
                      : 'text-error'
                  "
                >
                  {{ formatChange(contract.priceChangePercent) }}
                </p>
              </td>
              <!-- 24H % -->
              <td class="hidden xs:table-cell px-1 py-1 text-right">
                <div class="flex flex-col items-end justify-center py-2">
                  <p
                    class="text-s-13 font-normal mb-1"
                    :class="
                      parseFloat(contract.priceChangePercent ?? '0') >= 0
                        ? 'text-success'
                        : 'text-error'
                    "
                  >
                    {{ formatChange(contract.priceChangePercent) }}
                  </p>
                  <table-sparkline
                    v-if="contract.sparkline?.price.length"
                    :points="contract.sparkline.price.map(Number)"
                    :width="70"
                    :height="24"
                    :max-points="34"
                    :percent-change="
                      parseFloat(contract.priceChangePercent ?? '0') ||
                      undefined
                    "
                    fill
                  />
                </div>
              </td>
              <!-- Volume -->
              <td class="hidden 2xl:table-cell px-1 py-2 text-right">
                {{ formatVolume(contract.usdVolume) }}
              </td>
              <!-- Market Cap -->
              <td class="hidden md:table-cell px-1 py-2 text-right">
                {{ formatVolume(contract.openInterestUsd) }}
              </td>
              <!-- Actions -->
              <td class="lg:pr-2 py-1 rounded-r-12 relative text-right">
                <div
                  class="flex items-center justify-end lg:hidden ml-auto -mr-1 md:mr-auto"
                >
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
                        <button
                          class="xs:hidden flex items-center p-2 hoverBGWhite rounded-12"
                          @click.stop="[
                            toggleWatchlist(contract.baseCurrency),
                            toggleMenu(),
                          ]"
                        >
                          <star-outline-icon
                            v-if="!watchlist.has(contract.baseCurrency)"
                            class="h-4 w-4 cursor-pointer"
                          />
                          <star-solid-icon
                            v-else
                            class="h-4 w-4 cursor-pointer"
                          />
                          <span class="ml-2">{{
                            watchlist.has(contract.baseCurrency)
                              ? 'Remove from Watchlist'
                              : 'Add to Watchlist'
                          }}</span>
                        </button>
                        <hr
                          class="h-px bg-grey-outline border-0 w-full my-2 xs:hidden"
                        />
                        <ul>
                          <template v-if="getPosition(contract.market)">
                            <li
                              class="p-2 flex items-center hoverBGWhite rounded-12"
                              @click.stop="[
                                toggleMenu(),
                                openLeverage(
                                  contract.market,
                                  contract.baseCurrency,
                                  getPosition(contract.market)!.leverage,
                                ),
                              ]"
                            >
                              <p>Change Leverage</p>
                            </li>
                            <li
                              class="p-2 flex items-center hoverBGWhite rounded-12"
                              @click.stop="[
                                toggleMenu(),
                                openPositionAdd(contract.market, 'add'),
                              ]"
                            >
                              <p>Add to Position</p>
                            </li>
                            <li
                              class="p-2 flex items-center hoverBGWhite rounded-12"
                              @click.stop="[
                                toggleMenu(),
                                openPositionAdd(contract.market, 'close'),
                              ]"
                            >
                              <p>Close Position</p>
                            </li>
                          </template>
                          <template v-else>
                            <li
                              @click.stop="[
                                toggleMenu(),
                                openNewPosition(
                                  contract.market,
                                  'buy',
                                  PerpsNewPositionAction.LONG,
                                ),
                              ]"
                              class="p-2 flex items-center hoverBGWhite rounded-12"
                            >
                              <p>Long</p>
                            </li>
                            <li
                              @click.stop="[
                                toggleMenu(),
                                openNewPosition(
                                  contract.market,
                                  'sell',
                                  PerpsNewPositionAction.SHORT,
                                ),
                              ]"
                              class="p-2 flex items-center hoverBGWhite rounded-12"
                            >
                              <p>Short</p>
                            </li>
                          </template>
                          <li
                            @click.stop="[
                              toggleMenu(),
                              emits('viewMarket', contract.market),
                            ]"
                            class="p-2 flex items-center hoverBGWhite rounded-12"
                          >
                            <p>View Market Info</p>
                          </li>
                        </ul>
                      </div>
                    </template>
                  </app-pop-up-menu>
                </div>
                <div class="hidden lg:flex flex-row gap-2 justify-end">
                  <template v-if="getPosition(contract.market)">
                    <app-pop-up-menu
                      placeholder="actions menu"
                      location="right"
                    >
                      <template #menu-button="{ toggleMenu }">
                        <app-base-button
                          size="small"
                          class="min-w-[136px]"
                          :disabled="isWatchOnly"
                          :theme="
                            getPosition(contract.market)!.direction === 'long'
                              ? 'success'
                              : 'error'
                          "
                          @click="
                            onManagePositionClick(
                              contract.market,
                              getPosition(contract.market)!.direction === 'long'
                                ? 'long'
                                : 'short',
                              toggleMenu,
                            )
                          "
                        >
                          Manage
                          {{
                            getPosition(contract.market)!.direction === 'long'
                              ? 'Long'
                              : 'Short'
                          }}
                        </app-base-button>
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
                                openLeverage(
                                  contract.market,
                                  contract.baseCurrency,
                                  getPosition(contract.market)!.leverage,
                                ),
                              ]"
                            >
                              <p>Change Leverage</p>
                            </li>
                            <li
                              class="p-2 flex items-center hoverBGWhite rounded-12"
                              @click.stop="[
                                toggleMenu(),
                                openPositionAdd(contract.market, 'add'),
                              ]"
                            >
                              <p>Add to Position</p>
                            </li>
                            <li
                              class="p-2 flex items-center hoverBGWhite rounded-12"
                              @click.stop="[
                                toggleMenu(),
                                openPositionAdd(contract.market, 'close'),
                              ]"
                            >
                              <p>Close Position</p>
                            </li>
                            <li
                              class="p-2 flex items-center hoverBGWhite rounded-12"
                              @click.stop="[
                                toggleMenu(),
                                emits('viewMarket', contract.market),
                              ]"
                            >
                              <p>View Market Info</p>
                            </li>
                          </ul>
                        </div>
                      </template>
                    </app-pop-up-menu>
                  </template>
                  <template v-else>
                    <app-base-button
                      size="small"
                      class="min-w-[64px]"
                      theme="success"
                      @click="
                        openNewPosition(
                          contract.market,
                          'buy',
                          PerpsNewPositionAction.LONG,
                        )
                      "
                    >
                      Long
                    </app-base-button>
                    <app-base-button
                      size="small"
                      theme="error"
                      class="min-w-[64px]"
                      @click="
                        openNewPosition(
                          contract.market,
                          'sell',
                          PerpsNewPositionAction.SHORT,
                        )
                      "
                    >
                      Short
                    </app-base-button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          v-if="filteredContracts.length > 0 && totalPages > 1"
          class="flex justify-end mt-4 px-2"
        >
          <perps-pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            :scroll-target="marketsTable"
            @prev="prevPage"
            @next="nextPage"
          />
        </div>
        <div
          v-if="filteredContracts.length === 0"
          class="w-full flex flex-col items-center justify-center mx-auto text-info py-10 text-s-14"
        >
          <p
            v-if="selectedFilter.value === 'watchlist' && !searchQuery"
            class="mb-1 text-center lg:mt-10"
          >
            You don't have any watchlisted tokens.
          </p>
          <p v-if="searchQuery" class="mb-1 text-center lg:my-10">
            No results found for "{{ searchQuery }}".
          </p>
          <button
            v-if="selectedFilter.value === 'watchlist' && !searchQuery"
            class="underline lg:mb-10"
            @click="selectedFilter = filterOptions[0]"
          >
            Discover markets
            <arrow-long-up-icon class="rotate-90 w-4 h-4 inline-flex" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <perps-select-leverage-dialog
    v-model:is-open="showLeverageDialog"
    v-model="tempLeverage"
    :symbol="leverageSymbol"
    :leverage-error="leverageError"
    :is-saving="isSavingLeverage"
    :max-leverage="leverageMaxLeverage"
    mode="submit"
    @save="saveLeverage"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { StarIcon as StarOutlineIcon } from '@heroicons/vue/24/outline'
import AppSearchInput from '@/components/AppSearchInput.vue'
import {
  ChevronDownIcon,
  StarIcon as StarSolidIcon,
  ArrowLongUpIcon,
  ArrowLongDownIcon,
  EllipsisVerticalIcon,
} from '@heroicons/vue/24/solid'
import AppTableSkeleton, {
  type SkeletonColumn,
} from '@/components/AppTableSkeleton.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import AppSelect from '@/components/AppSelect.vue'
import TableSparkline from '@/components/TableSparkline.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import {
  usePerpsMarkets,
  usePerpsContracts,
} from '../composables/usePerpsMarkets'
import type { Contract, TradingPair } from '../sdk/types'
import { formatPrice, formatPercent, formatVolume } from '../utils/formatters'
import { getLogoUrl, midPrice, hasTag } from '../utils/market'
import { usePerpsPositions } from '../composables/usePerpsPositions'
import { usePaginate } from '@/composables/usePaginate'
import { PERPS_PAGE_SIZE, perpsClient } from '../configs'
import PerpsPagination from './PerpsPagination.vue'
import PerpsSelectLeverageDialog from './PerpsSelectLeverageDialog.vue'
import { usePerpsToasts } from '../composables/usePerpsToasts'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import {
  analytics,
  PerpsChangeLeverageEvent,
  PerpsManageEvent,
  PerpsEventLocation,
  PerpsNewPositionAction,
} from '@/analytics'
import type {
  PerpsChangeLeveragePayload,
  PerpsChangeLeverageFailPayload,
} from '@/analytics'

const walletStore = useWalletStore()
const { isWatchOnly } = storeToRefs(walletStore)

const emits = defineEmits<{
  openPosition: [market: string, side?: 'buy' | 'sell']
  openSideMenu: [market: string, type: 'add' | 'close' | undefined]
  viewMarket: [market: string]
}>()

const showLeverageDialog = ref(false)
const tempLeverage = ref(1)
const isSavingLeverage = ref(false)
const leverageError = ref('')
const leverageMarket = ref('')
const leverageSymbol = ref('')
const leverageMaxLeverage = ref(20)
const leverageOldValue = ref(1)
const perpsToasts = usePerpsToasts()

const openLeverage = (
  market: string,
  symbol: string,
  currentLeverage: string,
) => {
  void analytics.trackPerpsManageEvent(PerpsManageEvent.CHANGE_LEVERAGE, {
    assetName: market,
    location: PerpsEventLocation.MARKET,
  })
  leverageMarket.value = market
  leverageSymbol.value = symbol
  const tradingPair = markets.value.find(m => m.market === market)
  const parsedMax = parseInt(tradingPair?.defaultLeverage ?? '')
  const maxLev = Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : 20
  leverageMaxLeverage.value = maxLev
  const parsedCurrent = parseInt(currentLeverage)
  const initial = Number.isFinite(parsedCurrent) && parsedCurrent > 0
    ? parsedCurrent
    : maxLev
  tempLeverage.value = Math.min(initial, maxLev)
  leverageOldValue.value = tempLeverage.value
  leverageError.value = ''
  showLeverageDialog.value = true
}

const saveLeverage = async () => {
  isSavingLeverage.value = true
  leverageError.value = ''
  const payload: PerpsChangeLeveragePayload = {
    assetName: leverageMarket.value,
    oldLeverage: leverageOldValue.value,
    maxLeverage: leverageMaxLeverage.value,
    newLeverage: tempLeverage.value,
  }
  void analytics.trackPerpsChangeLeverageEvent(
    PerpsChangeLeverageEvent.CLICKED_SUBMIT,
    payload,
  )
  try {
    await perpsClient.setLeverage(leverageMarket.value, tempLeverage.value)
    showLeverageDialog.value = false
    perpsToasts.toastLeverageUpdated(tempLeverage.value, leverageMarket.value)
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

const openPositionAdd = (market: string, type: 'add' | 'close') => {
  void analytics.trackPerpsManageEvent(
    type === 'add'
      ? PerpsManageEvent.ADD_TO_POSITION
      : PerpsManageEvent.CLOSE_POSITION,
    {
      assetName: market,
      location: PerpsEventLocation.MARKET,
    },
  )
  emits('openSideMenu', market, type)
}

const openNewPosition = (
  market: string,
  side: 'buy' | 'sell',
  action: PerpsNewPositionAction,
) => {
  void analytics.trackPerpsNewPositionEvent(PerpsManageEvent.NEW_POSITION, {
    assetName: market,
    location: PerpsEventLocation.MARKET,
    action,
  })
  emits('openPosition', market, side)
}

const onManagePositionClick = (
  market: string,
  direction: 'long' | 'short',
  toggleMenu: () => void,
) => {
  void analytics.trackPerpsNewPositionEvent(PerpsManageEvent.NEW_POSITION, {
    assetName: market,
    location: PerpsEventLocation.MARKET,
    action:
      direction === 'long'
        ? PerpsNewPositionAction.MANAGE_LONG
        : PerpsNewPositionAction.MANAGE_SHORT,
  })
  toggleMenu()
}

const marketsTable = ref<HTMLElement | null>(null)

const { markets } = usePerpsMarkets()
const {
  contracts,
  isLoading: contractsLoading,
  error: contractsError,
} = usePerpsContracts()
const { positions } = usePerpsPositions()

function getPosition(market: string) {
  return positions.value.find(p => p.market === market) || null
}

const marketSkeletonColumns: SkeletonColumn[] = [
  { header: '', hidden: 'hidden xs:table-cell xs:w-10' },
  { header: 'Name' },
  { header: 'Price', align: 'right' },
  { header: '24H', align: 'right', hidden: 'hidden xs:table-cell' },
  { header: 'Volume', align: 'right', hidden: 'hidden 2xl:table-cell' },
  { header: 'Market Cap', align: 'right', hidden: 'hidden md:table-cell' },
  {
    header: '',
    align: 'right',
    hidden: 'hidden lg:table-cell lg:w-[200px] 2xl:w-[240px]',
  },
]

const searchQuery = ref('')
const watchlist = ref<Set<string>>(new Set())

enum SortValue {
  NAME = 'NAME',
  PRICE = 'PRICE',
  PERCENT = 'PERCENT',
  VOLUME = 'VOLUME',
  MARKET_CAP = 'MARKET_CAP',
}

const headerSort = ref<SortValue>(SortValue.VOLUME)
const tableDirection = ref<'asc' | 'desc'>('desc')

function setHeaderSort(key: SortValue) {
  if (headerSort.value === key) {
    tableDirection.value = tableDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    tableDirection.value = 'desc'
    headerSort.value = key
  }
}

function toggleWatchlist(symbol: string) {
  if (watchlist.value.has(symbol)) {
    watchlist.value.delete(symbol)
  } else {
    watchlist.value.add(symbol)
  }
  watchlist.value = new Set(watchlist.value)
}

interface FilterOption {
  label: string
  value: string
}

const filterOptions: FilterOption[] = [
  { label: 'All Markets', value: 'all' },
  { label: 'Stocks', value: 'stocks' },
  { label: 'Commodities', value: 'commodities' },
  { label: 'Indices', value: 'indices' },
  { label: 'Watchlist', value: 'watchlist' },
]

const selectedFilter = ref<FilterOption>(filterOptions[0])

interface EnrichedContract extends Contract {
  displayName: string
  longName: string
  defaultLeverage: string
}

const enrichedContracts = computed<EnrichedContract[]>(() => {
  const marketMap = new Map<string, TradingPair>()
  for (const m of markets.value) {
    marketMap.set(m.market, m)
  }
  return contracts.value.map(c => {
    const pair = marketMap.get(c.market)
    return {
      ...c,
      displayName: pair?.displayName ?? c.baseCurrency,
      longName: pair?.longName ?? pair?.displayName ?? c.baseCurrency,
      defaultLeverage: pair?.defaultLeverage ?? '',
    }
  })
})

const filteredContracts = computed(() => {
  let list = enrichedContracts.value

  if (selectedFilter.value.value === 'watchlist') {
    list = list.filter(c => watchlist.value.has(c.baseCurrency))
  } else if (selectedFilter.value.value === 'commodities') {
    list = list.filter(c => hasTag(c, 'commodity'))
  } else if (selectedFilter.value.value === 'indices') {
    list = list.filter(c => hasTag(c, 'index'))
  } else if (selectedFilter.value.value === 'stocks') {
    list = list.filter(c => !hasTag(c, 'commodity') && !hasTag(c, 'index'))
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      c =>
        c.baseCurrency.toLowerCase().includes(q) ||
        c.market.toLowerCase().includes(q) ||
        c.displayName.toLowerCase().includes(q) ||
        c.longName.toLowerCase().includes(q),
    )
  }

  const dir = tableDirection.value === 'desc' ? -1 : 1
  list = [...list].sort((a, b) => {
    let cmp = 0
    switch (headerSort.value) {
      case SortValue.NAME:
        cmp = a.baseCurrency.localeCompare(b.baseCurrency)
        break
      case SortValue.PRICE:
        cmp = midPrice(a) - midPrice(b)
        break
      case SortValue.PERCENT:
        cmp =
          parseFloat(a.priceChangePercent ?? '0') -
          parseFloat(b.priceChangePercent ?? '0')
        break
      case SortValue.VOLUME:
        cmp = parseFloat(a.usdVolume ?? '0') - parseFloat(b.usdVolume ?? '0')
        break
      case SortValue.MARKET_CAP:
        cmp =
          parseFloat(a.openInterestUsd ?? '0') -
          parseFloat(b.openInterestUsd ?? '0')
        break
    }
    return cmp * dir
  })

  return list
})

function formatChange(pct?: string): string {
  if (!pct) return '—'
  return formatPercent(parseFloat(pct))
}

const {
  currentPage,
  paginatedArray: paginatedContracts,
  totalPages,
  nextPage,
  prevPage,
} = usePaginate<EnrichedContract>(filteredContracts, PERPS_PAGE_SIZE)
</script>
