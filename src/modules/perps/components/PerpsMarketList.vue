<template>
  <!--
    @container: the wallet side panel pushes the page content instead of
    overlaying it from the xl viewport up, so viewport breakpoints lie about
    how much room there really is. The empty state's spacing follows this
    element's width instead: 904px is the old lg viewport breakpoint (1024)
    with the panel closed (viewport - 80px rail - 40px page gutter). The table
    takes its L/M/S size from AppTableWrapper's own width.
  -->
  <div class="@container">
    <AppTableWrapper
      v-model:search="searchQuery"
      :title="$t('perps.market-list.title')"
      :search-placeholder="$t('perps.market-list.search-placeholder')"
      title-tag="h1"
    >
      <template #filters>
        <!-- Category filter -->
        <app-select
          v-model:selected="selectedFilter"
          :options="filterOptions"
          position="left-0"
        >
          <template #select-button="{ toggleSelect }">
            <button
              class="flex items-center justify-between gap-2 bg-background-default hover:bg-background-default-hover transition-colors rounded-full h-10 px-4 w-full xs:w-auto"
              @click="toggleSelect"
            >
              <span class="text-s-15 font-medium text-black truncate">
                {{ selectedFilter.label }}
              </span>
              <AppIcon
                name="chevron-down"
                variant="filled"
                size="xxs"
                class="shrink-0 text-text-subtle"
              />
            </button>
          </template>
        </app-select>
      </template>

      <!-- Error -->
      <div
        v-if="!contractsLoading && contractsError"
        class="text-center py-8 text-s-14"
      >
        {{ contractsError }}
      </div>

      <!-- Empty -->
      <div
        v-else-if="!contractsLoading && filteredContracts.length === 0"
        class="w-full flex flex-col items-center justify-center mx-auto text-text-subtle py-10 text-s-14"
      >
        <p
          v-if="selectedFilter.value === 'watchlist' && !searchQuery"
          class="mb-1 text-center @min-[904px]:mt-10"
        >
          {{ $t('perps.market-list.no-watchlist') }}
        </p>
        <p v-if="searchQuery" class="mb-1 text-center @min-[904px]:my-10">
          {{ $t('perps.market-list.no-results', { query: searchQuery }) }}
        </p>
        <button
          v-if="selectedFilter.value === 'watchlist' && !searchQuery"
          class="underline @min-[904px]:mb-10"
          @click="selectedFilterValue = 'all'"
        >
          {{ $t('perps.market-list.discover-markets') }}
          <AppIcon name="arrow-up" size="xxs" class="rotate-90 inline-flex" />
        </button>
      </div>

      <!-- Markets table -->
      <AppTable
        v-else
        v-model:sort="sort"
        :default-sort="DEFAULT_SORT"
        :page="currentPage + 1"
        :columns="columns"
        :pages="totalPages"
        :loading="contractsLoading"
        :loading-rows="8"
        footer="pagination"
        watchlist
        actions
        @update:page="currentPage = $event - 1"
      >
        <!-- Long + Short at L, the menu at M/S: as the loaded rows. -->
        <template #loading-row="{ size }">
          <AppTableRow
            loading
            description="-"
            :loading-buttons="size === 'l' ? 2 : 0"
          >
            <template #avatar />
          </AppTableRow>
        </template>
        <template #default="{ size }">
          <AppTableRow
            v-for="contract in paginatedContracts"
            :key="contract.market"
            :title="contract.baseCurrency"
            :description="contract.longName"
            :to="{
              name: PERP_INFO_ROUTE_NAME,
              params: { market: contract.market },
            }"
            :watchlisted="watchlist.has(contract.baseCurrency)"
            @update:watchlisted="toggleWatchlist(contract.baseCurrency)"
          >
            <template #avatar="{ size: avatarSize }">
              <AppAvatar
                type="perpsAsset"
                :size="avatarSize"
                :url="getLogoUrl(contract.baseCurrency)"
                :symbol="contract.baseCurrency"
              />
            </template>
            <template #title-icon>
              <AppTag
                variant="subtle"
                :label="`${contract.defaultLeverage}x`"
              />
            </template>

            <AppTableCell
              :column="SortValue.MARKET_CAP"
              :value="formatVolume(contract.openInterestUsd)"
            />
            <AppTableCell
              :column="SortValue.VOLUME"
              :value="formatVolume(contract.usdVolume)"
            />
            <AppTableCell
              :column="SortValue.PERCENT"
              :value="contract.priceChangePercent ? undefined : '—'"
              :change="changeOf(contract)"
              :series="
                contract.sparkline?.price?.length
                  ? contract.sparkline.price.map(Number)
                  : undefined
              "
            />
            <!-- At S the 24h column is gone, so price carries the change. -->
            <AppTableCell
              :column="SortValue.PRICE"
              :value="formatPrice(midPrice(contract))"
              :change="size === 's' ? changeOf(contract) : undefined"
            />

            <template #actions="{ size: rowSize, surface }">
              <!--
                Disabled in restricted regions: there is no order to place,
                so the action is dead rather than redirected. Users reach
                the explanatory card via the Perps action-bar button.
              -->
              <template v-if="rowSize === 'l' && !getPosition(contract.market)">
                <AppBaseButton
                  type="secondary"
                  size="medium"
                  tone="success"
                  class="w-24"
                  :surface="surface"
                  :disabled="isPerpsRestricted"
                  @click="
                    openNewPosition(
                      contract.market,
                      'buy',
                      PerpsNewPositionAction.LONG,
                    )
                  "
                >
                  {{ $t('perps.trade.long') }}
                </AppBaseButton>
                <AppBaseButton
                  type="secondary"
                  size="medium"
                  tone="danger"
                  class="w-24"
                  :surface="surface"
                  :disabled="isPerpsRestricted"
                  @click="
                    openNewPosition(
                      contract.market,
                      'sell',
                      PerpsNewPositionAction.SHORT,
                    )
                  "
                >
                  {{ $t('perps.trade.short') }}
                </AppBaseButton>
              </template>
              <!-- Long/Short is a pair, so below L it folds into the menu. -->
              <app-pop-up-menu
                v-else
                :placeholder="$t('perps.market-list.actions-menu-label')"
                location="right"
              >
                <template #menu-button="{ toggleMenu }">
                  <AppBaseButton
                    v-if="rowSize === 'l'"
                    type="secondary"
                    size="medium"
                    class="min-w-24"
                    :surface="surface"
                    :disabled="isWatchOnly"
                    :tone="
                      getPosition(contract.market)!.direction === 'long'
                        ? 'success'
                        : 'danger'
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
                    {{ $t('perps.market-list.manage') }}
                    {{ $t(sideKey(getPosition(contract.market)!.direction)) }}
                  </AppBaseButton>
                  <AppBtnIcon
                    v-else
                    icon="ellipsis-horizontal"
                    :label="$t('perps.market-list.action-menu-label')"
                    @click="toggleMenu"
                  />
                </template>
                <!--
                  Same guards as the L buttons: managing a position needs a
                  signing wallet, a new one an unrestricted region.
                -->
                <template #menu-content="{ toggleMenu }">
                  <ul class="px-2 py-3 max-w-full bg-white rounded-xl min-w-60">
                    <template v-if="getPosition(contract.market)">
                      <li>
                        <button
                          type="button"
                          :class="MENU_ITEM"
                          :disabled="isWatchOnly"
                          @click.stop="[
                            toggleMenu(),
                            openLeverage(
                              contract.market,
                              contract.baseCurrency,
                              getPosition(contract.market)!.leverage,
                            ),
                          ]"
                        >
                          {{ $t('perps.market-list.change-leverage') }}
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          :class="MENU_ITEM"
                          :disabled="isWatchOnly"
                          @click.stop="[
                            toggleMenu(),
                            openPositionAdd(contract.market, 'add'),
                          ]"
                        >
                          {{ $t('perps.market-list.add-to-position') }}
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          :class="MENU_ITEM"
                          :disabled="isWatchOnly"
                          @click.stop="[
                            toggleMenu(),
                            openPositionAdd(contract.market, 'close'),
                          ]"
                        >
                          {{ $t('perps.market-list.close-position') }}
                        </button>
                      </li>
                    </template>
                    <template v-else>
                      <li>
                        <button
                          type="button"
                          :class="MENU_ITEM"
                          :disabled="isPerpsRestricted"
                          @click.stop="[
                            toggleMenu(),
                            openNewPosition(
                              contract.market,
                              'buy',
                              PerpsNewPositionAction.LONG,
                            ),
                          ]"
                        >
                          {{ $t('perps.trade.long') }}
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          :class="MENU_ITEM"
                          :disabled="isPerpsRestricted"
                          @click.stop="[
                            toggleMenu(),
                            openNewPosition(
                              contract.market,
                              'sell',
                              PerpsNewPositionAction.SHORT,
                            ),
                          ]"
                        >
                          {{ $t('perps.trade.short') }}
                        </button>
                      </li>
                    </template>
                    <li>
                      <button
                        type="button"
                        :class="MENU_ITEM"
                        @click.stop="[
                          toggleMenu(),
                          emits('viewMarket', contract.market),
                        ]"
                      >
                        {{ $t('perps.market-list.view-market-info') }}
                      </button>
                    </li>
                  </ul>
                </template>
              </app-pop-up-menu>
            </template>
          </AppTableRow>
        </template>
      </AppTable>
    </AppTableWrapper>
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
import { useI18n } from 'vue-i18n'
import AppSelect from '@/components/AppSelect.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppTableWrapper from '@/components/table/AppTableWrapper.vue'
import AppTable from '@/components/table/AppTable.vue'
import AppTableRow from '@/components/table/AppTableRow.vue'
import AppTableCell from '@/components/table/AppTableCell.vue'
import type { TableColumn, TableSort } from '@/components/table/types'
import {
  usePerpsMarkets,
  usePerpsContracts,
} from '../composables/usePerpsMarkets'
import { PERP_INFO_ROUTE_NAME } from '@/router/routeNames'
import type { Contract, TradingPair } from '../sdk/types'
import { formatPrice, formatVolume, sideKey } from '../utils/formatters'
import { getLogoUrl, midPrice, hasTag } from '../utils/market'
import { usePerpsPositions } from '../composables/usePerpsPositions'
import { usePerpsRestriction } from '../composables/usePerpsRestriction'
import { usePaginate } from '@/composables/usePaginate'
import { PERPS_PAGE_SIZE, perpsClient } from '../configs'
import { capturePerps } from '../sentry'
import { PERPS_FEATURE } from '@/sentry/constants'
import PerpsSelectLeverageDialog from './PerpsSelectLeverageDialog.vue'
import { usePerpsToasts } from '../composables/usePerpsToasts'
import { useWalletStore } from '@/stores/walletStore'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { storeToRefs } from 'pinia'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppTag from '@/components/tag/AppTag.vue'
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

