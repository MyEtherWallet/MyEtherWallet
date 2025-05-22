<template>
  <main class="flex justify-between wallet-layout">
    <!-- sidemenu -->
    <div class="bg-blue-950 text-white h-screen flex flex-col w-64">
      <router-link
        :to="{ name: ROUTES_SEND.SEND.NAME }"
        aria-label="Navigate to Send"
        >Send</router-link
      >
    </div>
    <!-- main content -->
    <div class="">
      <router-view />
    </div>
    <!-- right items -->
    <!-- TODO: background remove and place with slots -->
    <div class="bg-mewBg w-96"></div>
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ROUTES_SEND } from '@/router/routeNames'
</script>
