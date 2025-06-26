<template>
  <div class="min-h-[600px]">
    <div
      v-if="isLoadedChainsData"
      :class="[
        isWalletConnected ? 'grid grid-cols-10' : 'grid grid-cols-1 ',
        'justify-between gap-6',
      ]"
    >
      <div
        v-if="isWalletConnected"
        class="order-2 col-span-10 md:col-span-4 md:order-1 xl-min:col-span-3"
      >
        <side-balance class="mx-auto max-w-[478px]" />
      </div>
      <div
        class="order-1 col-span-10 md:col-span-6 md:order-2 xl-min:col-span-4 justify-self-center flex flex-col items-center gap-4"
      >
        <app-tabs
          v-model:activeTabIndex="activePanel"
          :tabs="tabs"
          :panel="panels"
          :useRouteLink="true"
          label="Send Tabs"
          class="w-full max-w-[478px] mx-auto"
        ></app-tabs>
        <router-link
          :to="{ name: ROUTES_ACCESS.ACCESS.NAME }"
          class="w-full max-w-[478px]"
        >
          <app-base-button v-if="!isWalletConnected" class="w-full capitalize">
            {{ $t('common.connect_wallet') }}</app-base-button
          >
        </router-link>
        <app-need-help
          :title="$t('send.need-help')"
          help-link="https://help.myetherwallet.com/en/article/what-is-gas"
          class="mt-4"
        />
      </div>
      <div
        v-if="isWalletConnected"
        class="order-3 col-span-10 xl-min:col-span-3"
      ></div>
    </div>
    <div v-else class="grid grid-cols-1 gap-6 justify-items-center">
      <div
        class="animate-pulse bg-white rounded-full h-[42px] w-[252px] xs:h-12 xs:w-[291px] mx-auto"
      ></div>
      <div
        class="animate-pulse bg-white rounded-32 h-[380px] max-w-[478px] w-full"
      ></div>
      <div
        class="animate-pulse bg-white rounded-full max-w-[478px] w-full h-12"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ROUTES_SEND, ROUTES_ACCESS } from '@/router/routeNames'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import SideBalance from '@/modules/side_balance/SideBalance.vue'
import { type Tab, type Tab_Panel } from '@/types/components/appTabs'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { useChainsStore } from '@/stores/chainsStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)
const chainStore = useChainsStore()
const { isLoaded: isLoadedChainsData } = storeToRefs(chainStore)

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
    name: t('send.send-tokens'),
    routeName: ROUTES_SEND.SEND.NAME,
    controlsPanel: PANEL_ID.SEND,
    id: TAB_ID.SEND,
  },
  {
    name: t('send.send-nfts'),
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
