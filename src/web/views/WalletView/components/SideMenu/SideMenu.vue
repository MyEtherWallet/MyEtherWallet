<template>
  <v-sheet
    color="bg_sidemenu"
    class="border-radius--0px component--sidemenu px-4 py-7 d-flex flex-column"
  >
    <div class="mb-4">
      <router-link :to="{ name: 'Dashboard' }">
        <img width="120" src="@/assets/images/icons/logo-mew.png" />
      </router-link>
    </div>
    <WalletCard />
    <BuyEthButton class="mt-2 mb-6" />
    <AccordionMenu class="mx-n1" />
    <Divider class="my-4 mx-1" />
    <SystemMenu class="mx-n1" />
    <ThemeSwitch class="px-5 mt-8" />
  </v-sheet>
</template>

<script>
import WalletCard from './components/WalletCard';
import BuyEthButton from './components/BuyEthButton';
import AccordionMenu from './components/AccordionMenu';
import SystemMenu from './components/SystemMenu';
import ThemeSwitch from './components/ThemeSwitch';
import Divider from './components/Divider';

export default {
  components: {
    WalletCard,
    BuyEthButton,
    AccordionMenu,
    SystemMenu,
    ThemeSwitch,
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
</style>
