<template>
  <div id="app">
    <header-container v-show="$route.fullPath !== '/popup'" />
    <router-view />
    <footer-container v-show="$route.fullPath !== '/popup'" />
  </div>
</template>

<script>
import FooterContainer from '@/containers/FooterContainer';
import HeaderContainer from '@/layouts/ExtensionBrowserAction/containers/ExtensionHeaderContainer';

export default {
  name: 'App',
  components: {
    'footer-container': FooterContainer,
    'header-container': HeaderContainer
  }
};
</script>

<style lang="scss">
@import '~@/scss/Global-desktop';
@import '~@/scss/CustomForms-desktop';
@import '~@/scss/CustomModal-desktop';
</style>
