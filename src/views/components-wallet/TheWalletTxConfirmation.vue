<template>
  <mew-overlay
    :show-overlay="showOverlay"
    :title="title ? title : 'Confirmation'"
    left-btn-text=""
    :right-btn-text="$t('common.close')"
    :close="overlayClose"
  >
    <template #mewOverlayBody>
      <v-sheet max-width="600px" class="pa-8">
        <from-to-block :from="from" :to="to" class="mb-2" />
        <balance-block :tx-fee="txFee" :tx-fee-usd="txFeeUSD" :value="value" />
        <mew-expand-panel :panel-items="panelItems" :is-toggle="true">
          <template #panelBody1>
            <div class="px-3">
              <div class="d-flex justify-space-between mb-2">
                <div>Network</div>
                <div>{{ network.type.name }} by {{ network.service }}</div>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <div>Gas Price</div>
                <div>
                  {{ gasPrice }} <span class="primary--text">GWEI</span>
                </div>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <div>Gas Limit</div>
                <div>{{ gasLimit }}</div>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <div>Nonce</div>
                <div>{{ nonce }}</div>
              </div>
              <div class="d-flex justify-space-between">
                <div>Data</div>
                <div class="data">{{ data }}</div>
              </div>
            </div>
          </template>
        </mew-expand-panel>
        <div class="d-flex justify-center my-8">
          <mew-button
            btn-size="xlarge"
            title="Confirm and Send"
            @click.native="send"
          />
        </div>
        <mew-warning-sheet :description="warningDescription" />
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import EventNames from '@/utils/web3-provider/events.js';
import utils from 'web3-utils';
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { Toast, SUCCESS } from '@/components/toast';
import getService from '@/core/helpers/getService';
import { EventBus } from '@/core/plugins/eventBus';
import fromToBlock from '@/components/from-to-block/FromToBlock';
import balanceBlock from '@/components/balance-block/BalanceBlock';

export default {
  name: 'ConfirmationContainer',
  components: {
    fromToBlock,
    balanceBlock
  },
  data() {
    return {
      showOverlay: false,
      tx: {},
      resolver: () => {},
      title: '',
      signedTxObject: {},
      signedTx: {},
      warningDescription:
        'Make sure all your transaction details are CORRECT. Canceling or replacing transactions can not be guaranteed to work. You still be charged gas fee even transaction failing. Learn more here…',
      panelItems: [
        {
          name: 'Details'
        }
      ],
      activeTab: 0
    };
  },
  computed: {
    ...mapState('wallet', ['instance']),
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
  watch: {
    gasLimit(newVal, oldVal) {
      console.error('gasLimit', newVal, oldVal);
    },
    gasPrice(newVal, oldVal) {
      console.error('gasPrice', newVal, oldVal);
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
  },
  methods: {
    overlayClose() {
      this.showOverlay = false;
    },
    send() {
      this.resolver(this.signedTxObject);
      EventBus.$emit('confirmedTx');
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
<style lang="scss">
.data {
  max-width: 300px;
  text-align: right;
  overflow-wrap: break-word;
}
</style>
