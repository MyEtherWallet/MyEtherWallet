<template>
  <div>
    <success-modal
      :show-success-modal="showSuccessModal"
      :show-success-swap="showSuccessSwap"
      :success-title="successTitle"
      :reset-success="resetSuccess"
      :reset="reset"
      :network="network"
      :links="links"
      :success-body-text="successBodyText"
      :has-close-button="false"
    />
    <cross-chain-confirmation
      :show-cross-chain-modal="showCrossChainModal"
      :tx-obj="tx"
      :title="title"
      :reset="rejectTransaction"
      :sent-btc="sendCrossChain"
      @close="rejectTransaction"
    />
    <app-modal
      :show="showTxOverlay"
      :title="title !== '' ? title : 'Confirmation'"
      :close="rejectTransaction"
      :btn-action="btnAction"
      :btn-enabled="disableBtn"
      :btn-text="toNonEth ? 'Proceed with swap' : 'Confirm & Send'"
      :scrollable="true"
      :anchored="true"
      width="650"
    >
      <template #dialogBody>
        <v-card-text ref="scrollableContent" class="py-0 px-4 px-md-0">
          <div class="px-4 py-6 pr-6 textBlack2--text border-radius--5px mb-5">
            <b>Please double check everything.</b> MEW team will not be able to
            reverse your transaction once it's submitted. You will still be
            charged gas fee even if the transaction fails.
            <a
              :href="getArticle('my-txn-failed-charged')"
              target="_blank"
              rel="noopener noreferrer"
              >Learn more.</a
            >
          </div>
          <div v-if="!isContractCreation">
            <confirmation-send-transaction-details
              v-if="!isSwap"
              :to="txTo"
              :network="network"
              :tx-fee="txFee"
              :tx-fee-usd="txFeeUSD"
              :value="value"
              :to-tx-data="tx.toTxData"
              :to-details="allToDetails"
              :send-currency="sendCurrency"
              :is-web3-wallet="hasGasPriceOption"
            />
            <confirmation-swap-transaction-details
              v-else
              :to="swapInfo.to"
              :from="swapInfo.from"
              :from-img="swapInfo.fromImg"
              :from-type="swapInfo.fromType"
              :to-type="swapInfo.toType"
              :to-img="swapInfo.toImg"
              :from-val="swapInfo.fromVal"
              :to-val="swapInfo.toVal"
              :provider="swapInfo.selectedProvider"
              :to-usd="swapInfo.toUsdVal"
              :from-usd="swapInfo.fromUsdVal"
              :tx-fee="swapInfo.txFee"
              :gas-price-type="swapInfo.gasPriceType"
              :is-hardware="isHardware"
              :is-to-non-eth="toNonEth"
              :to-currency="swapInfo.toType"
              :to-address="swapInfo.to"
            />
          </div>

          <!-- Ledger Warning Sheet -->
          <div
            v-if="isOnLedger"
            class="ledger-warning d-flex justify-space-between px-4 py-6 border-radius--5px mb-5"
          >
            <div>
              <v-img
                :src="
                  require('@/assets/images/icons/hardware-wallets/Ledger-Nano-X-Label-Icon.svg')
                "
                alt="Ledger Wallet"
                max-width="11em"
                max-height="2.5em"
                contain
                class="ml-15"
              />
            </div>
            <span class="textBlack2--text ml-2">
              <b>Using Ledger?</b> Consider turning off 'debug data' before
              proceeding. Additional steps associated with the 'debug feature'
              on Ledger may be required to approve this transaction.
            </span>
          </div>
          <!-- transaction details -->
          <confirm-with-wallet
            v-if="showConfirmWithWallet"
            :tx-length="unsignedTxArr.length > 0 ? unsignedTxArr.length : 1"
            :signed="signingPending"
            :error="error"
          />

          <v-expansion-panels
            v-model="panel"
            accordion
            multiple
            flat
            class="expansion-border"
          >
            <v-expansion-panel
              v-for="(transaction, i) in transactions"
              :key="`${transaction.title}${transaction.value}${i}`"
              :class="{
                'expansion-panel-border-bottom':
                  transactions.length > 1 && i !== transactions.length - 1
              }"
              class="bgWalletBlockDark"
              @click="scrollToElement(i)"
            >
              <v-expansion-panel-header
                :disable-icon-rotate="signing"
                class="expansion-header"
              >
                <v-row class="align-center pr-7 pl-2">
                  <p class="ma-0 pl-1">
                    <span class="font-weight-bold"
                      >Transaction
                      {{ transactions.length > 1 ? `${i + 1}` : `details` }}
                    </span>
                    <br />
                    <span
                      v-if="isBatch"
                      class="ma-0 mew-label greyPrimary--text"
                      >{{ isSwap ? 'Swap ' : '' }} part {{ i + 1 }} -
                      {{ callDataToAction(unsignedTxArr[i]) }}</span
                    >
                    <span
                      v-else-if="callDataToAction(tx) !== ''"
                      class="ma-0 mew-label greyPrimary--text"
                      >{{ callDataToAction(tx) }}</span
                    >
                  </p>
                  <v-spacer />
                  <div v-if="signing">
                    <v-progress-circular
                      v-show="
                        error === '' && isBatch && signedTxArray.length < i + 1
                      "
                      indeterminate
                      color="greenPrimary"
                      size="20"
                      width="2"
                      class="pr-7"
                    />
                    <v-progress-circular
                      v-show="
                        !isBatch && Object.keys(signedTxObject).length === 0
                      "
                      indeterminate
                      color="greenPrimary"
                      size="20"
                      width="2"
                      class="pr-7"
                    />
                    <v-icon
                      v-show="
                        !isBatch && Object.keys(signedTxObject).length !== 0
                      "
                      color="greenPrimary"
                    >
                      mdi-check
                    </v-icon>
                    <v-icon
                      v-show="
                        error === '' && isBatch && signedTxArray.length >= i + 1
                      "
                      color="greenPrimary"
                    >
                      mdi-check
                    </v-icon>
                  </div>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content :id="i">
                <div class="pa-6 pt-0">
                  <v-row
                    v-for="txVal in transaction"
                    :key="`${txVal.title}${txVal.value}`"
                    class="d-flex justify-space-between mt-3"
                    no-gutters
                  >
                    <v-col
                      v-if="shouldDisplayDetail(txVal.title)"
                      cols="12"
                      md="3"
                      class="d-flex d-sm-block ma-0 greyPrimary--text"
                    >
                      {{ txVal.title }}
                    </v-col>

                    <v-col
                      v-if="shouldDisplayDetail(txVal.title)"
                      cols="12"
                      md="9"
                    >
                      <scroll-block>
                        <div class="data-values text-md-right">
                          {{ txVal.value }}
                        </div>
                      </scroll-block>
                    </v-col>
                  </v-row>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <div v-if="toNonEth" class="pt-4">
            By clicking 'Proceed with swap', I agree to the
            <a href="https://changelly.com/aml-kyc" target="_blank">
              Changelly AML/KYC
            </a>
            and
            <router-link :to="termRoute" target="_blank"
              >Terms of Service</router-link
            >
          </div>
        </v-card-text>
      </template>
    </app-modal>
    <!--
    ====================================================================================
      Sign Message Confirmation
    =====================================================================================
    -->
    <mew-overlay
      :footer="footer"
      :show-overlay="showSignOverlay"
      :title="title ? title : 'Message'"
      :close="reset"
      content-size="large"
    >
      <ConfirmationMessage
        ref="messageConfirmationContainer"
        :msg="signature"
        :copy="copyToClipboard"
      />
    </mew-overlay>
  </div>
