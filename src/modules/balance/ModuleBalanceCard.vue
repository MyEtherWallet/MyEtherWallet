<template>
  <div class="component--wallet-card">
    <div class="mew-card drop-shadow">
      <img
        :src="'https://mewcard.mewapi.io/?address=' + address"
        alt="MEW Card"
        @load="animateMewCard()"
      />
    </div>
    <div class="info-container pl-8 pr-5 py-4 text-shadow">
      <div class="d-flex flex-row justify-space-between align-start">
        <div>
          <!--
          =====================================================================================
            Address
          =====================================================================================
          -->
          <v-menu offset-y>
            <template #activator="{ on }">
              <div
                class="
                  d-flex
                  align-center
                  cursor--pointer
                  personal-account-container
                "
                v-on="on"
              >
                <div
                  class="
                    info-container--text
                    font-weight-bold
                    text-uppercase
                    white--text
                  "
                >
                  MY Personal Account
                </div>
                <v-icon class="white--text ml-2" small dense>
                  mdi-menu-down
                </v-icon>
              </div>
            </template>
            <v-list width="232px">
              <v-list-item class="cursor-pointer" @click="refresh">
                <v-icon color="textDark" class="mr-3">mdi-refresh</v-icon>
                <v-list-item-title> Refresh Balance</v-list-item-title>
              </v-list-item>
              <v-list-item class="cursor-pointer" @click="openPaperWallet">
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
          <div class="d-flex align-center">
            <v-tooltip top content-class="tooltip-inner">
              <template #activator="{ on }">
                <div
                  class="
                    justify-start
                    d-flex
                    align-center
                    info-container--addr
                    monospace
                  "
                  v-on="on"
                >
                  {{ addrFirstSix }}
                  <v-icon class="info-container--addr pt-1"
                    >mdi-dots-horizontal</v-icon
                  >

                  {{ addrlastFour }}
                </div>
              </template>
              <span class="titlePrimary--text">{{
                getChecksumAddressString
              }}</span>
            </v-tooltip>
          </div>
        </div>
      </div>
      <!--
      =====================================================================================
        Total Wallet FIAT balance OR if Test network Chain Balance
      =====================================================================================
      -->
      <div
        :class="[
          { 'ml-n5': !isTestNetwork },
          'mew-subtitle text-shadow white--text mt-5 mb-4'
        ]"
      >
        <span v-if="!isTestNetwork" style="padding-right: 2px">$</span
        >{{ totalWalletBalance }}
        <span v-if="isTestNetwork" style="padding-left: 2px; font-size: 14px">{{
          network.type.currencyName
        }}</span>
      </div>
      <div class="d-flex justify-space-between align-center">
        <div class="justify-start">
          <!--
          =====================================================================================
            Total Wallet chain balance: prensent if not Test network
          =====================================================================================
          -->
          <div v-if="!isTestNetwork" class="info-container--text-chain-balance">
            {{ walletChainBalance }} {{ network.type.currencyName }}
          </div>
          <!--
          =====================================================================================
            Total Tokens: present if tokens found
          =====================================================================================
          -->
          <div v-if="nonChainTokensCount > 0" class="info-container--text">
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
            class="info-container--action-btn mr-2 px-0"
            fab
            depressed
            color="white"
            @click="openQR = true"
            ><v-icon class="info-container--icon" size="18px"
              >mdi-qrcode</v-icon
            ></v-btn
          >
          <!--
          =====================================================================================
            Copy Button
          =====================================================================================
          -->
          <v-btn
            class="info-container--action-btn px-0"
            depressed
            fab
            color="white"
            @click="copyAddress"
            ><v-icon class="info-container--icon" small
              >mdi-content-copy</v-icon
            ></v-btn
          >
        </div>
      </div>
    </div>
    <!--
    =====================================================================================
      Wallet card modals
    =====================================================================================
    -->
    <balance-address-paper-wallet
      :open="showPaperWallet"
      :close="closePaperWallet"
      @close="closePaperWallet"
    />
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
      :switch-address="!!instance.path"
    />
    <module-access-wallet-software
      v-else
      :open="showChangeAddress"
      :close="closeChangeAddress"
      :switch-address="!!instance.path"
      :wallet-type="identifier"
    />

    <mew-popup
      max-width="400px"
      hide-close-btn
      :show="showLogout"
      :title="$t('interface.menu.logout')"
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

<script>
import anime from 'animejs/lib/anime.es.js';
import AppModal from '@/core/components/AppModal';
import AppAddrQr from '@/core/components/AppAddrQr';
import BalanceAddressPaperWallet from './components/BalanceAddressPaperWallet';
import { mapGetters, mapActions, mapState } from 'vuex';
import clipboardCopy from 'clipboard-copy';
import { Toast, INFO, SUCCESS } from '@/modules/toast/handler/handlerToast';
import { toChecksumAddress } from '@/core/helpers/addressUtils';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import { isEmpty } from 'lodash';
import ModuleAccessWalletHardware from '@/modules/access-wallet/ModuleAccessWalletHardware';
import ModuleAccessWalletSoftware from '@/modules/access-wallet/ModuleAccessWalletSoftware';
import wallets from './handlers/config';
import WALLET_TYPES from '../access-wallet/common/walletTypes';

