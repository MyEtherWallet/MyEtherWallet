<template>
  <div class="top-banner">
    <div class="wrap">
      <div class="page-container">
        <div class="flex-col-vertical-center banner">
          <div class="banner-text">
            <h1>Your Security</h1>
            <h1>Ethereum Wallet.</h1>
            <h2>
              Here is subtitle, Here is subtitle,
              Here is subtitle, Here is subtitle.
            </h2>
          </div>
          <div class="banner-image">
            <img src="~@/assets/images/home/top-banner.jpg">
          </div>
        </div><!-- .banner-image -->
        <div class="grid-col-2 promo-cards">
          <router-link to="/">
            <div class="card create-wallet">
              <div class="flex-col-vertical-center">
                <div class="card-image">
                  <img src="~@/assets/images/home/create-wallet.png">
                </div>
                <div class="card-content">
                  <h2 class="color-white">Get a Free Wallet</h2>
                  <p class="color-white">
                    To obtain Ethereum address and generate your private key.
                    Saving and safekeeping the key will be your responsibility.
                  </p>
                    <p class="button">
                      Get Started
                      <img src="~@/assets/images/icons/right-arrow.png">
                    </p>
                </div>
              </div>
            </div>
          </router-link>
          <router-link to="/">
            <div class="card unlock-wallet">
              <div class="flex-col-vertical-center">
                <div class="card-image">
                  <img src="~@/assets/images/home/unlock-wallet.png">
                </div>
                <div class="card-content">
                  <h2 class="color-white">Access My Wallet</h2>
                  <p class="color-white">
                    To send Ethereum and tokens, swap coins, sale the domain,
                    deploy the contract after you access your wallet.
                  </p>
                  <p class="button">
                    Access Now
                    <img src="~@/assets/images/icons/right-arrow.png">
                  </p>
                </div>
              </div>
            </div>
          </router-link>
        </div><!-- .promo-cards -->
      </div><!-- .page-container -->
    </div><!-- .wrap -->
  </div><!-- .top-banner -->
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
  @import "TopBanner.scss";
</style>
