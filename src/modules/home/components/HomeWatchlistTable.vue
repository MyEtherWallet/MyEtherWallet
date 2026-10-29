<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTooltip from '@/components/tooltip/AppTooltip.vue'
import AppTableWrapper from '@/components/table/AppTableWrapper.vue'
import AppTable from '@/components/table/AppTable.vue'
import AppTableRow from '@/components/table/AppTableRow.vue'
import AppTableCell from '@/components/table/AppTableCell.vue'
import type { TableColumn } from '@/components/table/types'
import AddToWatchlistDialog from './AddToWatchlistDialog.vue'
import { useWatchlistStore, WATCHLIST_MAX } from '@/stores/watchlistTableStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useNewListingSwap } from '@/modules/home/composables/useNewListingSwap'
import type { WatchlistRow } from '@/modules/home/composables/useWatchlistRows'
import { stockBaseSymbol } from '@/utils/tokenDisplayName'

import AppIcon from '@/components/icon/AppIcon.vue'
// Rows are owned by HomeHero (so it can fall back to the banner when there are
// none to show); this component renders + handles per-row actions, search,
// category filter, "Show more" and manual drag-reordering.
const props = defineProps<{ rows: WatchlistRow[] }>()

const { t } = useI18n()

const isAddOpen = ref(false)
const query = ref('')
const category = ref<'all' | 'stocks' | 'crypto'>('all')
const isCategoryOpen = ref(false)
const expanded = ref(false)
const INITIAL_COUNT = 5

const CATEGORIES = [
  { value: 'all', labelKey: 'homePage.hero.watchlist.table.allCategories' },
  { value: 'stocks', labelKey: 'homePage.hero.watchlist.addModal.tabs.stocks' },
  { value: 'crypto', labelKey: 'homePage.hero.watchlist.addModal.tabs.crypto' },
] as const

// Price is the one column kept at size S (it carries the 24h change there).
const columns = computed<TableColumn[]>(() => [
  { key: 'token', label: t('homePage.hero.watchlist.table.columns.token') },
  {
    key: 'marketCap',
    label: t('homePage.hero.watchlist.table.columns.marketCap'),
  },
  { key: 'volume', label: t('homePage.hero.watchlist.table.columns.volume') },
  {
    key: 'change',
    label: t('homePage.hero.watchlist.table.columns.change24h'),
  },
  {
    key: 'price',
    label: t('homePage.hero.watchlist.table.columns.price'),
    primary: true,
  },
])

const watchlistStore = useWatchlistStore()
const walletMenu = useWalletMenuStore()
const { openSwapForToken, openBridgeForToken } = useNewListingSwap()

// The add modal only offers crypto + stocks, so once both buckets hit the limit
// there's nothing left to add — hide the "Add asset" button.
const { watchListedTokens, watchListedStocks } = storeToRefs(watchlistStore)
const isWatchlistFull = computed(
  () =>
    watchListedTokens.value.length >= WATCHLIST_MAX &&
    watchListedStocks.value.length >= WATCHLIST_MAX,
)

const matchesCategory = (r: WatchlistRow) =>
  category.value === 'all' ||
  (category.value === 'crypto' && r.removeType === 'crypto') ||
  (category.value === 'stocks' && r.removeType === 'stock')

const filteredRows = computed(() => {
  const q = query.value.trim().toLowerCase()
  return props.rows.filter(
    r =>
      matchesCategory(r) &&
      (!q ||
        r.symbol.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q)),
  )
})

const displayRows = computed(() =>
  expanded.value
    ? filteredRows.value
    : filteredRows.value.slice(0, INITIAL_COUNT),
)
const hiddenCount = computed(() => filteredRows.value.length - INITIAL_COUNT)
const hasMore = computed(() => !expanded.value && hiddenCount.value > 0)

// Drag only makes sense on the full, unfiltered list.
const dragDisabled = computed(
  () => !!query.value.trim() || category.value !== 'all',
)

