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
        class="!text-s-16 font-semibold tracking-tight text-fg"
      />
      <div class="text-s-12 text-fg-muted truncate">{{ item.name }}</div>
    </div>
    <div class="text-right flex-none">
      <div class="text-s-14 text-fg">
        {{ item.priceUsd !== null ? formatFiat(item.priceUsd).display : '—' }}
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
import { useCurrency } from '@/composables/useCurrency'
import type { SearchResultItem } from '../types'

defineProps<{ item: SearchResultItem }>()
defineEmits<{ select: [item: SearchResultItem] }>()

const { formatFiat } = useCurrency()
</script>
