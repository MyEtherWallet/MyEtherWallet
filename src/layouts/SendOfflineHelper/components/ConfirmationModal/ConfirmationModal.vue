<template>
  <div class="send-offline-confirmation-modal">
    <b-modal
      ref="sendOfflineConfirmation"
      title="Confirmation"
      hide-footer
      centered
      class="bootstrap-modal-wide nopadding"
    >
      <!--      <div class="modal-content qrcode-modal">
        <div class="tx-info">
          <address-block
            :address="rawTx.from"
            :value="rawTx.value"
            direction="from"
          />
          <div
            v-show="rawTx.to !== '' && rawTx.to !== undefined"
            class="direction"
          >
            <img src="~@/assets/images/icons/right-arrow.svg" />
          </div>
          <address-block
            v-show="rawTx.to !== '' && rawTx.to !== undefined"
            :address="rawTx.to"
            :value="rawTx.value"
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
                <p>From Address</p>
                <p>{{ rawTx.from }}</p>
              </div>
              <div class="grid-block">
                <p>To Address</p>
                <p>{{ rawTx.to }}</p>
              </div>
              <div class="grid-block">
                <p>Nonce</p>
                <p>{{ rawTx.nonce }}</p>
              </div>
              <div class="grid-block">
                <p>Value</p>
                <p>{{ rawTx.value }}</p>
              </div>
              <div class="grid-block">
                <p>Data</p>
                <p class="data">{{ rawTx.data }}</p>
              </div>
              <div class="grid-block">
                <p>Chain ID</p>
                <p>{{ rawTx.chainID }}</p>
              </div>
              <div class="grid-block">
                <p>Gas Limit</p>
                <p>{{ rawTx.gasLimit }}</p>
              </div>
              <div class="grid-block">
                <p>Gas Price</p>
                <p>{{ rawTx.gasPrice }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>-->

      <div class="modal-contents">
        <div class="tx-info-container">
          <ul>
            <li>From Address</li>
            <li>{{ rawTx.from }}</li>
          </ul>
          <ul>
            <li>To Address</li>
            <li>{{ rawTx.to }}</li>
          </ul>
          <ul>
            <li>Nonce</li>
            <li>{{ rawTx.nonce }}</li>
          </ul>
          <ul>
            <li>Value</li>
            <li>{{ rawTx.value }}</li>
          </ul>
          <ul>
            <li>Data</li>
            <li class="data">{{ rawTx.data }}</li>
          </ul>
          <ul>
            <li>Chain ID</li>
            <li>{{ rawTx.chainID }}</li>
          </ul>
          <ul>
            <li>Gas Limit</li>
            <li>{{ rawTx.gasLimit }}</li>
          </ul>
          <ul>
            <li>Gas Price</li>
            <li>{{ rawTx.gasPrice }}</li>
          </ul>
        </div>
        <expending-option :hidebottomborder="true" title="Signed Transaction">
          <div class="raw-signed">
            {{ signedTx }}
          </div>
        </expending-option>
        <expending-option title="Raw Transaction">
          {{ rawTx }}
        </expending-option>
        <div class="button-block-container">
          <standard-button :options="buttonConfirmAndSend" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import StandardInput from '@/components/StandardInput';
import Standardbutton from '@/components/Buttons/StandardButton';
import ExpendingOption from '@/components/ExpendingOption';

import AddressBlock from '../AddressBlock';
export default {
  name: 'SendOfflineConfirmation',
  components: {
    'standard-input': StandardInput,
    'standard-button': Standardbutton,
    'expending-option': ExpendingOption,
    'address-block': AddressBlock
  },
  props: {
    envDetails: {
      type: Object,
      default: function() {
        return {};
      }
    },
    rawTx: {
      type: Object,
      default: function() {
        return {};
      }
    },
    signedTx: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      modalDetailInformation: false,
      inputRawTx: {
        isTextarea: true,
        buttonClear: true,
        buttonCopy: true
      },
      buttonConfirmAndSend: {
        title: 'Confirm & Send',
        buttonStyle: 'green',
        helpCenter: true
      }
    };
  },
  beforeDestroy() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'ConfirmationModal.scss';
</style>
