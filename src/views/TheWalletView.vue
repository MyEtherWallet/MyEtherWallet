<template>
  <div class="wallet-main">
    <the-wallet-side-menu />
    <the-wallet-header />
    <v-main>
      <v-container
        class="pa-2 pa-md-3 mb-14 align-center wallet-content-container"
        fluid
      >
        <module-confirmation />
        <router-view />
      </v-container>
    </v-main>
    <the-wallet-footer />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { toBN } from 'web3-utils';
import TheWalletSideMenu from './components-wallet/TheWalletSideMenu';
import TheWalletHeader from './components-wallet/TheWalletHeader';
import TheWalletFooter from './components-wallet/TheWalletFooter';
import ModuleConfirmation from '@/modules/confirmation/ModuleConfirmation';
import handlerWallet from '@/core/mixins/handlerWallet.mixin';
import { gasPriceTypes } from '@/core/helpers/gasPriceHelper.js';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
export default {
  components: {
    TheWalletSideMenu,
    TheWalletHeader,
    TheWalletFooter,
    ModuleConfirmation
  },
  mixins: [handlerWallet],
  computed: {
    ...mapState('wallet', ['address', 'web3']),
    ...mapState('global', ['online', 'gasPriceType', 'baseGasPrice']),
    ...mapGetters('global', ['network']),
    ...mapState('external', ['coinGeckoTokens']),
    ...mapGetters('external', ['contractToToken']),
    ...mapGetters('wallet', ['balanceInWei']),
    isTokenBalanceApiSupported() {
      return (
        this.network.type.name === BSC.name ||
        this.network.type.name === ETH.name ||
        this.network.type.name === MATIC.name
      );
    }
  },
  watch: {
    network() {
      this.web3.eth.clearSubscriptions();
    },
    web3() {
      this.subscribeToBlockNumber();
      this.setGas();
      this.setTokensAndBalance();
    },
    coinGeckoTokens() {
      this.setTokenBalance();
    }
  },
  mounted() {
    if (this.online) {
      this.setTokensAndBalance();
      this.setGas();
      this.subscribeToBlockNumber();
    }
  },
  destroyed() {
    this.web3.eth.clearSubscriptions();
  },
  methods: {
    ...mapActions('wallet', [
      'setAccountBalance',
      'setBlockNumber',
      'setTokens'
    ]),
    ...mapActions('global', ['setGasPrice']),
    ...mapActions('external', ['setCoinGeckoTokens', 'setTokenBalance']),
    setTokensAndBalance() {
      this.web3.eth.getBalance(this.address).then(res => {
        this.setAccountBalance(toBN(res));
        if (this.coinGeckoTokens?.get) {
          this.setTokenBalance();
        } else {
          this.setTokens([]);
        }
      });
    },
    setGas() {
      this.web3.eth.getGasPrice().then(res => {
        if (this.gasPriceType === gasPriceTypes.STORED) {
          this.setGasPrice(this.baseGasPrice);
        } else {
          this.setGasPrice(res);
        }
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
