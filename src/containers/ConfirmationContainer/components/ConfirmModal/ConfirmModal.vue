<template>
  <div class="modal-container">
    <b-modal
      ref="confirmation"
      :title="$t('sendTx.confirmation.title')"
      hide-footer
      centered
      class="bootstrap-modal-wide confirmation-modal nopadding"
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
            <h4>{{ $t('sendTx.confirmation.detail-info') }}</h4>
            <div class="sliding-switch-white">
              <label class="switch">
                <input
                  ref="switchBox"
                  type="checkbox"
                  :checked="modalDetailInformation"
                  @click="modalDetailInformation = !modalDetailInformation"
                />
                <span class="slider round" />
              </label>
            </div>
          </div>
          <div
            :class="[modalDetailInformation ? 'expended-info-open' : '']"
            class="expended-info"
          >
            <div class="padding-container">
              <div class="grid-block">
                <p>{{ $t('common.network') }}</p>
                <p>
                  {{ network.type.name }} {{ $t('common.by') }}
                  {{ network.service }}
                </p>
              </div>
              <div class="grid-block">
                <p>{{ $t('common.gas.limit') }}</p>
                <p>{{ gas }} {{ $t('common.gas.wei') }}</p>
              </div>
              <div class="grid-block">
                <p>{{ $t('common.gas.price') }}</p>
                <p>{{ gasPrice }} {{ $t('common.gas.gwei') }}</p>
              </div>
              <div v-if="gasPrice >= 100" class="gas-price-warning">
                {{ $t('errorsGlobal.high-gas-limit-warning') }}
              </div>
              <div class="grid-block">
                <p>{{ $t('sendTx.tx-fee') }}</p>
                <p>{{ fee }} {{ network.type.currencyName }}</p>
              </div>
              <div class="grid-block">
                <p>{{ $t('sendTx.nonce') }}</p>
                <p>{{ nonce }}</p>
              </div>
              <div class="grid-block">
                <p>{{ $t('sendTx.data') }}</p>
                <p>{{ data }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="submit-button-container">
          <standard-button
            :options="{
              title: $t('sendTx.confirmation.button'),
              buttonStyle: 'green',
              mobileFullWidth: true,
              helpCenter: true
            }"
            :button-disabled="signedTx !== '' ? false : true"
            :click-function="sendTx"
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
      tokenSymbol: ''
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network'])
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
    this.$refs.confirmation.$on('show', () => {
      if (this.gasPrice >= 100) {
        this.modalDetailInformation = !this.modalDetailInformation;
      }
    });
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
