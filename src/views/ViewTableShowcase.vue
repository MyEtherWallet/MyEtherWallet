<script setup lang="ts">
// Preview for the Table design-library module (MEW-2469) at /dev/table.
// Figma: TableWrapper 2913:98036, TableRow 2126:16555, _Table 2128:5354,
// .TableHeader 2129:5690, _TableHeaderTitle 1255:4142, _TableCell 2801:35945,
// _TableFooter 2928:161002. Hover and focus are native: hover a row, or Tab.
import { computed, ref } from 'vue'
import AppTableWrapper from '@/components/table/AppTableWrapper.vue'
import AppTable from '@/components/table/AppTable.vue'
import AppTableRow from '@/components/table/AppTableRow.vue'
import AppTableCell from '@/components/table/AppTableCell.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import type {
  TableColumn,
  TableSize,
  TableSort,
} from '@/components/table/types'

interface Asset {
  id: number
  name: string
  symbol: string
  price: number
  change: number
  cap: number
  volume: number
  series: number[]
}

const NAMES = [
  'Bitcoin',
  'Ethereum',
  'Tether',
  'USD Coin',
  'Solana',
  'Ripple',
  'Cardano',
  'Dogecoin',
  'Polygon',
  'Chainlink',
  'Litecoin',
  'Avalanche',
  'Uniswap',
  'Stellar',
  'Monero',
  'Cosmos',
  'Aave',
  'Maker',
  'Arbitrum',
  'Optimism',
  'Near',
  'Aptos',
  'Sui',
  'Pepe',
  'Tron',
]

// Deterministic sample data: no Math.random, so the preview is stable.
const ASSETS: Asset[] = NAMES.map((name, i) => ({
  id: i,
  name,
  symbol: name.slice(0, 3).toUpperCase(),
  price: Math.round(((i * 7919) % 50000) + 1) / 7,
  change: i % 5 === 0 ? 0 : (((i * 37) % 17) - 8) / 2.3,
  cap: ((i * 104729) % 900) * 1e7,
  volume: ((i * 1299709) % 500) * 1e6,
  series: Array.from(
    { length: 24 },
    (_, j) => Math.sin(j / 3 + i) * 10 + j * ((i % 3) - 1),
  ),
}))

const usd = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  })
const compact = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
  })

const COLUMNS: TableColumn[] = [
  { key: 'name', label: 'Token', sortable: true },
  { key: 'price', label: 'Price', sortable: true, primary: true },
  { key: 'change', label: '24h change' },
  { key: 'cap', label: 'Market cap', sortable: true },
  { key: 'volume', label: 'Volume', sortable: true },
]

// Live table: search, sort, pagination, watchlist, all in the parent.
const width = ref(1296)
const search = ref('')
const loading = ref(false)
const sort = ref<TableSort | null>({ key: 'cap', direction: 'desc' })
const page = ref(1)
const watched = ref(new Set<number>([1]))
const PER_PAGE = 6

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  const list = ASSETS.filter(a => a.name.toLowerCase().includes(q))
  const s = sort.value
  if (!s) return list
  const key = s.key as keyof Asset
  const dir = s.direction === 'asc' ? 1 : -1
  return [...list].sort((a, b) =>
    a[key] > b[key] ? dir : a[key] < b[key] ? -dir : 0,
  )
})
const pages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / PER_PAGE)),
)
const pageRows = computed(() =>
  filtered.value.slice((page.value - 1) * PER_PAGE, page.value * PER_PAGE),
)
const toggle = (id: number, on: boolean) => {
  const next = new Set(watched.value)
  if (on) next.add(id)
  else next.delete(id)
  watched.value = next
}

// Rows at a fixed size, one and two actions.
const SIZES: TableSize[] = ['l', 'm', 's']
const SAMPLE = ASSETS.slice(0, 2)

