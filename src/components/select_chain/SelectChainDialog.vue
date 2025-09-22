<template>
  <!-- Dialog with chains list -->
  <app-dialog
    v-if="isLoadedChains"
    v-model:is-open="openDialog"
    title="Select Chain"
    class="xs:max-w-[428px] sm:mx-auto"
    z-index-overlay="z-[200]"
    z-index-container="z-[201]"
  >
    <template #content>
      <div class="h-[95vh] sm:h-[500px] !overflow-y-scroll">
        <!-- Seacrh -->
        <div class="sticky top-0 bg-white z-10">
          <div class="px-5 mb-1">
            <app-search-input
              v-model="searchInput"
              class="grow"
              placeholder="Search by Name"
            />
          </div>
          <hr class="h-px bg-grey-outline border-0 w-full" />
        </div>
        <!-- Seacrh Result-->
        <div v-if="searchResults.length" class="flex flex-col px-2 mt-2">
          <button
            v-for="chain in searchResults"
            :key="chain.name"
            class="flex items-center justify-between px-5 py-3 cursor-pointer hoverNoBG rounded-12 box-border"
            :class="{ 'bg-grey-5': chain.name === selectedChain?.name }"
            @click="setSelectedChain(chain)"
          >
            <div class="flex justify-between items-center w-full">
              <div class="flex items-center">
                <img
                  v-if="chain.icon"
                  class="mr-4 w-7 h-7 rounded-full overflow-hidden shadow-token"
                  :src="chain.icon"
                  alt="token icon"
                />
                <div
                  v-else
                  class="mr-4 w-7 h-7 rounded-full overflow-hidden bg-surface shadow-token"
                ></div>
                <span>{{ chain.nameLong }}</span>
              </div>
              <check-icon
                v-if="chain.name === selectedChain?.name"
                class="w-6 h-6 text-primary"
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
  const _chains = prop.hasAll
    ? [ALL_CHAINS.value, ...chains.value]
    : chains.value
  const chainsToSearch = prop.filterChainType
    ? _chains
    : _chains.filter(chain => {
        return chain.type === storeSelectedChain.value?.type
      })

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
