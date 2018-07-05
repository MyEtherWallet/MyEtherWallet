<template>
  <b-modal ref="hardware" hide-footer class="bootstrap-modal modal-hardware" title="Access by Hardware" centered>
    <div class="d-block text-center">
      <ul class="button-options hardware-button-options">
        <li v-on:click="hardwareButtonActivate($event)">
          <img class="icon" src="~@/assets/images/icons/button-ledger.png">
          <img class="icon-hover" src="~@/assets/images/icons/button-ledger-hover.png">
          <span>Ledger Wallet</span>
        </li>
        <li v-on:click="hardwareButtonActivate($event)">
          <img class="icon" src="~@/assets/images/icons/button-trezor.png">
          <img class="icon-hover" src="~@/assets/images/icons/button-trezor-hover.png">
          <span>Trezor</span>
        </li>
        <li v-on:click="hardwareButtonActivate($event)">
          <img class="icon" src="~@/assets/images/icons/button-bitbox.png">
          <img class="icon-hover" src="~@/assets/images/icons/button-bitbox-hover.png">
          <span>Digital Bitbox</span>
        </li>
        <li v-on:click="hardwareButtonActivate($event)">
          <img class="icon" src="~@/assets/images/icons/button-secalot.png">
          <img class="icon-hover" src="~@/assets/images/icons/button-secalot-hover.png">
          <span>Secalot</span>
        </li>
      </ul>
    </div>
    <div class="button-container">
      <div class="mid-round-button-green-filled connection-button waiting-for-connection" v-on:click="networkAndAddressOpen">
        Please Connect With Your Device
      </div>
    </div>
    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/icons/help-center.png"></div>
          <div class="support-label"><h5>Customer Support</h5></div>
        </div>
      </router-link>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: ['networkAndAddressOpen'],
  data () {
    return {}
  },
  method: {
    hardwareButtonActivate (e) {
      var everyButtonEl = document.querySelectorAll('.hardware-button-options li')
      everyButtonEl.forEach(function (el) {
        el.classList.remove('active')
      })
      e.target.classList.add('active')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "HardwareModal.scss";
</style>
