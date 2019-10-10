<template>
  <b-modal
    ref="verification"
    hide-footer
    centered
    class="bootstrap-modal-wide verification nopadding"
    :title="$t('createWallet.mnemonic.verify.title')"
    static
    lazy
  >
    <div class="content-block">
      <p class="block-title">{{ $t('createWallet.mnemonic.verify.text') }}</p>
      <div class="phrases">
        <ul>
          <li
            v-for="(value, index) in mnemonicValues"
            :key="index"
            :data-index="index"
            class="word"
          >
            {{ index + 1 }}.
            <span>{{ value }}</span>
            <input class="hidden" type="text" name autocomplete="off" />
          </li>
        </ul>
      </div>
      <div class="button-container">
        <div
          class="verify-button large-round-button-green-filled"
          @click="verifyMnemonic"
        >{{$t('common.verify')}}</div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    mnemonic24: {
      type: Boolean,
      default: false
    },
    mnemonicValues: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      verificationValues: []
    };
  },
  mounted() {
    this.$refs.verification.$on('shown', () => {
      // Generate random numbers to choose which blocks to hide
      let ranNums;
      document.querySelectorAll('.phrases .word').forEach(function(el) {
        el.classList.remove('verification');
        el.querySelector('span').classList.remove('hidden');
        el.querySelector('input').classList.add('hidden');
      });

      if (this.mnemonic24 === true) {
        ranNums = this.shuffle(this.generateArr(24));
      } else {
        ranNums = this.shuffle(this.generateArr(12));
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
        this.verificationValues.push({
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
    });
  },
  methods: {
    shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
    generateArr(val) {
      const arr = [];
      for (let i = 0; i < val; i++) {
        arr[i] = i;
      }
      return arr;
    },
    verifyMnemonic() {
      let valid = false;
      this.verificationValues.forEach(function(value) {
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
        this.$emit('verifiedMnemonic');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'VerificationModal.scss';
</style>
