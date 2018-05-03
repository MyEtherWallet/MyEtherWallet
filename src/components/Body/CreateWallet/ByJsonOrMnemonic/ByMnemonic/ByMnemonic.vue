<template>
  <div class="create-wallet-by-mnemonic">
    <vue-header></vue-header>
    <by-json-page-title></by-json-page-title>
    <div class="wrap">
      <div class="page-container">
        <div class="user-input-box">
          <b-tabs>
            <div class="progress-bar"></div>
            <b-tab title="By Mnemonic Phrase" active>
              <h3>
                Write Down Mnemonic Phrase Key
                <span class="tooltip-icon">
                  <b-btn v-b-tooltip.hover title="Unfortunately, we encounter these phishing scams/attacks on a daily basis. Typically, the reason for these incidents is entering your private key on a malicious website. Sometimes it is a fake MyEtherWallet site (e.g. myethreawllet[.]com) and other times it is a fake ICO site or airdrop site or EthZero site. If you enter your private key (or keystore file, mnemonic phrase, passwords) on a malicious website, they have complete access to your funds. Because of the nature of the blockchain and cryptography, there is no way to reverse transactions or reset your passwords. Once a transaction is on the blockchain, it's final. For this reason, you need to move your funds as soon as possible and discontinue use of this wallet. We do actively attempt to track down the people behind these sites and do what we can to warn others, take down the site, or whatever we can given the particular situation.">?</b-btn>
                </span>
              </h3>
              <div class="contents">

                <div class="tools">
                  <div class="value-switch">
                    <!-- Rounded switch -->
                    <label class="switch">
                      <input type="checkbox">
                      <span class="slider round"></span>
                    </label>
                    <span class="switch-label">Value</span>
                  </div>
                  <div class="random-button">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                    Random
                  </div>
                </div>
                <div class="phrases">
                  <ul>
                    <li>1.<span>duty</span></li>
                    <li>2.<span>begine</span></li>
                    <li>3.<span>used</span></li>
                    <li>4.<span>near</span></li>
                    <li>5.<span>duty</span></li>
                    <li>6.<span>begine</span></li>
                    <li>7.<span>used</span></li>
                    <li>8.<span>near</span></li>
                    <li>9.<span>duty</span></li>
                    <li>10.<span>begine</span></li>
                    <li>11.<span>used</span></li>
                    <li>12.<span>near</span></li>
                  </ul>
                </div>

              </div>
              <div class="user-input">
                <router-link to='/by-json-file'>
                  <div class="next-button large-round-button-green-filled">
                    I Already Wrote Down the Key
                  </div>
                </router-link>
              </div>
              <div class="footer-text">
                <p>
                  <router-link to="/">
                    <img class="icon" src="~@/assets/images/icons/printer.svg">
                    Print My Wallet
                  </router-link>
                  <span class="tooltip-icon">
                    <b-btn v-b-tooltip.hover title="Typically, the reason for these incidents is entering your private key on a malicious website.">?</b-btn>
                  </span>
                </p>
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>

    <by-json-page-footer></by-json-page-footer>
    <vue-footer></vue-footer>

  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
    // Scroll to top of the page
    window.scrollTo(0, 0)
  }
}
</script>

<style lang="scss" scoped>
  @import "ByMnemonic.scss";
</style>
