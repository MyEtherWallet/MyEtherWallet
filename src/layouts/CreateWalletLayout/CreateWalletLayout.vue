<template>
  <div class="your-password">
    <create-wallet-modal></create-wallet-modal>
    <by-json-page-title></by-json-page-title>
    <div class="wrap">
      <div class="page-container">
        <div class="nav-tab-user-input-box">
          <b-tabs class="x100">
            <div class="progress-bar"></div>
            <b-tab title="By JSON File" active>
              <h3>{{ $t("createWallet.yourPw") }}</h3>
              <div class="user-input">
                <input type="password" name="password" placeholder="Please Enter At Least 9 Charactors">
                <router-link to='/by-json-file'>
                  <div class="next-button large-round-button-green-filled">
                    {{ $t("reused.next") }}<img src="~@/assets/images/icons/right-arrow.png">
                  </div>
                </router-link>
              </div>
              <div class="footer-text">
                <p>
                  <span>{{ $t("createWallet.doNotForget") }}</span>
                  {{ $t("createWallet.doNotForgetDesc") }}
                  <span>{{ $t("createWallet.keyPass") }}</span>
                  {{ $t("createWallet.keyPassDesc") }}
                </p>
              </div>
            </b-tab>
            <b-tab title="By Mnemonic Phrase" >
              <h3>{{ $t("createWallet.yourPw") }}</h3>
              <div class="user-input">
                <input type="password" name="password" placeholder="Please Enter At Least 9 Charactors">
                <router-link to='/by-mnemonic-phrase'>
                  <div class="next-button large-round-button-green-filled">
                    {{ $t("reused.next") }}<img src="~@/assets/images/icons/right-arrow.png">
                  </div>
                </router-link>
              </div>
              <div class="footer-text">
                <p>
                  <span>{{ $t("createWallet.doNotForget") }}</span>
                  {{ $t("createWallet.doNotForgetDesc") }}
                  <span>{{ $t("createWallet.keyPass") }}</span>
                  {{ $t("createWallet.keyPassDesc") }}
                </p>
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>

    <by-json-page-footer></by-json-page-footer>

  </div>
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
  @import "CreateWalletLayout.scss";
</style>
