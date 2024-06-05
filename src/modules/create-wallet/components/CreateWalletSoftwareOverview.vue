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
      <div class="d-flex align-center justify-center">
        <mew-button
          title="Back To Create Wallet"
          btn-size="xlarge"
          btn-style="outline"
          color-theme="white"
          class="mx-md-1 my-1"
          @click.native="backToSoftware"
        />
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

<script setup>
import { onMounted, ref } from 'vue';

import { useWalletStore } from '@/core/store/wallet';
import { useArticleStore } from '@/core/store/article';
import { useRouter } from 'vue-router/composables';
import { ROUTES_HOME } from '@/core/configs/configRoutes';

// injections/use
const { getArticle } = useArticleStore();
const { isOfflineApp } = useWalletStore();
const router = useRouter();

// data
const linkToLearnMore = ref({
  url: '',
  title: 'Learn more'
});

onMounted(() => {
  if (isOfflineApp) {
    linkToLearnMore.value = {};
  } else {
    linkToLearnMore.value.url = getArticle('not-rec-when-access-wallet');
  }
});

// methods
const routeToMnemonic = () => {
  router.push({
    name: ROUTES_HOME.CREATE_WALLET_SOFTWARE_MNEMONIC.NAME
  });
};
const routeToKeystore = () => {
  router.push({
    name: ROUTES_HOME.CREATE_WALLET_SOFTWARE_KEYSTORE.NAME
  });
};
const backToSoftware = () => {
  router.push({
    name: ROUTES_HOME.CREATE_WALLET.NAME
  });
};
</script>

<style lang="scss" scoped>
.mew-overview {
  max-width: 650px;
}
</style>
