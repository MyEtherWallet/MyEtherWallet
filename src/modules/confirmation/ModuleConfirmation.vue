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
                      {{ dataToAction(unsignedTxArr[i]) }}</span
                    >
                    <span
                      v-else-if="dataToAction(tx) !== ''"
                      class="ma-0 mew-label greyPrimary--text"
                      >{{ dataToAction(tx) }}</span
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
      <confirmation-messsage
        ref="messageConfirmationContainer"
        :msg="signature"
        :copy="copyToClipboard"
      />
    </mew-overlay>
  </div>
</template>

<script>
import {
  fromWei,
  hexToNumberString,
  hexToNumber,
  toWei,
  sha3,
  isHex,
  isContractAddressInBloom
} from 'web3-utils';
import { isEmpty, isArray, cloneDeep } from 'lodash';
import { mapState, mapGetters } from 'vuex';
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
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { SWAP } from '@/modules/analytics-opt-in/handlers/configs/events.js';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import errorHandler from './handlers/errorHandler';

export default {
  name: 'ModuleConfirmation',
  components: {
    ScrollBlock: () => import('./components/ScrollBlock'),
    ConfirmationMesssage: () => import('./components/ConfirmationMessage'),
    ConfirmationSwapTransactionDetails: () =>
      import('./components/ConfirmationSwapTransactionDetails'),
    ConfirmationSendTransactionDetails: () =>
      import('./components/ConfirmationSendTransactionDetails'),
    ConfirmWithWallet: () => import('./components/ConfirmWithWallet'),
    SuccessModal: () => import('./components/SuccessModal'),
    CrossChainConfirmation: () => import('./components/CrossChainConfirmation')
  },
  mixins: [handlerAnalytics],
  data() {
    return {
      footer: {
        text: 'Need help?',
        linkTitle: 'Contact support',
        link: 'mailto:support@myetherwallet.com'
      },
      showTxOverlay: false,
      showSignOverlay: false,
      showSuccessModal: false,
      showSuccessSwap: false,
      showCrossChainModal: false,
      toNonEth: false,
      isSwap: false,
      tx: {},
      resolver: () => {},
      title: '',
      signedTxObject: {},
      signature: '',
      unsignedTxArr: [],
      signedTxArray: [],
      swapInfo: {},
      sendCurrency: {},
      toDetails: {},
      signing: false,
      links: {
        explorer: ''
      },
      error: '',
      panel: [],
      termRoute: `/${ROUTES_HOME.TERMS_OF_SERVICE.PATH}`
    };
  },
  computed: {
    ...mapState('wallet', [
      'instance',
      'web3',
      'address',
      'identifier',
      'isHardware',
      'isOfflineApp'
    ]),
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network', 'getFiatValue']),
    ...mapGetters('wallet', ['hasGasPriceOption']),
    ...mapGetters('article', ['getArticle']),
    ...mapState('addressBook', ['addressBookStore']),
    isContractCreation() {
      return !this.txTo;
    },
    txTo() {
      if (!this.isBatch)
        return this.tx.hasOwnProperty('toTxData')
          ? this.tx.toTxData.to
          : this.tx.to;
      return this.unsignedTxArr[0].to;
    },
    isOtherWallet() {
      return (
        this.identifier === WALLET_TYPES.MEW_CONNECT ||
        this.identifier === WALLET_TYPES.WALLET_LINK
      );
    },
    isOnLedger() {
      return this.tx.data !== '0x' && this.identifier === WALLET_TYPES.LEDGER;
    },
    isNotSoftware() {
      return this.isHardware || this.hasGasPriceOption || this.isOtherWallet;
    },
    showConfirmWithWallet() {
      return this.isNotSoftware && (this.signing || this.error !== '');
    },
    transactions() {
      const newArr =
        this.unsignedTxArr.length > 0
          ? [].concat(this.unsignedTxArr)
          : isEmpty(this.tx)
          ? []
          : [this.tx];
      return this.arrayParser(newArr);
    },
    allToDetails() {
      const toNickname = this.addressBookStore.find(item => {
        return this.tx.to?.toLowerCase() === item.address?.toLowerCase();
      });
      return {
        ensName: this.toDetails.type === 'RESOLVED' ? this.toDetails.value : '',
        nickname: toNickname ? toNickname.nickname : '',
        selected: this.toDetails.type
      };
    },
    gasPrice() {
      if (!this.isBatch) {
        const gasPrice = this.tx.gasPrice ? this.tx.gasPrice : '0x';
        return fromWei(hexToNumberString(gasPrice), 'gwei');
      }

      const batchGasPrice = this.unsignedTxArr[0].gasPrice;
      return fromWei(hexToNumberString(batchGasPrice), 'gwei');
    },
    gasLimit() {
      if (!this.isBatch) {
        const gasLimit = this.tx.gasLimit
          ? this.tx.gasLimit
          : this.tx.gas
          ? this.tx.gas
          : '0x';
        return hexToNumberString(gasLimit);
      }
      const batchGasPrice = this.unsignedTxArr.reduce((acc, currentValue) => {
        return acc.plus(currentValue.gas);
      }, BigNumber(0));
      return hexToNumberString(batchGasPrice);
    },
    txFee() {
      const parsedTxFee = BigNumber(toWei(this.gasPrice, 'gwei'))
        .times(this.gasLimit)
        .toString();
      return fromWei(parsedTxFee);
    },
    txFeeUSD() {
      return this.getFiatValue(
        BigNumber(this.txFee).times(this.fiatValue).toFixed(2)
      );
    },
    value() {
      if (!this.isBatch) {
        const parsedValue = this.tx.value
          ? this.tx.hasOwnProperty('toTxData')
            ? this.tx.toTxData.amount
            : fromWei(hexToNumberString(this.tx.value))
          : '0x';
        return parsedValue;
      }
      return '0';
    },
    disableBtn() {
      if (this.error !== '') return true;
      if (!this.signing) return true;
      if (this.isBatch && this.identifier === WALLET_TYPES.LEDGER) {
        return false;
      }
      return this.txSigned;
    },
    txSigned() {
      return this.isBatch
        ? this.signedTxArray.length > 0 &&
            this.signedTxArray.length === this.unsignedTxArr.length
        : !isEmpty(this.signedTxObject);
    },
    isBatch() {
      return this.unsignedTxArr.length > 0;
    },
    signingPending() {
      if (this.isBatch) {
        return this.unsignedTxArr.length === this.signedTxArray.length;
      }
      return !isEmpty(this.signedTxObject);
    },
    /**
     * Property returns string, deodning whether or not this is a swap or send
     */
    successTitle() {
      return this.showSuccessSwap ? 'Swap initiated' : 'Transaction initiated';
    },
    /**
     * Property returns string, depending whether or not this is a swap or send
     */
    successBodyText() {
      return this.showSuccessSwap
        ? 'Once completed, the token amount will be deposited to your wallet. This should take a few minutes depending on how congested the Ethereum network is.'
        : 'Once completed, the token amount will be deposited to the address you provided. This should take a few minutes depending on how congested the Ethereum network is.';
    }
  },
  watch: {
    error(newVal) {
      /**
       * Reset signed values if any of the tx in batch is declined
       */
      if (newVal !== '') {
        this.signedTxArray = [];
        this.signedTxObject = {};
      }
    },
    /**
     * Closes modal then brings it back to the start fetching new address data
     */
    address(newVal) {
      if (newVal) {
        this.resetSuccess();
      }
    },
    signedTxArray: {
      handler: function (newVal) {
        if (
          this.hasGasPriceOption &&
          newVal.length !== 0 &&
          newVal.length === this.unsignedTxArr.length
        ) {
          this.showTxOverlay = false;
          this.showSuccess(newVal);
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    /**
     * receives an @Array
     * arr[0] is the tx
     * arr[1] is the to details (nickname, ens name)
     * arr[2] is the selected currency
     */
    EventBus.$on(EventNames.SHOW_TX_CONFIRM_MODAL, async (tx, resolver) => {
      this.parseRawData(tx[0]);
      this.title = 'Transaction Confirmation';
      this.tx = tx[0];
      this.resolver = resolver;
      this.showTxOverlay = true;
      this.tx.transactionFee = this.txFee;
      this.isSwap = false; // reset isSwap
      this.error = '';
      tx[0].transactionFee = this.txFee;
      if (!tx[0].to) {
        this.title = 'Contract creation';
      }
      if (tx.length > 1) {
        this.toDetails = tx[1];
        this.sendCurrency = tx[2] ? tx[2] : {};
      }
    });
    /**
     * receives an @Array
     * arr[0] is the tx
     * arr[1] is the swap information
     */
    EventBus.$on(EventNames.SHOW_SWAP_TX_MODAL, async (arr, resolver) => {
      this.tx = arr[0];
      this.swapInfo = arr[1];
      this.resolver = resolver;
      this.showTxOverlay = true;
      this.title = 'Verify Swap';
      this.error = '';
      this.toNonEth = !this.swapInfo.toTokenType.isEth;
      this.isSwap = true;
      this.trackSwapAmplitude(SWAP.VERIFY_PAGE_SHOWN);
    });

    /**
     * receives an @Array
     * arr[0] is the tx that may have confirmInfo
     * which identifies the transaction as a swap tx
     */
    EventBus.$on(
      EventNames.SHOW_BATCH_TX_MODAL,
      async (arr, resolver, isHardware) => {
        this.isHardwareWallet = isHardware;
        this.error = '';
        if (arr[0].hasOwnProperty('confirmInfo')) {
          this.swapInfo = arr[0].confirmInfo;
          this.title = 'Verify Swap';
          this.isSwap = true; // reset isSwap
        } else {
          this.isSwap = false; // reset isSwap
        }
        this.unsignedTxArr = arr;
        if (!resolver) this.resolver = () => {};
        this.resolver = resolver;
        this.showTxOverlay = true;
      }
    );
    EventBus.$on(EventNames.SHOW_MSG_CONFIRM_MODAL, (msg, resolver) => {
      this.title = 'Message Signed';
      this.isSwap = false; // reset isSwap
      this.error = '';
      this.instance
        .signMessage(msg)
        .then(res => {
          const result = Buffer.from(res).toString('hex');
          this.signature = JSON.stringify(
            {
              address: this.address,
              msg: msg,
              sig: result,
              version: '3',
              signer: this.isHardware ? this.identifier : 'MEW'
            },
            null,
            2
          );
          this.signedMessage = result;
          resolver(result);
          this.showSignOverlay = true;
        })
        .catch(e => {
          this.reset();
          this.instance.errorHandler(e);
        });
    });
    /**
     * receives an @Object which contains info about the currency and rates
     * and a resolver which resets the module confirmation
     */
    EventBus.$on(EventNames.SHOW_CROSS_CHAIN_MODAL, (txObj, resolver) => {
      this.title = `Send ${txObj.fromType}`;
      this.tx = txObj;
      this.error = '';
      this.showCrossChainModal = true;
      this.resolver = val => {
        resolver(val);
        this.reset();
      };
    });
  },
  beforeDestroy() {
    EventBus.$off(EventNames.SHOW_TX_CONFIRM_MODAL);
    EventBus.$off(EventNames.SHOW_SWAP_TX_MODAL);
    EventBus.$off(EventNames.SHOW_MSG_CONFIRM_MODAL);
    EventBus.$off(EventNames.SHOW_CROSS_CHAIN_MODAL);
  },
  mounted() {
    if (this.isOfflineApp) {
      this.footer = {
        text: 'Need help? Email us at support@myetherwallet.com',
        linkTitle: '',
        link: ''
      };
    }
  },
  methods: {
    shouldDisplayDetail(name) {
      if (this.hasGasPriceOption && name === 'Gas Price') {
        return false;
      }
      return true;
    },
    rejectTransaction(value) {
      if (this.isSwap) {
        this.trackSwapAmplitude(SWAP.CANCELLED, {
          type: value
        });
      }
      this.resolver({ rejected: true });
      this.reset();
    },
    sendCrossChain(bool) {
      this.trackSwapAmplitude(SWAP.CONFIRMED_CLICKED);
      this.resolver(bool);
    },
    dataToAction(data) {
      return dataToAction(data);
    },
    /**
     * Methods scrolls to an element if element is open on click.
     * Has To be a timeoute, on order to wait for the element to be open
     */
    scrollToElement(_id) {
      setTimeout(() => {
        if (this.panel.includes(_id)) {
          const panel = document.getElementById(_id);
          const wrapper = this.$refs.scrollableContent;
          const options = { duration: 500, offset: -60 };
          this.$vuetify.goTo(panel, { container: wrapper, ...options });
        }
      }, 500);
    },
    resetSuccess() {
      this.trackSwapAmplitude(SWAP.INITIAL_MODAL_CLOSED, {
        type: this.showSuccessSwap
          ? SWAP.SWAP_INITIATED
          : SWAP.TRANSACTION_INITIATED
      });
      this.showSuccessSwap = false;
      this.reset();
      this.isSwap = false;
    },
    reset() {
      this.showTxOverlay = false;
      this.showSignOverlay = false;
      this.showSuccessModal = false;
      this.showSuccessSwap = false;
      this.showCrossChainModal = false;
      this.toNonEth = false;
      this.tx = {};
      this.resolver = () => {};
      this.title = '';
      this.signedTxObject = {};
      this.signature = '';
      this.unsignedTxArr = [];
      this.signedTxArray = [];
      this.swapInfo = {};
      this.sendCurrency = {};
      this.toDetails = {};
      this.signing = false;
      this.links = {
        explorer: ''
      };
      this.error = '';
    },
    parseRawData(tx) {
      let tokenData = {};
      if (tx.to && tx.data && tx.data.substr(0, 10) === '0xa9059cbb') {
        tokenData = parseTokenData(tx.data, tx.to);
        tx.fromTxData = {
          currency: this.network.type.currencyName,
          amount: tx.amount
        };
        tx.toTxData = {
          currency: tokenData.tokenSymbol,
          amount: tokenData.tokenTransferVal,
          to: tokenData.tokenTransferTo
        };
      }
      tx.network = this.network.type.name;
    },
    async sendBatchTransaction() {
      const _this = this;
      const web3 = this.web3;
      const _method = 'sendSignedTransaction';
      const _arr = this.signedTxArray;
      const promises = _arr.map((tx, idx) => {
        const _tx = tx.tx;
        _tx.from = _this.address;
        const _rawTx = tx.rawTransaction;
        const promiEvent = web3.eth[_method](_rawTx);
        _tx.network = _this.network.type.name;
        _tx.gasPrice = isHex(_tx.gasPrice)
          ? hexToNumberString(_tx.gasPrice)
          : _tx.gasPrice;
        _tx.transactionFee = fromWei(
          BigNumber(_tx.gasPrice).times(_tx.gas).toString()
        );
        _tx.gasLimit = _tx.gas;
        setEvents(promiEvent, _tx, _this.$store.dispatch);
        promiEvent
          .once('receipt', receipt => {
            if (_this.isSwap && idx + 1 === _arr.length) {
              const hash = receipt.transactionHash;
              _this.trackSwapTransactionReceipt(hash);
            }
          })
          .on('transactionHash', hash => {
            const storeKey = sha3(
              `${_this.network.type.name}-${_this.address.toLowerCase()}`
            );
            const localStoredObj = locStore.get(storeKey);
            locStore.set(storeKey, {
              nonce: sanitizeHex(
                new BigNumber(localStoredObj.nonce).plus(1).toString(16)
              ),
              timestamp: localStoredObj.timestamp
            });
            if (idx + 1 === _arr.length) {
              if (_this.isSwap) {
                _this.showSuccessSwap = true;
                _this.trackSwapTransactionBroadcasted(hash);
              }
              _this.reset();
              _this.showSuccess(hash);
            }
          })
          .catch(err => {
            if (_this.isSwap && idx + 1 === _arr.length) {
              if (this.rejectedError(err.message)) {
                _this.trackSwapAmplitude(SWAP.REJECTED);
              } else {
                _this.emitSwapTxFail(err);
              }
            }
          });
        return promiEvent;
      });
      this.resolver(promises);
    },
    sendSignedTx() {
      const hash = this.signedTxObject.tx.hash;
      this.resolver(this.signedTxObject);
      if (this.isSwap) {
        this.showSuccessSwap = true;
      }
      if (this.tx.data && this.tx.data.includes('0x33aaf6f2')) {
        this.trackDapp('ethBlocksMinted');
      }
      this.reset();
      this.showSuccess(hash);
    },
    showSuccess(param) {
      if (isArray(param)) {
        const lastHash = param[param.length - 1].tx.hash;
        this.links.explorer = this.network.type.blockExplorerTX.replace(
          '[[txHash]]',
          lastHash
        );
        this.showSuccessModal = true;
        if (this.isSwap) {
          this.trackSwapTransactionSuccessful(param);
        }
        return;
      }

      this.links.explorer = this.network.type.blockExplorerTX.replace(
        '[[txHash]]',
        param
      );
      this.showSuccessModal = true;
      if (this.isSwap) {
        this.trackSwapTransactionSuccessful(param);
      }
      this.isSwap = false;
    },
    trackSwapTransactionSuccessful(param) {
      this.trackSwapAmplitude(SWAP.SUCCESS, {
        hash: param,
        network: this.network.type.chainID
      });
    },
    trackSwapTransactionReceipt(param) {
      this.trackSwapAmplitude(SWAP.RECEIPT, {
        hash: param,
        network: this.network.type.chainID
      });
    },
    trackSwapTransactionBroadcasted(res) {
      this.trackSwapAmplitude(SWAP.BROADCASTED, {
        hash: res,
        network: this.network.type.chainID
      });
    },
    async signTx() {
      if (this.isNotSoftware) {
        this.signing = true;
      }
      if (this.hasGasPriceOption) {
        const event = this.instance.signTransaction(this.tx);
        event
          .on('transactionHash', res => {
            if (this.isSwap) {
              this.trackSwapTransactionBroadcasted(res);
            }
            this.showTxOverlay = false;
            this.showSuccess(res);
          })
          .once('receipt', receipt => {
            if (this.isSwap) {
              const hash = receipt.transactionHash;
              this.trackSwapTransactionReceipt(hash);
            }
          })
          .catch(e => {
            if (this.isSwap) {
              if (this.rejectedError(e.message)) {
                this.trackSwapAmplitude(SWAP.REJECTED);
              } else {
                this.emitSwapTxFail(e);
              }
            }
            this.signedTxObject = {};
            this.error = errorHandler(e);
            this.signing = false;
          });
        this.resolver(event);
      } else {
        await this.instance
          .signTransaction(this.tx)
          .then(res => {
            this.signedTxObject = res;
            if (this.txSigned) {
              this.btnAction();
            }
          })
          .catch(e => {
            if (this.isSwap) {
              this.trackSwapAmplitude(SWAP.REJECTED);
            }
            this.signedTxObject = {};
            this.error = errorHandler(e);
            this.signing = false;
            const toastError = errorHandler(e, true);
            if (toastError) this.instance.errorHandler(toastError);
          });
      }
    },
    async signBatchTx() {
      const signed = [];
      const batchTxEvents = [];
      if (this.isNotSoftware) {
        this.signing = true;
      }
      for (let i = 0; i < this.unsignedTxArr.length; i++) {
        const objClone = cloneDeep(this.unsignedTxArr[i]);
        // fixes circular reference for signing
        delete objClone['handleNotification'];
        delete objClone['currency'];
        delete objClone['confirmInfo'];
        try {
          if (!this.hasGasPriceOption) {
            const _signedTx = await this.instance.signTransaction(objClone);
            if (this.unsignedTxArr[i].hasOwnProperty('handleNotification')) {
              _signedTx.tx['handleNotification'] =
                this.unsignedTxArr[i].handleNotification;
            }
            signed.push(_signedTx);
            if (this.isHardware && this.txSigned) {
              this.btnAction();
            }
          } else {
            await this.instance
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
                  `${this.network.type.name}-${this.address.toLowerCase()}`
                );
                const localStoredObj = locStore.get(storeKey);
                locStore.set(storeKey, {
                  nonce: sanitizeHex(
                    new BigNumber(localStoredObj.nonce).plus(1).toString(16)
                  ),
                  timestamp: localStoredObj.timestamp
                });
                if (this.isSwap && i + 1 === this.unsignedTxArr.length) {
                  this.trackSwapTransactionReceipt(hash);
                }
              })
              .catch(e => {
                if (this.isSwap) {
                  if (this.rejectedError(e.message)) {
                    this.trackSwapAmplitude(SWAP.REJECTED);
                    throw new Error(e.message);
                  } else {
                    this.emitSwapTxFail(e);
                  }
                }
                this.signing = false;
                this.instance.errorHandler(e.message);
                throw new Error(e.message);
              });
          }
          this.signedTxArray = signed;
        } catch (err) {
          if (this.isSwap && !this.hasGasPriceOption) {
            this.emitSwapTxFail(err);
          }
          this.error = errorHandler(err);
          this.signedTxArray = [];
          if (this.rejectedError(err.message) && signed.length > 0) {
            this.resolver(
              new Error('Batch transaction rejected in between transactions!')
            );
          } else {
            this.resolver(new Error(err.message));
          }
          // close modal if user
          // rejected in between multiple
          // transaction
          if (signed.length > 0) {
            this.reset();
          }
          return;
        }
      }
      if (!this.hasGasPriceOption && !this.isHardware && !this.isOtherWallet) {
        this.signing = false;
      }
      if (this.hasGasPriceOption) this.resolver(batchTxEvents);
    },
    rejectedError(msg) {
      return (
        msg === 'MetaMask Tx Signature: User denied transaction signature.' ||
        msg === 'User Rejected Request: The user rejected the request.'
      );
    },
    emitSwapTxFail(err) {
      const hash = err?.receipt?.transactionHash;
      this.trackSwapAmplitude(SWAP.FAILED, {
        hash: hash,
        network: this.network.type.chainID
      });
    },
    btnAction() {
      if (this.isSwap) {
        this.trackSwapAmplitude(SWAP.CONFIRM_CLICKED);
      }
      if (!this.hasGasPriceOption) {
        if (
          (this.signedTxArray.length === 0 ||
            this.signedTxArray.length < this.unsignedTxArr.length) &&
          isEmpty(this.signedTxObject)
        ) {
          this.isBatch ? this.signBatchTx() : this.signTx();
          return;
        }
        this.isBatch ? this.sendBatchTransaction() : this.sendSignedTx();
        return;
      }
      this.isBatch ? this.signBatchTx() : this.signTx();
    },
    copyToClipboard() {
      this.$refs.messageConfirmationContainer.$refs.signatureContent.$refs.input.select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      Toast(this.$t('common.copied'), {}, SUCCESS);
      this.reset();
    },
    arrayParser(arr) {
      const newArr = arr.map(item => {
        const gasLimit = item.gasLimit
          ? item.gasLimit
          : item.gas
          ? item.gas
          : '0x';
        const gasPrice = item.gasPrice ? item.gasPrice : '0x';
        const data = item.data
          ? item.data
          : item.hasOwnProperty('encodeABI')
          ? item.encodeABI()
          : '0x';
        const symbol = isEmpty(this.sendCurrency)
          ? this.network.type.currencyName
          : this.sendCurrency.symbol;
        const value =
          data !== '0x'
            ? !this.isSwap && !this.isBatch
              ? `${this.value} ${symbol}`
              : `0 ${this.network.type.currencyName}`
            : `${this.value} ${symbol}`;
        const from = item.from ? item.from : this.address;
        const toAdd = this.isContractCreation
          ? ''
          : item.to
          ? item.to
          : this.txTo;
        return [
          {
            title: 'Network',
            value: this.network.type.name_long
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
              data !== '0x' && !this.isBatch
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
          //   value: `${this.txFee} ${this.network.type.currencyName} ~ $${this.txFeeUSD}`
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
    }
  }
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
