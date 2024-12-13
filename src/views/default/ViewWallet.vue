<template>
  <main class="flex justify-between wallet-layout">
    <!-- sidemenu -->
    <div class="bg-blue-950 text-white h-screen flex flex-col w-64">
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
import { ROUTES_WALLET } from '@/router/routeNames'
import { storeToRefs } from 'pinia';

import { useWalletStore } from '@/stores/wallet_store';
import { onMounted } from 'vue';

const store = useWalletStore();
const {wallet} = storeToRefs(store);

const address = wallet.value?.getAddressString();

onMounted(async ()=>{
  const tokens = await fetch(`https://tmp.ethvm.dev/balances/137/${address}?noInjectErrors=true`).then(res => res.json());
  console.log(tokens);
})


</script>
