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
    <div v-if="step === 2" class="full-width">
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
      <span v-if="onLedger">
        <div class="subtitle-1 font-weight-bold mb-2">Connecting to:</div>
        <div>
          <mew-select
            v-if="onLedger"
            v-model="ledgerApp"
            :items="ledgerApps"
            :is-custom="true"
          />
          <div class="text-right">
            <access-wallet-derivation-path
              :selected-path="selectedPath"
              :paths="paths"
              @setPath="setPath"
            />
          </div>
          <div class="d-flex flex-column align-center justify-center">
            <div class="pl-4 ledger-graphic">
              <v-img
                :src="
                  require('@/assets/images/hardware-wallets/ledger-graphic.svg')
                "
                alt="Ledger Wallet"
                max-width="21em"
                max-height="10em"
                contain
              />
            </div>
            <v-card-title
              v-if="!ledgerConnected"
              class="border justify-center font"
            >
              Connect your Ledger device and open Ethereum app
            </v-card-title>
            <v-card-title
              v-if="ledgerConnected"
              class="border justify-center font"
            >
              <img
                src="@/assets/images/icons/icon-checked.svg"
                alt="Green check mark"
                height="20"
              />
              <div class="padding">Ledger connected</div>
            </v-card-title>
          </div>
        </div>
        <div class="text-center">
          <mew-button
            btn-size="xlarge"
            :has-full-width="true"
            title="Unlock wallet"
            :disabled="!ledgerConnected"
            @click.native="nextStep"
          />
        </div>
      </span>
      <!--
        =====================================================================================
          Trezor
        =====================================================================================
        -->
      <span v-if="onTrezor">Trezor</span>
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
      :handler-wallet="hwWalletInstance"
      @unlock="setHardwareWallet"
    />
  </mew-overlay>
</template>

<script>
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
// import AccessWalletBitbox from './hardware/components/AccessWalletBitbox';
// import BitBoxPopup from './hardware/components/BitBoxPopup';
// import AccessWalletPassword from './hardware/components/AccessWalletPassword';
// import AccessWalletPaths from './hardware/components/AccessWalletPaths';
// import AccessWalletPin from './hardware/components/AccessWalletPin';
import AccessWalletAddressNetwork from '@/modules/access-wallet/common/components/AccessWalletAddressNetwork';
import AccessWalletKeepkey from './hardware/components/AccessWalletKeepkey';
import AccessWalletDerivationPath from './hardware/components/AccessWalletDerivationPath.vue';
import appPaths from './hardware/handlers/hardwares/ledger/appPaths.js';
import allPaths from '@/modules/access-wallet/hardware/handlers/bip44';
import wallets from '@/modules/access-wallet/hardware/handlers/configs/configWallets';
import { mapActions, mapGetters, mapState } from 'vuex';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import iconETHMatisse from '@/assets/images/currencies/eth-matisse-blue.svg';

export default {
  name: 'HardwareAccessOverlay',
  components: {
    AccessWalletKeepkey,
    AccessWalletAddressNetwork,
    AccessWalletDerivationPath
    // AccessWalletBitbox,
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
          value: item.network.name_long,
          img: item.network.name == 'ETH' ? iconETHMatisse : item.network.icon
        };
      }),
      wallets: wallets,
      // resettable
      step: 1,
      // currentStep: '',
      // steps: {},
      hwWalletInstance: {},
      ledgerApp: {},
      selectedPath: {
        name: 'Ethereum',
        subtext: "m/44'/60'/0'/0",
        value: "m/44'/60'/0'/0"
      },
      walletType: '',
      selectedLedgerApp: {},
      password: '',
      // qrCode: '',
      // walletInstance: {},
      // enterPin: false,
      // pin: '',
      ledgerConnected: false,
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
      if (this.onLedger) {
        return {
          title: 'Using a Ledger Hardware wallet with MEW',
          url: 'https://kb.myetherwallet.com/en/hardware-wallets/using-ledger-with-mew/'
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
    // onBitbox() {
    //   return this.currentStep === LAYOUT_STEPS.BITBOX_SELECT;
    // },
    // onBitboxPopup() {
    //   return this.currentStep === LAYOUT_STEPS.BITBOX_POPUP;
    // },
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
    // onPaths() {
    //   return this.currentStep === LAYOUT_STEPS.PATH_SELECT;
    // },
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
      this.password = '';
      // this.qrCode = '';
      // this.walletInstance = {};
      this.enterPin = false;
      this.walletType = '';
    },
    /**
     * Overlay Actions
     */
    back() {
      !this.step ? this.close('showHardware') : (this.step -= 1);
      // this.currentStep = this.wallets[this.walletType].steps[this.step - 1];
      this.step === 1 ? this.reset() : '';
      this.step === 2 ? (this.hwWalletInstance = {}) : null;
    },
    overlayClose() {
      this.reset();
      this.close('showHardware');
    },
    setWalletInstance(str) {
      this.walletType = str;
      this.nextStep();
    },
    nextStep() {
      if (this.walletType) {
        this.step++;
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
          if (_hwWallet.identifier == 'ledger') this.ledgerConnected = true;
          // if (this.walletType === WALLET_TYPES.BITBOX2) {
          //   this.currentStep = LAYOUT_STEPS.BITBOX_POPUP;
          //   _hwWallet.init(this.hasPath).then(() => {
          //     this.hwWalletInstance = _hwWallet;
          //   });
          // }
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
          this.step++;
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
    getPlaceholderImgs() {
      if (this.ledgerApps.length > 0) {
        return this.ledgerApps.map(() => {
          return this.icon;
        });
      }
      return [];
    }
    /**
     * Sets Ledger App
     */
    // setLedgerApp(obj) {
    //   this.selectedLedgerApp = obj;
    // },
    /**
     * Sets Password
     */
    // setPassword(str) {
    //   this.password = str;
    // },
    /**
     * Keepkey Actions
     */
    // keepKeyClear() {
    //   this.pin = '';
    // },
    // keepKeyPinEnter(pin) {
    //   this.callback(pin);
    //   this.enterPin = false;
    //   this.step += 1;
    //   setTimeout(() => {
    //     this.callback = () => {};
    //   }, 500);
    // },
    /**
     * Sets BitBox value
     */
    // setSelectedBitbox(val) {
    //   if (!val) {
    //     this.walletType = WALLET_TYPES.BITBOX;
    //   } else {
    //     this.walletType = WALLET_TYPES.BITBOX2;
    //   }
    //   this.nextStep();
    // }
  }
};
</script>

<style lang="scss" scoped>
.border {
  border: 1px solid var(--v-inputBorder-base);
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 30px;
  width: 100%;
}
.font {
  font-size: 16px;
  text-align: center;
  white-space: pre-wrap;
  word-break: break-word;
}
.ledger-graphic {
  padding-top: 72px;
  padding-bottom: 32px;
}
.padding {
  padding-left: 0.5em;
}
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

@media screen and (max-width: 456px) {
  .ledger-graphic {
    padding-top: 50px;
    padding-bottom: 32px;
  }
}
</style>
