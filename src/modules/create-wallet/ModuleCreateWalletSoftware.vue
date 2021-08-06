<template>
  <div>
    <!--
    =====================================================================================
        Overlay - create using software
    =====================================================================================
    -->
    <mew-overlay
      :footer="{
        text: 'Need help?',
        linkTitle: 'Contact support',
        link: 'mailto:support@myetherwallet.com'
      }"
      :show-overlay="open"
      :title="typeTitle"
      :close="close"
      :back="goBack"
      content-size="medium"
    >
      <!--
        =====================================================================================
         Overview: prompts user to select options
        =====================================================================================
        -->
      <create-wallet-software-overview
        v-if="isOverview"
        @typeSelect="setType"
      />
      <!--
        =====================================================================================
         Create using Keystore
        =====================================================================================
        -->
      <create-wallet-keystore
        v-else-if="isKeystore"
        :handler-create-wallet="walletHandler"
      />
      <!--
        =====================================================================================
         Create using Mnemonic
        =====================================================================================
        -->
      <create-wallet-mnemonic-phrase
        v-else-if="isMnemonic"
        :handler-create-wallet="walletHandler"
      />
    </mew-overlay>
  </div>
</template>

<script>
import CreateWalletSoftwareOverview from './components/CreateWalletSoftwareOverview';
import CreateWalletKeystore from './components/CreateWalletKeystore';
import CreateWalletMnemonicPhrase from './components/CreateWalletMnemonicPhrase';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import handlerCreateWallet from './handlers/handlerCreateWallet';

export default {
  name: 'ModuleCreateWalletSoftware',
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
    isOverview() {
      return (
        this.walletType !== this.types.MNEMONIC &&
        this.walletType !== this.types.KEYSTORE
      );
    },
    isKeystore() {
      return this.walletType === this.types.KEYSTORE;
    },
    isMnemonic() {
      return this.walletType === this.types.MNEMONIC;
    },
    /**
     * @returns correct title of the overlay according to the wallet type selected
     */
    typeTitle() {
      return this.walletType === this.types.MNEMONIC
        ? 'Create Wallet with Mnemonic Phrase'
        : this.walletType === this.types.KEYSTORE
        ? 'Create Wallet with Keystore File'
        : 'Create wallet using software';
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
      if (this.isOverview) {
        try {
          this.$router.go(-1);
        } catch (e) {
          Toast(e, {}, ERROR);
        }
      }
    },
    /**
     * Sets a wallet type and the step according to the provided wallet type
     * This method is used in create overview component
     * @type - must be one of the this.types or an empty string (this will reset step to 0)
     */
    setType(newType) {
      try {
        this.$router.push({
          query: { type: newType }
        });
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    }
  }
};
</script>
