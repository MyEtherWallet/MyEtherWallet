<template>
  <div class="wallet-main">
    <component :is="TheWalletSideMenu" />
    <v-main>
      <v-container class="pa-2 pa-md-3 mb-14" fluid>
        <component :is="TheWalletHeader" />
        <component :is="ModuleConfirmation" v-if="address" />
        <router-view />
      </v-container>
    </v-main>
    <component :is="TheWalletFooter" :is-offline-app="isOfflineApp" />
    <component
      :is="ModulePaperWallet"
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

<script setup>
import { toBN } from 'web3-utils';
import { debounce, isEqual } from 'lodash';
import moment from 'moment';
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

import useVuetify from '@/core/helpers/composeVuetify.js';

import {
  global as useGlobalStore,
  wallet as useWalletStore,
  external as useExternalStore,
  popups as usePopupsStore
} from '@/core/store/index.js';

// import handlerWallet from '@/core/mixins/handlerWallet.mixin';
// import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

import nodeList from '@/utils/networks';
import {
  ERROR,
  SUCCESS,
  Toast,
  WARNING
} from '@/modules/toast/handler/handlerToast';
import { Web3Wallet } from '@/modules/access-wallet/common';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import matchNetwork from '@/core/helpers/matchNetwork';
import { EventBus } from '@/core/plugins/eventBus';

import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import HybridWalletInterface from '@/modules/access-wallet/hybrid/handlers/walletInterface';
import sanitizeHex from '@/core/helpers/sanitizeHex';

import TheWalletSideMenu from './components-wallet/TheWalletSideMenu';
import TheWalletHeader from './components-wallet/TheWalletHeader';
import TheWalletFooter from './components-wallet/TheWalletFooter';
import ModuleConfirmation from '@/modules/confirmation/ModuleConfirmation';
import ModulePaperWallet from '@/modules/balance/ModulePaperWallet.vue';

const INTERVAL = 14000;

// Data
const tempClose = ref(false);
const showPaperWallet = ref(false);
let manualBlockSubscription;

// pinia imports
const walletStore = useWalletStore();
const globalStore = useGlobalStore();
const externalStore = useExternalStore();
const popupsStore = usePopupsStore();

// injections/use
const vuetify = useVuetify();

// computed
const showSurvey = computed(() => {
  const isPrivKey = this.identifier === WALLET_TYPES.PRIV_KEY;
  const userClosed = !tempClose.value;
  const userAnswered = !this.pkSurveyShown;
  const shownTwice = this.pkSurveyShownCounter > 2;
  return isPrivKey && userClosed && userAnswered && !shownTwice && withinDate;
});

const withinDate = computed(() => {
  const startDate = new Date('03/26/2024');
  const endDate = new Date('04/29/2024');
  return moment(new Date()).isBetween(startDate, endDate);
});

// watchers
watch(walletStore.address, newVal => {
  if (!newVal) {
    // change later
    this.$router.push({ name: ROUTES_HOME.ACCESS_WALLET.NAME });
  } else {
    setup();
    setTokensAndBalance();
  }
});

watch(globalStore.network, (newVal, oldVal) => {
  if (globalStore.online && !walletStore.isOfflineApp) {
    walletStore.web3.eth.clearSubscriptions();
    walletStore.identifier === WALLET_TYPES.WEB3_WALLET
      ? walletStore.setWeb3Instance(externalStore.selectedEIP6963Provider)
      : walletStore.setWeb3Instance();
    setup();
    if (walletStore.identifier !== WALLET_TYPES.WEB3_WALLET) {
      setTokensAndBalance();
    }

    if (
      (walletStore.identifier === WALLET_TYPES.WALLET_CONNECT ||
        walletStore.identifier === WALLET_TYPES.MEW_WALLET) &&
      newVal.type.chainID !== walletStore.instance.connection.chainId
    ) {
      walletStore.instance.connection.sendAsync(
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
            walletStore.instance.connection.switchEthereumChain(
              oldVal.type.chainID
            );

            setTimeout(() => {
              globalStore
                .setNetwork({
                  network: oldVal,
                  walletType: walletStore.identifier
                })
                .then(() => {
                  walletStore.setWeb3Instance();
                });
            }, 1000);
          }
        }
      );
    }
  }
});

watch(externalStore.coinGeckoTokens, (newVal, oldVal) => {
  if (!isEqual(newVal, oldVal)) {
    setTokensAndBalance();
  }
});

onMounted(() => {
  if (showSurvey.value) {
    popupsStore.shownPkSurveyCounter();
    // rewrite mixins to composables
    // trackSurvey('Shown')
  }
  vuetify.theme.dark = globalStore.darkMode;
  EventBus.$on('openPaperWallet', () => {
    showPaperWallet.value = true;
    // change later
    this.$router.push({
      name: ROUTES_WALLET.PRINT.NAME
    });
  });

  if (globalStore.online && !walletStore.isOfflineApp) {
    setup();
    externalStore.setTokenAndEthBalance();

    if (walletStore.identifier === WALLET_TYPES.WEB3_WALLET) {
      web3Listeners();
    }
    checkNetwork();
  }

  if (
    walletStore.identifier === WALLET_TYPES.WALLET_CONNECT ||
    walletStore.identifier === WALLET_TYPES.WALLET_LINK
  ) {
    walletStore.instance.connection.on('session_update', () => {
      walletStore.instance.connection.sendAsync(
        { method: 'eth_requestAccounts' },
        (err, res) => {
          if (res[0].toLowerCase() !== walletStore.address.toLowerCase()) {
            const newWallet = new HybridWalletInterface(
              sanitizeHex(res[0]),
              walletStore.instance.isHardware,
              walletStore.identifier,
              walletStore.instance.txSigner,
              walletStore.instance.msgSigner,
              walletStore.instance.connection,
              walletStore.instance.errorHandler,
              walletStore.instance.meta
            );
            walletStore.setWallet([newWallet]);
          }
        }
      );
    });
  }
});

