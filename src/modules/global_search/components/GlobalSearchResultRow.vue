<template>
  <button
    type="button"
    class="flex w-full items-center gap-3 px-3 py-2 hover:bg-surface-hover rounded-12 text-left transition-colors"
    @click="$emit('select', item)"
  >
    <app-token-logo
      :url="item.icon"
      :symbol="item.symbol"
      :is-stock="item.isStock"
      width="w-8"
      height="h-8"
    />
    <div class="flex-1 min-w-0">
      <app-token-symbol
        :symbol="item.symbol"
        :is-stock="item.isStock"
        class="!text-s-16 font-semibold tracking-tight text-black"
      />
      <div class="text-s-12 text-grey-subtle truncate">{{ item.name }}</div>
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
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
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
