<template>
  <div>
    <app-modal
      :show="showSuccessModal"
      :title="successTitle"
      :close="resetSuccess"
      :close-only="true"
      width="480"
      @close="resetSuccess"
    >
      <template #dialogBody>
        <div>
          <!--
          ====================================================================================
            Lottie or icon
          =====================================================================================
          -->
          <div
            v-if="showSuccessModal"
            v-lottie="successLottie"
            :class="[{ 'py-7': showSuccessSwap }, 'lottie']"
          />
          <!--
          ====================================================================================
            Body
          =====================================================================================
          -->
          <div class="mew-body">
            {{ successBodyText }}
          </div>
          <!--
          ====================================================================================
            Links
          =====================================================================================
          -->
          <v-row class="justify-sm-space-around align-center pt-3" dense>
            <v-col cols="12" sm="auto" class="pb-2" order-sm="3">
              <a
                class="d-flex justify-center justify-sm-end"
                @click.stop="viewProgress"
                >View Progress</a
              >
            </v-col>
            <v-col cols="12" sm="auto" class="pb-2">
              <a
                rel="noopener noreferrer"
                target="_blank"
                :href="links.etherscan"
                class="d-flex justify-center justify-sm-start"
                >View on Etherscan
                <v-icon color="primary" small>mdi-launch</v-icon></a
              >
            </v-col>
            <v-col
              v-if="network.type.isEthVMSupported.supported"
              cols="12"
              sm="auto"
              class="pb-2"
            >
              <a
                rel="noopener noreferrer"
                target="_blank"
                :href="links.ethvm"
                class="d-flex justify-center"
                >View on EthVM
                <v-icon color="primary" small>mdi-launch</v-icon></a
              >
            </v-col>
          </v-row>
        </div>
      </template>
    </app-modal>
    <app-modal
      :show="showTxOverlay"
      :title="title !== '' ? title : 'Confirmation'"
      :close="reset"
      :btn-action="btnAction"
      :btn-enabled="disableBtn"
      :scrollable="true"
      :anchored="true"
      width="650"
      @close="reset"
    >
      <template #dialogBody>
        <v-card-text ref="scrollableContent" class="py-0 px-5 px-md-0">
          <confirmation-send-transaction-details
            v-if="!isSwap"
            :to="txTo"
            :network="network"
            :tx-fee="txFee"
            :tx-fee-usd="txFeeUSD"
            :value="value"
            :value-usd="usdValue"
            :to-tx-data="tx.toTxData"
            :to-details="allToDetails"
            :send-currency="sendCurrency"
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
            :tx-fee="swapInfo.totalFees"
            :gas-price-type="swapInfo.gasPriceType"
            :is-hardware="isHardware"
          />
          <!-- Warning Sheet -->
          <div
            class="
              px-4
              py-6
              pr-6
              warning
              textBlack2--text
              border-radius--5px
              mb-5
            "
          >
            <b>Make sure all the information is correct.</b> Canceling or
            reversing a transaction cannot be guaranteed. You will still be
            charged gas fee even if transaction fails.
            <a
              href="https://help.myetherwallet.com/en/articles/5380674-my-transaction-failed-why-was-i-charged"
              target="_blank"
              rel="noopener noreferrer"
              >Learn more.</a
            >
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
                    <span v-if="isBatch" class="ma-0 mew-label searchText--text"
                      >{{ isSwap ? 'Swap ' : '' }} part {{ i + 1 }} -
                      {{ dataToAction(unsignedTxArr[i]) }}</span
                    >
                    <span
                      v-else-if="dataToAction(tx) !== ''"
                      class="ma-0 mew-label searchText--text"
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
                      color="primary"
                      size="20"
                      width="2"
                      class="pr-7"
                    />
                    <v-progress-circular
                      v-show="
                        !isBatch && Object.keys(signedTxObject).length === 0
                      "
                      indeterminate
                      color="primary"
                      size="20"
                      width="2"
                      class="pr-7"
                    />
                    <v-icon
                      v-show="
                        !isBatch && Object.keys(signedTxObject).length !== 0
                      "
                      color="primary"
                    >
                      mdi-check
                    </v-icon>
                    <v-icon
                      v-show="
                        error === '' && isBatch && signedTxArray.length >= i + 1
                      "
                      color="primary"
                    >
                      mdi-check
                    </v-icon>
                  </div>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content :id="i">
                <div>
                  <v-row
                    v-for="txVal in transaction"
                    :key="`${txVal.title}${txVal.value}`"
                    class="d-flex justify-space-between"
                    no-gutters
                  >
                    <v-col
                      cols="12"
                      md="3"
                      class="d-flex d-sm-block ma-0 searchText--text"
                    >
                      {{ txVal.title }}
                    </v-col>

                    <v-col cols="12" md="9">
                      <app-scroll-block>
                        <div class="data-values text-md-right">
                          {{ txVal.value }}
                        </div>
                      </app-scroll-block>
                    </v-col>
                  </v-row>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </template>
    </app-modal>
    <!--
    ====================================================================================
      Sign Message Confirmation
    =====================================================================================
    -->
    <mew-overlay
      :footer="{
        text: 'Need help?',
        linkTitle: 'Contact support',
        link: 'mailto:support@myetherwallet.com'
      }"
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
import AppScrollBlock from '@/core/components/AppScrollBlock';
import AppModal from '@/core/components/AppModal';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import EventNames from '@/utils/web3-provider/events.js';
import ConfirmationMesssage from './components/ConfirmationMessage';
import ConfirmationSwapTransactionDetails from './components/ConfirmationSwapTransactionDetails';
import ConfirmationSendTransactionDetails from './components/ConfirmationSendTransactionDetails';
import ConfirmWithWallet from './components/ConfirmWithWallet';
import { toChecksumAddress } from '@/core/helpers/addressUtils';
import {
  fromWei,
  _,
  hexToNumberString,
  hexToNumber,
  toWei,
  sha3,
  isHex
} from 'web3-utils';
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { Toast, INFO } from '@/modules/toast/handler/handlerToast';
import parseTokenData from './handlers/parseTokenData';
import { EventBus } from '@/core/plugins/eventBus';
import { setEvents } from '@/utils/web3-provider/methods/utils.js';
import * as locStore from 'store';
import { sanitizeHex } from '@/modules/access-wallet/common/utils';
import dataToAction from './handlers/dataToAction';

