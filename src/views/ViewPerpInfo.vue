<template>
  <app-view-as-dialog containerClass="max-w-[900px]">
    <template #content>
      <ModulePerpInfo :market="market" />
    </template>
  </app-view-as-dialog>
</template>

<script setup lang="ts">
import AppViewAsDialog from '@/components/AppViewAsDialog.vue'
import ModulePerpInfo from '@/modules/perps/ModulePerpInfo.vue'
import { onMounted } from 'vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

const props = defineProps({
  market: {
    type: String,
    required: true,
  },
})

const { isMDAndUp } = useAppBreakpoints()
const walletMenu = useWalletMenuStore()

onMounted(() => {
  walletMenu.setSelectedTradeTokenSymbol(props.market.split('-')[0])
  if (isMDAndUp.value) {
    walletMenu.setWalletPanel('perps')
    walletMenu.setIsOpenSideMenu(true)
  } else {
    walletMenu.setIsOpenSideMenu(false)
  }
})
</script>
