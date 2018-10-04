<template>
  <b-modal
    ref="installmetamask"
    hide-footer
    class="bootstrap-modal install-modal-metamask"
    title="Access by MetaMask"
    centered>
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
      <b-btn
        class="mid-round-button-green-filled close-button"
        @click="metamaskmodal">
        {{ $t("accessWallet.installMetamask") }}
      </b-btn>
    </div>
    <customer-support/>
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
      default: function() {
        console.log('metamaskmodal');
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'InstallMetamaskModal.scss';
</style>
