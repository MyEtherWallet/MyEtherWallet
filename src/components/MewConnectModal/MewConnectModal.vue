<template>
  <b-modal ref="mewConnect" hide-footer class="bootstrap-modal modal-mew-connect" title="Access by MEW Connect">
    <div class="modal-icon">
      <img class="icon" src="~@/assets/images/icons/button-connect.svg">
    </div>
    <div class="d-block content-container text-center">
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
  @import "MewConnectModal.scss";
</style>
