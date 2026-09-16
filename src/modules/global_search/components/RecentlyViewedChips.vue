<template>
  <div v-if="recentlyViewedTop6.length">
    <div class="px-3">
      <p class="text-s-14 text-black mb-4">
        {{ $t('search.opened_recently') }}
      </p>
      <!-- Design-library Chips ("recent search items"). The popover is white,
           so the chips take the grey `alternative` fill. -->
      <div class="flex flex-wrap items-start gap-2">
        <app-chip
          v-for="item in recentlyViewedTop6"
          :key="item.id"
          surface="alternative"
          :label="displaySymbol(item)"
          @click="selectAsset(item, true)"
        >
          <template #avatar="{ size }">
            <app-avatar
              :type="item.isStock ? 'stocks' : 'cryptoAsset'"
              :size="size"
              :url="item.icon"
              :symbol="item.symbol"
            />
          </template>
        </app-chip>
      </div>
    </div>
    <div class="h-px bg-grey-5 mt-4 mb-2" />
  </div>
</template>

<script setup lang="ts">
import AppChip from '@/components/chip/AppChip.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import { truncate } from '@/utils/filters'
import type { SearchResultItem } from '../types'
import { useGlobalSearch } from '../composables/useGlobalSearch'

const { recentlyViewedTop6, selectAsset } = useGlobalSearch()

// Same text AppTokenSymbol rendered here before the Chip migration: stock
// tickers drop their "on" suffix and get it back lowercased ("AAPLon"),
// everything else is the uppercased symbol clipped to 7 chars.
const displaySymbol = (item: SearchResultItem): string => {
  if (item.isStock) {
    const base = item.symbol.toLowerCase().replace(/on$/, '')
    return `${base.toUpperCase()}on`
  }
  return truncate(item.symbol, 7).toUpperCase()
}
</script>
