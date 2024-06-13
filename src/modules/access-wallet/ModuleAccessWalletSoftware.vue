<template class="AccessSoftwareWallet">
  <!--
  =====================================================================================
    Overlay - access using software
  =====================================================================================
  -->
  <mew-overlay
    :footer="footer"
    content-size="large"
    :show-overlay="open"
    :title="title"
    :back="showBackBtn && !switchAddress ? accessBack : null"
    :close="close"
  >
    <!--
    =====================================================================================
      Overview: prompts user to select options
    =====================================================================================
    -->
    <div
      v-if="walletType === types.OVERVIEW"
      style="max-width: 650px; width: 100%"
      class="mx-auto pt-5"
    >
      <div v-for="(btn, key) in buttons" :key="key" class="mb-5">
        <mew-button
          :class="btn.class"
          has-full-width
          color-theme="greyMedium"
          btn-style="outline"
          style="height: 160px"
          @click.native="btn.fn"
        >
          <div
            class="text-left d-flex align-center justify-space-between px-2"
            style="width: 100%"
          >
            <div class="mew-heading-2 textDark--text">
              {{ btn.label }}
            </div>
            <img width="80" class="mr-4 d-none d-sm-block" :src="btn.icon" />
          </div>
        </mew-button>
      </div>
    </div>
    <!--
    =====================================================================================
      Access With Keystore
    =====================================================================================
    -->
    <access-wallet-keystore
      v-if="walletType === types.KEYSTORE"
      :handler-access-wallet="accessHandler"
      class="mb-6"
      @unlock="unlockWallet"
    />
    <!--
    =====================================================================================
      Access With Mnemonic
    =====================================================================================
    -->
    <access-wallet-mnemonic
      v-if="walletType === types.MNEMONIC"
      :handler-access-wallet="accessHandler"
      :switch-address="switchAddress"
      class="mb-6"
      @unlock="unlockWallet"
    />
    <!--
    =====================================================================================
      Access With PrivateKey
    =====================================================================================
    -->
    <access-wallet-private-key
      v-else-if="walletType === types.PRIVATE_KEY"
      :handler-access-wallet="accessHandler"
      class="mb-6"
      @unlock="unlockWallet"
    />
    <!--
    =====================================================================================
      Warning
    =====================================================================================
    -->
    <mew-warning-sheet
      title="Not Recommended"
      description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users."
      :link-obj="warningSheetObj"
      class="mt-0 mb-0"
    />
  </mew-overlay>
</template>

<script setup>
import { defineProps, ref, computed, watch, onMounted, onUnmounted } from 'vue';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { SOFTWARE_WALLET_TYPES } from './software/handlers/helpers';
import { ROUTES_WALLET } from '../../core/configs/configRoutes';

import handlerAccessWalletSoftware from './software/handlers/handlerAccessWalletSoftware';
import { ACCESS_WALLET } from '../analytics-opt-in/handlers/configs/events';
import { useAmplitude } from '@/core/composables/amplitude';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import { useRouter } from 'vue-router/composables';
import { useArticleStore } from '@/core/store/article';

import AccessWalletKeystore from './software/components/AccessWalletKeystore';
import AccessWalletMnemonic from './software/components/AccessWalletMnemonic';
import AccessWalletPrivateKey from './software/components/AccessWalletPrivateKey';

// injections/use
const { trackAccessWalletAmplitude } = useAmplitude();
const { path } = useExternalStore();
const { identifier, isOfflineApp, setWallet } = useWalletStore();
const { getArticle } = useArticleStore();
const router = useRouter();

// props
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  close: {
    type: Function,
    default: () => {}
  },
  walletType: {
    type: String,
    default: ''
  },
  switchAddress: {
    type: Boolean,
    default: false
  }
});

// data
const type = ref('');
const types = SOFTWARE_WALLET_TYPES;
const warningSheetObj = ref({
  title: 'Learn More',
  url: ''
});
const buttons = [
  /* Keystore Button */
  {
    label: 'Keystore',
    icon: require('@/assets/images/icons/icon-keystore-file.svg'),
    fn: () => {
      setType(SOFTWARE_WALLET_TYPES.KEYSTORE);
    }
  },
  /* Mnemonic */
  {
    label: 'Mnemonic Phrase',
    icon: require('@/assets/images/icons/icon-mnemonic.svg'),
    fn: () => {
      setType(SOFTWARE_WALLET_TYPES.MNEMONIC);
    }
  },
  /* Private Key */
  {
    label: 'Private Key',
    icon: require('@/assets/images/icons/icon-private-key-grey.png'),
    class: 'AccessPrivateKeyWallet',
    fn: () => {
      if (process.env.VUE_APP_PRIV_KEY) {
        accessHandler.value.unlockPrivateKeyWallet(
          process.env.VUE_APP_PRIV_KEY
        );
        unlockWallet();
      } else {
        setType(SOFTWARE_WALLET_TYPES.PRIVATE_KEY);
      }
    }
  }
];
const accessHandler = ref({});
const footer = ref({
  text: 'Need help?',
  linkTitle: 'Contact support',
  link: 'mailto:support@myetherwallet.com'
});

