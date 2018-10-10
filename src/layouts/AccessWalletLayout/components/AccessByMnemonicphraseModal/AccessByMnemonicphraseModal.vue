<template>
  <b-modal
    ref="accessbymnemonicphrase"
    hide-footer
    class="bootstrap-modal mnemonic-phrase-modal"
    title="Access by Mnemonic Phrase"
    centered>

    <div class="contents">
      <p class="instruction">Please type in your mnemonic phrases.</p>
      <div class="tools">
        <div class="value-switch noselect">
          <div class="sliding-switch">
            <label class="switch">
              <input type="checkbox" >
              <span
                class="slider round"
                @click="mnemonicValueBitSizeChange"/>
            </label>
            <div class="labels">
              <span class="label-left white">12</span>
              <span class="label-right">24</span>
            </div>
          </div>
          <span class="text__base link switch-label">{{ $t("createWallet.byMnemonicValue") }}</span>
        </div>

      </div>
      <div class="phrases">
        <ul>
          <li
            v-for="index in mnemonicSize"
            :key="index">
            <span>{{ index }}.</span><input
              type="text"
              name="">
          </li>
        </ul>
      </div>
    </div>

    <div class="button-container">
      <b-btn
        class="mid-round-button-green-filled close-button"
        @click="openPassword">
        Continue
      </b-btn>
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
export default {
  props: {
    openPassword: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      mnemonic24: false,
      mnemonicSize: 12
    };
  },
  mounted() {
    //this.$refs.accessbymnemonicphrase.show();
  },
  methods: {
    mnemonicValueBitSizeChange() {
      const left = document.querySelector('.label-left');
      const right = document.querySelector('.label-right');

      this.mnemonic24 = !this.mnemonic24;

      if (this.mnemonic24 === true) {
        this.mnemonicSize = 24;
        left.classList.remove('white');
        right.classList.add('white');
      } else {
        this.mnemonicSize = 12;
        left.classList.add('white');
        right.classList.remove('white');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AccessByMnemonicphraseModal-desktop.scss';
@import 'AccessByMnemonicphraseModal-tablet.scss';
@import 'AccessByMnemonicphraseModal-mobile.scss';
</style>
