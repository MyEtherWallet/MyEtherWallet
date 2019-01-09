<template>
  <div class="enter-pin-number-modal">
    <b-modal
      ref="enterpin"
      title="Password"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
    >
      <div class="modal-contents">
        <div class="pin-input-block">
          <p class="main-title">Enter PIN for 123456</p>
          <p class="sub-title">The PIN layout is displayed on your Terzor</p>
          <standard-input :options="passwordInputOptions" />
        </div>
        <div class="button-matrix-block">
          <button></button><button></button><button></button><button></button>
          <button></button><button></button><button></button><button></button>
          <button></button>
        </div>
        <div class="button-block">
          <standard-button
            :options="accessWalletButton"
            class="access-wallet-button"
          />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import StandardInput from '@/components/StandardInput';
import Standardbutton from '@/components/Buttons/StandardButton';

export default {
  name: 'WalletPassword',
  components: {
    'standard-input': StandardInput,
    'standard-button': Standardbutton
  },
  data() {
    return {
      passwordInputOptions: {
        readOnly: true
      },
      accessWalletButton: {
        title: 'Access My Wallet',
        buttonStyle: 'green',
        fullWidth: true,
        acceptTermsCheckBox: true,
        customerSupport: true
      }
    };
  },
  mounted() {
    //this.$refs.enterpin.show();
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'EnterPinNumberModal.scss';
</style>
