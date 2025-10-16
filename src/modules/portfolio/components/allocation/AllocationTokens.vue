<template>
  <div class="w-[180px]">
    <div
      v-for="(i, index) in tokens"
      :key="i.symbol"
      class="flex items-center gap-2 last:mb-0 w-full justify-between text-s-14"
    >
      <div class="flex items-center gap-2 text-s-14 uppercase">
        <div
          class="h-3 w-3 rounded-full"
          :style="{ backgroundColor: getBGColor(index) }"
        ></div>
        <router-link
          v-if="i.id"
          :to="{
            name: TOKEN_INFO_ROUTE_NAMES.home,
            params: { tokenId: i.id },
          }"
          class="p-1"
          >{{ truncate(i.symbol, 7) }}</router-link
        >
        <p v-else class="p-1">
          {{ truncate(i.symbol, 7) }}
        </p>
      </div>
      <p class="px-2 leading-p-160 text-s-12 rounded-full bg-mewBg">
        {{ i.formattedPercentage }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { type PropType } from 'vue'
import { truncate } from '@/utils/filters'
import {
  type TokenAllocation,
  ALLOCATION_COLORS,
} from '@/modules/portfolio/types'
import { TOKEN_INFO_ROUTE_NAMES } from '@/router/routeNames'
defineProps({
  /**
   * @title The title of the dialog, not required
   * @type string | undefined
   */
  tokens: {
    default: () => [],
    type: Array as PropType<TokenAllocation[]>,
  },
  isLoading: {
    type: Boolean,
    default: true,
  },
})

const getBGColor = (index: number) => {
  return index > ALLOCATION_COLORS.length - 1
    ? ALLOCATION_COLORS[ALLOCATION_COLORS.length - 1]
    : ALLOCATION_COLORS[index]
}
</script>
