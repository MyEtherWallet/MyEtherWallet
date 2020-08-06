<template>
  <div class="component--wallet-card">
    <div class="background-image">
      <img src="@/assets/images/snippets/wallet-card.png" />
    </div>
    <div class="info-container px-4 py-5">
      <div class="d-flex">
        <div class="blockie-img">
          <blockie
            :address="address"
            :size="8"
            :scale="16"
            width="50px"
            height="50px"
            class="blockie-image"
          />
          <qr-code-popup
            title="Address QR Code"
            value="0x85b74f0ad686252a817c1a7fd70b600c098dc38c"
          >
            <img src="@/assets/images/icons/icon-qr-code-mew.svg" />
          </qr-code-popup>
        </div>
        <div class="ml-4">
          <div class="mb-n2 mt-n2 font-weight-medium d-flex align-center">
            <div>Dennis wallet</div>
          </div>
          <div class="headline font-weight-bold monospace">$7,244.58</div>
        </div>
      </div>
      <div class="component--address d-flex align-center mt-1 mb-2">
        <div class="monospace full-address">{{ address }}</div>
        <div class="monospace last-four">{{ lastFour }}</div>
      </div>
      <div class="d-flex align-center">
        <mew-button
          class="ml-auto"
          :has-full-width="false"
          btn-style="outline"
          title="Switch >"
          color-theme="white"
          button-size="small"
          @click.native="openChangeAddress = true"
        />
      </div>
    </div>
    <change-address :open="openChangeAddress" :close="closeChangeAddress" />
    <paper-wallet :open="openPaperWallet" :close="closePaperWallet" />
  </div>
</template>

<script>
import changeAddress from '../change-address';
import paperWallet from '../paper-wallet';
import qrCodePopup from '@/modules/wallets/components/qr-code-popup';

export default {
  components: {
    changeAddress,
    paperWallet,
    qrCodePopup
  },
  data() {
    return {
      openChangeAddress: false,
      openPaperWallet: false,
      address: '0xc2a933600c3fe776777b4000665409c61493d417'
    };
  },
  computed: {
    lastFour() {
      return this.address.substring(
        this.address.length - 4,
        this.address.length
      );
    }
  },
  methods: {
    closeChangeAddress() {
      this.openChangeAddress = false;
    },
    closePaperWallet() {
      this.openPaperWallet = false;
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
  img {
    width: 100%;
  }
}
.blockie-img {
  position: relative;
  img {
    position: absolute;
    bottom: 0px;
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
