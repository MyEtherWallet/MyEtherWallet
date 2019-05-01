<template>
  <div class="extension-wallets-container">
    <wallet-side-menu />
    <div>
      content
    </div>
  </div>
</template>

<script>
import WalletSideMenu from '../../components/WalletSideMenu';
export default {
  components: {
    'wallet-side-menu': WalletSideMenu
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionWalletContainer.scss';
</style>
