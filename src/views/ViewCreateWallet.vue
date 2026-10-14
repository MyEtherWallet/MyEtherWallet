<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCreateStore } from '@/stores/createStore'
import { storeToRefs } from 'pinia'
import { useWalletFlowRoute } from '@/composables/useWalletFlowRoute'
import { type CreateWalletView } from '@/modules/access/common/walletConfigs'
const createStore = useCreateStore()
const { isOpenCreateDialog } = storeToRefs(createStore)
const route = useRoute()
const { closeWalletFlowRoute } = useWalletFlowRoute()

onMounted(() => {
  // Idempotent — see ViewAccessWallet.
  createStore.ensureCreateDialogOpen()
  //NOTE: IF this will be changed, ensure before route enter guard is changed accordingly
  if (route.query.type) {
    createStore.setCurrentView(route.query.type as CreateWalletView)
  }
})

// See ViewAccessWallet.vue: closes the globally-mounted dialog when the route is left
// by any other means (browser Back, an unrelated link).
onUnmounted(() => {
  createStore.closeCreateDialog()
})

watch(isOpenCreateDialog, newVal => {
  if (!newVal) {
    // Return to the page the overlay opened over, not a hardcoded Home.
    closeWalletFlowRoute()
  }
})
</script>
