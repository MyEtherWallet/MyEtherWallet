<template>
  <div class="create-wallet-by-mnemonic">
    <finish-modal/>
    <verification-modal
      :mnemonic-values="mnemonicValues"
      :mnemonic-done-modal-open="mnemonicDoneModalOpen"/>
    <div class="wrap">

      <div class="nav-tab-user-input-box">
        <b-tabs>
          <div class="progress-bar"/>
          <b-tab
            title="By Mnemonic Phrase"
            active>
            <div class="title-popover">
              <h3>{{ $t("createWallet.byMnemonicWriteDown") }}</h3>
              <popover :popcontent="$t('popover.whatIsMessageContent')" />
            </div>
            <div class="contents">
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

                <div
                  class="random-button color-green noselect"
                  @click="mnemonicValueRefresh">
                  <i
                    class="fa fa-refresh"
                    aria-hidden="true"/>
                  <span>{{ $t("createWallet.byMnemonicRandom") }}</span>
                </div>
              </div>
              <div class="phrases">
                <ul>
                  <li
                    v-for="(value, index) in mnemonicValues"
                    :key="index">
                    {{ index + 1 }}.<span>{{ value }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="user-input">
              <div
                class="next-button large-round-button-green-filled clickable"
                @click="mnemonicVerificationModalOpen">
                {{ $t("createWallet.byMnemonicAlreadyWritten") }}
              </div>
              <router-link to="/">
                <img
                  class="icon"
                  src="~@/assets/images/icons/printer.svg">
              </router-link>
            </div>
            <input-footer />
          </b-tab>
        </b-tabs>
      </div>

    </div>
  </div>
</template>

<script>
import CreateWalletInputFooter from '@/layouts/CreateWalletLayout/components/CreateWalletInputFooter';
import FinishModal from './components/FinishModal';
import VerificationModal from './components/VerificationModal';
// Mnemonic code for generating deterministic keys
const bip39 = require('bip39');

export default {
  components: {
    'finish-modal': FinishModal,
    'verification-modal': VerificationModal,
    'input-footer': CreateWalletInputFooter
  },
  data() {
    return {
      varificationValues: [],
      mnemonicValues: [],
      mnemonic24: false
    };
  },
  mounted() {
    // Generate a random mnemonic
    this.mnemonicValues = bip39.generateMnemonic(128).split(' ');
  },
  methods: {
    mnemonicValueRefresh() {
      if (this.mnemonic24 === true) {
        this.mnemonicValues = bip39.generateMnemonic(256).split(' ');
      } else {
        this.mnemonicValues = bip39.generateMnemonic(128).split(' ');
      }
    },
    mnemonicValueBitSizeChange() {
      const left = document.querySelector('.label-left');
      const right = document.querySelector('.label-right');

      this.mnemonic24 = !this.mnemonic24;

      if (this.mnemonic24 === true) {
        // Regenerate new 24 Mnemonic phrases
        this.mnemonicValues = bip39.generateMnemonic(256).split(' ');
        left.classList.remove('white');
        right.classList.add('white');
      } else {
        // Regenerate new 12 Mnemonic phrases
        this.mnemonicValues = bip39.generateMnemonic(128).split(' ');
        left.classList.add('white');
        right.classList.remove('white');
      }
    },
    mnemonicDoneModalOpen() {
      let valid = false;

      this.varificationValues.forEach(function(value) {
        const userInputText = document
          .querySelector('.phrases .word[data-index="' + value.no + '"]')
          .querySelector('input').value;

        if (
          userInputText ===
          document
            .querySelector('.phrases .word[data-index="' + value.no + '"]')
            .querySelector('span').textContent
        ) {
          valid = true;
        } else {
          valid = false;
        }
      });

      if (valid === true) {
        this.$children[0].$refs.done.show();
      }
    },
    mnemonicVerificationModalOpen() {
      // Generate random numbers to choose which blocks to hide
      function generateNumArr(limit) {
        const ret = [];
        for (let i = 1; i < limit; i++) {
          ret.push(i);
        }

        return ret;
      }

      function shuffle(array) {
        let i = array.length;
        let j = 0;
        let temp;
        while (i--) {
          j = Math.floor(Math.random() * (i + 1));
          // swap randomly chosen element with current element
          temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array;
      }

      let ranNums = [];
      this.varificationValues = [];

      document.querySelectorAll('.phrases .word').forEach(function(el) {
        el.classList.remove('verification');
        el.querySelector('span').classList.remove('hidden');
        el.querySelector('input').classList.add('hidden');
      });

      if (this.mnemonic24 === true) {
        ranNums = shuffle(generateNumArr(25));
      } else {
        ranNums = shuffle(generateNumArr(13));
      }

      // Hide 5 random mnemonic blocks
      for (let c = 0; c < 5; c++) {
        document
          .querySelector('.phrases .word[data-index="' + ranNums[c] + '"]')
          .classList.add('verification');

        document
          .querySelector('.phrases .word[data-index="' + ranNums[c] + '"]')
          .querySelector('span')
          .classList.add('hidden');
        this.varificationValues.push({
          word: document
            .querySelector('.phrases .word[data-index="' + ranNums[c] + '"]')
            .querySelector('span').textContent,
          no: ranNums[c]
        });

        document
          .querySelector('.phrases .word[data-index="' + ranNums[c] + '"]')
          .querySelector('input')
          .classList.remove('hidden');
      }

      this.$children[1].$refs.verification.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ByMnemonicContainer-desktop.scss';
@import 'ByMnemonicContainer-tablet.scss';
@import 'ByMnemonicContainer-mobile.scss';
</style>
