<template>
  <v-app class="walletBg">
    <router-view />
    <module-toast />
    <module-global-modals />
    <module-analytics />
    <module-buy-sell :open="buySellOpen" @close="buySellOpen = false" />
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en';

import { PWA_EVENTS } from '@/core/helpers/common';
import {
  Toast,
  ERROR,
  SUCCESS,
  INFO
} from '@/modules/toast/handler/handlerToast';
import { BUYSELL_EVENT } from '@/modules/buy-sell/helpers';
import { EventBus } from '@/core/plugins/eventBus';
import handlerAnalyticsMixin from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin.js';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
export default {
  name: 'App',
  components: {
    ModuleToast: () => import('@/modules/toast/ModuleToast.vue'),
    ModuleGlobalModals: () =>
      import('@/modules/global-modals/ModuleGlobalModals'),
    ModuleAnalytics: () => import('@/modules/analytics-opt-in/ModuleAnalytics'),
    ModuleBuySell: () => import('@/modules/buy-sell/ModuleBuySell')
  },
  mixins: [handlerAnalyticsMixin],
  data() {
    return {
      buySellOpen: false
    };
  },
  computed: {
    ...mapState('custom', ['addressBook']),
    ...mapState('addressBook', ['isMigrated']),
    ...mapState('global', ['preferredCurrency']),
    ...mapState('article', ['timestamp']),
    ...mapGetters('article', ['articleList']),
    ...mapGetters('global', ['network'])
  },
  created() {
    const succMsg = this.$t('common.updates.new');
    const updateMsg = this.$t('common.updates.update-found');
    const errMsg = this.$t('common.updates.update-error');
    this.$vuetify.theme.dark = false;
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
    EventBus.$on('swapTxBroadcasted', hash => {
      this.trackSwap('swapTxBroadcasted', hash, this.network.type.chainID);
    });
    EventBus.$on('swapTxReceivedReceipt', hash => {
      this.trackSwap('swapTxReceivedReceipt', hash, this.network.type.chainID);
    });
    EventBus.$on('swapTxFailed', hash => {
      const passedHash = hash === '0x' ? 'no hash' : hash;
      this.trackSwap('swapTxFailed', passedHash, this.network.type.chainID);
    });
    EventBus.$on('swapTxNotBroadcastedFailed', () => {
      this.trackSwap('swapTxNotBroadcastedFailed');
    });
    EventBus.$on(BUYSELL_EVENT, () => {
      this.openBuy();
    });
    this.footerHideIntercom();
    this.logMessage();
    this.setOnlineStatus(window.navigator.onLine);
    if (window.navigator.onLine) {
      this.setCurrency(this.preferredCurrency);
      this.updateArticles({
        timestamp: this.timestamp,
        articleList: this.articleList
      });
    }
    // Window events to watch out if the online status changes
    window.addEventListener('offline', () => {
      this.setOnlineStatus(false);
    });
    window.addEventListener('online', () => {
      this.setOnlineStatus(true);
      this.setCurrency(this.preferredCurrency);
    });
    if (!this.isMigrated) {
      // this.addressBook is the old one that resides in custom store
      this.setAddressBook(this.addressBook).then(() => {
        this.setMigrated(true);
      });
    }

    window.onbeforeunload = () => {
      if (this.$route.name === ROUTES_WALLET.SWAP.NAME) {
        this.trackSwap('swapUserExit');
      }
    };
    const _self = this;
    // Close modal with 'esc' key
    document.addEventListener('keydown', e => {
      if (e.keyCode === 27) {
        _self.buySellOpen = false;
      }
    });
  },
  beforeDestroy() {
    EventBus.$off(BUYSELL_EVENT);
    EventBus.$off('swapTxBroadcasted');
    EventBus.$off('swapTxReceivedReceipt');
    EventBus.$off('swapTxFailed');
    EventBus.$off('swapTxNotBroadcastedFailed');
  },
  methods: {
    ...mapActions('global', ['setOnlineStatus']),
    ...mapActions('external', ['setCurrency']),
    ...mapActions('addressBook', ['setMigrated', 'setAddressBook']),
    ...mapActions('article', ['updateArticles']),
    openBuy() {
      this.buySellOpen = true;
    },
    logMessage() {
      /* eslint-disable no-console */
      console.log(
        '%cWhoa whoa whoa!',
        'font-weight: bold',
        '\n\nThis feature is intended only for developers.  Using it without knowing exactly what you are doing can expose your wallet keys and lead to the loss of your funds.',
        '\n\nOn the other hand, if you are a developer and do know what you’re doing, MEW is hiring and we probably want to talk to you. Send us an email at careers@myetherwallet.com with the subject line: I am a software developer.'
      );
      /* eslint-enable no-console */
    },
    // Hide intercom button when users reach the footer or bottom of screen
    footerHideIntercom() {
      window.onscroll = function () {
        if (
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100
        ) {
          window.Intercom('update', {
            hide_default_launcher: true
          });
        } else {
          window.Intercom('update', {
            hide_default_launcher: false
          });
        }
      };
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalStyles.scss';
@import '@myetherwallet/mew-components/src/assets/styles/global.scss';
</style>
