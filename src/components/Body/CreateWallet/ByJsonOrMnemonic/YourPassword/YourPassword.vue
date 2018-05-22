<template>
  <div class="your-password">

    <!-- Modal =================================== -->
    <b-modal ref="myModalRef" hide-footer hide-header class="bootstrap-modal">
      <div class="d-block text-center">
        <h2 class="title">Welcome to MEW</h2>
        <p class="content">
          MyEtherWallet.com doesn’t hold your keys for you.
          We can’t access accounts, recover keys, reset passwords,
          nor reverse transactions. Protect your keys & always check
          that you are on CORRECT URL.
          You are responsible for your security.
        </p>
      </div>
      <div class="button-container">
        <b-btn class="mid-round-button-green-filled close-button">
          I'm a Fresher
        </b-btn>
        <b-btn class="mid-round-button-green-border close-button">
          I'm a Experiencer
        </b-btn>
      </div>
    </b-modal>
    <!-- Modal =================================== -->

    <vue-header></vue-header>
    <by-json-page-title></by-json-page-title>
    <div class="wrap">
      <div class="page-container">
        <div class="nav-tab-user-input-box">
          <b-tabs class="x100">
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
                <router-link to='/by-mnemonic-phrase'>
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
  methods: {
  },
  mounted () {
    // Welcome Modal open
    this.$refs.myModalRef.show()
  }
}
</script>

<style lang="scss" scoped>
  @import "YourPassword.scss";
</style>
