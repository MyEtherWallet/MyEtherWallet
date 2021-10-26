<template>
  <!--
=====================================================================================
  Overlay - access using hardware
=====================================================================================
-->
  <mew-overlay
    :footer="{
      text: step === 1 ? 'Need help? Read about' : 'Need help? Read',
      linkTitle: footerLink.title,
      link: footerLink.url
    }"
    :show-overlay="open"
    :title="title"
    :back="step === 1 ? null : back"
    :close="overlayClose"
    content-size="xlarge"
  >
    <v-row
      v-if="step === 1"
      :class="[
        'pa-5 mb-4 full-width text-center rounded subtitle-container',
        $vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? 'mt-3' : ''
      ]"
      ><span class="full-width"
        >The highest standard of security in the crypto space.
        <router-link to="/buy-hardware">
          Get a Hardware Wallet today
        </router-link>
      </span></v-row
    >
    <!--
        =====================================================================================
        Step 1: Select hardware wallet
        =====================================================================================
        -->
    <div v-if="step === 1">
      <!--
      =====================================================================================
        Different hardware instances
      =====================================================================================
      -->
      <v-row dense no-gutters justify="start">
        <v-col
          v-for="button in buttons"
          :key="button.label"
          class="button-container full-width pa-1"
          cols="12"
          sm="6"
        >
          <mew-super-button-revised
            :title="button.label"
            :left-icon="button.icon"
            @click.native="setWalletInstance(button.type)"
          />
        </v-col>
      </v-row>
    </div>
    <!--
            =====================================================================================
              Step 2: Start Access to Selected Hardware Wallet
            =====================================================================================
            -->
    <div v-if="step === 2" class="full-width">
      <!--
        =====================================================================================
          Bitbox2
        =====================================================================================
        -->
      <access-wallet-bitbox
        v-if="onBitbox2"
        :selected-path="selectedPath"
        :paths="paths"
        :set-path="setPath"
        :hw-wallet-instance="hwWalletInstance"
        :unlock="bitbox02Unlock"
        :device-not-paired="bitBox2NotPaired"
        :device-connected="bitBox2Connected"
        :device-unpaired="bitBox2Unpaired"
        :device-pairing-code="bitBox2PairingCode"
        :device-confirmed="bitBox2Confirmed"
        :device-initialized="bitBox2Initialized"
      />
      <!--
        =====================================================================================
          Keepkey
        =====================================================================================
        -->
      <access-wallet-keepkey
        v-if="onKeepkey"
        :paths="paths"
        :selected-path="selectedPath"
        :handler-loaded="loaded"
        @setPath="setPath"
      />
      <!--
        =====================================================================================
          Cool Wallet
        =====================================================================================
        -->
      <access-wallet-cool-wallet
        v-if="onCoolWallet"
        :cool-wallet-unlock="coolWalletUnlock"
        :password-error="passwordError"
        @password="setPassword"
      />
      <!--
        =====================================================================================
          Ledger
        =====================================================================================
        -->
      <access-wallet-ledger
        v-if="onLedger"
        :ledger-unlock="nextStep"
        :ledger-apps="ledgerApps"
        :ledger-connected="ledgerConnected"
        :paths="paths"
        :selected-path="selectedPath"
        @setPath="setPath"
      />

      <!--
        =====================================================================================
          Trezor
        =====================================================================================
        -->
      <div v-if="onTrezor">
        <access-wallet-trezor :trezor-unlock="trezorUnlock" :reset="reset" />
      </div>
    </div>
    <!--
      =====================================================================================
        Step 3: Select Address and Network | (If Applicable) 
      =====================================================================================
      -->
    <!--
    =====================================================================================
    Network Address Step
    =====================================================================================
    -->
    <access-wallet-address-network
      v-if="step === 3"
      :back="null"
      :hide-custom-paths="onKeepkey || onLedger"
      :handler-wallet="hwWalletInstance"
      :selected-path="selectedPath"
      :paths="paths"
      @unlock="setHardwareWallet"
      @setPath="setPath"
    />
  </mew-overlay>
</template>