</template>

<script setup>
import {
  defineAsyncComponent,
  ref,
  computed,
  watch,
  onBeforeMount,
  onBeforeUnmount,
  onMounted
} from 'vue';
import {
  fromWei,
  hexToNumberString,
  hexToNumber,
  toWei,
  sha3,
  isHex
} from 'web3-utils';
import { isEmpty, isArray, cloneDeep } from 'lodash';

import BigNumber from 'bignumber.js';
import * as locStore from 'store';

import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import EventNames from '@/utils/web3-provider/events.js';

import { Toast, SUCCESS } from '@/modules/toast/handler/handlerToast';
import parseTokenData from './handlers/parseTokenData';
import { EventBus } from '@/core/plugins/eventBus';
import { setEvents } from '@/utils/web3-provider/methods/utils';
import { sanitizeHex } from '@/modules/access-wallet/common/helpers';
import dataToAction from './handlers/dataToAction';
import { SWAP } from '@/modules/analytics-opt-in/handlers/configs/events.js';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import errorHandler from './handlers/errorHandler';
import { useAmplitude } from '@/core/composables/amplitude';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import { useVuetify } from '@/core/composables/vuetify';
import { useI18n } from 'vue-i18n-composable';
import { useArticleStore } from '@/core/store/article';
import { useAddressBookStore } from '@/core/store/addressBook';

