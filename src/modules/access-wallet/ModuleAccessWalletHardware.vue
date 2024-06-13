<template>
  <!--
=====================================================================================
  Overlay - access using hardware
=====================================================================================
-->
  <mew-overlay
    :footer="{
      text: step === 1 ? 'Need help? Read about' : 'Need help? Read',
      linkTitle: footerLink.title,
      link: footerLink.url
    }"
    :show-overlay="open"
    :title="title"
    :back="showBack ? null : back"
    :close="overlayClose"
    content-size="xlarge"
  >
    <div
      v-if="step === 1"
      :class="[
        'pa-5 mb-4 full-width text-center rounded subtitle-container',
        $vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? 'mt-3' : ''
      ]"
    >
      <span class="full-width"
        >The highest standard of security in the crypto space.
        <router-link to="/buy-hardware">
          Get a Hardware Wallet today
        </router-link>
      </span>
    </div>
    <!--
        =====================================================================================
        Step 1: Select hardware wallet
        =====================================================================================
        -->
    <div v-if="step === 1">
      <!--
      =====================================================================================
        Different hardware instances
      =====================================================================================
      -->
      <v-row dense no-gutters justify="start">
        <v-col
          v-for="button in buttons"
          :key="button.label"
          class="button-container full-width pa-1"
          cols="12"
          sm="6"
        >
          <mew-button
            has-full-width
            style="height: 90px"
            color-theme="greyMedium"
            btn-style="outline"
            @click.native="
              () => {
                button.fn();
                button.bluetooth && !bluetooth
                  ? (bluetoothModal = true)
                  : setWalletInstance(button);
              }
            "
          >
            <div class="text-left d-flex align-center" style="width: 100%">
              <img width="40" class="mr-4" :src="button.icon" />
              <div class="mew-heading-3 textDark--text">
                {{ button.label }}
              </div>
            </div>
          </mew-button>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="bluetoothModal" persistent max-width="500">
      <v-sheet color="white" class="pa-5">
        <h2 class="mb-5 text-center">Bluetooth Required</h2>
        <v-list>
          <h3>Supported Browsers</h3>
          <v-list-item v-for="(browser, i) in supportedBrowsers" :key="i">
            <v-list-item-content>
              <v-list-item-title>
                {{ browser }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <h4 class="mb-5">* Remember to enable bluetooth on your device</h4>
        <h3 class="mb-5 text-center">Enable bluetooth on supported browsers</h3>
        <v-expansion-panels
          v-for="(browser, i) in enableBluetooth"
          :key="i"
          class="mt-1"
          accordion
        >
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ browser.title }}
            </v-expansion-panel-header>
            <v-expansion-panel-content
              v-for="(direction, browserIndex) in browser.direction"
              :key="browserIndex"
            >
              <h4 class="mb-3">{{ direction.title }}</h4>
              <ul v-for="(s, index) in direction.steps" :key="index">
                <li v-if="s.length" class="mb-1">
                  {{ s }}
                </li>
                <li v-if="!s.length" class="mb-1">
                  <a :href="s.link" target="_blank">Learn More</a>
                </li>
              </ul>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <div class="text-center">
          <mew-button
            class="mt-6"
            title="Close"
            btn-size="xlarge"
            btn-style="outline"
            @click.native="bluetoothModal = false"
          />
        </div>
      </v-sheet>
    </v-dialog>
    <!--
            =====================================================================================
              Step 2: Start Access to Selected Hardware Wallet
            =====================================================================================
            -->
    <div v-if="step <= walletInitialized" class="full-width mt-4 mt-lg-0">
      <!--
        =====================================================================================
          Bitbox2
        =====================================================================================
        -->
      <access-wallet-bitbox
        v-if="onBitbox2"
        :paths="paths"
        :set-path="setPath"
        :hw-wallet-instance="hwWalletInstance"
        :unlock="bitbox02Unlock"
        :device-not-paired="bitBox2NotPaired"
        :device-connected="bitBox2Connected"
        :device-unpaired="bitBox2Unpaired"
        :device-pairing-code="bitBox2PairingCode"
        :device-confirmed="bitBox2Confirmed"
        :device-initialized="bitBox2Initialized"
      />
      <!--
        =====================================================================================
          Keepkey
        =====================================================================================
        -->
      <access-wallet-keepkey
        v-if="onKeepkey"
        :paths="paths"
        :selected-path="selectedPath"
        :handler-loaded="loaded"
        :set-path="setPath"
      />
      <!--
        =====================================================================================
          Cool Wallet
        =====================================================================================
        -->
      <access-wallet-cool-wallet
        v-if="onCoolWallet"
        :cool-wallet-unlock="coolWalletUnlock"
        :password-error="passwordError"
        @password="setPassword"
      />
      <!--
        =====================================================================================
          Ledger
        =====================================================================================
        -->
      <access-wallet-ledger
        v-if="onLedger || onLedgerX"
        :ledger-unlock="nextStep"
        :ledger-apps="ledgerApps"
        :paths="paths"
        :selected-path="selectedPath"
        :set-path="setPath"
        @setBluetoothLedgerUnlock="setBluetoothLedgerUnlock"
      />

      <!--
        =====================================================================================
          Trezor
        =====================================================================================
        -->
      <div v-if="onTrezor">
        <access-wallet-trezor :trezor-unlock="trezorUnlock" :reset="reset" />
      </div>
    </div>
    <!--
      =====================================================================================
        Step 3: Select Address and Network | (If Applicable)
      =====================================================================================
      -->
    <!--
    =====================================================================================
    Network Address Step
    =====================================================================================
    -->
    <access-wallet-address-network
      v-if="step > walletInitialized"
      :back="null"
      :hide-path-selection="onKeepkey || onLedger"
      :disable-custom-paths="onLedger"
      :handler-wallet="hwWalletInstance"
      :selected-path="selectedPath"
      :paths="paths"
      :hide-networks="switchAddress"
      @unlock="setHardwareWallet"
      @setPath="setPath"
    />
  </mew-overlay>