export default {
  name: 'ModuleConfirmation',
  components: {
    AppScrollBlock,
    ConfirmationMesssage,
    AppModal,
    ConfirmationSwapTransactionDetails,
    ConfirmationSendTransactionDetails,
    ConfirmWithWallet
  },
  data() {
    return {
      showTxOverlay: false,
      showSignOverlay: false,
      showSuccessModal: false,
      showSuccessSwap: false,
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
        ethvm: '',
        etherscan: ''
      },
      error: '',
      panel: []
    };
  },
  computed: {
    ...mapState('wallet', [
      'instance',
      'web3',
      'address',
      'identifier',
      'isHardware'
    ]),
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network']),
    ...mapState('global', ['addressBook']),
    txTo() {
      if (!this.isBatch)
        return this.tx.hasOwnProperty('toTxData')
          ? this.tx.toTxData.to
          : this.tx.to;
      return this.unsignedTxArr[0].to;
    },
    usdValue() {
      return BigNumber(this.fiatValue).toNumber();
    },
    isWeb3Wallet() {
      return (
        this.identifier === WALLET_TYPES.WEB3_WALLET ||
        this.identifier === WALLET_TYPES.WALLET_CONNECT
      );
    },
    isOtherWallet() {
      return (
        this.identifier === WALLET_TYPES.MEW_CONNECT ||
        this.identifier === WALLET_TYPES.WALLET_LINK
      );
    },
    isNotSoftware() {
      return this.isHardware || this.isWeb3Wallet || this.isOtherWallet;
    },
    showConfirmWithWallet() {
      return this.isNotSoftware && (this.signing || this.error !== '');
    },
    transactions() {
      const newArr =
        this.unsignedTxArr.length > 0
          ? [].concat(this.unsignedTxArr)
          : _.isEmpty(this.tx)
          ? []
          : [this.tx];
      return this.arrayParser(newArr);
    },
    allToDetails() {
      const toNickname = this.addressBook.find(item => {
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
      const batchGasPrice = this.unsignedTxArr.reduce((acc, currentValue) => {
        return acc.plus(currentValue.gasPrice);
      }, BigNumber(0));
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
      return BigNumber(this.txFee).times(this.fiatValue).toFixed(2);
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
      return this.txSigned;
    },
    txSigned() {
      return this.isBatch
        ? this.signedTxArray.length > 0 &&
            this.signedTxArray.length === this.unsignedTxArr.length
        : !_.isEmpty(this.signedTxObject);
    },
    isSwap() {
      return !_.isEmpty(this.swapInfo);
    },
    isBatch() {
      return this.unsignedTxArr.length > 0;
    },
    signingPending() {
      if (this.isBatch) {
        return this.unsignedTxArr.length === this.signedTxArray.length;
      }
      return !_.isEmpty(this.signedTxObject);
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
    },
    /**
     * Property returns string, depending whether or not this is a swap or send
     */
    successLottie() {
      return this.showSuccessSwap ? 'swap' : 'checkmark';
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
    signedTxArray: {
      handler: function (newVal) {
        if (
          this.isWeb3Wallet &&
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
    const _self = this;
    /**
     * receives an @Array
     * arr[0] is the tx
     * arr[1] is the to details (nickname, ens name)
     * arr[2] is the selected currency
     */
    EventBus.$on(EventNames.SHOW_TX_CONFIRM_MODAL, async (tx, resolver) => {
      this.parseRawData(tx[0]);
      _self.title = 'Transaction Confirmation';
      _self.tx = tx[0];
      _self.resolver = resolver;
      _self.showTxOverlay = true;
      _self.tx.transactionFee = this.txFee;
      tx[0].transactionFee = this.txFee;
      if (tx.length > 1) {
        _self.toDetails = tx[1];
        _self.sendCurrency = tx[2];
      }
      if (!this.isHardware && this.identifier !== WALLET_TYPES.WEB3_WALLET)
        await this.signTx();
    });
    /**
     * receives an @Array
     * arr[0] is the tx
     * arr[1] is the swap information
     */
    EventBus.$on(EventNames.SHOW_SWAP_TX_MODAL, async (arr, resolver) => {
      _self.tx = arr[0];
      _self.swapInfo = arr[1];
      _self.resolver = resolver;
      _self.showTxOverlay = true;
      _self.title = 'Verify Swap';
      if (!this.isHardware && this.identifier !== WALLET_TYPES.WEB3_WALLET) {
        await this.signTx();
      }
    });

    /**
     * receives an @Array
     * arr[0] is the tx that may have confirmInfo
     * which identifies the transaction as a swap tx
     */
    EventBus.$on(
      EventNames.SHOW_BATCH_TX_MODAL,
      async (arr, resolver, isHardware) => {
        _self.isHardwareWallet = isHardware;
        if (arr[0].hasOwnProperty('confirmInfo')) {
          _self.swapInfo = arr[0].confirmInfo;
          _self.title = 'Verify Swap';
        }
        _self.unsignedTxArr = arr;
        if (!resolver) _self.resolver = () => {};
        _self.resolver = resolver;
        _self.showTxOverlay = true;

        if (!isHardware && _self.identifier !== WALLET_TYPES.WEB3_WALLET) {
          this.signBatchTx();
        }
      }
    );
    EventBus.$on(EventNames.SHOW_MSG_CONFIRM_MODAL, (msg, resolver) => {
      _self.title = 'Message Signed';
      _self.instance
        .signMessage(msg)
        .then(res => {
          const result = Buffer.from(res).toString('hex');
          _self.signature = JSON.stringify(
            {
              address: _self.address,
              msg: msg,
              sig: result,
              version: '3',
              signer: _self.isHardware ? _self.identifier : 'MEW'
            },
            null,
            2
          );
          _self.signedMessage = result;
          resolver(result);
          _self.showSignOverlay = true;
        })
        .catch(e => {
          this.reset();
          _self.instance.errorHandler(e);
        });
    });
  },
  methods: {
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
      this.showSuccessSwap = false;
      this.reset();
    },
    reset() {
      this.showTxOverlay = false;
      this.showSignOverlay = false;
      this.showSuccessModal = false;
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
        etherscan: '',
        ethvm: ''
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
      const web3 = this.web3;
      const _method = 'sendSignedTransaction';
      const _arr = this.signedTxArray;
      const promises = _arr.map((tx, idx) => {
        const _tx = tx.tx;
        _tx.from = this.address;
        const _rawTx = tx.rawTransaction;
        const promiEvent = web3.eth[_method](_rawTx);
        _tx.network = this.network.type.name;
        _tx.gasPrice = isHex(_tx.gasPrice)
          ? hexToNumberString(_tx.gasPrice)
          : _tx.gasPrice;
        _tx.transactionFee = fromWei(
          BigNumber(_tx.gasPrice).times(_tx.gas).toString()
        );
        _tx.gasLimit = _tx.gas;
        setEvents(promiEvent, _tx, this.$store.dispatch);
        promiEvent.once('transactionHash', hash => {
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
          if (idx + 1 === _arr.length) {
            if (this.isSwap) {
              this.showSuccessSwap = true;
            }
            this.reset();
            this.showSuccess(hash);
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
      this.reset();
      this.showSuccess(hash);
    },
    viewProgress() {
      EventBus.$emit('openNotifications');
      this.reset();
    },
    showSuccess(param) {
      if (_.isArray(param)) {
        const lastHash = param[param.length - 1].tx.hash;
        this.links.ethvm = this.network.type.isEthVMSupported.supported
          ? this.network.type.isEthVMSupported.blockExplorerTX.replace(
              '[[txHash]]',
              lastHash
            )
          : '';
        this.links.etherscan = this.network.type.blockExplorerTX.replace(
          '[[txHash]]',
          lastHash
        );
        this.showSuccessModal = true;
        return;
      }

      this.links.ethvm = this.network.type.isEthVMSupported.supported
        ? this.network.type.isEthVMSupported.blockExplorerTX.replace(
            '[[txHash]]',
            param
          )
        : '';
      this.links.etherscan = this.network.type.blockExplorerTX.replace(
        '[[txHash]]',
        param
      );
      this.showSuccessModal = true;
    },
    async signTx() {
      this.error = '';
      if (this.isNotSoftware) {
        this.signing = true;
      }
      if (this.isWeb3Wallet) {
        const event = this.instance.signTransaction(this.tx);
        event
          .on('transactionHash', res => {
            this.showTxOverlay = false;
            this.showSuccess(res);
          })
          .catch(e => {
            this.signedTxObject = {};
            this.error = e.message;
            this.signing = false;
          });
        this.resolver(event);
      } else {
        await this.instance
          .signTransaction(this.tx)
          .then(res => {
            this.signedTxObject = res;
            if (this.isHardware && this.txSigned) {
              this.btnAction();
            }
          })
          .catch(e => {
            this.signedTxObject = {};
            this.error = e.message;
            this.signing = false;
          });
      }
    },
    async signBatchTx() {
      this.error = '';
      const signed = [];
      const batchTxEvents = [];
      if (this.isNotSoftware) {
        this.signing = true;
      }
      for (let i = 0; i < this.unsignedTxArr.length; i++) {
        try {
          if (!this.isWeb3Wallet) {
            const _signedTx = await this.instance.signTransaction(
              this.unsignedTxArr[i]
            );
            if (this.unsignedTxArr[i].hasOwnProperty('handleNotification')) {
              _signedTx.tx['handleNotification'] =
                this.unsignedTxArr[i].handleNotification;
            }
            signed.push(_signedTx);
            if (this.isHardware && this.txSigned) {
              this.btnAction();
            }
          } else {
            const event = this.instance.signTransaction(this.unsignedTxArr[i]);
            batchTxEvents.push(event);
            event
              .on('transactionHash', res => {
                signed.push({
                  tx: {
                    hash: res
                  }
                });
              })
              .catch(e => {
                this.instance.errorHandler(e);
              });
          }
          this.signedTxArray = signed;
          if (this.isWeb3Wallet) this.resolver(batchTxEvents);
        } catch (err) {
          this.error = err.message ? err.message : err;
          this.signedTxArray = [];
          return;
        }
      }
      if (!this.isWeb3Wallet && !this.isHardware && !this.isOtherWallet) {
        this.signing = false;
      }
    },
    btnAction() {
      if (!this.isWeb3Wallet) {
        if (
          (this.signedTxArray.length === 0 ||
            this.signedTxArray.length < this.unsignedTxArr.length) &&
          _.isEmpty(this.signedTxObject)
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
      Toast(this.$t('common.copied'), {}, INFO);
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
        const value =
          data !== '0x'
            ? !this.isSwap && !this.isBatch
              ? `${this.value} ${this.sendCurrency.symbol}`
              : `0 ${this.network.type.currencyName}`
            : `${this.value} ${this.sendCurrency.symbol}`;
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
            value: item.from
              ? toChecksumAddress(item.from)
              : toChecksumAddress(this.address)
          },
          {
            title:
              data !== '0x' && !this.isBatch
                ? 'Via Contract Address'
                : 'To address',
            value: item.to
              ? toChecksumAddress(item.to)
              : toChecksumAddress(this.txTo)
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
          {
            title: 'Transaction fee',
            value: `${this.txFee} ${this.network.type.currencyName} ~ $${this.txFeeUSD}`
          },
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
$borderPanels: 1px solid var(--v-selectBorder-base) !important;
.expansion-border {
  border: $borderPanels;
  border-radius: 8px;
}

.data-values {
  overflow-wrap: break-word;
}
.expansion-header {
  height: 60px;
}
.expansion-panel-border-bottom {
  border-bottom: $borderPanels;
}
.lottie {
  height: 120px;
}
</style>
