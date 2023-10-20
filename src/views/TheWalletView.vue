<template>
  <div class="wallet-main">
    <the-wallet-side-menu />
    <v-main>
      <v-container class="pa-2 pa-md-3 mb-14" fluid>
        <the-wallet-header />
        <module-confirmation v-if="address" />
        <the-enkrypt-popup v-if="!isOfflineApp" :show="walletEnkryptPopup" />
        <router-view />
      </v-container>
    </v-main>
    <the-wallet-footer :is-offline-app="isOfflineApp" />
    <enkrypt-promo-snackbar v-if="!isOfflineApp" />
    <module-paper-wallet
      :open="showPaperWallet"
      :close="closePaperWallet"
      :is-offline-app="isOfflineApp"
      @close="closePaperWallet"
    />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { toBN } from 'web3-utils';
import Web3 from 'web3';
import moment from 'moment';
import { debounce, isEqual } from 'lodash';
import handlerWallet from '@/core/mixins/handlerWallet.mixin';
import nodeList from '@/utils/networks';
import {
  ERROR,
  SUCCESS,
  Toast,
  WARNING
} from '@/modules/toast/handler/handlerToast';
import { Web3Wallet } from '@/modules/access-wallet/common';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import matchNetwork from '@/core/helpers/matchNetwork';
import { EventBus } from '@/core/plugins/eventBus';

import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import HybridWalletInterface from '@/modules/access-wallet/hybrid/handlers/walletInterface';
import sanitizeHex from '@/core/helpers/sanitizeHex';
const INTERVAL = 14000;

