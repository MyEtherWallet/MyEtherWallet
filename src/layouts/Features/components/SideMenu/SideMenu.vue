<template>
  <div
    class="component--sidemenu px-4 py-7"
    :style="{
      backgroundColor: $vuetify.theme.themes[theme].sideMenuBackground
    }"
  >
    <div class="mb-4">
      <router-link :to="{ name: 'Dashboard' }">
        <img width="120" src="@/assets/images/Common/logo-light.png" />
      </router-link>
    </div>
    <WalletCard />
    <BuyEthButton class="mt-2 mb-6" />
    <AccordionMenu class="px-2" />

    <ThemeSwitch class="px-3 mt-12" />
  </div>
</template>

<script>
import WalletCard from './components/WalletCard';
import BuyEthButton from './components/BuyEthButton';
import AccordionMenu from './components/AccordionMenu';
import ThemeSwitch from './components/ThemeSwitch';

export default {
  components: { WalletCard, BuyEthButton, AccordionMenu, ThemeSwitch },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    }
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
