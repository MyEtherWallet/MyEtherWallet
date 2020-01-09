<template>
  <div id="app">
    <logout-warning-modal ref="logoutWarningModal" />
    <header-container />
    <router-view />
    <footer-container />
    <confirmation-container />
  </div>
</template>

<script>
import FooterContainer from '@/containers/FooterContainer';
import HeaderContainer from '@/containers/HeaderContainer';
import ConfirmationContainer from '@/containers/ConfirmationContainer';
import LogoutWarningModal from '@/components/LogoutWarningModal';

import { mapState } from 'vuex';

export default {
  name: 'App',
  components: {
    'footer-container': FooterContainer,
    'header-container': HeaderContainer,
    'confirmation-container': ConfirmationContainer,
    'logout-warning-modal': LogoutWarningModal
  },
  computed: {
    ...mapState(['wallet'])
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
    const _self = this;
    window.chrome.storage.sync.get(null, item => {
      if (item.hasOwnProperty('defNetwork')) {
        const networkProps = JSON.parse(item['defNetwork']);
        let network = {};
        if (networkProps.hasOwnProperty('url')) {
          network = _self.$store.state.Networks[networkProps.key][0];
          window.chrome.storage.sync.set(
            {
              defNetwork: JSON.stringify({
                key: network.type.name,
                service: network.service
              })
            },
            () => {}
          );
        } else {
          network = _self.$store.state.Networks[networkProps.key].find(
            actualNetwork => {
              return actualNetwork.service === networkProps.service;
            }
          );
        }
        _self.$store.dispatch('switchNetwork', network).then(() => {
          _self.$store.dispatch('setWeb3Instance');
        });
      } else {
        _self.$store.dispatch('setWeb3Instance');
      }
    });
  },
  mounted() {
    this.$refs.logoutWarningModal.$refs.logoutWarningModal.$on('hidden', () => {
      window.scrollTo(0, 0);
    });
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
