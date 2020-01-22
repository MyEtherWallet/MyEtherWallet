<template>
  <div class="cx-container">
    <wallet-side-menu class="side-menu" />
    <div class="max-width-limit">
      <router-view />
    </div>
  </div>
</template>

<script>
import WalletSideMenu from './components/WalletSideMenu';

export default {
  components: {
    'wallet-side-menu': WalletSideMenu
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.cx-container {
  background-color: #f2f4fa;
  height: calc(100vh - 64px);
  min-width: 960px;
  position: relative;
  width: 100%;
}

.max-width-limit {
  max-width: 1055px;
  margin: 0 auto;
  height: 100%;
}

.side-menu {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 1;
}
</style>
