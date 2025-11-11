<template>
  <app-view-as-dialog containerClass="max-w-[900px] ">
    <template #content>
      <ModuleTokenInfo :tokenId="tokenId" />
    </template>
  </app-view-as-dialog>
</template>

<script setup lang="ts">
import AppViewAsDialog from '@/components/AppViewAsDialog.vue'
import ModuleTokenInfo from '@/modules/crypto/ModuleTokenInfo.vue'
import { onMounted } from 'vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
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

onMounted(() => {
  if (isMDAndUp.value) {
    walletMenu.setIsOpenSideMenu(true)
  } else {
    walletMenu.setIsOpenSideMenu(false)
  }
})
</script>
