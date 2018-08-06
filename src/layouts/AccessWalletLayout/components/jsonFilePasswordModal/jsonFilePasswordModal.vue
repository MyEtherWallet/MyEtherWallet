<template>
  <b-modal ref="software" hide-footer class="bootstrap-modal modal-metamask" title="Password" centered>
    <div class="input-container">
      <input type="password" autocomplete="off" />
    </div>
    <div class="accept-terms">
      <label class="checkbox-container">{{ $t("accessWallet.acceptTerms") }} <a href="/">{{ $t("common.terms") }}</a>.
        <input v-on:click="accessMyWalletBtnDisabled = !accessMyWalletBtnDisabled" type="checkbox" />
        <span class="checkmark"></span>
      </label>
    </div>
    <div class="button-container">
      <b-btn class="mid-round-button-green-filled close-button" :disabled="accessMyWalletBtnDisabled">
        {{ $t("accessWallet.accessMyWallet") }}
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
  props: ['networkAndAddressOpen'],
  data () {
    return {
      accessMyWalletBtnDisabled: true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "jsonFilePasswordModal.scss";
</style>
