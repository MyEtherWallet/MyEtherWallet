<template>
  <div class="social">
    <div class="wrap">
      <div class="page-container">
        <div class="flex-col-vertical-center content">
          <div class="title">
            <h2>Your Security<br>Ethereum Wallet.</h2>
          </div>
          <div class="buttons">
            <div>
              <router-link to="/create-wallet">
                <span class="large-round-button-white-border">
                  Create My Wallet
                </span>
              </router-link>
            </div>
            <div>
              <router-link to="/">
                <span class="large-round-button-white-filled green-text-color">
                  Unlock My Wallet
                </span>
              </router-link>
            </div>
          </div>
        </div>
      </div><!-- .page-container -->
    </div><!-- .wrap -->
  </div><!-- .about-mew -->
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
  @import "Promo.scss";
</style>
