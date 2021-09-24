<template>
  <div>
    <v-row v-if="deviceNotPaired" no-gutters class="pt-4">
      <v-col cols="12" justify="center" align="center" class="py-5">
        <img :src="imgPath" width="60%" />
      </v-col>
      <v-col cols="12" justify="center" align="center">
        <v-card-title class="border justify-center font-wrapping py-5 mb-8">
          <div class="mew-heading-4 font-weight-medium pl-1">
            Connect your Bitbox2 device
          </div>
        </v-card-title>
      </v-col>
      <v-col cols="12" justify="center" align="center">
        <mew-button
          title="Unlock Bitbox 02"
          color-theme="primary"
          :has-full-width="true"
          btn-size="xlarge"
          btn-style="background"
          @click.native="unlockWallet"
        />
      </v-col>
    </v-row>
    <v-row v-if="deviceConnected" no-gutters class="py-4">
      <v-col cols="12" justify="center" align="center">
        <img :src="gifPath" width="100%" />
      </v-col>
    </v-row>

    <div v-if="deviceUnpaired">
      <div class="mew-heading-2 pa-3 text-center">
        Please verify pairing code
      </div>
      <div class="mew-body">
        <pre class="text-center mew-heading-1">{{ devicePairingCode }}</pre>
      </div>
      <mew-button
        title="Confirm"
        color-theme="primary"
        :has-full-width="true"
        class="mt-5"
        btn-size="xlarge"
        btn-style="background"
        :disabled="!deviceConfirmed"
        @click.native="resolvePairing"
      />
    </div>
  </div>
</template>

<script>
import { _ } from 'web3-utils';
import gifPath from '@/assets/images/hardware-wallets/bb02-pw-entry.gif';
import bitbox2Welcome from '@/assets/images/hardware-wallets/bitbox02-welcome.png';
export default {
  props: {
    hwWalletInstance: {
      type: Object,
      default: () => {}
    },
    unlock: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      gifPath: gifPath,
      imgPath: bitbox2Welcome
    };
  },
  computed: {
    deviceNotPaired() {
      return (
        _.isEmpty(this.hwWalletInstance) ||
        (!_.isEmpty(this.hwWalletInstance) && !this.hwWalletInstance?.status)
      );
    },
    deviceConnected() {
      return (
        !this.deviceNotPaired && this.hwWalletInstance?.status === 'connected'
      );
    },
    deviceUnpaired() {
      return (
        !this.deviceNotPaired && this.hwWalletInstance?.status === 'unpaired'
      );
    },
    devicePairingCode() {
      return !this.deviceNotPaired ? this.hwWalletInstance?.pairingCode : '';
    },
    deviceConfirmed() {
      return !this.deviceNotPaired
        ? this.hwWalletInstance?.pairingConfirmed
        : false;
    }
  },
  methods: {
    resolvePairing() {
      this.hwWalletInstance.pairingConfirmationResolve();
    },
    unlockWallet() {
      this.unlock();
    }
  }
};
</script>

<style lang="scss" scoped>
.border {
  border: 1px solid var(--v-inputBorder-base);
  border-radius: 5px;
  width: 100%;
}

.font-wrapping {
  text-align: center;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
