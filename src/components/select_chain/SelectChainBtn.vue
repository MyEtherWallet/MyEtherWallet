<template>
  <div>
    <!-- Design-library Picker (L): the selection opens the chain dialog. Sits on
         a white dialog surface, so it takes the grey `alternative` fill. -->
    <app-picker
      size="l"
      surface="alternative"
      :title="selectedChain?.nameLong ?? ''"
      :description="$t('common.network')"
      :loading="!isReady"
      @click="setOpenDialog(true)"
    >
      <template #avatar="{ size }">
        <app-avatar
          type="network"
          :size="size"
          :url="selectedChain?.icon"
          :chain="selectedChain?.name"
        />
      </template>
    </app-picker>
    <!-- Dialog with chains list -->
    <select-chain-dialog
      v-if="isLoadedChains"
      v-model:is-open="openDialog"
      :selected-chain="selectedChain"
      :filter-by-selected-chain-type="false"
      @update:chain="setSelectedChain"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import { type Chain } from '@/mew_api/types'
import AppPicker from '@/components/picker/AppPicker.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
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
