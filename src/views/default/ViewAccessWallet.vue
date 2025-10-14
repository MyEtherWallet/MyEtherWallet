<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAccessStore } from '@/stores/accessStore'
import { storeToRefs } from 'pinia'
import { type WalletView } from '@/modules/access/common/walletConfigs'
const accessStore = useAccessStore()
const { isOpenAccessDialog } = storeToRefs(accessStore)
const route = useRoute()
const router = useRouter()

onMounted(() => {
  accessStore.openAccessDialog()
  //NOTE: IF this will be changed, ensure before route enter guard is changed accordingly
  if (route.query.type) {
    accessStore.setCurrentView(route.query.type as WalletView)
  }
})

const closeAccess = () => {
  router.push({ name: 'Home' })
}
watch(isOpenAccessDialog, newVal => {
  if (!newVal) {
    closeAccess()
  }
})
</script>
