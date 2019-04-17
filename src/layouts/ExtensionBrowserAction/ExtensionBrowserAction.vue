<template>
  <div>
    <header-container />
    <router-view />
    <footer-container />
  </div>
</template>

<script>
import FooterContainer from '@/containers/FooterContainer';
import HeaderContainer from './containers/ExtensionHeaderContainer';

export default {
  components: {
    'footer-container': FooterContainer,
    'header-container': HeaderContainer
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionBrowserAction.scss';
</style>
