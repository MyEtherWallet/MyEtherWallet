<template>
  <div id="app">
    <header-container v-show="$route.fullPath !== '/getting-started'" />
    <welcome-modal ref="welcome" />
    <router-view />
    <footer-container />
    <confirmation-container v-if="wallet !== null" />
  </div>
</template>

<script>
import FooterContainer from '@/containers/FooterContainer';
import HeaderContainer from '@/containers/HeaderContainer';
import ConfirmationContainer from '@/containers/ConfirmationContainer';
import WelcomeModal from '@/components/WelcomeModal';
import store from 'store';
import { mapGetters } from 'vuex';
import { Toast } from '@/helpers';

export default {
  name: 'App',
  components: {
    'header-container': HeaderContainer,
    'footer-container': FooterContainer,
    'confirmation-container': ConfirmationContainer,
    'welcome-modal': WelcomeModal
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet'
    })
  },
  created() {
    const succMsg =
      'New update found! Please refresh your browser to receive the most updated version';
    const errMsg = 'Something went wrong with our service workers!';
    window.addEventListener('PWA_UPDATED', () => {
      Toast.responseHandler(succMsg, Toast.SUCCESS);
    });
    window.addEventListener('PWA_MOUNT_ERROR', () => {
      Toast.responseHandler(errMsg, Toast.WARN);
    });
  },
  mounted() {
    this.$store.dispatch('checkIfOnline');
    if (!store.get('notFirstTimeVisit') && this.$route.fullPath === '/') {
      this.$refs.welcome.$refs.welcome.show();
    }

    this.$refs.welcome.$refs.welcome.$on('hidden', () => {
      store.set('notFirstTimeVisit', true);
    });
  },
  destroyed() {
    window.removeEventListener('PWA_UPDATED');
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
