<template>
  <div>
    <app-modal
      :show="showSuccessModal"
      title="Transaction initiated"
      :close="reset"
      :btn-action="btnAction"
      :btn-enabled="disableBtn"
      :close-only="true"
      :width="'450'"
      @close="reset"
    >
      <template #dialogBody>
        <div class="px-5">
          <div
            v-if="showSuccessModal"
            v-lottie="'checkmark'"
            style="height: 150px"
          />
          <div>
            Once completed, the token amount will be deposited to the address
            you provider. this should take a few minutes depending on how
            congested the Ethereum network is.
          </div>
          <div
            class="
              d-flex
              justify-space-around
              flex-md-row flex-sm-column-reverse flex-xs-column-reverse
              align-sm-center align-xs-center
              my-3
            "
          >
            <div>
              <a
                rel="noopener noreferrer"
                target="_blank"
                :href="links.etherscan"
                class="d-flex"
                >View on Etherscan
                <v-icon color="primary" small>mdi-launch</v-icon></a
              >
            </div>
            <div v-if="network.type.isEthVMSupported.supported">
              <a
                rel="noopener noreferrer"
                target="_blank"
                :href="links.ethvm"
                class="d-flex"
                >View on EthVM
                <v-icon color="primary" small>mdi-launch</v-icon></a
              >
            </div>
            <div>
              <a @click.stop="viewProgress">View Progress</a>
            </div>
          </div>
        </div>
      </template>
    </app-modal>
    <app-modal
      :show="showTxOverlay"
      :title="title !== '' ? title : 'Confirmation'"
      :close="reset"
      :btn-action="btnAction"
      :btn-enabled="disableBtn"
      @close="reset"
    >
      <template #dialogBody>
        <div>
          <confirmation-send-transaction-details
            v-if="!isSwap"
            :to="tx.to"
            :network="network"
            :tx-fee="txFee"
            :tx-fee-usd="txFeeUSD"
            :value="value"
            :value-usd="ETHUSDValue.value"
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
              textSecondary--text
              border-radius--5px
              mb-4
            "
          >
            <b>Make sure all the information is correct.</b> Canceling or
            reversing a transaction cannot be guaranteed. You will still be
            charged gas fee even if transaction fails.
            <a rel="noopener noreferrer">Learn more.</a>
          </div>
          <!-- transaction details -->
          <confirm-with-wallet
            v-if="showConfirmWithWallet"
            :is-swap="isHardware"
            :tx-length="unsignedTxArr.length > 0 ? unsignedTxArr.length : 1"
            :signed="signingPending"
          />
          <v-expansion-panels accordion multiple flat>
            <v-expansion-panel
              v-for="(transaction, i) in transactions"
              :key="transaction.to + transaction.from + i"
              class="expansion-border"
            >
              <v-expansion-panel-header :disable-icon-rotate="signing">
                <p class="ma-0">
                  <span class="font-weight-bold"
                    >Transaction
                    {{ transactions.length > 1 ? `${i + 1}` : 'details' }}
                  </span>
                  <br />
                  <span v-if="isSwap" class="ma-0"
                    >Swap part {{ i + 1 }} - {{ swapLabel[i] }}</span
                  >
                </p>
                <template v-if="signing" #actions>
                  <v-progress-circular
                    v-show="isBatch && signedTxArray.length < i + 1"
                    indeterminate
                    color="primary"
                  />
                  <v-progress-circular
                    v-show="
                      !isBatch && Object.keys(signedTxObject).length === 0
                    "
                    indeterminate
                    color="primary"
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
                    v-show="isBatch && signedTxArray.length >= i + 1"
                    color="primary"
                  >
                    mdi-check
                  </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div>
                  <div
                    v-for="txVal in transaction"
                    :key="txVal.title + txVal.value"
                    class="d-flex justify-space-between"
                  >
                    <p class="ma-0">{{ txVal.title }}</p>
                    <p class="ma-0 data-values">{{ txVal.value }}</p>
                  </div>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </template>
    </app-modal>
    <mew-overlay
      :show-overlay="showSignOverlay"
      :title="title ? title : 'Message'"
      left-btn-text=""
      right-btn-text="close"
      :close="reset"
    >
      <template #mewOverlayBody>
        <confirmation-messsage
          v-if="true"
          ref="messageConfirmationContainer"
          :msg="signature"
          :copy="copyToClipboard"
        />
      </template>
    </mew-overlay>
  </div>
</template>

