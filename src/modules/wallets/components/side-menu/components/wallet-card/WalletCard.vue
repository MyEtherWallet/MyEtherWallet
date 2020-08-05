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
            <!-- <Tooltip text="Change your wallet information">
              <v-btn class="ml-n1" text icon :color="iconColor"
                ><v-icon class="color--white body-1">mdi-pencil</v-icon></v-btn
              >
            </Tooltip> -->
          </div>
          <div class="headline font-weight-bold monospace">$7,244.58</div>
        </div>
      </div>
      <my-address class="mt-1 mb-2" :address="address" />
      <div class="d-flex align-center">
        <!-- <Tooltip text="Print">
          <v-btn text icon :color="iconColor" @click="openPaperWallet = true">
            <img src="@/assets/images/icons/icon-printer-white.svg" />
          </v-btn>
        </Tooltip> -->

        <!-- <Tooltip text="Click to print out your wallet">
          <v-btn text icon :color="iconColor">
            <img src="@/assets/images/icons/icon-document-white.svg" />
          </v-btn>
        </Tooltip> -->

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
import myAddress from './components/address';
// import Tooltip from '@/components/Tooltip';
import qrCodePopup from '@/modules/wallets/components/popups/qr-code-popup';

export default {
  components: {
    // Tooltip,
    myAddress,
    changeAddress,
    paperWallet,
    qrCodePopup
  },
  data() {
    return {
      openChangeAddress: false,
      openPaperWallet: false,
      iconColor: 'white',
      address: '0xc2a933600c3fe776777b4000665409c61493d417'
    };
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
</style>
