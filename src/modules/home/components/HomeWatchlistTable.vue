<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import {
  StarIcon as StarSolidIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/vue/20/solid'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import TableSparkline from '@/components/TableSparkline.vue'
import AddToWatchlistDialog from './AddToWatchlistDialog.vue'
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import type { WatchlistRow } from '@/modules/home/composables/useWatchlistRows'

// Rows are owned by HomeHero (so it can fall back to the banner when there are
// none to show); this component just renders + handles per-row actions.
defineProps<{ rows: WatchlistRow[] }>()

const { t } = useI18n()
const router = useRouter()

const isAddOpen = ref(false)

const watchlistStore = useWatchlistStore()

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)

const changeLabel = (change: number) =>
  formatPercentageValue(Math.abs(change)).value

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
  <section
    data-test="home-watchlist-table"
    class="rounded-2xl bg-white p-6"
  >
    <div class="flex items-start justify-between">
      <div>
        <h2 class="text-s-20 font-bold text-black">
          {{ t('homePage.hero.watchlist.table.title') }}
        </h2>
        <p class="mt-1 text-s-14 text-[#575757]">
          {{ t('homePage.hero.watchlist.table.subtitle') }}
        </p>
      </div>
      <button
        type="button"
        data-test="watchlist-add-new"
        class="flex shrink-0 items-center gap-1 rounded-full bg-[#f5f5f5] px-4 py-2 text-s-14 font-medium text-primary"
        @click="isAddOpen = true"
      >
        {{ t('homePage.hero.watchlist.table.addNew') }}
        <PlusIcon class="size-4" />
      </button>
    </div>

    <!-- Column headers (lg+) -->
    <div
      class="mt-6 hidden items-center gap-4 border-b border-grey-outline/40 pb-2 text-s-11 uppercase tracking-wide text-[#575757] lg:flex"
    >
      <span class="min-w-0 flex-1">
        {{ t('homePage.hero.watchlist.table.columns.asset') }}
      </span>
      <span class="w-[120px] text-right">
        {{ t('homePage.hero.watchlist.table.columns.marketValue') }}
      </span>
      <span class="w-[100px] text-right">
        {{ t('homePage.hero.watchlist.table.columns.price') }}
      </span>
      <span class="w-[140px] text-right">
        {{ t('homePage.hero.watchlist.table.columns.trend') }}
      </span>
      <span class="w-[88px]" />
    </div>

    <ul>
      <li
        v-for="row in rows"
        :key="row.key"
        data-test="watchlist-row"
        class="flex items-center gap-4 border-b border-grey-outline/30 py-4 last:border-b-0"
      >
        <!-- Asset -->
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            data-test="watchlist-remove"
            :aria-label="t('homePage.hero.watchlist.table.remove')"
            class="shrink-0 text-primary"
            @click="remove(row)"
          >
            <StarSolidIcon class="size-5" />
          </button>
          <AppTokenLogo
            :url="row.logoUrl"
            :symbol="row.symbol"
            :is-stock="row.isStock"
            width="w-8"
            height="h-8"
          />
          <div class="min-w-0">
            <AppTokenSymbol
              :symbol="row.symbol"
              :is-stock="row.isStock"
              class="block truncate text-s-14 font-bold text-black"
            />
            <span class="block truncate text-s-12 text-[#575757]">
              {{ row.name }}
            </span>
          </div>
        </div>

        <!-- Market value -->
        <span
          class="hidden w-[120px] text-right text-s-14 font-medium text-black lg:block"
        >
          {{ row.marketValueDisplay }}
        </span>

        <!-- Price -->
        <span class="w-[100px] text-right text-s-14 font-medium text-black">
          {{ row.priceDisplay }}
        </span>

        <!-- Trend -->
        <div class="hidden w-[140px] items-center justify-end gap-2 lg:flex">
          <span
            class="flex items-center gap-0.5 text-s-12"
            :class="row.change < 0 ? 'text-error' : 'text-success'"
          >
            {{ changeLabel(row.change) }}
            <ArrowDownIcon v-if="row.change < 0" class="size-3.5" />
            <ArrowUpIcon v-else class="size-3.5" />
          </span>
          <TableSparkline
            v-if="row.sparkline.length"
            :points="row.sparkline"
            :percent-change="row.change"
            :width="56"
            :height="28"
            :max-points="40"
            fill
          />
        </div>

        <!-- Trade -->
        <button
          type="button"
          data-test="watchlist-trade"
          class="w-[88px] shrink-0 rounded-full bg-[#f5f5f5] py-2 text-s-14 font-medium text-primary"
          @click="trade(row)"
        >
          {{ t('homePage.hero.watchlist.table.trade') }}
        </button>
      </li>
    </ul>

    <AddToWatchlistDialog v-model:is-open="isAddOpen" />
  </section>
</template>