// Cells.
const CELLS = [
  { label: 'Number + trend up', props: { value: '$256.72', change: 2.87 } },
  { label: 'Number + trend down', props: { value: '$256.72', change: -2.87 } },
  { label: 'Number + neutral', props: { value: '$256.72', change: 0 } },
  { label: 'Trend up', props: { change: 2.87, series: ASSETS[3].series } },
  { label: 'Trend down', props: { change: -2.87, series: ASSETS[4].series } },
  { label: 'Trend neutral', props: { change: 0, series: [1, 1] } },
]

// Show more.
const shown = ref(4)

// Reorder.
const order = ref(ASSETS.slice(0, 5))
const reorder = ({ from, to }: { from: number; to: number }) => {
  const next = [...order.value]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  order.value = next
}

// Clickable rows.
const lastClicked = ref('')
</script>

<template>
  <div class="mx-auto flex max-w-340 flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Table</h1>
      <p class="text-text-sm text-text-subtle">
        Data table: a header row with sortable columns, rows with a watchlist
        star, avatar, data cells and actions, and a footer. The wrapper sizes
        the table from its own width: L at 1280+, M from 768, S below.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">
        Wrapper — drag the width (1296 / 1120 / 383 in Figma)
      </h2>
      <label class="flex items-center gap-3 text-text-sm">
        <input
          v-model.number="width"
          type="range"
          min="340"
          max="1296"
          step="1"
          class="w-80"
        />
        {{ width }}px
      </label>
      <label class="flex items-center gap-2 text-text-sm">
        <input v-model="loading" type="checkbox" />
        Loading (skeleton rows land on the loaded ones)
      </label>
      <div class="rounded-12 bg-background-default p-4">
        <AppTableWrapper
          v-model:search="search"
          title="Explore crypto"
          search-placeholder="Search"
          :style="{ width: `${width}px` }"
        >
          <template #filters>
            <button
              type="button"
              class="flex h-10 items-center gap-2 rounded-full bg-background-default px-4 text-s-15 font-medium text-black"
            >
              All categories
              <AppIcon name="chevron-down" variant="filled" size="xxs" />
            </button>
          </template>
          <template #action>
            <AppBaseButton size="medium">
              Add asset
              <template #trailing
                ><AppIcon name="plus-small" size="xxs"
              /></template>
            </AppBaseButton>
          </template>
          <AppTable
            v-model:sort="sort"
            v-model:page="page"
            :columns="COLUMNS"
            :pages="pages"
            :loading="loading"
            :loading-rows="PER_PAGE"
            footer="pagination"
            aria-label="Explore crypto"
            watchlist
            actions
          >
            <template #default="{ size }">
              <AppTableRow
                v-for="a in pageRows"
                :key="a.id"
                :title="a.symbol"
                :description="a.name"
                :watchlisted="watched.has(a.id)"
                @update:watchlisted="toggle(a.id, $event)"
              >
                <template #avatar="{ size: avatarSize }">
                  <AppAvatar
                    type="initial"
                    :initial="a.name[0]"
                    :size="avatarSize"
                  />
                </template>
                <AppTableCell
                  column="price"
                  :value="usd(a.price)"
                  :change="a.change"
                />
                <AppTableCell
                  column="change"
                  :change="a.change"
                  :series="a.series"
                />
                <AppTableCell column="cap" :value="compact(a.cap)" />
                <AppTableCell column="volume" :value="compact(a.volume)" />
                <template #actions="{ surface }">
                  <AppBtnIcon
                    v-if="size === 's'"
                    icon="ellipsis-horizontal"
                    label="More"
                  />
                  <template v-else>
                    <AppBaseButton
                      type="secondary"
                      :surface="surface"
                      size="medium"
                      class="w-24"
                    >
                      Buy
                    </AppBaseButton>
                    <AppBaseButton
                      v-if="size === 'l'"
                      type="secondary"
                      :surface="surface"
                      size="medium"
                      class="w-24"
                    >
                      Swap
                    </AppBaseButton>
                  </template>
                </template>
              </AppTableRow>
            </template>
          </AppTable>
        </AppTableWrapper>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">
        TableRow — Size L / M / S (hover a row, Tab for focus)
      </h2>
      <div
        v-for="s in SIZES"
        :key="s"
        class="rounded-12 bg-background-alternative p-6"
      >
        <p class="mb-2 text-text-sm text-text-subtle">
          Size {{ s.toUpperCase() }}
        </p>
        <AppTable :columns="COLUMNS" :size="s" watchlist actions reorderable>
          <AppTableRow
            v-for="(a, i) in SAMPLE"
            :key="a.id"
            :title="a.symbol"
            :description="a.name"
            :watchlisted="false"
            @click="lastClicked = a.name"
          >
            <template #avatar="{ size: avatarSize }">
              <AppAvatar
                type="initial"
                :initial="a.name[0]"
                :size="avatarSize"
              />
            </template>
            <AppTableCell
              column="price"
              :value="usd(a.price)"
              :change="a.change"
            />
            <AppTableCell
              column="change"
              :value="usd(a.price)"
              :change="a.change"
            />
            <AppTableCell column="cap" :value="compact(a.cap)" />
            <AppTableCell column="volume" :value="compact(a.volume)" />
            <template #actions="{ surface }">
              <AppBtnIcon
                v-if="s === 's'"
                icon="ellipsis-horizontal"
                label="More"
              />
              <template v-else>
                <AppBaseButton
                  type="secondary"
                  :surface="surface"
                  size="medium"
                  class="w-24"
                >
                  Button
                </AppBaseButton>
                <AppBaseButton
                  v-if="s === 'l' && i === 1"
                  type="secondary"
                  :surface="surface"
                  size="medium"
                  class="w-24"
                >
                  Button
                </AppBaseButton>
              </template>
            </template>
          </AppTableRow>
        </AppTable>
      </div>
      <p class="text-text-sm text-text-subtle">
        Clicked: {{ lastClicked || '—' }}
      </p>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">
        _TableCell — Number / Trend up / down / neutral
      </h2>
      <div
        class="grid grid-cols-3 gap-4 rounded-12 bg-background-alternative p-6"
      >
        <div v-for="c in CELLS" :key="c.label" class="flex flex-col gap-1">
          <p class="text-text-sm text-text-subtle">{{ c.label }}</p>
          <AppTableCell v-bind="c.props" />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">_TableFooter — Show more</h2>
      <div class="rounded-12 bg-background-alternative p-6">
        <AppTable
          :columns="COLUMNS.slice(0, 3)"
          footer="show-more"
          :remaining="ASSETS.length - shown"
          @show-more="shown = Math.min(shown + 4, ASSETS.length)"
        >
          <AppTableRow
            v-for="a in ASSETS.slice(0, shown)"
            :key="a.id"
            :title="a.symbol"
            :description="a.name"
          >
            <AppTableCell column="price" :value="usd(a.price)" />
            <AppTableCell
              column="change"
              :change="a.change"
              :series="a.series"
            />
          </AppTableRow>
        </AppTable>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Reorderable — drag the handle</h2>
      <div class="rounded-12 bg-background-alternative p-6">
        <AppTable
          :columns="COLUMNS.slice(0, 2)"
          reorderable
          watchlist
          @reorder="reorder"
        >
          <AppTableRow
            v-for="a in order"
            :key="a.id"
            :title="a.symbol"
            :description="a.name"
            :watchlisted="watched.has(a.id)"
            @update:watchlisted="toggle(a.id, $event)"
          >
            <AppTableCell
              column="price"
              :value="usd(a.price)"
              :change="a.change"
            />
          </AppTableRow>
        </AppTable>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">maxHeight — rows scroll under the header</h2>
      <div class="rounded-12 bg-background-alternative p-6">
        <AppTable :columns="COLUMNS.slice(0, 3)" max-height="max-h-80">
          <AppTableRow
            v-for="a in ASSETS"
            :key="a.id"
            :title="a.symbol"
            :description="a.name"
          >
            <AppTableCell column="price" :value="usd(a.price)" />
            <AppTableCell column="change" :change="a.change" />
          </AppTableRow>
        </AppTable>
      </div>
    </section>
  </div>
</template>