export default {
  components: {
    TheWalletSideMenu: () => import('./components-wallet/TheWalletSideMenu'),
    TheWalletHeader: () => import('./components-wallet/TheWalletHeader'),
    TheWalletFooter: () => import('./components-wallet/TheWalletFooter'),
    ModuleConfirmation: () =>
      import('@/modules/confirmation/ModuleConfirmation'),
    EnkryptPromoSnackbar: () =>
      import('@/views/components-wallet/EnkryptPromoSnackbar'),
    TheEnkryptPopup: () =>
      import('@/views/components-default/TheEnkryptPopup.vue'),
    ModulePaperWallet: () => import('@/modules/balance/ModulePaperWallet.vue')
  },
  mixins: [handlerWallet, handlerAnalytics],
  data() {
    return {
      showPaperWallet: false,
      manualBlockSubscription: null
    };
  },
  computed: {
    ...mapState('wallet', [
      'address',
      'web3',
      'identifier',
      'isOfflineApp',
      'instance'
    ]),
    ...mapState('global', [
      'online',
      'gasPriceType',
      'baseGasPrice',
      'darkMode'
    ]),
    ...mapState('external', ['coinGeckoTokens', 'selectedEIP6963Provider']),
    ...mapState('popups', [
      'enkryptWalletPopup',
      'enkryptLandingPopup',
      'enkryptLandingPopupClosed'
    ]),
    ...mapGetters('global', [
      'network',
      'gasPrice',
      'isEIP1559SupportedNetwork'
    ]),
    ...mapGetters('wallet', ['balanceInWei']),
    walletEnkryptPopup() {
      return (
        !this.enkryptLandingPopup &&
        moment(new Date()).diff(this.enkryptLandingPopupClosed, 'hours') >=
          24 &&
        this.enkryptWalletPopup
      );
    }
  },
  watch: {
    address(newVal) {
      if (!newVal) {
        this.$router.push({ name: ROUTES_HOME.HOME.NAME });
      } else {
        this.setup();
        this.setTokensAndBalance();
      }
    },
    network(newVal, oldVal) {
      if (this.online && !this.isOfflineApp) {
        this.web3.eth.clearSubscriptions();
        this.identifier === WALLET_TYPES.WEB3_WALLET
          ? this.setWeb3Instance(this.selectedEIP6963Provider)
          : this.setWeb3Instance();
        this.setup();
        if (this.identifier !== WALLET_TYPES.WEB3_WALLET) {
          this.setTokensAndBalance();
        }

        if (
          (this.identifier === WALLET_TYPES.WALLET_CONNECT ||
            this.identifier === WALLET_TYPES.MEW_WALLET) &&
          newVal.type.chainID !== this.instance.connection.chainId
        ) {
          this.instance.connection.sendAsync(
            {
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: newVal.type.chainID.toString(16) }]
            },
            err => {
              if (err) {
                Toast(
                  'Selected network may not be supported by wallet',
                  {},
                  WARNING
                );
                this.instance.connection.switchEthereumChain(
                  oldVal.type.chainID
                );

                setTimeout(() => {
                  this.setNetwork({
                    network: oldVal,
                    walletType: this.identifier
                  }).then(() => {
                    this.setWeb3Instance();
                  });
                }, 1000);
              }
            }
          );
        }
      }
    },
    coinGeckoTokens(newVal, oldVal) {
      if (!isEqual(newVal, oldVal)) {
        this.setTokensAndBalance();
      }
    }
  },
  mounted() {
    this.$vuetify.theme.dark = this.darkMode;
    this.trackUserVersion(VERSION);
    EventBus.$on('openPaperWallet', () => {
      this.showPaperWallet = true;
      this.$router.push({
        name: ROUTES_WALLET.PRINT.NAME
      });
    });
    if (this.online && !this.isOfflineApp) {
      this.setup();
      this.setTokensAndBalance();
      if (this.identifier === WALLET_TYPES.WEB3_WALLET) {
        this.web3Listeners();
      }
      this.checkNetwork();
    }

    if (
      this.identifier === WALLET_TYPES.WALLET_CONNECT ||
      this.identifier === WALLET_TYPES.MEW_WALLET
    ) {
      this.instance.connection.on('session_update', () => {
        this.instance.connection.sendAsync(
          { method: 'eth_requestAccounts' },
          (err, res) => {
            if (res[0].toLowerCase() !== this.address.toLowerCase()) {
              const newWallet = new HybridWalletInterface(
                sanitizeHex(res[0]),
                this.instance.isHardware,
                this.identifier,
                this.instance.txSigner,
                this.instance.msgSigner,
                this.instance.connection,
                this.instance.errorHandler,
                this.instance.meta
              );
              this.setWallet([newWallet]);
            }
          }
        );
      });
    }
  },
  beforeDestroy() {
    EventBus.$off('openPaperWallet');
    if (this.online && !this.isOfflineApp) this.web3.eth.clearSubscriptions();
    const provider = this.selectedEIP6963Provider;
    if (provider && provider.removeListener instanceof Function) {
      if (this.findAndSetNetwork instanceof Function)
        provider.removeListener('chainChanged', this.findAndSetNetwork);
      if (this.setWeb3Account instanceof Function)
        provider.removeListener('accountsChanged', this.setWeb3Account);
    }
    clearInterval(this.manualBlockSubscription);
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
      'updateGasPrice',
      'setValidNetwork'
    ]),
    ...mapActions('external', ['setTokenAndEthBalance', 'setNetworkTokens']),

    /**
     * set showPaperWallet to false
     * to close the modal
     */
    closePaperWallet() {
      if (this.showPaperWallet) this.$router.go(-1);
      this.showPaperWallet = false;
    },
    setup() {
      this.subscribeToBlockNumber();
    },
    async checkNetwork() {
      const matched = await matchNetwork(
        this.network.type.chainID,
        this.identifier
      );
      this.setValidNetwork(matched);
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
    subscribeToBlockNumber: debounce(function () {
      clearInterval(this.manualBlockSubscription);
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
              const message = err.message ? err.message : err;
              if (
                message ===
                  'The method eth_subscribe does not exist/is not available' ||
                (message.includes('but is disabled for Https') &&
                  message.includes('eth_subscribe found for the url'))
              ) {
                return this.manualBlockSub();
              }

              Toast(
                err && message === 'Load failed'
                  ? 'eth_subscribe is not supported. Please make sure your provider supports eth_subscribe'
                  : 'Network Subscription Error: Please wait a few seconds before continuing.',
                {},
                ERROR
              );
            });
        });
      });
    }, 500),
    /**
     * Checks Metamask chainID on load, switches current network if it doesn't match
     * and setup listeners for metamask changes
     */
    web3Listeners() {
      if (this.selectedEIP6963Provider?.on) {
        this.selectedEIP6963Provider.on('chainChanged', this.findAndSetNetwork);
        this.selectedEIP6963Provider.on('accountsChanged', this.setWeb3Account);
      }
    },
    /**
     * sets an interval that will query the block number
     * functioning similarly to eth_subscribe newHeads
     */
    manualBlockSub() {
      const _this = this;
      this.manualBlockSubscription = setInterval(() => {
        _this.web3.eth.getBlockNumber().then(bNumber => {
          _this.setBlockNumber(bNumber);
          _this.web3.eth.getBlock(bNumber).then(block => {
            if (block) {
              _this.checkAndSetBaseFee(block.baseFeePerGas);
            }
          });
        });
      }, INTERVAL);
    },
    async findAndSetNetwork() {
      if (
        this.selectedEIP6963Provider &&
        this.identifier === WALLET_TYPES.WEB3_WALLET
      ) {
        const networkId = await this.selectedEIP6963Provider?.request({
          method: 'eth_chainId'
        });

        const foundNetwork = Object.values(nodeList).find(item => {
          if (toBN(networkId).eq(toBN(item[0].type.chainID))) return item;
        });
        if (this.selectedEIP6963Provider) {
          try {
            if (foundNetwork) {
              await this.setNetwork({
                network: foundNetwork[0],
                walletType: this.identifier
              });
              await this.setWeb3Instance(this.selectedEIP6963Provider);
              this.setTokensAndBalance();
              this.setValidNetwork(true);
              this.trackNetworkSwitch(foundNetwork[0].type.name);
              this.$emit('newNetwork');
              Toast(
                `Switched network to: ${foundNetwork[0].type.name}`,
                {},
                SUCCESS
              );
            } else {
              this.setValidNetwork(false);
              Toast("Current wallet's network is unsupported", {}, ERROR);
            }
          } catch (er) {
            Toast('There was an error switching networks', {}, ERROR);
          }
        } else {
          Toast(
            "Can't find matching nodes for selected Web3 Wallet node! Web3 Wallet may not function properly. Please select a supported node",
            {},
            WARNING
          );
        }
      }
    },
    setWeb3Account(acc) {
      const web3 = new Web3(this.selectedEIP6963Provider);
      const wallet = new Web3Wallet(acc[0]);
      this.setWallet([wallet, web3]);
    }
  }
};
</script>

<style lang="scss" scoped>
.wallet-main {
  background-color: var(--v-bgWallet-base);
  height: 100%;
}
</style>
