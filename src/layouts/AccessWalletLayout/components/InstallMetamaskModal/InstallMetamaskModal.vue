<template>
  <b-modal
    ref="metamask"
    hide-footer
    class="bootstrap-modal modal-metamask"
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
      <b-btn class="mid-round-button-green-filled close-button">
        {{ $t("accessWallet.installMetamask") }}
      </b-btn>
    </div>
    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/icons/help-center.svg"></div>
          <div class="support-label"><h5>{{ $t("common.customerSupport") }}</h5></div>
        </div>
      </router-link>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    networkAndAddressOpen: {
      type: Function,
      default: function() {}
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