onBeforeUnmount(() => {
  EventBus.$off('openPaperWallet');
  if (globalStore.online && !walletStore.isOfflineApp)
    walletStore.web3.eth.clearSubscriptions();
  const provider = externalStore.selectedEIP6963Provider;
  if (provider && provider.removeListener instanceof Function) {
    if (findAndSetNetwork instanceof Function)
      provider.removeListener('chainChanged', findAndSetNetwork);
    if (setWeb3Account instanceof Function)
      provider.removeListener('accountsChanged', setWeb3Account);
  }
  clearInterval(manualBlockSubscription);
});

// methods
const closeSurveyModal = () => {
  tempClose.value = true;
  // this.trackSurvey('Closed');
};

const openSurvey = () => {
  popupsStore.setPkSurvey();
  // this.trackSurvey('Answered');
};

const closePaperWallet = () => {
  if (showPaperWallet.value) this.$router.go(-1);
  showPaperWallet.value = false;
};

const setup = () => {
  processNetworkTokens();
  subscribeToBlockNumber();
};

const checkNetwork = async () => {
  const matched = await matchNetwork(
    globalStore.network.type.chainID,
    walletStore.identifier
  );
  globalStore.setValidNetwork(matched);
};

const processNetworkTokens = () => {
  globalStore.network.type.tokens.then(res => {
    const tokenMap = new Map();
    res.forEach(item => {
      tokenMap.set(item.address.toLowerCase(), item);
    });
    externalStore.setNetworkTokens(tokenMap);
  });
};

const setTokensAndBalance = () => {
  if (externalStore.coinGeckoTokens?.get) {
    externalStore.setTokenAndEthBalance();
  } else {
    walletStore.setTokens([]);
  }
};

const checkAndSetBaseFee = baseFee => {
  if (baseFee) {
    globalStore.setBaseFeePerGas(toBN(baseFee));
  } else {
    globalStore.setBaseFeePerGas(toBN('0'));
  }
  globalStore.updateGasPrice();
};

const subscribeToBlockNumber = debounce(function () {
  clearInterval(manualBlockSubscription);
  walletStore.web3.eth.getBlockNumber().then(bNumber => {
    walletStore.setBlockNumber(bNumber);
    walletStore.web3.subscribe
      .on('newBlockHeaders')
      .on('data', res => {
        if (globalStore.isEIP1559SupportedNetwork && res.baseFeePerGas) {
          checkAndSetBaseFee(toBN(res.baseFeePerGas));
        }
        walletStore.setBlockNumber(res.number);
      })
      .on('error', err => {
        const message = err.message ? err.message : err;
        if (
          message ===
            'The method eth_subscribe does not exist/is not available' ||
          (message.includes('but is disabled for Https') &&
            message.includes('eth_subscribe found for the url'))
        ) {
          return manualBlockSub();
        }
      });
  });
});

const manualBlockSub = () => {
  manualBlockSubscription = setInterval(() => {
    walletStore.web3.eth.getBlockNumber().then(bNumber => {
      walletStore.setBlockNumber(bNumber);
      walletStore.web3.eth.getBlock(bNumber).then(block => {
        if (block) {
          checkAndSetBaseFee(block.baseFeePerGas);
        }
      });
    });
  }, INTERVAL);
};

const findAndSetNetwork = async () => {
  if (
    externalStore.selectedEIP6963Provider &&
    walletStore.identifier === WALLET_TYPES.WEB3_WALLET
  ) {
    const networkId = await externalStore.selectedEIP6963Provider?.request({
      method: 'eth_chainId'
    });

    const foundNetwork = Object.values(nodeList).find(item => {
      if (toBN(networkId).eq(toBN(item[0].type.chainID))) return item;
    });
    if (externalStore.selectedEIP6963Provider) {
      try {
        if (foundNetwork) {
          await globalStore.setNetwork({
            network: foundNetwork[0],
            walletType: walletStore.identifier
          });
          await walletStore.setWeb3Instance(
            externalStore.selectedEIP6963Provider
          );
          setTokensAndBalance();
          globalStore.setValidNetwork(true);
          this.$emit('newNetwork');
          Toast(
            `Switched network to: ${foundNetwork[0].type.name}`,
            {},
            SUCCESS
          );
        } else {
          globalStore.setValidNetwork(false);
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
};

const setWeb3Account = acc => {
  const wallet = new Web3Wallet(acc[0]);
  walletStore.setWallet([wallet, globalStore.selectedEIP6963Provider]);
};

const web3Listeners = () => {
  if (globalStore.selectedEIP6963Provider?.on) {
    globalStore.selectedEIP6963Provider.on('chainChanged', findAndSetNetwork);
    globalStore.selectedEIP6963Provider.on('accountsChanged', setWeb3Account);
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
