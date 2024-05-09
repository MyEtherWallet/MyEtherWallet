<template>
  <div class="component--wallet-card theBalanceCard">
    <div class="mew-card drop-shadow">
      <img :src="addressLink" alt="MEW Card" @load="animateMewCard()" />
    </div>
    <div class="info-container pl-8 pr-5 py-4 text-shadow">
      <div class="d-flex flex-row justify-space-between align-start">
        <div class="balanceMenu">
          <!--
          =====================================================================================
            Address
          =====================================================================================
          -->
          <v-menu offset-y>
            <template #activator="{ on }">
              <div
                class="d-flex align-center cursor--pointer personal-account-container"
                v-on="on"
              >
                <div class="info-container--text font-weight-bold white--text">
                  {{ title }}
                </div>
                <v-icon class="white--text ml-2" small dense>
                  mdi-menu-down
                </v-icon>
              </div>
            </template>
            <v-list width="232px" class="bgWalletBlock">
              <v-list-item
                v-if="!isOfflineApp"
                class="cursor-pointer"
                @click="refresh"
              >
                <v-icon color="textDark" class="mr-3">mdi-refresh</v-icon>
                <v-list-item-title> Refresh Balance</v-list-item-title>
              </v-list-item>
              <v-list-item
                class="cursor-pointer openThePaperWallet"
                @click="openPaperWallet"
              >
                <v-icon color="textDark" class="mr-3">mdi-printer</v-icon>
                <v-list-item-title>View paper wallet</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="isHardware && canDisplayAddress"
                class="cursor-pointer"
                @click="viewAddressOnDevice"
              >
                <mew-icon
                  :icon-name="iconIdentifier"
                  :img-height="24"
                  class="mr-3"
                />
                <v-list-item-title
                  >View address on {{ walletName }}</v-list-item-title
                >
              </v-list-item>
              <v-divider class="mx-5 my-4"></v-divider>
              <v-list-item
                v-if="canSwitch"
                class="cursor-pointer"
                @click="openChangeAddress"
              >
                <v-icon color="textDark" class="mr-3"
                  >mdi-account-box-multiple</v-icon
                >
                <v-list-item-title>Switch Account</v-list-item-title>
              </v-list-item>
              <v-list-item class="cursor-pointer" @click="openLogout">
                <v-icon color="textDark" class="mr-3">mdi-logout</v-icon>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <mew-tooltip hide-icon :text="getChecksumAddressString">
            <template #activatorSlot>
              <div
                class="justify-start d-flex align-center info-container--addr monospace"
              >
                {{ addrFirstSix }}
                <v-icon class="info-container--addr pt-1"
                  >mdi-dots-horizontal</v-icon
                >

                {{ addrlastFour }}
              </div>
            </template>
            <span class="textDark--text">{{ getChecksumAddressString }}</span>
          </mew-tooltip>
        </div>
      </div>
      <!--
      =====================================================================================
        Total Wallet FIAT balance OR if Test network Chain Balance
      =====================================================================================
      -->
      <div
        v-if="!isOfflineApp"
        :class="[
          { 'ml-n5': !isTestNetwork },
          'mew-subtitle text-shadow white--text mt-5 mb-4'
        ]"
      >
        <v-skeleton-loader
          v-if="loadingWalletInfo"
          type="heading"
          class="theme-dark-heading"
        ></v-skeleton-loader>
        <div v-else class="mew-subtitle text-shadow white--text">
          {{ totalWalletBalance }}
          <span
            v-if="isTestNetwork"
            style="padding-left: 2px; font-size: 14px"
            >{{ network.type.currencyName }}</span
          >
        </div>
      </div>
      <div
        class="d-flex justify-space-between align-center"
        :style="isOfflineApp ? 'margin-top:74px' : ''"
      >
        <div v-if="!isOfflineApp" class="justify-start">
          <!--
          =====================================================================================
            Total Wallet chain balance: prensent if not Test network
          =====================================================================================
          -->
          <v-skeleton-loader v-if="loadingWalletInfo" type="text" width="100" />
          <div
            v-else-if="!isTestNetwork"
            class="info-container--text-chain-balance"
          >
            {{ walletChainBalance }} {{ network.type.currencyName }}
          </div>
          <!--
          =====================================================================================
            Total Tokens: present if tokens found
          =====================================================================================
          -->
          <v-skeleton-loader v-if="loadingWalletInfo" type="text" width="100" />
          <div v-else-if="nonChainTokensCount > 0" class="info-container--text">
            and {{ nonChainTokensCount }} Tokens
          </div>
        </div>
        <div class="d-flex justify-end">
          <!--
          =====================================================================================
            QR CODE
          =====================================================================================
          -->
          <v-btn
            class="info-container--action-btn mr-2 px-0 BalanceCardQR"
            fab
            depressed
            @click="open"
          >
            <img
              class="info-container--icon"
              height="18px"
              src="@/assets/images/icons/icon-qr-code.svg"
              alt="qr-code"
            />
          </v-btn>
          <!--
          =====================================================================================
            Copy Button
          =====================================================================================
          -->
          <v-btn
            class="info-container--action-btn px-0"
            depressed
            fab
            @click="copyAddress"
            ><v-icon class="info-container--icon" small color="white">
              mdi-content-copy
            </v-icon></v-btn
          >
        </div>
      </div>
    </div>
    <!--
    =====================================================================================
      Wallet card modals
    =====================================================================================
    -->
    <app-modal
      :show="openQR"
      :close="closeQR"
      :has-buttons="false"
      width="408px"
    >
      <template #dialogBody>
        <app-addr-qr />
      </template>
    </app-modal>
    <module-access-wallet-hardware
      v-if="showHardware"
      :open="showChangeAddress"
      :close="closeChangeAddress"
      :switch-address="instancePath"
    />
    <module-access-wallet-software
      v-else
      :open="showChangeAddress"
      :close="closeChangeAddress"
      :switch-address="instancePath"
      :wallet-type="identifier"
    />

    <mew-popup
      max-width="400px"
      hide-close-btn
      :show="showLogout"
      :title="t('interface.menu.logout')"
      :left-btn="{ text: 'Cancel', method: closeLogout, color: 'basic' }"
      :right-btn="{
        text: 'Log out',
        color: 'error',
        method: onLogout,
        enabled: true
      }"
    />
    <mew-popup
      max-width="515px"
      :show="showVerify"
      :title="verifyAddressTitle"
      :has-buttons="false"
      :has-body-content="true"
      :left-btn="{ text: 'Cancel', method: closeVerify, color: 'basic' }"
    >
      <div>
        <div class="text-center">
          {{ verifyAddressBody }}
        </div>
        <div class="mt-3 verify-popup-border px-12 py-5 text-center">
          <div class="font-weight-bold greenPrimary--text mew-body">
            ACCOUNT ADDRESS
          </div>
          <div class="pt-3 greenPrimary--text mew-body">
            {{ getChecksumAddressString }}
          </div>
        </div>
      </div>
    </mew-popup>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, computed, watch, onMounted } from 'vue';