const ScrollBlock = defineAsyncComponent(() =>
  import('./components/ScrollBlock')
);
const ConfirmationMessage = defineAsyncComponent(() =>
  import('./components/ConfirmationMessage')
);
const ConfirmationSwapTransactionDetails = defineAsyncComponent(() =>
  import('./components/ConfirmationSwapTransactionDetails')
);
const ConfirmationSendTransactionDetails = defineAsyncComponent(() =>
  import('./components/ConfirmationSendTransactionDetails')
);
const ConfirmWithWallet = defineAsyncComponent(() =>
  import('./components/ConfirmWithWallet')
);
const SuccessModal = defineAsyncComponent(() =>
  import('./components/SuccessModal')
);
const CrossChainConfirmation = defineAsyncComponent(() =>
  import('./components/CrossChainConfirmation')
);

// injections/use
const vuetify = useVuetify();
const { trackSwapAmplitude, trackDapp } = useAmplitude();
const {
  instance,
  web3,
  identifier,
  isHardware,
  isOfflineApp,
  hasGasPriceOption,
  address
} = useWalletStore();
const { fiatValue } = useExternalStore();
const { network, getFiatValue } = useGlobalStore();
const { getArticle } = useArticleStore();
const { addressBookStore } = useAddressBookStore();
const { t } = useI18n();

// data
const footer = ref({
  text: 'Need help?',
  linkTitle: 'Contact support',
  link: 'mailto:support@myetherwallet.com'
});
const showTxOverlay = ref(false);
const showSignOverlay = ref(false);
const showSuccessModal = ref(false);
const showSuccessSwap = ref(false);
const showCrossChainModal = ref(false);
const toNonEth = ref(false);
const isSwap = ref(false);
const tx = ref({});
const resolver = ref(() => {});
const title = ref('');
const signedTxObject = ref({});
const signature = ref('');
const unsignedTxArr = ref([]);
const signedTxArray = ref([]);
const swapInfo = ref({});
const sendCurrency = ref({});
const toDetails = ref({});
const signing = ref(false);
const links = ref({
  explorer: ''
});
const error = ref('');
const panel = ref([]);
const termRoute = `/${ROUTES_HOME.TERMS_OF_SERVICE.PATH}`;
const scrollableContent = ref(null);
const messageConfirmationContainer = ref(null);

