<template>
  <div class="wallet-main">
    <the-wallet-side-menu />
    <v-main>
      <v-container class="pa-2 pa-md-3 mb-14" fluid>
        <the-wallet-header />
        <module-confirmation v-if="address" />
        <router-view />
      </v-container>
    </v-main>
    <the-wallet-footer :is-offline-app="isOfflineApp" />
    <module-paper-wallet
      :open="showPaperWallet"
      :close="closePaperWallet"
      :is-offline-app="isOfflineApp"
      @close="closePaperWallet"
    />
    <v-dialog
      :value="showSurvey"
      class="pk-survey"
      max-width="320"
      :content-class="
        $vuetify.breakpoint.smAndUp
          ? 'position-right survey-dialog ma-0'
          : 'survey-dialog ma-0'
      "
      persistent
      no-click-animation
      hide-overlay
      :retain-focus="false"
    >
      <div class="inner-container pa-5">
        <div class="d-flex justify-end">
          <v-icon
            size="x-large"
            color="grey cursor--pointer"
            @click="closeSurveyModal"
          >
            mdi-close
          </v-icon>
        </div>
        <div class="text-center font-weight-bold font-size--16px pt-2">
          Want to make MEW even better?
        </div>
        <div class="px-4 py-2">
          Please take a quick survey about your experience. We appreciate you!
        </div>
        <mew-button
          title="Click Here"
          :has-full-width="true"
          btn-link="https://mewwallet.typeform.com/pkuser-research"
          @click.native="openSurvey"
        />
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { toBN } from 'web3-utils';
import { debounce, isEqual } from 'lodash';
import moment from 'moment';

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
    ModulePaperWallet: () => import('@/modules/balance/ModulePaperWallet.vue')
  },
  mixins: [handlerWallet, handlerAnalytics],
  data() {
    return {
      tempClose: false,
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
    ...mapState('popups', ['pkSurveyShown', 'pkSurveyShownCounter']),
    ...mapGetters('global', [
      'network',
      'gasPrice',
      'isEIP1559SupportedNetwork'
    ]),
    ...mapGetters('wallet', ['balanceInWei']),
    showSurvey() {
      const isPrivKey = this.identifier === WALLET_TYPES.PRIV_KEY;
      const userClosed = !this.tempClose;
      const userAnswered = !this.pkSurveyShown;
      const shownTwice = this.pkSurveyShownCounter > 2;
      return (
        isPrivKey &&
        userClosed &&
        userAnswered &&
        !shownTwice &&
        this.withinDate
      );
    },
    withinDate() {
      const startDate = new Date('03/26/2024');
      const endDate = new Date('04/29/2024');
      return moment(new Date()).isBetween(startDate, endDate);
    }
  },
  watch: {
    address(newVal) {
      if (!newVal) {
        this.$router.push({ name: ROUTES_HOME.ACCESS_WALLET.NAME });
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
    if (this.showSurvey) {
      this.shownPkSurveyCounter();
      this.trackSurvey('Shown');
    }
    this.$vuetify.theme.dark = this.darkMode;
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
    ...mapActions('popups', ['setPkSurvey', 'shownPkSurveyCounter']),
    closeSurveyModal() {
      this.tempClose = true;
      this.trackSurvey('Closed');
    },
    openSurvey() {
      this.setPkSurvey();
      this.trackSurvey('Answered');
    },
    /**
     * set showPaperWallet to false
     * to close the modal
     */
    closePaperWallet() {
      if (this.showPaperWallet) this.$router.go(-1);
      this.showPaperWallet = false;
    },
    setup() {
      this.processNetworkTokens();
      this.subscribeToBlockNumber();
    },
    async checkNetwork() {
      const matched = await matchNetwork(
        this.network.type.chainID,
        this.identifier
      );
      this.setValidNetwork(matched);
    },
    processNetworkTokens() {
      this.network.type.tokens.then(res => {
        const tokenMap = new Map();
        res.forEach(item => {
          tokenMap.set(item.address.toLowerCase(), item);
        });
        this.setNetworkTokens(tokenMap);
      });
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
      const wallet = new Web3Wallet(acc[0]);
      this.setWallet([wallet, this.selectedEIP6963Provider]);
    }
  }
};
</script>

<style lang="scss">
.survey-dialog {
  &.position-right {
    position: absolute !important;
    right: 30px !important;
    top: 55% !important;
  }

  .v-expansion-panel-content__wrap {
    padding: 0 0 32px 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.inner-container {
  background-color: white;
  border-top: 8px solid var(--v-greenPrimary-base);
}

.wallet-main {
  background-color: var(--v-bgWallet-base);
  height: 100%;
}
</style>
