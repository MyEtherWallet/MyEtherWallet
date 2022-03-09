<template>
  <div class="wallet-main">
    <the-wallet-side-menu />
    <v-main>
      <v-container class="pa-2 pa-md-3 mb-14" fluid>
        <the-wallet-header />
        <module-confirmation />
        <the-wallet-promo-popup />
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
import TheWalletPromoPopup from './components-wallet/TheWalletPopupPromo';
import ModuleConfirmation from '@/modules/confirmation/ModuleConfirmation';
import handlerWallet from '@/core/mixins/handlerWallet.mixin';
import nodeList from '@/utils/networks';
import { ERROR, Toast, WARNING } from '@/modules/toast/handler/handlerToast';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { Web3Wallet } from '@/modules/access-wallet/common';
import Web3 from 'web3';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
export default {
  components: {
    TheWalletSideMenu,
    TheWalletHeader,
    TheWalletFooter,
    TheWalletPromoPopup,
    ModuleConfirmation
  },
  mixins: [handlerWallet],
  computed: {
    ...mapState('wallet', ['address', 'web3', 'identifier']),
    ...mapState('global', ['online', 'gasPriceType', 'baseGasPrice']),
    ...mapGetters('global', [
      'network',
      'gasPrice',
      'isEIP1559SupportedNetwork'
    ]),
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
    ...mapActions('global', [
      'setNetwork',
      'setBaseFeePerGas',
      'updateGasPrice'
    ]),
    ...mapActions('external', ['setCoinGeckoTokens', 'setTokenAndEthBalance']),
    setup() {
      this.setTokensAndBalance();
      this.subscribeToBlockNumber();
    },
    setTokensAndBalance() {
      if (this.coinGeckoTokens?.get) {
        this.setTokenAndEthBalance();
      } else {
        this.setTokens([]);
      }
    },
    checkAndSetBaseFee(baseFee) {
      if (baseFee) {
        this.setBaseFeePerGas(toBN(baseFee));
      } else {
        this.setBaseFeePerGas(toBN('0'));
      }
      this.updateGasPrice();
    },
    subscribeToBlockNumber() {
      this.web3.eth.getBlockNumber().then(bNumber => {
        this.setBlockNumber(bNumber);
        this.web3.eth.getBlock(bNumber).then(block => {
          if (block) {
            this.checkAndSetBaseFee(block.baseFeePerGas);
          }
          this.web3.eth.subscribe('newBlockHeaders').on('data', res => {
            if (this.isEIP1559SupportedNetwork && res.baseFeePerGas) {
              this.checkAndSetBaseFee(toBN(res.baseFeePerGas));
            }
            this.setBlockNumber(res.number);
          });
        });
      });
    },
    /**
     * Checks Metamask chainID on load, switches current network if it doesn't match
     * and setup listenerss for metamask changes
     */
    web3Listeners() {
      if (window.ethereum.on) {
        window.ethereum.on('chainChanged', chainId => {
          this.findAndSetNetwork(chainId);
        });

        window.ethereum.on('networkChanged', chainId => {
          this.findAndSetNetwork(chainId);
        });

        window.ethereum.on('accountsChanged', acc => {
          if (acc[0]) {
            const web3 = new Web3(window.ethereum);
            const wallet = new Web3Wallet(acc[0]);
            this.setWallet([wallet, web3.currentProvider]);
          }
        });
      } else {
        Toast(
          'Something is wrong with Metamask. (window.ethereum.on is not a function).  Please refresh the page and reload Metamask.',
          {},
          ERROR
        );
      }
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
  box-shadow: 0 0 15px var(--v-greyMedium-base) !important;
}
.wallet-main {
  background-color: var(--v-greyLight-base);
  height: 100%;
}
</style>
