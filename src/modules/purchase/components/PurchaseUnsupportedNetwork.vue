<template>
  <div
    class="px-5 py-5 bg-white border border-warning rounded-16 shadow-button shadow-button-elevated"
  >
    <div class="flex items-center gap-2 justify-center mb-2">
      <exclamation-circle-icon class="w-5 h-5 text-warning" />
      <p class="text-warning font-medium text-s-16">{{ title }}</p>
    </div>
    <p class="text-info text-s-14 text-center mb-4">{{ description }}</p>
    <select-chain-for-app
      :passed-chains="chains"
      :preselected-chain="defaultChain"
      :can-store="false"
      id="PURCHASE:NetworkNotSupported"
      @update:selected-chain="onSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ExclamationCircleIcon } from '@heroicons/vue/24/solid'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import { useGlobalStore } from '@/stores/globalStore'
import type { Chain } from '@/mew_api/types'

defineProps<{
  title: string
  description: string
  chains: Chain[]
  defaultChain: Chain | null
}>()

const globalStore = useGlobalStore()

const onSelect = (chain: Chain) => {
  globalStore.setSelectedNetwork(chain.name)
}
</script>
