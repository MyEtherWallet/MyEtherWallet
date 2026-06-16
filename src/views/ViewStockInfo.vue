<template>
  <app-view-as-dialog containerClass="max-w-[900px] ">
    <template #content>
      <ModuleStockInfo :symbol="symbol" />
    </template>
  </app-view-as-dialog>
</template>

<script setup lang="ts">
import AppViewAsDialog from '@components/AppViewAsDialog.vue'
import ModuleStockInfo from '@/modules/stocks/ModuleStockInfo.vue'
import { onMounted } from 'vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
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

onMounted(() => {
  // Set the selected token symbol for the Trade module
  walletMenu.setSelectedTradeTokenSymbol(props.symbol)

  if (isMDAndUp.value) {
    walletMenu.setWalletPanel('trade')
    walletMenu.setIsOpenSideMenu(true)
  } else {
    walletMenu.setIsOpenSideMenu(false)
  }
})
</script>
