<template>
  <div v-if="isWalletConnected" class="flex flex-col w-full">
    <div
      class="flex flex-col xs:flex-row flex-wrap justify-between sm:items-center gap-4 mt-8 mb-6 px-2"
    >
      <h1 class="text-s-24 xs:text-s-32 font-bold">
        {{ $t('portfolio.your_balances') }}
      </h1>
      <!--Filter Lists-->
      <div class="hidden lg:flex lg:items-center bg-grey-5 rounded-full">
        <app-segmented-control
          v-model:selected="selectedCryptoFilter"
          :btn-list="allTokensFilterOptions"
          size="large"
          class="flex-wrap"
        >
          <template #btn-content="{ data }">
            <span class="px-2">{{ $t(data.label) }}</span>
          </template>
        </app-segmented-control>
      </div>
      <app-select
        v-model:selected="selectedCryptoFilter"
        :options="allTokensFilterOptions"
        position="right-0"
        :placeholder="$t('portfolio.balance_menu')"
        class="lg:hidden"
      >
        <template #select-button="{ toggleSelect }">
          <div class="bg-surface rounded-full p-1 w-full xs:w-auto">
            <button
              class="rounded-full bg-white py-3 w-full xs:w-auto min-w-[180px] px-5 shadow-button"
              @click="toggleSelect"
            >
              <div class="flex items-center justify-between">
                <span class="text-s-16 font-medium">{{
                  $t(selectedCryptoFilter.label)
                }}</span>
                <chevron-down-icon class="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
        </template>
      </app-select>
    </div>

    <app-sheet :is-elivated="false" sheet-class="py-4 !px-2 min-h-[200px] ">
      <table-token-balance
        v-if="showTableTokens"
        :view="selectedCryptoFilter.value"
      />
      <div v-else class="text-center my-10">{{ $t('common.coming_soon') }}</div>
    </app-sheet>
  </div>
</template>

<script lang="ts" setup>
import TableTokenBalance from './components/balances/TableTokenBalance.vue'
import AppSegmentedControl from '@/components/AppSegmentedControl.vue'
import { computed, ref, watch } from 'vue'
import AppSheet from '@/components/AppSheet.vue'
import AppSelect from '@/components/AppSelect.vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { BALANCE_FILTER, type BalanceFilterOption } from './helpers'
import { useChainsStore } from '@/stores/chainsStore'

const chainStore = useChainsStore()
const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)
const { isBitcoinChain } = storeToRefs(chainStore)

const allTokensFilterOptions = computed(() => {
  const filter = BALANCE_FILTER
  //remove custom option for bitcoin chain
  if (isBitcoinChain.value) {
    return filter.filter(option => option.value !== 'custom')
  }

  return filter
})

const selectedCryptoFilter = ref<BalanceFilterOption>(
  allTokensFilterOptions.value[0],
)

const showTableTokens = computed(() => {
  return (
    selectedCryptoFilter.value.value === 'all' ||
    selectedCryptoFilter.value.value === 'watchlist' ||
    selectedCryptoFilter.value.value === 'custom' ||
    selectedCryptoFilter.value.value === 'stocks'
  )
})

watch(isBitcoinChain, (newVal: boolean) => {
  if (newVal && selectedCryptoFilter.value.value === 'custom') {
    selectedCryptoFilter.value = allTokensFilterOptions.value[0]
  }
})
</script>
