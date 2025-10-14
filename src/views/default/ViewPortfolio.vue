<template>
  <div class="flex items-center flex-col">
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
</script>
