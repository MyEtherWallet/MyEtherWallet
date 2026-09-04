<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import {
  StarIcon as StarSolidIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  Bars2Icon,
  EllipsisHorizontalIcon,
} from '@heroicons/vue/20/solid'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import TableSparkline from '@/components/TableSparkline.vue'
import AddToWatchlistDialog from './AddToWatchlistDialog.vue'
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import type { WatchlistRow } from '@/modules/home/composables/useWatchlistRows'

// Rows are owned by HomeHero (so it can fall back to the banner when there are
// none to show); this component renders + handles per-row actions, search,
// category filter, "Show more" and manual drag-reordering.
const props = defineProps<{ rows: WatchlistRow[] }>()

const { t } = useI18n()
const router = useRouter()

const isAddOpen = ref(false)
const query = ref('')
const category = ref<'all' | 'stocks' | 'crypto'>('all')
const isCategoryOpen = ref(false)
const expanded = ref(false)
// Row key whose compact (<780px) kebab action menu is open.
const openMenuKey = ref<string | null>(null)
const INITIAL_COUNT = 5

const CATEGORIES = [
  { value: 'all', labelKey: 'homePage.hero.watchlist.table.allCategories' },
  { value: 'stocks', labelKey: 'homePage.hero.watchlist.addModal.tabs.stocks' },
  { value: 'crypto', labelKey: 'homePage.hero.watchlist.addModal.tabs.crypto' },
] as const

const watchlistStore = useWatchlistStore()
const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)

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

// vuedraggable v-model: reorder the displayed rows and persist a full key order
// (displayed order first, then the rows currently hidden below the fold).
const draggableRows = computed<WatchlistRow[]>({
  get: () => displayRows.value,
  set: newDisplay => {
    const shown = new Set(newDisplay.map(r => r.key))
    const rest = props.rows.filter(r => !shown.has(r.key)).map(r => r.key)
    watchlistStore.setWatchlistOrder([...newDisplay.map(r => r.key), ...rest])
  },
})

const changeLabel = (change: number) =>
  formatPercentageValue(Math.abs(change)).value

// Crypto trades via Swap, stocks/perps via Trade (Figma).
const actionKey = (row: WatchlistRow) =>
  row.removeType === 'crypto'
    ? 'homePage.hero.watchlist.table.swap'
    : 'homePage.hero.watchlist.table.trade'

const setCategory = (value: 'all' | 'stocks' | 'crypto') => {
  category.value = value
  isCategoryOpen.value = false
}

const remove = (row: WatchlistRow) => {
  if (row.removeType === 'perp') {
    watchlistStore.setWatchlistPerp(row.removeId)
  } else {
    watchlistStore.setWatchlistItem(row.removeId, row.removeType === 'stock')
  }
}

const trade = (row: WatchlistRow) => {
  walletMenu.setSelectedTradeTokenSymbol(row.tradeSymbol)
  walletMenu.setWalletPanel('trade')
  if (!isOpenSideMenu.value) walletMenu.setIsOpenSideMenu(true)
  router.push(row.route)
}
</script>

