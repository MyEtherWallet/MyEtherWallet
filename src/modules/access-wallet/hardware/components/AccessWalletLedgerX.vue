<template>
  <div>
    <div class="subtitle-1 font-weight-bold mb-2">Connecting to:</div>
    <div>
      <mew-select v-model="ledgerApp" :items="ledgerApps" :is-custom="true" />
      <div class="text-right">
        <access-wallet-derivation-path
          :selected-path="selectedPath"
          :passed-paths="paths"
          @setPath="setPath"
        />
      </div>
      <div class="d-flex flex-column align-center justify-center">
        <div class="pb-8 pt-15 pt-md-18">
          <v-img
            :src="
              require('@/assets/images/icons/hardware-wallets/Ledger-Nano-X-image.svg')
            "
            alt="Ledger X Wallet"
            max-width="21em"
            max-height="10em"
            contain
          />
        </div>
        <v-card-title
          v-if="!ledgerConnected"
          class="border justify-center font-wrapping"
        >
          <div class="mew-heading-4 font-weight-medium pl-1">
            Open the Ethereum App and Pair your Ledger Nano X
          </div>
        </v-card-title>
        <v-card-title
          v-if="ledgerConnected"
          class="border justify-center font-wrapping"
        >
          <img
            src="@/assets/images/icons/icon-checked.svg"
            alt="Green check mark"
            height="20"
          />
          <div class="mew-heading-4 font-weight-medium pl-1">
            Ledger Nano X connected
          </div>
        </v-card-title>
      </div>
    </div>
    <div class="d-flex justify-space-between justify-center text-center">
      <mew-button
        btn-size="xlarge"
        title="Connect via Bluetooth"
        @click.native="ledgerUnlockBle"
      />
      <mew-button
        btn-size="xlarge"
        title="Connect via USB"
        @click.native="ledgerUnlock"
      />
    </div>
  </div>
</template>
<script>
import AccessWalletDerivationPath from './AccessWalletDerivationPath.vue';

export default {
  name: 'AccessWalletLedgerX',
  components: {
    AccessWalletDerivationPath
  },
  props: {
    ledgerApps: {
      type: Array,
      default: () => []
    },
    ledgerConnected: {
      type: Boolean,
      default: false
    },
    ledgerUnlock: {
      type: Function,
      default: () => {}
    },
    ledgerUnlockBle: {
      type: Function,
      default: () => {}
    },
    paths: {
      type: Array,
      default: () => []
    },
    selectedPath: {
      type: Object,
      default: () => {}
    },
    setPath: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      ledgerApp: {}
    };
  },
  watch: {
    ledgerApp: {
      handler: function (newVal) {
        this.$emit('ledgerApp', newVal);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.border {
  border: 1px solid var(--v-greyMedium-base);
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 30px;
  width: 100%;
}
.font-wrapping {
  text-align: center;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
