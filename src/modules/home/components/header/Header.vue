<template>
  <div class="mew-component--landing-header expandHeader">
    <div class="desktop-content d-none d-lg-block py-5">
      <v-container class="d-flex align-center">
        <router-link :to="{ name: 'Home', query: {} }">
          <v-img src="@/assets/images/icons/logo-mew.png" max-width="130" />
        </router-link>
        <v-spacer></v-spacer>

        <desktop-menu class="menu-items" />
        <v-spacer></v-spacer>

        <mew-tools />
      </v-container>
    </div>

    <div class="mobile-content d-block d-lg-none py-8">
      <mobileMenu v-model="openMobileMenu" />

      <v-container class="d-flex align-center">
        <mew-button
          class="mobile-menu-button ml-n2 mr-n1"
          color-theme="white"
          btn-style="transparent"
          icon="mdi-text"
          icon-type="mdi"
          icon-align="left"
          style="border-radius: 100% !important"
          @click.native="openMobileMenu = true"
        />

        <v-spacer />

        <router-link :to="{ name: 'Home', query: {} }">
          <v-img src="@/assets/images/icons/logo-mew.png" max-width="130" />
        </router-link>

        <v-spacer />

        <mew-tools />
      </v-container>
    </div>
  </div>
</template>

<script>
import desktopMenu from '../menu-desktop/Menu';
import mobileMenu from '../menu-mobile/Menu';
import mewTools from '@/components/mewTools/MewTools';

export default {
  name: 'Header',
  components: { mewTools, desktopMenu, mobileMenu },
  data: () => ({
    openMobileMenu: false
  })
};
</script>

<style lang="scss" scoped>
.menu-items {
  max-width: 500px;
}
</style>

<style lang="scss">
.mew-component--landing-header {
  .desktop-tools-button {
    height: 50px !important;
    width: 140px !important;
  }

  $mobile-menu-button-size: 45px;
  .mobile-menu-button {
    height: $mobile-menu-button-size !important;
    min-height: $mobile-menu-button-size !important;
    width: $mobile-menu-button-size !important;
    min-width: $mobile-menu-button-size !important;
    padding: 0 !important;
    margin: 0 !important;
    i {
      font-size: 35px;
    }
  }
}
</style>
