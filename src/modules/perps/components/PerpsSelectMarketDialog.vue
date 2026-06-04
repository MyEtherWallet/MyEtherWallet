<template>
  <app-dialog
    v-model:is-open="isOpen"
    class="w-full sm:w-[460px]"
    style="max-height: 60vh"
    :has-content-gutter="false"
    title="Select Perps Market"
  >
    <template #content>
      <div class="flex flex-col">
        <!-- Search + Sort -->
        <div
          class="flex gap-2 justify-between items-center mb-2 mx-4 bg-surface rounded-full p-1"
        >
          <app-search-input
            :model-value="search"
            class="grow"
            bg-class="bg-transparent"
            placeholder="Search"
            @update:model-value="$emit('update:search', $event as string)"
          />
          <app-pop-up-menu location="right">
            <template #menu-button="{ toggleMenu }">
              <button
                class="flex items-center px-4 py-2 text-s-15 font-medium hoverNoBG rounded-full bg-white h-10 shadow-sm whitespace-nowrap justify-center gap-1"
                @click="toggleMenu"
              >
                <span>{{ activeSortLabel }}</span>
                <arrow-long-up-icon
                  v-if="sortDirection === 'asc'"
                  class="w-4 h-4 shrink-0"
                />
                <arrow-long-down-icon v-else class="w-4 h-4 shrink-0" />
              </button>
            </template>
            <template #menu-content="{ toggleMenu }">
              <div class="py-4 flex flex-col w-[200px] gap-1">
                <div class="flex items-center justify-between mb-1 mx-3">
                  <p class="text-s-17 font-medium ml-3">Sort</p>
                  <app-btn-icon-close @close="toggleMenu" />
                </div>
                <hr class="h-px bg-grey-outline border-0 w-full mt-1 mb-2" />
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  class="flex items-center px-4 py-2.5 mx-3 hoverNoBG rounded-16 text-s-15 font-medium"
                  :class="{ 'bg-grey-5': sortValue === option.value }"
                  @click="[$emit('setSort', option.value), toggleMenu()]"
                >
                  {{ option.label }}
                  <component
                    :is="
                      sortValue === option.value && sortDirection === 'asc'
                        ? ArrowLongUpIcon
                        : ArrowLongDownIcon
                    "
                    v-if="sortValue === option.value"
                    class="ml-auto w-5 h-5 text-primary"
                  />
                </button>
              </div>
            </template>
          </app-pop-up-menu>
        </div>

        <!-- Filter Tabs -->
        <div class="px-4 mb-1">
          <app-btn-group
            :btn-list="filterTabs"
            :selected="filterTabs.find(t => t.key === activeFilter)"
            size="small"
            has-full-width
            @on-update:selected="tab => $emit('update:activeFilter', tab.key)"
          >
            <template #btn-content="{ data }">{{ data.label }}</template>
          </app-btn-group>
        </div>
        <hr class="border-t border-grey-5 mt-1 mx-4" />

        <!-- Market List -->
        <div
          class="overflow-y-auto flex-1 px-2 pt-1 mr-1 market-list-scroll min-h-[400px] max-h-[400px]"
        >
          <button
            v-for="contract in contracts"
            :key="contract.market"
            class="flex items-center justify-between w-full px-2 py-3 cursor-pointer hoverNoBG rounded-20 transition-colors animate-fade-in"
            :class="
              contract.market === selectedMarketName
                ? '!bg-mewBg'
                : 'bg-transparent hoverBGWhite'
            "
            :aria-pressed="contract.market === selectedMarketName"
            :aria-label="`${getMarketDisplayName(contract)}${contract.market === selectedMarketName ? ' (selected)' : ''}`"
            @click="$emit('select', contract)"
          >
            <div class="flex justify-between items-center w-full">
              <div class="flex items-center">
                <app-token-logo
                  :url="getLogoUrl(contract.baseCurrency)"
                  :symbol="contract.baseCurrency"
                  class="shrink-0 mr-4"
                />
                <div class="text-left">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-s-15 whitespace-nowrap">{{
                      contract.baseCurrency
                    }}</span>
                    <span
                      class="shrink-0 bg-surface text-info font-bold rounded px-[6px] py-[1px] text-s-9"
                      >{{ getMarketLeverage(contract) }}x</span
                    >
                  </div>
                  <span class="text-info text-s-12">{{
                    getMarketDisplayName(contract)
                  }}</span>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-s-15">
                  {{ formatContractPrice(contract) }}
                </p>
                <p
                  class="text-s-12 font-medium"
                  :class="
                    parseFloat(contract.priceChangePercent ?? '0') >= 0
                      ? 'text-success'
                      : 'text-error'
                  "
                >
                  {{ formatPriceChange(contract.priceChangePercent) }}
                </p>
              </div>
            </div>
          </button>
          <div
            v-if="contracts.length === 0"
            class="text-center py-8 text-info text-s-14"
          >
            No markets found
          </div>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { ArrowLongUpIcon, ArrowLongDownIcon } from '@heroicons/vue/24/solid'
import AppDialog from '@/components/AppDialog.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppBtnIconClose from '@/components/AppBtnIconClose.vue'
import { getLogoUrl } from '../utils/market'
import { formatContractPrice, formatPriceChange } from '../utils/formatters'
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
    type: Array as PropType<{ key: string; label: string }[]>,
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
  getMarketLeverage: {
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

const activeSortLabel = computed(
  () =>
    props.sortOptions.find(o => o.value === props.sortValue)?.label ?? 'Sort',
)
</script>
