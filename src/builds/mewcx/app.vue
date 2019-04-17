<template>
  <div id="app">
    <header-container v-if="$route.fullPath !== '/browser-action'" />
    <router-view />
    <footer-container v-if="$route.fullPath !== '/browser-action'" />
  </div>
</template>

<script>
import FooterContainer from '@/containers/FooterContainer';
import HeaderContainer from '@/containers/HeaderContainer';

export default {
  name: 'App',
  components: {
    'header-container': HeaderContainer,
    'footer-container': FooterContainer
  }
};
</script>

<style lang="scss">
@import '~@/scss/Global-desktop';
@import '~@/scss/CustomForms-desktop';
@import '~@/scss/CustomModal-desktop';
</style>
