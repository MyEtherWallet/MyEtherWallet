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
            <li>0xEbf120093E45f6B4438f297AF97Dd3E5419df1E7</li>
          </ul>
          <ul>
            <li>Transaction Fee</li>
            <li>2000 Gwei (0.000013 ETH / $2.13)</li>
          </ul>
          <ul>
            <li>Nonce</li>
            <li>2345</li>
          </ul>
        </div>
        <expending-option :hidebottomborder="true" title="Signed Transaction">
          <standard-input :options="inputRawTx" class="no-margin" />
        </expending-option>
        <expending-option title="Raw Transaction">
          <standard-input :options="inputRawTx" class="no-margin" />
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

export default {
  name: 'SendOfflineConfirmation',
  components: {
    'standard-input': StandardInput,
    'standard-button': Standardbutton,
    'expending-option': ExpendingOption
  },
  data() {
    return {
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
  // mounted() {
  //   this.$refs.sendOfflineConfirmation.show();
  // },
  beforeDestroy() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'ConfirmationModal.scss';
</style>