export default {
  components: {
    BalanceAddressPaperWallet,
    AppModal,
    AppAddrQr,
    ModuleAccessWalletHardware,
    ModuleAccessWalletSoftware
  },
  data() {
    return {
      showChangeAddress: false,
      showPaperWallet: false,
      openQR: false,
      showLogout: false,
      showVerify: false,
      wallets: wallets
    };
  },
  computed: {
    ...mapGetters('wallet', ['balanceInETH', 'tokensList']),
    ...mapState('wallet', ['address', 'instance', 'identifier', 'isHardware']),
    ...mapGetters('external', [
      'fiatValue',
      'balanceFiatValue',
      'totalTokenFiatValue'
    ]),
    ...mapGetters('global', ['isEthNetwork', 'network', 'isTestNetwork']),
    /**
     * verify address title
     * returns @String
     */
    verifyAddressTitle() {
      return `This wallet is accessed with ${this.instance.meta.name}`;
    },
    /**
     * verify address body
     * returns @String
     */
    verifyAddressBody() {
      return `To verify, check the address on your ${this.instance.meta.name} device & make sure it is the same address as the one shown below.`;
    },
    /**
     * Shows hardware access or software access
     * returns @Boolean
     */
    showHardware() {
      return (
        !isEmpty(this.instance) &&
        this.instance.path &&
        this.identifier !== WALLET_TYPES.MNEMONIC
      );
    },
    /**
     * returns checksummed address
     */
    getChecksumAddressString() {
      return this.address ? toChecksumAddress(this.address) : '';
    },
    /**
     * checks whether hardware wallet
     * can display address with the device
     *
     * returns @Boolean
     */
    canDisplayAddress() {
      return (
        !isEmpty(this.instance) &&
        this.instance.hasOwnProperty('displayAddress') &&
        this.instance.displayAddress
      );
    },
    /**
     * adds checks for icons that mew-components doesn't have
     * returns @String
     */
    iconIdentifier() {
      if (this.identifier === WALLET_TYPES.BITBOX2) {
        return 'bitbox';
      }
      return this.identifier;
    },
    /**
     * checks whether wallet can switch address
     * returns @Boolean
     */
    canSwitch() {
      return !isEmpty(this.instance) && this.wallets[this.identifier];
    },
    /**
     * returns hardware wallet name
     * returns @String
     */
    walletName() {
      return !isEmpty(this.instance) &&
        this.instance.meta.hasOwnProperty('name')
        ? this.instance.meta.name
        : '';
    },
    /**
     * returns token values
     * returns @String
     */
    totalTokenBalance() {
      return this.totalTokenFiatValue;
    },
    /**
     * returns total value including tokens
     * returns @String
     */
    totalWalletBalance() {
      if (!this.isTestNetwork) {
        const total = this.totalTokenBalance;
        return formatFiatValue(total).value;
      }
      return this.walletChainBalance;
    },
    /**
     * returns formatted wallet balance
     * returns @String
     */
    walletChainBalance() {
      return `${formatFloatingPointValue(this.balanceInETH).value}`;
    },
    /**
     * @returns {string} first 6 letters in the address
     */
    addrFirstSix() {
      return this.address ? this.address.substring(0, 6) : '';
    },
    /**
     * @returns {string} lat 4 letters in the address
     */
    addrlastFour() {
      return this.address
        ? this.address.substring(this.address.length - 4, this.address.length)
        : '';
    },
    /**
     * @returns {number} count of non chain tokens
     */
    nonChainTokensCount() {
      return this.tokensList.length - 1;
    }
  },
  methods: {
    ...mapActions('external', ['setTokenAndEthBalance']),
    ...mapActions('wallet', ['removeWallet']),
    /**
     * refreshes the token and eth balance
     */
    refresh() {
      this.setTokenAndEthBalance();
    },
    /**
     * calls hardware wallet show address function
     * and opens verify modal
     */
    viewAddressOnDevice() {
      this.showVerify = true;
      if (this.canDisplayAddress) {
        this.instance.displayAddress().then(() => {
          this.showVerify = false;
          Toast('Address verified!', {}, SUCCESS);
        });
      }
    },
    /**
     * Animates wallet card
     */
    animateMewCard() {
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
    },
    /**
     * set showChangeAddress to false
     * to close the modal
     */
    closeChangeAddress() {
      this.showChangeAddress = false;
    },
    /**
     * set showChangeAddress to true
     * to open the modal
     */
    openChangeAddress() {
      this.showChangeAddress = true;
    },
    /**
     * set showPaperWallet to false
     * to close the modal
     */
    closePaperWallet() {
      this.showPaperWallet = false;
    },
    /**
     * sets showPaperWallet to true
     * to open the modal
     */
    openPaperWallet() {
      this.showPaperWallet = true;
    },
    /**
     * Copies address
     */
    copyAddress() {
      clipboardCopy(this.getChecksumAddressString);
      Toast(`Copied ${this.getChecksumAddressString} successfully!`, {}, INFO);
    },
    /**
     * set openQR to false
     * to close the modal
     */
    closeQR() {
      this.openQR = false;
    },
    /**
     * set showLogout to false
     * to close the modal
     */
    closeLogout() {
      this.showLogout = false;
    },
    /**
     * close verify address
     */
    closeVerify() {
      this.showVerify = false;
    },
    /**
     * set showLogout to true
     * to open the modal
     */
    openLogout() {
      this.showLogout = true;
    },
    /**
     * calls removeWallet
     * and closes modal
     */
    onLogout() {
      this.closeLogout();
      this.removeWallet();
    }
  }
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

.v-btn::before {
  background-color: transparent;
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
    opacity: 0.6;
    border-radius: 10px !important;
    height: 32px !important;
    width: 32px !important;
    font-size: 16px !important;
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
  .info-container--icon:hover {
    color: var(--v-primary-base) !important;
  }
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
</style>