// AppTable reports indices within the shown rows: persist a full key order
// (shown order first, then the rows currently hidden below the fold).
const reorder = ({ from, to }: { from: number; to: number }) => {
  const shown = displayRows.value.map(r => r.key)
  shown.splice(to, 0, ...shown.splice(from, 1))
  const rest = props.rows.map(r => r.key).filter(k => !shown.includes(k))
  watchlistStore.setWatchlistOrder([...shown, ...rest])
}

// Crypto trades via Swap or Bridge (whichever the info drawer would open for
// this token — swap on the current chain, bridge otherwise), stocks via Trade
// (Figma). The action opens the wallet side panel in place; it must not
// navigate away from the home page.
const actionKey = (row: WatchlistRow) => {
  if (row.removeType !== 'crypto') return 'homePage.hero.watchlist.table.trade'
  return row.cta === 'bridge'
    ? 'homePage.hero.watchlist.table.bridge'
    : 'homePage.hero.watchlist.table.swap'
}

const setCategory = (value: 'all' | 'stocks' | 'crypto') => {
  category.value = value
  isCategoryOpen.value = false
}

const remove = (row: WatchlistRow) => {
  watchlistStore.setWatchlistItem(row.removeId, row.removeType === 'stock')
}

const actionCall = (row: WatchlistRow) => {
  if (row.removeType === 'crypto') {
    // Prime + open the same panel the info drawer would (swap on the current
    // chain, bridge off it) so the side panel isn't left empty.
    if (row.cta === 'bridge') {
      openBridgeForToken(row.symbol, row.name, row.nativeChains, row.chains)
    } else {
      openSwapForToken(row.symbol, row.name, row.chains, row.nativeChains)
    }
    return
  }
  walletMenu.setSelectedTradeTokenSymbol(row.tradeSymbol)
  walletMenu.openPanel('trade')
}
</script>

