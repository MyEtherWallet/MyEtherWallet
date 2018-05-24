<template>
  <div class="access-my-wallet-options">

    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <div class="modal-container">
      <!-- Modal (MEW Connect) =================================== -->
      <b-modal ref="mewConnect" hide-footer class="bootstrap-modal modal-mew-connect" title="Access by MEW Connect">
        <div class="modal-icon">
          <img class="icon" src="~@/assets/images/icons/button-connect.svg">
        </div>
        <div class="d-block content-container text-center">
          <h3 class="modal-large-text">Please Connect With Your Device</h3>
        </div>
        <div class="button-container">
          <b-btn class="mid-round-button-green-filled close-button">
            Continue
          </b-btn>
        </div>
        <div class="support">
          <router-link to="/">
            <div class="support-content">
              <div class="support-icon"><img src="~@/assets/images/home/bell.png"></div>
              <div class="support-label"><h5>Customer Support</h5></div>
            </div>
          </router-link>
        </div>
      </b-modal>

      <!-- Modal (Hardware) =================================== -->
      <b-modal ref="hardware" hide-footer class="bootstrap-modal modal-hardware" title="Access by Hardware">
        <div class="d-block content-container text-center">
          <ul class="button-options">
            <li>Ledger Wallet</li>
            <li>Trezor</li>
            <li>Digital Bitbox</li>
            <li>Secalot</li>
          </ul>

          <h3 class="modal-large-text">Please Connect With Your Device</h3>
        </div>
        <div class="button-container">
          <b-btn class="mid-round-button-green-filled close-button">
            Continue
          </b-btn>
        </div>
        <div class="support">
          <router-link to="/">
            <div class="support-content">
              <div class="support-icon"><img src="~@/assets/images/home/bell.png"></div>
              <div class="support-label"><h5>Customer Support</h5></div>
            </div>
          </router-link>
        </div>
      </b-modal>

      <!-- Modal (MetaMask) =================================== -->
      <b-modal ref="metamask" hide-footer class="bootstrap-modal modal-metamask" title="Access by MetaMask">
        <div class="d-block content-container text-center">
          <h4>
            Please use MyEtherWallet on a secure (SSL / HTTPS)
            connection to connect.
          </h4>
          <div class="accept-terms">
            <label class="container">To unlock my wallet, I accept <a href="/">Terms</a>.
              <input type="checkbox">
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
        <div class="button-container">
          <b-btn class="mid-round-button-green-filled close-button">
            Unlock
          </b-btn>
        </div>
        <div class="support">
          <router-link to="/">
            <div class="support-content">
              <div class="support-icon"><img src="~@/assets/images/home/bell.png"></div>
              <div class="support-label"><h5>Customer Support</h5></div>
            </div>
          </router-link>
        </div>
      </b-modal>

      <!-- Modal (Software) =================================== -->
      <b-modal ref="software" hide-footer class="bootstrap-modal modal-software" title="Access by Software">
        <div class="d-block content-container text-center">
          <ul class="button-options">
            <li>JSON File</li>
            <li>Mnemonic Phrase</li>
            <li>Private Key</li>
          </ul>
        </div>
        <div class="button-container">
          <b-btn class="mid-round-button-green-filled close-button">
            Continue
          </b-btn>
        </div>
        <div class="support">
          <router-link to="/">
            <div class="support-content">
              <div class="support-icon"><img src="~@/assets/images/home/bell.png"></div>
              <div class="support-label"><h5>Customer Support</h5></div>
            </div>
          </router-link>
        </div>
      </b-modal>
    </div>
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->

    <div class="wrap">
      <div class="page-container">
        <div class="title">
          <h2>Access My Wallet</h2>
          <h5>
            Do not have a wallet?
            <router-link to="/">Get a free wallet</router-link>
          </h5>
        </div>
        <div class="buttons-container">

          <div class="button-block" v-on:click="mewConnectModalOpen">
            <div class="button-image">
              <img class="icon" src="~@/assets/images/icons/button-mewconnect.svg">
            </div>
            <h3>MEW Connect</h3>
            <p>Use MEW Connect to access my wallet</p>
            <div class="tooltip-box">
              <span>
                <b-btn v-b-tooltip.hover title="Unfortunately, we encounter these phishing scams/attacks on a daily basis.">What's that?</b-btn>
              </span>
            </div>
          </div>

          <div class="button-block" v-on:click="hardwareModalOpen">
            <div class="button-image">
              <img class="icon" src="~@/assets/images/icons/button-hardware.svg">
            </div>
            <h3>Hardware</h3>
            <p>Ledger wallet; Trezor; Digital bitbox; Secalot</p>
            <div class="tooltip-box">
              <span>
                <b-btn v-b-tooltip.hover title="Unfortunately, we encounter these phishing scams/attacks on a daily basis.">What's that?</b-btn>
              </span>
            </div>
          </div>

          <div class="button-block" v-on:click="metamaskModalOpen">
            <div class="button-image">
              <img class="icon" src="~@/assets/images/icons/button-metamask.svg">
            </div>
            <h3>MetaMask</h3>
            <p>Use extention to access my wallet</p>
            <div class="tooltip-box">
              <span>
                <b-btn v-b-tooltip.hover title="Unfortunately, we encounter these phishing scams/attacks on a daily basis.">What's that?</b-btn>
              </span>
            </div>
          </div>

          <div class="button-block" v-on:click="softwareModalOpen">
            <div class="button-image">
              <img class="icon" src="~@/assets/images/icons/button-software.svg">
            </div>
            <h3>Software</h3>
            <p>JSON file, Private key, Mnemonic phrase</p>
            <p class="small-note">Not recommended</p>
            <div class="tooltip-box">
              <span>
                <b-btn v-b-tooltip.hover title="Unfortunately, we encounter these phishing scams/attacks on a daily basis.">What's that?</b-btn>
              </span>
            </div>
          </div>

        </div>
      </div><!-- .page-container -->
    </div><!-- .wrap -->

  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    mewConnectModalOpen () {
      this.$refs.mewConnect.show()
    },
    hardwareModalOpen () {
      this.$refs.hardware.show()
    },
    metamaskModalOpen () {
      this.$refs.metamask.show()
    },
    softwareModalOpen () {
      this.$refs.software.show()
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "AccessMyWalletOptions.scss";
</style>
