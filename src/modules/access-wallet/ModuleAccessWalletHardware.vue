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
    :back="showBack ? null : back"
    :close="overlayClose"
    content-size="xlarge"
  >
    <div
      v-if="step === 1"
      :class="[
        'pa-5 mb-4 full-width text-center rounded subtitle-container',
        $vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? 'mt-3' : ''
      ]"
    >
      <span class="full-width"
        >The highest standard of security in the crypto space.
        <router-link to="/buy-hardware">
          Get a Hardware Wallet today
        </router-link>
      </span>
    </div>
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
          <mew-button
            has-full-width
            style="height: 90px"
            color-theme="greyMedium"
            btn-style="outline"
            @click.native="
              button.bluetooth && !bluetooth
                ? (bluetoothModal = true)
                : setWalletInstance(button)
            "
          >
            <div class="text-left d-flex align-center" style="width: 100%">
              <img width="40" class="mr-4" :src="button.icon" />
              <div class="mew-heading-3 textDark--text">
                {{ button.label }}
              </div>
            </div>
          </mew-button>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="bluetoothModal" persistent max-width="500">
      <v-sheet color="white" class="pa-5">
        <h2 class="mb-5 text-center">Bluetooth Required</h2>
        <v-list>
          <h3>Supported Browsers</h3>
          <v-list-item v-for="(browser, i) in supportedBrowsers" :key="i">
            <v-list-item-content>
              <v-list-item-title>
                {{ browser }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <h4 class="mb-5">* Remember to enable bluetooth on your device</h4>
        <h3 class="mb-5 text-center">Enable bluetooth on supported browsers</h3>
        <v-expansion-panels
          v-for="(browser, i) in enableBluetooth"
          :key="i"
          class="mt-1"
          accordion
        >
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ browser.title }}
            </v-expansion-panel-header>
            <v-expansion-panel-content
              v-for="(direction, browserIndex) in browser.direction"
              :key="browserIndex"
            >
              <h4 class="mb-3">{{ direction.title }}</h4>
              <ul v-for="(s, index) in direction.steps" :key="index">
                <li v-if="s.length" class="mb-1">
                  {{ s }}
                </li>
                <li v-if="!s.length" class="mb-1">
                  <a :href="s.link" target="_blank">Learn More</a>
                </li>
              </ul>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <div class="text-center">
          <mew-button
            class="mt-6"
            title="Close"
            btn-size="xlarge"
            btn-style="outline"
            @click.native="bluetoothModal = false"
          />
        </div>
      </v-sheet>
    </v-dialog>
    <!--
            =====================================================================================
              Step 2: Start Access to Selected Hardware Wallet
            =====================================================================================
            -->
    <div v-if="step <= walletInitialized" class="full-width">
      <!--
        =====================================================================================
          Bitbox2
        =====================================================================================
        -->
      <access-wallet-bitbox
        v-if="onBitbox2"
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
        :set-path="setPath"
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
        v-if="onLedger || onLedgerX"
        :ledger-unlock="nextStep"
        :ledger-apps="ledgerApps"
        :paths="paths"
        :selected-path="selectedPath"
        :set-path="setPath"
        @setBluetoothLedgerUnlock="setBluetoothLedgerUnlock"
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
      v-if="step > walletInitialized"
      :back="null"
      :hide-path-selection="onKeepkey || onLedger"
      :disable-custom-paths="onLedger"
      :handler-wallet="hwWalletInstance"
      :selected-path="selectedPath"
      :paths="paths"
      :hide-networks="switchAddress"
      @unlock="setHardwareWallet"
      @setPath="setPath"
    />
  </mew-overlay>
</template>

<script>
import { isEmpty, isObject } from 'lodash';
import { mapActions, mapGetters, mapState } from 'vuex';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

import appPaths from './hardware/handlers/hardwares/ledger/appPaths.js';
import allPaths from '@/modules/access-wallet/hardware/handlers/bip44';
import wallets from '@/modules/access-wallet/hardware/handlers/configs/configWallets';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { EventBus } from '@/core/plugins/eventBus.js';

