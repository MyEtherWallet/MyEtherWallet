<template>
  <div>
    <b-navbar class="extension-header-container">
      <b-navbar-brand to="/" class="brand-container">
        <img src="~@/assets/images/short-hand-logo.png" height="40" />
        <div class="brand-border" />
        <span> Chrome Extension </span>
      </b-navbar-brand>
      <b-nav class="extension-links">
        <b-nav-item href="https://www.myetherwallet.com" target="_blank">
          Home
        </b-nav-item>
        <b-nav-item href="https://kb.myetherwallet.com" target="_blank">
          Help
        </b-nav-item>
      </b-nav>
    </b-navbar>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import 'ExtensionHeaderContainer.scss';
</style>
