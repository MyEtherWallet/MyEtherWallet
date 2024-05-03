<template>
  <div>
    <!--
    =====================================================================================
        Overlay - create using software
    =====================================================================================
    -->
    <mew-overlay
      :footer="footer"
      :show-overlay="open"
      :title="typeTitle"
      :close="close"
      :back="isOverview ? null : goBack"
      content-size="large"
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

<script setup>
import {
  defineAsyncComponent,
  defineProps,
  ref,
  computed,
  onMounted,
  onBeforeMount
} from 'vue';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import handlerCreateWallet from './handlers/handlerCreateWallet';
import { SOFTWARE_WALLET_TYPES } from '../access-wallet/software/handlers/helpers';
import { CREATE_WALLET } from '@/modules/analytics-opt-in/handlers/configs/events.js';
import { useAmplitude } from '@/core/composables/amplitude';
import { useWalletStore } from '@/core/store/wallet';

import { useRouter } from 'vue-router/composables';

const CreateWalletSoftwareOverview = defineAsyncComponent(() =>
  import('./components/CreateWalletSoftwareOverview')
);
const CreateWalletKeystore = defineAsyncComponent(() =>
  import('./components/CreateWalletKeystore')
);
const CreateWalletMnemonicPhrase = defineAsyncComponent(() =>
  import('./components/CreateWalletMnemonicPhrase')
);

// injections/use
const { trackCreateWalletAmplitude } = useAmplitude();
const { isOfflineApp } = useWalletStore();
const router = useRouter();

// props
const props = defineProps({
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
});

// data
const types = WALLET_TYPES;
const walletHandler = ref({});
const footer = ref({
  text: 'Need help?',
  linkTitle: 'Contact support',
  link: 'mailto:support@myetherwallet.com'
});

// computed
const isOverview = computed(() => {
  return (
    props.walletType !== types.MNEMONIC && props.walletType !== types.KEYSTORE
  );
});
const isKeystore = computed(() => {
  return props.walletType === types.KEYSTORE;
});
const isMnemonic = computed(() => {
  return props.walletType === types.MNEMONIC;
});
/**
 * @returns correct title of the overlay according to the wallet type selected
 */
const typeTitle = computed(() => {
  return this.walletType === this.types.MNEMONIC
    ? 'Create Wallet with Mnemonic Phrase'
    : this.walletType === this.types.KEYSTORE
    ? 'Create Wallet with Keystore File'
    : 'Create wallet using software';
});

onMounted(() => {
  if (isOfflineApp) {
    footer.value = {
      text: 'Need help? Email us at support@myetherwallet.com',
      linkTitle: '',
      link: ''
    };
  }
  walletHandler.value = new handlerCreateWallet();
});

onBeforeMount(() => {
  walletHandler.value = {};
});

// methods

/**
 * Directs user back to software overview
 * Pushes new route query param
 * Used in overlay back button
 */
const goBack = () => {
  /**
   * Make back button to go back to previous url
   */
  router.go(-1);

  /*
      if (this.isOverview) {
        try {
          this.$router.go(-1);
        } catch (e) {
          Toast(e, {}, ERROR);
        }
      }
      */
};
/**
 * Sets a wallet type and the step according to the provided wallet type
 * This method is used in create overview component
 * @type - must be one of the this.types or an empty string (this will reset step to 0)
 */
const setType = newType => {
  try {
    router.push({
      query: { type: newType }
    });
    let type = '';
    if (newType === SOFTWARE_WALLET_TYPES.KEYSTORE) {
      type = CREATE_WALLET.KEYSTORE_FILE_CLICKED;
    } else if (newType === SOFTWARE_WALLET_TYPES.MNEMONIC) {
      type = CREATE_WALLET.MNEMONIC_PHRASE_CLICKED;
    }
    trackCreateWalletAmplitude(type);
  } catch (e) {
    Toast(e, {}, ERROR);
  }
};
</script>
