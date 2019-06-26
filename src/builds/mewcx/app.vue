<template>
  <div id="app">
    <header-container
      v-show="
        $route.fullPath !== '/popup' &&
          !$route.fullPath.includes('/extension-popups')
      "
    />
    <router-view />
    <footer-container
      v-show="
        $route.fullPath !== '/popup' &&
          !$route.fullPath.includes('/extension-popups')
      "
    />
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
  },
  mounted() {
    this.$store.dispatch('setWeb3Instance');
  }
};
</script>

<style lang="scss">
@import '~@/scss/Global-desktop';
@import '~@/scss/CustomForms-desktop';
@import '~@/scss/CustomModal-desktop';
</style>
