<template>
  <div class="component--wallet-card">
    <div class="mew-card">
      <img
        :src="'https://mewcard.mewapi.io/?address=' + address"
        alt="MEW Card"
        @load="
          animateMewCard();
          animateBlockie();
        "
      />
    </div>
    <div class="info-container px-4 pt-5 pb-3">
      <div class="d-flex">
        <div ref="blockie" class="blockie-img">
          <mew-blockie
            :address="address"
            :size="8"
            :scale="16"
            width="50px"
            height="50px"
            class="blockie-image"
          />
          <balance-address-qr-code title="Address QR Code" :value="address">
            <img src="@/assets/images/icons/icon-qr-code-mew.svg" />
          </balance-address-qr-code>
        </div>
        <div class="ml-4">
          <div class="font-weight-medium d-flex align-center">
            <div class="text-shadow font-weight-bold">MY ACCOUNT VALUE</div>
          </div>
          <div class="text-shadow headline font-weight-bold monospace">
            {{ totalWalletBalance || '$0' }}
          </div>
        </div>
      </div>
      <div class="component--address d-flex align-center mt-1">
        <div class="text-shadow monospace full-address font-weight-bold">
          {{ getChecksumAddressString }}
        </div>
        <div class="text-shadow monospace last-four font-weight-bold">
          {{ lastFour }}
        </div>
      </div>
      <!-- <div class="mb-2">OWNED 3 DOMAINS ></div> -->
      <div class="d-flex align-center mt-2">
        <div class="bottom-buttons">
          <v-btn icon @click="openPaperWallet = true">
            <img
              src="@/assets/images/icons/icon-print-light.png"
              alt="Print Wallet"
              height="20"
              class="drop-shadow"
            />
          </v-btn>
          <v-btn icon @click="copyAddress">
            <img
              src="@/assets/images/icons/icon-copy-light.png"
              alt="Print Wallet"
              height="20"
              class="drop-shadow"
            />
          </v-btn>
        </div>
        <v-btn
          v-if="isHardware"
          outlined
          small
          color="white"
          class="ml-auto"
          @click="openChangeAddress = true"
        >
          SWITCH >
        </v-btn>
      </div>
    </div>
    <module-access-wallet-hardware
      v-if="isHardware"
      :open="openChangeAddress"
      :close="closeChangeAddress"
      :switch-address="isHardware"
    />
    <balance-address-paper-wallet
      :open="openPaperWallet"
      :close="closePaperWallet"
    />
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js';
import ModuleAccessWalletHardware from '@/modules/access-wallet/ModuleAccessWalletHardware';
import BalanceAddressPaperWallet from './components/BalanceAddressPaperWallet';
import BalanceAddressQrCode from './components/BalanceAddressQrCode';
import { mapGetters, mapState } from 'vuex';
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
    BalanceAddressQrCode,
    ModuleAccessWalletHardware
  },
  data() {
    return {
      openChangeAddress: false,
      openPaperWallet: false
    };
  },
  computed: {
    ...mapGetters('wallet', ['balanceInWei', 'tokensList']),
    ...mapState('wallet', ['address', 'isHardware', 'identifier']),
    ...mapGetters('external', [
      'fiatValue',
      'balanceFiatValue',
      'totalTokenFiatValue'
    ]),
    ...mapGetters('global', ['isEthNetwork', 'network']),
    getChecksumAddressString() {
      return this.address ? toChecksumAddress(this.address) : '';
    },
    lastFour() {
      return this.address
        ? this.address.substring(this.address.length - 4, this.address.length)
        : '';
    },
    totalTokenBalance() {
      return this.totalTokenFiatValue;
    },
    totalWalletBalance() {
      if (this.fiatValue != 0) {
        const total = this.totalTokenBalance;
        return `${'$' + formatFiatValue(total).value}`;
      }
      return `${formatBalanceEthValue(this.balanceInWei).value} ${
        this.network.type.currencyName
      }`;
    }
  },
  methods: {
    animateBlockie() {
      const el = document.querySelector('.blockie-img');
      if (el) {
        el.style.transform = 'scale(0)';
        anime({
          targets: el,
          keyframes: [{ scale: 0 }, { scale: 3 }, { scale: 1 }],
          delay: 1500,
          duration: 2000
        });
      }
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
    }
  }
};
</script>

<style lang="scss" scoped>
.component--wallet-card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  position: relative;
  width: 100%;
}
.mew-card {
  opacity: 0;
  border-radius: 10px;
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
.blockie-img {
  transform: scale(0);
  position: relative;
  z-index: 1;

  .blockie-image {
    border: 2px solid white;
    border-radius: 100%;
    z-index: 1;
  }

  img {
    position: absolute;
    right: -5px;
    top: 30px;
    cursor: pointer;
  }
}
.info-container {
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;
  * {
    color: white;
  }
}
.color--white {
  color: white !important;
}

.component--address * {
  @extend .color--white;
}

.full-address {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 165px;
}

.last-four {
  margin-left: -4px;
}

.text-shadow {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
}

.drop-shadow {
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.8));
}
</style>

<style lang="scss">
.component--wallet-card {
  .bottom-buttons {
    .v-btn {
      padding: 0 !important;
      min-width: 36px !important;
    }
  }
  .switch-button {
    min-height: 30px !important;
    height: 30px !important;

    .v-btn__content span {
      font-size: 12px !important;
    }
  }
  .mew-button span {
    font-size: 0.5rem !important;
  }
}
</style>