</template>

<script setup>
import {
  defineAsyncComponent,
  defineProps,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue';
import { isEmpty, isObject } from 'lodash';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

import appPaths from './hardware/handlers/hardwares/ledger/appPaths.js';
import allPaths from '@/modules/access-wallet/hardware/handlers/bip44';
import wallets from '@/modules/access-wallet/hardware/handlers/configs/configWallets';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { EventBus } from '@/core/plugins/eventBus.js';
import { ethereum as ethereumPath } from '@/modules/access-wallet/hardware/handlers/configs/configPaths.js';

import { ACCESS_WALLET } from '@/modules/analytics-opt-in/handlers/configs/events';
import { useAmplitude } from '@/core/composables/amplitude.js';
import { useWalletStore } from '@/core/store/wallet';

import { useRouter } from 'vue-router/composables.js';

const AccessWalletKeepkey = defineAsyncComponent(() =>
  import('./hardware/components/AccessWalletKeepkey')
);
const AccessWalletCoolWallet = defineAsyncComponent(() =>
  import('./hardware/components/AccessWalletCoolWallet')
);
const AccessWalletTrezor = defineAsyncComponent(() =>
  import('./hardware/components/AccessWalletTrezor.vue')
);
const AccessWalletLedger = defineAsyncComponent(() =>
  import('./hardware/components/AccessWalletLedger.vue')
);
const AccessWalletBitbox = defineAsyncComponent(() =>
  import('./hardware/components/AccessWalletBitbox')
);
const AccessWalletAddressNetwork = defineAsyncComponent(() =>
  import('@/modules/access-wallet/common/components/AccessWalletAddressNetwork')
);

// injections/use
const { trackAccessWalletAmplitude } = useAmplitude();
const { identifier, ledgerBLE, setWallet, setLedgerBluetooth } =
  useWalletStore();
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
  switchAddress: {
    type: Boolean,
    default: false
  }
});

// data
const enableBluetooth = [
  {
    title: 'Chrome',
    direction: [
      {
        title: 'Enable experimental flags',
        steps: [
          'chrome://flags/#enable-web-bluetooth',
          'chrome://flags/#enable-web-bluetooth-new-permissions-backend',
          'chrome://flags/#enable-experimental-web-platform-features'
        ]
      },
      {
        title: 'Official browser directions',
        steps: [
          {
            link: 'https://support.google.com/chrome/answer/6362090?hl=en&co=GENIE.Platform%3DDesktop'
          }
        ]
      }
    ]
  },
  {
    title: 'Opera',
    direction: [
      {
        title: 'Enable experimental flags',
        steps: [
          'opera://flags/#enable-web-bluetooth-new-permissions-backend',
          'opera://flags/#enable-experimental-web-platform-features'
        ]
      }
    ]
  },
  {
    title: 'Edge',
    direction: [
      {
        title: 'Official browser directions',
        steps: [
          {
            link: 'https://support.microsoft.com/en-us/microsoft-edge/connect-a-website-to-a-bluetooth-or-usb-device-in-microsoft-edge-107ba8a4-60aa-0fd3-2d26-afd63d0964f4'
          }
        ]
      }
    ]
  }
];
const ledgerApps = appPaths.map(item => {
  return {
    name: item.network.name_long,
    value: item.network.name,
    img: item.network.icon
  };
});
const supportedBrowsers = ['Chrome', 'Edge', 'Opera'];

