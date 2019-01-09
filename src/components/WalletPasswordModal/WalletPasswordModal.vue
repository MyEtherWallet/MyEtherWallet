<template>
  <div class="wallet-password-modal">
    <b-modal
      ref="walletpassword"
      title="Password"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
    >
      <div class="modal-contents">
        <standard-input :options="passwordInputOptions" />

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
        type: 'password'
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
    //this.$refs.walletpassword.show();
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'WalletPasswordModal.scss';
</style>
