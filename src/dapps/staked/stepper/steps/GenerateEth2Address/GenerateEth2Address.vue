<template>
  <div
    class="dapps--staked--stepper--steps--upload mx-auto pb-15"
    style="max-width: 550px"
  >
    <div class="mew-heading-2 py-12 text-center">
      Here is your new Eth2 address
    </div>

    <div
      class="
        overlayBg
        py-3
        px-7
        border-radius--10px
        d-flex
        align-center
        justify-space-between
      "
    >
      <div>Already have Eth2 address?</div>
      <div class="primary--text cursor--pointer d-flex align-center pa-2 mr-n2">
        Skip this step
        <img
          height="20"
          class="ml-2"
          src="@/assets/images/icons/button-circle-right-arrow.svg"
          alt="right button"
        />
      </div>
    </div>

    <div class="mt-8">
      <div class="mew-heading-3 mb-5">1. Write down your recovery phrase</div>
      <phrase-block>
        <mnemonic-phrase-table :data="phrase" />
      </phrase-block>
    </div>
  </div>
</template>

<script>
import mnemonicPhraseTable from '@/components/MnemonicPhraseTable';
import phraseBlock from '@/components/PhraseBlock';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import handlerCreateWallet from '@/modules/create-wallet/handlers/handlerCreateWallet';

export default {
  components: { mnemonicPhraseTable, phraseBlock },
  props: {
    next: {
      type: Function,
      default: function () {}
    },
    back: {
      type: Function,
      default: function () {}
    }
  },
  data() {
    return {
      phraseSize: 12,
      phrase: [],
      generatedVerification: [],
      handlerCreateWallet: {}
    };
  },
  computed: {
    canVerify() {
      return this.isValidMnemonic && this.extraWordMatch;
    },
    isValidMnemonic() {
      return this.phrase.length === this.phraseSize;
    },
    extraWordMatch() {
      return this.extraWord === this.extraWordVerification;
    },
    stepTwoText() {
      return this.extraWord === ''
        ? 'Please select correct words based on their numbers.'
        : 'Please select correct words based on their numbers, and enter your extra word.';
    }
  },
  watch: {
    phraseSize: {
      deep: true,
      handler: function (newVal) {
        this.phraseSize = newVal;
        this.setPhrase();
      }
    },
    phrase: {
      deep: true,
      handler: function () {}
    }
  },
  mounted() {
    this.handlerCreateWallet = new handlerCreateWallet();
    this.setPhrase();
  },
  methods: {
    generateVerification() {
      this.generatedVerification = this.handlerCreateWallet.getVerification();
      this.generatedVerification.sort(function (a, b) {
        return a.itemNumber - b.itemNumber;
      });
    },
    setPhrase() {
      console.log('Set');
      this.handlerCreateWallet
        .generateMnemonic(this.phraseSize)
        .then(res => {
          console.log(res);

          this.phrase = res;
          this.generateVerification();
        })
        .catch(e => {
          this.generateVerification();
          Toast(e, {}, ERROR);
        });
    },
    verify() {
      this.handlerCreateWallet
        .validateMnemonic(this.validateMnemonicValues)
        .then(() => {
          this.updateStep(3);
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
