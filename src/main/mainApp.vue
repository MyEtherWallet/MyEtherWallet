<template>
  <v-app class="walletBg">
    <router-view />
    <module-toast />
    <module-global-modals />
    <module-analytics />
    <module-buy-sell :open="buySellOpen" @close="buySellOpen = false" />
  </v-app>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUnmount } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en';

import {
  getInjectedName,
  getInjectedIcon
} from '@/core/helpers/detectProvider.js';
import { PWA_EVENTS } from '@/core/helpers/common';
import {
  Toast,
  ERROR,
  SUCCESS,
  INFO,
  WARNING
} from '@/modules/toast/handler/handlerToast';
import { BUYSELL_EVENT } from '@/modules/buy-sell/helpers';
import { EventBus } from '@/core/plugins/eventBus';
import {
  BUY_SELL,
  SWAP
} from '@/modules/analytics-opt-in/handlers/configs/events.js';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import { useI18n } from 'vue-i18n-composable';
import { useVuetify } from '@/core/composables/vuetify';
import { useArticleStore } from '@/core/store/article';
import { useCustomStore } from '@/core/store/custom';
import { useAddressBookStore } from '@/core/store/addressBook';

import ModuleToast from '@/modules/toast/ModuleToast.vue';
import ModuleGlobalModals from '@/modules/global-modals/ModuleGlobalModals';
import ModuleAnalytics from '@/modules/analytics-opt-in/ModuleAnalytics';
import ModuleBuySell from '@/modules/buy-sell/ModuleBuySell';

// injection/use
const { trackSwapAmplitude, trackBuySell } = useAmplitude();
const { preferredCurrency, network, setOnlineStatus } = useGlobalStore();
const { timestamp, articleList, updateArticles } = useArticleStore();
const { identifier } = useWalletStore();
const { addressBook } = useCustomStore();
const { isMigrated, setMigrated, setAddressBook } = useAddressBookStore();
const { setCurrency, storeEIP6963Wallet } = useExternalStore();
const { t } = useI18n();
const vuetify = useVuetify();

// data
const buySellOpen = ref(false);

// created
onBeforeMount(() => {
  const succMsg = t('common.updates.new');
  const updateMsg = t('common.updates.update-found');
  const errMsg = t('common.updates.update-error');
  vuetify.theme.dark = false;

  // pwa listeners
  window.addEventListener(PWA_EVENTS.PWA_UPDATED, () => {
    Toast(succMsg, {}, SUCCESS);
  });
  window.addEventListener(PWA_EVENTS.PWA_MOUNT_ERROR, () => {
    Toast(errMsg, {}, ERROR);
  });
  window.addEventListener(PWA_EVENTS.PWA_UPDATE_FOUND, () => {
    Toast(updateMsg, {}, INFO);
  });
});

// mounted
onMounted(() => {
  if (window.ethereum) {
    const name = getInjectedName(window.ethereum);
    const info = {
      rdns: 'com.detected.injectedwallet',
      uuid: uuidv4(),
      name: name,
      icon: getInjectedIcon(name)
    };
    const provider = window.ethereum;
    storeEIP6963Wallet({ info, provider });
  }
  // epi6963 listener
  window.addEventListener('eip6963:announceProvider', e => {
    storeEIP6963Wallet(e.detail);
  });
  EventBus.$on('swapTxBroadcasted', hash => {
    const id = network.type.name;
    trackSwapAmplitude(SWAP.BROADCASTED, { hash: hash, network: id });
  });
  EventBus.$on('swapTxReceivedReceipt', hash => {
    const id = network.type.name;
    trackSwapAmplitude(SWAP.RECEIPT, {
      hash: hash,
      network: id,
      wallet: identifier
    });
  });
  EventBus.$on('swapTxFailed', hash => {
    const id = network.type.name;
    const passedHash = hash === '0x' ? 'no hash' : hash;
    trackSwapAmplitude(SWAP.FAILED, { hash: passedHash, network: id });
  });
  EventBus.$on('swapTxNotBroadcastedFailed', () => {
    trackSwapAmplitude(SWAP.NOT_BROADCASTED);
  });
  EventBus.$on(BUYSELL_EVENT, arg => {
    if (!network.type.canBuy) {
      Toast(
        'Unsupported network to buy. Please switch network to ETH, MATIC, or BNB to buy.',
        {},
        WARNING
      );
      return;
    }
    openBuy(arg);
  });
  footerHideIntercom();
  logMessage();
  setOnlineStatus(window.navigator.onLine);
  if (window.navigator.onLine) {
    setCurrency(preferredCurrency);
    updateArticles({
      timestamp: timestamp,
      articleList: articleList
    });
  }
  // Window events to watch out if the online status changes
  window.addEventListener('offline', () => {
    setOnlineStatus(false);
  });
  window.addEventListener('online', () => {
    setOnlineStatus(true);
    setCurrency(preferredCurrency);
  });
  if (!isMigrated) {
    // addressBook is the old one that resides in custom store
    setAddressBook(addressBook);
    setMigrated(true);
  }

  // Close modal with 'esc' key
  document.addEventListener('keydown', e => {
    if (e.keyCode === 27) {
      buySellOpen.value = false;
    }
  });
});

// beforeDestroy
onBeforeUnmount(() => {
  EventBus.$off(BUYSELL_EVENT);
  EventBus.$off('swapTxBroadcasted');
  EventBus.$off('swapTxReceivedReceipt');
  EventBus.$off('swapTxFailed');
  EventBus.$off('swapTxNotBroadcastedFailed');
  document.removeEventListener('visibilitychange');
  window.removeEventListener('mouseout');
  window.removeEventListener('eip6963:announceProvider');
});

// methods
const openBuy = arg => {
  trackBuySell(BUY_SELL.OPEN_BUY_SELL_MODAL, {
    module: arg[0],
    path: arg[1]
  });
  buySellOpen.value = true;
};
const logMessage = () => {
  /* eslint-disable no-console */
  console.log(
    '%cWhoa whoa whoa!',
    'font-weight: bold',
    '\n\nThis feature is intended only for developers.  Using it without knowing exactly what you are doing can expose your wallet keys and lead to the loss of your funds.',
    '\n\nOn the other hand, if you are a developer and do know what you’re doing, MEW is hiring and we probably want to talk to you. Send us an email at careers@myetherwallet.com with the subject line: I am a software developer.'
  );
  /* eslint-enable no-console */
};
// Hide intercom button when users reach the footer or bottom of screen
const footerHideIntercom = () => {
  window.onscroll = function () {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      window.Intercom('update', {
        hide_default_launcher: true
      });
    } else {
      window.Intercom('update', {
        hide_default_launcher: false
      });
    }
  };
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalStyles.scss';
@import '@/assets/styles/GlobalComponents.scss';
</style>
