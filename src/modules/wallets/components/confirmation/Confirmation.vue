<template>
  <div>
    <mew-overlay
      :show-overlay="showOverlay"
      :title="title"
      left-btn-text=""
      :close="overlayClose"
    >
      <template #mewOverlayBody>
        <transaction-confirmation
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
  </div>
</template>

<script>
import EventNames from '@/utils/web3-provider/events.js';
import transactionConfirmation from './transaction-confirmation/TransactionConfirmation';
import utils from 'web3-utils';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { Toast, SUCCESS } from '@/components/toast';
import getService from '@/helpers/getService';
import { EventBus } from '@/plugins/eventBus';
export default {
  name: 'ConfirmationContainer',
  components: {
    transactionConfirmation
  },
  data() {
    return {
      showOverlay: false,
      tx: {},
      resolver: () => {},
      title: '',
      signedTxObject: {},
      signedTx: {}
    };
  },
  computed: {
    ...mapState('wallet', ['network', 'instance', 'usd']),
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
      const parsedTxFee = utils.fromWei(
        BigNumber(this.gasPrice).times(this.gasLimit).toString()
      );
      return BigNumber(parsedTxFee).toFixed(2);
    },
    txFeeUSD() {
      return BigNumber(this.txFee).times(this.usd).toFixed(2);
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
          _self.instance.erroHandler(e);
        });
    });
  },
  methods: {
    overlayClose() {
      this.showOverlay = false;
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
