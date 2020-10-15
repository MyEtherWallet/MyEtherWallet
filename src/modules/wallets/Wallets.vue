<template>
  <v-sheet color="walletBg">
    <div class="d-flex align-stretch">
      <side-menu class="box-shadow" />
      <div class="flex-grow-1 d-flex flex-column justify-space-between">
        <v-container>
          <wallet-header />
          <v-row>
            <v-col cols="9">
              <router-view :owners-tokens="ownersTokens" />
            </v-col>
            <v-col cols="3">
              <network />
              <div class="pa-4"></div>
              <swap />
              <div class="pa-4"></div>
              <banner-ads />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </v-sheet>
</template>

<script>
import sideMenu from './components/side-menu/SideMenu';
import walletHeader from './components/header/Header';
import network from '@/modules/wallets/components/network/Network';
import swap from '@/modules/wallets/components/swap/Swap';
import bannerAds from '@/modules/wallets/components/banner-ads/BannerAds';
import TokensList from '@/modules/tokens/index';

export default {
  components: {
    sideMenu,
    walletHeader,
    network,
    swap,
    bannerAds
  },
  data() {
    return {
      tokens: [],
      ownersTokens: [],
      account: {
        balance: '20000000000000000000000',
        address: '0x43689531907482BEE7e650D18411E284A7337A66'
      }
    };
  },
  watch: {
    $route() {
      this.redirectToDashboard();
    }
  },
  mounted() {
    this.tokensList = new TokensList(this.$apollo);
    this.tokens = this.tokensList.getLatestPrices(this.$apollo);
    this.getOwnersTokens().then(res => {
      console.log(res);
      this.ownersTokens = res;
    });
    // this.redirectToDashboard();
  },
  methods: {
    getOwnersTokens() {
      return this.tokensList.getOwnersERC20Tokens(this.account.address);
    },
    redirectToDashboard() {
      if (this.$route.name === 'Wallet') {
        this.$router.push({ name: 'Dashboard' });
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
