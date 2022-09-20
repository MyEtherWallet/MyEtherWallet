<template>
  <v-app class="walletBg">
    <router-view />
    <module-toast />
    <module-global-modals />
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',
  components: {
    ModuleToast: () => import('@/modules/toast/ModuleToast.vue'),
    ModuleGlobalModals: () =>
      import('@/modules/global-modals/ModuleGlobalModals')
  },
  mounted() {
    this.setOnlineStatus(false);
    this.setOfflineApp(true);
  },
  methods: {
    ...mapActions('wallet', ['setOfflineApp']),
    ...mapActions('global', ['setOnlineStatus'])
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalStyles.scss';
@import '@myetherwallet/mew-components/src/assets/styles/global.scss';
</style>
