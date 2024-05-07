<template>
  <div class="wallet-main">
    <TheWalletSideMenu />
    <v-main>
      <v-container class="pa-2 pa-md-3 mb-14" fluid>
        <TheWalletHeader />
        <ModuleConfirmation v-if="address" />
        <router-view />
      </v-container>
    </v-main>
    <TheWalletFooter :is-offline-app="isOfflineApp" />
    <ModulePaperWallet
      :open="showPaperWallet"
      :close="closePaperWallet"
      :is-offline-app="isOfflineApp"
      :instance="instance"
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
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  defineEmits
} from 'vue';
import { useRouter } from 'vue-router/composables';

import { useVuetify } from '@/core/composables/vuetify.js';
import { useAmplitude } from '@/core/composables/amplitude.js';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

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
import { usePopupStore } from '@/core/store/popups';

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
const {
  address,
  isOfflineApp,
  web3,
  identifier,
  setWeb3Instance,
  instance,
  setWallet,
  setTokens,
  setBlockNumber
} = useWalletStore();
const {
  darkMode,
  online,
  network,
  setBaseFeePerGas,
  updateGasPrice,
  isEIP1559SupportedNetwork,
  setNetwork,
  setValidNetwork
} = useGlobalStore();
const {
  selectedEIP6963Provider,
  coinGeckoTokens,
  setNetworkTokens,
  setTokenAndEthBalance
} = useExternalStore();
const {
  shownPkSurveyCounter,
  setPkSurvey,
  pkSurveyShown,
  pkSurveyShownCounter
} = usePopupStore();

// injections/use
const vuetify = useVuetify();
const { trackSurvey } = useAmplitude();
const router = useRouter();

// events
const emit = defineEmits(['newNetwork']);

// computed
const showSurvey = computed(() => {
  const isPrivKey = identifier === WALLET_TYPES.PRIV_KEY;
  const userClosed = !tempClose.value;
  const userAnswered = !pkSurveyShown;
  const shownTwice = pkSurveyShownCounter > 2;
  return isPrivKey && userClosed && userAnswered && !shownTwice && withinDate;
});

const withinDate = computed(() => {
  const startDate = new Date('03/26/2024');
  const endDate = new Date('04/29/2024');
  return moment(new Date()).isBetween(startDate, endDate);
});

// watchers
watch(
  () => address,
  newVal => {
    if (!newVal) {
      // change later
      router.push({ name: ROUTES_HOME.ACCESS_WALLET.NAME });
    } else {
      setup();
      setTokensAndBalance();
    }
  }
);

watch(
  () => network,
  (newVal, oldVal) => {
    if (online && !isOfflineApp) {
      web3.eth.clearSubscriptions();
      identifier === WALLET_TYPES.WEB3_WALLET
        ? setWeb3Instance(selectedEIP6963Provider)
        : setWeb3Instance();
      setup();
      if (identifier !== WALLET_TYPES.WEB3_WALLET) {
        setTokensAndBalance();
      }

      if (
        (identifier === WALLET_TYPES.WALLET_CONNECT ||
          identifier === WALLET_TYPES.MEW_WALLET) &&
        newVal.type.chainID !== instance.connection.chainId
      ) {
        instance.connection.sendAsync(
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
              instance.connection.switchEthereumChain(oldVal.type.chainID);

              setTimeout(() => {
                setNetwork({
                  network: oldVal,
                  walletType: identifier
                }).then(() => {
                  setWeb3Instance();
                });
              }, 1000);
            }
          }
        );
      }
    }
  }
);

watch(
  () => coinGeckoTokens,
  (newVal, oldVal) => {
    if (!isEqual(newVal, oldVal)) {
      setTokensAndBalance();
    }
  }
);

