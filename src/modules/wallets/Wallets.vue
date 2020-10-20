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
import BigNumber from 'bignumber.js';
import { mapActions, mapState } from 'vuex';
import utils from 'web3-utils';
import store from 'store';

import sideMenu from './components/side-menu/SideMenu';
import walletHeader from './components/header/Header';
import network from '@/modules/wallets/components/network/Network';
import swap from '@/modules/wallets/components/swap/Swap';
import bannerAds from '@/modules/wallets/components/banner-ads/BannerAds';
import TokensList from '@/apollo/queries/tokens/index';
import WalletCalls from '@/apollo/queries/wallets/index';

import {
  getGasBasedOnType,
  getOther,
  getEconomy
} from '@/helpers/gasPriceHelper.js';

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
      ownersTokens: []
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'web3']),
    ...mapState('global', ['online'])
  },
  mounted() {
    if (this.online) {
      this.getTokens();
      this.getPriceAndBalance();
    }
  },
  methods: {
    ...mapActions('wallet', [
      'setAccountBalance',
      'setUSD',
      'setGasPrice',
      'setEthGasPrice'
    ]),
    getTokens() {
      const tokensList = new TokensList(this.$apollo);
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
        this.setUSD(res);
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
    }
  }
};
</script>

<style lang="scss" scoped>
.box-shadow {
  box-shadow: 0 0 15px var(--v-boxShadow-base) !important;
}
</style>