import anime from 'animejs/lib/anime.es.js';
import clipboardCopy from 'clipboard-copy';
import { isEmpty } from 'lodash';

import { Toast, SUCCESS, ERROR } from '@/modules/toast/handler/handlerToast';
import { toChecksumAddress } from '@/core/helpers/addressUtils';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';

import wallets from './handlers/config';
import WALLET_TYPES from '../access-wallet/common/walletTypes';
import NameResolver from '@/modules/name-resolver/index';
import { EventBus } from '@/core/plugins/eventBus';
import { DASHBOARD } from '../analytics-opt-in/handlers/configs/events';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import { useI18n } from 'vue-i18n-composable';

const ModuleAccessWalletHardware = defineAsyncComponent(() =>
  import('@/modules/access-wallet/ModuleAccessWalletHardware')
);
const ModuleAccessWalletSoftware = defineAsyncComponent(() =>
  import('@/modules/access-wallet/ModuleAccessWalletSoftware')
);

// injections/use
const { trackDashboardAmplitude, trackLogout } = useAmplitude();
const {
  address,
  instance,
  identifier,
  isHardware,
  isOfflineApp,
  loadingWalletInfo,
  tokensList,
  balanceInETH,
  web3,
  removeWallet
} = useWalletStore();
const { totalTokenFiatValue, setTokenAndEthBalance } = useExternalStore();
const { network, isTestNetwork, getFiatValue } = useGlobalStore();
const { t } = useI18n();

// data
const showChangeAddress = ref(false);
const openQR = ref(false);
const showLogout = ref(false);
const showVerify = ref(false);
const resolvedName = ref('');
const nameResolver = ref(null);

