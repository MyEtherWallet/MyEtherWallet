<template>
  <div class="your-password">
    <vue-header></vue-header>
    <by-json-page-title></by-json-page-title>
    <div class="wrap">
      <div class="page-container">
        <div class="user-input-box">
          <b-tabs>
            <div class="progress-bar"></div>
            <b-tab title="By JSON File" active>
              <h3>Your Password</h3>
              <div class="user-input">
                <input type="password" name="password" placeholder="Please Enter At Least 9 Charactors">
                <router-link to='/by-json-file'>
                  <div class="next-button large-round-button-green-filled">
                    Next<img src="~@/assets/images/icons/right-arrow.png">
                  </div>
                </router-link>
              </div>
              <div class="footer-text">
                <p>
                  <span>DO NOT FORGET</span>
                  to save your password,
                  and it is your private
                  key. You will need this
                  <span>Password + Keystore</span>
                  File to unlock
                  your wallet.
                </p>
              </div>
            </b-tab>
            <b-tab title="By Mnemonic Phrase" >
              <h3>Your Password</h3>
              <div class="user-input">
                <input type="password" name="password" placeholder="Please Enter At Least 9 Charactors">
                <router-link to='/by-json-file'>
                  <div class="next-button large-round-button-green-filled">
                    Next<img src="~@/assets/images/icons/right-arrow.png">
                  </div>
                </router-link>
              </div>
              <div class="footer-text">
                <p>
                  <span>DO NOT FORGET</span>
                  to save your password,
                  and it is your private
                  key. You will need this
                  <span>Password + Keystore</span>
                  File to unlock
                  your wallet.
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
  @import "YourPassword.scss";
</style>
