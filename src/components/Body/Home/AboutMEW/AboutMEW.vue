<template>
  <div class="about-mew">
    <div class="wrap">
      <div class="top-section">
        <div class="circle">
          <img src="~@/assets/images/home/circle.png">
        </div>
        <div class="star-background" id="pagelink-about-mew">
          <div class="page-container">
            <div class="flex-col-1-1-vertical-center content">
              <div class="text-content">
                <h2>About MEW</h2>
                <p class="color-white">
                  MyEtherWallet(MEW)  provides a easy to use interface.
                  We won’t hold your keys, also we can’t access accounts,
                  recover your keys, reset your passwords, nor reverse your
                  transactions. Please pay attention that you are
                  on Correct URL.
                  <br>
                  <span class="color-white text-bold">
                    Please Take Responsible For Your Account Security.
                  </span>
                </p>
                <div class="watch-video">
                  <router-link to="/" class="underline">
                    <p>
                      Watch Video
                      <i class="fa fa-caret-right" aria-hidden="true"></i>
                    </p>
                  </router-link>
                </div>
              </div>
              <div class="image-content">
                <img class="spaceman" src="~@/assets/images/home/spaceman.png">
                <img class="mew-icon" src="~@/assets/images/home/mew-icon.png">
              </div>
            </div>
          </div><!-- .page-container -->
        </div><!-- .star-background -->
      </div><!-- .top-section -->
      <div class="bottom-section">
        <div class="page-container">
          <div class="grid-col-2 mew-features">
            <dir class="content">
              <div class="image">
                <img src="~@/assets/images/home/icon-wallet.png">
              </div>
              <div class="text">
                <h3>MEW Wallet</h3>
                <p>
                  Text here for feature discription, Text here for
                  feature discription, Text here for feature discription,
                  Text here for feature discription, Text here for feature
                  discription.
                </p>
              </div>
            </dir>
            <dir class="content">
              <div class="image">
                <img src="~@/assets/images/home/icon-hardware.png">
              </div>
              <div class="text">
                <h3>Hardware Wallet Support</h3>
                <p>
                  Text here for feature discription, Text here for
                  feature discription, Text here for feature discription,
                  Text here for feature discription, Text here for feature
                  discription.
                </p>
              </div>
            </dir>
            <dir class="content">
              <div class="image">
                <img src="~@/assets/images/home/icon-swap.png">
              </div>
              <div class="text">
                <h3>Swap</h3>
                <p>
                  Text here for feature discription, Text here for
                  feature discription, Text here for feature discription,
                  Text here for feature discription, Text here for feature
                  discription.
                </p>
              </div>
            </dir>
            <dir class="content">
              <div class="image">
                <img src="~@/assets/images/home/icon-connect.png">
              </div>
              <div class="text">
                <h3>MEW Connect</h3>
                <p>
                  Text here for feature discription, Text here for
                  feature discription, Text here for feature discription,
                  Text here for feature discription, Text here for feature
                  discription.
                </p>
              </div>
            </dir><!-- .content -->
          </div><!-- .mew-features -->
        </div><!-- .page-container -->
      </div><!-- .bottom-section -->
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
  @import "AboutMEW.scss";
</style>