const bluetooth = ref(false);
const bluetoothModal = ref(false);
const step = ref(1);
const hwWalletInstance = ref({});
const ledgerApp = ref({});
const selectedPath = ref({
  name: ethereumPath.label,
  value: ethereumPath.path
});
const walletType = ref('');
const password = ref('');
const loaded = ref(false);
const ledgerConnected = ref(false);
const passwordError = ref(false);
const ledgerBluetooth = ref(false);

// computed
const walletUnlock = computed(() => ({
  [WALLET_TYPES.LEDGER]: trezorUnlock,
  [WALLET_TYPES.TREZOR]: bitbox02Unlock,
  [WALLET_TYPES.COOL_WALLET]: coolWalletUnlock,
  [WALLET_TYPES.BITBOX2]: keepkeyUnlock,
  [WALLET_TYPES.KEEPKEY]: ledgerUnlock
}));

const buttons = computed(() => {
  return [
    {
      label: 'Ledger',
      icon: require('@/assets/images/icons/hardware-wallets/Ledger-Nano-X-Label-Icon.svg'),
      type: WALLET_TYPES.LEDGER,
      fn: () => {
        trackAccessWalletAmplitude(ACCESS_WALLET.HW_LEDGER_CLICKED);
      }
    },
    {
      label: 'Trezor',
      icon: require('@/assets/images/icons/hardware-wallets/icon-trezor.svg'),
      type: WALLET_TYPES.TREZOR,
      fn: () => {
        trackAccessWalletAmplitude(ACCESS_WALLET.HW_TREZOR_CLICKED);
      }
    },
    {
      label: 'KeepKey',
      icon: require('@/assets/images/icons/hardware-wallets/icon-keepkey.svg'),
      type: WALLET_TYPES.KEEPKEY,
      fn: () => {
        trackAccessWalletAmplitude(ACCESS_WALLET.HW_KEEPKEY_CLICKED);
      }
    },
    {
      label: 'BitBox02',
      icon: require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg'),
      type: WALLET_TYPES.BITBOX2,
      fn: () => {
        trackAccessWalletAmplitude(ACCESS_WALLET.HW_BITBOX02_CLICKED);
      }
    },
    {
      label: 'CoolWallet',
      icon: require('@/assets/images/icons/hardware-wallets/icon-coolwallet.svg'),
      type: WALLET_TYPES.COOL_WALLET,
      fn: () => {
        trackAccessWalletAmplitude(ACCESS_WALLET.HW_COOL_WALLET_CLICKED);
      },
      bluetooth: true
    }
  ];
});
const walletInitialized = computed(() => {
  return wallets[walletType.value] ? wallets[walletType.value]?.when : 1;
});
/**
 * Footer links to display beneath container
 * TODO: get link urls from Russ
 */
const footerLink = computed(() => {
  // Commented for now as the new articles aren't available yet
  // if (onKeepkey) {
  //   return {
  //     title: 'Using a KeepKey Hardware wallet with MEW',
  //     url: 'https://kb.myetherwallet.com/en/hardware-wallets/using-keepkey-with-mew/'
  //   };
  // } else if (onCoolWalletS) {
  //   return {
  //     title: 'Using a CoolWallet S Hardware Wallet with MEW',
  //     url: 'https://kb.myetherwallet.com/en/hardware-wallets/using-coolwallet-with-mew/'
  //   };
  // }
  // if (onLedger) {
  //   return {
  //     title: 'Using a Ledger Hardware wallet with MEW',
  //     url: 'https://kb.myetherwallet.com/en/hardware-wallets/using-ledger-with-mew/'
  //   };
  // }
  // if (onTrezor) {
  //   return {
  //     title: 'Using a Trezor Hardware wallet with MEW',
  //     url: 'https://kb.myetherwallet.com/en/hardware-wallets/using-trezor-with-mew/'
  //   };
  // }
  return {
    title: 'Hardware Wallets',
    url: 'https://help.myetherwallet.com/en/collections/3043244-access-wallet'
  };
});
const showBack = computed(() => {
  if (props.switchAddress) {
    return step.value === 2;
  }

  return step.value === 1;
});
/**
 * On Bitbox2
 */
