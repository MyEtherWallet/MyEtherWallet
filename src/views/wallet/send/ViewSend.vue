<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div>
      <side-balanace />
    </div>
    <div class="flex flex-col items-center gap-4">
      <app-tabs
        v-model:activeTabIndex="activePanel"
        :tabs="tabs"
        :panel="panels"
        :useRouteLink="true"
        label="Send Tabs"
        class="w-full max-w-[478px] mx-auto"
      ></app-tabs>
      <app-base-button v-if="!isWalletConnected" class="w-full max-w-[478px]">
        Connect Wallet</app-base-button
      >
      <app-need-help
        title="Need help sending?"
        help-link="https://help.myetherwallet.com/en/article/what-is-gas"
        class="mt-4"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ROUTES_SEND } from '@/router/routeNames'
import AppTabs from '@/components/AppTabs.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import SideBalanace from '@/modules/side_balance/SideBalance.vue'
import { type Tab, type Tab_Panel } from '@/types/components/appTabs'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'

const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)

/** ----------------
 * TABS
 ------------------*/

enum TAB_ID {
  SEND = 'tab-send',
  SEND_NFT = 'tab-send-nft',
}
enum PANEL_ID {
  SEND = `tab-send-content`,
  SEND_NFT = `tab-send-nft-content`,
}

const tabs: Tab[] = [
  {
    name: 'Send Tokens',
    routeName: ROUTES_SEND.SEND.NAME,
    controlsPanel: PANEL_ID.SEND,
    id: TAB_ID.SEND,
  },
  {
    name: 'Send NFT',
    routeName: ROUTES_SEND.SEND_NFT.NAME,
    controlsPanel: PANEL_ID.SEND_NFT,
    id: TAB_ID.SEND_NFT,
  },
]
const panels: Tab_Panel[] = [
  {
    id: PANEL_ID.SEND,
    ariaLabelledBy: TAB_ID.SEND,
    routeName: ROUTES_SEND.SEND.NAME,
  },
  {
    id: PANEL_ID.SEND_NFT,
    ariaLabelledBy: TAB_ID.SEND_NFT,
    routeName: ROUTES_SEND.SEND_NFT.NAME,
  },
]
const activePanel = ref(0)
</script>
