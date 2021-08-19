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
    :back="step === 0 ? null : back"
    :close="overlayClose"
    content-size="xlarge"
  >
    <v-row
      v-if="step === 1"
      class="pa-5 mb-4 full-width text-center rounded subtitle-container"
      ><span class="full-width"
        >The highest standard of security in the crypto space.
        <!-- TODO: add link -->
        <a href="" target="_blank"> Learn More </a>
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
      <v-row no-gutters justify="start">
        <v-col
          v-for="(button, idx) in buttons"
          :key="button.label"
          :class="['button-container pb-2', idx % 2 == 0 ? 'pr-2' : '']"
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
    <!--
            =====================================================================================
              Step 2: Start Access to Selected Hardware Wallet
            =====================================================================================
            -->
    <div class="full-width" v-if="step === 2">
      <!--
        =====================================================================================
          Bitbox2
        =====================================================================================
        -->
      <!-- <access-wallet-bitbox
            v-else-if="onBitbox"
            :set-selected-bitbox="setSelectedBitbox"
          /> -->
      <!--
        =====================================================================================
          Keepkey
        =====================================================================================
        -->
      <access-wallet-keepkey v-if="onKeepkey" />
      <!--
        =====================================================================================
          Cool Wallet
        =====================================================================================
        -->
      <span v-if="onCoolWallet">Cool Wallet</span>
      <!--
        =====================================================================================
          Ledger
        =====================================================================================
        -->
      <span v-if="onLedger">Ledger</span>
      <!--
        =====================================================================================
          Trezor
        =====================================================================================
        -->
      <span>Trezor</span>
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
      <!-- <access-wallet-network-addresses
              v-else-if="onNetworkAddresses"
              :accounts="accounts"
              :next-address-set="nextAddressSet"
              :previous-address-set="previousAddressSet"
              :set-hardware-wallet="setHardwareWallet"
              :address-page="addressPage"
              :step="step"
            /> -->
      <!-- </div>
      </div> -->
    </div>
  </mew-overlay>
</template>

<script>
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
// import AccessWalletBitbox from './hardware/components/AccessWalletBitbox';
// import BitBoxPopup from './hardware/components/BitBoxPopup';
// import AccessWalletNetworkAddresses from './hardware/components/AccessWalletNetworkAddresses';
// import AccessWalletPassword from './hardware/components/AccessWalletPassword';
// import AccessWalletPaths from './hardware/components/AccessWalletPaths';
// import AccessWalletPin from './hardware/components/AccessWalletPin';
import AccessWalletKeepkey from './hardware/components/AccessWalletKeepkey';
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
    AccessWalletKeepkey
    // AccessWalletBitbox,
    // AccessWalletNetworkAddresses,
    // AccessWalletPassword,
    // AccessWalletPaths,
    // AccessWalletPin,
    // BitBoxPopup
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
      step: 1,
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
     * Footer links to display beneath container
     * TODO: get link urls from Russ
     */
    footerLink() {
      if (this.onKeepkey) {
        return {
          title: 'Using a KeepKey Hardware wallet with MEW',
          url: 'https://www.mewtopia.com/'
        };
      }
      return {
        title: 'Hardware Wallets',
        url: 'https://www.mewtopia.com/'
      };
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
      return this.step === 1
        ? 'Select a hardware wallet'
        : this.wallets[this.walletType].title;
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
      this.step = 1;
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
      this.step === 1 ? this.reset() : '';
    },
    overlayClose() {
      this.reset();
      this.close('showHardware');
    },
    setWalletInstance(str) {
      this.walletType = str;
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
