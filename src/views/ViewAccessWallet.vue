<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAccessStore } from '@/stores/accessStore'
import { storeToRefs } from 'pinia'
import { useWalletFlowRoute } from '@/composables/useWalletFlowRoute'
import { type WalletView } from '@/modules/access/common/walletConfigs'
const accessStore = useAccessStore()
const { isOpenAccessDialog } = storeToRefs(accessStore)
const route = useRoute()
const { closeWalletFlowRoute } = useWalletFlowRoute()

onMounted(() => {
  // Idempotent: a caller that opened the dialog by flag (the common path) already
  // reset it and fired SHOWN; only a route-first entry opens it here.
  accessStore.ensureAccessDialogOpen()
  //NOTE: IF this will be changed, ensure before route enter guard is changed accordingly
  if (route.query.type) {
    accessStore.setCurrentView(route.query.type as WalletView)
  }
})

// Leaving this route any other way (browser Back, a link elsewhere) must also close the
// globally-mounted dialog, or it stays open over the new page. Safe against a redirect
// loop: Vue stops this component's effect scope BEFORE onUnmounted, so the watcher
// below cannot fire and navigate again.
onUnmounted(() => {
  accessStore.closeAccessDialog()
})

watch(isOpenAccessDialog, newVal => {
  if (!newVal) {
    // Return to the page the overlay opened over — NOT a hardcoded Home, which used to
    // drop a user who started on /stocks at '/'.
    closeWalletFlowRoute()
  }
})
</script>