<template>
  <AppTableWrapper
    v-model:search="query"
    data-test="home-watchlist-table"
    :title="t('homePage.hero.watchlist.table.title')"
    :search-placeholder="
      t('homePage.hero.watchlist.addModal.searchPlaceholder')
    "
  >
    <template #filters>
      <div class="relative shrink-0">
        <button
          type="button"
          data-test="watchlist-category"
          class="flex h-10 items-center gap-1 rounded-full bg-background-default pl-4 pr-3 text-s-16 font-semibold text-black"
          @click="isCategoryOpen = !isCategoryOpen"
        >
          {{ t(CATEGORIES.find(c => c.value === category)!.labelKey) }}
          <AppIcon name="chevron-down" variant="filled" size="s" />
        </button>
        <template v-if="isCategoryOpen">
          <div
            class="fixed inset-0 z-10"
            aria-hidden="true"
            @click="isCategoryOpen = false"
          />
          <ul
            class="absolute left-0 z-20 mt-1 min-w-40 overflow-hidden rounded-2xl border border-border-strong/40 bg-white py-1 shadow-lg"
          >
            <li v-for="c in CATEGORIES" :key="c.value">
              <button
                type="button"
                data-test="category-option"
                :data-value="c.value"
                class="hoverNoBG flex w-full items-center px-4 py-2 text-left text-s-14 font-medium"
                :class="category === c.value ? 'text-text-brand' : 'text-black'"
                @click="setCategory(c.value)"
              >
                {{ t(c.labelKey) }}
              </button>
            </li>
          </ul>
        </template>
      </div>
    </template>

    <template #action>
      <AppTooltip
        :text="
          isWatchlistFull
            ? t('common.watchlist_limit_reached', { max: WATCHLIST_MAX })
            : ''
        "
        placement="bottom"
      >
        <AppBaseButton
          data-test="watchlist-add-new"
          size="medium"
          :disabled="isWatchlistFull"
          @click="isAddOpen = true"
        >
          {{ t('homePage.hero.watchlist.table.addAsset') }}
          <template #trailing>
            <AppIcon name="plus-small" size="xxs" />
          </template>
        </AppBaseButton>
      </AppTooltip>
    </template>

    <!-- Empty (search / category with no match). -->
    <p
      v-if="!displayRows.length"
      data-test="watchlist-empty"
      class="py-10 text-center text-s-14 text-text-subtle"
    >
      {{ t('homePage.hero.watchlist.addModal.empty') }}
    </p>

    <!-- Every row here is watched, so the star removes it. Reordering is off
         while a search or category filter is active. -->
    <AppTable
      v-else
      :columns="columns"
      watchlist
      actions
      :reorderable="!dragDisabled"
      :footer="hasMore ? 'show-more' : undefined"
      :remaining="hiddenCount"
      @show-more="expanded = true"
      @reorder="reorder"
    >
      <template #default="{ size: tableSize }">
        <AppTableRow
          v-for="row in displayRows"
          :key="row.key"
          data-test="watchlist-row"
          :title="row.symbol.toUpperCase()"
          :description="row.name"
          :to="row.route"
          :watchlisted="true"
          :loading="row.loading"
          @update:watchlisted="remove(row)"
        >
          <template v-if="row.isStock" #title>
            {{ stockBaseSymbol(row.symbol)
            }}<span class="bg-stock-gradient bg-clip-text text-transparent"
              >on</span
            >
          </template>
          <template #avatar="{ size: avatarSize }">
            <AppTokenLogo
              :url="row.logoUrl"
              :symbol="row.symbol"
              :is-stock="row.isStock"
              :width="avatarSize === 'm' ? 'w-8' : 'w-10'"
              :height="avatarSize === 'm' ? 'h-8' : 'h-10'"
              no-shadow
            />
          </template>

          <AppTableCell
            column="marketCap"
            :value="row.marketCapDisplay || '—'"
          />
          <AppTableCell column="volume" :value="row.volumeDisplay || '—'" />
          <AppTableCell
            column="change"
            :change="row.change"
            :series="
              row.loading || row.sparkline.length ? row.sparkline : undefined
            "
          />
          <!-- At S the change column is gone, so price carries it. -->
          <AppTableCell
            column="price"
            :value="row.priceDisplay"
            :change="tableSize === 's' ? row.change : undefined"
          />

          <template #actions="{ size, surface }">
            <AppBaseButton
              v-if="size !== 's'"
              data-test="watchlist-trade"
              type="secondary"
              size="medium"
              class="w-24"
              :surface="surface"
              @click="actionCall(row)"
            >
              {{ t(actionKey(row)) }}
            </AppBaseButton>
            <AppPopUpMenu
              v-else
              :placeholder="t('homePage.hero.watchlist.table.moreActions')"
              location="right"
            >
              <template #menu-button="{ toggleMenu }">
                <AppBtnIcon
                  data-test="watchlist-menu"
                  icon="ellipsis-horizontal"
                  :label="t('homePage.hero.watchlist.table.moreActions')"
                  @click="toggleMenu"
                />
              </template>
              <template #menu-content="{ toggleMenu }">
                <ul class="px-2 py-3 min-w-60">
                  <li>
                    <button
                      type="button"
                      data-test="watchlist-menu-trade"
                      class="flex w-full items-center p-2 hoverBGWhite rounded-12"
                      @click="[toggleMenu(), actionCall(row)]"
                    >
                      {{ t(actionKey(row)) }}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      data-test="watchlist-menu-remove"
                      class="flex w-full items-center p-2 hoverBGWhite rounded-12 text-text-error"
                      @click="[toggleMenu(), remove(row)]"
                    >
                      {{ t('homePage.hero.watchlist.table.removeShort') }}
                    </button>
                  </li>
                </ul>
              </template>
            </AppPopUpMenu>
          </template>
        </AppTableRow>
      </template>
    </AppTable>

    <AddToWatchlistDialog v-if="isAddOpen" v-model:is-open="isAddOpen" />
  </AppTableWrapper>
</template>
