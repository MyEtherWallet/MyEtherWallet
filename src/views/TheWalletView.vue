<template>
  <div class="wallet-main">
    <the-wallet-side-menu />
    <v-main>
      <v-container class="pa-2 pa-md-3 mb-14 align-center" fluid>
        <the-wallet-header />
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
import nodeList from '@/utils/networks';
import { Toast, WARNING } from '@/modules/toast/handler/handlerToast';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { Web3Wallet } from '@/modules/access-wallet/common';
import Web3 from 'web3';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
export default {
  components: {
    TheWalletSideMenu,
    TheWalletHeader,
    TheWalletFooter,
    ModuleConfirmation
  },
  mixins: [handlerWallet],
  computed: {
    ...mapState('wallet', ['address', 'web3', 'identifier']),
    ...mapState('global', ['online', 'gasPriceType', 'baseGasPrice']),
    ...mapGetters('global', ['network', 'gasPrice']),
    ...mapState('external', ['coinGeckoTokens']),
    ...mapGetters('wallet', ['balanceInWei'])
  },
  watch: {
    address() {
      if (!this.address) {
        this.$router.push({ name: ROUTES_HOME.HOME.NAME });
      }
    },
    network() {
      this.web3.eth.clearSubscriptions();
    },
    web3() {
      this.subscribeToBlockNumber();
      this.setGas();
      this.setTokensAndBalance();
    },
    coinGeckoTokens() {
      this.setTokenAndEthBalance();
    }
  },
  mounted() {
    if (this.online) {
      this.setup();

      if (this.identifier === WALLET_TYPES.WEB3_WALLET) {
        const web3Instance = new Web3(window.ethereum);

        web3Instance.eth.net.getId().then(id => {
          this.findAndSetNetwork(id);
        });
        this.web3Listeners();
      }
    }
  },
  destroyed() {
    this.web3.eth.clearSubscriptions();
  },
  methods: {
    ...mapActions('wallet', ['setBlockNumber', 'setTokens', 'setWallet']),
    ...mapActions('global', ['setGasPrice', 'setNetwork']),
    ...mapActions('external', ['setCoinGeckoTokens', 'setTokenAndEthBalance']),
    setup() {
      this.setTokensAndBalance();
      this.setGas();
      this.subscribeToBlockNumber();
    },
    setTokensAndBalance() {
      if (this.coinGeckoTokens?.get) {
        this.setTokenAndEthBalance();
      } else {
        this.setTokens([]);
      }
    },
    setGas() {
      this.web3.eth.getGasPrice().then(res => {
        if (this.gasPriceType === gasPriceTypes.STORED) {
          this.setGasPrice(this.baseGasPrice);
        } else {
          const modifiedGasPrice = toBN(res).muln(
            this.network.type.gasPriceMultiplier
          );
          this.setGasPrice(modifiedGasPrice.toString());
        }
      });
    },
    subscribeToBlockNumber() {
      this.web3.eth.getBlockNumber().then(res => {
        this.setBlockNumber(res);
        this.web3.eth.subscribe('newBlockHeaders').on('data', res => {
          if (
            res.baseFeePerGas &&
            this.gasPriceType !== gasPriceTypes.STORED &&
            toBN(res.baseFeePerGas).gt(toBN(this.gasPrice))
          ) {
            this.setGas();
          }
          this.setBlockNumber(res.number);
        });
      });
    },
    /**
     * Checks Metamask chainID on load, switches current network if it doesn't match
     * and setup listenerss for metamask changes
     */
    web3Listeners() {
      window.ethereum.on('chainChanged', chainId => {
        this.findAndSetNetwork(chainId);
      });

      window.ethereum.on('networkChanged', chainId => {
        this.findAndSetNetwork(chainId);
      });

      window.ethereum.on('accountsChanged', acc => {
        const web3 = new Web3(window.ethereum);
        const wallet = new Web3Wallet(acc[0]);
        this.setWallet([wallet, web3.currentProvider]);
      });
    },
    findAndSetNetwork(web3ChainId) {
      const foundNetwork = Object.values(nodeList).find(item => {
        if (toBN(web3ChainId).toNumber() === item[0].type.chainID) return item;
      });

      if (foundNetwork) {
        this.setNetwork(foundNetwork[0]).then(this.setup);
      } else {
        Toast(
          "Can't find matching nodes for selected MetaMask node! MetaMask may not function properly. Please select a supported node",
          {},
          WARNING
        );
      }
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