// computed
/**
 * verifies whether instance exists before giving path
 */
const instancePath = computed(() => {
  return instance && instance.path ? true : false;
});
/**
 * show default title
 * unless resolved name isn't false
 * returns @string
 */
const title = computed(() => {
  return resolvedName.value
    ? resolvedName.value
    : 'Portfolio Value'.toUpperCase();
});
/**
 * verify address title
 * returns @String
 */
const verifyAddressTitle = computed(() => {
  return `This wallet is accessed with ${walletName.value}`;
});
/**
 * verify address body
 * returns @String
 */
const verifyAddressBody = computed(() => {
  return `To verify, check the address on your ${walletName.value} device & make sure it is the same address as the one shown below.`;
});
/**
 * Shows hardware access or software access
 * returns @Boolean
 */
const showHardware = computed(() => {
  return (
    !isEmpty(instance) && instance?.path && identifier !== WALLET_TYPES.MNEMONIC
  );
});
/**
 * returns checksummed address
 */
const getChecksumAddressString = computed(() => {
  return address ? toChecksumAddress(address) : '';
});
/**
 * checks whether hardware wallet
 * can display address with the device
 *
 * returns @Boolean
 */
const canDisplayAddress = computed(() => {
  return (
    !isEmpty(instance) &&
    instance.hasOwnProperty('displayAddress') &&
    instance.displayAddress
  );
});
/**
 * adds checks for icons that mew-components doesn't have
 * returns @String
 */
const iconIdentifier = computed(() => {
  if (identifier === WALLET_TYPES.BITBOX2) {
    return 'bitbox';
  }
  return identifier;
});
/**
 * checks whether wallet can switch address
 * returns @Boolean
 */
const canSwitch = computed(() => {
  return !isEmpty(instance) && wallets[identifier];
});
/**
 * returns hardware wallet name
 * returns @String
 */
const walletName = computed(() => {
  return !isEmpty(instance) && instance.meta.hasOwnProperty('name')
    ? instance.meta.name
    : '';
});
/**
 * returns token values
 * returns @String
 */
const totalTokenBalance = computed(() => {
  return totalTokenFiatValue;
});
/**
 * returns total value including tokens
 * returns @String
 */
const totalWalletBalance = computed(() => {
  if (!isTestNetwork) {
    const total = totalTokenBalance;
    return getFiatValue(total);
  }
  return walletChainBalance.value;
});
/**
 * returns formatted wallet balance
 * returns @String
 */
const walletChainBalance = computed(() => {
  return `${formatFloatingPointValue(balanceInETH).value}`;
});
/**
 * @returns {string} first 6 letters in the address
 */
const addrFirstSix = computed(() => {
  return address ? address.substring(0, 6) : '';
});
/**
 * @returns {string} lat 4 letters in the address
 */
const addrlastFour = computed(() => {
  return address ? address.substring(address.length - 4, address.length) : '';
});
/**
 * @returns {number} count of non chain tokens
 */
const nonChainTokensCount = computed(() => {
  return tokensList.length - 1;
});

const addressLink = computed(() => {
  return `https://mewcard.mewapi.io/?address=${address}`;
});

// watch
/**
 * run setup for name resolver when web3 changes
 */
watch(
  () => web3,
  () => {
    setupNameResolver();
  }
);
// mounted
onMounted(() => {
  setupNameResolver();
});

// methods
/**
 * checks if network supoorts ens
 * and creates a new name resolver instance
 */
const setupNameResolver = async () => {
  if (network.type.ens && web3.currentProvider) {
    nameResolver.value = new NameResolver(network, web3);
  } else {
    nameResolver.value = null;
  }

  if (nameResolver.value) {
    try {
      const { name } = await nameResolver.value.resolveAddress(address);
      resolvedName.value = name;
    } catch (e) {
      resolvedName.value = '';
    }
  }
};
/**
 * refreshes the token and eth balance
 */
const refresh = () => {
  setTokenAndEthBalance();
};
/**
 * calls hardware wallet show address function
 * and opens verify modal
 */
const viewAddressOnDevice = () => {
  showVerify.value = true;
  if (canDisplayAddress.value) {
    instance
      .displayAddress()
      .then(() => {
        showVerify.value = false;
        Toast('Address verified!', {}, SUCCESS);
      })
      .catch(e => {
        showVerify.value = false;
        Toast(e.message, {}, ERROR);
      });
  }
};
/**
 * Animates wallet card
 */
