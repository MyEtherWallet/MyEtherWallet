<template>
  <div>
    <confirmation />

    <div v-if="isMobile">
      <side-menu mobile />
      <div class="mx-auto px-2 preset--mobile-max-width">
        <wallet-header mobile />
        <router-view mobile :owners-tokens="ownersTokens" />
      </div>
      <wallet-footer mobile class="mt-10 box-shadow" />
    </div>

    <div v-else>
      <div class="d-flex align-stretch">
        <side-menu class="box-shadow" />
        <div class="flex-grow-1 d-flex flex-column justify-space-between">
          <v-container>
            <wallet-header />
            <router-view :owners-tokens="ownersTokens" />
          </v-container>
          <wallet-footer class="mt-10 box-shadow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapActions, mapState } from 'vuex';
import utils from 'web3-utils';
import store from 'store';
import TokenCalls from '@/apollo/queries/tokens/index';
import WalletCalls from '@/apollo/queries/wallets/index';
import sideMenu from './components/side-menu/SideMenu';
import walletHeader from './components/header/Header';
import walletFooter from './components/footer/Footer';
import confirmation from '@/modules/wallets/components/confirmation/Confirmation';
import {
  getGasBasedOnType,
  getOther,
  getEconomy
} from '@/helpers/gasPriceHelper.js';

export default {
  components: {
    sideMenu,
    walletHeader,
    walletFooter,
    confirmation
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
    ...mapState('global', ['online']),
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    }
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
