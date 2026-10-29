<template>
  <app-view-as-dialog containerClass="max-w-[900px] ">
    <template #content>
      <ModuleTokenInfo :tokenId="tokenId" />
    </template>
  </app-view-as-dialog>
  <!-- Hosts the connect/create overlay routes so they open ON TOP of this dialog and
       cancelling returns here, e.g. /crypto/token/peaq-2/access. Layout-neutral: the
       overlay views render nothing (the dialogs are mounted globally in App.vue). -->
  <router-view />
</template>

<script setup lang="ts">
import AppViewAsDialog from '@/components/AppViewAsDialog.vue'
import ModuleTokenInfo from '@/modules/crypto/ModuleTokenInfo.vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { isTradeCampaignQuery } from '@/composables/useTradeCampaignEntry'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

defineProps({
  tokenId: {
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
  // A marketing deep link into Trade owns the panel (useTradeCampaignEntry
  // opens it and moves to Stocks), so the breakpoint default stays out of it.
  if (isTradeCampaignQuery(route.query)) return
  if (isMDAndUp.value) {
    walletMenu.setIsOpenSideMenu(true)
  } else {
    walletMenu.setIsOpenSideMenu(false)
  }
})
</script>
