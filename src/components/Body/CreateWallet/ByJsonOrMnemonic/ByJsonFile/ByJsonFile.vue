<template>
  <div class="create-wallet-by-json-file">
    <vue-header></vue-header>
    <by-json-page-title></by-json-page-title>
    <div class="wrap">
      <div class="page-container">
        <div class="nav-tab-user-input-box">
          <b-tabs>
            <div class="progress-bar"></div>
            <b-tab title="By JSON File" active>
              <h3>
                Save My Keystore File
                <span class="tooltip-icon">
                  <b-btn v-b-tooltip.hover title="Unfortunately, we encounter these phishing scams/attacks on a daily basis. Typically, the reason for these incidents is entering your private key on a malicious website. Sometimes it is a fake MyEtherWallet site (e.g. myethreawllet[.]com) and other times it is a fake ICO site or airdrop site or EthZero site. If you enter your private key (or keystore file, mnemonic phrase, passwords) on a malicious website, they have complete access to your funds. Because of the nature of the blockchain and cryptography, there is no way to reverse transactions or reset your passwords. Once a transaction is on the blockchain, it's final. For this reason, you need to move your funds as soon as possible and discontinue use of this wallet. We do actively attempt to track down the people behind these sites and do what we can to warn others, take down the site, or whatever we can given the particular situation.">?</b-btn>
                </span>
              </h3>
              <div class="contents">
                <div class="content-block">
                  <img class="icon" src="~@/assets/images/icons/no-lose.svg">
                  <h6>Don't Lose It</h6>
                  <p>Be Carefuel, it can not be recovered if you lose it.</p>
                </div>
                <div class="content-block">
                  <img class="icon" src="~@/assets/images/icons/no-share.svg">
                  <h6>Don't Share It</h6>
                  <p>
                    Your funds will be stolen if you use this file
                    on a malicious phishing site.
                  </p>
                </div>
                <div class="content-block">
                  <img class="icon" src="~@/assets/images/icons/make-a-backup.svg">
                  <h6>Make a Backup</h6>
                  <p>
                    Secure it like the millions of dollars
                    it may one day be worth.
                  </p>
                </div>
              </div>
              <div class="user-input">
                <router-link to='/by-json-file'>
                  <div v-on:click="downloadKeystore" class="next-button large-round-button-green-filled">
                    Download Keystore File
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
                    <b-btn v-b-tooltip.hover title="Unfortunately, we encounter these phishing scams/attacks on a daily basis. Typically, the reason for these incidents is entering your private key on a malicious website. Sometimes it is a fake MyEtherWallet site (e.g. myethreawllet[.]com) and other times it is a fake ICO site or airdrop site or EthZero site. If you enter your private key (or keystore file, mnemonic phrase, passwords) on a malicious website, they have complete access to your funds. Because of the nature of the blockchain and cryptography, there is no way to reverse transactions or reset your passwords. Once a transaction is on the blockchain, it's final. For this reason, you need to move your funds as soon as possible and discontinue use of this wallet. We do actively attempt to track down the people behind these sites and do what we can to warn others, take down the site, or whatever we can given the particular situation.">?</b-btn>
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
  methods: {
    downloadKeystore: function () {
      var FileSaver = require('file-saver')
      var blob = new Blob(['Hello, world of Tokens!!!!!!!!'], {type: 'text/plain;charset=utf-8'})
      FileSaver.saveAs(blob, 'your-token-keystore.txt')
    }
  },
  mounted () {
    // Scroll to top of the page
    window.scrollTo(0, 0)
  }
}
</script>

<style lang="scss" scoped>
  @import "ByJsonFile.scss";
</style>
