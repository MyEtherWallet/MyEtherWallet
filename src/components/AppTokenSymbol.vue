<template>
  <div>
    <p
      v-if="!isStock || !getStockSymbol"
      class="uppercase font-medium truncate text-s-15"
      :class="$attrs.class"
    >
      {{ truncate(symbol, 7) }}
    </p>
    <p
      v-else
      class="uppercase font-medium truncate text-s-15"
      :class="$attrs.class"
    >
      {{ getStockSymbol
      }}<span
        :class="[
          { 'bg-stock-gradient text-transparent bg-clip-text': hasGradient },
          ' lowercase',
        ]"
        >on</span
      >
    </p>
  </div>
</template>
<script setup lang="ts">
import { truncate } from '@/utils/filters'
import { computed } from 'vue'
const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
  isStock: {
    type: Boolean,
    default: false,
  },
  hasGradient: {
    type: Boolean,
    default: true,
  },
})

const getStockSymbol = computed<string | undefined>(() => {
  if (props.isStock) {
    let symbol = props.symbol.toLowerCase()
    if (symbol.endsWith('on')) {
      symbol = symbol.slice(0, -2)
    }
    return symbol
  }
  return undefined
})
</script>
