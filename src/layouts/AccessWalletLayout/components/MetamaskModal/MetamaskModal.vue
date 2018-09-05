<template>
  <b-modal
    ref="metamask"
    :title="$t('accessWallet.accessByMetaMask')"
    hide-footer
    class="bootstrap-modal modal-metamask"
    centered>
    <div class="modal-multi-icons">
      <img
        class="icon"
        src="~@/assets/images/icons/button-metamask-fox.svg">
      <img
        class="icon"
        src="~@/assets/images/icons/clip.svg">
      <img
        class="icon logo-small"
        src="~@/assets/images/logo-small.png">
    </div>
    <div class="d-block content-container text-center">
      <h4>
        {{ $t("accessWallet.metaMaskModalDesc") }}
      </h4>
    </div>
    <div class="accept-terms">
      <label class="checkbox-container">{{ $t("accessWallet.acceptTerms") }} <a href="/">{{ $t("common.terms") }}</a>.
        <input
          type="checkbox"
          @click="accessMyWalletBtnDisabled = !accessMyWalletBtnDisabled" >
        <span class="checkmark"/>
      </label>
    </div>
    <div class="button-container">
      <b-btn
        :disabled="accessMyWalletBtnDisabled"
        class="mid-round-button-green-filled close-button">
        {{ $t("accessWallet.accessMyWallet") }}
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
    networkAndAddressOpen: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      accessMyWalletBtnDisabled: true
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'MetamaskModal.scss';
</style>
