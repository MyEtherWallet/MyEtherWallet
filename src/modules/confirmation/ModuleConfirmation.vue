<template>
  <div>
    <confirmation-swap-modal
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
      :send="signTx"
      :show="showSwapModal"
      :close="overlayClose"
      @close="overlayClose"
    />
    <app-modal
      title="Confirm Transaction"
      :btn-action="sendSignedTx"
      :close="overlayClose"
      :btn-enabled="disableBtn"
      :show="showSignTxModal"
      @close="overlayClose"
    >
      <template #dialogBody>
        <confirm-with-wallet />
      </template>
    </app-modal>
    <app-modal
      :show="showTxOverlay"
      :title="title ? title : 'Confirmation'"
      :close="overlayClose"
      :btn-action="signTx"
      @close="overlayClose"
    >
      <template #dialogBody>
        <confirmation-transaction
          :to="to"
          :from="from"
          :data="data"
          :gas-price="gasPrice"
          :gas-limit="gasLimit"
          :nonce="nonce"
          :network="network"
          :tx-fee="txFee"
          :tx-fee-usd="txFeeUSD"
          :value="value"
        />
      </template>
    </app-modal>
    <mew-overlay
      :show-overlay="showSignOverlay"
      :title="title ? title : 'Message'"
      left-btn-text=""
      right-btn-text="close"
      :close="overlayClose"
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
      :close="overlayClose"
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
import ConfirmationTransaction from './components/ConfirmationTransaction';
import ConfirmationMesssage from './components/ConfirmationMessage';
import ConfirmationBatchTransaction from './components/ConfirmationBatchTransaction';
import ConfirmationSwapModal from './components/ConfirmationSwapModal';
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
    ConfirmationTransaction,
    ConfirmationMesssage,
    ConfirmationBatchTransaction,
    AppModal,
    ConfirmWithWallet,
    ConfirmationSwapModal
  },
  data() {
    return {
      showTxOverlay: false,
      showSignOverlay: false,
      showBatchOverlay: false,
      showSignTxModal: false,
      showSwapModal: false,
      tx: {},
      resolver: () => {},
      title: '',
      signedTxObject: {},
      signature: '',
      unsignedTxArr: [],
      signedTxArray: [],
      swapInfo: {}
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
    ...mapState('external', ['ETHUSDValue', 'test']),
    ...mapGetters('global', ['network']),
    to() {
      return this.tx.to;
    },
    from() {
      return this.tx.from;
    },
    data() {
      return this.tx.data;
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
      const parsedValue = this.tx.value ? this.tx.value : '0x';
      return utils.fromWei(utils.hexToNumberString(parsedValue));
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
      return !utils._.isEmpty(this.signedTxObject);
    }
  },
  created() {
    const _self = this;
    EventBus.$on(EventNames.SHOW_TX_CONFIRM_MODAL, (tx, resolver) => {
      this.parseRawData(tx);
      _self.title = 'Transaction Confirmation';
      _self.tx = tx;
      _self.resolver = resolver;
      _self.showTxOverlay = true;
      // this.txFee is not updating before reaching about here
      _self.tx.transactionFee = this.txFee;
      tx.transactionFee = this.txFee;
    });
    /**
     * receives an @Array
     * arr[0] is the tx
     * arr[1] is the swap information
     */
    EventBus.$on(EventNames.SHOW_SWAP_TX_MODAL, (arr, resolver) => {
      _self.tx = arr[0];
      _self.swapInfo = arr[1];
      _self.resolver = resolver;
      _self.showSwapModal = true;
    });
    EventBus.$on(
      EventNames.SHOW_BATCH_TX_MODAL,
      async (arr, resolver, isHardware) => {
        _self.isHardwareWallet = isHardware;
        const signed = [];
        _self.unsignedTxArr = arr;
        if (!resolver) resolver = () => {};
        _self.resolver = resolver;
        _self.showBatchOverlay = true;

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
          this.overlayClose();
          _self.instance.errorHandler(e);
        });
    });
  },
  methods: {
    reset() {
      this.tx = {};
      this.resolver = () => {};
      this.title = '';
      this.signedTxObject = {};
      this.signature = '';
      this.unsignedTxArr = [];
      this.signedTxArray = [];
    },
    overlayClose() {
      this.showTxOverlay = false;
      this.showBatchOverlay = false;
      this.showSignOverlay = false;
      this.showSignTxModal = false;
      this.showSwapModal = false;
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
    async signTx() {
      this.overlayClose();
      if (!this.isSoftwareWallet) {
        this.showSignTxModal = true;
      }

      await this.instance
        .signTransaction(this.tx)
        .then(res => {
          if (this.isSoftwareWallet) {
            this.resolver(res);
            this.reset();
            Toast(
              `Transaction is being mined. Check here `,
              {
                title: `${getService(this.network.type.blockExplorerTX)}`,
                url: this.network.type.blockExplorerTX.replace(
                  '[[txHash]]',
                  res.tx.hash
                )
              },
              SUCCESS,
              5000
            );
          } else {
            this.signedTxObject = res;
          }
        })
        .catch(e => {
          this.overlayClose();
          this.reset();
          this.instance.errorHandler(e);
        });
    },
    sendSignedTx() {
      this.resolver(this.signedTxObject);
      this.overlayClose();
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
    copyToClipboard() {
      this.$refs.messageConfirmationContainer.$refs.signatureContent.$refs.input.select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      Toast(this.$t('common.copied'), {}, INFO);
      this.overlayClose();
    }
  }
};
</script>
