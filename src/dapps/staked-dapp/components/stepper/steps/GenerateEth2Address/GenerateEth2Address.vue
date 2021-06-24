<template>
  <div
    class="dapps--staked--stepper--steps--Generate-Eth2-Address mx-auto pb-15"
    style="max-width: 550px"
  >
    <div class="mew-heading-2 py-12 text-center">
      Here is your new Eth2 address
    </div>

    <message-block class="d-flex align-center justify-space-between">
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
    </message-block>

    <div class="mt-8">
      <div class="mew-heading-3 mb-5">1. Write down your recovery phrase</div>
      <phrase-block>
        <mnemonic-phrase-table :data="phrase" />
      </phrase-block>
    </div>

    <div class="mt-10">
      <div class="mew-heading-3 mb-5">2. Download your keystore file</div>
      <phrase-block
        class="d-block d-sm-flex align-center justify-space-between"
      >
        <div class="d-flex align-center">
          <img
            src="@/assets/images/icons/icon-keystore-file.svg"
            alt="Keystore file"
          />
          <div class="ml-2">
            <div class="mew-heading-4">Keystore file</div>
            <div class="textSecondary--text">
              keystore-file-for-your-wallet.json
            </div>
          </div>
        </div>
        <mew-button
          class="my-2"
          btn-size="small"
          title="Download"
          btn-style="outline"
          :has-full-width="$vuetify.breakpoint.xs"
          @click.native="isOpenDownloadKeystore = true"
        />
      </phrase-block>

      <mew-warning-sheet class="mt-4" :description="keystoreFileWarning" />

      <div
        class="
          mt-10
          d-flex
          flex-column-reverse flex-md-row
          align-center
          justify-center
        "
      >
        <mew-button
          btn-size="xlarge"
          class="d-block ma-2"
          title="Back"
          btn-style="outline"
        />
        <mew-button
          btn-size="xlarge"
          class="d-block ma-2"
          title="Continue after downloading keystore file"
        >
        </mew-button>
      </div>
    </div>

    <!--
    ======================================================
    Download keystore file popup window
    ======================================================
    -->
    <popup v-model="isOpenDownloadKeystore" title="Choose password">
      <div>Protect your keystore file with password</div>
      <mew-input class="mt-8" label="New password" />
      <mew-input class="mt-2" label="Confirm password" />

      <message-block class="mt-1">
        <mew-checkbox
          v-model="userWarning"
          :label="userWarningLabel"
        ></mew-checkbox>
      </message-block>

      <mew-button
        class="d-block mx-auto mt-10"
        btn-size="xlarge"
        title="Download keystore file"
      />
    </popup>
  </div>
</template>

<script>
import MessageBlock from '@/core/components/AppMessageBlock';
import Popup from '@/core/components/AppPopup.vue';
import MnemonicPhraseTable from '@/components/MnemonicPhraseTable';
import PhraseBlock from '@/components/PhraseBlock';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import handlerCreateWallet from '@/modules/create-wallet/handlers/handlerCreateWallet';

export default {
  components: { Popup, MessageBlock, MnemonicPhraseTable, PhraseBlock },
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
      userWarning: false,
      userWarningLabel:
        'I understand that MEW has no control over any assets I choose to associate with these keys and willingly assume all risk of loss, including those coming as a result of protocol or key failure.',
      isOpenDownloadKeystore: false,
      keystoreFileWarning:
        "Don't loose your Keystore file / password and Recovery phrase. They hold your keys and are necessary future access. MEW will not be able to recover them for you so make sure to keep them safe.",
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
