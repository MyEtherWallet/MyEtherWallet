<template>
  <div class="create-wallet-by-json-file">
    <vue-header></vue-header>
    <by-json-page-title></by-json-page-title>
    <div class="wrap">
      <div class="page-container">
        <div class="user-input-box">
          <b-tabs>
            <div class="progress-bar"></div>
            <b-tab title="By JSON File" active>
              <h3>Save My Keystore File</h3>
              <div class="contents">
                <div class="content-block">
                  <img class="icon" src="~@/assets/images/icons/no-lose.svg">
                  <h6>Don't Lose It</h6>
                  <p>Be Carefuel, it can not be recovered if you lose it.</p>
                </div>
                <div class="content-block">
                  <img class="icon" src="~@/assets/images/icons/no-share.svg">
                  <h6>Don't Share It</h6>
                  <p>
                    Your funds will be stolen if you use this file
                    on a malicious phishing site.
                  </p>
                </div>
                <div class="content-block">
                  <img class="icon" src="~@/assets/images/icons/make-a-backup.svg">
                  <h6>Make a Backup</h6>
                  <p>
                    Secure it like the millions of dollars
                    it may one day be worth.
                  </p>
                </div>
              </div>
              <div class="user-input">
                <router-link to='/by-json-file'>
                  <div class="next-button large-round-button-green-filled">
                    Download Keystore File
                  </div>
                </router-link>
              </div>
              <div class="footer-text">
                <p>
                  Print My Wallet
                </p>
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>

    <by-json-page-footer></by-json-page-footer>
    <vue-footer></vue-footer>

  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
    // Scroll to top of the page
    window.scrollTo(0, 0)
  }
}
</script>

<style lang="scss" scoped>
  @import "ByJsonFile.scss";
</style>
