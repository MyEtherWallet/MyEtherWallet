<template>
  <v-app>
    <v-main>
      <decision-tree />
      <router-view />
    </v-main>
    <module-toast />
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import ModuleToast from '@/modules/toast/ModuleToast.vue';
import decisionTree from '@/components/DecisionTree/DecisionTree';

export default {
  name: 'App',
  components: { ModuleToast, decisionTree },
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
