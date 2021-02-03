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
          v-if="walletType === types[2]"
          @typeSelect="setType"
        />
        <!--
        =====================================================================================
         Create using Keystore
        =====================================================================================
        -->
        <create-wallet-keystore
          v-else-if="walletType === types[0]"
          :handler-create-wallet="walletHandler"
        />
        <!--
        =====================================================================================
         Create using Mnemonic
        =====================================================================================
        -->
        <create-wallet-mnemonic-phrase
          v-else-if="walletType === types[1]"
          :handler-create-wallet="walletHandler"
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
import handlerCreateWallet from './handlers/handlerCreateWallet';

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
    },
    walletType: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    types: WALLET_TYPES,
    walletHandler: {}
  }),
  computed: {
    /**
     * @returns correct title of the overlay according to the wallet type selected
     */
    typeTitle() {
      return this.walletType === WALLET_TYPES[2]
        ? 'Create wallet using software'
        : this.walletType === WALLET_TYPES[0]
        ? 'Create Wallet with Keystore File'
        : 'Create Wallet with Mnemonic Phrase';
    },
    /**
     * @returns back button text
     * if overview, button text is empty
     */
    backBtnText() {
      return this.walletType === WALLET_TYPES[2] ? '' : 'Back to Software';
    }
  },
  mounted() {
    this.walletHandler = new handlerCreateWallet();
  },
  destroyed() {
    this.walletHandler = {};
  },
  methods: {
    /**
     * Directs user back to software overview
     * Pushes new route query param
     * Used in overlay back button
     */
    goBack() {
      if (this.walletType !== WALLET_TYPES[2]) {
        try {
          this.$router.push({
            query: { type: 'overview' }
          });
        } catch {}
      }
    },
    /**
     * Sets a wallet type and the step according to the provided wallet type
     * This method is used in create overview component
     * @type - must be one of the WALLET_TYPES or an empty string (this will reset step to 0)
     */
    setType(newType) {
      try {
        this.$router.push({
          query: { type: newType }
        });
      } catch {}
    }
  }
};
</script>
