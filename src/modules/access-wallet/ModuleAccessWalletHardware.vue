<template>
  <!--
=====================================================================================
  Overlay - access using hardware
=====================================================================================
-->
  <mew-overlay
    description="Select a hardware wallet to access. Make sure your device is connected and unlocked."
    :show-overlay="open"
    :title="title"
    right-btn-text="Cancel"
    :back="back"
    :close="overlayClose"
    :left-btn-text="step > 0 ? 'Back' : ''"
  >
    <template #mewOverlayBody>
      <div class="expand-width">
        <!--
        =====================================================================================
        Step 0: Select hardware wallet
        =====================================================================================
        -->
        <div v-if="step === 0">
          <v-sheet color="transparent" :max-width="740">
            <v-row justify="start">
              <v-col
                v-for="button in buttons"
                :key="button.label"
                class="button-container"
                cols="12"
                md="6"
              >
                <mew-super-button
                  :title="button.label"
                  :cols-num="6"
                  color-theme="basic"
                  right-icon-type="img"
                  :right-icon="button.icon"
                  :right-icon-height="45"
                  @click.native="nextStep(button.type)"
                />
              </v-col>
            </v-row>
          </v-sheet>
        </div>
        <div v-if="step > 0">
          <mew-stepper :items="extraStepDetails" :on-step="stepperStep">
            <!--
            =====================================================================================
              Step 1: Start Access Selected Wallet
            =====================================================================================
            -->
            <template v-if="stepperStep === 2" #stepperContent2>
              <!--
            =====================================================================================
            BcVault
            =====================================================================================
            -->
              <access-wallet-bc-vault
                v-if="onBCVault"
                :accounts="accounts"
                :loading="bcVaultLoading"
                :set-address="setBCvaultAddress"
              />
              <!--
            =====================================================================================
             Qr Step (Finney , XWallet)
            =====================================================================================
            -->
              <access-wallet-qr-code
                v-else-if="onQrCode"
                :on-xwallet="onXwallet"
                :qr-code="qrCode"
              />
              <!--
            =====================================================================================
             Bitbox
            =====================================================================================
            -->
              <access-wallet-bitbox
                v-else-if="onBitbox"
                :set-selected-bitbox="setSelectedBitbox"
              />
              <!--
            =====================================================================================
            Password Step (Coolwallet, Secalot)
            =====================================================================================
            -->
              <access-wallet-password
                v-else-if="onPassword"
                :on-cool-wallet="onCoolWallet"
                :next-step="nextStep"
                :wallet-type="walletType"
                @setTerms="setTerms"
                @setPassword="setPassword"
              />
              <!--
            =====================================================================================
            Paths Step (Ledger, Trezor)
            =====================================================================================
            -->
              <access-wallet-paths
                v-else-if="onPaths"
                :ledger-apps="ledgerApps"
                :paths="paths"
                :on-ledger="onLedger"
                :icon="icon"
                :next-step="nextStep"
                @setPath="setPath"
                @setLedgerApp="setLedgerApp"
              />
            </template>
            <!--
            =====================================================================================
              Step 3: Select Network Address or Enter Pin | (If Applicable)
            =====================================================================================
            -->
            <template v-if="stepperStep === 3" #stepperContent3>
              step 3
              <!--
              =====================================================================================
              Pin Step
              =====================================================================================
              -->
              <access-wallet-pin
                v-if="enterPin"
                :keep-key-pin-enter="callback"
                :wallet-type="walletType"
              />
              <!--
              =====================================================================================
              Network Address Step
              =====================================================================================
              -->
              <access-wallet-network-addresses
                v-else-if="onNetworkAddresses"
                :accounts="accounts"
                :next-address-set="nextAddressSet"
                :previous-address-set="previousAddressSet"
                :set-hardware-wallet="setHardwareWallet"
                :address-page="addressPage"
              />
            </template>
            <!--
            =====================================================================================
              Step 4: Select Address and Network | (If Applicable)
            =====================================================================================
            -->
            <template v-if="stepperStep === 4" #stepperContent4>
              <div>
                <!--
                =====================================================================================
                Network Address Step
                =====================================================================================
                -->
                <access-wallet-network-addresses
                  :accounts="accounts"
                  :next-address-set="nextAddressSet"
                  :previous-address-set="previousAddressSet"
                  :set-hardware-wallet="setHardwareWallet"
                  :address-page="addressPage"
                />
              </div>
            </template>
          </mew-stepper>
        </div>
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import AccessWalletBcVault from './hardware/components/AccessWalletBcVault';
import AccessWalletQrCode from './hardware/components/AccessWalletQrCode';
import AccessWalletBitbox from './hardware/components/AccessWalletBitbox';
import AccessWalletNetworkAddresses from './hardware/components/AccessWalletNetworkAddresses';
import AccessWalletPassword from './hardware/components/AccessWalletPassword';
import AccessWalletPaths from './hardware/components/AccessWalletPaths';
import AccessWalletPin from './hardware/components/AccessWalletPin';
import appPaths from './hardware/handlers/hardwares/ledger/appPaths.js';
import allPaths from '@/modules/access-wallet/hardware/handlers/bip44';
import wallets from '@/modules/access-wallet/hardware/handlers/configs/configWallets';
import { EventBus } from '@/core/plugins/eventBus';
import { mapActions, mapGetters } from 'vuex';
import { WALLET_TYPES } from '@/modules/access-wallet/hardware/handlers/configs/configWalletTypes.js';
const MAX_ADDRESSES = 5;

