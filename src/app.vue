<template>
  <v-app class="walletBg">
    <router-view />
    <module-toast />
    <module-global-modals />
    <module-analytics />
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ModuleToast from '@/modules/toast/ModuleToast.vue';
import ModuleGlobalModals from '@/modules/global-modals/ModuleGlobalModals';
import ModuleAnalytics from '@/modules/analytics-opt-in/ModuleAnalytics';
import currencyTypes from '@/core/configs/configCurrencyTypes';
import { PWA_EVENTS } from '@/core/helpers/common';
import {
  Toast,
  ERROR,
  SUCCESS,
  INFO
} from '@/modules/toast/handler/handlerToast';
export default {
  name: 'App',
  components: { ModuleToast, ModuleGlobalModals, ModuleAnalytics },
  computed: {
    ...mapState('custom', ['addressBook']),
    ...mapState('addressBook', ['isMigrated'])
  },
  created() {
    const succMsg = this.$t('common.updates.new');
    const updateMsg = this.$t('common.updates.update-found');
    const errMsg = this.$t('common.updates.update-error');
    window.addEventListener(PWA_EVENTS.PWA_UPDATED, () => {
      Toast(succMsg, {}, SUCCESS);
    });
    window.addEventListener(PWA_EVENTS.PWA_MOUNT_ERROR, () => {
      Toast(errMsg, {}, ERROR);
    });
    window.addEventListener(PWA_EVENTS.PWA_UPDATE_FOUND, () => {
      Toast(updateMsg, {}, INFO);
    });
  },
  mounted() {
    this.logMessage();
    this.setOnlineStatus(window.navigator.onLine);
    if (window.navigator.onLine) {
      this.setCurrency(currencyTypes.USD);
    }
    // Window events to watch out if the online status changes
    window.addEventListener('offline', () => {
      this.setOnlineStatus(false);
    });
    window.addEventListener('online', () => {
      this.setOnlineStatus(true);
      this.setCurrency(currencyTypes.USD);
    });
    if (!this.isMigrated) {
      // this.addressBook is the old one that resides in custom store
      this.setAddressBook(this.addressBook).then(() => {
        this.setMigrated(true);
      });
    }
  },
  methods: {
    ...mapActions('global', ['setOnlineStatus']),
    ...mapActions('external', ['setCurrency']),
    ...mapActions('addressBook', ['setMigrated', 'setAddressBook']),
    logMessage() {
      console.log(
        '%cWhoa whoa whoa!',
        'font-weight: bold',
        '\n\nThis feature is intended only for developers.  Using it without knowing exactly what you are doing can expose your wallet keys and lead to the loss of your funds.',
        '\n\nOn the other hand, if you are a developer and do know what you’re doing, MEW is hiring and we probably want to talk to you.  Send us an email at Careers@MyEtherWallet.com with the subject line: I am a rockstar developer.'
      );
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalStyles.scss';
@import '@myetherwallet/mew-components/src/assets/styles/global.scss';
</style>
