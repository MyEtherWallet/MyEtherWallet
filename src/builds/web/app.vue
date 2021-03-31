<template>
  <div id="app">
    <logout-warning-modal ref="logoutWarningModal" />
    <header-container
      v-show="
        !on &&
        $route.fullPath !== '/getting-started' &&
        !$route.fullPath.includes('/dapp-submission')
      "
    />
    <welcome-modal ref="welcome" />
    <welcome-modal-temp ref="welcomeTemp" />
    <router-view />
    <footer-container v-if="!on" />
    <wallet-launched-footer-banner v-if="!on" />
    <confirmation-container v-if="wallet !== null" />
  </div>
</template>

<script>
import FooterContainer from '@/containers/FooterContainer';
import HeaderContainer from '@/containers/HeaderContainer';
import ConfirmationContainer from '@/containers/ConfirmationContainer';
import WelcomeModal from '@/components/WelcomeModal';
import WelcomeModalTemp from '@/layouts/HomeLayout/components/WelcomeModal';
import store from 'store';
import { mapState, mapActions } from 'vuex';
import { Toast } from '@/helpers';
import LogoutWarningModal from '@/components/LogoutWarningModal';
import WalletLaunchedBanner from '@/components/WalletLaunchedBanner';

export default {
  name: 'App',
  components: {
    WelcomeModalTemp,
    'header-container': HeaderContainer,
    'footer-container': FooterContainer,
    'confirmation-container': ConfirmationContainer,
    'logout-warning-modal': LogoutWarningModal,
    'welcome-modal': WelcomeModal,
    'wallet-launched-footer-banner': WalletLaunchedBanner
  },
  data() {
    return {
      on: false
    };
  },
  computed: {
    ...mapState('main', ['wallet', 'online'])
  },
  watch: {
    $route(to, from) {
      if (
        !from.meta.hasOwnProperty('requiresAuth') &&
        to.meta.hasOwnProperty('requiresAuth') &&
        this.wallet !== null
      ) {
        this.$refs.logoutWarningModal.$refs.logoutWarningModal.show();
      }
    }
  },
  created() {
    const succMsg = this.$t('common.updates.new');
    const errMsg = this.$t('common.updates.update-error');

    window.addEventListener('PWA_UPDATED', () => {
      Toast.responseHandler(succMsg, Toast.SUCCESS);
    });
    window.addEventListener('PWA_MOUNT_ERROR', () => {
      Toast.responseHandler(errMsg, Toast.WARN);
    });
    window.addEventListener('online', () => {
      this.checkIfOnline(true);
    });
    window.addEventListener('offline', () => {
      this.checkIfOnline(false);
    });
    window.addEventListener('TURN_OFF', () => {
      this.on = false;
      store.set('taskDone', true);
      this.$refs.welcomeTemp.$refs.welcome.show();
    });
  },
  mounted() {
    const currentDate = new Date().getTime();
    const date1 = 1617260400000;
    const date2 = 1617346800000;

    if (currentDate >= date1 && currentDate < date2) {
      this.on = true;
    }

    if (store.get('taskDone')) {
      this.on = false;
    }

    if (!this.on) {
      this.showWelcome();
    }

    this.checkIfOnline(navigator.onLine);

    this.$refs.logoutWarningModal.$refs.logoutWarningModal.$on('hidden', () => {
      window.scrollTo(0, 0);
    });
  },
  destroyed() {
    window.removeEventListener('PWA_UPDATED');
    window.removeEventListener('offline');
    window.removeEventListener('online');
    window.removeEventListener('turnOff');
  },
  methods: {
    ...mapActions('main', ['checkIfOnline']),
    showWelcome() {
      if (!store.get('notFirstTimeVisit') && this.$route.fullPath === '/') {
        this.$refs.welcome.$refs.welcome.show();
      }
      this.$refs.welcome.$refs.welcome.$on('hidden', () => {
        store.set('notFirstTimeVisit', true);
      });
    }
  }
};
</script>

<style lang="scss">
@import '~@/scss/Global-desktop';
@import '~@/scss/Global-tablet';
@import '~@/scss/Global-mobile';

@import '~@/scss/CustomForms-desktop';
@import '~@/scss/CustomForms-tablet';
@import '~@/scss/CustomForms-mobile';

@import '~@/scss/CustomModal-desktop';
@import '~@/scss/CustomModal-tablet';
@import '~@/scss/CustomModal-mobile';
</style>