const { t } = useI18n()
const walletStore = useWalletStore()
const { isPerpsRestricted } = usePerpsRestriction()
const { isWatchOnly } = storeToRefs(walletStore)

const watchlistStore = useWatchlistStore()
const { watchListedPerps } = storeToRefs(watchlistStore)

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
  const initial =
    Number.isFinite(parsedCurrent) && parsedCurrent > 0 ? parsedCurrent : maxLev
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
    capturePerps(PERPS_FEATURE.LEVERAGE, e, {
      title: 'PERPS: Set leverage failed',
      extra: { market: leverageMarket.value, newLeverage: tempLeverage.value },
    })
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

const MENU_ITEM =
  'flex w-full items-center rounded-12 p-2 text-left hoverBGWhite disabled:pointer-events-none disabled:opacity-40'

const searchQuery = ref('')
// Persisted + shared with the home watchlist via the store. Exposed as a Set so
// the existing `watchlist.has(...)` template checks keep working unchanged.
const watchlist = computed(() => new Set(watchListedPerps.value))

enum SortValue {
  NAME = 'NAME',
  PRICE = 'PRICE',
  PERCENT = 'PERCENT',
  VOLUME = 'VOLUME',
  MARKET_CAP = 'MARKET_CAP',
}

// Column keys are the sort values. Price is the one column kept at size S.
const columns = computed<TableColumn[]>(() => [
  {
    key: SortValue.NAME,
    label: t('perps.market-list.column-name'),
    sortable: true,
  },
  {
    key: SortValue.MARKET_CAP,
    label: t('perps.market-list.column-market-cap'),
    sortable: true,
  },
  {
    key: SortValue.VOLUME,
    label: t('perps.market-list.column-volume'),
    sortable: true,
  },
  { key: SortValue.PERCENT, label: t('perps.market-list.column-24h-change') },
  {
    key: SortValue.PRICE,
    label: t('perps.market-list.column-price'),
    sortable: true,
    primary: true,
  },
])