// computed
const isContractCreation = computed(() => {
  return !txTo.value;
});
const txTo = computed(() => {
  if (!isBatch.value)
    return tx.value.hasOwnProperty('toTxData')
      ? tx.value.toTxData.to
      : tx.value.to;
  return unsignedTxArr.value[0].to;
});
const isOtherWallet = computed(() => {
  return (
    identifier === WALLET_TYPES.MEW_CONNECT ||
    identifier === WALLET_TYPES.WALLET_LINK
  );
});
const isOnLedger = computed(() => {
  return tx.value.data !== '0x' && identifier === WALLET_TYPES.LEDGER;
});
const isNotSoftware = computed(() => {
  return isHardware || hasGasPriceOption || isOtherWallet.value;
});
const showConfirmWithWallet = computed(() => {
  return isNotSoftware.value && (signing.value || error.value !== '');
});
const transactions = computed(() => {
  const newArr =
    unsignedTxArr.value.length > 0
      ? [].concat(unsignedTxArr.value)
      : isEmpty(tx)
      ? []
      : [tx];
  return arrayParser(newArr);
});
const allToDetails = computed(() => {
  const toNickname = addressBookStore.value.find(item => {
    return tx.value.to?.toLowerCase() === item.address?.toLowerCase();
  });
  return {
    ensName: toDetails.value.type === 'RESOLVED' ? toDetails.value : '',
    nickname: toNickname ? toNickname.nickname : '',
    selected: toDetails.value.type
  };
});
const gasPrice = computed(() => {
  if (!isBatch.value) {
    const locGasPrice = tx.value.gasPrice ? tx.value.gasPrice : '0x';
    return fromWei(hexToNumberString(locGasPrice), 'gwei');
  }

  const batchGasPrice = unsignedTxArr.value[0].gasPrice;
  return fromWei(hexToNumberString(batchGasPrice), 'gwei');
});
const gasLimit = computed(() => {
  if (!isBatch.value) {
    const gasLimit = tx.value.gasLimit
      ? tx.value.gasLimit
      : tx.value.gas
      ? tx.value.gas
      : '0x';
    return hexToNumberString(gasLimit);
  }
  const batchGasPrice = unsignedTxArr.value.reduce((acc, currentValue) => {
    return acc.plus(currentValue.gas);
  }, BigNumber(0));
  return hexToNumberString(batchGasPrice);
});
const txFee = computed(() => {
  const parsedTxFee = BigNumber(toWei(gasPrice, 'gwei'))
    .times(gasLimit.value)
    .toString();
  return fromWei(parsedTxFee);
});
const txFeeUSD = computed(() => {
  return getFiatValue(BigNumber(txFee).times(fiatValue.value).toFixed(2));
});
const value = computed(() => {
  if (!isBatch.value) {
    const parsedValue = tx.value
      ? tx.value.hasOwnProperty('toTxData')
        ? tx.value.toTxData.amount
        : fromWei(hexToNumberString(tx.value))
      : '0x';
    return parsedValue;
  }
  return '0';
});
const disableBtn = computed(() => {
  if (error.value !== '') return true;
  if (!signing.value) return true;
  if (isBatch.value && identifier === WALLET_TYPES.LEDGER) {
    return false;
  }
  return txSigned.value;
});
const txSigned = computed(() => {
  return isBatch.value
    ? signedTxArray.value.length > 0 &&
        signedTxArray.value.length === unsignedTxArr.value.length
    : !isEmpty(signedTxObject.value);
});
const isBatch = computed(() => {
  return unsignedTxArr.value.length > 0;
});
const signingPending = computed(() => {
  if (isBatch.value) {
    return unsignedTxArr.value.length === signedTxArray.value.length;
  }
  return !isEmpty(signedTxObject.value);
});
/**
 * Property returns string, deodning whether or not this is a swap or send
 */
const successTitle = computed(() => {
  return showSuccessSwap.value ? 'Swap initiated' : 'Transaction initiated';
});
/**
 * Property returns string, depending whether or not this is a swap or send
 */
const successBodyText = computed(() => {
  return showSuccessSwap.value
    ? 'Once completed, the token amount will be deposited to your wallet. This should take a few minutes depending on how congested the Ethereum network is.'
    : 'Once completed, the token amount will be deposited to the address you provided. This should take a few minutes depending on how congested the Ethereum network is.';
});

// watch
watch(
  () => error,
  newVal => {
    /**
     * Reset signed values if any of the tx in batch is declined
     */
    if (newVal !== '') {
      signedTxArray.value = [];
      signedTxObject.value = {};
    }
  }
);
/**
 * Closes modal then brings it back to the start fetching new address data
 */
watch(
  () => address,
  newVal => {
    if (newVal) {
      resetSuccess();
    }
  }
);
watch(
  () => signedTxArray,
  newVal => {
    if (
      hasGasPriceOption &&
      newVal.length !== 0 &&
      newVal.length === unsignedTxArr.value.length
    ) {
      showTxOverlay.value = false;
      showSuccess(newVal);
    }
  },
  {
    deep: true,
    immediate: true
  }
);

