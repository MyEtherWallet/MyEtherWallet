<template>
  <v-sheet
    color="basic"
    class="mew-component--sidemenu px-4 pb-7 pt-10 d-flex flex-column"
  >
    <div class="mb-4">
      <router-link :to="{ name: 'Dashboard' }">
        <img width="120" src="@/assets/images/icons/logo-mew.png" />
      </router-link>
    </div>
    <wallet-card />
    <mew-button
      class="buy-eth-button mt-4 mb-6"
      color-theme="white"
      btn-style="outline"
      title="Buy ETH here"
      button-size="large"
      :icon="require('@/assets/images/icons/icon-mastercard-mew.png')"
      icon-type="img"
      icon-align="right"
    />
    <accordion-menu class="mt-4" />
    <divider class="my-5 mx-1" />
    <system-menu />
    <divider class="my-5 mx-1" />
    <theme-switch class="px-5" />
    <version class="px-5" />
  </v-sheet>
</template>

<script>
import walletCard from '@/modules/wallets/components/wallet-card/WalletCard';
import accordionMenu from '@/modules/wallets/components/menu/Menu';
import systemMenu from '@/modules/wallets/components/system-menu/SystemMenu';
import themeSwitch from '@/modules/wallets/components/theme-switch/ThemeSwitch';
import version from '@/modules/wallets/components/version/Version';
import divider from '@/modules/wallets/components/divider/Divider';

export default {
  components: {
    walletCard,
    accordionMenu,
    systemMenu,
    themeSwitch,
    version,
    divider
  }
};
</script>

<style lang="scss" scoped>
.mew-component--sidemenu {
  background-image: url('~@/assets/images/backgrounds/bg-light.jpg');
  background-position: -336px 0px;
  background-size: 663px;
  position: relative;
  width: 300px;
  min-height: 100vh;
}
</style>

<style lang="scss">
.mew-component--sidemenu {
  .buy-eth-button {
    font-size: 14px !important;
    font-weight: 400 !important;
    padding: 0 25px !important;
    .v-btn__content {
      display: flex;
      justify-content: space-between;
    }
    img {
      height: 20px !important;
    }
  }
}
</style>
