<template>
  <div>
    <p
      v-if="!showIsStock || !getStockSymbol"
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
import { computed, type PropType } from 'vue'
import { useStocksStore } from '@/stores/stocksStore'
import { storeToRefs } from 'pinia'

interface TokenAddress {
  address: string
  network: string
}

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
  address: {
    type: Object as PropType<TokenAddress>,
    required: false,
  },
})

const stocksStore = useStocksStore()
const { hasStocksAddressesData } = storeToRefs(stocksStore)

const showIsStock = computed(() => {
  if (props.isStock) return true
  if (props.address && hasStocksAddressesData.value) {
    return stocksStore.isStock(props.address.address, props.address.network)
  }
  return false
})

const getStockSymbol = computed<string | undefined>(() => {
  if (showIsStock.value) {
    let symbol = props.symbol.toLowerCase()
    if (symbol.endsWith('on')) {
      symbol = symbol.slice(0, -2)
    }
    return symbol
  }
  return undefined
})
</script>
