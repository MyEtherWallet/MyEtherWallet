<template>
  <main>
    <h1 class="my-10 py-10 title4">{{ $t('access_wallet.title') }}</h1>
    <i18n-t
      keypath="access_wallet.subtext"
      tag="label"
      for="access_wallet.subtext_create_wallet"
      scope="global"
    >
      <router-link :to="{ name: CREATE_WALLET_PATH_NAME }">{{
        $t('access_wallet.subtext_create_wallet')
      }}</router-link>
    </i18n-t>
  </main>
</template>
<script setup lang="ts">
import { ROUTES_HOME } from '@/router/routeNames'
const CREATE_WALLET_PATH_NAME = ROUTES_HOME.CREATE_WALLET.NAME
</script>
