<template>
  <!--
=====================================================================================
  Overlay - access using hardware
=====================================================================================
-->
  <mew-overlay
    :footer="{
      text: 'Need help?',
      linkTitle: 'Contact support',
      link: 'mailto:support@myetherwallet.com'
    }"
    :show-overlay="open"
    :title="title"
    :back="step === 0 ? null : back"
    :close="overlayClose"
    content-size="xlarge"
  >
    <!--
        =====================================================================================
        Step 0: Select hardware wallet
        =====================================================================================
        -->
    <div v-if="step === 0">
      <v-row class="align-end justify-start">
        <v-col cols="12">
          <!--
              =====================================================================================
                Title
              =====================================================================================
              -->
          <div class="subtitle-1 font-weight-bold grey--text">
            STEP {{ step + 1 }}.
          </div>
          <div class="headline font-weight-bold">
            Select a hardware wallet to access.
          </div>
          <p class="mb-5">Make sure your device is connected and unlocked.</p>
        </v-col>
      </v-row>
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
            @click.native="setWalletInstance(button.type)"
          />
        </v-col>
      </v-row>
    </div>
    <div v-if="step > 0" class="full-width">
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
             Bitbox
            =====================================================================================
            -->
          <access-wallet-bitbox
            v-else-if="onBitbox"
            :set-selected-bitbox="setSelectedBitbox"
          />
          <!--
            =====================================================================================
            Password Step (Coolwallet)
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
            :step="step"
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
          <bit-box-popup v-if="onBitboxPopup" :device="hwWalletInstance" />
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
            :step="step"
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
            :step="step"
            @setPath="setPath"
            @setLedgerApp="setLedgerApp"
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
                Password Step (Coolwallet)
                =====================================================================================
                -->
            <access-wallet-password
              v-if="onPassword"
              :on-cool-wallet="onCoolWallet"
              :next-step="nextStep"
              :wallet-type="walletType"
              @setTerms="setTerms"
              @setPassword="setPassword"
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
              :step="step"
            />
          </div>
        </template>
      </mew-stepper>
    </div>
  </mew-overlay>
</template>

<script>
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import AccessWalletBcVault from './hardware/components/AccessWalletBcVault';
import AccessWalletBitbox from './hardware/components/AccessWalletBitbox';
import BitBoxPopup from './hardware/components/BitBoxPopup';
import AccessWalletNetworkAddresses from './hardware/components/AccessWalletNetworkAddresses';
import AccessWalletPassword from './hardware/components/AccessWalletPassword';
import AccessWalletPaths from './hardware/components/AccessWalletPaths';
import AccessWalletPin from './hardware/components/AccessWalletPin';
import appPaths from './hardware/handlers/hardwares/ledger/appPaths.js';
import allPaths from '@/modules/access-wallet/hardware/handlers/bip44';
import wallets, {
  LAYOUT_STEPS
} from '@/modules/access-wallet/hardware/handlers/configs/configWallets';
import { mapActions, mapGetters, mapState } from 'vuex';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import Web3 from 'web3';
import { fromWei, _ } from 'web3-utils';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
const MAX_ADDRESSES = 5;

export default {
  name: 'HardwareAccessOverlay',
  components: {
    AccessWalletBcVault,
    AccessWalletBitbox,
    AccessWalletNetworkAddresses,
    AccessWalletPassword,
    AccessWalletPaths,
    AccessWalletPin,
    BitBoxPopup
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
          label: 'Bitbox 02',
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
          value: item.network.name_long
        };
      }),
      wallets: wallets,
      // resettable
      step: 0,
      currentStep: '',
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
    ...mapState('wallet', ['identifier']),
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
      return this.currentStep === LAYOUT_STEPS.NETWORK_ACCOUNT_SELECT;
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
      return this.currentStep === LAYOUT_STEPS.BITBOX_SELECT;
    },
    onBitboxPopup() {
      return this.currentStep === LAYOUT_STEPS.BITBOX_POPUP;
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
      return this.currentStep === LAYOUT_STEPS.PATH_SELECT;
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
  watch: {
    network: {
      deep: true,
      handler: function () {
        this.accounts = [];
        this.addressPage -= 1;
        this.selectedAddress = '';
        this.currentIdx -= MAX_ADDRESSES;
        if (!_.isEmpty(this.hwWalletInstance)) this.setAddresses();
      }
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
      this.step = 0;
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
      this.currentStep = this.wallets[this.walletType].steps[this.step - 1];
      this.step === 0 ? this.reset() : '';
    },
    overlayClose() {
      this.reset();
      this.close('showHardware');
    },
    setWalletInstance(str) {
      this.walletType = str;
      this.step = 0;
      this.incrementStep();
    },
    incrementStep() {
      this.currentStep = this.wallets[this.walletType].steps[this.step];
      this.step++;
    },
    nextStep() {
      if (this.walletType) {
        this.incrementStep();
        if (this.step === this.wallets[this.walletType].when) {
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
    bitboxUnlock() {
      this.unlockPathAndPassword(this.hasPath, this.password);
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
        .then(_hwWallet => {
          this.hwWalletInstance = _hwWallet;
          if (this.walletType === WALLET_TYPES.BITBOX2) {
            this.currentStep = LAYOUT_STEPS.BITBOX_POPUP;
            _hwWallet.init(this.hasPath).then(() => {
              this.currentStep = LAYOUT_STEPS.NETWORK_ACCOUNT_SELECT;
              this.hwWalletInstance = _hwWallet;
              this.setAddresses();
            });
          } else if (this.walletType === WALLET_TYPES.KEEPKEY) {
            this.incrementStep();
            this.setAddresses();
          } else {
            this.setAddresses();
          }
          return _hwWallet;
        })
        .catch(err => {
          if (this.wallets[this.walletType]) {
            this.wallets[this.walletType].create.errorHandler(err);
          } else {
            Toast(err, {}, ERROR);
          }
          this.reset();
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
          this.setAddresses();
        })
        .catch(err => {
          if (this.wallets[this.walletType]) {
            this.wallets[this.walletType].create.errorHandler(err);
          } else {
            Toast(err, {}, ERROR);
          }
          this.reset();
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
        const web3 = new Web3(this.network.url);
        this.accounts = [];
        for (
          let i = this.currentIdx;
          i < this.currentIdx + MAX_ADDRESSES;
          i++
        ) {
          const account = await this.hwWalletInstance.getAccount(i);
          const balance = await web3.eth.getBalance(account.getAddressString());
          this.accounts.push({
            address: account.getAddressString(),
            account: account,
            idx: i,
            balance: formatFloatingPointValue(fromWei(balance)).value,
            tokens: 'Loading..'
          });
        }
        this.addressPage += 1;
        this.currentIdx += MAX_ADDRESSES;
        this.selectedAddress = this.accounts[0].address;
      } catch (e) {
        if (this.wallets[this.walletType]) {
          this.wallets[this.walletType].create.errorHandler(e);
        } else {
          Toast(e, {}, ERROR);
        }
        this.reset();
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
