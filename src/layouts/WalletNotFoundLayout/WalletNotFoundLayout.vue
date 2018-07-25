<template>
  <div class="wallet-not-found">
    <div class="wrap">
      <div class="page-container">

        <div class="content-block">
          <div class="block-title">Oops! Wallet not found :(</div>
          <div class="buttons">

            <router-link to="/create-wallet">
              <div class="mid__round-button__blue-filled__blue-border">Get a Free Wallet</div>
            </router-link>
            <router-link to="/access-my-wallet">
              <div class="mid-round-button-green-filled-green-border">Access My Wallet</div>
            </router-link>

          </div>
          <div class="spaceman">
            <img src="~@/assets/images/home/spaceman.png">
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import "WalletNotFoundLayout.scss";
</style>