// A third header click returns here (AppTable `default-sort`), never to null.
const DEFAULT_SORT: TableSort = { key: SortValue.VOLUME, direction: 'desc' }
const sort = ref<TableSort | null>(DEFAULT_SORT)

function toggleWatchlist(symbol: string) {
  watchlistStore.setWatchlistPerp(symbol)
}

interface FilterOption {
  label: string
  value: string
}

const filterOptions = computed<FilterOption[]>(() => [
  { label: t('perps.market-list.all-categories'), value: 'all' },
  { label: t('perps.market-list.filter-watchlist'), value: 'watchlist' },
  { label: t('perps.market-list.filter-stocks'), value: 'stocks' },
  { label: t('perps.market-list.filter-commodities'), value: 'commodities' },
  { label: t('perps.market-list.filter-indices'), value: 'indices' },
])

// Track the filter by value, not by object: labels are locale-dependent and
// AppSelect compares the selection by structural equality.
const selectedFilterValue = ref('all')

const selectedFilter = computed<FilterOption>({
  get: () =>
    filterOptions.value.find(o => o.value === selectedFilterValue.value) ??
    filterOptions.value[0],
  set: option => {
    selectedFilterValue.value = option.value
  },
})

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
  // Contracts flagged `disabled` by the API must not appear in the market
  // list (MEW-2025). Filtered here (display source) rather than at the shared
  // `contracts` ref so an active/held disabled market still resolves elsewhere.
  return contracts.value
    .filter(c => !c.disabled)
    .map(c => {
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

  const { key, direction } = sort.value ?? DEFAULT_SORT
  const dir = direction === 'desc' ? -1 : 1
  list = [...list].sort((a, b) => {
    let cmp = 0
    switch (key) {
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

const changeOf = (c: Contract) =>
  c.priceChangePercent ? parseFloat(c.priceChangePercent) : undefined

const {
  currentPage,
  paginatedArray: paginatedContracts,
  totalPages,
} = usePaginate<EnrichedContract>(filteredContracts, PERPS_PAGE_SIZE)
</script>
