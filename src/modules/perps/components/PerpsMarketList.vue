<template>
  <!--
    @container: the skeleton and empty state size off this element, not the
    viewport (the wallet side panel pushes the page content from xl up). The
    table itself takes its L/M/S size from AppTableWrapper's own width.
  -->
  <div class="@container">
    <AppTableWrapper :title="$t('perps.market-list.title')">
      <template #toolbar="{ size }">
        <app-searchbar
          v-model="searchQuery"
          bg-class="bg-background-default"
          size="compact"
          :placeholder="$t('perps.market-list.search-placeholder')"
          :class="['shrink-0', size === 's' ? 'w-full' : 'w-60']"
        />

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

      <!-- Loading -->
      <app-table-skeleton
        v-if="contractsLoading"
        :rows="8"
        :columns="marketSkeletonColumns"
      />

      <!-- Error -->
      <div v-else-if="contractsError" class="text-center py-8 text-s-14">
        {{ contractsError }}
      </div>

      <!-- Empty -->
      <div
        v-else-if="filteredContracts.length === 0"
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
        :page="currentPage + 1"
        :columns="columns"
        :pages="totalPages"
        footer="pagination"
        watchlist
        actions
        @update:page="currentPage = $event - 1"
      >
        <template #default="{ size }">
          <AppTableRow
            v-for="contract in paginatedContracts"
            :key="contract.market"
            :watchlisted="watchlist.has(contract.baseCurrency)"
            @update:watchlisted="toggleWatchlist(contract.baseCurrency)"
            @click="$emit('viewMarket', contract.market)"
          >
            <template #leading="{ size: avatarSize }">
              <AppAvatar
                type="perpsAsset"
                :size="avatarSize"
                :url="getLogoUrl(contract.baseCurrency)"
                :symbol="contract.baseCurrency"
                class="shrink-0"
              />
              <AppContentGroup
                :title="contract.baseCurrency"
                :description="contract.longName"
                no-wrap
                class="min-w-0 flex-1"
              >
                <template #title-icon>
                  <AppTag
                    variant="subtle"
                    :label="`${contract.defaultLeverage}x`"
                  />
                </template>
              </AppContentGroup>
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
                    {{
                      getPosition(contract.market)!.direction === 'long'
                        ? $t('perps.trade.long')
                        : $t('perps.trade.short')
                    }}
                  </AppBaseButton>
                  <AppBtnIcon
                    v-else
                    icon="ellipsis-horizontal"
                    :label="$t('perps.market-list.action-menu-label')"
                    @click="toggleMenu"
                  />
                </template>
                <template #menu-content="{ toggleMenu }">
                  <div
                    class="px-2 py-3 max-w-full bg-white rounded-xl min-w-60"
                  >
                    <button
                      class="xs:hidden flex items-center p-2 hoverBGWhite rounded-12"
                      @click.stop="[
                        toggleWatchlist(contract.baseCurrency),
                        toggleMenu(),
                      ]"
                    >
                      <AppIcon
                        name="star"
                        size="xxs"
                        v-if="!watchlist.has(contract.baseCurrency)"
                        class="cursor-pointer"
                      />
                      <AppIcon
                        name="star"
                        variant="filled"
                        size="xxs"
                        v-else
                        class="cursor-pointer"
                      />
                      <span class="ml-2">{{
                        watchlist.has(contract.baseCurrency)
                          ? $t('perps.market-list.remove-from-watchlist')
                          : $t('perps.market-list.add-to-watchlist')
                      }}</span>
                    </button>
                    <app-divider variant="alternative" class="my-1 xs:hidden" />
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
                          <p>
                            {{ $t('perps.market-list.change-leverage') }}
                          </p>
                        </li>
                        <li
                          class="p-2 flex items-center hoverBGWhite rounded-12"
                          @click.stop="[
                            toggleMenu(),
                            openPositionAdd(contract.market, 'add'),
                          ]"
                        >
                          <p>
                            {{ $t('perps.market-list.add-to-position') }}
                          </p>
                        </li>
                        <li
                          class="p-2 flex items-center hoverBGWhite rounded-12"
                          @click.stop="[
                            toggleMenu(),
                            openPositionAdd(contract.market, 'close'),
                          ]"
                        >
                          <p>
                            {{ $t('perps.market-list.close-position') }}
                          </p>
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
                          <p>{{ $t('perps.trade.long') }}</p>
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
                          <p>{{ $t('perps.trade.short') }}</p>
                        </li>
                      </template>
                      <li
                        @click.stop="[
                          toggleMenu(),
                          emits('viewMarket', contract.market),
                        ]"
                        class="p-2 flex items-center hoverBGWhite rounded-12"
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
import AppSearchbar from '@/components/AppSearchbar.vue'
import AppTableSkeleton, {
  type SkeletonColumn,
} from '@/components/AppTableSkeleton.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppTableWrapper from '@/components/table/AppTableWrapper.vue'
import AppTable from '@/components/table/AppTable.vue'
import AppTableRow from '@/components/table/AppTableRow.vue'
import AppTableCell from '@/components/table/AppTableCell.vue'
import type { TableColumn, TableSort } from '@/components/table/types'
import {
  usePerpsMarkets,
  usePerpsContracts,
} from '../composables/usePerpsMarkets'
import type { Contract, TradingPair } from '../sdk/types'
import { formatPrice, formatVolume } from '../utils/formatters'
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
import AppDivider from '@/components/divider/AppDivider.vue'

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

// Mirrors the table: every column from M (768) up, name + price below.
const marketSkeletonColumns = computed<SkeletonColumn[]>(() => [
  { header: '', hidden: 'w-10' },
  { header: t('perps.market-list.column-name') },
  {
    header: t('perps.market-list.column-market-cap'),
    hidden: 'hidden @min-[768px]:table-cell',
  },
  {
    header: t('perps.market-list.column-volume'),
    hidden: 'hidden @min-[768px]:table-cell',
  },
  {
    header: t('perps.market-list.column-24h-change'),
    hidden: 'hidden @min-[768px]:table-cell',
  },
  { header: t('perps.market-list.column-price'), align: 'right' },
  { header: '', align: 'right' },
])

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

const DEFAULT_SORT: TableSort = { key: SortValue.VOLUME, direction: 'desc' }
const tableSort = ref<TableSort>(DEFAULT_SORT)
// AppTable turns a column off after asc; off falls back to the default order.
const sort = computed<TableSort | null>({
  get: () => tableSort.value,
  set: value => {
    tableSort.value = value ?? DEFAULT_SORT
  },
})

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

  const dir = tableSort.value.direction === 'desc' ? -1 : 1
  list = [...list].sort((a, b) => {
    let cmp = 0
    switch (tableSort.value.key) {
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
