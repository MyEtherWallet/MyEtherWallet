<template>
  <b-modal ref="networkAndAddress" hide-footer class="bootstrap-modal modal-network-and-address" title="Network and Address">
    <div class="content-container-1">
      <div class="hd-derivation">
        <h4>{{ $t("accessMyWalletOptions.hdDerivationPath") }}</h4>
        <div class="dropdown-button-container">
          <b-dropdown id="hd-derivation-path" text="m/44’/60’/0’/0" class="dropdown-button-1">
            <b-dropdown-item class="active">m/44’/60’/0’/0</b-dropdown-item>
            <b-dropdown-item>m/44’/60’/0’/0</b-dropdown-item>
            <b-dropdown-item>m/44’/60’/0’/0</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item>{{ $t("accessMyWalletOptions.customPath") }}</b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <p class="derivation-brands">Jaxx, Metamask, Exodus, imToken, Trezor(ETH) & Digital Bitbox</p>
    </div>
    <div class="content-container-2">
      <div class="address-block-container">
        <div class="block-title">
          <h4>{{ $t("accessMyWalletOptions.interactAddr") }}</h4>
        </div>

        <ul class="address-block table-header">
          <li>{{ $t("accessMyWalletOptions.id") }}</li>
          <li>{{ $t("reused.address") }}</li>
          <li>{{ $t("reused.balance") }}</li>
          <li></li>
        </ul>

        <ul class="address-block address-data selected">
          <li>1.</li>
          <li>0xDECAF9CD2367cd21bbiuwehf34f34f839h</li>
          <li>2.2233445 ETH</li>
          <li class="user-input-checkbox">
            <label class="checkbox-container checkbox-container-small">
              <input type="checkbox">
              <span class="checkmark checkmark-small"></span>
            </label>
          </li>
        </ul>

        <ul class="address-block address-data">
          <li>2.</li>
          <li>0xDECAF9CD2367cd21bbiuwehf34f34f839h</li>
          <li>2.2233445 ETH</li>
          <li class="user-input-checkbox">
            <label class="checkbox-container checkbox-container-small">
              <input type="checkbox">
              <span class="checkmark checkmark-small"></span>
            </label>
          </li>
        </ul>

        <ul class="address-block address-data">
          <li>3.</li>
          <li>0xDECAF9CD2367cd21bbiuwehf34f34f839h</li>
          <li>2.2233445 ETH</li>
          <li class="user-input-checkbox">
            <label class="checkbox-container checkbox-container-small">
              <input type="checkbox">
              <span class="checkmark checkmark-small"></span>
            </label>
          </li>
        </ul>

        <ul class="address-block address-data">
          <li>4.</li>
          <li>0xDECAF9CD2367cd21bbiuwehf34f34f839h</li>
          <li>2.2233445 ETH</li>
          <li class="user-input-checkbox">
            <label class="checkbox-container checkbox-container-small">
              <input type="checkbox">
              <span class="checkmark checkmark-small"></span>
            </label>
          </li>
        </ul>
      </div> <!-- .address-block-container -->

      <div class="address-nav">
        <span>&lt; {{ $t("reused.previous") }}</span>
        <span>{{ $t("reused.next") }} &gt;</span>
      </div>
    </div> <!-- .content-container-2 -->

    <div class="accept-terms">
      <label class="checkbox-container">{{ $t("accessMyWalletOptions.acceptTerms") }} <a href="/">{{ $t("reused.terms") }}</a>.
        <input type="checkbox">
        <span class="checkmark"></span>
      </label>
    </div>
    <div class="button-container">
      <b-btn class="mid-round-button-green-filled close-button">
        {{ $t("reused.continue") }}
      </b-btn>
    </div>
    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/icons/help-center.svg"></div>
          <div class="support-label"><h5>{{ $t("reused.customerSupport") }}</h5></div>
        </div>
      </router-link>
    </div>
  </b-modal>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "NetworkAndAddressModal.scss";
</style>
