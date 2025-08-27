<template>
  <div>
    <button
      :class="[isReady ? 'hoverNoBG' : 'animate-pulse bg-surface']"
      class="py-2 px-3 rounded-16 w-full border border-1 border-grey-outline min-h-[58px]"
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
    <!-- Dialog with chains list -->
    <select-chain-dialog
      v-if="isLoadedChains"
      v-model:is-open="openDialog"
      :selected-chain="selectedChain"
      :filter-chain-type="true"
      @update:chain="setSelectedChain"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import { type Chain } from '@/mew_api/types'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import SelectChainDialog from './SelectChainDialog.vue'

defineProps({
  isBtnGroup: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits<{
  (e: 'update:chain', chain: Chain): void
}>()

const isReady = computed(() => {
  return isLoadedChains.value && selectedChainStore.value
})
const selectedChain = ref<Chain | null>(null)

const chainsStore = useChainsStore()
const { isLoaded: isLoadedChains, selectedChain: selectedChainStore } =
  storeToRefs(chainsStore)

onMounted(() => {
  if (isLoadedChains.value && selectedChainStore.value) {
    selectedChain.value = selectedChainStore.value
    emit('update:chain', selectedChain.value)
  }
})

/**
 * @description Watch for the chains to be loaded and set the selected chain
 */
watch(
  () => isLoadedChains.value,
  () => {
    if (isLoadedChains.value && selectedChainStore.value) {
      selectedChain.value = selectedChainStore.value
      emit('update:chain', selectedChain.value)
    }
  },
  { immediate: true },
)

/**
 * @description Set the selected chain, emit it to parent, closes the dialog if open
 * @param chain - The chain to set as selected
 * @returns void
 */
const setSelectedChain = (chain: Chain) => {
  if (chain.name !== selectedChain.value?.name) {
    selectedChain.value = chain
    emit('update:chain', selectedChain.value)

    if (openDialog.value) {
      setOpenDialog(false)
    }
  }
}
/** -------------------------------
 * Dialog
 -------------------------------*/
const openDialog = ref(false)
const setOpenDialog = (value: boolean) => {
  if (isReady.value) {
    openDialog.value = value
  }
}
</script>
