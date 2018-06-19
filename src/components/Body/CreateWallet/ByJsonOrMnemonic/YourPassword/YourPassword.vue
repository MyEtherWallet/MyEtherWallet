<template>
  <div class="your-password">

    <!-- Modal =================================== -->
    <b-modal ref="myModalRef" hide-footer centered hide-header class="bootstrap-modal">
      <div class="d-block text-center">
        <h2 class="title">Welcome to MEW</h2>
        <p class="content">
          Please take a moment to read through this short introduction. It's
          extreamely important to pay attention to what we have to say,
          for your own security. Ignoring this step will highly increase your
          chances of getting phished.<br>
          <router-link to="/">Skip</router-link> at your own risk.
        </p>
      </div>
      <div class="button-container fixed-width-1">
        <b-btn class="mid-round-button-green-filled close-button">
          Continue
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
                <input type="password" name="password" placeholder="Please Enter At Least 9 Charactors" v-on:keyup="passwordStrengthCheck">
                <div class="message-container">
                  Password Strength: <span id="password-strength-level">Weak</span>
                </div>
                <router-link to='/by-json-file'>
                  <div class="next-button large-round-button-green-filled">
                    Continue<img src="~@/assets/images/icons/right-arrow.png">
                  </div>
                </router-link>
              </div>
              <div class="footer-text">
                <p>
                  We <span>CAN NOT</span> change your password. Please
                  <span>DO NOT FORGET</span> to save your password, and
                  it is your private key. You will need this <span>Password + Keystore File</span>
                  to access your wallet.
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
    passwordStrengthCheck: function (event) {
      console.log('Checking password strength...')
      var mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})')
      var strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')

      if (strongRegex.test(event.srcElement.value) === true) {
        document.getElementById('password-strength-level').innerHTML = 'Strong'
      } else if (mediumRegex.test(event.srcElement.value) === true) {
        document.getElementById('password-strength-level').innerHTML = 'Medium'
      } else {
        document.getElementById('password-strength-level').innerHTML = 'Weak'
      }
    }
  },
  mounted () {
    // Welcome Modal open
    this.$refs.myModalRef.show()
    // Scroll to top
    window.scrollTo(0, 0)
  }
}
</script>

<style lang="scss" scoped>
  @import "YourPassword.scss";
</style>