<template>
  <section data-test="home-watchlist-table" class="rounded-2xl bg-white p-6">
    <!-- Header: title + Add asset (Add asset sits by the title on mobile). -->
    <div class="flex items-center gap-4">
      <h2 class="min-w-0 flex-1 text-s-20 font-bold text-black">
        {{ t('homePage.hero.watchlist.table.title') }}
      </h2>
      <button
        type="button"
        data-test="watchlist-add-new-mobile"
        class="flex h-10 shrink-0 items-center gap-1 rounded-full bg-primary px-4 text-s-16 font-semibold text-white min-[780px]:hidden"
        @click="isAddOpen = true"
      >
        {{ t('homePage.hero.watchlist.table.addAsset') }}
        <PlusIcon class="size-[18px]" />
      </button>
    </div>

    <!-- Toolbar: search + category stacked on mobile; Add asset (desktop). -->
    <div
      class="mt-4 flex flex-col gap-2 min-[780px]:mt-6 min-[780px]:flex-row min-[780px]:items-center min-[780px]:justify-between"
    >
      <div
        class="flex flex-col gap-2 min-[780px]:flex-row min-[780px]:items-center"
      >
        <AppSearchInput
          v-model="query"
          :placeholder="t('homePage.hero.watchlist.addModal.searchPlaceholder')"
          bg-class="bg-[#f5f5f5]"
          class="w-full rounded-full min-[780px]:w-[240px]"
        />
        <div class="relative shrink-0 self-start">
          <button
            type="button"
            data-test="watchlist-category"
            class="flex h-10 items-center gap-1 rounded-full bg-[#f5f5f5] pl-4 pr-3 text-s-16 font-semibold text-black"
            @click="isCategoryOpen = !isCategoryOpen"
          >
            {{ t(CATEGORIES.find(c => c.value === category)!.labelKey) }}
            <ChevronDownIcon class="size-5" />
          </button>
          <template v-if="isCategoryOpen">
            <div
              class="fixed inset-0 z-10"
              aria-hidden="true"
              @click="isCategoryOpen = false"
            />
            <ul
              class="absolute left-0 z-20 mt-1 min-w-[160px] overflow-hidden rounded-2xl border border-grey-outline/40 bg-white py-1 shadow-lg"
            >
              <li v-for="c in CATEGORIES" :key="c.value">
                <button
                  type="button"
                  data-test="category-option"
                  :data-value="c.value"
                  class="hoverNoBG flex w-full items-center px-4 py-2 text-left text-s-14 font-medium"
                  :class="category === c.value ? 'text-primary' : 'text-black'"
                  @click="setCategory(c.value)"
                >
                  {{ t(c.labelKey) }}
                </button>
              </li>
            </ul>
          </template>
        </div>
      </div>
      <button
        type="button"
        data-test="watchlist-add-new"
        class="hidden h-10 shrink-0 items-center gap-1 rounded-full bg-primary px-4 text-s-16 font-semibold text-white min-[780px]:flex"
        @click="isAddOpen = true"
      >
        {{ t('homePage.hero.watchlist.table.addAsset') }}
        <PlusIcon class="size-[18px]" />
      </button>
    </div>

    <div class="mt-6 h-px w-full bg-grey-outline/40" aria-hidden="true" />

    <!-- Column headers (spacers keep them aligned with the row cells). -->
    <div
      class="mt-4 flex items-center gap-2 px-2 pb-2 text-s-11 uppercase tracking-wide text-[#575757]"
    >
      <!-- Mobile reserves the always-on drag handle; desktop reveals it on hover. -->
      <span class="w-4 shrink-0 min-[780px]:hidden" aria-hidden="true" />
      <span class="w-5 shrink-0" aria-hidden="true" />
      <span class="min-w-0 flex-1">
        {{ t('homePage.hero.watchlist.table.columns.token') }}
      </span>
      <span class="hidden w-[130px] min-[780px]:block">
        {{ t('homePage.hero.watchlist.table.columns.marketCap') }}
      </span>
      <span class="hidden w-[130px] xl:block">
        {{ t('homePage.hero.watchlist.table.columns.volume') }}
      </span>
      <span class="hidden w-[130px] xl:block">
        {{ t('homePage.hero.watchlist.table.columns.change24h') }}
      </span>
      <span class="w-[100px]">
        {{ t('homePage.hero.watchlist.table.columns.price') }}
      </span>
      <span class="w-8 shrink-0 min-[780px]:w-[96px]" aria-hidden="true" />
    </div>

    <!-- Empty (search / category with no match). -->
    <p
      v-if="!displayRows.length"
      data-test="watchlist-empty"
      class="py-10 text-center text-s-14 text-[#575757]"
    >
      {{ t('homePage.hero.watchlist.addModal.empty') }}
    </p>

    <!-- Rows: drag-reorderable via the handle (disabled while filtering). -->
    <draggable
      v-else
      v-model="draggableRows"
      item-key="key"
      handle=".drag-handle"
      :disabled="dragDisabled"
      tag="ul"
      ghost-class="opacity-40"
      :animation="150"
    >
      <template #item="{ element: row }">
        <li
          data-test="watchlist-row"
          class="group relative flex items-center gap-2 rounded-xl px-2 py-3 transition-[padding,background-color] duration-200 ease-out hover:bg-surface-hover"
          :class="{ 'min-[780px]:hover:pl-7': !dragDisabled }"
        >
          <!-- Mobile: the handle is always visible (fixed) so touch users can
               reorder. Desktop: it fades in on hover and the row's left padding
               animates to make room (no reserved space, never intercepts the
               star). Hidden entirely while filtering. -->
          <span
            class="drag-handle flex w-4 shrink-0 items-center justify-center min-[780px]:hidden"
            :class="dragDisabled ? 'invisible' : 'cursor-grab active:cursor-grabbing'"
            :aria-label="t('homePage.hero.watchlist.table.dragLabel')"
          >
            <Bars2Icon class="size-4 text-[#a5a5a5]" />
          </span>
          <span
            class="drag-handle absolute left-2 top-1/2 hidden -translate-y-1/2 pointer-events-none opacity-0 transition-opacity min-[780px]:flex"
            :class="
              dragDisabled
                ? ''
                : 'cursor-grab group-hover:pointer-events-auto group-hover:opacity-100 active:cursor-grabbing'
            "
            :aria-label="t('homePage.hero.watchlist.table.dragLabel')"
          >
            <Bars2Icon class="size-4 text-[#a5a5a5]" />
          </span>

          <!-- Star toggle (remove). -->
          <button
            type="button"
            data-test="watchlist-remove"
            :aria-label="t('homePage.hero.watchlist.table.remove')"
            class="w-5 shrink-0 text-primary"
            @click="remove(row)"
          >
            <StarSolidIcon class="size-5" />
          </button>

          <!-- Token -->
          <div class="flex min-w-0 flex-1 items-center gap-2">
            <template v-if="row.loading">
              <span
                class="size-10 shrink-0 animate-pulse rounded-full bg-[#f0f0f0]"
              />
              <div class="min-w-0 space-y-1.5">
                <span
                  class="block h-4 w-16 animate-pulse rounded bg-[#f0f0f0]"
                />
                <span
                  class="block h-3 w-24 animate-pulse rounded bg-[#f0f0f0]"
                />
              </div>
            </template>
            <template v-else>
              <AppTokenLogo
                :url="row.logoUrl"
                :symbol="row.symbol"
                :is-stock="row.isStock"
                width="w-10"
                height="h-10"
              />
              <div class="min-w-0">
                <AppTokenSymbol
                  :symbol="row.symbol"
                  :is-stock="row.isStock"
                  class="block truncate text-s-16 font-semibold text-black"
                />
                <span class="block truncate text-s-14 text-[#575757]">
                  {{ row.name }}
                </span>
              </div>
            </template>
          </div>

          <!-- Market cap (≥780px) -->
          <span
            class="hidden w-[130px] text-s-16 font-semibold text-black min-[780px]:block"
          >
            <span
              v-if="row.loading"
              class="inline-block h-4 w-16 animate-pulse rounded bg-[#f0f0f0]"
            />
            <template v-else>{{ row.marketCapDisplay || '—' }}</template>
          </span>

          <!-- Volume (≥1280px) -->
          <span
            class="hidden w-[130px] text-s-16 font-semibold text-black xl:block"
          >
            <span
              v-if="row.loading"
              class="inline-block h-4 w-16 animate-pulse rounded bg-[#f0f0f0]"
            />
            <template v-else>{{ row.volumeDisplay || '—' }}</template>
          </span>

          <!-- 24h change column (≥1280px): % + arrow, sparkline below -->
          <div class="hidden w-[130px] flex-col gap-1 xl:flex">
            <span
              v-if="row.loading"
              class="h-4 w-20 animate-pulse rounded bg-[#f0f0f0]"
            />
            <template v-else>
              <span
                class="flex items-center gap-0.5 text-s-12 font-semibold"
                :class="row.change < 0 ? 'text-error' : 'text-success'"
              >
                {{ changeLabel(row.change) }}
                <ArrowDownIcon v-if="row.change < 0" class="size-3" />
                <ArrowUpIcon v-else class="size-3" />
              </span>
              <TableSparkline
                v-if="row.sparkline.length"
                :points="row.sparkline"
                :percent-change="row.change"
                :width="56"
                :height="16"
                :max-points="40"
                fill
              />
            </template>
          </div>

          <!-- Price — carries the 24h change inline below 1280px (no separate
               change column there); right-aligned on mobile per Figma. -->
          <div class="flex w-[100px] flex-col items-end min-[780px]:items-start">
            <span
              v-if="row.loading"
              class="inline-block h-4 w-12 animate-pulse rounded bg-[#f0f0f0]"
            />
            <template v-else>
              <span class="text-s-16 font-semibold text-black">
                {{ row.priceDisplay }}
              </span>
              <span
                class="flex items-center gap-0.5 text-s-12 font-semibold xl:hidden"
                :class="row.change < 0 ? 'text-error' : 'text-success'"
              >
                {{ changeLabel(row.change) }}
                <ArrowDownIcon v-if="row.change < 0" class="size-3" />
                <ArrowUpIcon v-else class="size-3" />
              </span>
            </template>
          </div>

          <!-- Actions: a Trade/Swap button (≥780px), a kebab menu below. -->
          <div
            class="flex w-8 shrink-0 justify-end min-[780px]:w-[96px]"
          >
            <span
              v-if="row.loading"
              class="h-9 w-8 animate-pulse rounded-full bg-[#f0f0f0] min-[780px]:w-[96px]"
            />
            <template v-else>
              <button
                type="button"
                data-test="watchlist-trade"
                class="hidden w-[96px] rounded-full bg-[#f5f5f5] py-2 text-s-16 font-semibold text-primary min-[780px]:block"
                @click="trade(row)"
              >
                {{ t(actionKey(row)) }}
              </button>
              <div class="relative min-[780px]:hidden">
                <button
                  type="button"
                  data-test="watchlist-menu"
                  :aria-label="t('homePage.hero.watchlist.table.moreActions')"
                  class="hoverNoBG flex size-8 items-center justify-center rounded-full text-[#575757]"
                  @click="openMenuKey = openMenuKey === row.key ? null : row.key"
                >
                  <EllipsisHorizontalIcon class="size-5" />
                </button>
                <template v-if="openMenuKey === row.key">
                  <div
                    class="fixed inset-0 z-10"
                    aria-hidden="true"
                    @click="openMenuKey = null"
                  />
                  <ul
                    class="absolute right-0 z-20 mt-1 min-w-[160px] overflow-hidden rounded-2xl border border-grey-outline/40 bg-white py-1 shadow-lg"
                  >
                    <li>
                      <button
                        type="button"
                        data-test="watchlist-menu-trade"
                        class="hoverNoBG flex w-full items-center px-4 py-2 text-left text-s-14 font-medium text-black"
                        @click="
                          trade(row);
                          openMenuKey = null;
                        "
                      >
                        {{ t(actionKey(row)) }}
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        class="hoverNoBG flex w-full items-center px-4 py-2 text-left text-s-14 font-medium text-error"
                        @click="
                          remove(row);
                          openMenuKey = null;
                        "
                      >
                        {{ t('homePage.hero.watchlist.table.removeShort') }}
                      </button>
                    </li>
                  </ul>
                </template>
              </div>
            </template>
          </div>
        </li>
      </template>
    </draggable>

    <!-- Show more (expand to full length). -->
    <div v-if="hasMore" class="mt-4 flex items-center gap-4">
      <span class="h-px flex-1 bg-grey-outline/40" aria-hidden="true" />
      <button
        type="button"
        data-test="watchlist-show-more"
        class="hoverNoBG rounded-full px-3 py-1 text-s-16 font-semibold text-black"
        @click="expanded = true"
      >
        {{ t('homePage.hero.watchlist.table.showMore', { count: hiddenCount }) }}
      </button>
      <span class="h-px flex-1 bg-grey-outline/40" aria-hidden="true" />
    </div>

    <AddToWatchlistDialog v-if="isAddOpen" v-model:is-open="isAddOpen" />
  </section>
</template>
