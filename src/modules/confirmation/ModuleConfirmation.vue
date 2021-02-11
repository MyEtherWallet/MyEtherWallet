<template>
  <div>
    <mew-overlay
      :show-overlay="showOverlay"
      :title="title ? title : 'Confirmation'"
      left-btn-text=""
      right-btn-text="close"
      :close="overlayClose"
    >

      <template #mewOverlayBody>
        <confirmation-transaction
          v-if="true"
          :to="to"
          :from="from"
          :data="data"
          :gas-price="gasPrice"
          :gas-limit="gasLimit"
          :nonce="nonce"
          :network="network"
          :send="send"
          :tx-fee="txFee"
          :tx-fee-usd="txFeeUSD"
          :value="value"
        />
      </template>
    </mew-overlay>
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
          :msg="signature"
        />
      </template>
    </mew-overlay>
  </div>
</template>

<script>
import EventNames from '@/utils/web3-provider/events.js';
import ConfirmationTransaction from './components/ConfirmationTransaction';
import ConfirmationMesssage from './components/ConfirmationMessage'
import utils from 'web3-utils';
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { Toast, SUCCESS } from '@/modules/toast/handler/handlerToast';
import getService from '@/core/helpers/getService';
import { EventBus } from '@/core/plugins/eventBus';
export default {
  name: 'ConfirmationContainer',
  components: {
    ConfirmationTransaction,
    ConfirmationMesssage
  },
  data() {
    return {
      showOverlay: false,
      showSignOverlay: false,
      tx: {},
      resolver: () => {},
      title: '',
      signedTxObject: {},
      signedTx: {},
      signature: ''
    };
  },
  computed: {
    ...mapState('wallet', ['instance', 'address', 'isHardware', 'identifier']),
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
      const gasLimit = this.tx.gasLimit ? this.tx.gasLimit : '0x';
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
    }
  },
  created() {
    const _self = this;
    EventBus.$on(EventNames.SHOW_TX_CONFIRM_MODAL, (tx, resolver) => {
      _self.title = 'Transaction Confirmation';
      _self.tx = tx;
      _self.resolver = resolver;
      _self.instance
        .signTransaction(tx)
        .then(res => {
          _self.signedTxObject = res;
          _self.signedTx = res.rawTransaction;
          _self.showOverlay = true;
        })
        .catch(e => {
          this.overlayClose();
          _self.instance.errorHandler(e);
        });
    });
    EventBus.$on(EventNames.SHOW_MSG_CONFIRM_MODAL, (msg, resolver) => {
      _self.title = 'Transaction Confirmation';
      // _self.tx = tx;
      // _self.resolver = resolver;
      _self.instance
        .signMessage(msg)
        .then(res => {
         const result = Buffer.from(res).toString('hex')
          _self.signature = JSON.stringify(
            {
              address: _self.address,
              msg: msg,
              sig: result,
              version: '3',
              signer: _self.isHardware
                ? _self.identifier
                : 'MEW'
            },
            null,
            2
          );
          _self.signedMessage = result;
          resolver(result);
          // _self.signedTx = res.rawTransaction;
          _self.showSignOverlay = true;
        })
        .catch(e => {
          this.overlayClose();
          _self.instance.errorHandler(e);
        });
    });
  },
  methods: {
    overlayClose() {
      console.log('close'); // todo remove dev item
      this.showOverlay = false;
      this.showSignOverlay = false;
    },
    send() {
      this.resolver(this.signedTxObject);
      Toast(
        'Transaction is being mined. Check here ',
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
      this.overlayClose();
    }
  }
};
</script>