const animateMewCard = () => {
  const el = document.querySelector('.mew-card');
  if (el) {
    el.style.opacity = 0;
    anime({
      targets: el,
      opacity: 1,
      delay: 1300,
      duration: 500,
      easing: 'easeInOutQuad'
    });
  }
};
/**
 * set showChangeAddress to false
 * to close the modal
 */
const closeChangeAddress = () => {
  showChangeAddress.value = false;
};
/**
 * set showChangeAddress to true
 * to open the modal
 */
const openChangeAddress = () => {
  showChangeAddress.value = true;
};
/**
 * sets showPaperWallet to true
 * to open the modal
 */
const openPaperWallet = () => {
  EventBus.$emit('openPaperWallet');
};
/**
 * Copies address
 */
const copyAddress = () => {
  clipboardCopy(getChecksumAddressString.value);
  Toast(`Copied ${getChecksumAddressString.value} successfully!`, {}, SUCCESS);
};
const open = () => {
  trackDashboardAmplitude(DASHBOARD.SHOW_RECEIVE_ADDRESS);
  openQR.value = true;
};
/**
 * set openQR to false
 * to close the modal
 */
const closeQR = () => {
  openQR.value = false;
};
/**
 * set showLogout to false
 * to close the modal
 */
const closeLogout = () => {
  showLogout.value = false;
};
/**
 * close verify address
 */
const closeVerify = () => {
  showVerify.value = false;
};
/**
 * set showLogout to true
 * to open the modal
 */
const openLogout = () => {
  showLogout.value = true;
};
/**
 * calls removeWallet
 * and closes modal
 */
const onLogout = () => {
  closeLogout();
  trackLogout();
  removeWallet();
};
</script>

<style lang="scss" scoped>
.component--wallet-card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  position: relative;
  width: 100%;
}
.mew-card {
  opacity: 0;
  border-radius: 16px;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  height: 100%;
  img {
    height: 100%;
    width: 100%;
  }
}

.info-container {
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  width: 100%;
  position: relative;
  min-height: 172px;
  top: 0;
  left: 0;
  z-index: 1;
  .info-container--addr {
    font-size: 10px;
    line-height: 10px;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
  }
  .info-container--addr:hover {
    color: white;
  }
  .info-container--text {
    font-size: 12px;
    line-height: 20px;
    color: rgba(255, 255, 255, 0.9);
  }
  .info-container--text-chain-balance {
    font-size: 14px;
    line-height: 20px;
    color: rgba(255, 255, 255, 0.9);
  }

  .info-container--action-btn {
    border-radius: 10px !important;
    height: 32px !important;
    width: 32px !important;
    font-size: 16px !important;
    background: rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(10px);
    letter-spacing: 0.03em;
    color: white;
  }

  .info-container--action- {
    opacity: 0.6;
    border-radius: 4px !important;
    height: 14px !important;
    width: 14px !important;
    font-size: 8px !important;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.24),
      0px 1px 4px 0px rgba(0, 0, 0, 0.24);
  }

  .info-container--action-btn:hover,
  .info-container--action-:hover {
    opacity: 1;
  }
  // .info-container--icon:hover {
  //   color: var(--v-greenPrimary-base) !important;
  // }
}

.text-shadow {
  text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24), 0px 1px 4px rgba(0, 0, 0, 0.24);
}

.drop-shadow {
  filter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.24)),
    drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.24));
}

.refresh-icon:hover {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 32px;
  color: var(--v-white-base) !important;
  height: 20px;
  width: 20px;
}

.refresh-icon.v-icon.v-icon::after {
  background-color: transparent;
}

.personal-account-container {
  border-radius: 10px;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    padding-left: 8px;
    margin-left: -8px;
  }
}

.verify-popup-border {
  border: 1px solid var(--v-greenMedium-base);
  border-radius: 4px;
}

.theme-dark-heading {
  background-color: rgba(0, 0, 0, 0);
  border-radius: 12px;
  height: 24px;
  width: 100%;
}
.theme-dark-heading .v-skeleton-loader__bone::before {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>

<style lang="scss">
// Skeleton loader custom color
.component--wallet-card {
  .v-skeleton-loader__bone {
    background: rgba(0, 0, 0, 0.3) !important;
  }
}
</style>
