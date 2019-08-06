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
import HeaderContainer from '@/containers/HeaderContainer';

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
@import '~@/scss/Global-tablet';
@import '~@/scss/Global-mobile';

@import '~@/scss/CustomForms-desktop';
@import '~@/scss/CustomForms-tablet';
@import '~@/scss/CustomForms-mobile';

@import '~@/scss/CustomModal-desktop';
@import '~@/scss/CustomModal-tablet';
@import '~@/scss/CustomModal-mobile';
</style>
