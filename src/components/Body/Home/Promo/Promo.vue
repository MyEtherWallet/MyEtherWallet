<template>
  <div class="social">
    <div class="wrap">
      <div class="page-container">
        <div class="flex-col-vertical-center content">
          <div class="title">
            <h2>Your Security<br>Ethereum Wallet</h2>
          </div>
          <div class="buttons">
            <div class="button-block">
              <router-link to="/create-wallet" class="nounderline">
                <span class="large-round-button-white-border get-free-wallet">
                  Get a Free Wallet
                </span>
              </router-link>
            </div>
            <div class="button-block">
              <router-link to="/create-wallet" class="nounderline">
                <span class="large-round-button-white-filled green-text-color access-my-wallet">
                  Access My Wallet
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
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  @import "Promo.scss";
</style>
