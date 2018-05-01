<template>
  <div class="your-password">
    <div class="wrap">
      <div class="page-container">
        <div class="user-input-box">
          <b-tabs>
            <b-tab title="By JSON File" active>
              <h3>Your Password</h3>
              <div class="user-input">
                <input type="password" name="password" placeholder="Please Enter At Least 9 Charactors">
                <button class="large-round-button-green-filled">Next</button>
              </div>
            </b-tab>
            <b-tab title="By Mnemonic Phrase" >
              By Mnemonic Phrase
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
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
    console.log('Scroll to top')
    window.scrollTo(0, 0)
  }
}
</script>

<style lang="scss" scoped>
  @import "YourPassword.scss";
</style>
