<template>
  <div class="mew-overview pt-5 mx-auto">
    <div style="max-width: 650px; width: 100%" class="mx-auto">
      <!--
      =====================================================================================
        Keystore File Button
      =====================================================================================
      -->
      <div class="mb-5">
        <mew-button
          class="CreateWalletSoftwareOverviewKeystore"
          has-full-width
          color-theme="white"
          btn-style="outline"
          style="height: 160px"
          @click.native="routeToKeystore"
        >
          <div
            class="text-left d-flex align-center justify-space-between px-2"
            style="width: 100%"
          >
            <div>
              <div class="mew-heading-2 white--text mb-2">Keystore File</div>
              <div class="break-word white--text">
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
      <div class="CreateWalletSoftwareOverviewMnemonic mb-5">
        <mew-button
          has-full-width
          color-theme="white"
          btn-style="outline"
          style="height: 160px"
          @click.native="routeToMnemonic"
        >
          <div
            class="text-left d-flex align-center justify-space-between px-2"
            style="width: 100%"
          >
            <div>
              <div class="mew-heading-2 white--text mb-2">Mnemonic Phrase</div>
              <div class="break-word white--text">
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
import { mapGetters, mapState } from 'vuex';
import { ROUTES_HOME } from '@/core/configs/configRoutes';

export default {
  name: 'CreateWalletSoftwareOverview',
  data() {
    return {
      linkToLearnMore: {
        text: 'Learn more',
        url: ''
      }
    };
  },
  computed: {
    ...mapGetters('article', ['getArticle']),
    ...mapState('wallet', ['isOfflineApp'])
  },
  mounted() {
    if (this.isOfflineApp) this.linkToLearnMore = {};
    else
      this.linkToLearnMore.url = this.getArticle('not-rec-when-access-wallet');
  },
  methods: {
    routeToMnemonic() {
      this.$router.push({
        name: ROUTES_HOME.CREATE_WALLET_SOFTWARE_MNEMONIC.NAME
      });
    },
    routeToKeystore() {
      this.$router.push({
        name: ROUTES_HOME.CREATE_WALLET_SOFTWARE_KEYSTORE.NAME
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.mew-overview {
  max-width: 650px;
}
</style>
