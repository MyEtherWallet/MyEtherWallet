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
      <div class="mb-2">OWNED 3 DOMAINS ></div>
      <div class="d-flex align-center">
        <div class="bottom-buttons">
          <mew-button
            button-size="small"
            color-theme="white"
            btn-style="transparent"
            icon="mdi-printer"
            icon-type="mdi"
            @click.native="openPaperWallet = true"
          ></mew-button>
          <mew-button
            button-size="small"
            color-theme="white"
            btn-style="transparent"
            icon="mdi-file-document-outline"
            icon-type="mdi"
            @click.native="copyAddress"
          ></mew-button>
        </div>
        <mew-button
          class="ml-auto switch-button"
          :has-full-width="false"
          btn-style="outline"
          title="SWITCH >"
          color-theme="white"
          button-size="small"
          @click.native="openChangeAddress = true"
        />
      </div>
    </div>
    <balance-address-switch
      :open="openChangeAddress"
      @close="openChangeAddress = false"
    />
    <balance-address-paper-wallet
      :open="openPaperWallet"
      @close="openPaperWallet = false"
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
    ...mapState('wallet', ['address']),
    ...mapState('external', ['ETHUSDValue']),
    lastFour() {
      return this.address.substring(
        this.address.length - 4,
        this.address.length
      );
    },
    convertedBalance() {
      const balance = BigNumber(this.balanceInETH).times(
        this.ETHUSDValue.value
      );
      return `${this.ETHUSDValue.symbol + balance.toFixed(2).toString()}`;
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
}
</style>
