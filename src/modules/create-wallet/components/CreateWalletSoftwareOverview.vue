<template>
  <div class="mew-overview pt-5">
    <!--
    =====================================================================================
      Keystore File Button
    =====================================================================================
    -->
    <mew-super-button
      class="mb-5"
      color-theme="basic"
      font-class="mew-heading-2"
      title="Keystore File"
      subtitle="Using a keystore file online makes your wallet more vulnerable to loss of funds. We don’t recommend this method of wallet creation."
      title-icon-type="mdi"
      title-icon-class="primary--text"
      right-icon-type="img"
      :right-icon="require('@/assets/images/icons/icon-keystore-file.svg')"
      @click.native="selectWalletType(walletTypes.KEYSTORE)"
    />
    <!--
    =====================================================================================
      Mnemonic Phrase Button
    =====================================================================================
    -->
    <mew-super-button
      class="mb-5"
      color-theme="basic"
      font-class="mew-heading-2"
      title="Mnemonic Phrase"
      subtitle="Using a keystore file online makes your wallet more vulnerable to loss of funds. We don’t recommend this method of wallet creation."
      title-mdi-icon="mdi-shield-check"
      title-icon-type="mdi"
      title-icon-class="primary--text"
      right-icon-type="img"
      :right-icon="require('@/assets/images/icons/icon-mnemonic.svg')"
      @click.native="selectWalletType(walletTypes.MNEMONIC)"
    />
    <!--
    =====================================================================================
      Warning Block
    =====================================================================================
    -->
    <mew-warning-sheet
      class="mb-0"
      title="NOT RECOMMENDED"
      :link-obj="linkToLearnMore"
      description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users."
    />
  </div>
</template>

<script>
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
export default {
  name: 'CreateWalletSoftwareOverview',
  data: () => ({
    walletTypes: WALLET_TYPES,
    linkToLearnMore: {
      url: 'https://kb.myetherwallet.com/en/security-and-privacy/not-recommended/',
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
