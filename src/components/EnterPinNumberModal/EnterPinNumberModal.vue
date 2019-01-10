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
          <p class="main-title">Enter PIN for your {{ deviceInfo.name }}</p>
          <p class="sub-title">
            The PIN layout is displayed on your Hardware wallet
          </p>
          <standard-input :options="passwordInputOptions" />
        </div>
        <div class="button-matrix-block">
          <button @click="passwordInputOptions.value += '7'"></button>
          <button @click="passwordInputOptions.value += '8'"></button>
          <button @click="passwordInputOptions.value += '9'"></button>
          <button @click="passwordInputOptions.value += '4'"></button>
          <button @click="passwordInputOptions.value += '5'"></button>
          <button @click="passwordInputOptions.value += '6'"></button>
          <button @click="passwordInputOptions.value += '1'"></button>
          <button @click="passwordInputOptions.value += '2'"></button>
          <button @click="passwordInputOptions.value += '3'"></button>
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
        readOnly: true,
        type: 'password',
        value: '',
        buttonClear: true,
        title: 'PIN'
      },
      accessWalletButton: {
        title: 'Access My Wallet',
        buttonStyle: 'green',
        fullWidth: true,
        acceptTermsCheckBox: true,
        customerSupport: true,
        onClick: () => {}
      },
      deviceInfo: {}
    };
  },
  watch: {},
  created() {
    this.$eventHub.$on('showHardwarePinMatrix', (deviceInfo, callback) => {
      this.deviceInfo = deviceInfo;
      this.accessWalletButton.onClick = () => {
        callback(this.passwordInputOptions.value);
      };
      this.$refs.enterpin.show();
    });
  },
  mounted() {
    this.passwordInputOptions.pin = '';
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'EnterPinNumberModal.scss';
</style>
