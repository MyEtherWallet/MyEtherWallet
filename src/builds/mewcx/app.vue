<template>
  <div id="app">
    <header-container />
    <router-view />
    <footer-container />
    <confirmation-container />
  </div>
</template>

<script>
import FooterContainer from '@/web/containers/FooterContainer';
import HeaderContainer from '@/web/containers/HeaderContainer';
import ConfirmationContainer from '@/web/containers/ConfirmationContainer';

export default {
  name: 'App',
  components: {
    'header-container': HeaderContainer,
    'footer-container': FooterContainer,
    'confirmation-container': ConfirmationContainer
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
