<template>
  <div>
    <div class="subtitle-1 font-weight-bold mb-2">Connecting to:</div>
    <div class="d-flex align-start mb-2">
      <mew-select
        :value="ledgerApp"
        :items="ledgerApps"
        :is-custom="true"
        class="mr-4 network-selection"
        @input="handleApp"
      />
      <access-wallet-derivation-path
        :selected-path="selectedPath"
        :passed-paths="paths"
        :disable-custom-paths="true"
        class="derivation-path"
        @setPath="setPath"
      />
    </div>
    <div class="sheet d-flex align-center justify-center">
      <div class="d-flex align-center justify-center pb-8 pt-15 pt-md-18">
        <p class="para">
          Choose <b>Ethereum</b> on your device and connect with one of the
          methods below.
        </p>
        <v-img
          :src="
            require('@/assets/images/hardware-wallets/Ledger_Device_main.svg')
          "
          alt="Ledger Wallet"
          max-width="21em"
          max-height="10em"
          class="mb-10 ml-10"
          contain
        />
      </div>
    </div>
    <div class="d-flex justify-space-between justify-center text-center mt-5">
      <div class="section-block" @click="ledgerUnlockBle">
        <v-img
          src="@/assets/images/hardware-wallets/Bluetooth.svg"
          alt="Bluetooth"
          max-width="50px"
          max-height="50px"
          class="connect-img"
        />
        <div class="buttonTitle mew-heading-3 mt-8">Connect via Bluetooth</div>
        <div class="mew-label mb-10 label">Ledger Nano X Only</div>
      </div>
      <div class="section-block" @click="ledgerUnlock">
        <v-img
          src="@/assets/images/hardware-wallets/USB.svg"
          alt="USB"
          max-width="50px"
          max-height="50px"
          class="connect-img"
        />
        <div class="buttonTitle mew-heading-3 mt-8">Connect via USB</div>
        <div class="mew-label mb-10 label">All Ledgers</div>
      </div>
    </div>
    <div>
      <mew-alert
        class="mt-5"
        title="Device not showing when pairing on Google Chrome?"
        description="You may have to allow backend permissions."
        theme="warning"
        hide-close-icon
        :link-object="article"
      />
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'AccessWalletLedger',
  components: {
    AccessWalletDerivationPath: () => import('./AccessWalletDerivationPath.vue')
  },
  props: {
    ledgerApps: {
      type: Array,
      default: () => []
    },
    ledgerUnlock: {
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
      article: {
        text: 'See article here for instructions',
        url: 'https://winaero.com/enable-or-disable-bluetooth-device-permissions-in-google-chrome/'
      }
    };
  },
  computed: {
    ...mapGetters('wallet', ['getLedgerApp', 'initialLoad']),
    ledgerApp() {
      return this.getLedgerApp;
    }
  },
  watch: {
    ledgerApp() {
      this.setPath(this.paths[0]);
    }
  },
  methods: {
    ...mapActions('wallet', ['setLedgerApp']),
    ledgerUnlockBle() {
      this.$emit('setBluetoothLedgerUnlock');
    },
    handleApp(e) {
      this.setLedgerApp(e);
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
.buttonTitle {
  color: #1eb19b;
}
.connect-img {
  margin-top: 50px;
  margin-left: 140px;
}
.sheet {
  background-color: #ebfaf8;
  border-radius: 12px;
}
.para {
  width: 300px;
}
.label {
  color: #999999;
  font-size: 14px;
}
.font-wrapping {
  text-align: center;
  white-space: pre-wrap;
  word-break: break-word;
}

.ble-article-link {
  color: #05c0a5;
}
.section-block {
  height: 200px;
  width: 330px;
  border-radius: 12px;
  left: 0px;
  top: 0px;
  box-sizing: border-box;
  border: 2px solid var(--v-greyMedium-base);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  margin: 8px 0px;
  position: relative;
}
.section-block:hover {
  cursor: pointer;
  border: 2px solid #1eb19b;
  background-color: #e5eaee;
}
.selected {
  border: 2px solid #1eb19b;
}
.derivation-path {
  margin-left: auto;
}
.network-selection {
  max-width: 342px;
}
</style>
