<template>
  <v-sheet class="d-flex justify-space">
    <confirmation />
    <wallet-side-menu />
    <v-container class="ml-6">
      <wallet-header />
      <router-view :owners-tokens="ownersTokens" />
      <wallet-footer class="mt-10 box-shadow" />
    </v-container>
  </v-sheet>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapActions, mapState } from 'vuex';
import utils from 'web3-utils';
import store from 'store';
import TokenCalls from '@/apollo/queries/tokens/index';
import WalletCalls from '@/apollo/queries/wallets/index';
import WalletSideMenu from './components-wallet/TheWalletSideMenu';
import WalletHeader from './components-wallet/TheWalletHeader';
import WalletFooter from './components-wallet/TheWalletFooter';
import Confirmation from './components-wallet/TheWalletTxConfirmation';
import {
  getGasBasedOnType,
  getOther,
  getEconomy
} from '@/core/helpers/gasPriceHelper.js';

export default {
  components: {
    WalletSideMenu,
    WalletHeader,
    WalletFooter,
    Confirmation
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
    ...mapActions('wallet', [
      'setAccountBalance',
      'setEthGasPrice',
      'setBlockNumber'
    ]),
    ...mapActions('global', ['setGasPrice', 'setEthGasPrice']),
    ...mapActions('external', ['setETHUSDValue']),
    getTokens() {
      const tokensList = new TokenCalls(this.$apollo);
      tokensList.getOwnersERC20Tokens(this.address).then(res => {
        this.ownersTokens = res;
      });
    },
    getPriceAndBalance() {
      const gasType = store.get('gasPriceType') || 'economy';
      const getCustomGas = getOther();
      const walletCalls = new WalletCalls(this.$apollo);
      walletCalls.getBalance(this.address).then(res => {
        this.setAccountBalance(BigNumber(utils.fromWei(res)).toString());
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
        const parsedGas = getEconomy(res).toString();
        if (gasType === 'economy') {
          this.setGasPrice(parsedGas);
        } else if (gasType === 'other' && getCustomGas) {
          this.setGasPrice(getCustomGas);
        } else {
          this.setGasPrice(getGasBasedOnType(parsedGas));
        }
        this.setEthGasPrice(res, 'gwei');
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
