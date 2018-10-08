<template>
  <div class="what-is-mew">

    <div class="block-progressbar">
      <dir class="block-progressbar__container">
        <div class="block-progressbar__title">
          About Security
        </div>
        <div class="block-progressbar__progressbar">
          <div :class="progressBarValue"/>
        </div>
        <div class="block-progressbar__content">
          <h4>Some helpful tips</h4>

          <div class="tips">
            <div>
              <h5>Never give your Private Key to anyone</h5>
              <p>That includes your keystore file and mnemonic phrase.</p>
            </div>
            <div>
              <h5>Don't trust any free ETH</h5>
              <p>
                If they're giving away free ETH, it's not real. If they email you saying they're us,
                it's not real. If they ask for your private key, it's not real.
              </p>
            </div>
            <div>
              <h5>Bookmark our website</h5>
              <p>
                Always check the URL for our 'MyEtherWallet Inc [US]' certification. And install
                our <a
                  href="https://chrome.google.com/webstore/detail/myetherwallet/nlbmnnijcnlegkjjpcfjclmcfggfefdm?hl=en"
                  target="_blank">Chrome extension</a>
                for an extra layer of security!
              </p>
            </div>
            <div>
              <h5>Buy a hardware wallet</h5>
              <p>
                We have many great hardware wallets listed on our interface.
                They're only about $100. It's worth for your security.
                Buy one <a
                  href=""
                  target="_blank">here</a>.
              </p>
            </div>
            <div>
              <h5>Feel free to contact us</h5>
              <p>
                Please feel free to contact us. Our email is
                <a href="mailto:support@myetherwallet.com">support@myetherwallet.com</a>.
                We're here to help.
              </p>
            </div>
          </div>

        </div>
      </dir>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    progressBarValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '../BlockWithProgressBar-desktop.scss';
@import '../BlockWithProgressBar-tablet.scss';
@import '../BlockWithProgressBar-mobile.scss';
</style>
