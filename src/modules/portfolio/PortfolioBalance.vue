<template>
  <div v-if="isWalletConnected" class="flex flex-col w-full">
    <div
      class="flex flex-col xs:flex-row flex-wrap justify-between sm:items-center gap-4 mt-8 mb-6 px-2"
    >
      <h1 class="text-s-24 xs:text-s-32 font-bold">Your Balances</h1>
      <!--Filter Lists-->
      <div class="hidden lg:flex lg:items-center bg-grey-5 p-1 rounded-full">
        <app-btn-group
          v-model:selected="selectedCryptoFilter"
          :btn-list="cryptoFilterOptions"
          size="medium"
          class="flex-nowrap"
        >
          <template #btn-content="{ data }">
            <span class="px-2">{{ data.label }}</span>
          </template>
        </app-btn-group>
      </div>
      <app-select
        v-model:selected="selectedCryptoFilter"
        :options="cryptoFilterOptions"
        position="right-0"
        placeholder="Balance Menu"
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
                  selectedCryptoFilter.label
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
        v-if="selectedCryptoFilter.value === 'all'"
        view="all"
      />
      <div v-else class="text-center my-10">Coming soon</div>
    </app-sheet>
  </div>
</template>

<script lang="ts" setup>
import TableTokenBalance from './components/balances/TableTokenBalance.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import { ref } from 'vue'
import AppSheet from '@/components/AppSheet.vue'
import AppSelect from '@/components/AppSelect.vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'

const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)
const cryptoFilterOptions = ref([
  { label: 'All Tokens', value: 'all' },
  { label: 'Stocks', value: 'stocks' },
  { label: 'Earning Interest', value: 'earning' },
  { label: 'NFTS', value: 'nfts' },
])

const selectedCryptoFilter = ref(cryptoFilterOptions.value[0])
</script>
