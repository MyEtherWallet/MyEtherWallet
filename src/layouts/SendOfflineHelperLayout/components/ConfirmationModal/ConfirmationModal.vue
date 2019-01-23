<template>
  <div class="send-offline-confirmation">
    <b-modal
      ref="sendOfflineConfirmation"
      title="Confirmation"
      hide-footer
      centered
      class="bootstrap-modal-wide nopadding"
    >
      <div class="modal-contents">
        <ul>
          <li>
            <div class="name">From Address</div>
            <div class="data address">
              0xF51D8788053029267D414828699C96535eD78bB7
            </div>
          </li>
          <li>
            <div class="name">Transaction Fee</div>
            <div class="data">2000 Gwei (0.000013 ETH / $2.13)</div>
          </li>
          <li>
            <div class="name">Nonce</div>
            <div class="data">2345</div>
          </li>
        </ul>
        <div class="expending">
          <expending-options title="Signed Transaction" nobottomborder="false">
            <standard-input :options="signTx" />
          </expending-options>
          <expending-options title="Raw Transaction">
            <standard-input :options="rawTx" />
          </expending-options>
        </div>
        <div class="confirmation-button">
          <standard-button :options="confirmButton" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import StandardInput from '@/components/StandardInput';
import Standardbutton from '@/components/Buttons/StandardButton';
import ExpendingOptions from '@/components/ExpendingOptions';

export default {
  components: {
    'standard-input': StandardInput,
    'standard-button': Standardbutton,
    'expending-options': ExpendingOptions
  },
  data() {
    return {
      signTx: {
        readOnly: true,
        isTextarea: true,
        buttonCopy: true,
        buttonClear: true
      },
      rawTx: {
        readOnly: true,
        isTextarea: true,
        buttonCopy: true,
        buttonClear: true
      },
      confirmButton: {
        title: 'Confirm & Send',
        buttonStyle: 'green',
        checkbox: false,
        helpCenter: true
      }
    };
  },
  mounted() {
    this.$refs.sendOfflineConfirmation.show();
  },
  beforeDestroy() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'ConfirmationModal.scss';
</style>
