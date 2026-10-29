<template>
  <app-view-as-dialog containerClass="max-w-[900px] ">
    <template #content>
      <ModuleStockInfo :symbol="symbol" />
    </template>
  </app-view-as-dialog>
  <!-- Hosts the connect/create overlay routes — see ViewTokenInfo.vue. -->
  <router-view />
</template>

<script setup lang="ts">
import AppViewAsDialog from '@/components/AppViewAsDialog.vue'
import ModuleStockInfo from '@/modules/stocks/ModuleStockInfo.vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { isTradeCampaignQuery } from '@/composables/useTradeCampaignEntry'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
})

const { isMDAndUp } = useAppBreakpoints()

/** --------------------
 * Wallet Menu Buttons
 --------------------*/
const walletMenu = useWalletMenuStore()
const route = useRoute()

onMounted(() => {
  // Set the selected token symbol for the Trade module
  walletMenu.setSelectedTradeTokenSymbol(props.symbol)

  // Below md the drawer normally takes the whole screen and the panel closes;
  // a marketing deep link into Trade opens it on every breakpoint instead.
  if (isMDAndUp.value || isTradeCampaignQuery(route.query)) {
    walletMenu.setWalletPanel('trade')
    walletMenu.setIsOpenSideMenu(true)
  } else {
    walletMenu.setIsOpenSideMenu(false)
  }
})
</script>
