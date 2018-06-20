<template>
  <div class="create-wallet-by-mnemonic">

    <!-- Modal =================================== -->
    <b-modal ref="done" hide-footer centered hide-header class="bootstrap-modal done">
      <div class="d-block text-center">
        <i class="check-icon fa fa-check" aria-hidden="true"></i>
        <h2 class="title">Succeed</h2>
        <p class="content">Your have created your wallet successfully.</p>
      </div>
      <div class="button-container">
        <b-btn class="mid-round-button-green-filled close-button">
          Unlock My Wallet
        </b-btn>
      </div>
    </b-modal>

    <b-modal ref="verification" hide-footer centered class="bootstrap-modal-wide verification nopadding" title="Verification">
      <div class="content-block">
        <p class="block-title">Please enter and fill out the empty boxes below to verify your mnemonic phrase key.</p>
        <div class="phrases">
          <ul>
            <li class="word" v-for="(value, index) in mnemonicValues" v-bind:key="index" v-bind:data-index="index + 1">
              {{index + 1}}.<span>{{value}}</span>
              <input class="hidden" type="text" name="">
            </li>
          </ul>
        </div>
        <div class="button-container">
          <div v-on:click="mnemonicDoneModalOpen" class="verify-button large-round-button-green-filled">
            Verify
          </div>
        </div>
      </div>
    </b-modal>
    <!-- Modal =================================== -->

    <vue-header></vue-header>
    <by-json-page-title></by-json-page-title>
    <div class="wrap">
      <div class="page-container">
        <div class="nav-tab-user-input-box">
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
                  <div class="value-switch noselect">
                    <!-- Rounded switch -->
                    <div class="sliding-switch">
                      <label class="switch">
                        <input type="checkbox">
                        <span v-on:click="mnemonicValueBitSizeChange" class="slider round"></span>
                      </label>
                      <div class="labels">
                        <span class="label-left white">12</span>
                        <span class="label-right">24</span>
                      </div>
                    </div>
                    <span class="text__base link switch-label">Value</span>
                  </div><!-- .value-switch -->

                  <div v-on:click="mnemonicValueRefresh" class="random-button color-green noselect">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                    <span>Random</span>
                  </div><!-- .random-button -->
                </div>
                <div class="phrases">
                  <ul>
                    <li v-for="(value, index) in mnemonicValues" v-bind:key="index">
                      {{index + 1}}.<span>{{value}}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="user-input">
                <div v-on:click="mnemonicVerificationModalOpen" class="next-button large-round-button-green-filled clickable">
                  I Already Wrote Down the Key
                </div>
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
// Mnemonic code for generating deterministic keys
var bip39 = require('bip39')

export default {
  data () {
    return {
      varificationValues: [],
      mnemonicValues: [],
      mnemonic24: false
    }
  },
  methods: {
    mnemonicValueRefresh () {
      if (this.mnemonic24 === true) {
        this.mnemonicValues = bip39.generateMnemonic(256).split(' ')
      } else {
        this.mnemonicValues = bip39.generateMnemonic(128).split(' ')
      }
    },
    mnemonicValueBitSizeChange () {
      var left = document.querySelector('.label-left')
      var right = document.querySelector('.label-right')

      this.mnemonic24 = !this.mnemonic24

      if (this.mnemonic24 === true) {
        // Regenerate new 24 Mnemonic phrases
        this.mnemonicValues = bip39.generateMnemonic(256).split(' ')
        left.classList.remove('white')
        right.classList.add('white')
      } else {
        // Regenerate new 12 Mnemonic phrases
        this.mnemonicValues = bip39.generateMnemonic(128).split(' ')
        left.classList.add('white')
        right.classList.remove('white')
      }
    },
    mnemonicDoneModalOpen () {
      // console.log(this.varificationValues)

      var valid = false

      this.varificationValues.forEach(function (value) {
        var userInputText = document.querySelector('.phrases .word[data-index="' + value.no + '"]').querySelector('input').value
        // console.log(userInputText)

        if (userInputText === document.querySelector('.phrases .word[data-index="' + value.no + '"]').querySelector('span').textContent) {
          valid = true
        } else {
          valid = false
        }
      })

      if (valid === true) {
        this.$refs.done.show()
      }
    },
    mnemonicVerificationModalOpen () {
      // Generate random numbers to choose which blocks to hide
      function generateNumArr (limit) {
        var ret = []
        for (var i = 1; i < limit; i++) {
          ret.push(i)
        }

        return ret
      }

      function shuffle (array) {
        var i = array.length
        var j = 0
        var temp

        while (i--) {
          j = Math.floor(Math.random() * (i + 1))

          // swap randomly chosen element with current element
          temp = array[i]
          array[i] = array[j]
          array[j] = temp
        }

        return array
      }

      var ranNums = []
      this.varificationValues = []

      document.querySelectorAll('.phrases .word').forEach(function (el) {
        el.classList.remove('verification')
        el.querySelector('span').classList.remove('hidden')
        el.querySelector('input').classList.add('hidden')
      })

      if (this.mnemonic24 === true) {
        ranNums = shuffle(generateNumArr(25))
      } else {
        ranNums = shuffle(generateNumArr(13))
      }

      // Hide 5 random mnemonic blocks
      for (var c = 0; c < 5; c++) {
        document.querySelector('.phrases .word[data-index="' + ranNums[c] + '"]').classList.add('verification')

        document.querySelector('.phrases .word[data-index="' + ranNums[c] + '"]').querySelector('span').classList.add('hidden')
        this.varificationValues.push({
          word: document.querySelector('.phrases .word[data-index="' + ranNums[c] + '"]').querySelector('span').textContent,
          no: ranNums[c]
        })

        document.querySelector('.phrases .word[data-index="' + ranNums[c] + '"]').querySelector('input').classList.remove('hidden')
      }

      this.$refs.verification.show()
    }

  },
  mounted () {
    // Generate a random mnemonic
    this.mnemonicValues = bip39.generateMnemonic(128).split(' ')
  }
}
</script>

<style lang="scss" scoped>
  @import "ByMnemonic.scss";
</style>