const onBitbox2 = computed(() => {
  if (walletType.value === WALLET_TYPES.BITBOX2) {
    trackAccessWalletAmplitude(ACCESS_WALLET.HW_BITBOX02_SHOWN);
    return true;
  }
  return false;
});
/**
 * On Ledger
 */
const onLedger = computed(() => {
  if (walletType.value === WALLET_TYPES.LEDGER) {
    trackAccessWalletAmplitude(ACCESS_WALLET.HW_LEDGER_SHOWN);
    return true;
  }
  return false;
});
/**
 * On Ledger X
 */
const onLedgerX = computed(() => {
  if (walletType.value === WALLET_TYPES.LEDGER) {
    trackAccessWalletAmplitude(ACCESS_WALLET.HW_LEDGER_SHOWN);
    return true;
  }
  return false;
});
/**
 * On CoolWallet
 */
const onCoolWallet = computed(() => {
  if (
    walletType.value === WALLET_TYPES.COOL_WALLET &&
    isEmpty(hwWalletInstance.value)
  ) {
    trackAccessWalletAmplitude(ACCESS_WALLET.HW_COOL_WALLET_SHOWN);
    return true;
  }
  return false;
});
/**
 * On Keepkey
 */
const onKeepkey = computed(() => {
  if (walletType.value === WALLET_TYPES.KEEPKEY) {
    trackAccessWalletAmplitude(ACCESS_WALLET.HW_KEEPKEY_SHOWN);
    return true;
  }
  return false;
});
/**
 * On Trezor
 */
const onTrezor = computed(() => {
  if (walletType.value === WALLET_TYPES.TREZOR) {
    trackAccessWalletAmplitude(ACCESS_WALLET.HW_TREZOR_SHOWN);
    return true;
  }
  return false;
});
/**
 * On Paths step
 */
const paths = computed(() => {
  const newArr = [];
  if (walletType.value === WALLET_TYPES.LEDGER) {
    if (ledgerApp.value !== null) {
      const found = appPaths.find(item => {
        return item.network.name_long === ledgerApp.value.name;
      });
      const path = found ? found.paths : appPaths[0].paths;
      return path.map(item => {
        return {
          name: item.label,
          value: item.path
        };
      });
    }

    appPaths[0].paths.forEach(item => {
      newArr.push({
        name: item.label,
        value: item.path
      });
    });
  }
  if (wallets[walletType.value] && wallets[walletType.value].hasPaths) {
    allPaths[walletType.value].forEach(item => {
      newArr.push({
        name: item.label,
        value: item.path
      });
    });
  }
  return newArr;
});
/**
 * Overlay title
 */
const title = computed(() => {
  if (props.switchAddress) return 'Switch Address';
  if (step.value > walletInitialized.value) {
    return 'Select Network and Address';
  } else if (step.value === 1) {
    return 'Select a hardware wallet';
  }
  if (onBitbox2.value) return bitbox2Titles.value;
  return walletType.value
    ? wallets[walletType.value].title
    : 'Select a hardware wallet';
});
const bitBox2NotPaired = computed(() => {
  return (
    isEmpty(hwWalletInstance.value) ||
    (!isEmpty(hwWalletInstance.value) && !hwWalletInstance.value?.status)
  );
});
const bitBox2Connected = computed(() => {
  return (
    !bitBox2NotPaired.value && hwWalletInstance.value?.status === 'connected'
  );
});
const bitBox2Unpaired = computed(() => {
  return (
    !bitBox2NotPaired.value && hwWalletInstance.value?.status === 'unpaired'
  );
});
const bitBox2Initialized = computed(() => {
  return (
    !bitBox2NotPaired.value && hwWalletInstance.value?.status === 'initialized'
  );
});
const bitBox2PairingCode = computed(() => {
  return !bitBox2NotPaired.value ? hwWalletInstance.value?.pairingCode : '';
});
const bitBox2Confirmed = computed(() => {
  return !bitBox2NotPaired.value
    ? hwWalletInstance.value?.pairingConfirmed
    : false;
});
const bitbox2Titles = computed(() => {
  if (bitBox2Connected.value) return 'Enter BitBox02 password';
  if (bitBox2Unpaired.value) return 'Confirm pairing code';
  if (bitBox2Initialized.value)
    return 'BitBox02 succesfully initialized. Loading wallet';
  return walletType.value ? wallets[walletType.value].title : '';
});

