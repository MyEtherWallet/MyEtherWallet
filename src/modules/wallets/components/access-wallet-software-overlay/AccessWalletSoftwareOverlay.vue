<template>
  <div>
    <mew-overlay
      :show-overlay="open"
      :title="typeTitle"
      @closeOverlay="closeOverlay"
    >
      <template v-slot:mewOverlayBody>
        <v-sheet
          v-if="type === '' && step === 0"
          color="transparent"
          max-width="650px"
          class="mx-auto pt-5 mew-component--software-overlay"
        >
          <mew-super-button
            class="mb-5"
            btn-mode="small-right-image"
            color-theme="basic"
            title="Keystore File"
            subtitle="Keystore file contains all the sensitive information of your wallet.
                  We don't recommand using this method to create your wallet."
            title-mdi-icon="mdi-shield-check"
            title-icon-class="primary--text"
            :right-icon="
              require('@/assets/images/icons/icon-keystore-file.svg')
            "
            @click.native="
              () => {
                createType('keystore');
              }
            "
          />
          <mew-super-button
            class="mb-5"
            btn-mode="small-right-image"
            color-theme="basic"
            title="Mnemonic phrase"
            subtitle="Mnemonic Phrase can be lost or stolen by someone else. We don't
                  recommand using this method to create your wallet."
            title-mdi-icon="mdi-shield-check"
            title-icon-class="primary--text"
            :right-icon="require('@/assets/images/icons/icon-mnemonic.svg')"
            @click.native="
              () => {
                createType('mnemonic');
              }
            "
          />

          <warning-sheet
            class="mew-component--warning"
            title="NOT RECOMMENDED"
            :link-obj="linkToLearnMore"
            description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users."
          />
        </v-sheet>
        <div v-else-if="type === 'keystore'">
          <keystore :update-step="updateStep" :step="step" />
        </div>
        <div v-else-if="type === 'mnemonic'">
          <mnemonic-phrase :update-step="updateStep" :step="step" />
        </div>
      </template>
    </mew-overlay>
  </div>
</template>

<script>
import keystore from '@/modules/wallets/components/keystore/Keystore';
import mnemonicPhrase from '@/modules/wallets/components/mnemonic-phrase/MnemonicPhrase';

export default {
  name: 'Software',
  components: { keystore, mnemonicPhrase },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    linkToLearnMore: {
      url:
        'https://kb.myetherwallet.com/en/security-and-privacy/not-recommended/',
      title: 'Learn more'
    },
    type: '',
    step: 0
  }),
  computed: {
    typeTitle() {
      return this.type === ''
        ? 'Software'
        : this.type === 'keystore'
        ? 'Keystore File'
        : 'Mnemonic Phrase';
    }
  },
  watch: {
    type(newVal) {
      if (newVal === '') {
        this.step = 0;
      } else {
        this.step = 1;
      }
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay');
      this.close();
    },
    createType(type) {
      this.type = type ? type : '';
    },
    updateStep(step) {
      this.step = step ? step : 0;
    }
  }
};
</script>
