<template>
  <app-sheet v-if="isWalletConnected" sheet-class="max-w-[300px] !px-5">
    <app-wallet-card />
  </app-sheet>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'

import AppSheet from '@/components/AppSheet.vue'
import AppWalletCard from '@/components/AppWalletCard.vue'
import { useWalletStore } from '@/stores/walletStore'

const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)
</script>