onMounted(() => {
  if (showSurvey.value) {
    shownPkSurveyCounter();
    trackSurvey('Shown');
  }
  vuetify.theme.dark = darkMode;
  EventBus.$on('openPaperWallet', () => {
    showPaperWallet.value = true;
    // change later
    router.push({
      name: ROUTES_WALLET.PRINT.NAME
    });
  });

  if (online && !isOfflineApp) {
    setup();
    setTokenAndEthBalance();

    if (identifier === WALLET_TYPES.WEB3_WALLET) {
      web3Listeners();
    }
    checkNetwork();
  }

  if (
    identifier === WALLET_TYPES.WALLET_CONNECT ||
    identifier === WALLET_TYPES.WALLET_LINK
  ) {
    instance.connection.on('session_update', () => {
      instance.connection.sendAsync(
        { method: 'eth_requestAccounts' },
        (err, res) => {
          if (res[0].toLowerCase() !== address.toLowerCase()) {
            const newWallet = new HybridWalletInterface(
              sanitizeHex(res[0]),
              instance.isHardware,
              identifier,
              instance.txSigner,
              instance.msgSigner,
              instance.connection,
              instance.errorHandler,
              instance.meta
            );
            setWallet([newWallet]);
          }
        }
      );
    });
  }
});

onBeforeUnmount(() => {
  EventBus.$off('openPaperWallet');
  if (online && !isOfflineApp) web3.eth.clearSubscriptions();
  const provider = selectedEIP6963Provider;
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
  trackSurvey('Closed');
};

const openSurvey = () => {
  setPkSurvey();
  trackSurvey('Answered');
};

const closePaperWallet = () => {
  if (showPaperWallet.value) router.go(-1);
  showPaperWallet.value = false;
};

const setup = () => {
  processNetworkTokens();
  subscribeToBlockNumber();
};

const checkNetwork = async () => {
  const matched = await matchNetwork(network.type.chainID, identifier);
  setValidNetwork(matched);
};

const processNetworkTokens = () => {
  network.type.tokens.then(res => {
    const tokenMap = new Map();
    res.forEach(item => {
      tokenMap.set(item.address.toLowerCase(), item);
    });
    setNetworkTokens(tokenMap);
  });
};

const setTokensAndBalance = () => {
  if (coinGeckoTokens?.get) {
    setTokenAndEthBalance();
  } else {
    setTokens([]);
  }
};

const checkAndSetBaseFee = baseFee => {
  if (baseFee) {
    setBaseFeePerGas(toBN(baseFee));
  } else {
    setBaseFeePerGas(toBN('0'));
  }
  updateGasPrice();
};

const subscribeToBlockNumber = debounce(function () {
  clearInterval(manualBlockSubscription);
  web3.eth.getBlockNumber().then(bNumber => {
    setBlockNumber(bNumber);
    web3.eth
      .subscribe('newBlockHeaders')
      .on('data', res => {
        if (isEIP1559SupportedNetwork && res.baseFeePerGas) {
          checkAndSetBaseFee(toBN(res.baseFeePerGas));
        }
        setBlockNumber(res.number);
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
    web3.eth.getBlockNumber().then(bNumber => {
      setBlockNumber(bNumber);
      web3.eth.getBlock(bNumber).then(block => {
        if (block) {
          checkAndSetBaseFee(block.baseFeePerGas);
        }
      });
    });
  }, INTERVAL);
};

const findAndSetNetwork = async () => {
  if (selectedEIP6963Provider && identifier === WALLET_TYPES.WEB3_WALLET) {
    const networkId = await selectedEIP6963Provider?.request({
      method: 'eth_chainId'
    });

    const foundNetwork = Object.values(nodeList).find(item => {
      if (toBN(networkId).eq(toBN(item[0].type.chainID))) return item;
    });
    if (selectedEIP6963Provider) {
      try {
        if (foundNetwork) {
          await setNetwork({
            network: foundNetwork[0],
            walletType: identifier
          });
          await setWeb3Instance(selectedEIP6963Provider);
          setTokensAndBalance();
          setValidNetwork(true);
          emit('newNetwork');
          Toast(
            `Switched network to: ${foundNetwork[0].type.name}`,
            {},
            SUCCESS
          );
        } else {
          setValidNetwork(false);
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
  setWallet([wallet, selectedEIP6963Provider]);
};

const web3Listeners = () => {
  if (selectedEIP6963Provider?.on) {
    selectedEIP6963Provider.on('chainChanged', findAndSetNetwork);
    selectedEIP6963Provider.on('accountsChanged', setWeb3Account);
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