// created
onBeforeMount(() => {
  /**
   * receives an @Array
   * arr[0] is the tx
   * arr[1] is the to details (nickname, ens name)
   * arr[2] is the selected currency
   */
  EventBus.$on(EventNames.SHOW_TX_CONFIRM_MODAL, async (tx, resFunc) => {
    parseRawData(tx[0]);
    title.value = 'Transaction Confirmation';
    tx.value = tx[0];
    resolver.value = resFunc;
    showTxOverlay.value = true;
    tx.transactionFee.value = txFee;
    isSwap.value = false; // reset isSwap
    error.value = '';
    tx.value[0].transactionFee = txFee;
    if (!tx.value[0].to) {
      title.value = 'Contract creation';
    }
    if (tx.value.length > 1) {
      toDetails.value = tx[1];
      sendCurrency.value = tx[2] ? tx[2] : {};
    }
  });
  /**
   * receives an @Array
   * arr[0] is the tx
   * arr[1] is the swap information
   */
  EventBus.$on(EventNames.SHOW_SWAP_TX_MODAL, async (arr, resFunc) => {
    tx.value = arr[0];
    swapInfo.value = arr[1];
    resolver.value = resFunc;
    showTxOverlay.value = true;
    title.value = 'Verify Swap';
    error.value = '';
    toNonEth.value = !swapInfo.value.toTokenType.isEth;
    isSwap.value = true;
    trackSwapAmplitude(SWAP.VERIFY_PAGE_SHOWN);
  });

  /**
   * receives an @Array
   * arr[0] is the tx that may have confirmInfo
   * which identifies the transaction as a swap tx
   */
  EventBus.$on(EventNames.SHOW_BATCH_TX_MODAL, async (arr, resFunc) => {
    error.value = '';
    if (arr[0].hasOwnProperty('confirmInfo')) {
      swapInfo.value = arr[0].confirmInfo;
      title.value = 'Verify Swap';
      isSwap.value = true; // reset isSwap
    } else {
      isSwap.value = false; // reset isSwap
    }
    unsignedTxArr.value = arr;
    if (!resolver.value) resolver.value = () => {};
    resolver.value = resFunc;
    showTxOverlay.value = true;
  });
  EventBus.$on(EventNames.SHOW_MSG_CONFIRM_MODAL, (msg, resFunc) => {
    title.value = 'Message Signed';
    isSwap.value = false; // reset isSwap
    error.value = '';
    instance.value
      .signMessage(msg)
      .then(res => {
        const result = Buffer.from(res).toString('hex');
        signature.value = JSON.stringify(
          {
            address: address.value,
            msg: msg,
            sig: result,
            version: '3',
            signer: isHardware ? identifier : 'MEW'
          },
          null,
          2
        );
        resFunc(result);
        showSignOverlay.value = true;
      })
      .catch(e => {
        reset();
        instance.value.errorHandler(e);
      });
  });
  /**
   * receives an @Object which contains info about the currency and rates
   * and a resolver which resets the module confirmation
   */
  EventBus.$on(EventNames.SHOW_CROSS_CHAIN_MODAL, (txObj, resFunc) => {
    title.value = `Send ${txObj.fromType}`;
    tx.value = txObj;
    error.value = '';
    showCrossChainModal.value = true;
    resolver.value = val => {
      resFunc(val);
      reset();
    };
  });
});

// destroy
onBeforeUnmount(() => {
  EventBus.$off(EventNames.SHOW_TX_CONFIRM_MODAL);
  EventBus.$off(EventNames.SHOW_SWAP_TX_MODAL);
  EventBus.$off(EventNames.SHOW_MSG_CONFIRM_MODAL);
  EventBus.$off(EventNames.SHOW_CROSS_CHAIN_MODAL);
});

// mounted
onMounted(() => {
  if (isOfflineApp) {
    footer.value = {
      text: 'Need help? Email us at support@myetherwallet.com',
      linkTitle: '',
      link: ''
    };
  }
});

// methods
const shouldDisplayDetail = name => {
  if (hasGasPriceOption && name === 'Gas Price') {
    return false;
  }
  return true;
};
const rejectTransaction = value => {
  if (isSwap.value) {
    trackSwapAmplitude(SWAP.CANCELLED, {
      type: value
    });
  }
  resolver({ rejected: true });
  reset();
};
const sendCrossChain = bool => {
  trackSwapAmplitude(SWAP.CONFIRMED_CLICKED);
  resolver(bool);
};
const callDataToAction = data => {
  return dataToAction(data);
};
/**
 * Methods scrolls to an element if element is open on click.
 * Has To be a timeoute, on order to wait for the element to be open
 */