<script>
import AppModal from '@/core/components/AppModal';
import { WALLET_TYPES } from '@/modules/access-wallet/hardware/handlers/configs/configWalletTypes';
import EventNames from '@/utils/web3-provider/events.js';
import ConfirmationMesssage from './components/ConfirmationMessage';
import ConfirmationSwapTransactionDetails from './components/ConfirmationSwapTransactionDetails';
import ConfirmationSendTransactionDetails from './components/ConfirmationSendTransactionDetails';
import ConfirmWithWallet from './components/ConfirmWithWallet';
import utils from 'web3-utils';
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { Toast, INFO } from '@/modules/toast/handler/handlerToast';
import parseTokenData from '@/core/helpers/parseTokenData';
import { EventBus } from '@/core/plugins/eventBus';
import { setEvents } from '@/utils/web3-provider/methods/utils.js';
import * as locStore from 'store';
import { sanitizeHex } from '@/modules/wallets/utils/utils.js';

const SWAP_LABELS = ['Reset Approval', 'Approval', 'Swap'];

export default {
  name: 'ConfirmationContainer',
  components: {
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
      }
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
    ...mapGetters('external', ['fiatValue', 'test']),
    ...mapGetters('global', ['network']),
    ...mapState('global', ['addressBook']),
    showConfirmWithWallet() {
      return (
        (this.signing || this.signingPending) &&
        (this.isHardware || this.identifier === WALLET_TYPES.WEB3_WALLET)
      );
    },
    swapLabel() {
      switch (this.transactions.length) {
        case 1:
          return SWAP_LABELS.slice(2);
        case 2:
          return SWAP_LABELS.slice(1);
        default:
          return SWAP_LABELS;
      }
    },
    transactions() {
      const newArr =
        this.unsignedTxArr.length > 0
          ? [].concat(this.unsignedTxArr)
          : utils._.isEmpty(this.tx)
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
      const gasPrice = this.tx.gasPrice ? this.tx.gasPrice : '0x';
      return utils.fromWei(utils.hexToNumberString(gasPrice), 'gwei');
    },
    gasLimit() {
      const gasLimit = this.tx.gasLimit
        ? this.tx.gasLimit
        : this.tx.gas
        ? this.tx.gas
        : '0x';
      return utils.hexToNumberString(gasLimit);
    },
    nonce() {
      return utils.hexToNumber(this.tx.nonce);
    },
    txFee() {
      const parsedTxFee = BigNumber(utils.toWei(this.gasPrice, 'gwei'))
        .times(this.gasLimit)
        .toString();
      return utils.fromWei(parsedTxFee);
    },
    txFeeUSD() {
      return BigNumber(this.txFee).times(this.fiatValue).toFixed(2);
    },
    value() {
      const parsedValue = this.tx.value
        ? this.tx.hasOwnProperty('toTxData')
          ? this.tx.toTxData.amount
          : utils.fromWei(utils.hexToNumberString(this.tx.value))
        : '0x';
      return parsedValue;
    },
    isSoftwareWallet() {
      return (
        !this.instance.isHardware &&
        (this.instance.identifier === WALLET_TYPES.KEYSTORE ||
          this.instance.identifier === WALLET_TYPES.PRIV_KEY ||
          this.instance.identifier === WALLET_TYPES.MNEMONIC)
      );
    },
    disableBtn() {
      if (!this.signing) return true;
      return this.isBatch
        ? this.signedTxArray.length > 0 &&
            this.signedTxArray.length === this.unsignedTxArr.length
        : !utils._.isEmpty(this.signedTxObject);
    },
    isSwap() {
      return !utils._.isEmpty(this.swapInfo);
    },
    isBatch() {
      return this.unsignedTxArr.length > 0;
    },
    signingPending() {
      if (this.isBatch) {
        return this.unsignedTxArr.length === this.signedTxArray.length;
      }
      return !utils._.isEmpty(this.signedTxObject);
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
    },
    parseRawData(tx) {
      let tokenData = '';
      if (tx.to && tx.data && tx.data !== '0x') {
        tokenData = parseTokenData(
          tx.data,
          tx.to,
          this.network.type.tokens,
          this.web3
        );
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
      tx.type = 'OUT';
      tx.network = this.network.type.name;
    },
    async sendBatchTransaction() {
      const web3 = this.web3;
      const _method =
        this.identifier === WALLET_TYPES.WEB3_WALLET
          ? 'sendTransaction'
          : 'sendSignedTransaction';
      const _arr = this.signedTxArray;
      const promises = _arr.map(tx => {
        const _tx = tx.tx;
        _tx.from = this.address;
        const _rawTx = tx.rawTransaction;
        const promiEvent = web3.eth[_method](_rawTx);
        _tx.network = this.network.type.name;
        _tx.gasPrice = utils.fromWei(
          utils.hexToNumberString(_tx.gasPrice),
          'gwei'
        );
        _tx.transactionFee = utils.fromWei(
          BigNumber(utils.toWei(_tx.gasPrice, 'gwei')).times(_tx.gas).toString()
        );
        _tx.gasLimit = _tx.gas;
        setEvents(promiEvent, _tx, this.$store.dispatch);
        promiEvent.once('transactionHash', () => {
          const localStoredObj = locStore.get(web3.utils.sha3(this.address));
          locStore.set(web3.utils.sha3(this.address), {
            nonce: sanitizeHex(
              new BigNumber(localStoredObj.nonce).plus(1).toString(16)
            ),
            timestamp: localStoredObj.timestamp
          });
        });
        return promiEvent;
      });
      this.resolver(promises);
      this.reset();
      this.showSuccess(promises[promises.length - 1]);
    },
    sendSignedTx() {
      const hash = this.signedTxObject.tx.hash;
      this.resolver(this.signedTxObject);
      this.reset();
      this.showSuccess(hash);
    },
    viewProgress() {
      EventBus.$emit('openNotifications');
      this.reset();
    },
    showSuccess(param) {
      if (utils._.isArray(param)) {
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
      if (this.isHardware || this.identifier === WALLET_TYPES.WEB3_WALLET)
        this.signing = true;
      await this.instance
        .signTransaction(this.tx)
        .then(res => {
          this.signedTxObject = res;
          if (this.identifier === WALLET_TYPES.WEB3_WALLET) {
            this.showTxOverlay = false;
            this.showSuccess(res.transactionHash);
          }
        })
        .catch(e => {
          this.instance.errorHandler(e);
          this.signedTxObject = {};
          this.signing = false;
        });
    },
    async signBatchTx() {
      const signed = [];
      if (this.isHardware || this.identifier === WALLET_TYPES.WEB3_WALLET)
        this.signing = true;
      for (let i = 0; i < this.unsignedTxArr.length; i++) {
        try {
          if (this.instance.identifier !== WALLET_TYPES.WEB3_WALLET) {
            const _signedTx = await this.instance.signTransaction(
              this.unsignedTxArr[i]
            );
            if (this.unsignedTxArr[i].hasOwnProperty('handleNotification')) {
              _signedTx.tx['handleNotification'] =
                this.unsignedTxArr[i].handleNotification;
            }
            _signedTx.tx['type'] = this.unsignedTxArr[i].type
              ? this.unsignedTxArr[i].type
              : 'OUT';
            signed.push(_signedTx);
            this.signedTxArray = signed;
          } else {
            signed.push(this.instance.signTransaction(this.unsignedTxArr[i]));
          }
        } catch (err) {
          this.signedTxArray = [];
          this.signing = false;
          this.instance.errorHandler(err);
          return;
        }
      }
      if (this.instance.identifier === WALLET_TYPES.WEB3_WALLET) {
        Promise.all(signed).then(arr => {
          console.log(arr);
        });
      }
      this.signing = false;
    },
    btnAction() {
      if (!this.signing) {
        this.isHardware || this.identifier === WALLET_TYPES.WEB3_WALLET
          ? this.isBatch
            ? this.signBatchTx()
            : this.signTx()
          : this.sendSignedTx();
        return;
      }
      this.isBatch ? this.sendBatchTransaction() : this.sendSignedTx();
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
          },
          {
            title: item.data !== '0x' ? 'Via Contract Address' : 'To address',
            value: item.to
          },
          {
            title: 'Sending',
            value:
              item.data !== '0x'
                ? !this.isSwap
                  ? `${this.value} ${this.sendCurrency.symbol}`
                  : `0 ${this.network.type.currencyName}`
                : `${this.value} ${this.sendCurrency.symbol}`
          },
          {
            title: 'Gas Price',
            value:
              utils.fromWei(utils.hexToNumberString(gasPrice), 'gwei') + ' gwei'
          },
          {
            title: 'Gas Limit',
            value: utils.hexToNumberString(gasLimit)
          },
          {
            title: 'Transaction fee',
            value: `${this.txFee} ${this.network.type.currencyName} ~ $${this.txFeeUSD}`
          },
          {
            title: 'Nonce',
            value: utils.hexToNumber(item.nonce)
          },
          {
            title: 'Data',
            value: item.data
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
.expansion-border {
  border: 1px solid var(--v-selectBorder-base) !important;
}

.data-values {
  max-width: 350px;
  overflow-wrap: break-word;
}
</style>
