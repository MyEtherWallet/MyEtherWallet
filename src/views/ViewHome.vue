<script setup lang="ts">
import { onMounted } from 'vue'
import ModuleHome from '@/modules/home/ModuleHome.vue'
import { useStocksStore } from '@/stores/stocksStore'

const stocksStore = useStocksStore()

onMounted(() => {
  stocksStore.fetchStockOverview()
})
</script>
<template>
  <ModuleHome />
  <!-- Mounts the /access child (ViewAccessWallet): opens the connect dialog
       over Home for `/access?type=…`. Renders nothing itself. -->
  <router-view />
</template>
