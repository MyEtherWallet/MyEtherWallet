<template>
  <div class="top-banner">
    <div class="wrap">
      <div class="page-container">
        <div class="flex-col-vertical-center banner">
          <div class="banner-text">
            <h1>DU's Only</h1>
            <h1>Multicurrency Wallet</h1>
            <p>
              the LUV Wallet helps you to generate NEO, LUV & Ethereum wallets, and interact with
              the NEP-5, Tokhn and Ethereum blockchain easily and securely.
              LUV is a free and open-source, client-side interface.
            </p>
          </div>
          <div class="banner-image">
            <img src="~@/assets/images/home/'J'-heart-logo.png">
          </div>
        </div><!-- .banner-image -->
        <div class="grid-col-2 promo-cards">
          <router-link to="/send-eth-and-tokens" class="nounderline">
            <div class="card-block create-wallet">
              <div class="flex-col-vertical-center">
                <div class="card-image">
                  <img src="~@/assets/images/home/create-wallet.png">
                </div>
                <div class="card-content">
                  <h2 class="color-white">Get a Free Wallet</h2>
                  <p class="color-white">
                    To obtain your NEO, LUV or ETH address and generate your private key.
                    Be responsible with key safety and safekeeping.
                  </p>
                    <p class="button">
                      Get Started
                      <img src="~@/assets/images/icons/right-arrow.png">
                    </p>
                </div>
              </div>
            </div>
          </router-link>
          <router-link to="/access-my-wallet" class="nounderline">
            <div class="card-block unlock-wallet">
              <div class="flex-col-vertical-center">
                <div class="card-image">
                  <img src="~@/assets/images/home/unlock-wallet.png">
                </div>
                <div class="card-content">
                  <h2 class="color-white">Access My Wallet</h2>
                  <p class="color-white">
                    To send Ethereum and tokens, swap coins, deploy the contract after you access your wallet.
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
