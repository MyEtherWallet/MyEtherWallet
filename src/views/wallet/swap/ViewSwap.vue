<template>
  <div>
    <p class="text-s-80 my-8 text-center" v-if="!isWalletConnected">
      Simple and Secure Token Swap
    </p>
    <p class="my-4 text-s-20 text-center" v-if="!isWalletConnected">
      Instant crypto exchange with minimal fees
    </p>
    <router-view />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useWalletStore } from '@/stores/walletStore'

const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)
</script>