// watch
watch(
  () => selectedPath.value,
  () => {
    /**
     * only call this when hwWalletInstance is not empty (ledger will error out)
     * and when walletType has been selected (closing modal will error out)
     */
    if (walletType.value && !isEmpty(hwWalletInstance.value)) {
      hwWalletInstance.value = {};
      walletUnlock.value[walletType.value]();
    }
  },
  { deep: true }
);
watch(
  () => props.open,
  newVal => {
    if (newVal && props.switchAddress) setupSwitchAddress();
  }
);

onMounted(async () => {
  /**
   * errors and resets for disconnect of ble
   */
  EventBus.$on('bleDisconnect', () => {
    reset();
  });

  try {
    const { bluetooth: localBluetooth } = navigator;
    if (!localBluetooth) return (bluetooth.value = false);
    bluetooth.value = await localBluetooth.getAvailability();
  } catch (e) {
    trackAccessWalletAmplitude(ACCESS_WALLET.HW_FAILED, {
      error: e.message
    });
    Toast(e, {}, ERROR);
  }
});

// before destroy
onBeforeUnmount(() => {
  EventBus.$off('bleDisconnect');
});

// methods
/**
 * Resets the Data
 */
const reset = () => {
  step.value = 1;
  hwWalletInstance.value = {};
  selectedPath.value = paths.value[0];
  password.value = '';
  walletType.value = '';
  ledgerConnected.value = false;
  ledgerBluetooth.value = false;
};
/**
 * Sets up switch address
 */
const setupSwitchAddress = () => {
  walletType.value = identifier.value;
  if (identifier.value === WALLET_TYPES.LEDGER) {
    ledgerBluetooth.value = ledgerBLE.value;
  }
  nextStep();
};
/**
 * Overlay Action: Back
 * if on keepkey step 3, it will return to step 1 so it will reset everything
 */
const back = () => {
  if (step.value > 0) {
    if (step.value === 1) {
      reset();
    } else if (step.value === 2) {
      step.value = 1;
      walletType.value = '';
    } else {
      hwWalletInstance.value = {};
      if (onLedger.value || onLedgerX.value) {
        step.value = 2;
        //this[`${walletType}Unlock`]();
      } else {
        walletType.value = '';
        step.value = 1;
      }
    }
  } else {
    props.close('showHardware');
  }
};
const overlayClose = () => {
  reset();
  props.close('showHardware');
};
const trezorClose = () => {
  step.value = 2;
  walletType.value = WALLET_TYPES.TREZOR;
};
const setWalletInstance = btnObj => {
  walletType.value = btnObj.type;
  nextStep();
};
const nextStep = () => {
  if (walletType.value) {
    step.value += 1;
    if (
      step.value === 2 &&
      (onTrezor.value || onLedger.value || onLedgerX.value)
    ) {
      selectedPath.value = paths.value[0];
    }
    if (step.value === walletInitialized.value) {
      if (onCoolWallet.value || onBitbox2.value) return;
      walletUnlock.value[walletType.value]();
    }
  }
};
const setBluetoothLedgerUnlock = () => {
  ledgerBluetooth.value = true;
  nextStep();
};
const trezorUnlock = () => {
  unlockPathOnly();
};
const bitbox02Unlock = () => {
  unlockPathOnly();
};
const coolWalletUnlock = () => {
  unlockPathAndPassword(null, password.value);
};
const keepkeyUnlock = () => {
  unlockPathOnly();
};
const ledgerUnlock = () => {
  if (ledgerBluetooth.value) {
    bluetoothLedgerUnlock();
  } else {
    unlockPathOnly();
  }
};
const bluetoothLedgerUnlock = () => {
  unlockPathOnly();
};
/**
 * Unlock only the path step
 */
