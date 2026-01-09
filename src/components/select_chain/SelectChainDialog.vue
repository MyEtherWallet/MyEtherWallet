<template>
  <!-- Dialog with chains list -->
  <app-dialog
    v-if="isLoadedChains"
    v-model:is-open="openDialog"
    class="w-full sm:w-[460px] sm:mx-auto"
    z-index-overlay="z-[200]"
    z-index-container="z-[201]"
    has-content-gutter
    persistent
  >
    <template #title>
      <div
        class="relative w-full pt-10 pb-0 flex justify-center bg-white z-[21]"
      >
        <h1 class="text-s-28 font-bold text-black text-center" id="dialogTitle">
          Select Chain
        </h1>
        <app-btn-icon-close
          @close="setOpenDialog(false)"
          class="absolute top-4 right-0"
        />
      </div>
    </template>
    <template #content>
      <div class="max-h-[70vh] sm:max-h-[500px] mb-6">
        <!-- Search -->
        <div class="sticky -top-2 bg-white z-20 pt-4 pb-1">
          <div class="flex items-center mb-4 bg-[#EFF4FF] rounded-full p-1">
            <app-search-input
              v-model="searchInput"
              class="grow"
              placeholder="Search by Name"
              bg-class="bg-transparent"
            />
          </div>
          <div class="h-px bg-grey-outline w-full mb-4"></div>
        </div>
        <!-- Search Result-->
        <div v-if="searchResults.length" class="flex flex-col gap-1 px-1">
          <button
            v-for="chain in searchResults"
            :key="chain.name"
            class="flex items-center justify-between px-4 py-3 cursor-pointer hoverNoBG rounded-20 box-border transition-colors animate-fade-in"
            :class="[
              chain.name === selectedChain?.name
                ? 'bg-[#EFF4FF]'
                : 'bg-transparent hover:bg-mewBg',
            ]"
            @click="setSelectedChain(chain)"
          >
            <div class="flex justify-between items-center w-full">
              <div class="flex items-center">
                <div class="relative mr-4 overflow-visible">
                  <img
                    v-if="chain.icon"
                    class="w-9 h-9 rounded-full object-contain shadow-button bg-white"
                    :src="chain.icon"
                    alt="token icon"
                  />
                  <div
                    v-else
                    class="w-9 h-9 rounded-full bg-surface shadow-button"
                  ></div>
                </div>
                <span class="font-bold text-s-17 text-black">{{
                  chain.nameLong
                }}</span>
              </div>
              <check-icon
                v-if="chain.name === selectedChain?.name"
                class="w-6 h-6 text-[#2F80ED]"
              />
            </div>
          </button>
        </div>
        <!-- Search not found-->
        <div v-else>
          <div class="flex justify-center mt-10 h-[400px] text-info">
            <p>{{ $t('common.not_found.chains') }}</p>
          </div>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
/**
 * @example
 *
 *   <select-chain-dialog
 *     v-model:chain="selectedChain"
 *     :filter-chain-type="false"
 *     :has-all="true"
 *   />
 * @example: with all chains option
 *
 * import { ALL_CHAINS } from '@/components/select_chain/helpers'
 *
 * <select-chain-dialog
 *  v-model:chain="selectedChain"
 * :filter-chain-type="false"
 * :has-all="true"
 * />
 *
 */
import { ref, computed } from 'vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import { type Chain } from '@/mew_api/types'
import { CheckIcon } from '@heroicons/vue/24/solid'
import AppDialog from '@/components/AppDialog.vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppBtnIconClose from '@/components/AppBtnIconClose.vue'
import { ALL_CHAINS } from './helpers'
const prop = defineProps({
  filterChainType: {
    type: Boolean,
    default: false,
  },
  selectedChain: {
    type: Object as () => Chain | null,
    default: null,
  },
  hasAll: {
    type: Boolean,
    default: false,
  },
  passedChains: {
    type: Array as () => Chain[],
    default: () => [],
  },
})

const chainsStore = useChainsStore()
const {
  chains,
  isLoaded: isLoadedChains,
  selectedChain: storeSelectedChain,
} = storeToRefs(chainsStore)

const emit = defineEmits<{
  (e: 'update:chain', chain: Chain): void
}>()

/**
 * @description Set the selected chain in component and store, closes the dialog if open
 * @param chain - The chain to set as selected
 * @returns void
 */
const setSelectedChain = (chain: Chain) => {
  emit('update:chain', chain)

  if (openDialog.value) {
    setOpenDialog(false)
  }
}
/** -------------------------------
 * Dialog
 -------------------------------*/
const openDialog = defineModel('isOpen', {
  default: false,
})
const setOpenDialog = (value: boolean) => {
  openDialog.value = value
}

/** -------------------------------
 * Search
 -------------------------------*/
const searchInput = ref('')
const searchResults = computed<Chain[]>(() => {
  const locChain =
    prop.passedChains.length > 0 ? prop.passedChains : chains.value
  const _chains = prop.hasAll ? [ALL_CHAINS.value, ...locChain] : locChain
  const chainsToSearch = prop.filterChainType
    ? _chains.filter(chain => {
        return chain.type === storeSelectedChain.value?.type
      })
    : _chains

  if (!searchInput.value || searchInput.value === '') {
    if (!prop.selectedChain) {
      return chainsToSearch
    }
    const unique = new Set([prop.selectedChain, ...chainsToSearch])
    return [...unique]
  }
  const beginsWith = chainsToSearch.filter(chain => {
    return chain.name.toLowerCase().startsWith(searchInput.value.toLowerCase())
  })
  const other = chainsToSearch.filter(chain => {
    return chain.name.toLowerCase().includes(searchInput.value.toLowerCase())
  })
  const unique = new Set([...beginsWith, ...other])
  return [...unique]
})
</script>
