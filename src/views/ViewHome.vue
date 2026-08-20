<script setup lang="ts">
import { onMounted } from 'vue'
import ModuleHome from '@/modules/home/ModuleHome.vue'
import { useStocksStore } from '@/stores/stocksStore'

const stocksStore = useStocksStore()

onMounted(() => {
  stocksStore.fetchStockOverview()
})
</script>
<template><ModuleHome /></template>
