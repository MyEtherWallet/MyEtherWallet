<template>
  <div class="flex items-center justify-between gap-3">
    <h2 class="font-semibold">Explore Crypto Tokens</h2>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="f in filters"
        :key="f"
        @click="activeFilter = f"
        :class="[
          'px-3 py-1.5 rounded-full text-sm border transition',
          activeFilter === f
            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
            : '  hover:',
        ]"
      >
        {{ f }}
      </button>
    </div>
  </div>

  <div class="flex items-center gap-3 rounded-xl p-2">
    <input
      v-model="search"
      type="text"
      placeholder="Search Tokens"
      class="flex-1 bg-transparent outline-none px-2 placeholder:"
    />
    <div class="w-px self-stretch" />
    <button class="px-3 py-1.5 rounded-lg border bg-white hover:">
      Filter by Chains
    </button>
  </div>

  <div class="relative">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left">
            <th class="px-3 py-2">Asset</th>
            <th class="px-3 py-2">Price</th>
            <th class="px-3 py-2">7d</th>
            <th class="px-3 py-2">Chart</th>
            <th class="px-3 py-2 text-right">Change</th>
            <th class="px-3 py-2 text-right">Mkt cap</th>
            <th class="px-3 py-2 text-right">Volume</th>
            <th class="px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="t in filteredTokens"
            :key="t.symbol"
            class="bg-white border-y hover:"
          >
            <td class="px-3 py-3">
              <div class="flex items-center gap-3">
                <img :src="t.icon" :alt="t.name" class="w-6 h-6 rounded-full" />
                <div>
                  <div class="font-medium">
                    {{ t.name }}
                  </div>
                  <small class="">{{ t.symbol }}</small>
                </div>
              </div>
            </td>
            <td class="px-3 py-3">{{ t.price }}</td>
            <td
              class="px-3 py-3"
              :class="t.changeNum >= 0 ? 'text-emerald-600' : 'text-rose-500'"
            >
              {{ signed(t.changeNum) }}
            </td>
            <td class="px-3 py-3 w-24">
              <Sparkline :points="t.spark" class="text-indigo-600" />
            </td>
            <td
              class="px-3 py-3 text-right"
              :class="t.changeNum >= 0 ? 'text-emerald-600' : 'text-rose-500'"
            >
              {{ pct(t.changeNum) }}
            </td>
            <td class="px-3 py-3 text-right">
              {{ t.mcap }}
            </td>
            <td class="px-3 py-3 text-right">
              {{ t.volume }}
            </td>
            <td class="px-3 py-3">
              <div class="flex justify-center gap-2">
                <button
                  class="px-3 py-1.5 rounded-xl bg-cyan-500 text-white font-semibold shadow hover:bg-cyan-600"
                >
                  BUY
                </button>
                <button
                  class="px-3 py-1.5 rounded-xl bg-violet-600 text-white font-semibold shadow hover:bg-violet-700"
                >
                  SWAP
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between text-xs mt-2">
      <div class="flex items-center gap-2">
        <button
          class="px-2 py-1 rounded-lg border bg-white disabled:opacity-50"
          :disabled="page === 1"
          @click="page--"
        >
          Prev
        </button>
        <span class="px-2">{{ page }}</span>
        <button
          class="px-2 py-1 rounded-lg border bg-white disabled:opacity-50"
          :disabled="page >= totalPages"
          @click="page++"
        >
          Next
        </button>
      </div>
      <small>{{ filteredTokens.length }} of {{ tokens.length }} results</small>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, defineComponent, type PropType, h } from 'vue'
// ----------------------
// Types & Interfaces
// ----------------------
export type FilterTag =
  | 'All'
  | 'DeFi'
  | 'MEME'
  | 'Stable'
  | 'TikTok'
  | 'Watchlist'

export interface TokenRow {
  name: string
  symbol: string
  price: string
  changeNum: number // numeric % change
  mcap: string
  volume: string
  icon: string
  spark: number[]
}

export interface PaginationState {
  page: number
  totalPages: number
}

const filters: FilterTag[] = [
  'All',
  'DeFi',
  'MEME',
  'Stable',
  'TikTok',
  'Watchlist',
]
const activeFilter = ref<FilterTag>('All')
const search = ref<string>('')

const tokens = ref<TokenRow[]>([
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$68,947',
    changeNum: 1.08,
    mcap: '$1.36T',
    volume: '$42.8B',
    icon: 'https://dummyimage.com/24x24/f7931a/000&text=B',
    spark: [1, 2, 2.4, 2.2, 2.5, 2.7, 2.9],
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$3,497',
    changeNum: 7.64,
    mcap: '$419B',
    volume: '$22.3B',
    icon: 'https://dummyimage.com/24x24/62688f/fff&text=Ξ',
    spark: [1, 1.1, 1.2, 1.15, 1.3, 1.4, 1.6],
  },
  {
    name: 'XRP',
    symbol: 'XRP',
    price: '$0.62',
    changeNum: -0.85,
    mcap: '$34B',
    volume: '$1.9B',
    icon: 'https://dummyimage.com/24x24/000/fff&text=X',
    spark: [1, 0.95, 0.9, 0.92, 0.88, 0.9, 0.93],
  },
  {
    name: 'Tether',
    symbol: 'USDT',
    price: '$1.00',
    changeNum: 0.02,
    mcap: '$112B',
    volume: '$38B',
    icon: 'https://dummyimage.com/24x24/26a17b/fff&text=T',
    spark: [1, 1, 1, 1, 1, 1, 1],
  },
  {
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: '$0.14',
    changeNum: 2.26,
    mcap: '$20B',
    volume: '$1.1B',
    icon: 'https://dummyimage.com/24x24/c2a633/000&text=D',
    spark: [1, 1.05, 1.03, 1.1, 1.2, 1.18, 1.25],
  },
])

const page = ref<number>(1)
const totalPages = ref<number>(1)

// ----------------------
// Computed & Helpers
// ----------------------
const filteredTokens = computed<TokenRow[]>(() => {
  // NOTE: Active filter is a stub—hook into your API/category field here
  const q = search.value.trim().toLowerCase()
  return tokens.value.filter(
    t =>
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.symbol.toLowerCase().includes(q),
  )
})

function pct(n: number): string {
  return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'
}
function signed(n: number): string {
  return (n >= 0 ? '+' : '') + n.toFixed(2)
}

// ----------------------
// Sparkline component (typed, no JSX requirement)
// ----------------------
const Sparkline = defineComponent({
  name: 'spark-line',
  props: {
    points: { type: Array as PropType<number[]>, required: true },
    width: { type: Number, default: 96 },
    height: { type: Number, default: 28 },
  },
  setup(props) {
    const pathPoints = computed(() => {
      const pts = props.points
      const w = props.width
      const h = props.height
      const max = Math.max(...pts)
      const min = Math.min(...pts)
      const norm = (v: number) => h - ((v - min) / (max - min || 1)) * h
      return pts
        .map((v, i) => `${(i / (pts.length - 1)) * w},${norm(v)}`)
        .join(' ')
    })

    return () =>
      h(
        'svg',
        {
          width: props.width,
          height: props.height,
          viewBox: `0 0 ${props.width} ${props.height}`,
          class: 'block',
        },
        [
          h('polyline', {
            points: pathPoints.value,
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 2,
          }),
        ],
      )
  },
})
</script>
