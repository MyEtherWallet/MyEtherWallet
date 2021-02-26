<template>
  <v-sheet height="100%" color="walletBg">
    <the-wallet-side-menu />
    <div class="px-0 px-md-3">
      <the-wallet-header />

      <!-- Top spacer for fixed position header -->
      <div class="pt-4 pt-md-0"></div>

      <v-container class="align-center d-flex" fluid>
        <module-confirmation />
        <router-view :owners-tokens="ownersTokens" />
      </v-container>

      <!-- Bottom spacer for fixed position footer -->
      <div class="py-1 py-lg-2"></div>

      <the-wallet-footer />
    </div>
  </v-sheet>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { toBN } from 'web3-utils';
import TokenCalls from '@/apollo/queries/tokens/index';
import WalletCalls from '@/apollo/queries/wallets/index';
import TheWalletSideMenu from './components-wallet/TheWalletSideMenu';
import TheWalletHeader from './components-wallet/TheWalletHeader';
import TheWalletFooter from './components-wallet/TheWalletFooter';
import ModuleConfirmation from '@/modules/confirmation/ModuleConfirmation';
import { getGasBasedOnType } from '@/core/helpers/gasPriceHelper.js';

export default {
  components: {
    TheWalletSideMenu,
    TheWalletHeader,
    TheWalletFooter,
    ModuleConfirmation
  },
  data() {
    return {
      tokens: [],
      ownersTokens: []
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'web3']),
    ...mapState('global', ['online']),
    ...mapGetters('global', ['isEthNetwork', 'network'])
  },
  watch: {
    web3() {
      this.web3.eth.clearSubscriptions();
      this.subscribeToBlockNumber();
      this.getTokens();
      this.getPriceAndBalance();
    }
  },
  mounted() {
    if (this.online) {
      this.getTokens();
      this.getPriceAndBalance();
      this.subscribeToBlockNumber();
    }
  },
  destroyed() {
    this.web3.eth.clearSubscriptions();
  },
  methods: {
    ...mapActions('wallet', ['setAccountBalance', 'setBlockNumber']),
    ...mapActions('global', ['setGasPrice']),
    ...mapActions('external', ['setETHUSDValue']),
    ...mapState('global', ['gasPriceType']),
    getTokens() {
      if (this.isEthNetwork) {
        const tokensList = new TokenCalls(this.$apollo);
        tokensList.getOwnersERC20Tokens(this.address).then(res => {
          this.ownersTokens = res.map(r => {
            r.balance = toBN(r.balance);
            return r;
          });
        });
      } else {
        this.tokens = this.network.type.tokens;
      }
    },
    getPriceAndBalance() {
      if (this.isEthNetwork) {
        const walletCalls = new WalletCalls(this.$apollo);
        walletCalls.getBalance(this.address).then(res => {
          this.setAccountBalance(toBN(res));
        });
        walletCalls.getUSDPrice(this.address).then(res => {
          const usd = {
            value: res.current_price,
            symbol: '$',
            name: 'USD',
            price_change_24h: res.price_change_24h
          };
          this.setETHUSDValue(usd);
        });
      } else {
        this.web3.eth.getBalance(this.address).then(res => {
          this.setAccountBalance(toBN(res));
        });
      }
      this.web3.eth.getGasPrice().then(res => {
        this.setGasPrice(getGasBasedOnType(res, this.gasPriceType));
      });
    },
    subscribeToBlockNumber() {
      this.web3.eth.getBlockNumber().then(res => {
        this.setBlockNumber(res);
      });
      this.web3.eth.subscribe('newBlockHeaders').on('data', res => {
        this.setBlockNumber(res.number);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.box-shadow {
  box-shadow: 0 0 15px var(--v-boxShadow-base) !important;
}
</style>
