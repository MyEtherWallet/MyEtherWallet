<template>
  <div class="footer">
    <div class="wrap">
      <div class="page-container">
        <div class="grid-col-1-1-1-2 footer-contents">
          <div class="e1">
            <div class="content-title">
              <h3 class="lite">Discover</h3>
              <p v-on:click="openContent('e1')" class="open">
                <i class="fa fa-plus" aria-hidden="true"></i>
              </p>
              <p v-on:click="closeContent('e1')" class="close">
                <i class="fa fa-minus" aria-hidden="true"></i>
              </p>
            </div>
            <div class="content-links mobile-hide">
              <router-link to="/"><p>Units</p></router-link>
              <router-link to="/"><p>TX Status</p></router-link>
              <router-link to="/"><p>Debugs</p></router-link>
              <router-link to="/"><p>Extantions</p></router-link>
              <router-link to="/"><p>Others</p></router-link>
            </div>
          </div>
          <div class="e2">
            <div class="content-title">
              <h3 class="lite">Affiliates</h3>
              <p v-on:click="openContent('e2')" class="open">
                <i class="fa fa-plus" aria-hidden="true"></i>
              </p>
              <p v-on:click="closeContent('e2')" class="close">
                <i class="fa fa-minus" aria-hidden="true"></i>
              </p>
            </div>
            <div class="content-links mobile-hide">
              <router-link to="/"><p>Ledger Wallet</p></router-link>
              <router-link to="/"><p>Digital Bitbox</p></router-link>
              <router-link to="/"><p>Ether Card</p></router-link>
              <router-link to="/"><p>Trezor</p></router-link>
              <router-link to="/"><p>Bity</p></router-link>
            </div>
          </div>
          <div class="e3">
            <div class="content-title">
              <h3 class="lite">MEW</h3>
              <p v-on:click="openContent('e3')" class="open">
                <i class="fa fa-plus" aria-hidden="true"></i>
              </p>
              <p v-on:click="closeContent('e3')" class="close">
                <i class="fa fa-minus" aria-hidden="true"></i>
              </p>
            </div>
            <div class="content-links mobile-hide">
              <router-link to="/" v-on:click.native="setHomepageSublink('homepage-about')"><p>About</p></router-link>
              <router-link to="/team"><p>Team</p></router-link>
              <router-link to="/" v-on:click.native="setHomepageSublink('homepage-faqs')"><p>FAQs</p></router-link>
              <router-link to="/"><p>Customer Support</p></router-link>
            </div>
          </div>
          <div class="donate-us">
            <div class="content-title">
              <h3 class="lite">
                Welcome to Donate Us
                <img src="~@/assets/images/icons/heart.svg">
              </h3>
            </div>
            <div class="content-links">
              <p>Your donation will help us a lot to build our MEW Community.</p>

              <router-link to="/">
                <p class="crypto-link" data-btc="1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9">
                  <img src="~@/assets/images/icons/btc.svg">
                  &nbsp;Bitcoin Donation
                </p>
              </router-link>

              <router-link to="/">
                <p class="crypto-link" data-eth="0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D">
                  <img src="~@/assets/images/icons/eth.svg">
                  &nbsp;Ethereum Donation
                </p>
              </router-link>

            </div>
          </div>
        </div><!-- .footer-contents -->
        <div class="flex-space-between foot-note">
          <div class="links">
            <router-link to="/"><span>Feedback</span></router-link>
            <router-link to="/privacy-policy"><span>Privacy</span></router-link>
            <router-link to="/terms-of-conditions"><span>Terms</span></router-link>
          </div>
          <div class="copyright">
            <p>
              Copyright 2018 All right reserved by MyEtherWallet, Inc.
            </p>
          </div>
          <div class="social">
            <a href="https://facebook.com" target="_blank">
              <i class="fa fa-facebook" aria-hidden="true"></i>
            </a>
            <a href="https://facebook.com" target="_blank">
              <i class="fa fa-twitter" aria-hidden="true"></i>
            </a>
            <a href="https://facebook.com" target="_blank">
              <i class="fa fa-instagram" aria-hidden="true"></i>
            </a>
            <a href="https://facebook.com" target="_blank">
              <i class="fa fa-linkedin" aria-hidden="true"></i>
            </a>
            <a href="https://facebook.com" target="_blank">
              <i class="fa fa-github" aria-hidden="true"></i>
            </a>
            <a href="https://facebook.com" target="_blank">
              <i class="fa fa-reddit-alien" aria-hidden="true"></i>
            </a>
            <a href="https://facebook.com" target="_blank">
              <i class="fa fa-medium" aria-hidden="true"></i>
            </a>
          </div>
        </div><!-- .foot-note -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    setHomepageSublink: function (sublink) {
      this.$store.state.state.homepage.sublink = sublink
      var targetEl = document.querySelector('.' + this.$store.state.state.homepage.sublink)
      if (targetEl) {
        targetEl.scrollIntoView()
      }
    },
    openContent (element) {
      var openButton = document.querySelector('.' + element + ' .open')
      var closeButton = document.querySelector('.' + element + ' .close')
      var content = document.querySelector('.' + element + ' .content-links')
      openButton.style.display = 'none'
      closeButton.style.display = 'block'
      content.classList.remove('mobile-hide')
    },
    closeContent (element) {
      var openButton = document.querySelector('.' + element + ' .open')
      var closeButton = document.querySelector('.' + element + ' .close')
      var content = document.querySelector('.' + element + ' .content-links')
      openButton.style.display = 'block'
      closeButton.style.display = 'none'
      content.classList.add('mobile-hide')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "Footer.scss";
</style>
