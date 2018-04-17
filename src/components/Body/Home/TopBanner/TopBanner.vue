<template>
  <div class="top-banner">
    <div class="wrap">

      <div class="flex-col-vertical-center banner">
        <div class="banner-text">
          <h1>Your Security</h1>
          <h1>Ethereum Wallet.</h1>
          <h2>Here is subtitle, Here is subtitle, Here is subtitle, Here is subtitle.</h2>
        </div>
        <div class="banner-image">
          <img src="~@/assets/images/home/top-banner.png">
        </div>
      </div>

      <div class="grid-col-2 promo-cards">
        <div class="card create-wallet">
          <div class="flex-col">
            <div class="card-image">
              <img src="~@/assets/images/home/create-wallet.png">
            </div>
            <div class="card-content">
              <h2>Create New Wallet</h2>
              <p>Free, open-source, client-side interface for generating Ethereum wallets & more.</p>
              <button>Create Now <i class="fa fa-long-arrow-right" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
        <div class="card unlock-wallet">
          <div class="flex-col">
            <div class="card-image">
              <img src="~@/assets/images/home/unlock-wallet.png">
            </div>
            <div class="card-content">
              <h2>Create New Wallet</h2>
              <p>Free, open-source, client-side interface for generating Ethereum wallets & more.</p>
              <button>Unlock Now <i class="fa fa-long-arrow-right" aria-hidden="true"></i></button>
            </div>
          </div>
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
  }
}
</script>

<style lang="scss" scoped>
  @import "TopBanner.scss";
</style>
