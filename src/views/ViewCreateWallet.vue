<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCreateStore } from '@/stores/createStore'
import { storeToRefs } from 'pinia'
import { type CreateWalletView } from '@/modules/access/common/walletConfigs'
const createStore = useCreateStore()
const { isOpenCreateDialog } = storeToRefs(createStore)
const route = useRoute()
const router = useRouter()

onMounted(() => {
  createStore.openCreateDialog()
  //NOTE: IF this will be changed, ensure before route enter guard is changed accordingly
  if (route.query.type) {
    createStore.setCurrentView(route.query.type as CreateWalletView)
  }
})

const closeCreate = () => {
  router.push({ name: 'Home' })
}
watch(isOpenCreateDialog, newVal => {
  if (!newVal) {
    closeCreate()
  }
})
</script>
