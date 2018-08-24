<template>
  <b-modal ref="accessbymnemonicphrase" hide-footer class="bootstrap-modal modal-metamask" title="Access by Mnemonic Phrase" centered>

    <div class="contents">
      <div class="tools">
        <div class="value-switch noselect">
          <div class="sliding-switch">
            <label class="switch">
              <input type="checkbox" />
              <span v-on:click="mnemonicValueBitSizeChange" class="slider round"></span>
            </label>
            <div class="labels">
              <span class="label-left white">12</span>
              <span class="label-right">24</span>
            </div>
          </div>
          <span class="text__base link switch-label">{{ $t("createWallet.byMnemonicValue") }}</span>
        </div>

        <div v-on:click="mnemonicValueRefresh" class="random-button color-green noselect">
          <i class="fa fa-refresh" aria-hidden="true"></i>
          <span>{{ $t("createWallet.byMnemonicRandom") }}</span>
        </div>
      </div>
      <div class="phrases">
        <ul>
          <li v-for="(value, index) in mnemonicValues" v-bind:key="index">
            {{index + 1}}.<span>{{value}}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="button-container">
      <router-link to="interface">
        <b-btn class="mid-round-button-green-filled close-button">
          {{ $t("accessWallet.accessMyWallet")}}
        </b-btn>
      </router-link>
    </div>
    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/icons/help-center.svg"></div>
          <div class="support-label"><h5>{{ $t("common.customerSupport") }}</h5></div>
        </div>
      </router-link>
    </div>
  </b-modal>
</template>

<script>
// Mnemonic code for generating deterministic keys
let bip39 = require('bip39')

export default {
  props: ['networkAndAddressOpen'],
  data () {
    return {
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
      const left = document.querySelector('.label-left')
      const right = document.querySelector('.label-right')

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
    }
  },
  mounted () {
    // Generate a random mnemonic
    this.mnemonicValues = bip39.generateMnemonic(128).split(' ')
  }
}
</script>

<style lang="scss" scoped>
  @import "AccessByMnemonicphraseModal.scss";
</style>
