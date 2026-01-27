<template>
  <div class="flex-1 min-w-[140px] max-w-[200px]">
    <div
      v-for="(i, index) in tokens"
      :key="i.symbol"
      class="flex items-center last:mb-0 w-full justify-between py-1.5"
    >
      <div class="flex items-center gap-2 uppercase overflow-hidden">
        <div
          class="h-2.5 w-2.5 rounded-full shrink-0"
          :style="{ backgroundColor: getBGColor(index) }"
        ></div>
        <app-tooltip :text="i.name">
          <router-link
            v-if="i.id"
            :to="getTokenRouteParams(i)"
            class="text-s-14 font-medium truncate hover:text-primary transition-colors block max-w-[80px]"
            >{{ truncate(i.symbol, 10) }}</router-link
          >
          <p v-else class="text-s-14 font-medium truncate block max-w-[80px]">
            {{ truncate(i.symbol, 10) }}
          </p>
        </app-tooltip>
      </div>
      <p
        class="px-2.5 py-0.5 leading-tight text-s-11 font-bold rounded-full bg-grey-5 text-info"
      >
        {{ i.formattedPercentage }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { type PropType } from 'vue'
import { truncate } from '@/utils/filters'
import AppTooltip from '@/components/AppTooltip.vue'
import {
  type TokenAllocation,
  ALLOCATION_COLORS,
} from '@/modules/portfolio/types'
import {
  TOKEN_INFO_ROUTE_NAMES,
  STOCK_INFO_ROUTE_NAMES,
} from '@/router/routeNames'
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

const getTokenRouteParams = (token: TokenAllocation) => {
  if (token.stock_route) {
    return {
      name: STOCK_INFO_ROUTE_NAMES.home,
      params: { symbol: token.stock_route },
    }
  }
  return {
    name: TOKEN_INFO_ROUTE_NAMES.home,
    params: { tokenId: token.id || token.symbol },
  }
}
</script>
