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
      <div class="py-8 py-lg-2"></div>

      <the-wallet-footer />
    </div>
  </v-sheet>
</template>

<script>
import { mapActions, mapState } from 'vuex';
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
      ownersTokens: [],
      manualBlockFetch: () => {}
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'web3']),
    ...mapState('global', ['online'])
  },
  watch: {
    web3() {
      this.web3.eth.clearSubscriptions();
      clearInterval(this.manualBlockFetch);
      this.subscribeToBlockNumber();
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
    clearInterval(this.manualBlockFetch);
  },
  methods: {
    ...mapActions('wallet', ['setAccountBalance', 'setBlockNumber']),
    ...mapActions('global', ['setGasPrice']),
    ...mapActions('external', ['setETHUSDValue']),
    ...mapState('global', ['gasPriceType']),
    getOwnDomain() {
      fetch('');
    },
    getTokens() {
      const tokensList = new TokenCalls(this.$apollo);
      tokensList.getOwnersERC20Tokens(this.address).then(res => {
        this.ownersTokens = res.map(r => {
          r.balance = toBN(r.balance);
          return r;
        });
      });
    },
    getPriceAndBalance() {
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
    },
    manualBlockSubscription() {
      const _self = this;
      // fetch initially
      _self.web3.eth.getBlockNumber().then(res => {
        _self.setBlockNumber(res);
        // rerun in 14 secs
        _self.manualBlockFetch = setInterval(() => {
          _self.web3.eth.getBlockNumber().then(res => {
            _self.setBlockNumber(res);
          });
        }, 14000);
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
