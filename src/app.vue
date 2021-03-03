<template>
  <v-app class="walletBg">
    <module-decision-tree />
    <router-view />
    <module-toast />
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import ModuleToast from '@/modules/toast/ModuleToast.vue';
import ModuleDecisionTree from '@/modules/decision-tree/ModuleDecisionTree';

export default {
  name: 'App',
  components: { ModuleToast, ModuleDecisionTree },
  mounted() {
    this.setOnlineStatus(window.navigator.onLine);
    // Window events to watch out if the online status changes
    window.addEventListener('offline', () => {
      this.setOnlineStatus(false);
    });
    window.addEventListener('online', () => {
      this.setOnlineStatus(true);
      this.setDarkList();
      this.setForexRates();
    });
  },
  methods: {
    ...mapActions('global', ['setOnlineStatus']),
    ...mapActions('external', ['setDarkList', 'setForexRates'])
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalStyles.scss';
@import '@myetherwallet/mew-components/src/assets/styles/global.scss';
</style>
