<template>
  <div class="access-my-wallet-options">

    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <div class="modal-container">
      <!-- Modal (MEW Connect) ============================================================================================================================================ -->
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

      <!-- Modal (Network and Address) ============================================================================================================================================ -->
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
              <div class="support-icon"><img src="~@/assets/images/home/bell.png"></div>
              <div class="support-label"><h5>{{ $t("reused.customerSupport") }}</h5></div>
            </div>
          </router-link>
        </div>
      </b-modal>

      <!-- Modal (Hardware) ============================================================================================================================================ -->
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

      <!-- Modal (MetaMask) ============================================================================================================================================ -->
      <b-modal ref="metamask" hide-footer class="bootstrap-modal modal-metamask" title="Access by MetaMask">
        <div class="modal-multi-icons">
          <img class="icon" src="~@/assets/images/icons/button-metamask-fox.svg">
          <img class="icon" src="~@/assets/images/icons/clip.svg">
          <img class="icon logo-small" src="~@/assets/images/logo-small.png">
        </div>
        <div class="d-block content-container text-center">
          <h4>
            {{ $t("accessMyWalletOptions.metaMaskModalDesc")}}
          </h4>
        </div>
        <div class="accept-terms">
          <label class="checkbox-container">{{ $t("accessMyWalletOptions.acceptTerms") }} <a href="/">{{ $t("reused.terms") }}</a>.
            <input type="checkbox">
            <span class="checkmark"></span>
          </label>
        </div>
        <div class="button-container">
          <b-btn class="mid-round-button-green-filled close-button">
            {{ $t("accessMyWalletOptions.unlock")}}
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

      <!-- Modal (Software) ============================================================================================================================================ -->
      <b-modal ref="software" hide-footer class="bootstrap-modal modal-software" title="Access by Software">
        <div class="d-block content-container text-center">
          <ul class="button-options">
            <li>
              <img class="icon" src="~@/assets/images/icons/button-json.svg">
              <img class="icon-hover" src="~@/assets/images/icons/button-json-hover.svg">
              <span>{{ $t("reused.jsonF") }}</span>
            </li>
            <li>
              <img class="icon" src="~@/assets/images/icons/button-mnemonic.svg">
              <img class="icon-hover" src="~@/assets/images/icons/button-mnemonic-hover.svg">
              <span>{{$t("reused.mnemonicP")}}</span>
            </li>
            <li>
              <img class="icon" src="~@/assets/images/icons/button-key.svg">
              <img class="icon-hover" src="~@/assets/images/icons/button-key-hover.svg">
              <span>{{$t("reused.privKey")}}</span>
            </li>
          </ul>
        </div>
        <div class="button-container">
          <b-btn class="mid-round-button-green-filled close-button">
            {{ $t("reused.continue") }}
          </b-btn>
        </div>
        <div class="support">
          <router-link to="/">
            <div class="support-content">
              <div class="support-icon"><img src="~@/assets/images/home/bell.png"></div>
              <div class="support-label"><h5>{{$t("reused.customerSupport")}}</h5></div>
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
          <h2>{{$t("reused.accessMyWallet")}}</h2>
          <h5>
            {{$t("reused.noWallet")}}
            <router-link to="/">{{$t("reused.getAFreeWallet")}}</router-link>
          </h5>
        </div>
        <div class="buttons-container">

          <div class="button-block" v-on:click="mewConnectModalOpen">
            <div class="button-image">
              <img class="icon" src="~@/assets/images/icons/button-mewconnect.svg">
            </div>
            <h3>{{$t('reused.mewConnect')}}</h3>
            <p>{{$t('accessMyWalletOptions.mewConnectDesc')}}</p>
            <div class="tooltip-box">
              <span>
                <b-btn v-b-tooltip.hover title="Unfortunately, we encounter these phishing scams/attacks on a daily basis.">
                  <i class="fa fa-question-circle-o" aria-hidden="true"></i>
                </b-btn>
              </span>
            </div>
          </div>

          <div class="button-block" v-on:click="hardwareModalOpen">
            <div class="button-image">
              <img class="icon" src="~@/assets/images/icons/button-hardware.svg">
            </div>
            <h3>{{$t('reused.hardware')}}</h3>
            <p>Ledger wallet; Trezor; Digital bitbox; Secalot</p>
            <div class="tooltip-box">
              <span>
                <b-btn v-b-tooltip.hover title="Unfortunately, we encounter these phishing scams/attacks on a daily basis.">
                  <i class="fa fa-question-circle-o" aria-hidden="true"></i>
                </b-btn>
              </span>
            </div>
          </div>

          <div class="button-block" v-on:click="metamaskModalOpen">
            <div class="button-image">
              <img class="icon" src="~@/assets/images/icons/button-metamask.svg">
            </div>
            <h3>MetaMask</h3>
            <p>{{$t('accessMyWalletOptions.metaMaskDesc')}}</p>
            <div class="tooltip-box">
              <span>
                <b-btn v-b-tooltip.hover title="Unfortunately, we encounter these phishing scams/attacks on a daily basis.">
                  <i class="fa fa-question-circle-o" aria-hidden="true"></i>
                </b-btn>
              </span>
            </div>
          </div>

          <div class="button-block" v-on:click="softwareModalOpen">
            <div class="button-image">
              <img class="icon" src="~@/assets/images/icons/button-software.svg">
            </div>
            <h3>{{$t('accessMyWalletOptions.software')}}</h3>
            <p>{{$t('accessMyWalletOptions.softwareDesc')}}</p>
            <p class="small-note">{{$t('accessMyWalletOptions.notRecommended')}}</p>
            <div class="tooltip-box">
              <span>
                <b-btn v-b-tooltip.hover title="Unfortunately, we encounter these phishing scams/attacks on a daily basis.">
                  <i class="fa fa-question-circle-o" aria-hidden="true"></i>
                </b-btn>
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
    networkAndAddressOpen () {
      this.$refs.networkAndAddress.show()
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
  }
}
</script>

<style lang="scss" scoped>
  @import "AccessMyWalletOptions.scss";
</style>
