<template>
  <b-modal
    ref="metamask"
    :title="$t('accessWallet.accessByMetaMask')"
    hide-footer
    class="bootstrap-modal modal-metamask"
    centered>
    <div class="metamask-modal-content">
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
      <div class="terms-container">
        <accept-terms-checker @click="needToAcceptTerms = !needToAcceptTerms"/>
      </div>
      <div class="button-container">
        <standard-button
          :show="!needToAcceptTerms"
          :disabled="true"
          :button-style="'gray'"
          @click.native="interact = true"
        >{{ $t("accessWallet.accessMyWallet") }}</standard-button>
        <router-link to="interface">

          <standard-button
            :show="needToAcceptTerms"
            @click="interact = true"
          />
        </router-link>
      </div>
      <customer-support/>
    </div><!-- .metamask-modal-content -->
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import AcceptTermsChecker from '@/components/AcceptTermsChecker';

export default {
  components: {
    'accept-terms-checker': AcceptTermsChecker,
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
      buttonDisabled: {
        title: 'Access My Wallet',
        buttonStyle: 'grey',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true
      },
      buttonAccessMyWallet: {
        title: 'Access My Wallet',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true
      },
      needToAcceptTerms: true
    };
  },
  mounted() {
    //this.$refs.metamask.show();
  }
};
</script>

<style lang="scss" scoped>
@import 'MetamaskModal.scss';
</style>
