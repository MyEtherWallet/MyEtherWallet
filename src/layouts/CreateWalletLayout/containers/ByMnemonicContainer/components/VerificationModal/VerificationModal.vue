<template>
  <b-modal
    ref="verification"
    hide-footer
    centered
    class="bootstrap-modal-wide verification nopadding"
    title="Verification"
    static
    lazy
  >
    <div class="content-block">
      <p class="block-title">
        Please enter and fill out the empty boxes below to verify your mnemonic
        phrase key.
      </p>
      <div class="phrases">
        <ul>
          <li
            v-for="(value, index) in mnemonicValues"
            :key="index"
            :data-index="index"
            class="word"
          >
            {{ index + 1 }}.<span>{{ value }}</span>
            <input
              v-model="inputs[index]"
              class="hidden"
              type="text"
              name=""
              autocomplete="off"
            />
          </li>
        </ul>
      </div>
      <div v-show="errorMsg.length > 0" class="error-msg-container">
        {{ errorMsg }}
      </div>
      <div class="button-container">
        <div
          :class="[
            loading ? 'disabled' : '',
            'verify-button large-round-button-green-filled'
          ]"
          @click="verifyMnemonic"
        >
          <span v-show="!loading"> Verify </span>
          <i v-show="loading" class="fa fa-lg fa-spin fa-spinner" />
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    mnemonicValues: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      inputs: {},
      loading: false,
      errorMsg: ''
    };
  },
  mounted() {
    this.$refs.verification.$on('shown', () => {
      // Generate random numbers to choose which blocks to hide
      const newArr = [...this.mnemonicValues.keys()];
      const ranNums = this.shuffle(newArr);
      // this.mnemonicValues.forEach((item, idx) => {
      //   this.inputs[idx] = item;
      // });

      document.querySelectorAll('.phrases .word').forEach(function(el) {
        el.classList.remove('verification');
        el.querySelector('span').classList.remove('hidden');
        el.querySelector('input').classList.add('hidden');
      });

      // Hide 5 random mnemonic blocks
      for (let c = 0; c < 5; c++) {
        this.inputs[ranNums[c]] = '';
        document
          .querySelector('.phrases .word[data-index="' + ranNums[c] + '"]')
          .classList.add('verification');
        document
          .querySelector('.phrases .word[data-index="' + ranNums[c] + '"]')
          .querySelector('span')
          .classList.add('hidden');
        document
          .querySelector('.phrases .word[data-index="' + ranNums[c] + '"]')
          .querySelector('input')
          .classList.remove('hidden');
      }
    });
    this.$refs.verification.$on('hidden', () => {
      this.inputs = {};
      this.loading = false;
      this.errorMsg = '';
    });
  },
  methods: {
    hasEmpty() {
      let emptyInputs = 0;
      const inputs = Object.keys(this.inputs);
      inputs.forEach(input => {
        if (this.inputs[input] === '') {
          emptyInputs++;
        }
      });
      return emptyInputs === 0;
    },
    shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
    verifyMnemonic() {
      this.loading = true;
      this.errorMsg = '';
      const updatedArray = [...this.mnemonicValues];
      Object.keys(this.inputs).forEach(item => {
        updatedArray.splice(item, 1, this.inputs[item]);
      });
      if (!this.hasEmpty()) {
        this.errorMsg = `Some fields are still missing!`;
      } else if (updatedArray.join() === this.mnemonicValues.join()) {
        this.$emit('verifiedMnemonic');
      } else {
        this.errorMsg = `Mnemonic doesn't match! Please write it down correctly!`;
      }
      this.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'VerificationModal.scss';
</style>
