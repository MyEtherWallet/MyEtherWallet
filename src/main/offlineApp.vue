<template>
  <v-app class="walletBg">
    <router-view />
    <module-toast />
    <module-global-modals />
  </v-app>
</template>

<script setup>
import { defineAsyncComponent, onMounted } from 'vue';

const ModuleToast = defineAsyncComponent(() =>
  import('@/modules/toast/ModuleToast.vue')
);
const ModuleGlobalModals = defineAsyncComponent(() =>
  import('@/modules/global-modals/ModuleGlobalModals')
);

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';

import { useVuetify } from '@/core/composables/vuetify';

// injections/use
const { setOfflineApp } = useWalletStore();
const { setOnlineStatus } = useGlobalStore();
const vuetify = useVuetify();

// mounted
onMounted(() => {
  vuetify.theme.dark = false;
  setOnlineStatus(false);
  setOfflineApp(true);
});
</script>

<style lang="scss">
@import '@/assets/styles/GlobalStyles.scss';
@import '@/assets/styles/GlobalComponents.scss';
</style>
