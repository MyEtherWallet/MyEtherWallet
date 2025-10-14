<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-12 w-full gap-6">
      <AppWalletCard class="cols-span-12 lg:col-span-5" />
      <div class="col-span-12 lg:col-span-7">
        <module-trending />
      </div>
    </div>
    <h1 class="mt-10 title3 pt-10 text-center">Coming soon</h1>
    <p class="text-s-16 mt-6 text-center">
      This is an Alpha Version of MyEtherWallet V7.
    </p>
    <p class="text-s-16 mt-1 text-center">
      We are working hard to bring you the best experience possible.
    </p>
    <p class="text-s-16 mt-1 mb-10 text-center">Stay tuned for updates!</p>
    <AppSubscribeToUpdates />
    <router-view />
  </div>
</template>
<script setup lang="ts">
import AppSubscribeToUpdates from '@/components/AppSubscribeToUpdates.vue'
import AppWalletCard from '@/components/AppWalletCard.vue'
</script>
