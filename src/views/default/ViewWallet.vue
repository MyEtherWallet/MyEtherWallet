<template>
  <main class="wallet-layout">
    <!-- sidemenu -->
    <div class="wallet-layout__sidemenu">
      <router-link
        :to="{ name: ROUTES_WALLET.DASHBOARD.NAME }"
        aria-label="Navigate to Dashboard"
        >Dashboard</router-link
      >
      <router-link
        :to="{ name: ROUTES_WALLET.SEND.NAME }"
        aria-label="Navigate to Send"
        >Send</router-link
      >
    </div>
    <!-- main content -->
    <div>
      <router-view />
    </div>
    <!-- right items -->
    <div class="wallet-layout__sidebar"></div>
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ROUTES_WALLET } from '@/router/routeNames'
</script>

<style scoped lang="less">
.wallet-layout {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100vh;

  &__sidemenu {
    width: 300px;
    background-color: #07385f;
    color: white;
    display: flex;
    flex-direction: column;
  }

  &__sidebar {
    width: 400px;
    background-color: gray;
  }
}
</style>
