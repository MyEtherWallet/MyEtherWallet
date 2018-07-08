<template>
  <div class="access-my-wallet-options">

    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <div class="modal-container">
      <!-- Modal (MEW Connect) ============================================================================================================================================ -->
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
              <div class="support-icon"><img src="~@/assets/images/icons/help-center.png"></div>
              <div class="support-label"><h5>Customer Support</h5></div>
            </div>
          </router-link>
        </div>
      </b-modal>

      <!-- Modal (Network and Address) ============================================================================================================================================ -->
      <b-modal ref="networkAndAddress" hide-footer class="bootstrap-modal modal-network-and-address" title="Network and Address" centered>
        <div class="content-container-1">
          <div class="hd-derivation">
            <h4>HD Derivation Path</h4>
            <div class="dropdown-button-container">
              <b-dropdown id="hd-derivation-path" text="m/44’/60’/0’/0" class="dropdown-button-1">
                <b-dropdown-item class="active">m/44’/60’/0’/0</b-dropdown-item>
                <b-dropdown-item>m/44’/60’/0’/0</b-dropdown-item>
                <b-dropdown-item>m/44’/60’/0’/0</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item>Add Custom Path</b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
          <p class="derivation-brands">Jaxx, Metamask, Exodus, imToken, Trezor(ETH) & Digital Bitbox</p>
        </div>
        <div class="content-container-2">
          <div class="address-block-container">
            <div class="block-title">
              <h4>Address to Interact With</h4>
            </div>

            <ul class="address-block table-header">
              <li>ID</li>
              <li>Address</li>
              <li>Balance</li>
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
            <span>&lt; Previous</span>
            <span>Next &gt;</span>
          </div>
        </div> <!-- .content-container-2 -->

        <div class="accept-terms">
          <label class="checkbox-container">To unlock my wallet, I accept <a href="/">Terms</a>.
            <input type="checkbox">
            <span class="checkmark"></span>
          </label>
        </div>
        <div class="button-container">
          <router-link to="/send-eth-and-tokens" class="close-button">
            <b-btn class="mid-round-button-green-filled">
              Access My Wallet
            </b-btn>
          </router-link>
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

      <!-- Modal (Hardware) ============================================================================================================================================ -->
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

      <!-- Modal (MetaMask) ============================================================================================================================================ -->
      <b-modal ref="metamask" hide-footer class="bootstrap-modal modal-metamask" title="Access by MetaMask" centered>
        <div class="modal-multi-icons">
          <img class="icon" src="~@/assets/images/icons/button-metamask-fox.svg">
          <img class="icon" src="~@/assets/images/icons/clip.svg">
          <img class="icon logo-small" src="~@/assets/images/logo-small.png">
        </div>
        <div class="d-block content-container text-center">
          <h4>
            Please use MyEtherWallet on a secure (SSL / HTTPS)
            connection to connect.
          </h4>
        </div>
        <div class="accept-terms">
          <label class="checkbox-container">To unlock my wallet, I accept <a href="/">Terms</a>.
            <input type="checkbox">
            <span class="checkmark"></span>
          </label>
        </div>
        <div class="button-container">
          <b-btn class="mid-round-button-green-filled close-button">
            Unlock
          </b-btn>
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

      <!-- Modal (Software) ============================================================================================================================================ -->
      <b-modal ref="software" hide-footer class="bootstrap-modal modal-software" title="Access by Software" centered>
        <div class="d-block content-container text-center">
          <ul class="button-options">
            <li>
              <img class="icon" src="~@/assets/images/icons/button-json.svg">
              <img class="icon-hover" src="~@/assets/images/icons/button-json-hover.svg">
              <input type="file" style="position: fixed; top: -100em" id="json-file">
              <span v-on:click="openJsonFile()">JSON File</span>
            </li>
            <li>
              <img class="icon" src="~@/assets/images/icons/button-mnemonic.svg">
              <img class="icon-hover" src="~@/assets/images/icons/button-mnemonic-hover.svg">
              <span>Mnemonic<br>Phrase</span>
            </li>
            <li>
              <img class="icon" src="~@/assets/images/icons/button-key.svg">
              <img class="icon-hover" src="~@/assets/images/icons/button-key-hover.svg">
              <span>Private Key</span>
            </li>
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
              <div class="support-icon"><img src="~@/assets/images/icons/help-center.png"></div>
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




          <div class="button-block" v-on:click="hardwareModalOpen">
            <div class="button-image">
              <img class="icon" src="~@/assets/images/icons/eth.svg">

            </div>
            <h3>ETH</h3>
            <p>Login To Your ETH Wallet</p>

          </div>

          <div class="button-block" v-on:click="metamaskModalOpen">
            <div class="button-image">

              <img class="icon" src="~@/assets/images/icons/neo.png" width="25" height="25">

            </div>
            <h3>NEO</h3>
            <p>Login To Your NEO Wallet</p>

          </div>

          <div class="button-block" v-on:click="softwareModalOpen">
            <div class="button-image">

              <img class="icon" src="~@/assets/images/home/'J'-heart-logo.png" width="25" height="25">

            </div>
            <h3>LUV</h3>
            <p>Login To Your LUV Wallet</p>
          
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
    hardwareButtonActivate (e) {
      var everyButtonEl = document.querySelectorAll('.hardware-button-options li')
      everyButtonEl.forEach(function (el) {
        el.classList.remove('active')
      })
      e.target.classList.add('active')
    },
    mewConnectModalOpen () {
      this.$refs.mewConnect.show()
    },
    networkAndAddressOpen () {
      this.$refs.networkAndAddress.show()
    },
    hardwareModalOpen () {

      this.$router.push('/eth')

    },
    metamaskModalOpen () {
      this.$router.push('/neo')
    },
    softwareModalOpen () {
      this.$router.push('/luv')
    },
    openJsonFile: function(e){
      console.log('JSON clicked')
      e.preventDefault();
      $("#json-file").trigger('click');
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "AccessMyWalletOptions.scss";
</style>