const scrollToElement = _id => {
  setTimeout(() => {
    if (panel.value.includes(_id)) {
      const foundPanel = document.getElementById(_id);
      const wrapper = scrollableContent.value;
      const options = { duration: 500, offset: -60 };
      vuetify.goTo(foundPanel, { container: wrapper, ...options });
    }
  }, 500);
};

const resetSuccess = () => {
  trackSwapAmplitude(SWAP.INITIAL_MODAL_CLOSED, {
    type: showSuccessSwap.value
      ? SWAP.SWAP_INITIATED
      : SWAP.TRANSACTION_INITIATED
  });
  showSuccessSwap.value = false;
  reset();
  isSwap.value = false;
};

const reset = () => {
  showTxOverlay.value = false;
  showSignOverlay.value = false;
  showSuccessModal.value = false;
  showSuccessSwap.value = false;
  showCrossChainModal.value = false;
  toNonEth.value = false;
  tx.value = {};
  resolver.value = () => {};
  title.value = '';
  signedTxObject.value = {};
  signature.value = '';
  unsignedTxArr.value = [];
  signedTxArray.value = [];
  swapInfo.value = {};
  sendCurrency.value = {};
  toDetails.value = {};
  signing.value = false;
  links.value = {
    explorer: ''
  };
  error.value = '';
};

const parseRawData = tx => {
  let tokenData = {};
  if (
    tx.value.to &&
    tx.value.data &&
    tx.value.data.substr(0, 10) === '0xa9059cbb'
  ) {
    tokenData = parseTokenData(tx.value.data, tx.value.to);
    tx.value.fromTxData = {
      currency: network.value.type.currencyName,
      amount: tx.value.amount
    };
    tx.value.toTxData = {
      currency: tokenData.tokenSymbol,
      amount: tokenData.tokenTransferVal,
      to: tokenData.tokenTransferTo
    };
  }
  tx.value.network = network.value.type.name;
};

const sendBatchTransaction = () => {
  const _method = 'sendSignedTransaction';
  const _arr = signedTxArray.value;
  const promises = _arr.map((tx, idx) => {
    const _tx = tx.tx;
    _tx.from = address.value;
    const _rawTx = tx.rawTransaction;
    const promiEvent = web3.value.eth[_method](_rawTx);
    _tx.network = network.value.type.name;
    _tx.gasPrice = isHex(_tx.gasPrice)
      ? hexToNumberString(_tx.gasPrice)
      : _tx.gasPrice;
    _tx.transactionFee = fromWei(
      BigNumber(_tx.gasPrice).times(_tx.gas).toString()
    );
    _tx.gasLimit = _tx.gas;
    setEvents(promiEvent, _tx);
    promiEvent
      .once('receipt', receipt => {
        if (isSwap.value && idx + 1 === _arr.length) {
          const hash = receipt.transactionHash;
          trackSwapTransactionReceipt(hash);
        }
      })
      .on('transactionHash', hash => {
        const storeKey = sha3(
          `${network.value.type.name}-${address.value.toLowerCase()}`
        );
        const localStoredObj = locStore.get(storeKey);
        locStore.set(storeKey, {
          nonce: sanitizeHex(
            new BigNumber(localStoredObj.nonce).plus(1).toString(16)
          ),
          timestamp: localStoredObj.timestamp
        });
        if (idx + 1 === _arr.length) {
          if (isSwap.value) {
            showSuccessSwap.value = true;
            trackSwapTransactionBroadcasted(hash);
          }
          reset();
          showSuccess(hash);
        }
      })
      .catch(err => {
        if (isSwap.value && idx + 1 === _arr.length) {
          if (rejectedError(err.message)) {
            trackSwapAmplitude(SWAP.REJECTED);
          } else {
            emitSwapTxFail(err);
          }
        }
      });
    return promiEvent;
  });
  resolver(promises);
};

const sendSignedTx = () => {
  const hash = signedTxObject.value.tx.hash;
  resolver.value(signedTxObject.value);
  if (isSwap.value) {
    showSuccessSwap.value = true;
  }
  if (tx.value.data && tx.value.data.includes('0x33aaf6f2')) {
    trackDapp('ethBlocksMinted');
  }
  reset();
  showSuccess(hash);
};

