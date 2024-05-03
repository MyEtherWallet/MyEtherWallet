<template>
  <!--
  =====================================================================================
    Overlay - access using software
  =====================================================================================
  -->
  <mew-overlay
    :footer="{
      text: 'Need help?',
      linkTitle: 'Contact support',
      link: 'mailto:support@myetherwallet.com'
    }"
    :show-overlay="open"
    title="Access Wallet with Mobile Apps"
    content-size="large"
    :close="close"
  >
    <!--
    =====================================================================================
      Mobile Connection Protocol Buttons
    =====================================================================================
    -->
    <div style="max-width: 650px; width: 100%" class="mx-auto mb-n5 pt-5">
      <div v-for="(btn, key) in buttons" :key="key">
        <mew-button
          has-full-width
          color-theme="greyMedium"
          btn-style="outline"
          style="height: 160px"
          class="mb-5"
          @click.native="btn.fn"
        >
          <div
            class="d-flex align-center justify-space-between px-2"
            style="width: 100%"
          >
            <div class="mew-heading-2 textDark--text">{{ btn.label }}</div>
            <v-img
              :src="btn.icon"
              max-width="90px"
              min-width="40px"
              class="px-4 px-sm-3"
              contain
            />
          </div>
        </mew-button>
      </div>
    </div>
  </mew-overlay>
</template>

<script setup>
import { defineProps } from 'vue';

import { Toast, SENTRY } from '@/modules/toast/handler/handlerToast';
import {
  WalletConnectWallet,
  WalletLinkWallet
} from '@/modules/access-wallet/hybrid/handlers';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';

import { ACCESS_WALLET } from '@/modules/analytics-opt-in/handlers/configs/events';
import { useAmplitude } from '@/core/composables/amplitude';
import { useWalletStore } from '@/core/store/wallet';

import { useRouter } from 'vue-router/composables';

// injections/use
const { trackAccessWalletAmplitude } = useAmplitude();
const { setWallet } = useWalletStore();
const router = useRouter();

// props
defineProps({
  open: {
    type: Boolean,
    default: false
  },
  close: {
    type: Function,
    default: () => {}
  }
});

// data
const buttons = [
  {
    label: 'WalletConnect',
    icon: require('@/assets/images/icons/icon-wallet-connect.svg'),
    fn: () => {
      openWalletConnect();
    }
  },
  {
    label: 'WalletLink',
    icon: require('@/assets/images/icons/icon-wallet-link.png'),
    fn: () => {
      openWalletLink();
    }
  }
];
// methods
const openWalletConnect = () => {
  try {
    trackAccessWalletAmplitude(ACCESS_WALLET.WALLET_CONNECT_QR_SHOWN);
    WalletConnectWallet()
      .then(_newWallet => {
        setWallet([_newWallet]);
        trackAccessWalletAmplitude(ACCESS_WALLET.WALLET_CONNECT_QR_SUCCESSFUL);
        router.push({ name: ROUTES_WALLET.DASHBOARD.NAME });
      })
      .catch(e => {
        trackAccessWalletAmplitude(ACCESS_WALLET.WALLET_CONNECT_QR_FAILED);
        WalletConnectWallet.errorHandler(e);
      });
  } catch (e) {
    Toast(e.message, {}, SENTRY);
  }
};
const openWalletLink = () => {
  try {
    trackAccessWalletAmplitude(ACCESS_WALLET.WALLET_LINK_QR_SHOWN);
    WalletLinkWallet()
      .then(_newWallet => {
        setWallet([_newWallet]);
        trackAccessWalletAmplitude(ACCESS_WALLET.WALLET_LINK_QR_SUCCESSFUL);
        router.push({ name: ROUTES_WALLET.DASHBOARD.NAME });
      })
      .catch(e => {
        trackAccessWalletAmplitude(ACCESS_WALLET.WALLET_LINK_QR_FAILED);
        WalletLinkWallet.errorHandler(e);
      });
  } catch (e) {
    Toast(e.message, {}, SENTRY);
  }
};
</script>

<style lang="scss" scoped></style>
