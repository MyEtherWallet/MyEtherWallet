<template>
  <div id="app">
    <header-container v-show="$route.fullPath !== '/getting-started'" />
    <router-view />
    <footer-container />
    <confirmation-container v-if="wallet !== null" />
  </div>
</template>

<script>
import FooterContainer from '@/containers/FooterContainer';
import HeaderContainer from '@/containers/HeaderContainer';
import ConfirmationContainer from '@/containers/ConfirmationContainer';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    'header-container': HeaderContainer,
    'footer-container': FooterContainer,
    'confirmation-container': ConfirmationContainer
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet'
    })
  },
  mounted() {
    this.$store.dispatch('checkIfOnline');
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
