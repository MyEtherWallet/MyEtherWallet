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
            <!--
            =====================================================================================
              Print Button
            =====================================================================================
            -->
            <v-tooltip top content-class="tooltip-inner">
              <template #activator="{ on, attrs }">
                <v-btn
                  class="info-container--action-print px-0 ml-1 drop-shadow"
                  fab
                  depressed
                  color="white"
                  v-bind="attrs"
                  v-on="on"
                  @click="openPaperWallet = true"
                  ><v-icon size="10px">mdi-printer</v-icon></v-btn
                >
              </template>
              <span class="titlePrimary--text">Print account info</span>
            </v-tooltip>
          </div>
        </div>
        <!--
            =====================================================================================
              Refresh Button
            =====================================================================================
            -->
        <v-icon
          color="rgba(255, 255, 255, 0.72)"
          class="cursor-pointer refresh-icon"
          size="20"
          @click="refresh"
          >mdi-refresh</v-icon
        >
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

    <module-access-wallet-hardware
      v-if="!!instance.path"
      :open="openChangeAddress"
      :close="closeChangeAddress"
      :switch-address="!!instance.path"
    />
    <balance-address-paper-wallet
      :open="openPaperWallet"
      :close="closePaperWallet"
    />
    <app-modal
      :show="openQR"
      :close="closeQR"
      :has-buttons="false"
      width="400px"
    >
      <template #dialogBody>
        <app-addr-qr />
      </template>
    </app-modal>
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js';
import AppModal from '@/core/components/AppModal';
import AppAddrQr from '@/core/components/AppAddrQr';
import ModuleAccessWalletHardware from '@/modules/access-wallet/ModuleAccessWalletHardware';
import BalanceAddressPaperWallet from './components/BalanceAddressPaperWallet';
import { mapGetters, mapActions, mapState } from 'vuex';
import clipboardCopy from 'clipboard-copy';
import { Toast, INFO } from '@/modules/toast/handler/handlerToast';
import { toChecksumAddress } from '@/core/helpers/addressUtils';
import {
  formatFiatValue,
  formatBalanceEthValue
} from '@/core/helpers/numberFormatHelper';

export default {
  components: {
    BalanceAddressPaperWallet,
    AppModal,
    AppAddrQr,
    ModuleAccessWalletHardware
  },
  data() {
    return {
      openChangeAddress: false,
      openPaperWallet: false,
      openQR: false
    };
  },
  computed: {
    ...mapGetters('wallet', ['balanceInWei', 'tokensList']),
    ...mapState('wallet', ['address', 'instance', 'identifier']),
    ...mapGetters('external', [
      'fiatValue',
      'balanceFiatValue',
      'totalTokenFiatValue'
    ]),
    ...mapGetters('global', ['isEthNetwork', 'network', 'isTestNetwork']),
    getChecksumAddressString() {
      return this.address ? toChecksumAddress(this.address) : '';
    },
    totalTokenBalance() {
      return this.totalTokenFiatValue;
    },
    totalWalletBalance() {
      if (!this.isTestNetwork) {
        const total = this.totalTokenBalance;
        return formatFiatValue(total).value;
      }
      return this.walletChainBalance;
    },
    walletChainBalance() {
      return `${formatBalanceEthValue(this.balanceInWei).value}`;
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
    /**
     * refreshes the token and eth balance
     */
    refresh() {
      this.setTokenAndEthBalance();
    },
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
    closeChangeAddress() {
      this.openChangeAddress = false;
    },
    closePaperWallet() {
      this.openPaperWallet = false;
    },
    copyAddress() {
      clipboardCopy(this.getChecksumAddressString);
      Toast(`Copied ${this.getChecksumAddressString} successfully!`, {}, INFO);
    },
    closeQR() {
      this.openQR = false;
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

  .info-container--action-print {
    opacity: 0.6;
    border-radius: 4px !important;
    height: 14px !important;
    width: 14px !important;
    font-size: 8px !important;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.24),
      0px 1px 4px 0px rgba(0, 0, 0, 0.24);
  }

  .info-container--action-btn:hover,
  .info-container--action-print:hover {
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
</style>
