<template>
  <div class="flex items-center flex-col">
    <h1 class="mt-10 title3 pt-10 text-center">Coming soon</h1>
    <p class="text-s-16 mt-6 text-center">Pardon our crypto dust!</p>
    <p class="text-s-16 mt-1 text-center">
      We are currently working on even more staking and earning options for our
      amazing users (you)!
    </p>
    <p class="text-s-16 mt-1 mb-10 text-center">
      To access your staked assets please visit the previous version of MEW
      <a href="#" target="_blank" class="underline text-info">here</a>.
    </p>
    <AppSubscribeToUpdates />
  </div>
</template>
<script setup lang="ts">
import AppSubscribeToUpdates from '@/components/AppSubscribeToUpdates.vue'
</script>