const showSuccess = param => {
  if (isArray(param)) {
    const lastHash = param[param.length - 1].tx.hash;
    links.value.explorer = network.value.type.blockExplorerTX.replace(
      '[[txHash]]',
      lastHash
    );
    showSuccessModal.value = true;
    if (isSwap.value) {
      trackSwapTransactionSuccessful(param);
    }
    return;
  }

  links.value.explorer = network.value.type.blockExplorerTX.replace(
    '[[txHash]]',
    param
  );
  showSuccessModal.value = true;
  if (isSwap.value) {
    trackSwapTransactionSuccessful(param);
  }
  isSwap.value = false;
};

const trackSwapTransactionSuccessful = param => {
  trackSwapAmplitude(SWAP.SUCCESS, {
    hash: param,
    network: network.value.type.chainID
  });
};
const trackSwapTransactionReceipt = param => {
  trackSwapAmplitude(SWAP.RECEIPT, {
    hash: param,
    network: network.value.type.chainID
  });
};
const trackSwapTransactionBroadcasted = res => {
  trackSwapAmplitude(SWAP.BROADCASTED, {
    hash: res,
    network: network.value.type.chainID
  });
};

const signTx = async () => {
  if (isNotSoftware.value) {
    signing.value = true;
  }
  if (hasGasPriceOption) {
    const event = instance.value.signTransaction(tx);
    event
      .on('transactionHash', res => {
        if (isSwap.value) {
          trackSwapTransactionBroadcasted(res);
        }
        showTxOverlay.value = false;
        showSuccess(res);
      })
      .once('receipt', receipt => {
        if (isSwap.value) {
          const hash = receipt.transactionHash;
          trackSwapTransactionReceipt(hash);
        }
      })
      .catch(e => {
        if (isSwap.value) {
          if (rejectedError(e.message)) {
            trackSwapAmplitude(SWAP.REJECTED);
          } else {
            emitSwapTxFail(e);
          }
        }
        signedTxObject.value = {};
        error.value = errorHandler(e);
        signing.value = false;
      });
    resolver(event);
  } else {
    await instance.value
      .signTransaction(tx)
      .then(res => {
        signedTxObject.value = res;
        if (txSigned.value) {
          btnAction();
        }
      })
      .catch(e => {
        if (isSwap.value) {
          trackSwapAmplitude(SWAP.REJECTED);
        }
        signedTxObject.value = {};
        error.value = errorHandler(e);
        signing.value = false;
        const toastError = errorHandler(e, true);
        if (toastError) instance.value.errorHandler(toastError);
      });
  }
};

const signBatchTx = async () => {
  const signed = [];
  const batchTxEvents = [];
  if (isNotSoftware.value) {
    signing.value = true;
  }
  for (let i = 0; i < unsignedTxArr.value.length; i++) {
    const objClone = cloneDeep(unsignedTxArr.value[i]);
    // fixes circular reference for signing
    delete objClone['handleNotification'];
    delete objClone['currency'];
    delete objClone['confirmInfo'];
    try {
      if (!hasGasPriceOption) {
        const _signedTx = await instance.value.signTransaction(objClone);
        if (unsignedTxArr.value[i].hasOwnProperty('handleNotification')) {
          _signedTx.tx['handleNotification'] =
            unsignedTxArr.value[i].handleNotification;
        }
        signed.push(_signedTx);
        if (isHardware.value && txSigned.value) {
          btnAction();
        }
      } else {
        await instance.value
          .signTransaction(objClone)
          .then(event => {
            const hash = event.transactionHash;
            signed.push({
              tx: {
                hash: hash
              }
            });
            batchTxEvents.push(event);
            const storeKey = sha3(
              `${network.value.type.name}-${address.value.toLowerCase()}`
            );
            const localStoredObj = locStore.get(storeKey);
            locStore.set(storeKey, {
              nonce: sanitizeHex(
                new BigNumber(localStoredObj.nonce).plus(1).toString(16)
              ),
              timestamp: localStoredObj.timestamp
            });
            if (isSwap.value && i + 1 === unsignedTxArr.value.length) {
              trackSwapTransactionReceipt(hash);
            }
          })
          .catch(e => {
            if (isSwap.value) {
              if (rejectedError(e.message)) {
                trackSwapAmplitude(SWAP.REJECTED);
                throw new Error(e.message);
              } else {
                emitSwapTxFail(e);
              }
            }
            signing.value = false;
            instance.value.errorHandler(e.message);
            throw new Error(e.message);
          });
      }
      signedTxArray.value = signed;
    } catch (err) {
      if (isSwap.value && !hasGasPriceOption) {
        emitSwapTxFail(err);
      }
      error.value = errorHandler(err);
      signedTxArray.value = [];
      if (rejectedError(err.message) && signed.length > 0) {
        resolver(
          new Error('Batch transaction rejected in between transactions!')
        );
      } else {
        resolver(new Error(err.message));
      }
      // close modal if user
      // rejected in between multiple
      // transaction
      if (signed.length > 0) {
        reset();
      }
      return;
    }
  }
  if (!hasGasPriceOption && !isHardware && !isOtherWallet.value) {
    signing.value = false;
  }
  if (hasGasPriceOption) resolver(batchTxEvents);
};