import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  name: 'HardwareAccessOverlay',
  components: {
    AccessWalletKeepkey: () =>
      import('./hardware/components/AccessWalletKeepkey'),
    AccessWalletCoolWallet: () =>
      import('./hardware/components/AccessWalletCoolWallet'),
    AccessWalletTrezor: () =>
      import('./hardware/components/AccessWalletTrezor.vue'),
    AccessWalletLedger: () =>
      import('./hardware/components/AccessWalletLedger.vue'),
    AccessWalletLedgerX: () =>
      import('./hardware/components/AccessWalletLedgerX.vue'),
    AccessWalletAddressNetwork: () =>
      import(
        '@/modules/access-wallet/common/components/AccessWalletAddressNetwork'
      ),
    AccessWalletBitbox: () => import('./hardware/components/AccessWalletBitbox')
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
  data: () => ({
    buttons: [
      {
        label: 'Ledger',
        icon: require('@/assets/images/icons/hardware-wallets/Ledger-Nano-X-Label-Icon.svg'),
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
        type: WALLET_TYPES.COOL_WALLET,
        bluetooth: true
      }
    ],
    enableBluetooth: [
      {
        title: 'Chrome',
        direction: [
          {
            title: 'Enable experimental flags',
            steps: [
              'chrome://flags/#enable-web-bluetooth',
              'chrome://flags/#enable-web-bluetooth-new-permissions-backend',
              'chrome://flags/#enable-experimental-web-platform-features'
            ]
          },
          {
            title: 'Official browser directions',
            steps: [
              {
                link: 'https://support.google.com/chrome/answer/6362090?hl=en&co=GENIE.Platform%3DDesktop'
              }
            ]
          }
        ]
      },
      {
        title: 'Opera',
        direction: [
          {
            title: 'Enable experimental flags',
            steps: [
              'opera://flags/#enable-web-bluetooth-new-permissions-backend',
              'opera://flags/#enable-experimental-web-platform-features'
            ]
          }
        ]
      },
      {
        title: 'Edge',
        direction: [
          {
            title: 'Official browser directions',
            steps: [
              {
                link: 'https://support.microsoft.com/en-us/microsoft-edge/connect-a-website-to-a-bluetooth-or-usb-device-in-microsoft-edge-107ba8a4-60aa-0fd3-2d26-afd63d0964f4'
              }
            ]
          }
        ]
      }
    ],
    bluetooth: false,
    bluetoothModal: false,
    supportedBrowsers: ['Chrome', 'Edge', 'Opera'],
    ledgerApps: appPaths.map(item => {
      return {
        name: item.network.name_long,
        value: item.network.name,
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
    passwordError: false,
    transport: null,
    address: '',
    ledgerBluetooth: false
  }),
  computed: {
    ...mapGetters('global', ['Networks', 'network']),
    ...mapGetters('wallet', ['getLedgerApp']),
    ...mapState('wallet', ['identifier', 'ledgerBLE']),
    walletInitialized() {
      return this.wallets[this.walletType]
        ? this.wallets[this.walletType]?.when
        : 1;
    },
    /**
     * Returns the correct network icon
     */
    icon() {
      if (this.getLedgerApp !== null) {
        const found = appPaths.find(item => {
          return item.network.name_long === this.getLedgerApp.name;
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
        url: 'https://help.myetherwallet.com/en/collections/3043244-access-wallet'
      };
    },
    showBack() {
      if (this.switchAddress) {
        return this.step === 2;
      }

      return this.step === 1;
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
      return this.walletType == WALLET_TYPES.LEDGER;
    },
    /**
     * On Ledger X
     */
    onLedgerX() {
      return this.walletType === WALLET_TYPES.LEDGER;
    },
    /**
     * On CoolWallet
     */
    onCoolWallet() {
      return (
        this.walletType === WALLET_TYPES.COOL_WALLET &&
        isEmpty(this.hwWalletInstance)
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
        if (this.getLedgerApp !== null) {
          const found = appPaths.find(item => {
            return item.network.name_long === this.getLedgerApp.name;
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
    /**
     * Overlay title
     */
    title() {
      if (this.switchAddress) return 'Switch Address';
      if (this.step > this.walletInitialized) {
        return 'Select Network and Address';
      } else if (this.step === 1) {
        return 'Select a hardware wallet';
      }
      if (this.onBitbox2) return this.bitbox2Titles;
      return this.walletType
        ? this.wallets[this.walletType].title
        : 'Select a hardware wallet';
    },
    bitBox2NotPaired() {
      return (
        isEmpty(this.hwWalletInstance) ||
        (!isEmpty(this.hwWalletInstance) && !this.hwWalletInstance?.status)
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
      if (this.bitBox2Connected) return 'Enter BitBox02 password';
      if (this.bitBox2Unpaired) return 'Confirm pairing code';
      if (this.bitBox2Initialized)
        return 'BitBox02 succesfully initialized. Loading wallet';
      return this.walletType ? this.wallets[this.walletType].title : '';
    }
  },
  watch: {
    selectedPath: {
      handler: function () {
        /**
         * only call this when hwWalletInstance is not empty (ledger will error out)
         * and when walletType has been selected (closing modal will error out)
         */
        if (this.walletType && !isEmpty(this.hwWalletInstance)) {
          this.hwWalletInstance = {};
          this[`${this.walletType}Unlock`]();
        }
      },
      deep: true
    },
    open(newVal) {
      if (newVal && this.switchAddress) this.setupSwitchAddress();
    }
  },
  async mounted() {
    /**
     * errors and resets for disconnect of ble
     */
    EventBus.$on('bleDisconnect', () => {
      this.reset();
    });

    try {
      const { bluetooth } = navigator;
      if (!bluetooth) return (this.bluetooth = false);
      this.bluetooth = await bluetooth.getAvailability();
    } catch (e) {
      Toast(e, {}, ERROR);
    }
  },
  methods: {
    ...mapActions('wallet', [
      'setWallet',
      'setLedgerBluetooth',
      'setLedgerApp'
    ]),
    /**
     * Resets the Data
     */
    reset() {
      this.step = 1;
      this.hwWalletInstance = {};
      this.selectedPath = this.paths[0];
      //this.setLedgerApp(this.ledgerApps[0]);
      this.password = '';
      this.walletType = '';
      this.ledgerConnected = false;
      this.ledgerBluetooth = false;
    },
    /**
     * Sets up switch address
     */
    setupSwitchAddress() {
      this.walletType = this.identifier;
      if (this.identifier === WALLET_TYPES.LEDGER) {
        this.ledgerBluetooth = this.ledgerBLE;
      }
      this.nextStep();
    },
    /**
     * calls this.close and this.setupSwitchAddress
     */
    closeAndSetupSwitch() {
      this.reset();
      this.setupSwitchAddress();
      this.close();
    },
    /**
     * Overlay Action: Back
     * if on keepkey step 3, it will return to step 1 so it will reset everything
     */
    back() {
      if (this.step > 0) {
        if (this.step === 1) {
          this.reset();
        } else if (this.step === 2) {
          this.step = 1;
          this.walletType = '';
        } else {
          this.hwWalletInstance = {};
          if (this.onLedger || this.onLedgerX) {
            this.step = 2;
            //this[`${this.walletType}Unlock`]();
          } else {
            this.walletType = '';
            this.step = 1;
          }
        }
      } else {
        this.close('showHardware');
      }
    },
    overlayClose() {
      this.reset();
      this.close('showHardware');
    },
    trezorClose() {
      this.step = 2;
      this.walletType = WALLET_TYPES.TREZOR;
    },
    setWalletInstance(btnObj) {
      this.walletType = btnObj.type;
      this.nextStep();
    },
    nextStep() {
      if (this.walletType) {
        this.step++;
        if (this.step === this.walletInitialized) {
          if (this.onCoolWallet || this.onBitbox2) return;
          this[`${this.walletType}Unlock`]();
        }
      }
    },
    /**
     * Unlock the hardware wallets
     */
    ledgerUnlock() {
      if (this.ledgerBluetooth) {
        this.bluetoothLedgerUnlock();
      } else {
        this.unlockPathOnly();
      }
    },
    setBluetoothLedgerUnlock() {
      this.ledgerBluetooth = true;
      this.nextStep();
    },
    bluetoothLedgerUnlock() {
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
      const path = isObject(this.selectedPath)
        ? this.selectedPath.hasOwnProperty('value')
          ? this.selectedPath?.value
          : this.selectedPath
        : this.paths[0].value;
      this.wallets[this.walletType]
        .create(path, this.ledgerBluetooth, this.getLedgerApp)
        .then(_hwWallet => {
          try {
            this.loaded = true;
            if (this.onLedgerX || this.onLedger) this.nextStep();
            if ((this.onTrezor || this.onKeepkey) && this.step === 2)
              this.step++;
            if (this.onBitbox2) {
              this.hwWalletInstance = _hwWallet;
              if (!this.hwWalletInstance) {
                this.wallets[this.walletType].create.errorHandler(
                  'bitboxInstanceError'
                );
                return;
              }
              this.hwWalletInstance
                .init()
                .then(() => {
                  this.nextStep();
                })
                .catch(e => {
                  this.wallets[this.walletType].create.errorHandler(e);
                  if (e.message === 'Error: Pairing rejected') {
                    this.reset();
                  }
                });
            } else {
              this.hwWalletInstance = _hwWallet;
            }
          } catch (err) {
            this.wallets[this.walletType].create.errorHandler(err);
          }
        })
        .catch(err => {
          if (this.onLedger || this.onLedgerX) this.step--;
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
            if (!this.switchAddress) {
              if (wallet.identifier === WALLET_TYPES.LEDGER) {
                this.setLedgerBluetooth(this.ledgerBluetooth);
              }
              this.$router.push({ name: ROUTES_WALLET.DASHBOARD.NAME });
            } else {
              this.reset();
              this.close();
            }
          })
          .catch(e => {
            this.reset();
            Toast(e, {}, ERROR);
          });
      } catch (e) {
        this.reset();
        Toast(e, {}, ERROR);
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
