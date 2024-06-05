<template>
  <div class="expandHeader pt-16">
    <v-container>
      <!--
    =====================================================================================
        Layout Title
    =====================================================================================
    -->
      <the-layout-header
        :title="$t('home.create-wallet.title')"
        :subtitle-line-one="$t('home.create-wallet.subtitle-one')"
        :subtitle-line-two="$t('home.create-wallet.subtitle-two')"
        :route-obj="titleRoute"
        has-link
      />
      <!--
    =====================================================================================
        Options
    =====================================================================================
    -->
      <div>
        <router-view />
      </div>
    </v-container>
    <div class="spacer-y-medium" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted } from 'vue';

import { useAmplitude } from '@/core/composables/amplitude.js';

import {
  COMMON,
  CREATE_WALLET
} from '@/modules/analytics-opt-in/handlers/configs/events.js';

// injection/use
const { trackCreateWalletAmplitude } = useAmplitude();

const TheLayoutHeader = defineAsyncComponent(() =>
  import('../components-default/TheLayoutHeader')
);

const titleRoute = {
  text: 'Access Wallet',
  routeName: 'AccessWallet',
  func: () => {
    trackCreateWalletAmplitude(CREATE_WALLET.NAVIGATE_TO_ACCESS);
  }
};

onMounted(() => {
  trackCreateWalletAmplitude(COMMON.PAGE_SHOWN);
});
</script>
