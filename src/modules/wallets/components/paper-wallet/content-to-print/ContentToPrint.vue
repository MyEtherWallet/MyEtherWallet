<template>
  <div class="pa-10">
    <div class="d-flex justify-space-between align-start">
      <div class="d-flex align-center">
        <img height="35" src="@/assets/images/icons/logo-mew-dark.png" />
        <div class="primary--text"><span class="mx-3">|</span>Paper Wallet</div>
      </div>
      <div>
        <div class="d-flex align-center mr-3 mb-2">
          <v-icon class="mr-2" color="black" small>mdi-email-open</v-icon>
          <div>support@myetherwallet.com</div>
        </div>
        <div class="d-flex align-center mr-3">
          <v-icon class="mr-2" color="black" small>mdi-home</v-icon>
          <div>https://www.myetherwallet.com</div>
        </div>
      </div>
    </div>
    <div class="mt-5 d-flex align-center">
      <mew-blockie :address="address" width="60px" height="60px" class="mr-4" />

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
    <div class="mt-4 d-flex align-content-stretch">
      <div
        class="box-gray d-flex flex-column justify-center flex-grow-1 px-8 border-radius--10px mr-5"
      >
        <div class="subtitle-1 font-weight-black text-uppercase">
          My Public Address
        </div>
        <div class="monospace">{{ address }}</div>
      </div>

      <div class="qr-image">
        <VueQrcode :value="address" :options="{ size: 130 }"></VueQrcode>
      </div>
    </div>

    <div
      class="cut-line my-12 mx-n4 gray3--text overflow--hidden white-space--nowrap"
    >
      --------------------------------------------------------------------------------------------------------
    </div>

    <div class="font-weight-black">
      You might LOSE your MONEY if you share this Private Key with anyone!
    </div>
    <div class="mt-4 d-flex align-content-stretch">
      <div
        class="box-gray d-flex flex-column justify-center flex-grow-1 px-8 border-radius--10px mr-5"
      >
        <div class="subtitle-1 font-weight-black text-uppercase">
          My Address
        </div>
        <div class="monospace">{{ address }}</div>
      </div>
      <div class="qr-image">
        <VueQrcode :value="address" :options="{ size: 130 }"></VueQrcode>
      </div>
    </div>

    <div class="py-3"></div>

    <div class="mt-4 d-flex align-content-stretch">
      <div
        class="box-gray d-flex flex-column justify-center flex-grow-1 px-8 border-radius--10px mr-5"
      >
        <div class="subtitle-1 font-weight-black text-uppercase red--text">
          My Private Key
        </div>
        <div class="monospace">{{ privateKey }}</div>
      </div>
      <div class="qr-image">
        <VueQrcode :value="privateKey" :options="{ size: 130 }"></VueQrcode>
      </div>
    </div>
    <div
      class="cut-line my-12 mx-n4 gray3--text overflow--hidden white-space--nowrap"
    >
      --------------------------------------------------------------------------------------------------------
    </div>

    <div v-if="false" class="text-center">
      <img
        src="@/assets/images/backgrounds/bg-paper-wallet.png"
        alt="Spaceman"
        height="150"
      />
    </div>
  </div>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode';

export default {
  components: {
    VueQrcode
  },
  props: {
    address: { default: '', type: String },
    privateKey: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.qr-image {
  height: 130px;
  margin: -6px 0;
}

.cut-line {
  font-size: 22px;
  letter-spacing: 5px;
  text-align: center;
}

.box-gray {
  background-color: #f6f6f6;
  //background-color: white;
}

div {
  color: black !important;
}
</style>
