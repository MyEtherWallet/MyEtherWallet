<template>
  <v-sheet class="d-flex justify-space">
    <module-confirmation />
    <the-wallet-side-menu />
    <v-container class="ml-6">
      <the-wallet-header />
      <div class="d-flex justify-space-between">
        <router-view :owners-tokens="ownersTokens" />
        <div class="pl-4">
          <network />
          <div class="pa-4"></div>
          <swap />
          <div class="pa-4"></div>
          <banner-ads />
        </div>
      </div>
      <the-wallet-footer class="mt-10 box-shadow" />
    </v-container>
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

import bannerAds from '@/components/banner-ads/BannerAds';
import network from '@/modules/network/ModuleNetwork';
import swap from '@/components/swap/Swap';

export default {
  components: {
    TheWalletSideMenu,
    TheWalletHeader,
    TheWalletFooter,
    ModuleConfirmation,
    bannerAds,
    network,
    swap
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
