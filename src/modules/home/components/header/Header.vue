<template>
  <div class="mew-component--landing-header expandHeader">
    <mew-tools v-model="mewTools" />

    <div class="desktop-content d-none d-lg-block py-5">
      <v-container class="d-flex align-center">
        <router-link :to="{ name: 'Home', query: {} }">
          <v-img src="@/assets/images/icons/logo-mew.png" max-width="130" />
        </router-link>
        <v-spacer></v-spacer>
        <home-menu class="menu-items" />
        <v-spacer></v-spacer>
        <mew-button
          class="desktop-tools-button px-2"
          title="MEW tools"
          color-theme="white"
          :has-full-width="false"
          button-size="large"
          btn-style="outline"
          icon="mdi-view-module"
          icon-type="mdi"
          icon-align="left"
          @click.native="mewTools = true"
        />
      </v-container>
    </div>

    <div class="mobile-content d-block d-lg-none py-8">
      <v-container class="d-flex align-center">
        <mew-button
          class="mobile-menu-button ml-n2 mr-n1"
          color-theme="white"
          btn-style="transparent"
          icon="mdi-text"
          icon-type="mdi"
          icon-align="left"
          style="border-radius: 100% !important"
        />

        <v-spacer></v-spacer>

        <router-link :to="{ name: 'Home', query: {} }">
          <v-img src="@/assets/images/icons/logo-mew.png" max-width="130" />
        </router-link>

        <v-spacer></v-spacer>

        <mew-button
          class="mobile-tools-button"
          color-theme="white"
          btn-style="outline"
          :icon="require('@/assets/images/icons/icon-grid-dot.png')"
          icon-type="img"
          icon-align="left"
          @click.native="mewTools = true"
        />
      </v-container>
    </div>
  </div>
</template>

<script>
import homeMenu from '../menu/Menu';
import mewTools from '@/modules/wallets/components/mewTools/MewTools';

export default {
  name: 'Header',
  components: { mewTools, homeMenu },
  data: () => ({
    mewTools: false
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

  $mobile-tools-button-size: 35px;
  .mobile-tools-button {
    height: $mobile-tools-button-size !important;
    min-height: $mobile-tools-button-size !important;
    width: $mobile-tools-button-size !important;
    min-width: $mobile-tools-button-size !important;
    padding: 0 !important;
    margin: 0 !important;
    img {
      height: 20px !important;
      padding: 0 !important;
      margin: 0 !important;
    }
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
