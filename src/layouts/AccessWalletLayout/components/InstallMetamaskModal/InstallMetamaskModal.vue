<template>
  <b-modal
    ref="installmetamask"
    hide-footer
    class="bootstrap-modal install-modal-metamask"
    title="Access by MetaMask"
    centered>
    <div class="metamask-modal-content">
      <div class="modal-multi-icons">
        <img
          class="icon"
          src="~@/assets/images/icons/button-metamask-fox.svg">

      </div>
      <div class="d-block content-container text-center">
        <h4>
          {{ $t("accessWallet.installMetaMaskModalDesc") }}
        </h4>
      </div>
      <div class="accept-terms hidden">
        <label class="checkbox-container">{{ $t("accessWallet.acceptTerms") }} <a href="/">{{ $t("common.terms") }}</a>.
          <input type="checkbox" >
          <span class="checkmark"/>
        </label>
      </div>
      <div class="button-container">
        <standard-button 
          :options="buttonInstallMetaMask"
          @click.native="metamaskmodal"
        />

        <!--
        <b-btn
          class="mid-round-button-green-filled close-button"
          @click="metamaskmodal">
          {{ $t("accessWallet.installMetamask") }}
        </b-btn>
      -->
      </div>
      <customer-support/>
    </div><!-- .metamask-modal-content -->
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';

export default {
  components: {
    'customer-support': CustomerSupport
  },
  props: {
    metamaskmodal: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      buttonInstallMetaMask: {
        title: 'Install MataMask',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'InstallMetamaskModal.scss';
</style>
