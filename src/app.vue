<template>
  <v-app class="walletBg">
    <module-decision-tree />
    <router-view />
    <module-toast />
    <module-global-modals />
    <module-analytics />
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import ModuleToast from '@/modules/toast/ModuleToast.vue';
import ModuleDecisionTree from '@/modules/decision-tree/ModuleDecisionTree';
import ModuleGlobalModals from '@/modules/global-modals/ModuleGlobalModals';
import ModuleAnalytics from '@/modules/analytics-opt-in/ModuleAnalytics';
import currencyTypes from '@/core/configs/configCurrencyTypes';
export default {
  name: 'App',
  components: {
    ModuleToast,
    ModuleDecisionTree,
    ModuleGlobalModals,
    ModuleAnalytics
  },
  mounted() {
    this.setOnlineStatus(window.navigator.onLine);
    if (window.navigator.onLine) {
      this.setDarkList();
      this.setCurrency(currencyTypes.USD);
    }
    // Window events to watch out if the online status changes
    window.addEventListener('offline', () => {
      this.setOnlineStatus(false);
    });
    window.addEventListener('online', () => {
      this.setOnlineStatus(true);
      this.setDarkList();
      this.setCurrency(currencyTypes.USD);
    });
  },
  methods: {
    ...mapActions('global', ['setOnlineStatus']),
    ...mapActions('external', ['setDarkList', 'setCurrency'])
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalStyles.scss';
@import '@myetherwallet/mew-components/src/assets/styles/global.scss';
</style>
