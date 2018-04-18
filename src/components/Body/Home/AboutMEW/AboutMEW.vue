<template>
  <div class="about-mew">
    <div class="wrap">
      <div class="circle">
        <img src="~@/assets/images/home/circle.svg">
      </div>

      <div class="star-background">
        <div class="page-container">
          <div class="flex-col-1-1-vertical-center content">
            <div class="text-content">
              <h2>About MEW</h2>
              <p>
                Free, open-source, client-side interface for generating
                Ethereum wallets & more. Interact with the Ethereum blockchain
                easily & securely. Double-check the URL ( myetherwallet.com )
                before unlocking your wallet.
              </p>
              <div class="watch-video">
                <p>Watch Video <i class="fa fa-caret-right" aria-hidden="true"></i></p>
              </div>
            </div>
            <div class="image-content">
              <img class="spaceman" src="~@/assets/images/home/spaceman.png">
              <img class="mew-icon" src="~@/assets/images/home/mew-icon.png">
            </div>
          </div>
        </div><!-- .page-container -->
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
  @import "AboutMEW.scss";
</style>
