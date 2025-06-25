<template>
  <div>
    <p class="text-s-80 my-8 text-center" v-if="!isWalletConnected">
      Simple and Secure Token Swap
    </p>
    <p class="my-4 text-s-20 text-center" v-if="!isWalletConnected">
      Instant crypto exchange with minimal fees
    </p>
    <router-view />
    <div class="w-full max-w-[478px] mx-auto">
      <router-link
        :to="{ name: ROUTES_ACCESS.ACCESS.NAME }"
        class="w-full max-w-[478px]"
      >
        <app-base-button v-if="!isWalletConnected" class="w-full">
          Connect Wallet</app-base-button
        >
      </router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ROUTES_ACCESS } from '@/router/routeNames'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { useWalletStore } from '@/stores/walletStore'

const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)
</script>
