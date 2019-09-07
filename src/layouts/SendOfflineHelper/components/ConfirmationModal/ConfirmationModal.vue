<template>
  <div class="send-offline-confirmation-modal">
    <b-modal
      ref="sendOfflineConfirmation"
      title="Confirmation"
      hide-footer
      centered
      class="bootstrap-modal-wide nopadding"
    >
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