const rejectedError = msg => {
  return (
    msg === 'MetaMask Tx Signature: User denied transaction signature.' ||
    msg === 'User Rejected Request: The user rejected the request.'
  );
};

const emitSwapTxFail = err => {
  const hash = err?.receipt?.transactionHash;
  trackSwapAmplitude(SWAP.FAILED, {
    hash: hash,
    network: network.value.type.chainID
  });
};

const btnAction = () => {
  if (isSwap.value) {
    trackSwapAmplitude(SWAP.CONFIRM_CLICKED);
  }
  if (!hasGasPriceOption) {
    if (
      (signedTxArray.value.length === 0 ||
        signedTxArray.value.length < unsignedTxArr.value.length) &&
      isEmpty(signedTxObject)
    ) {
      isBatch.value ? signBatchTx() : signTx();
      return;
    }
    isBatch.value ? sendBatchTransaction() : sendSignedTx();
    return;
  }
  isBatch.value ? signBatchTx() : signTx();
};

const copyToClipboard = () => {
  messageConfirmationContainer.value.signatureContent.value.input.select();
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
  Toast(t('common.copied'), {}, SUCCESS);
  reset();
};

const arrayParser = arr => {
  const newArr = arr.map(item => {
    const gasLimit = item.gasLimit ? item.gasLimit : item.gas ? item.gas : '0x';
    const gasPrice = item.gasPrice ? item.gasPrice : '0x';
    const data = item.data
      ? item.data
      : item.hasOwnProperty('encodeABI')
      ? item.encodeABI()
      : '0x';
    const symbol = isEmpty(sendCurrency.value)
      ? network.value.type.currencyName
      : sendCurrency.value.symbol;
    const value =
      data !== '0x'
        ? !isSwap.value && !isBatch.value
          ? `${item.value} ${symbol}`
          : `0 ${network.value.type.currencyName}`
        : `${item.value} ${symbol}`;
    const from = item.from ? item.from : address.value;
    const toAdd = isContractCreation.value
      ? ''
      : item.to
      ? item.to
      : txTo.value;
    return [
      {
        title: 'Network',
        value: network.value.type.name_long
      },
      {
        title: 'From ENS',
        value: ''
      },
      {
        title: 'From address',
        value: from
      },
      {
        title:
          data !== '0x' && !isBatch.value
            ? 'Via Contract Address'
            : 'To address',
        value: toAdd
      },
      {
        title: 'Sending',
        value: value
      },
      {
        title: 'Gas Price',
        value: fromWei(hexToNumberString(gasPrice), 'gwei') + ' gwei'
      },
      {
        title: 'Gas Limit',
        value: hexToNumberString(gasLimit)
      },
      // {
      //   title: 'Transaction fee',
      //   value: `${this.txFee} ${this.network.value.type.currencyName} ~ $${this.txFeeUSD}`
      // },
      {
        title: 'Nonce',
        value: hexToNumber(item.nonce)
      },
      {
        title: 'Data',
        value: data
      }
    ].filter(item => {
      if (item.value !== '') return item;
    });
  });
  return newArr;
};
</script>
<style lang="scss" scoped>
$borderPanels: 1px solid var(--v-greyLight-base) !important;

.data-values {
  overflow-wrap: break-word;
}
.expansion-header {
  height: 60px;
}
.ledger-warning {
  border: 1px solid #d7dae3;
}
</style>
