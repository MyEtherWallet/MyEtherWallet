<template>
  <div class="access-my-wallet-options">

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
          <div class="button-block">
            <div class="button-image">
              <i class="fa fa-telegram" aria-hidden="true"></i>
            </div>
            <h3>MEW Connect</h3>
            <p>Use MEW Connect to access my wallet</p>
            <div class="tooltip-box">
              <span>What's that?</span>
            </div>
          </div>
          <div class="button-block">
            <div class="button-image">
              <i class="fa fa-telegram" aria-hidden="true"></i>
            </div>
            <h3>Hardware</h3>
            <p>Ledger wallet; Trezor; Digital bitbox; Secalot</p>
            <div class="tooltip-box">
              <span>What's that?</span>
            </div>
          </div>
          <div class="button-block">
            <div class="button-image">
              <i class="fa fa-telegram" aria-hidden="true"></i>
            </div>
            <h3>MetaMask</h3>
            <p>Use extention to access my wallet</p>
            <div class="tooltip-box">
              <span>What's that?</span>
            </div>
          </div>
          <div class="button-block">
            <div class="button-image">
              <i class="fa fa-telegram" aria-hidden="true"></i>
            </div>
            <h3>Software</h3>
            <p>JSON file, Private key, Mnemonic phrase</p>
            <p class="small-note">Not recommended</p>
            <div class="tooltip-box">
              <span>What's that?</span>
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
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "AccessMyWalletOptions.scss";
</style>
