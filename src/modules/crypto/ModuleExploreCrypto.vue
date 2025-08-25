<template>
  <div class="flex items-center justify-between gap-3">
    <h2 class="text-s-24">Explore Crypto Tokens</h2>
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

  <div
    class="flex grow gap-4 justify-between items-center bg-surface rounded-full p-1"
  >
    <app-search-input v-model="searchInput" class="grow" />
    <app-select
      v-model:selected="activeSort"
      :options="sortOptions"
      placeholder="Sort"
    />
  </div>

  <div class="relative bg-white shadow-sm rounded-2xl p-2">
    <div class="overflow-x-auto">
      <table class="w-full text-sm table-fixed">
        <thead>
          <tr class="text-left">
            <th class="px-1 py-2 w-6"></th>
            <th class="w-4 cursor-pointer">#</th>
            <th class="px-1 py-2 cursor-pointer">Name</th>
            <th class="px-1 py-2 cursor-pointer">Price</th>
            <th class="px-1 py-2 cursor-pointer">24h</th>
            <th class="px-1 py-2 cursor-pointer">Market Cap</th>
            <th class="px-1 py-2 cursor-pointer w-[130px] text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(token, index) in filteredTokens" :key="token.symbol">
            <td class="px-1 py-2">
              <star-outline-icon class="h-4 w-4 cursor-pointer" />
              <star-solid-icon class="h-4 w-4" v-if="false" />
            </td>
            <td class="px-1 py-2">{{ index + 1 }}.</td>
            <td class="px-1 py-2">
              <img
                :src="token.icon"
                alt="favorite"
                class="inline-block h-5 w-5 mr-1 rounded-full"
              />
              {{ token.name }}
            </td>
            <td class="px-1 py-2">{{ token.price }}</td>
            <td class="px-1 py-2">{{ token.changeNum }}%</td>
            <td class="px-1 py-2">{{ token.mcap }}</td>
            <td class="px-1 py-2 text-center">
              <app-base-button size="small" class="mr-1">Buy</app-base-button>
              <app-base-button size="small">Swap</app-base-button>
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
import { computed, ref } from 'vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { StarIcon as StarOutlineIcon } from '@heroicons/vue/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/vue/24/solid'
const searchInput = ref('')
const sortOptions = [
  { label: 'Market Cap', value: 'market_cap' },
  { label: '24h Volume', value: '24h_volume' },
  { label: 'Price', value: 'price' },
  { label: 'Change (24h)', value: 'change_24h' },
]
const activeSort = ref(sortOptions[0])

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
    icon: 'https://dummyimage.com/24x24/f7931a/000&text=B',
    spark: [1, 2, 2.4, 2.2, 2.5, 2.7, 2.9],
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$3,497',
    changeNum: 7.64,
    mcap: '$419B',
    icon: 'https://dummyimage.com/24x24/62688f/fff&text=Ξ',
    spark: [1, 1.1, 1.2, 1.15, 1.3, 1.4, 1.6],
  },
  {
    name: 'XRP',
    symbol: 'XRP',
    price: '$0.62',
    changeNum: -0.85,
    mcap: '$34B',
    icon: 'https://dummyimage.com/24x24/000/fff&text=X',
    spark: [1, 0.95, 0.9, 0.92, 0.88, 0.9, 0.93],
  },
  {
    name: 'Tether',
    symbol: 'USDT',
    price: '$1.00',
    changeNum: 0.02,
    mcap: '$112B',
    icon: 'https://dummyimage.com/24x24/26a17b/fff&text=T',
    spark: [1, 1, 1, 1, 1, 1, 1],
  },
  {
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: '$0.14',
    changeNum: 2.26,
    mcap: '$20B',
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

// function pct(n: number): string {
//   return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'
// }
// function signed(n: number): string {
//   return (n >= 0 ? '+' : '') + n.toFixed(2)
// }

// // ----------------------
// // Sparkline component (typed, no JSX requirement)
// // ----------------------
// const Sparkline = defineComponent({
//   name: 'spark-line',
//   props: {
//     points: { type: Array as PropType<number[]>, required: true },
//     width: { type: Number, default: 96 },
//     height: { type: Number, default: 28 },
//   },
//   setup(props) {
//     const pathPoints = computed(() => {
//       const pts = props.points
//       const w = props.width
//       const h = props.height
//       const max = Math.max(...pts)
//       const min = Math.min(...pts)
//       const norm = (v: number) => h - ((v - min) / (max - min || 1)) * h
//       return pts
//         .map((v, i) => `${(i / (pts.length - 1)) * w},${norm(v)}`)
//         .join(' ')
//     })

//     return () =>
//       h(
//         'svg',
//         {
//           width: props.width,
//           height: props.height,
//           viewBox: `0 0 ${props.width} ${props.height}`,
//           class: 'block',
//         },
//         [
//           h('polyline', {
//             points: pathPoints.value,
//             fill: 'none',
//             stroke: 'currentColor',
//             'stroke-width': 2,
//           }),
//         ],
//       )
//   },
// })
</script>
