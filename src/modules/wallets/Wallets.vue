<template>
  <div>
    <div class="d-block d-lg-none walletBg">
      <side-menu mobile />
      <div class="mx-auto px-2 preset--mobile-max-width">
        <wallet-header mobile />
        <router-view mobile />
      </div>
      <wallet-footer mobile class="mt-10 box-shadow" />
    </div>
    <div class="d-none d-lg-block walletBg">
      <div class="d-flex align-stretch">
        <side-menu class="box-shadow" />
        <div class="flex-grow-1 d-flex flex-column justify-space-between">
          <v-container>
            <wallet-header />
            <router-view />
          </v-container>
          <wallet-footer class="mt-10 box-shadow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sideMenu from './components/side-menu/SideMenu';
import walletHeader from './components/header/Header';
import walletFooter from './components/footer/Footer';

export default {
  components: {
    walletFooter,
    sideMenu,
    walletHeader
  },
  watch: {
    $route() {
      this.redirectToDashboard();
    }
  },
  mounted() {
    this.redirectToDashboard();
  },
  methods: {
    redirectToDashboard() {
      if (this.$route.name === 'Wallet') {
        this.$router.push({ name: 'Dashboard', params: {} });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.box-shadow {
  box-shadow: 0 0 15px var(--v-boxShadow-base) !important;
}
</style>
