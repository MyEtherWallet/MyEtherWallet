<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import router from '@/router'
import { useAccessStore } from '@/stores/accessStore'
import { storeToRefs } from 'pinia'

const accessStore = useAccessStore()
const { isOpenAccessDialog } = storeToRefs(accessStore)

onMounted(() => {
  accessStore.openAccessDialog()
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
