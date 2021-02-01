<template>
  <div>
    <!--
    =====================================================================================
        Overlay - create using software
    =====================================================================================
    -->
    <mew-overlay
      :show-overlay="open"
      :title="typeTitle"
      :right-btn-text="$t('common.cancel')"
      :left-btn-text="backBtnText"
      :close="close"
      :back="goBack"
    >
      <template #mewOverlayBody>
        <!--
        =====================================================================================
         Overview: prompts user to select options
        =====================================================================================
        -->
        <create-wallet-software-overview
          v-if="type === ''"
          @typeSelect="setType"
        />
        <!--
        =====================================================================================
         Create using Keystore
        =====================================================================================
        -->
        <create-wallet-keystore
          v-else-if="type === 'keystore'"
          :update-step="nextStep"
          :step="step"
        />
        <!--
        =====================================================================================
         Create using Mnemonic
        =====================================================================================
        -->
        <create-wallet-mnemonic-phrase
          v-else-if="type === 'mnemonic'"
          :update-step="nextStep"
          :step="step"
        />
      </template>
    </mew-overlay>
  </div>
</template>

<script>
import CreateWalletSoftwareOverview from './components/CreateWalletSoftwareOverview';
import CreateWalletKeystore from './components/CreateWalletKeystore';
import CreateWalletMnemonicPhrase from './components/CreateWalletMnemonicPhrase';
import { WALLET_TYPES } from './handlers/helpers';

export default {
  name: 'ModuleSoftware',
  components: {
    CreateWalletSoftwareOverview,
    CreateWalletKeystore,
    CreateWalletMnemonicPhrase
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data: () => ({
    type: '',
    step: 0
  }),
  computed: {
    /**
     * @returns correct title of the overlay according to the wallet type selected
     */
    typeTitle() {
      return this.type === ''
        ? 'Create wallet using software'
        : this.type === WALLET_TYPES[0]
        ? 'Create Wallet with Keystore File'
        : 'Create Wallet with Mnemonic Phrase';
    },
    /**
     * @returns back button text
     * if step is 0, button text is empty
     */
    backBtnText() {
      return this.step === 0 ? '' : this.$t('common.back');
    }
  },
  watch: {
    /**
     * Reset step and wallet type if overlay is closed
     */
    open(newVal) {
      if (newVal === false) {
        this.setType('');
      }
    }
  },
  methods: {
    /**
     * Increases step by 1,
     * Used in keystore and mnemonic creation
     */
    nextStep(step) {
      this.step = step ? step : 0;
    },
    /**
     * Decreases step by 1,
     * If step is 0, the wallet type is reset, to show the overview screen
     * Used in overlay back button
     */
    goBack() {
      if (this.step > 0) {
        this.step = this.step - 1;
        if (this.step === 0) {
          this.type = '';
        }
      }
    },
    /**
     * Sets a wallet type and the step according to the provided wallet type
     * This method is used inCreateOverView component and when overlay is closed
     * @type - must be one of the WALLET_TYPES or an empty string (this will reset step to 0)
     */
    setType(newType) {
      this.type = newType ? newType : '';
      if (this.type === '') {
        this.step = 0;
      } else {
        this.step = 1;
      }
    }
  }
};
</script>
