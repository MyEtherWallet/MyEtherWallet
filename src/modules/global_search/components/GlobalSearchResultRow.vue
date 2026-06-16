<template>
  <button
    type="button"
    class="flex w-full items-center gap-3 px-3 py-2 hover:bg-[#f5f5f5] rounded-12 text-left transition-colors"
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
      <div class="flex items-center">
        <span class="font-semibold text-s-16 truncate uppercase tracking-tight text-black">
          {{ item.symbol }}
        </span>
        <span
          v-if="item.isStock"
          class="font-semibold text-s-16 tracking-tight"
          style="background: linear-gradient(90deg, #40E0D0, #55DA82, #7ED06D, #AAC137, #D5AB00, #FF8C00, #FF8C00, #FF7526, #FF5D3D); -webkit-background-clip: text; -webkit-text-fill-color: transparent"
        >on</span>
      </div>
      <div class="text-s-12 text-[#575757] truncate">{{ item.name }}</div>
    </div>
    <div class="text-right flex-none">
      <div class="text-s-14 text-black">
        {{ item.priceUsd !== null ? formatUsd(item.priceUsd) : '—' }}
      </div>
      <div
        v-if="item.change24hPct !== null"
        class="text-s-12 font-semibold tracking-tight"
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
    maximumFractionDigits: n !== 0 && Math.abs(n) < 1 ? 6 : 2,
  })
</script>
