<template>
  <b-modal ref="hardware" hide-footer class="bootstrap-modal modal-hardware" title="Access by Hardware">
    <div class="d-block content-container text-center">
      <ul class="button-options">
        <li>
          <img class="icon" src="~@/assets/images/icons/button-ledger.png">
          <img class="icon-hover" src="~@/assets/images/icons/button-ledger-hover.png">
          <span>Ledger Wallet</span>
        </li>
        <li>
          <img class="icon" src="~@/assets/images/icons/button-trezor.png">
          <img class="icon-hover" src="~@/assets/images/icons/button-trezor-hover.png">
          <span>Trezor</span>
        </li>
        <li>
          <img class="icon" src="~@/assets/images/icons/button-bitbox.png">
          <img class="icon-hover" src="~@/assets/images/icons/button-bitbox-hover.png">
          <span>Digital Bitbox</span>
        </li>
        <li>
          <img class="icon" src="~@/assets/images/icons/button-secalot.png">
          <img class="icon-hover" src="~@/assets/images/icons/button-secalot-hover.png">
          <span>Secalot</span>
        </li>
      </ul>

      <h3 class="modal-large-text">{{ $t("reused.connectDevice") }}</h3>
    </div>
    <div class="button-container">
      <b-btn class="mid-round-button-green-filled close-button" v-on:click="networkAndAddressOpen">
        {{ $t("reused.continue") }}
      </b-btn>
    </div>
    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/home/bell.png"></div>
          <div class="support-label"><h5>{{ $t("reused.customerSupport") }}</h5></div>
        </div>
      </router-link>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: [
    'networkAndAddressOpen'
  ],
  data: function () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "HardwareModal.scss";
</style>
