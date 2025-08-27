<template>
  <app-sheet
    v-if="isWalletConnected"
    sheet-class="md:max-w-[360px] !px-0 !pt-4 !pb-0 overflow-hidden"
  >
    <app-wallet-card class="px-4" />
    <app-tabs-simple
      v-model:activeTabIndex="activePanel"
      :tabs="tabs"
      :panel="panels"
      label="Wallet Tabs"
      class="w-full mt-4"
    >
      <template #tab-panel>
        <table-tokens v-if="activePanel === 0" class="w-full" />
        <div v-else-if="activePanel === 1" class="w-full h-[250px]">
          <p class="text-center text-s-15 text-info mt-10">TODO</p>
        </div>
      </template>
    </app-tabs-simple>
  </app-sheet>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import AppSheet from '@/components/AppSheet.vue'
import AppWalletCard from '@/components/AppWalletCard.vue'
import AppTabsSimple from '@/components/tabs/AppTabsSimple.vue'
import { type Tab, type Tab_Panel } from '@/types/components/appTabs'
import TableTokens from './components/TableTokens.vue'
import { useWalletStore } from '@/stores/walletStore'

const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)

enum TAB_ID {
  TOKENS = 'tokens',
  NFTS = 'nfts',
}
enum PANEL_ID {
  TOKENS = `tab-tokens`,
  NFTS = `tab-nfts`,
}
const tabs: Tab[] = [
  {
    name: 'Tokens',
    id: TAB_ID.TOKENS,
    controlsPanel: PANEL_ID.TOKENS,
  },
  {
    name: 'NFTs',
    id: TAB_ID.NFTS,

    controlsPanel: PANEL_ID.NFTS,
  },
]

const panels: Tab_Panel[] = [
  {
    id: PANEL_ID.TOKENS,
    ariaLabelledBy: TAB_ID.TOKENS,
  },
  {
    id: PANEL_ID.NFTS,
    ariaLabelledBy: TAB_ID.NFTS,
  },
]

const activePanel = ref(0)
</script>
