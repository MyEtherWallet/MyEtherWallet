<template>
  <div class="wallet-main">
    <the-wallet-side-menu />
    <v-main>
      <v-container class="pa-2 pa-md-3 mb-14" fluid>
        <the-wallet-header />
        <module-confirmation />
        <wallet-promo-pop-up />
        <router-view />
      </v-container>
    </v-main>
    <the-wallet-footer />
    <wallet-promo-snackbar />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { toBN, toHex } from 'web3-utils';
import TheWalletSideMenu from './components-wallet/TheWalletSideMenu';
import TheWalletHeader from './components-wallet/TheWalletHeader';
import TheWalletFooter from './components-wallet/TheWalletFooter';
import WalletPromoPopUp from './components-wallet/WalletPromoPopUp';
import ModuleConfirmation from '@/modules/confirmation/ModuleConfirmation';
import handlerWallet from '@/core/mixins/handlerWallet.mixin';
import nodeList from '@/utils/networks';
import { ERROR, Toast, WARNING } from '@/modules/toast/handler/handlerToast';
import { Web3Wallet } from '@/modules/access-wallet/common';
import Web3 from 'web3';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import WalletPromoSnackbar from '@/views/components-wallet/WalletPromoSnackbar';
export default {
  components: {
    TheWalletSideMenu,
    TheWalletHeader,
    TheWalletFooter,
    WalletPromoPopUp,
    ModuleConfirmation,
    WalletPromoSnackbar
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
      this.matchNetwork();
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
      this.findAndSetNetwork();
      this.web3Listeners();
    }
  },
  beforeDestroy() {
    if (window.ethereum) {
      window.ethereum.removeListener('chainChanged', this.findAndSetNetwork);
      window.ethereum.removeListener('accountsChanged', this.setWeb3Account);
    }
  },
  destroyed() {
    this.web3.eth.clearSubscriptions();
  },
  methods: {
    ...mapActions('wallet', [
      'setBlockNumber',
      'setTokens',
      'setWallet',
      'setWeb3Instance'
    ]),
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
          this.web3.eth
            .subscribe('newBlockHeaders')
            .on('data', res => {
              if (this.isEIP1559SupportedNetwork && res.baseFeePerGas) {
                this.checkAndSetBaseFee(toBN(res.baseFeePerGas));
              }
              this.setBlockNumber(res.number);
            })
            .on('error', err => {
              Toast(
                err.message === 'Load failed'
                  ? 'eth_subscribe is not supported. Please make sure your provider supports eth_subscribe'
                  : err,
                {},
                ERROR
              );
            });
        });
      });
    },
    /**
     * Checks Metamask chainID on load, switches current network if it doesn't match
     * and setup listeners for metamask changes
     */
    web3Listeners() {
      if (window.ethereum.on) {
        window.ethereum.on('chainChanged', this.findAndSetNetwork);
        window.ethereum.on('accountsChanged', this.setWeb3Account);
      } else {
        Toast(
          'Something is wrong with Metamask. (window.ethereum.on is not a function).  Please refresh the page and reload Metamask.',
          {},
          ERROR
        );
      }
    },
    /**
     * Attempts to switch metamask network to current mew network.
     * Informs user of pending or unknown networks.
     */
    async matchNetwork() {
      const { ethereum } = window;
      const {
        type: { chainID }
      } = this.network;
      if (ethereum) {
        const data = { chainId: toHex(chainID) };
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [data]
          });
        } catch (er) {
          const { message } = er;
          let toastMsg = ' ';
          let toastLink = {};
          if (message) {
            if (message.includes('pending')) {
              toastMsg =
                'There is a pending request to MetaMask, make your selection before continuing';
            } else if (message.includes('adding')) {
              toastLink = {
                title:
                  "It seems like you don't have this network set up in MetaMask. Please go here to add the network.",
                url: 'https://chainlist.org/'
              };
            } else if (message.includes('rejected')) return;
            else {
              toastMsg =
                'There was a problem processing your request to MetaMask';
            }
            Toast(toastMsg, toastLink, ERROR, 5000);
          }
        }
      }
    },
    async findAndSetNetwork() {
      const networkId = await window.ethereum.request({
        method: 'net_version'
      });
      const foundNetwork = Object.values(nodeList).find(item => {
        if (toBN(networkId).toNumber() === item[0].type.chainID) return item;
      });
      if (window.ethereum.isMetaMask) {
        try {
          await this.setNetwork(foundNetwork[0]);
          // await this.setWeb3Instance();
          await this.setTokenAndEthBalance();
        } catch (er) {
          console.log('in');
          console.log(er);
        }
      } else {
        Toast(
          "Can't find matching nodes for selected MetaMask node! MetaMask may not function properly. Please select a supported node",
          {},
          WARNING
        );
      }
    },
    setWeb3Account(acc) {
      const web3 = new Web3(window.ethereum);
      const wallet = new Web3Wallet(acc[0]);
      this.setWallet([wallet, web3.currentProvider]);
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
