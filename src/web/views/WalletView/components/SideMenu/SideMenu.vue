<template>
  <v-sheet
    color="bg_sidemenu"
    class="component--sidemenu px-4 py-7 d-flex flex-column"
  >
    <div class="mb-4">
      <router-link :to="{ name: 'Dashboard' }">
        <img width="120" src="@/assets/images/icons/logo-mew.png" />
      </router-link>
    </div>
    <WalletCard />
    <BuyEthButton class="mt-2 mb-6" />
    <AccordionMenu class="mt-4" />
    <Divider class="my-5 mx-1" />
    <SystemMenu />
    <Divider class="my-5 mx-1" />
    <ThemeSwitch class="px-5" />
    <Version class="px-5" />
  </v-sheet>
</template>

<script>
import WalletCard from './components/WalletCard';
import BuyEthButton from './components/BuyEthButton';
import AccordionMenu from './components/AccordionMenu';
import SystemMenu from './components/SystemMenu';
import ThemeSwitch from './components/ThemeSwitch';
import Version from './components/Version';
import Divider from './components/Divider';

export default {
  components: {
    WalletCard,
    BuyEthButton,
    AccordionMenu,
    SystemMenu,
    ThemeSwitch,
    Version,
    Divider
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.component--sidemenu {
  position: relative;
  width: 300px;
  min-height: 100vh;
  color: white;
}

.v-input--selection-controls__ripple:before {
}
</style>
