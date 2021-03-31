<template>
  <div class="component--wallet-card">
    <div class="background-image">
      <img src="@/assets/images/snippets/wallet-card.png" />
    </div>
    <div class="info-container px-4 pt-5 pb-3">
      <div class="d-flex">
        <div class="blockie-img">
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
            <div>MY ACCOUNT VALUE</div>
          </div>
          <div class="headline font-weight-bold monospace">
            {{ convertedBalance }}
          </div>
        </div>
      </div>
      <div class="component--address d-flex align-center mt-1">
        <div class="monospace full-address">{{ address }}</div>
        <div class="monospace last-four">{{ lastFour }}</div>
      </div>
      <!-- <div class="mb-2">OWNED 3 DOMAINS ></div> -->
      <div class="d-flex align-center mt-2">
        <div class="bottom-buttons">
          <v-btn icon @click="openPaperWallet = true">
            <img
              src="@/assets/images/icons/icon-print-light.png"
              alt="Print Wallet"
              height="20"
            />
          </v-btn>
          <v-btn icon @click="copyAddress">
            <img
              src="@/assets/images/icons/icon-copy-light.png"
              alt="Print Wallet"
              height="20"
            />
          </v-btn>
        </div>
        <v-btn
          v-if="false"
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
    <balance-address-switch
      :open="openChangeAddress"
      @close="openChangeAddress = false"
    />
    <balance-address-paper-wallet
      :open="openPaperWallet"
      :close="closePaperWallet"
    />
  </div>
</template>

<script>
import BalanceAddressSwitch from './components/BalanceAddressSwitch';
import BalanceAddressPaperWallet from './components/BalanceAddressPaperWallet';
import BalanceAddressQrCode from './components/BalanceAddressQrCode';
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import clipboardCopy from 'clipboard-copy';
import { Toast, INFO } from '@/modules/toast/handler/handlerToast';

export default {
  components: {
    BalanceAddressSwitch,
    BalanceAddressPaperWallet,
    BalanceAddressQrCode
  },
  data() {
    return {
      openChangeAddress: false,
      openPaperWallet: false
    };
  },
  computed: {
    ...mapGetters('wallet', ['balanceInETH']),
    ...mapState('wallet', ['address', 'isHardware']),
    ...mapState('external', ['ETHUSDValue']),
    ...mapGetters('global', ['isEthNetwork', 'network']),
    canSwitch() {
      return this.isHardware;
    },
    lastFour() {
      return this.address.substring(
        this.address.length - 4,
        this.address.length
      );
    },
    convertedBalance() {
      if (this.isEthNetwork) {
        const balance = BigNumber(this.balanceInETH).times(
          this.ETHUSDValue.value
        );
        return `${this.ETHUSDValue.symbol + balance.toFixed(2).toString()}`;
      }
      return `${BigNumber(this.balanceInETH).toFixed(2)} ${
        this.network.type.currencyName
      }`;
    }
  },
  methods: {
    closeChangeAddress() {
      this.openChangeAddress = false;
    },
    closePaperWallet() {
      this.openPaperWallet = false;
    },
    copyAddress() {
      clipboardCopy(this.address);
      Toast(`Copied ${this.address} successfully!`, {}, INFO);
    }
  }
};
</script>

<style lang="scss" scoped>
.component--wallet-card {
  position: relative;
  width: 100%;
}
.background-image {
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
  position: relative;

  .blockie-image {
    border: 2px solid white;
    border-radius: 100%;
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
