<template>
  <b-modal ref="mewConnect" hide-footer class="bootstrap-modal modal-mew-connect" title="Access by MEW Connect" centered>
    <div class="modal-icon">
      <img class="icon" src="~@/assets/images/icons/qr-code.jpg">
    </div>
    <div class="d-block content-container text-center">
      <h3 class="modal-large-text">Please use MEWconnect App to scan the QR code above</h3>
    </div>
    <div class="appstore-button-container">
      <img src="~@/assets/images/icons/appstore.png">
      <p>Do not have our App? Download now.</p>
    </div>
    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/icons/help-center.svg"></div>
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
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "MewConnectModal.scss";
</style>