const unlockPathOnly = () => {
  const path = isObject(selectedPath.value)
    ? selectedPath.value.hasOwnProperty('value')
      ? selectedPath.value?.value
      : selectedPath.value
    : paths.value[0].value;
  wallets[walletType.value]
    .create(path.value, ledgerBluetooth.value, ledgerApp.value)
    .then(_hwWallet => {
      try {
        loaded.value = true;
        if (onLedgerX.value || onLedger.value) nextStep();
        if ((onTrezor.value || onKeepkey.value) && step.value === 2)
          step.value++;
        if (onBitbox2.value) {
          hwWalletInstance.value = _hwWallet;
          if (!hwWalletInstance.value) {
            trackAccessWalletAmplitude(ACCESS_WALLET.HW_FAILED, {
              error: 'bitboxInstanceError'
            });
            wallets[walletType.value].create.errorHandler(
              'bitboxInstanceError'
            );
            return;
          }
          hwWalletInstance.value
            .init()
            .then(() => {
              nextStep();
            })
            .catch(e => {
              trackAccessWalletAmplitude(ACCESS_WALLET.HW_FAILED, {
                error: e.message
              });
              wallets[walletType.value]?.create.errorHandler(e);
              if (e.message === 'Error: Pairing rejected') {
                reset();
              }
            });
        } else {
          hwWalletInstance.value = _hwWallet;
        }
      } catch (err) {
        trackAccessWalletAmplitude(ACCESS_WALLET.HW_FAILED, {
          error: err.message
        });
        wallets[walletType.value].create.errorHandler(err);
      }
    })
    .catch(err => {
      trackAccessWalletAmplitude(ACCESS_WALLET.HW_FAILED, {
        error: err.message
      });
      if (onLedger.value || onLedgerX.value) step.value--;
      if (wallets[walletType.value]) {
        wallets[walletType.value].create.errorHandler(err);
      } else {
        Toast(err, {}, ERROR);
      }
      onTrezor.value ? trezorClose : reset();
    });
};
/**
 * Unlock the path and password step
 */
const unlockPathAndPassword = (path, password) => {
  wallets[walletType.value]
    .create(path, password)
    .then(_hwWallet => {
      hwWalletInstance.value = _hwWallet;
      step.value++;
    })
    .catch(e => {
      trackAccessWalletAmplitude(ACCESS_WALLET.HW_FAILED, {
        error: e.message
      });
      if (wallets[walletType.value]) {
        if (
          e.message === 'Wrong Password' &&
          walletType.value === WALLET_TYPES.COOL_WALLET
        ) {
          passwordError.value = true;
        } else {
          wallets[walletType.value].create.errorHandler(e);
        }
      } else {
        Toast(e, {}, ERROR);
      }
      if (e.message !== 'Wrong Password') {
        reset();
      }
    });
};
/**
 * Sets Path
 */
const setPath = obj => {
  selectedPath.value = obj;
};
const trackWallet = id => {
  switch (id) {
    case WALLET_TYPES.LEDGER:
      trackAccessWalletAmplitude(ACCESS_WALLET.HW_LEDGER_CONNECTED);
      break;
    case WALLET_TYPES.TREZOR:
      trackAccessWalletAmplitude(ACCESS_WALLET.HW_TREZOR_CONNECTED);
      break;
    case WALLET_TYPES.COOL_WALLET_PRO:
    case WALLET_TYPES.COOL_WALLET_S:
      trackAccessWalletAmplitude(ACCESS_WALLET.HW_COOL_WALLET_CONNECTED);
      break;
    case WALLET_TYPES.BITBOX2:
      trackAccessWalletAmplitude(ACCESS_WALLET.HW_BITBOX02_CONNECTED);
      break;
    case WALLET_TYPES.KEEPKEY:
      trackAccessWalletAmplitude(ACCESS_WALLET.HW_KEEPKEY_CONNECTED);
      break;
    default:
      break;
  }
};
/**
 * Set the selected wallet
 */
const setHardwareWallet = wallet => {
  try {
    setWallet([wallet]);
    if (!props.switchAddress) {
      if (wallet.identifier.value === WALLET_TYPES.LEDGER) {
        setLedgerBluetooth(ledgerBluetooth);
      }
      trackWallet(wallet.identifier.value);
      router.push({ name: ROUTES_WALLET.DASHBOARD.NAME });
    } else {
      reset();
      props.close();
    }
  } catch (e) {
    reset();
    Toast(e, {}, ERROR);
  }
};
/**
 * Sets Password
 */
const setPassword = str => {
  password.value = str;
  passwordError.value = false;
};
</script>

<style lang="scss" scoped>
.subtitle-container {
  background-color: rgba(109, 137, 166, 0.06);
}
.button-container {
  height: 100px;
}

@media screen and (min-width: 800px) {
  .expand-width {
    min-width: 740px;
  }
}
</style>
