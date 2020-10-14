<template>
  <v-sheet color="walletBg">
    <div class="d-flex align-stretch">
      <side-menu class="box-shadow" />
      <div class="flex-grow-1 d-flex flex-column justify-space-between">
        <v-container>
          <wallet-header />
          <router-view :owners-tokens="ownersTokens" />
        </v-container>
        <!-- need to redo this / incorrect placement -->
        <!-- <wallet-footer class="mt-10 box-shadow" /> -->
      </div>
      <div>
        <network />
        <div class="pa-4"></div>
        <swap />
      </div>
    </div>
  </v-sheet>
</template>

<script>
import sideMenu from './components/side-menu/SideMenu';
import walletHeader from './components/header/Header';
// import walletFooter from './components/footer/Footer';
import network from '@/modules/wallets/components/network/Network';
import swap from '@/modules/wallets/components/swap/Swap';
import TokensList from '@/modules/tokens/index';

export default {
  components: {
    // walletFooter,
    sideMenu,
    walletHeader,
    network,
    swap
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
    this.getOwnersTokens();
    this.redirectToDashboard();
  },
  methods: {
    async getOwnersTokens() {
      this.ownersTokens = await this.tokensList.getOwnersERC20Tokens(
        this.account.address
      );
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
