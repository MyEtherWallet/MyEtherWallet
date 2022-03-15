<template>
  <div class="mew-overview pt-5">
    <div style="max-width: 650px; width: 100%" class="mx-auto">
      <!--
      =====================================================================================
        Keystore File Button
      =====================================================================================
      -->
      <div class="mb-5">
        <mew-button
          has-full-width
          color-theme="greyLight"
          btn-style="outline"
          style="height: 160px"
          @click.native="selectWalletType(walletTypes.KEYSTORE)"
        >
          <div
            class="text-left d-flex align-center justify-space-between px-2"
            style="width: 100%"
          >
            <div>
              <div class="mew-heading-2 textDark--text mb-2">Keystore File</div>
              <div class="break-word textDark--text">
                Using a keystore file online makes your wallet more vulnerable
                to loss of funds. We don’t recommend this method of wallet
                creation.
              </div>
            </div>
            <img
              width="80"
              class="mx-4 d-none d-sm-block"
              src="@/assets/images/icons/icon-keystore-file.svg"
            />
          </div>
        </mew-button>
      </div>

      <!--
      =====================================================================================
        Mnemonic Phrase Button
      =====================================================================================
      -->
      <div class="mb-5">
        <mew-button
          has-full-width
          color-theme="greyMedium"
          btn-style="outline"
          style="height: 160px"
          @click.native="selectWalletType(walletTypes.MNEMONIC)"
        >
          <div
            class="text-left d-flex align-center justify-space-between px-2"
            style="width: 100%"
          >
            <div>
              <div class="mew-heading-2 textDark--text mb-2">
                Mnemonic Phrase
              </div>
              <div class="break-word textDark--text">
                Using a Mnemonic Phrase online makes your wallet more vulnerable
                to loss of funds. We don’t recommend this method of wallet
                creation.
              </div>
            </div>
            <img
              width="80"
              class="mx-4 d-none d-sm-block"
              src="@/assets/images/icons/icon-mnemonic.svg"
            />
          </div>
        </mew-button>
      </div>

      <!--
      =====================================================================================
        Warning Block
      =====================================================================================
      -->
      <mew-warning-sheet
        class="mt-3"
        title="NOT RECOMMENDED"
        :link-obj="linkToLearnMore"
        description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users."
      />
    </div>
  </div>
</template>

<script>
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
export default {
  name: 'CreateWalletSoftwareOverview',
  data: () => ({
    walletTypes: WALLET_TYPES,
    linkToLearnMore: {
      url: 'https://help.myetherwallet.com/en/articles/5377921-mew-says-not-recommended-when-i-access-my-wallet-why',
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
