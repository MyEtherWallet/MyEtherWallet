<script setup lang="ts">
import { onMounted } from 'vue'
import ModuleHome from '@/modules/home/ModuleHome.vue'
import { useStocksStore } from '@/stores/stocksStore'

const stocksStore = useStocksStore()

onMounted(() => {
  stocksStore.fetchStockOverview()
})
</script>
<!-- The outlet hosts the connect/create overlay routes ('/access', '/create'), whose
     views render nothing themselves — the dialogs are mounted globally in App.vue. -->
<template>
  <ModuleHome />
  <router-view />
</template>
