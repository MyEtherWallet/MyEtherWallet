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
    <buy-eth-btn class="mt-2 mb-6" />
    <accordion-menu class="mt-4" />
    <Divider class="my-5 mx-1" />
    <system-menu />
    <Divider class="my-5 mx-1" />
    <theme-switch class="px-5" />
    <version class="px-5" />
  </v-sheet>
</template>

<script>
import walletCard from './components/wallet-card';
import buyEthBtn from './components/buy-eth-btn';
import accordionMenu from './components/menu';
import systemMenu from './components/system-menu';
import themeSwitch from './components/theme-switch';
import version from './components/version';
import Divider from './components/divider';

export default {
  components: {
    walletCard,
    buyEthBtn,
    accordionMenu,
    systemMenu,
    themeSwitch,
    version,
    Divider
  }
};
</script>

<style lang="scss" scoped>
.mew-component--sidemenu {
  background-image: url('~@/assets/images/backgrounds/bg-light.png');
  background-position: -336px 0px;
  background-size: 663px;
  position: relative;
  width: 300px;
  min-height: 100vh;
}
</style>
