<template>
  <div class="cx-container">
    <keep-alive>
      <div class="cx-content-wrap">
        <wallet-side-menu class="side-menu" />
        <div class="max-width-limit">
          <router-view />
        </div>
      </div>
    </keep-alive>
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
  min-width: 960px;
}

.cx-content-wrap {
  width: 100%;
  position: relative;
}

.max-width-limit {
  max-width: 1055px;
  margin: 0 auto;
}

.side-menu {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 1;
}
</style>