export default {
  name: 'HardwareAccessOverlay',
  components: {
    AccessWalletBcVault,
    AccessWalletQrCode,
    AccessWalletBitbox,
    AccessWalletNetworkAddresses,
    AccessWalletPassword,
    AccessWalletPaths,
    AccessWalletPin
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
  props: {
    open: {
      type: Boolean,
      default: false
    },
    close: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      stepperItems: [
        {
          step: 1,
          name: 'Select Hardware Wallet'
        }
      ],
      positions: ['7', '8', '9', '4', '5', '6', '1', '2', '3'],
      buttons: [
        {
          label: 'Ledger',
          icon: require('@/assets/images/icons/hardware-wallets/icon-ledger.svg'),
          type: WALLET_TYPES.LEDGER
        },
        {
          label: 'Bitbox',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg'),
          type: WALLET_TYPES.BITBOX
        },
        {
          label: 'FINNEY',
          icon: require('@/assets/images/icons/hardware-wallets/icon-finney.svg'),
          type: WALLET_TYPES.FINNEY
        },
        {
          label: 'Secalot',
          icon: require('@/assets/images/icons/hardware-wallets/icon-secalot.svg'),
          type: WALLET_TYPES.SECALOT
        },
        {
          label: 'KeepKey',
          icon: require('@/assets/images/icons/hardware-wallets/icon-keepkey.svg'),
          type: WALLET_TYPES.KEEPKEY
        },
        {
          label: 'Trezor',
          icon: require('@/assets/images/icons/hardware-wallets/icon-trezor.svg'),
          type: WALLET_TYPES.TREZOR
        },
        {
          label: 'CoolWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-coolwallet.svg'),
          type: WALLET_TYPES.COOL_WALLET
        },
        {
          label: 'BC Vault',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bcvault.svg'),
          type: WALLET_TYPES.BCVAULT
        },
        {
          label: 'XWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-xwallet.svg'),
          type: WALLET_TYPES.XWALLET
        }
      ],
      panelItems: [
        {
          name: 'Network'
        },
        {
          name: 'Address to interact with'
        }
      ],
      ledgerApps: appPaths.map(item => {
        return {
          name: item.network.name_long,
          value: item.network.name_long
        };
      }),
      wallets: wallets,
      // resettable
      step: 0,
      steps: {},
      hwWalletInstance: {},
      selectedPath: {},
      walletType: '',
      selectedLedgerApp: {},
      selectedAddress: '',
      password: '',
      selectedNetwork: '',
      accounts: [],
      currentIdx: 0,
      acceptTerms: false,
      addressPage: 0,
      qrCode: '',
      bcVaultLoading: false,
      walletInstance: {},
      enterPin: false,
      pin: '',
      callback: () => {},
      unwatch: () => {}
    };
  },
  computed: {
    ...mapGetters('global', ['Networks', 'network']),
    stepperStep() {
      return this.step + 1;
    },
    extraSteps() {
      return Object.keys(this.wallets[this.walletType].titles);
    },
    extraStepDetails() {
      if (this.walletType !== '') {
        return Object.keys(this.wallets[this.walletType].titles).reduce(
          (acc, item) => {
            acc.push({
              step: +item + 1,
              name: this.wallets[this.walletType].titles[item].includes(
                'Enter your password'
              )
                ? 'Verify password'
                : this.wallets[this.walletType].titles[item]
            });
            return acc;
          },
          [
            {
              step: 1,
              name: 'Select Hardware Wallet'
            }
          ]
        );
      }
      return [
        {
          step: 1,
          name: 'Select Hardware Wallet'
        }
      ];
    },
    onNetworkAddresses() {
      return (
        Object.keys(this.hwWalletInstance).length > 0 &&
        this.step >= 1 &&
        this.step > this.wallets[this.walletType].when
      );
    },
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
     * On Bitbox
     */
    onBitbox() {
      return (
        this.walletType && this.walletType.includes('bitbox') && this.step === 1
      );
    },
    /**
     * On Bc Vault
     */
    onBCVault() {
      return this.walletType === WALLET_TYPES.BCVAULT;
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
      return this.walletType === WALLET_TYPES.COOL_WALLET;
    },
    /**
     * on QrCode
     */
    onQrCode() {
      return (
        this.walletType !== '' &&
        this.wallets[this.walletType] &&
        this.wallets[this.walletType].needsQr &&
        this.step === this.wallets[this.walletType].when
      );
    },
    /**
     * On XWallet
     */
    onXwallet() {
      return this.walletType === WALLET_TYPES.XWALLET;
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
    onPaths() {
      if (this.enterPin) return false;
      return (
        (this.step >= 1 && this.step <= 3) ||
        (this.walletType !== '' &&
          this.wallets[this.walletType] &&
          this.wallets[this.walletType].hasPaths &&
          this.step < this.wallets[this.walletType].when)
      );
    },
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
      return !this.step
        ? 'Hardware Wallets'
        : this.stepperStep +
            '. ' +
            this.wallets[this.walletType].titles[this.step];
    }
  },
  mounted() {
    // watcher was falling into an infinite loop with keepkey
    this.unwatch = this.$watch('hwWalletInstance', function (newVal) {
      if (Object.keys(newVal).length > 0) {
        try {
          this.setAddresses();
        } catch (e) {
          newVal.errorHandler(e);
        }
        this.unwatch();
      }
    });
  },
  methods: {
    ...mapActions('wallet', ['setWallet']),
    /**
     * Resets the Data
     */
    reset() {
      this.step = 0;
      this.steps = {};
      this.hwWalletInstance = {};
      this.selectedPath = this.paths[0];
      this.walletType = '';
      this.selectedLedgerApp = this.ledgerApps[0];
      this.selectedAddress = '';
      this.password = '';
      this.selectedNetwork = '';
      this.accounts = [];
      this.currentIdx = 0;
      this.acceptTerms = false;
      this.addressPage = 0;
      this.qrCode = '';
      this.walletInstance = {};
      this.enterPin = false;
      this.walletType = '';
    },
    /**
     * Overlay Actions
     */
    back() {
      !this.step
        ? (this.close('showHardware'), delete this.steps[this.step + 1])
        : (this.step -= 1);

      this.step === 0 ? this.reset() : '';
    },
    overlayClose() {
      this.reset();
      this.close('showHardware');
    },
    nextStep(str) {
      try {
        const actualString =
          typeof str === 'string' && str !== '' ? str : this.walletType;
        if (!this.step) {
          this.walletType = actualString;
        }
        this.step = this.step += 1;
        // bcvault initializes on step 1 but unlocks at step 2
        this.wallets[actualString].accountOnly && this.step === 1
          ? this.initBcVault(actualString)
          : '';
        this.steps[this.step] = actualString;
        if (this.wallets[actualString].when === this.step) {
          if (this.wallets[actualString].needsQr) {
            new this.wallets[actualString].create(this.generateQr).then(
              wallet => {
                this[`${actualString}Unlock`](wallet);
              }
            );
          } else {
            this.selectedPath = this.paths[0];
            this[`${actualString}Unlock`]();
          }
        }
      } catch (e) {
        this.reset();
        Toast(e.message, {}, ERROR);
      }
    },
    /**
     * Unlock the hardware wallets
     */
    ledgerUnlock() {
      this.selectedLedgerApp = this.ledgerApps[0];
      this.unlockPathOnly();
    },
    trezorUnlock() {
      this.unlockPathOnly();
    },
    bitboxUnlock() {
      this.unlockPathAndPassword(this.hasPath, this.password);
    },
    bitbox02Unlock() {
      this.unlockPathOnly();
    },
    secalotUnlock() {
      this.unlockPathAndPassword(this.hasPath, this.password);
    },
    finneyUnlock(wallet) {
      this.unlockQrcode(wallet);
    },
    xwalletUnlock(wallet) {
      this.unlockQrcode(wallet);
    },
    bcVaultUnlock(address) {
      const actualAddress = address ? address : this.selectedAddress;
      const _wallet = this.walletInstance.getAccount(actualAddress);
      this.setHardwareWallet(_wallet);
    },
    keepkeyUnlock() {
      EventBus.$on('showHardwarePinMatrix', callback => {
        // this.step += 1;
        this.enterPin = true;
        this.callback = callback;
      });

      this.unlockPathOnly(() => {
        this.step += 1;
      });
    },
    coolWalletUnlock() {
      this.unlockPathAndPassword(null, this.password);
    },
    /**
     * Unlocks the qr code step
     */
    unlockQrcode(wallet) {
      this.setHardwareWallet(wallet);
    },
    /**
     * Unlock only the path step
     */
    unlockPathOnly(cb = () => {}) {
      this.wallets[this.walletType]
        .create(this.hasPath)
        .then(_hwWallet => {
          cb();
          this.hwWalletInstance = _hwWallet;
        })
        .catch(err => {
          this.reset();
          Toast(err.message, {}, ERROR);
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
        })
        .catch(err => {
          this.reset();
          Toast(err.message, {}, ERROR);
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
            this.$router.push({ name: 'Dashboard' });
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
     * Sets Ledger App
     */
    setLedgerApp(obj) {
      this.selectedLedgerApp = obj;
    },
    /**
     * Sets Password
     */
    setPassword(str) {
      this.password = str;
    },
    /**
     * Sets Terms
     */
    setTerms(boolean) {
      this.acceptTerms = boolean;
    },
    /**
     * Inits Bc Vault Instance
     */
    initBcVault(str) {
      this.bcVaultLoading = true;
      this.walletInstance = this.wallets[str].create();
      this.walletInstance
        .init()
        .then(res => {
          if (res.length > 1) {
            this.accounts = res;
            this.bcVaultLoading = false;
          } else if (res.length === 1) {
            this[`unlock${str}`](res[0].userRawData + res[0].address);
          }
        })
        .catch(() => {
          this.bcVaultLoading = false;
        });
    },
    /**
     * Sets Bc Vault Address
     */
    setBCvaultAddress(address) {
      this.selectedAddress = address;
    },
    /**
     * Generates the Qr Code
     */
    generateQr(code) {
      this.qrCode = code;
    },
    /**
     * Keepkey Actions
     */
    keepKeyClear() {
      this.pin = '';
    },
    keepKeyPinEnter(pin) {
      this.callback(pin);
      this.enterPin = false;
      this.step += 1;
      setTimeout(() => {
        this.callback = () => {};
      }, 500);
    },
    /**
     * Sets BitBox value
     */
    setSelectedBitbox(val) {
      if (!val) {
        this.walletType = WALLET_TYPES.BITBOX;
      } else {
        this.walletType = WALLET_TYPES.BITBOX2;
      }

      this.nextStep();
    },
    /**
     * Network Address step
     */
    async setAddresses() {
      try {
        this.accounts = [];
        for (
          let i = this.currentIdx;
          i < this.currentIdx + MAX_ADDRESSES;
          i++
        ) {
          const account = await this.hwWalletInstance.getAccount(i);
          this.accounts.push({
            address: account.getAddressString(),
            account: account,
            idx: i,
            balance: 'Loading..',
            tokens: 'Loading..'
          });
        }
        this.addressPage += 1;
        this.currentIdx += MAX_ADDRESSES;
        this.selectedAddress = this.accounts[0].address;
      } catch (e) {
        this.hwWalletInstance.errorHandler(e);
      }
    },
    nextAddressSet() {
      this.setAddresses();
    },
    previousAddressSet() {
      const pageDeductor = this.currentIdx / MAX_ADDRESSES;
      const idxDeductor = this.addressPage * MAX_ADDRESSES;
      this.addressPage -=
        this.currentIdx <= 10 ? pageDeductor : pageDeductor - 1;
      this.currentIdx -=
        this.currentIdx <= 10 ? idxDeductor : idxDeductor - MAX_ADDRESSES;
      this.setAddresses();
    }
  }
};
</script>

<style lang="scss" scoped>
.button-container {
  height: 100px;
}

@media screen and (min-width: 800px) {
  .expand-width {
    min-width: 740px;
  }
}
</style>
