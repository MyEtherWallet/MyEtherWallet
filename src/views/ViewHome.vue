<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ModuleHome from '@/modules/home/ModuleHome.vue'
import { useStocksStore } from '@/stores/stocksStore'
import { useAccessStore } from '@/stores/accessStore'
import {
  ACCESS_WALLET_VIEWS,
  type WalletView,
} from '@/modules/access/common/walletConfigs'

const stocksStore = useStocksStore()
const route = useRoute()
const accessStore = useAccessStore()

onMounted(() => {
  stocksStore.fetchStockOverview()
})

// The landing page deep-links to `/access?type=…` to prompt a wallet connect;
// that route redirects here, so open the connect dialog for the requested view.
// Mirrors ViewAccessWallet's onMounted so the `type` param keeps working.
watch(
  () => route.query.type,
  type => {
    if (
      typeof type === 'string' &&
      ACCESS_WALLET_VIEWS.includes(type as WalletView)
    ) {
      accessStore.openAccessDialog()
      accessStore.setCurrentView(type as WalletView)
    }
  },
  { immediate: true },
)
</script>
<template><ModuleHome /></template>
