<template>
  <div>
    <app-modal
      :show="showTxOverlay"
      :title="title !== '' ? title : 'Confirmation'"
      :close="reset"
      :btn-action="sendSignedTx"
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
          <v-expansion-panels accordion multiple flat class="expansion-border">
            <v-expansion-panel v-if="isHardware" readonly>
              <v-expansion-panel-content>
                <confirm-with-wallet :is-swap="isHardware" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel
              v-for="(transaction, i) in transactions"
              :key="transaction.to + transaction.from + i"
            >
              <v-expansion-panel-header>
                <p class="ma-0 font-weight-bold">
                  Transaction
                  {{ transactions.length > 1 ? `${i + 1}` : 'details' }}
                  <span v-if="isSwap" class="ma-0">Swap part {{ i + 1 }}</span>
                </p>
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
    <mew-overlay
      :show-overlay="showBatchOverlay"
      title="Batch Transaction Confirmation"
      right-btn-text="close"
      :close="reset"
    >
      <template #mewOverlayBody>
        <confirmation-batch-transaction
          :transactions="unsignedTxArr"
          :send="sendBatchTransaction"
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
import ConfirmationBatchTransaction from './components/ConfirmationBatchTransaction';
import ConfirmationSwapTransactionDetails from './components/ConfirmationSwapTransactionDetails';
import ConfirmationSendTransactionDetails from './components/ConfirmationSendTransactionDetails';
import ConfirmWithWallet from './components/ConfirmWithWallet';
import utils from 'web3-utils';
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { Toast, SUCCESS, INFO } from '@/modules/toast/handler/handlerToast';
import getService from '@/core/helpers/getService';
import parseTokenData from '@/core/helpers/parseTokenData';
import { EventBus } from '@/core/plugins/eventBus';
import { setEvents } from '@/utils/web3-provider/methods/utils.js';
import * as locStore from 'store';
import { sanitizeHex } from '@/modules/wallets/utils/utils.js';
export default {
  name: 'ConfirmationContainer',
  components: {
    ConfirmationMesssage,
    ConfirmationBatchTransaction,
    AppModal,
    ConfirmationSwapTransactionDetails,
    ConfirmationSendTransactionDetails,
    ConfirmWithWallet
  },
  data() {
    return {
      showTxOverlay: false,
      showSignOverlay: false,
      showBatchOverlay: false,
      tx: {},
      resolver: () => {},
      title: '',
      signedTxObject: {},
      signature: '',
      unsignedTxArr: [],
      signedTxArray: [],
      swapInfo: {},
      sendCurrency: {},
      toDetails: {}
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
    ...mapState('external', ['ETHUSDValue']),
    ...mapGetters('global', ['network']),
    ...mapState('global', ['addressBook']),
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
        return this.to?.toLowerCase() === item.address?.toLowerCase();
      });
      return {
        ensName: this.toDetails.type === 'resolved' ? this.toDetails.value : '',
        nickname:
          this.toDetails.type === 'selected'
            ? this.toDetails.value
            : toNickname
            ? toNickname.nickname
            : '',
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
      return BigNumber(this.txFee).times(this.ETHUSDValue.value).toFixed(2);
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
      return !this.isSwap
        ? !utils._.isEmpty(this.signedTxObject)
        : this.signedTxArray.length > 0;
    },
    isSwap() {
      return !utils._.isEmpty(this.swapInfo);
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
      await this.signTx();
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
        const signed = [];
        _self.unsignedTxArr = arr;
        if (!resolver) _self.resolver = () => {};
        _self.resolver = resolver;
        _self.showTxOverlay = true;

        if (_self.identifier !== WALLET_TYPES.WEB3_WALLET) {
          for (let i = 0; i < arr.length; i++) {
            try {
              const _signedTx = await _self.instance.signTransaction(arr[i]);
              if (arr[i].hasOwnProperty('handleNotification')) {
                _signedTx.tx['handleNotification'] = arr[i].handleNotification;
              }
              _signedTx.tx['type'] = arr[i].type ? arr[i].type : 'OUT';
              signed.push(_signedTx);
            } catch (err) {
              _self.instance.errorHandler(err);
            }
          }
          _self.signedTxArray = signed;
        } else {
          _self.signedTxArray = _self.unsignedTxArr.map(_tx => {
            return { tx: _tx, rawTransaction: _tx };
          });
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
      this.showBatchOverlay = false;
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
      tx.transactionFee = this.txFee;
    },
    async sendBatchTransaction() {
      this.showBatchOverlay = false;
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
      Toast(
        'Transaction is being mined. Watch out for the notifications on the top right of the screen!',
        {},
        SUCCESS,
        5000
      );
    },
    sendSignedTx() {
      this.resolver(this.signedTxObject);
      this.reset();
      Toast(
        `Transaction is being mined. Check here `,
        {
          title: `${getService(this.network.type.blockExplorerTX)}`,
          url: this.network.type.blockExplorerTX.replace(
            '[[txHash]]',
            this.signedTxObject.tx.hash
          )
        },
        SUCCESS,
        5000
      );
    },
    async signTx() {
      await this.instance
        .signTransaction(this.tx)
        .then(res => {
          this.signedTxObject = res;
        })
        .catch(e => {
          this.reset();
          this.instance.errorHandler(e);
        });
    },
    copyToClipboard() {
      this.$refs.messageConfirmationContainer.$refs.signatureContent.$refs.input.select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      Toast(this.$t('common.copied'), {}, INFO);
      this.reset();
    },
    arrayParser(arr) {
      return arr.map(item => {
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
              item.data !== '0x' && !this.isSwap
                ? `${
                    utils.isHex
                      ? utils.hexToNumberString(item.value)
                      : item.value
                  } ${this.sendCurrency.symbol}`
                : `0 ${this.network.type.currencyName}`
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
        ];
      });
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
