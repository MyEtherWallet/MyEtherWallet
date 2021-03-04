<template>
  <div class="wallet-main">
    <the-wallet-side-menu />
    <the-wallet-header />
    <v-main>
      <v-container
        class="pa-3 pa-md-5 align-center wallet-content-container"
        fluid
      >
        <module-confirmation />
        <router-view :owners-tokens="ownersTokens" />
      </v-container>
    </v-main>
    <the-wallet-footer />
  </div>
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
import {
  getGasBasedOnType,
  gasPriceTypes
} from '@/core/helpers/gasPriceHelper.js';

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
        this.setGasPrice(getGasBasedOnType(res, gasPriceTypes.ECONOMY));
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
.wallet-main {
  background-color: var(--v-walletBg-base);
  height: 100%;
}
</style>
