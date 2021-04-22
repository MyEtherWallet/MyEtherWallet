<template>
  <div class="mew-component--paper-wallet-content">
    <div class="d-flex justify-space-between align-start">
      <div class="d-flex align-center">
        <img height="35" src="@/assets/images/icons/logo-mew-dark.png" />
        <div class="primary--text"><span class="mx-3">|</span>Paper Wallet</div>
      </div>
      <div>
        <div class="d-flex align-center mr-3 mb-2">
          <img
            class="mr-2"
            height="20"
            src="@/assets/images/icons/icon-support.svg"
          />
          <div>support@myetherwallet.com</div>
        </div>
        <div class="d-flex align-center mr-3">
          <img
            class="mr-2"
            height="20"
            src="@/assets/images/icons/icon-support.svg"
          />
          <div>https://www.myetherwallet.com</div>
        </div>
      </div>
    </div>
    <div class="mt-5 d-flex align-center">
      <mew-blockie
        :address="address"
        :size="8"
        :scale="16"
        :width="blockieSize"
        :height="blockieSize"
        class="mr-4 white"
      />

      <div style="max-width: 400px">
        <div class="subtitle-1 font-weight-black text-uppercase">
          My address icon
        </div>
        <div>
          Always look for the icon when sending to this wallet. And please keep
          your paper wallet at a
          <span class="text-uppercase red--text font-weight-medium"
            >Safe Place!</span
          >
        </div>
      </div>
    </div>

    <div
      class="cut-line my-5 mx-n4 gray3--text overflow--hidden white-space--nowrap"
    >
      --------------------------------------------------------------------------------------------------------
    </div>

    <div class="font-weight-black">
      You might LOSE your MONEY if you share this Private Key with anyone!
    </div>
    <div class="mt-4 d-flex align-content-stretch">
      <div class="d-flex flex-column justify-center flex-grow-1 px-8">
        <div class="subtitle-1 font-weight-black text-uppercase">
          My Address
        </div>
        <div class="mew-address">{{ getChecksumAddressString }}</div>
      </div>
      <div class="qr-image">
        <VueQrcode :value="key" :options="{ size: 130 }"></VueQrcode>
      </div>
    </div>
    <div v-if="!isHardware" class="mt-4 d-flex align-content-stretch">
      <div class="d-flex flex-column justify-center flex-grow-1 px-8">
        <div class="subtitle-1 font-weight-black text-uppercase red--text">
          My Private Key
        </div>
        <div class="mew-address">{{ key }}</div>
      </div>
      <div class="qr-image">
        <VueQrcode :value="key" :options="{ size: 130 }" />
      </div>
    </div>

    <div
      class="cut-line my-5 mx-n4 gray3--text overflow--hidden white-space--nowrap"
    >
      --------------------------------------------------------------------------------------------------------
    </div>

    <div class="text-center">
      <img
        src="@/assets/images/backgrounds/bg-paper-wallet.png"
        alt="Spaceman"
        height="250"
      />
    </div>
  </div>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode';
import { mapState } from 'vuex';
import { toChecksumAddress } from '@/core/helpers/addressUtils';

export default {
  name: 'BalanceAddressPaperWallet',
  components: {
    VueQrcode
  },
  props: {
    printable: { default: false, type: Boolean }
  },
  data() {
    return {
      blockieSize: '70px'
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'instance', 'isHardware']),
    key() {
      if (!this.isHardware) {
        return this.instance.getPrivateKeyString();
      }
      return null;
    },
    getChecksumAddressString() {
      return toChecksumAddress(this.address);
    }
  }
};
</script>

<style lang="scss" scoped>
.qr-image {
  margin: -6px 0;
  height: 130px;
}
.cut-line {
  font-size: 18px;
  letter-spacing: 3px;
  text-align: center;
}
</style>
