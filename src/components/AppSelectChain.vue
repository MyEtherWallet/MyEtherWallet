<template>
  <div>
    <app-btn-group
      v-model:selected="selectedChain"
      :btn-list="shownChains"
      :use-emit-only="true"
      :is-loaded="isLoadedChains"
      is-tall
      @onUpdate:selected="setSelectedChain"
    >
      <template #btn-content="{ data }">
        <div class="flex items-center">
          <img
            :src="data.icon"
            alt=""
            class="w-8 h-8 mr-3 rounded-full object-contain"
            height="32px"
            width="32px"
          />
          <span class="mr-2"> {{ data.nameLong }}</span>
        </div>
      </template>
      <template #custom>
        <button
          class="min-h-12 text-s-17 px-4 py-2 rounded-full bg-transparent font-medium hoverNoBG min-w-[89px]"
          @click="setOpenDialog(true)"
        >
          <div class="flex items-center capitalize">
            <span>{{ $t('common.more') }}</span>
            <chevron-down-icon class="text-info w-4 h-4 ml-1" />
          </div>
        </button>
      </template>
    </app-btn-group>

    <!-- Dialog with chains list -->
    <app-dialog
      v-if="isLoadedChains"
      v-model:is-open="openDialog"
      title="Select Chain"
      class="xs:max-w-[428px] sm:mx-auto"
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
              class="flex items-center justify-between px-5 py-3 cursor-pointer hoverNoBG rounded-xl"
              @click="setSelectedChain(chain)"
            >
              <div class="flex justify-between items-center w-full">
                <div class="flex items-center">
                  <img
                    v-if="chain.icon"
                    class="mr-4 w-7 h-7 rounded-full overflow-hidden"
                    :src="chain.icon"
                    alt="token icon"
                  />
                  <span>{{ chain.nameLong }}</span>
                </div>
              </div>
            </button>
          </div>
          <!-- Seacrh not found-->
          <div v-else>
            <div class="flex justify-center mt-10 h-[400px] text-info">
              <p>{{ $t('common.not_found.chains') }}</p>
            </div>
          </div>
        </div>
      </template>
    </app-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import { type Chain } from '@/mew_api/types'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import AppDialog from '@/components/AppDialog.vue'
import AppSearchInput from './AppSearchInput.vue'
import AppBtnGroup from './AppBtnGroup.vue'
import { useGlobalStore } from '@/stores/globalStore'

const defaults = ['ETHEREUM', 'BITCOIN', 'SOLANA']
const selectedChain = ref<Chain | null>(null)
const defaultChains = ref<Chain[]>([])

const globalStore = useGlobalStore()
const { selectedNetwork: selectedChainStore } = storeToRefs(globalStore)
const { setSelectedNetwork: setSelectedChainStore } = globalStore
const chainsStore = useChainsStore()
const { chains, isLoaded: isLoadedChains } = storeToRefs(chainsStore)
const lastSelectedChain = ref<Chain | null>(null)

const selectedIsDefault = computed(() => {
  return defaultChains.value.some(
    chain => chain.name === selectedChain.value?.name,
  )
})

const shownChains = computed<Chain[]>(() => {
  if (
    (selectedIsDefault.value && lastSelectedChain.value === null) ||
    selectedChain.value === null
  ) {
    return defaultChains.value
  }
  if (selectedIsDefault.value && lastSelectedChain.value) {
    return [...defaultChains.value, lastSelectedChain.value]
  }
  return [...defaultChains.value, selectedChain.value]
})

/**
 * @description Watch for the chains to be loaded and set the default chains and selected chain
 */
watch(
  () => isLoadedChains.value,
  () => {
    if (isLoadedChains.value) {
      defaults.forEach(chainName => {
        const chain = chains.value.find(c => c.name === chainName)
        if (chain) {
          defaultChains.value.push(chain)
        }
      })
      const preselected = chains.value.find(
        chain => chain.name === selectedChainStore.value,
      )
      selectedChain.value = preselected ?? defaultChains.value[0]
    }
  },
  { immediate: true },
)

/**
 * @description Set the selected chain in component and store, closes the dialog if open
 * @param chain - The chain to set as selected
 * @returns void
 */
const setSelectedChain = (chain: Chain) => {
  if (chain.name !== selectedChain.value?.name) {
    if (!selectedIsDefault.value) {
      lastSelectedChain.value = selectedChain.value
    }

    selectedChain.value = chain
    setSelectedChainStore(chain.name)
  }

  if (openDialog.value) {
    setOpenDialog(false)
  }
}
/** -------------------------------
 * Dialog
 -------------------------------*/
const openDialog = ref(false)
const setOpenDialog = (value: boolean) => {
  openDialog.value = value
}

/** -------------------------------
 * Search
 -------------------------------*/
const searchInput = ref('')
const searchResults = computed(() => {
  return chains.value.filter(chain => {
    return chain.name.toLowerCase().includes(searchInput.value.toLowerCase())
  })
})
</script>
