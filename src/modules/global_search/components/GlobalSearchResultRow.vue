<template>
  <button
    type="button"
    class="flex w-full items-center gap-3 px-4 py-2 hover:bg-mewBg rounded-12 text-left transition-colors"
    @click="$emit('select', item)"
  >
    <img
      v-if="item.icon"
      :src="item.icon"
      :alt="item.symbol"
      class="w-8 h-8 rounded-full flex-none object-contain"
    />
    <div v-else class="w-8 h-8 rounded-full bg-surface flex-none" />
    <div class="flex-1 min-w-0">
      <div class="font-semibold text-s-14 truncate uppercase">
        {{ item.symbol }}
        <span v-if="item.isStock" class="text-info font-normal lowercase">on</span>
      </div>
      <div class="text-s-12 text-info truncate">{{ item.name }}</div>
    </div>
    <div class="text-right flex-none">
      <div class="font-semibold text-s-14">
        {{ item.priceUsd !== null ? formatUsd(item.priceUsd) : '—' }}
      </div>
      <div
        v-if="item.change24hPct !== null"
        class="text-s-12"
        :class="item.change24hPct >= 0 ? 'text-success' : 'text-error'"
      >
        {{ item.change24hPct >= 0 ? '+' : '' }}{{ item.change24hPct.toFixed(2) }}%
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { SearchResultItem } from '../types'

defineProps<{ item: SearchResultItem }>()
defineEmits<{ select: [item: SearchResultItem] }>()

const formatUsd = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    // Widen precision for sub-dollar magnitudes so sub-penny tokens don't render as $0.00.
    maximumFractionDigits: n !== 0 && Math.abs(n) < 1 ? 6 : 2,
  })
</script>
