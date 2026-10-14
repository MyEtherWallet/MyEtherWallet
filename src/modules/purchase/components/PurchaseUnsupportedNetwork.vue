<template>
  <app-unavailable-card :title="title" :description="description">
    <template #action>
      <select-chain-for-app
        :passed-chains="chains"
        :preselected-chain="defaultChain"
        :can-store="false"
        id="PURCHASE:NetworkNotSupported"
        class="w-full"
        @update:selected-chain="onSelect"
      />
    </template>
  </app-unavailable-card>
</template>

<script setup lang="ts">
import AppUnavailableCard from '@/components/AppUnavailableCard.vue'
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
