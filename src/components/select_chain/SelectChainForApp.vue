<template>
  <div>
    <slot
      name="network-button"
      :openNetworkDialog="setOpenDialog"
      :selectedChain="selectedChain"
      :filterChainType="true"
    >
      <app-btn-group
        v-if="isBtnGroup"
        v-model:selected="selectedChain"
        :btn-list="shownChains"
        :use-emit-only="true"
        :is-loaded="isLoadedChains"
        size="large"
        class="!p-2"
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
      <button
        v-else
        class="hoverNoBG py-2 px-3 rounded-16 w-full shadow-button shadow-button-elevated"
        @click="setOpenDialog(true)"
      >
        <div v-if="selectedChain" class="flex items-center">
          <img
            v-if="selectedChain.icon"
            :src="selectedChain.icon"
            alt=""
            class="w-8 h-8 mr-2 rounded-full object-contain flex-none"
            height="32"
            width="32"
          />
          <div class="ml-1 pr-1 min-w-[30px]">
            <p class="text-info text-left text-s-12 leading-[16px] capitalize">
              {{ $t('common.network') }}
            </p>
            <p
              class="text-ellipsis truncate font-medium text-sm overflow-hidden text-left"
            >
              {{ selectedChain.nameLong }}
            </p>
          </div>
          <chevron-down-icon class="flex-none w-4 h-4 ml-auto mr-1" />
        </div>
      </button>
    </slot>
    <!-- Dialog with chains list -->
    <select-chain-dialog
      v-if="isLoadedChains"
      v-model:is-open="openDialog"
      :selected-chain="selectedChain"
      :filter-chain-type="isBtnGroup"
      @update:chain="setSelectedChain"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import { type Chain } from '@/mew_api/types'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import AppBtnGroup from '@components/AppBtnGroup.vue'
import SelectChainDialog from './SelectChainDialog.vue'
import { useGlobalStore } from '@/stores/globalStore'

defineProps({
  isBtnGroup: {
    type: Boolean,
    default: false,
  },
})
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
</script>
