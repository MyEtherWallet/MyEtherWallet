<template>
  <div class="modal-container">
    <b-modal
      ref="confirmation"
      hide-footer
      centered
      class="bootstrap-modal-wide confirmation-modal nopadding"
      title="Confirmation"
      static
      lazy
    >
      <div class="modal-content qrcode-modal">
        <div class="tx-info">
          <address-block
            :currency="network.type.currencyName"
            :icon="network.type.icon"
            :address="from"
            :value="value"
            :token-transfer-val="tokenTransferVal"
            :token-symbol="tokenSymbol"
            direction="from"
          />
          <div v-show="to !== '' && to !== undefined" class="direction">
            <img src="~@/assets/images/icons/right-arrow.svg" alt />
          </div>
          <address-block
            v-show="to !== '' && to !== undefined"
            :currency="network.type.currencyName"
            :icon="network.type.icon"
            :address="to"
            :token-transfer-to="tokenTransferTo"
            :token-transfer-val="tokenTransferVal"
            :token-symbol="tokenSymbol"
            :value="value"
            direction="to"
          />
        </div>
        <div class="detail-info">
          <div class="info">
            <h4>Detail Information</h4>
            <div class="sliding-switch-white">
              <label class="switch">
                <input
                  type="checkbox"
                  @click="modalDetailInformation = !modalDetailInformation"
                />
                <span class="slider round" />
              </label>
            </div>
          </div>
          <div
            :class="modalDetailInformation && 'expended-info-open'"
            class="expended-info"
          >
            <div class="padding-container">
              <div class="grid-block">
                <p>{{ $t('common.network') }}</p>
                <p>{{ network.type.name }} by {{ network.service }}</p>
              </div>
              <div class="grid-block">
                <p>{{ $t('common.gasLimit') }}</p>
                <p>{{ gas }} wei</p>
              </div>
              <div class="grid-block">
                <p>{{ $t('common.gasPrice') }}</p>
                <p>{{ gasPrice }} gwei</p>
              </div>
              <div class="grid-block">
                <p>{{ $t('common.txFee') }}</p>
                <p>{{ fee }} {{ network.type.currencyName }}</p>
              </div>
              <div class="grid-block">
                <p>Nonce</p>
                <p>{{ nonce }}</p>
              </div>
              <div class="grid-block">
                <p>{{ $t('common.data') }}</p>
                <p>{{ data }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="submit-button-container">
          <standard-button
            :options="buttonSendTx"
            :button-disabled="signedTx !== '' ? false : true"
            @click.native="sendTx"
          />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import AddressBlock from '../AddressBlock';
import { mapState } from 'vuex';
import StandardButton from '@/components/Buttons/StandardButton';
import parseTokensData from '@/helpers/parseTokensData.js';

export default {
  components: {
    'address-block': AddressBlock,
    'standard-button': StandardButton
  },
  props: {
    confirmSendTx: {
      type: Function,
      default: function() {}
    },
    fee: {
      type: String,
      default: ''
    },
    signedTx: {
      type: String,
      default: ''
    },
    data: {
      type: String,
      default: '0x'
    },
    from: {
      type: String,
      default: ''
    },
    gas: {
      type: String,
      default: ''
    },
    gasPrice: {
      type: Number,
      default: 0
    },
    nonce: {
      type: String,
      default: ''
    },
    to: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    isHardwareWallet: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalDetailInformation: false,
      transactionSigned: false,
      tokenTransferTo: '',
      tokenTransferVal: '',
      tokenSymbol: '',
      buttonSendTx: {
        title: 'Confirm and Send',
        buttonStyle: 'green',
        mobileFullWidth: true,
        helpCenter: true
      }
    };
  },
  computed: {
    ...mapState(['web3', 'network']),
    signedTransaction() {
      if (this.signedMessage) {
        return this.signedMessage;
      } else if (this.isHardwareWallet) {
        return this.$t('confirmation.approveOnDevice');
      }
      return '';
    }
  },
  watch: {
    data(newVal) {
      this.parseData(newVal);
    }
  },
  mounted() {
    if (this.data !== '0x') {
      this.parseData();
    }
  },
  methods: {
    sendTx() {
      if (this.signedTx !== '') {
        this.confirmSendTx();
      }
    },
    parseData(val) {
      const localVal = val ? val : this.data;
      const tokenInfo = parseTokensData(
        localVal,
        this.to,
        this.web3,
        this.network.type.tokens,
        this.network.type.name
      );
      this.tokenTransferTo = tokenInfo.tokenTransferTo;
      this.tokenTransferVal = tokenInfo.tokenTransferVal;
      this.tokenSymbol = tokenInfo.tokenSymbol;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ConfirmModal.scss';
</style>
