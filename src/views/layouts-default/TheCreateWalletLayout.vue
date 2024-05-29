<template>
  <div class="expandHeader pt-16">
    <v-container>
      <!--
    =====================================================================================
        Layout Title
    =====================================================================================
    -->
      <the-layout-header
        :title="$t('home.create-wallet.title')"
        :subtitle-line-one="$t('home.create-wallet.subtitle-one')"
        :subtitle-line-two="$t('home.create-wallet.subtitle-two')"
        :route-obj="titleRoute"
        has-link
      />
      <!--
    =====================================================================================
        Options
    =====================================================================================
    -->
      <div>
        <router-view />
      </div>
    </v-container>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import enkryptMarketing from '@/core/mixins/enkryptMarketing.mixin';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import {
  COMMON,
  CREATE_WALLET
} from '@/modules/analytics-opt-in/handlers/configs/events.js';

export default {
  name: 'TheCreateWalletLayout',
  components: {
    TheLayoutHeader: () => import('../components-default/TheLayoutHeader')
  },
  mixins: [enkryptMarketing, handlerAnalytics],
  data: () => ({
    titleRoute: {
      text: 'Access Wallet',
      routeName: 'AccessWallet',
      func: () => {
        this.trackCreateWalletAmplitude(CREATE_WALLET.NAVIGATE_TO_ACCESS);
      }
    }
  }),
  mounted() {
    this.trackCreateWalletAmplitude(COMMON.PAGE_SHOWN);
  }
};
</script>
