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
      <div class="accept-terms">
        <label class="checkbox-container">{{ $t("accessWallet.acceptTerms") }} <a href="/">{{ $t("common.terms") }}</a>.
          <input
            type="checkbox"
            @click="accessMyWalletBtnDisabled = !accessMyWalletBtnDisabled" >
          <span class="checkmark"/>
        </label>
      </div>
      <div class="button-container">
        <standard-button 
          v-if="accessMyWalletBtnDisabled"
          :options="buttonDisabled"
          @click.native="interact = true"
        />
        <router-link to="interface">
          
          <standard-button 
            v-if="!accessMyWalletBtnDisabled"
            :options="buttonAccessMyWallet"
            @click.native="interact = true"
          />

          <!--
          <b-btn
            :disabled="accessMyWalletBtnDisabled"
            class="mid-round-button-green-filled close-button">
            {{ $t("accessWallet.accessMyWallet") }}
          </b-btn>
        -->
        </router-link>

        <!--
        <b-btn
          :disabled="accessMyWalletBtnDisabled"
          class="mid-round-button-green-filled close-button">
          {{ $t("accessWallet.accessMyWallet") }}
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
      accessMyWalletBtnDisabled: true
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
