<template>
  <app-token-selector-modal
    v-model="isOpen"
    :search="search"
    :title="$t('perps.select-market.title')"
    :items="items"
    :selected-id="selectedMarketName"
    :sort-options="sortOptions"
    :sort-value="sortValue"
    :sort-direction="sortDirection"
    @update:search="$emit('update:search', $event)"
    @sort="$emit('setSort', $event as MarketSortValue)"
    @select="$emit('select', $event.raw as Contract)"
  >
    <!-- Category filter: not in Figma 12526:110395, kept so the list stays filterable -->
    <template #filters>
      <AppSegmentedControl
        :model-value="activeFilter"
        :items="filterTabs"
        size="small"
        :label="$t('perps.info.category-label')"
        full-width
        @update:model-value="$emit('update:activeFilter', $event)"
      />
    </template>
  </app-token-selector-modal>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import AppTokenSelectorModal from '@/components/token_selector/AppTokenSelectorModal.vue'
import AppSegmentedControl from '@components/segmented_control/AppSegmentedControl.vue'
import { tokenRowAccessory } from '@/components/token_selector/tokenSelector'
import type { TokenSelectorItem } from '@/components/token_selector/types'
import { getLogoUrl } from '../utils/market'
import { formatContractPrice } from '../utils/formatters'
import type { Contract } from '../sdk/types'
import type {
  MarketSortValue,
  SortDirection,
  MarketSortOption,
} from '../composables/usePerpsTradeForm'

const props = defineProps({
  contracts: {
    type: Array as PropType<Contract[]>,
    required: true,
  },
  filterTabs: {
    type: Array as PropType<{ value: string; label: string }[]>,
    required: true,
  },
  activeFilter: {
    type: String,
    required: true,
  },
  search: {
    type: String,
    required: true,
  },
  sortValue: {
    type: String as PropType<MarketSortValue>,
    required: true,
  },
  sortDirection: {
    type: String as PropType<SortDirection>,
    required: true,
  },
  sortOptions: {
    type: Array as PropType<MarketSortOption[]>,
    required: true,
  },
  selectedMarketName: {
    type: String,
    default: '',
  },
  getMarketDisplayName: {
    type: Function as PropType<(contract: Contract) => string>,
    required: true,
  },
})

const isOpen = defineModel('isOpen', {
  type: Boolean,
  required: true,
})

defineEmits<{
  'update:activeFilter': [value: string]
  'update:search': [value: string]
  setSort: [value: MarketSortValue]
  select: [contract: Contract]
}>()

// The composable already filters and sorts; rows only need the price and
// its 24h change (a percent string from the API).
const items = computed<TokenSelectorItem<Contract>[]>(() =>
  props.contracts.map(contract => ({
    id: contract.market,
    symbol: contract.baseCurrency,
    name: props.getMarketDisplayName(contract),
    logo: getLogoUrl(contract.baseCurrency),
    rightAccessory: tokenRowAccessory({
      price: formatContractPrice(contract),
      change: contract.priceChangePercent
        ? parseFloat(contract.priceChangePercent)
        : undefined,
    }),
    raw: contract,
  })),
)
</script>
