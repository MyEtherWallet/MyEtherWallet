<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { StarIcon as StarSolidIcon } from '@heroicons/vue/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/vue/24/outline'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import type { AssetPickerItem } from '@/modules/home/composables/useAssetPicker'

const props = defineProps<{ item: AssetPickerItem }>()

const watchlistStore = useWatchlistStore()
const { watchListedTokens, watchListedStocks, watchListedPerps } =
  storeToRefs(watchlistStore)

const isListed = computed(() => {
  if (props.item.type === 'perp')
    return watchListedPerps.value.includes(props.item.watchlistId)
  if (props.item.type === 'stock')
    return watchListedStocks.value.includes(props.item.watchlistId)
  return watchListedTokens.value.includes(props.item.watchlistId)
})

const toggle = () => {
  if (props.item.type === 'perp') {
    watchlistStore.setWatchlistPerp(props.item.watchlistId)
  } else {
    watchlistStore.setWatchlistItem(
      props.item.watchlistId,
      props.item.type === 'stock',
    )
  }
}
</script>

<template>
  <div data-test="asset-picker-row" class="flex items-center gap-3 py-3">
    <AppTokenLogo
      :url="item.logoUrl"
      :symbol="item.symbol"
      :is-stock="item.type === 'stock'"
      width="w-10"
      height="h-10"
    />
    <div class="min-w-0 flex-1">
      <AppTokenSymbol
        :symbol="item.symbol"
        :is-stock="item.type === 'stock'"
        class="block truncate text-s-16 font-bold text-black"
      />
      <span class="block truncate text-s-14 text-[#575757]">
        {{ item.name }}
      </span>
    </div>
    <button
      type="button"
      data-test="picker-star"
      :aria-pressed="isListed"
      class="shrink-0"
      @click="toggle"
    >
      <StarSolidIcon v-if="isListed" class="size-6 text-primary" />
      <StarOutlineIcon v-else class="size-6 text-[#a5a5a5]" />
    </button>
  </div>
</template>
