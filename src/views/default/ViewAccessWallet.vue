<template>
  <main>
    <h1 class="mt-10 py-10 title4">{{ $t('access_wallet.title') }}</h1>

    <DefaultList />
    <div class="flex flex-col items-center my-10">
      <p>Don't Have a Wallet ?</p>
      <!-- <i18n-t
      keypath="access_wallet.subtext"
      tag="label"
      for="access_wallet.subtext_create_wallet"
      scope="global"
    > -->
      <router-link
        :to="{ name: CREATE_WALLET_PATH_NAME }"
        class="text-center mb-10 underline"
      >
        Create Wallet</router-link
      >
    </div>
    <!-- </i18n-t> -->
    <WalletsList />
  </main>
</template>
<script setup lang="ts">
import { ROUTES_HOME } from '@/router/routeNames'
import DefaultList from '@/components/access_wallet/DefaultList.vue'
import WalletsList from '@/components/access_wallet/WalletsList.vue'
const CREATE_WALLET_PATH_NAME = ROUTES_HOME.CREATE_WALLET.NAME
</script>
