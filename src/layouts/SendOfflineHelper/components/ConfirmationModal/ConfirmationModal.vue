<template>
  <div class="send-offline-confirmation-modal">
    <b-modal
      ref="sendOfflineConfirmation"
      :title="$t('sendTx.confirmation.title')"
      hide-footer
      centered
      class="bootstrap-modal-wide nopadding"
      static
      lazy
    >
      <div class="modal-contents">
        <div class="tx-info-container">
          <ul>
            <li>{{ $t('sendTx.from-addr') }}</li>
            <li>{{ rawTx.from }}</li>
          </ul>
          <ul>
            <li>{{ $t('sendTx.to-addr') }}</li>
            <li>{{ rawTx.to }}</li>
          </ul>
          <ul>
            <li>{{ $t('sendTx.nonce') }}</li>
            <li>{{ rawTx.nonce }}</li>
          </ul>
          <ul>
            <li>{{ $t('common.value') }}/li></li>
            <li>{{ rawTx.value }}</li>
          </ul>
          <ul>
            <li>{{ $t('sendTx.data') }}</li>
            <li class="data">{{ rawTx.data }}</li>
          </ul>
          <ul>
            <li>{{ $t('common.chain-id') }}</li>
            <li>{{ rawTx.chainID }}</li>
          </ul>
          <ul>
            <li>{{ $t('common.gas.limit') }}t</li>
            <li>{{ rawTx.gasLimit }}</li>
          </ul>
          <ul>
            <li>{{ $t('common.gas.price') }}</li>
            <li>{{ rawTx.gasPrice }}</li>
          </ul>
        </div>
        <expanding-option
          :hidebottomborder="true"
          :title="$t('sendTx.signed.tx')"
        >
          <div class="raw-signed">{{ signedTx }}</div>
        </expanding-option>
        <expanding-option :title="$t('sendTx.raw-tx')">{{
          rawTx
        }}</expanding-option>
        <div class="button-block-container">
          <standard-button :options="buttonConfirmAndSend" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Standardbutton from '@/components/Buttons/StandardButton';
import ExpandingOption from '@/components/ExpandingOption';

export default {
  name: 'SendOfflineConfirmation',
  components: {
    'standard-button': Standardbutton,
    'expanding-option': ExpandingOption
  },
  props: {
    envDetails: {
      type: Object,
      default: function () {
        return {};
      }
    },
    rawTx: {
      type: Object,
      default: function () {
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