// computed
/**
 * @returns if the back button on overlay should be displayed
 */
const showBackBtn = computed(() => {
  return props.walletType !== SOFTWARE_WALLET_TYPES.OVERVIEW;
});
/**
 * @returns correct title of the overlay according to the wallet type selected
 */
const title = computed(() => {
  if (props.switchAddress) return 'Switch Address';
  switch (props.walletType) {
    case SOFTWARE_WALLET_TYPES.KEYSTORE:
      return 'Access Wallet with Keystore File';
    case SOFTWARE_WALLET_TYPES.MNEMONIC:
      return 'Access Wallet with Mnemonic Phrase';
    case SOFTWARE_WALLET_TYPES.PRIVATE_KEY:
      return 'Access Wallet with Private Key';
    default:
      return 'Select Software Wallet';
  }
});

// watch
watch(
  () => open,
  newVal => {
    if (identifier.value && props.switchAddress && newVal) {
      setType(identifier.value);
    }
  }
);

// mounted
onMounted(() => {
  accessHandler.value = new handlerAccessWalletSoftware();
  if (isOfflineApp.value) {
    footer.value = {
      text: 'Need help? Email us at support@myetherwallet.com',
      linkTitle: '',
      link: ''
    };
    warningSheetObj.value = {};
  } else {
    warningSheetObj.value.url = getArticle('not-rec-when-access-wallet');
  }
});

// destroy
onUnmounted(() => {
  accessHandler.value = {};
});

// methods

/**
 * Sets Wallet and Pushes new route query param
 * Used in overlay back button
 * account is defined in Mnemonic phrase access
 */
const unlockWallet = (account = undefined) => {
  try {
    const wallet = !account ? accessHandler.value.getWalletInstance() : account;
    let type = '';
    if (type === types.KEYSTORE) {
      type = ACCESS_WALLET.KEYSTORE_CONNECTED;
    } else if (type === types.MNEMONIC) {
      type = ACCESS_WALLET.MNEMONIC_CONNECTED;
    } else if (type === types.PRIVATE_KEY) {
      type = ACCESS_WALLET.PRIVATE_KEY_CONNECTED;
    }
    setWallet([wallet]);
    if (props.switchAddress) {
      close();
      return;
    }
    trackAccessWalletAmplitude(type);
    if (path.value !== '') {
      router.push({ path: path.value });
    } else {
      const name = isOfflineApp.value
        ? ROUTES_WALLET.WALLETS.NAME
        : ROUTES_WALLET.DASHBOARD.NAME;
      router.push({ name: name });
    }
  } catch (e) {
    trackAccessWalletAmplitude(ACCESS_WALLET.ACCESS_FAILED, {
      wallet: type
    });
    Toast(e, {}, ERROR);
  }
};

/**
 * Directs user back to software overview
 * Pushes new route query param
 * Used in overlay back button
 */
const accessBack = () => {
  if (props.walletType !== SOFTWARE_WALLET_TYPES.OVERVIEW) {
    try {
      trackAccessWalletAmplitude(ACCESS_WALLET.SOFTWARE_BACK);
      router.push({
        query: { type: SOFTWARE_WALLET_TYPES.OVERVIEW }
      });
    } catch (e) {
      Toast(e, {}, ERROR);
    }
  }
};

/**
 * Sets a wallet type, pushes new route
 * This method is used in create overview block
 * @type - must be one of the SOFTWARE_WALLET_TYPES
 */
const setType = newType => {
  if (Object.values(SOFTWARE_WALLET_TYPES).includes(newType)) {
    try {
      type.value = newType;
      switch (newType) {
        case SOFTWARE_WALLET_TYPES.KEYSTORE:
          trackAccessWalletAmplitude(ACCESS_WALLET.KEYSTORE_SHOWN);
          break;
        case SOFTWARE_WALLET_TYPES.MNEMONIC:
          trackAccessWalletAmplitude(ACCESS_WALLET.MNEMONIC_SHOWN);
          break;
        case SOFTWARE_WALLET_TYPES.PRIVATE_KEY:
          trackAccessWalletAmplitude(ACCESS_WALLET.PRIVATE_KEY_SHOWN);
          break;
        default:
          break;
      }
      router.push({
        query: { type: newType }
      });
    } catch (e) {
      Toast(e, {}, ERROR);
    }
  } else {
    throw new Error('Not a valid type!');
  }
};
</script>
