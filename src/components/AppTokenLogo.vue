<template>
  <div
    :class="[
      width,
      height,
      'rounded-full flex-none relative box-border transition-colors duration-300 ease-in-out',
      showIsStock ? 'p-[1.2px]  bg-stock-gradient' : 'border border-grey-5',
    ]"
  >
    <div
      class="w-full h-full rounded-full overflow-hidden relative flex items-center justify-center"
      :class="[
        {
          'bg-white shadow-token': image && !isLoading,
        },
        { 'bg-surface': !image || isLoading },
        { 'animate-pulse': isLoading },
      ]"
    >
      <div
        v-if="!image && !isLoading"
        class="absolute inset-0 flex items-center justify-center"
      >
        <span
          :class="['text-info font-medium uppercase leading-none', getTextSize]"
        >
          {{ getSymbol() }}
        </span>
      </div>
      <img
        v-else-if="image && !isLoading"
        class="object-contain w-full h-full"
        :src="image"
        width="28"
        height="28"
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, type PropType } from 'vue'
import { useStocksStore } from '@/stores/stocksStore'
import { storeToRefs } from 'pinia'

interface TokenAddress {
  address: string
  network: string
}

const props = defineProps({
  url: {
    type: [String, null],
    required: false,
  },
  symbol: {
    type: String,
    required: false,
  },
  width: {
    type: String,
    default: 'w-6 xs:w-8',
  },
  height: {
    type: String,
    default: 'h-6 xs:h-8',
  },
  isStock: {
    type: Boolean,
    default: false,
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

const getSymbol = (): string => {
  if (props.symbol) {
    return props.symbol.substring(0, 2)
  }
  return 'MN'
}

const isLoading = ref<boolean>(true)
const image = ref<string | null>(null)

const resolveImage = () => {
  if (props.url) {
    const img = new Image()
    img.src = props.url
    img.onload = () => {
      isLoading.value = false
      image.value = props.url || null
    }
    img.onerror = () => {
      isLoading.value = false
      image.value = null
    }
  } else {
    isLoading.value = false
    image.value = null
  }
}
onMounted(() => {
  resolveImage()
})

watch(
  () => props.url,
  () => {
    isLoading.value = true
    resolveImage()
  },
)

const getTextSize = computed(() => {
  if (props.width === 'w-8') {
    return 'text-s-12'
  } else {
    return 'text-[10px]'
  }
})
</script>