<script>
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { _ } from 'web3-utils';
import AccessWalletBitbox from './hardware/components/AccessWalletBitbox';
import AccessWalletAddressNetwork from '@/modules/access-wallet/common/components/AccessWalletAddressNetwork';
import AccessWalletKeepkey from './hardware/components/AccessWalletKeepkey';
import AccessWalletCoolWallet from './hardware/components/AccessWalletCoolWallet';
import AccessWalletTrezor from './hardware/components/AccessWalletTrezor.vue';
import AccessWalletLedger from './hardware/components/AccessWalletLedger.vue';
import appPaths from './hardware/handlers/hardwares/ledger/appPaths.js';
import allPaths from '@/modules/access-wallet/hardware/handlers/bip44';
import wallets from '@/modules/access-wallet/hardware/handlers/configs/configWallets';
import { mapActions, mapGetters, mapState } from 'vuex';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
// TODO: add these changes to mew components
import MewSuperButtonRevised from '@/components/mew-super-button-revised/MewSuperButtonRevised';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  name: 'HardwareAccessOverlay',
  components: {
    AccessWalletKeepkey,
    MewSuperButtonRevised,
    AccessWalletCoolWallet,
    AccessWalletTrezor,
    AccessWalletLedger,
    AccessWalletAddressNetwork,
    AccessWalletBitbox
  },
  filters: {
    concatAddress(val) {
      // should probably be moved globablly
      return `${val.substring(0, 11)}...${val.substring(
        val.length - 4,
        val.length
      )}`;
    }
  },
  mixins: [handlerAnalytics],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    close: {
      type: Function,
      default: () => {}
    },
    switchAddress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      buttons: [
        {
          label: 'Ledger',
          icon: require('@/assets/images/icons/hardware-wallets/icon-ledger.svg'),
          type: WALLET_TYPES.LEDGER
        },
        {
          label: 'Trezor',
          icon: require('@/assets/images/icons/hardware-wallets/icon-trezor.svg'),
          type: WALLET_TYPES.TREZOR
        },
        {
          label: 'KeepKey',
          icon: require('@/assets/images/icons/hardware-wallets/icon-keepkey.svg'),
          type: WALLET_TYPES.KEEPKEY
        },
        {
          label: 'BitBox02',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg'),
          type: WALLET_TYPES.BITBOX2
        },
        {
          label: 'CoolWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-coolwallet.svg'),
          type: WALLET_TYPES.COOL_WALLET
        }
      ],
      ledgerApps: appPaths.map(item => {
        return {
          name: item.network.name_long,
          value: item.network.name_long,
          img: item.network.icon
        };
      }),
      wallets: wallets,
      step: 1,
      hwWalletInstance: {},
      ledgerApp: {},
      selectedPath: {
        name: 'Ethereum',
        value: "m/44'/60'/0'/0"
      },
      walletType: '',
      selectedLedgerApp: {},
      password: '',
      loaded: false,
      ledgerConnected: false,
      callback: () => {},
      unwatch: () => {},
      passwordError: false
    };
  },
  computed: {
    ...mapGetters('global', ['Networks', 'network']),
    ...mapState('wallet', ['identifier']),
    /**
     * Returns the correct network icon
     */
    icon() {
      if (this.selectedLedgerApp !== null) {
        const found = appPaths.find(item => {
          return item.network.name_long === this.selectedLedgerApp.name;
        });
        return found ? found.network.icon : appPaths[0].network.icon;
      }
      return appPaths[0].network.icon;
    },
    /**
     * Footer links to display beneath container
     * TODO: get link urls from Russ
     */
    footerLink() {
      // Commented for now as the new articles aren't available yet
      // if (this.onKeepkey) {
      //   return {
      //     title: 'Using a KeepKey Hardware wallet with MEW',
      //     url: 'https://kb.myetherwallet.com/en/hardware-wallets/using-keepkey-with-mew/'
      //   };
      // } else if (this.onCoolWallet) {
      //   return {
      //     title: 'Using a CoolWallet Hardware Wallet with MEW',
      //     url: 'https://kb.myetherwallet.com/en/hardware-wallets/using-coolwallet-with-mew/'
      //   };
      // }
      // if (this.onLedger) {
      //   return {
      //     title: 'Using a Ledger Hardware wallet with MEW',
      //     url: 'https://kb.myetherwallet.com/en/hardware-wallets/using-ledger-with-mew/'
      //   };
      // }
      // if (this.onTrezor) {
      //   return {
      //     title: 'Using a Trezor Hardware wallet with MEW',
      //     url: 'https://kb.myetherwallet.com/en/hardware-wallets/using-trezor-with-mew/'
      //   };
      // }
      return {
        title: 'Hardware Wallets',
        url: 'https://help.myetherwallet.com/en/'
      };
    },
    /**
     * On Bitbox2
     */
    onBitbox2() {
      return this.walletType === WALLET_TYPES.BITBOX2;
    },
    /**
     * On Ledger
     */
    onLedger() {
      return this.walletType === WALLET_TYPES.LEDGER;
    },
    /**
     * On CoolWallet
     */
    onCoolWallet() {
      return (
        this.walletType === WALLET_TYPES.COOL_WALLET &&
        _.isEmpty(this.hwWalletInstance)
      );
    },
    /**
     * On Keepkey
     */
    onKeepkey() {
      return this.walletType === WALLET_TYPES.KEEPKEY;
    },
    /**
     * On Trezor
     */
    onTrezor() {
      return this.walletType === WALLET_TYPES.TREZOR;
    },
    /**
     * On Password step
     */
    onPassword() {
      return (
        this.walletType !== '' &&
        this.wallets[this.walletType] &&
        this.wallets[this.walletType].requiresPassword &&
        (this.step === 3 || this.step === 1)
      );
    },
    /**
     * On Paths step
     */
    paths() {
      const newArr = [];
      if (this.walletType === WALLET_TYPES.LEDGER) {
        if (this.selectedLedgerApp !== null) {
          const found = appPaths.find(item => {
            return item.network.name_long === this.selectedLedgerApp.name;
          });
          const path = found ? found.paths : appPaths[0].paths;
          return path.map(item => {
            return {
              name: item.label,
              value: item.path
            };
          });
        }

        appPaths[0].paths.forEach(item => {
          newArr.push({
            name: item.label,
            value: item.path
          });
        });
      }
      if (
        this.wallets[this.walletType] &&
        this.wallets[this.walletType].hasPaths
      ) {
        allPaths[this.walletType].forEach(item => {
          newArr.push({
            name: item.label,
            value: item.path
          });
        });
      }
      return newArr;
    },
    hasPath() {
      return this.selectedPath && this.selectedPath.hasOwnProperty('value')
        ? this.selectedPath.value
        : this.selectedPath;
    },
    /**
     * Overlay title
     */
    title() {
      if (this.step > this.wallets[this.walletType]?.when) {
        return 'Select Network and Address';
      } else if (this.step === 1) {
        return 'Select a hardware wallet';
      }
      if (this.onBitbox2) return this.bitbox2Titles;
      return this.wallets[this.walletType].title;
    },
    bitBox2NotPaired() {
      return (
        _.isEmpty(this.hwWalletInstance) ||
        (!_.isEmpty(this.hwWalletInstance) && !this.hwWalletInstance?.status)
      );
    },
    bitBox2Connected() {
      return (
        !this.bitBox2NotPaired && this.hwWalletInstance?.status === 'connected'
      );
    },
    bitBox2Unpaired() {
      return (
        !this.bitBox2NotPaired && this.hwWalletInstance?.status === 'unpaired'
      );
    },
    bitBox2Initialized() {
      return (
        !this.bitBox2NotPaired &&
        this.hwWalletInstance?.status === 'initialized'
      );
    },
    bitBox2PairingCode() {
      return !this.bitBox2NotPaired ? this.hwWalletInstance?.pairingCode : '';
    },
    bitBox2Confirmed() {
      return !this.bitBox2NotPaired
        ? this.hwWalletInstance?.pairingConfirmed
        : false;
    },
    bitbox2Titles() {
      if (this.bitBox2Connected) return 'Enter Bitbox 02 password';
      if (this.bitBox2Unpaired) return 'Confirm pairing code';
      if (this.bitBox2Initialized)
        return 'Bitbox 02 succesfully initialized. Loading wallet';
      return this.wallets[this.walletType].title;
    }
  },
  watch: {
    selectedPath: {
      handler: function () {
        if (this.walletType) this[`${this.walletType}Unlock`]();
      },
      deep: true
    }
  },
  mounted() {
    if (this.switchAddress) {
      this.nextStep(this.identifier);
      this.walletType = this.identifier;
    }
  },
  methods: {
    ...mapActions('wallet', ['setWallet']),
    /**
     * Resets the Data
     */
    reset() {
      this.step = 1;
      this.hwWalletInstance = {};
      this.selectedPath = this.paths[0];
      this.selectedLedgerApp = this.ledgerApps[0];
      this.password = '';
      this.walletType = '';
    },
    /**
     * Overlay Action: Back
     * if on keepkey step 3, it will return to step 1 so it will reset everything
     */
    back() {
      !this.step ? this.close('showHardware') : (this.step -= 1);
      if (this.onKeepkey && this.step === 2) {
        this.step = 1;
      }
      this.step === 1 ? this.reset() : '';
      this.step === 2 ? (this.hwWalletInstance = {}) : null;
    },
    overlayClose() {
      this.reset();
      this.close('showHardware');
    },
    trezorClose() {
      this.step = 2;
      this.walletType = WALLET_TYPES.TREZOR;
    },
    setWalletInstance(str) {
      this.walletType = str;
      this.nextStep();
    },
    nextStep() {
      if (this.walletType) {
        this.step++;
        if (this.step === this.wallets[this.walletType].when) {
          if (
            this.walletType === WALLET_TYPES.COOL_WALLET ||
            this.walletType === WALLET_TYPES.BITBOX2
          )
            return;
          this[`${this.walletType}Unlock`]();
        }
      }
    },
    /**
     * Unlock the hardware wallets
     */
    ledgerUnlock() {
      this.unlockPathOnly();
    },
    trezorUnlock() {
      this.unlockPathOnly();
    },
    bitbox02Unlock() {
      this.unlockPathOnly();
    },
    keepkeyUnlock() {
      this.unlockPathOnly();
    },
    coolWalletUnlock() {
      this.unlockPathAndPassword(null, this.password);
    },
    /**
     * Unlock only the path step
     */
    unlockPathOnly() {
      return this.wallets[this.walletType]
        .create(this.hasPath)
        .catch(err => {
          Toast(err, {}, ERROR);
          if (this.onLedger) this.step--;
          return;
        })
        .then(_hwWallet => {
          this.loaded = true;
          this.hwWalletInstance = _hwWallet;
          if (this.onLedger) this.ledgerConnected = true;
          if (this.onKeepkey || this.onTrezor) this.step++;
          if (this.onBitbox2) {
            _hwWallet
              .init(this.hasPath)
              .then(() => {
                this.nextStep();
                this.hwWalletInstance = _hwWallet;
              })
              .catch(e => {
                this.wallets[this.walletType].create.errorHandler(e);
                if (e.message === 'Error: Pairing rejected') {
                  this.reset();
                }
              });
          }
          return _hwWallet;
        })
        .catch(err => {
          if (this.wallets[this.walletType]) {
            this.wallets[this.walletType].create.errorHandler(err);
          } else {
            Toast(err, {}, ERROR);
          }
          this.onTrezor ? this.trezorClose : this.reset();
        });
    },
    /**
     * Unlock the path and password step
     */
    unlockPathAndPassword(path, password) {
      this.wallets[this.walletType]
        .create(path, password)
        .then(_hwWallet => {
          this.hwWalletInstance = _hwWallet;
          this.step++;
        })
        .catch(e => {
          if (this.wallets[this.walletType]) {
            if (
              e.message === 'Wrong Password' &&
              this.walletType === WALLET_TYPES.COOL_WALLET
            ) {
              this.passwordError = true;
            } else {
              this.wallets[this.walletType].create.errorHandler(e);
            }
          } else {
            Toast(e, {}, ERROR);
          }
          if (e.message !== 'Wrong Password') {
            this.reset();
          }
        });
    },
    /**
     * Sets Path
     */
    setPath(obj) {
      this.selectedPath = obj;
    },
    /**
     * Set the selected wallet
     */
    setHardwareWallet(wallet) {
      try {
        this.setWallet([wallet])
          .then(() => {
            this.trackAccessWallet(wallet.identifier);
            if (!this.switchAddress)
              this.$router.push({ name: ROUTES_WALLET.DASHBOARD.NAME });
            else this.close();
          })
          .catch(e => {
            this.reset();
            Toast(e.message, {}, ERROR);
          });
      } catch (e) {
        this.reset();
        Toast(e.message, {}, ERROR);
      }
    },
    /**
     * Sets Password
     */
    setPassword(str) {
      this.password = str;
      this.passwordError = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.subtitle-container {
  background-color: rgba(109, 137, 166, 0.06);
}
.button-container {
  height: 100px;
}

@media screen and (min-width: 800px) {
  .expand-width {
    min-width: 740px;
  }
}
</style>
