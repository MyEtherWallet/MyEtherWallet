<template>
  <div class="mew-overview pt-5">
    <!--
    =====================================================================================
      Keystore File Button
    =====================================================================================
    -->
    <mew-super-button
      class="mb-5"
      btn-mode="small-right-image"
      color-theme="basic"
      title="Keystore File"
      subtitle="Keystore file contains all the sensitive information of your wallet.
                  We don't recommand using this method to create your wallet."
      title-mdi-icon="mdi-shield-check"
      title-icon-class="primary--text"
      :right-icon="require('@/assets/images/icons/icon-keystore-file.svg')"
      @click.native="selectWalletType(walletTypes[0])"
    />
    <!--
    =====================================================================================
      Mnemonic Phrase Button
    =====================================================================================
    -->
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
      @click.native="selectWalletType(walletTypes[1])"
    />
    <!--
    =====================================================================================
      Warning Block
    =====================================================================================
    -->
    <mew-warning-sheet
      title="NOT RECOMMENDED"
      :link-obj="linkToLearnMore"
      description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users."
    />
  </div>
</template>

<script>
import MewSuperButton from '@/components/mewSuperButton/MewSuperButton';
import { WALLET_TYPES } from '../handlers/helpers';
export default {
  name: 'CreateWalletSoftwareOverview',
  components: { MewSuperButton },
  data: () => ({
    walletTypes: WALLET_TYPES,
    linkToLearnMore: {
      url:
        'https://kb.myetherwallet.com/en/security-and-privacy/not-recommended/',
      title: 'Learn more'
    }
  }),

  methods: {
    /**
     * Emit wallet type creation.
     * @type - is part of WALLET_TYPES
     * function is void
     */
    selectWalletType(type) {
      this.$emit('typeSelect', type);
    }
  }
};
</script>

<style lang="scss">
.mew-overview {
  max-width: 650px;
}
</style>
