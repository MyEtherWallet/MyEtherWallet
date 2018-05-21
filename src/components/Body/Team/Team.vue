<template>
  <div class="team">
    <vue-header></vue-header>

    <div class="wrap">
      <div class="page-container">
        <div class="title">
          <h2>Unlock Wallet</h2>
          <h5>
            Do not have a wallet?
            <router-link to="/">Create Wallet</router-link>
          </h5>
        </div>
        <div class="blocks">
          <ul>
            <li>
              <h6>Hardware</h6>
              <p>Ledger wallet; Trezor; Digital bitbox; Secalot</p>
            </li>
            <li>
              <h6>JSON File</h6>
              <p>Update ordrop your keystore file here</p>
            </li>
            <li>
              <h6>Mnemonic Phase</h6>
              <p>Enter your 12-bit or 14-bit mnemonic phrases</p>
            </li>
            <li>
              <h6>MetaMask</h6>
              <p>Use extention to unlock your wallet</p>
            </li>
            <li>
              <h6>Private Key</h6>
              <p>Enter your private key to unlock wallet</p>
            </li>
          </ul>
        </div>
      </div><!-- .page-container -->
    </div><!-- .wrap -->

    <vue-footer></vue-footer>
  </div><!-- .team -->
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
  @import "Team.scss";
</style>
