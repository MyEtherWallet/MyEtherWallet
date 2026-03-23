<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <p class="font-bold text-s-28">Markets</p>
      <div class="flex bg-surface rounded-full p-1">
        <button
          v-for="filter in filters"
          :key="filter.key"
          :class="[
            'px-4 py-1.5 rounded-full text-s-13 font-bold transition-colors',
            activeFilter === filter.key
              ? 'bg-white shadow-container'
              : 'hoverNoBG',
          ]"
          @click="activeFilter = filter.key"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-20 p-6 sm:p-8">
      <!-- Search -->
      <div class="mb-4">
        <div
          class="flex items-center gap-2 border border-grey-10 rounded-full px-4 py-2.5 max-w-md"
        >
          <MagnifyingGlassIcon class="w-5 h-5 text-info" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="w-full bg-transparent text-s-14 outline-none placeholder:text-info"
          />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="contractsLoading" class="text-center py-8 text-info text-s-14">
        Loading markets...
      </div>

      <!-- Error -->
      <div
        v-else-if="contractsError"
        class="text-center py-8 text-error text-s-14"
      >
        {{ contractsError }}
      </div>

      <!-- Markets table -->
      <div v-else class="overflow-x-auto -mx-6 sm:-mx-8">
        <table class="w-full text-s-14 min-w-[800px]">
          <thead>
            <tr class="text-info uppercase text-s-11 tracking-wider">
              <th class="px-6 sm:px-8 py-3 text-left font-medium">Name</th>
              <th class="px-3 py-3 text-right font-medium">Price</th>
              <th class="px-3 py-3 text-center font-medium">24H</th>
              <th class="px-3 py-3 text-right font-medium">Volume</th>
              <th class="px-3 py-3 text-right font-medium">Market Cap</th>
              <th class="px-6 sm:px-8 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="contract in filteredContracts"
              :key="contract.market"
              class="cursor-pointer hover:bg-surface/50 transition-colors"
              @click="$emit('openPosition', contract.market)"
            >
              <td class="px-6 sm:px-8 py-4">
                <div class="flex items-center gap-3">
                  <button
                    class="text-grey-30 hover:text-gold transition-colors"
                    @click.stop="toggleWatchlist(contract.baseCurrency)"
                  >
                    <StarIcon
                      :class="[
                        'w-5 h-5',
                        watchlist.has(contract.baseCurrency)
                          ? 'fill-gold text-gold'
                          : '',
                      ]"
                    />
                  </button>
                  <img
                    :src="getLogoUrl(contract.baseCurrency)"
                    :alt="contract.baseCurrency"
                    class="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold">{{ contract.baseCurrency }}</span>
                      <span
                        class="bg-surface text-info rounded px-1.5 py-0.5 text-s-11 font-medium"
                      >
                        20x
                      </span>
                    </div>
                    <span class="text-info text-s-12">{{
                      contract.displayName
                    }}</span>
                  </div>
                </div>
              </td>
              <td class="px-3 py-4 text-right font-bold">
                {{ formatPrice(midPrice(contract)) }}
              </td>
              <td class="px-3 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <table-sparkline
                    v-if="contract.sparkline?.price.length"
                    :points="contract.sparkline.price.map(Number)"
                    :percent-change="
                      parseFloat(contract.priceChangePercent ?? '0')
                    "
                    :width="80"
                    :height="28"
                  />
                  <span
                    :class="[
                      parseFloat(contract.priceChangePercent ?? '0') >= 0
                        ? 'text-success'
                        : 'text-error',
                      'text-s-12 font-medium',
                    ]"
                  >
                    {{ formatChange(contract.priceChangePercent) }}
                  </span>
                </div>
              </td>
              <td class="px-3 py-4 text-right font-bold">
                {{ formatVolume(contract.usdVolume) }}
              </td>
              <td class="px-3 py-4 text-right font-bold">
                {{ formatVolume(contract.openInterestUsd) }}
              </td>
              <td class="px-6 sm:px-8 py-4 text-right">
                <button
                  v-if="getPosition(contract.market)"
                  class="rounded-full px-4 py-1.5 text-s-12 font-medium hoverOpacity text-white"
                  :class="
                    getPosition(contract.market)!.direction === 'long'
                      ? 'bg-success'
                      : 'bg-error'
                  "
                  @click="$emit('openPosition', contract.market)"
                >
                  Manage
                  {{
                    getPosition(contract.market)!.direction === 'long'
                      ? 'Long'
                      : 'Short'
                  }}
                </button>
                <div v-else class="flex gap-2 justify-end">
                  <button
                    class="bg-success text-white rounded-full px-4 py-1.5 text-s-12 font-medium hoverOpacity"
                    @click.stop="$emit('openPosition', contract.market, 'buy')"
                  >
                    Long
                  </button>
                  <button
                    class="bg-error text-white rounded-full px-4 py-1.5 text-s-12 font-medium hoverOpacity"
                    @click.stop="$emit('openPosition', contract.market, 'sell')"
                  >
                    Short
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MagnifyingGlassIcon, StarIcon } from '@heroicons/vue/24/outline'
import TableSparkline from '@/components/TableSparkline.vue'
import {
  usePerpsMarkets,
  usePerpsContracts,
} from '../composables/usePerpsMarkets'
import type { Contract, TradingPair } from '../sdk/types'
import { formatPrice, formatPercent, formatVolume } from '../utils/formatters'
import { getLogoUrl, midPrice, hasTag } from '../utils/market'
import { usePerpsPositions } from '../composables/usePerpsPositions'

defineEmits<{
  openPosition: [market: string, side?: 'buy' | 'sell']
}>()

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

const searchQuery = ref('')
const activeFilter = ref<string>('all')
const watchlist = ref<Set<string>>(new Set())

function toggleWatchlist(symbol: string) {
  if (watchlist.value.has(symbol)) {
    watchlist.value.delete(symbol)
  } else {
    watchlist.value.add(symbol)
  }
  watchlist.value = new Set(watchlist.value)
}

const filters = [
  { key: 'all', label: 'All Markets' },
  { key: 'stocks', label: 'Stocks' },
  { key: 'commodities', label: 'Commodities' },
  { key: 'etfs', label: 'ETFs' },
  { key: 'watchlist', label: 'Watchlist' },
]

interface EnrichedContract extends Contract {
  displayName: string
}

const enrichedContracts = computed<EnrichedContract[]>(() => {
  const marketMap = new Map<string, TradingPair>()
  for (const m of markets.value) {
    marketMap.set(m.market, m)
  }
  return contracts.value.map(c => ({
    ...c,
    displayName: marketMap.get(c.market)?.displayName ?? c.baseCurrency,
  }))
})

const filteredContracts = computed(() => {
  let list = enrichedContracts.value

  if (activeFilter.value === 'watchlist') {
    list = list.filter(c => watchlist.value.has(c.baseCurrency))
  } else if (activeFilter.value === 'commodities') {
    list = list.filter(c => hasTag(c, 'commodity'))
  } else if (activeFilter.value === 'etfs') {
    list = list.filter(c => hasTag(c, 'etf'))
  } else if (activeFilter.value === 'stocks') {
    list = list.filter(c => !hasTag(c, 'commodity') && !hasTag(c, 'etf'))
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      c =>
        c.baseCurrency.toLowerCase().includes(q) ||
        c.market.toLowerCase().includes(q) ||
        c.displayName.toLowerCase().includes(q),
    )
  }

  return list
})

function formatChange(pct?: string): string {
  if (!pct) return '—'
  return formatPercent(parseFloat(pct))
}
</script>
