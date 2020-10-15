<template>
  <mew-overlay
    :show-overlay="open"
    :title="title"
    right-btn-text="Cancel"
    :back="accessBack"
    :close="overlayClose"
    :left-btn-text="step > 0 ? 'Back' : ''"
  >
    <template #mewOverlayBody>
      <div v-if="!step">
        <div class="text-center">
          Select a hardware wallet to access. Make sure <br />
          your device is connected and unlocked
        </div>
        <v-sheet
          :outlined="true"
          color="transparent"
          :rounded="true"
          :max-width="740"
          :min-width="475"
          :min-height="340"
        >
          <v-container>
            <v-row justify="start">
              <v-col v-for="button in buttons" :key="button.label" cols="6">
                <div class="button-container">
                  <mew-super-button
                    :title="button.label"
                    :cols-num="6"
                    color-theme="basic"
                    @click.native="nextStep(button.type)"
                  >
                    <template #contentSlot>
                      <img :src="button.icon" />
                    </template>
                  </mew-super-button>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </div>
      <v-sheet
        v-if="showBCVault"
        :outlined="true"
        color="white"
        :rounded="true"
        :min-width="475"
        class="pa-5"
      >
        <div class="d-flex flex-column align-center justify-center">
          <div
            v-if="accounts.length === 0 && bcvaultLoading"
            class="text-center bcvault-address-container"
          >
            <v-progress-circular indeterminate />
            <p class="text-center mew-subtitle">Loading...</p>
            <p class="text-center mew-heading-1">
              Please follow the prompts from the BCVault app and Hardware Wallet
            </p>
          </div>
          <div
            v-else-if="accounts.length === 0 && !bcvaultLoading"
            class="text-center"
          >
            <v-icon color="titlePrimary"> mdi-alert </v-icon>
            <p class="text-center mew-heading-1">
              Connection timed out or user cancelled action or no account found!
            </p>
          </div>
          <div v-else class="text-center">
            <div
              v-for="acc in accounts"
              :key="acc.address"
              :class="[
                'pa-4 bcvault-address rounded d-flex flex-row align-center justify-space-between ma-2',
                selectedAddress === acc.userDataRaw + acc.address
                  ? 'bcvault-active'
                  : ''
              ]"
              @click="setBCvaultAddress(acc.userDataRaw + acc.address)"
            >
              <mew-blockie
                :address="acc.userDataRaw + acc.address"
                width="30px"
                height="30px"
              />
              <span>{{ acc.userDataRaw + acc.address }}</span>
            </div>
            <mew-button
              title="Access Wallet"
              color-theme="primary"
              :has-full-width="false"
              button-size="medium"
              icon-align="left"
              btn-style="background"
              :disabled="selectedAddress === ''"
              @click.native="nextStep"
            />
          </div>
        </div>
      </v-sheet>
      <v-sheet
        v-else-if="showQrCode"
        :outlined="true"
        color="white"
        :rounded="true"
        :max-width="740"
        :min-width="475"
        :min-height="340"
      >
        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="9">
              <p v-if="walletType === 'xwallet'" class="mew-heading-3">
                Please use Pundi X Savings account to scan the QR code below.
              </p>
              <p v-else class="mew-heading-3">
                Please use FINNEY to scan the QR code below.
              </p>
              <v-row align="center" justify="center">
                <qrcode :value="qrcode" :options="{ size: 186 }" />
              </v-row>
              <v-row
                v-show="walletType === 'xwallet'"
                align="center"
                justify="space-around"
              >
                <a
                  href="https://apps.apple.com/us/app/xwallet-by-pundi-x/id1321754661"
                  target="_blank"
                >
                  <img
                    src="@/assets/images/icons/button-app-store.png"
                    alt="Apple app store"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.pundix.xwallet&hl=en_US"
                >
                  <img
                    src="@/assets/images/icons/button-play-store.png"
                    alt="Google play store"
                  />
                </a>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
      <v-sheet
        v-else-if="showSelectBitbox"
        :outlined="true"
        color="transparent"
        :rounded="true"
        :max-width="740"
        :min-width="575"
        :min-height="340"
      >
        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="10">
              <div class="button-container pt-2">
                <mew-super-button
                  title="Bitbox"
                  :cols-num="6"
                  color-theme="basic"
                  right-icon="bitbox"
                  @click.native="setSelectedBitbox(0)"
                />
              </div>
              <div class="button-container pt-2 mb-4">
                <mew-super-button
                  title="Bitbox 2"
                  :cols-num="6"
                  color-theme="basic"
                  right-icon="bitbox"
                  @click.native="setSelectedBitbox(1)"
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
      <v-sheet
        v-else-if="showNetworkAddresses"
        :outlined="true"
        color="transparent"
        :rounded="true"
        :max-width="740"
        :min-width="475"
        :min-height="340"
      >
        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="12">
              <mew-expand-panel
                :interactive-content="true"
                :panel-items="panelItems"
              >
                <template #panelBody1>
                  <div class="network-container">
                    <v-radio-group v-model="selectedNetwork">
                      <div v-for="type in networkTypes" :key="type">
                        <p class="text-capitalize mew-header-block">
                          {{ type }}
                        </p>
                        <v-container>
                          <v-row align="center" justify="space-between">
                            <v-col
                              v-for="(item, idx) in Networks[type]"
                              :key="item.service + idx"
                              cols="6"
                            >
                              <v-radio
                                :label="item.service"
                                :value="item.url"
                              />
                            </v-col>
                          </v-row>
                        </v-container>
                      </div>
                    </v-radio-group>
                  </div>
                </template>
                <template #panelBody2>
                  <div>
                    <v-radio-group v-model="selectedAddress">
                      <table width="100%">
                        <thead>
                          <tr class="table-header">
                            <th width="50%" class="align-center">Address</th>
                            <th width="25%" class="align-center">
                              Eth Balance
                            </th>
                            <th width="25%" class="align-center">
                              # of Tokens
                            </th>
                          </tr>
                        </thead>
                        <tbody class="table-row-class">
                          <tr
                            v-for="acc in accounts"
                            v-show="accounts.length > 0"
                            :key="acc.address"
                          >
                            <td>
                              <v-row justify="space-around">
                                <v-col cols="1">
                                  <v-radio label="" :value="acc.address" />
                                </v-col>
                                <v-col cols="8" class="text-truncate">
                                  <v-row justify="space-around">
                                    <mew-blockie
                                      width="25px"
                                      height="25px"
                                      :address="acc.address"
                                    />
                                    <span>{{
                                      acc.address | concatAddress
                                    }}</span>
                                  </v-row>
                                  <input
                                    :ref="acc.address"
                                    :value="acc.address"
                                    class="address-copy-input"
                                  />
                                </v-col>
                                <v-col cols="2">
                                  <v-row>
                                    <v-icon
                                      small
                                      class="cursor--pointer"
                                      @click="copy(acc.address)"
                                      >mdi-content-copy</v-icon
                                    >
                                    <v-icon
                                      small
                                      class="cursor--pointer"
                                      @click="launchExplorrer(acc.address)"
                                      >mdi-launch</v-icon
                                    >
                                  </v-row>
                                </v-col>
                              </v-row>
                            </td>
                            <td>
                              {{
                                acc.balance === 'Loading..'
                                  ? acc.balance
                                  : `${acc.balance} ${network.type.name}`
                              }}
                            </td>
                            <td>{{ acc.tokens }}</td>
                          </tr>
                          <tr v-show="accounts.length === 0">
                            Loading...
                          </tr>
                        </tbody>
                      </table>
                    </v-radio-group>
                    <br />
                    <v-row align="center" justify="center">
                      <div>
                        <mew-button
                          title="Previous"
                          color-theme="basic"
                          icon="mdi-chevron-left"
                          icon-type="mdi"
                          :has-full-width="false"
                          btn-size="small"
                          icon-align="left"
                          btn-style="transparent"
                          :disabled="addressPage <= 1"
                          @click.native="previousAddressSet"
                        />
                        <mew-button
                          title="Next"
                          color-theme="basic"
                          icon="mdi-chevron-right"
                          icon-type="mdi"
                          :has-full-width="false"
                          btn-size="small"
                          icon-align="right"
                          btn-style="transparent"
                          @click.native="nextAddressSet"
                        />
                      </div>
                    </v-row>
                  </div>
                </template>
              </mew-expand-panel>
              <div class="d-flex align-center flex-column">
                <mew-button
                  title="Access My Wallet"
                  btn-size="large"
                  :disabled="!(selectedAddress && acceptTerms)"
                  @click.native="
                    () => {
                      setWallet(wallet.account);
                    }
                  "
                />
                <mew-checkbox
                  v-model="acceptTerms"
                  label="To access my wallet, I accept "
                  :link="link"
                  class="justify-center"
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
      <v-sheet
        v-else-if="showPassword"
        :outlined="true"
        color="white"
        :rounded="true"
        :max-width="740"
        :min-width="575"
        :min-height="340"
      >
        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="10">
              <p class="mew-heading-3">
                Please enter the password of your
                <span class="text-capitalize">{{ walletType }}</span> device.
              </p>
              <v-container>
                <v-row align="center" justify="center">
                  <v-col cols="10">
                    <mew-input
                      v-model="password"
                      label="Password"
                      placeholder="Enter your password"
                      :type="walletType === 'cool_wallet' ? 'text' : 'password'"
                    />
                    <div class="d-flex align-center flex-column">
                      <mew-button
                        title="Access My Wallet"
                        button-size="xlarge"
                        :disabled="!(password !== '' && acceptTerms)"
                        @click.native="
                          () => {
                            nextStep();
                          }
                        "
                      />
                      <mew-checkbox
                        v-model="acceptTerms"
                        label="To access my wallet, I accept "
                        :link="link"
                        class="justify-center"
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
      <mew6-white-sheet v-else-if="showPaths">
        <div class="overlay-content pa-8">
          <div class="text-center mb-8">
            <img :src="icon" alt="Network Icon" height="60" />
          </div>
          <div>
            <mew-select
              v-if="walletType === 'ledger'"
              v-model="selectedLedgerApp"
              label="Opened Ledger App"
              :items="ledgerApps"
            />
            <mew-select
              v-model="selectedPath"
              label="HD derivation path"
              :items="paths"
            />
          </div>
          <mew-button
            button-size="xlarge"
            title="Unlock wallet"
            has-full-width
            @click.native="nextStep"
          />
        </div>
      </mew6-white-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import qrcode from '@xkeshi/vue-qrcode';

import bcvaultWallet from '@/modules/wallets/utils/hardware/bcvault';
import bitboxWallet from '@/modules/wallets/utils/hardware/bitbox';
import bitbox02Wallet from '@/modules/wallets/utils/hardware/bitbox02';
import coolwalletWallet from '@/modules/wallets/utils/hardware/coolwallet';
import keepkeyWallet from '@/modules/wallets/utils/hardware/keepkey';
import ledgerWallet from '@/modules/wallets/utils/hardware/ledger';
import secalotWallet from '@/modules/wallets/utils/hardware/secalot';
import trezorWallet from '@/modules/wallets/utils/hardware/trezor';
import mewconnectWallet from '@/modules/wallets/utils/hybrid/MEWconnect';

import appPaths from '@/modules/wallets/utils/hardware/ledger/appPaths.js';
import allPaths from '@/modules/wallets/utils/bip44';
import { mapState, mapActions } from 'vuex';

const parsedAppPaths = appPaths.map(item => {
  const newObj = {
    name: item.network.name_long
  };

  return newObj;
});

const MAX_ADDRESSES = 5;
import {
  LEDGER as ledgerType,
  TREZOR as trezorType,
  BITBOX as bitboxType,
  BITBOX02 as bitbox02Type,
  SECALOT as secalotType,
  KEEPKEY as keepkeyType,
  FINNEY as finneyType,
  XWALLET as xwalletType,
  BCVAULT as bcvaultType,
  COOLWALLET as coolwalletType
} from '@/modules/wallets/utils/bip44/walletTypes.js';

// When value is for when to unlock the wallet through out steps
const walletHolder = {
  [ledgerType]: {
    create: ledgerWallet,
    when: 1,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: '1. Connect with Ledger',
      2: '2. Confirm Network & Address'
    }
  },
  [trezorType]: {
    create: trezorWallet,
    when: 1,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: '1. Connect with Trezor',
      2: '2. Confirm Network & Address'
    }
  },
  [bitboxType]: {
    create: bitboxWallet,
    when: 4,
    hasPaths: true,
    requiresPassword: true,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: '1. Select BitBox Wallet',
      2: '2. Connect with BitBox',
      3: '3. Enter your password',
      4: '4. Confirm Network & Address'
    }
  },
  [bitbox02Type]: {
    create: bitbox02Wallet,
    when: 3,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: '1. Select BitBox Wallet',
      // 2: 'Match your encryption pairing code',
      2: '2. Connect with BitBox',
      3: '3. Confirm Network & Address'
    }
  },
  [secalotType]: {
    create: secalotWallet,
    when: 2,
    hasPaths: true,
    requiresPassword: true,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: '1. Enter your password',
      2: '2. Connect with Secalot',
      3: '3. Confirm Network & Address'
    }
  },
  [keepkeyType]: {
    create: keepkeyWallet,
    when: 1,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: '1. Connect with KeepKey'
    }
  },
  [finneyType]: {
    create: mewconnectWallet,
    when: 1,
    hasPaths: false,
    requiresPassword: false,
    needsQr: true,
    titles: {
      1: '1. Connect with Finney'
    }
  },
  [xwalletType]: {
    create: mewconnectWallet,
    when: 1,
    hasPaths: false,
    requiresPassword: false,
    needsQr: true,
    titles: {
      1: '1. Connect with XWallet'
    }
  },
  [bcvaultType]: {
    create: bcvaultWallet,
    when: 2,
    hasPaths: false,
    requiresPassword: false,
    needsQr: false,
    accountOnly: true,
    titles: {
      1: '1. Connect with BC Vault'
    }
  },
  [coolwalletType]: {
    create: coolwalletWallet,
    when: 2,
    hasPaths: false,
    requiresPassword: true,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: '1. Connect with CoolWallet',
      2: '2. Confirm Network & Address'
    }
  }
};

export default {
  name: 'HardwareAccessOverlay',
  components: {
    qrcode: qrcode
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
      buttons: [
        {
          label: 'Ledger',
          icon: require('@/assets/images/icons/hardware-wallets/icon-ledger.svg'),
          type: ledgerType
        },
        {
          label: 'Bitbox',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg'),
          type: bitboxType
        },
        {
          label: 'FINNEY',
          icon: require('@/assets/images/icons/hardware-wallets/icon-finney.svg'),
          type: finneyType
        },
        {
          label: 'Secalot',
          icon: require('@/assets/images/icons/hardware-wallets/icon-secalot.svg'),
          type: secalotType
        },
        {
          label: 'KeepKey',
          icon: require('@/assets/images/icons/hardware-wallets/icon-keepkey.svg'),
          type: keepkeyType
        },
        {
          label: 'Trezor',
          icon: require('@/assets/images/icons/hardware-wallets/icon-trezor.svg'),
          type: trezorType
        },
        {
          label: 'CoolWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-coolwallet.svg'),
          type: coolwalletType
        },
        {
          label: 'BC Vault',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bcvault.svg'),
          type: bcvaultType
        },
        {
          label: 'XWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-xwallet.svg'),
          type: xwalletType
        }
      ],
      link: {
        title: 'Terms',
        url: 'https://www.myetherwallet.com/terms-of-service'
      },
      panelItems: [
        {
          name: 'Network'
        },
        {
          name: 'Address to interact with'
        }
      ],
      ledgerApps: parsedAppPaths,
      wallets: walletHolder,
      // resettable
      step: 0,
      steps: {},
      hwWalletInstance: {},
      selectedPath: null,
      walletType: '',
      selectedLedgerApp: '',
      selectedAddress: '',
      password: '',
      selectedNetwork: '',
      accounts: [],
      currentIdx: 0,
      acceptTerms: false,
      addressPage: 0,
      qrcode: '',
      bcvaultLoading: false,
      walletInstance: {}
    };
  },
  computed: {
    ...mapState(['Networks', 'network']),
    networkTypes() {
      const showFirst = ['ETH', 'ROP', 'RIN'];
      const typeArr = Object.keys(this.Networks).filter(item => {
        if (!showFirst.includes(item)) {
          return item;
        }
      });
      typeArr.unshift('ETH', 'ROP', 'RIN');
      return typeArr;
    },
    showSelectBitbox() {
      return this.walletType.includes('bitbox') && this.step === 1;
    },
    showNetworkAddresses() {
      return (
        Object.keys(this.hwWalletInstance).length > 0 &&
        this.step >= 1 &&
        this.step > this.wallets[this.walletType].when
      );
    },
    showBCVault() {
      return this.walletType === bcvaultType;
    },
    showQrCode() {
      return (
        this.walletType !== '' &&
        this.wallets[this.walletType] &&
        this.wallets[this.walletType].needsQr &&
        this.step === this.wallets[this.walletType].when
      );
    },
    showPaths() {
      return (
        (this.step >= 1 && this.step <= 3) ||
        (this.walletType !== '' &&
          this.wallets[this.walletType] &&
          this.wallets[this.walletType].hasPaths &&
          this.step < this.wallets[this.walletType].when)
      );
    },
    showPassword() {
      return (
        this.walletType !== '' &&
        this.wallets[this.walletType] &&
        this.wallets[this.walletType].requiresPassword &&
        (this.step === 3 || this.step === 1)
      );
    },
    icon() {
      if (this.selectedLedgerApp !== '') {
        const found = appPaths.find(item => {
          return item.network.name_long === this.selectedLedgerApp.name;
        });

        return found ? found.network.icon : appPaths[0].network.icon;
      }

      return appPaths[0].network.icon;
    },
    paths() {
      const newArr = [];
      if (this.walletType === ledgerType) {
        if (this.selectedLedgerApp !== '') {
          const found = appPaths.find(item => {
            return item.network.name_long === this.selectedLedgerApp.name;
          });
          const path = found ? found.paths : appPaths[0].paths;
          path.forEach(item => {
            newArr.push({
              name: item.label,
              value: item.path
            });
          });

          return newArr;
        }

        appPaths[0].paths.forEach(item => {
          newArr.push({
            name: item.label,
            value: item.path
          });
        });
      }

      if (this.wallets[this.walletType].hasPaths) {
        allPaths[this.walletType].forEach(item => {
          newArr.push({
            name: item.label,
            value: item.path
          });
        });
      }

      return newArr;
    },
    title() {
      return !this.step
        ? 'Hardware Wallets'
        : this.wallets[this.walletType].titles[this.step];
    },
    wallet() {
      const wallet = this.accounts.find(item => {
        return item.address === this.selectedAddress;
      });

      return wallet ? wallet : null;
    },
    hasPath() {
      return this.selectedPath && this.selectedPath.hasOwnProperty('value')
        ? this.selectedPath.value
        : this.selectedPath;
    }
  },
  watch: {
    selectedNetwork(newVal) {
      Object.values(this.Networks).forEach(itm => {
        const found = itm.find(network => {
          return network.url === newVal;
        });

        if (found) {
          this.$store.state.network = found; // replace with dispatch + new web3 instance
        }
      });
    },
    hwWalletInstance: {
      deep: true,
      handler: function (newVal) {
        if (Object.keys(newVal).length > 0) {
          try {
            this.setAddresses();
          } catch (e) {
            // eslint-disable-next-line
            console.log(e);
          }
        }
      }
    }
  },
  mounted() {
    this.selectedNetwork = this.network.url;
  },
  methods: {
    ...mapActions(['setWallet']),
    setBCvaultAddress(address) {
      this.selectedAddress = address;
    },
    reset() {
      this.step = 0;
      this.steps = {};
      this.hwWalletInstance = {};
      this.selectedPath = null;
      this.walletType = '';
      this.selectedLedgerApp = '';
      this.selectedAddress = '';
      this.password = '';
      this.selectedNetwork = '';
      this.accounts = [];
      this.currentIdx = 0;
      this.acceptTerms = false;
      this.addressPage = 0;
      this.qrcode = '';
      this.walletInstance = {};
    },
    accessBack() {
      !this.step ? this.close('showHardware') : (this.step -= 1);
      if (!this.step) {
        delete this.steps[this.step + 1];
      }

      if (this.step === 1) {
        this.reset();
      }
    },
    overlayClose() {
      this.close('showHardware');
    },
    nextStep(str) {
      try {
        const actualString =
          typeof str === 'string' && str !== '' ? str : this.walletType;
        if (!this.step) {
          this.walletType = actualString;
        }
        this.step += 1;
        // bcvault initializes on step 1 but unlocks at step 2
        if (this.wallets[actualString].accountOnly && this.step === 1) {
          this.bcvaultLoading = true;
          this.walletInstance = this.wallets[actualString].create();
          this.walletInstance
            .init()
            .then(res => {
              if (res.length > 1) {
                this.accounts = res;
                this.bcvaultLoading = false;
              } else if (res.length === 1) {
                this[`unlock${actualString}`](
                  res[0].userRawData + res[0].address
                );
              }
            })
            .catch(() => {
              this.bcvaultLoading = false;
            });
        }
        this.steps[this.step] = actualString;
        if (this.wallets[actualString].when === this.step) {
          if (this.wallets[actualString].needsQr) {
            new this.wallets[actualString].create(this.generateQr).then(
              wallet => {
                this[`unlock${actualString}`](wallet);
              }
            );
          } else {
            this[`unlock${actualString}`]();
          }
        }
      } catch (e) {
        // eslint-disable-next-line
        console.log(e);
      }
    },
    generateQr(code) {
      this.qrcode = code;
    },
    unlockledger() {
      this.unlockPathOnly();
    },
    unlocktrezor() {
      this.unlockPathOnly();
    },
    unlockbitbox() {
      this.unlockPathAndPassword(this.hasPath, this.password);
    },
    unlockbitbox02() {
      this.unlockPathOnly();
    },
    unlocksecalot() {
      this.unlockPathAndPassword(this.hasPath, this.password);
    },
    unlockfinney(wallet) {
      this.unlockQrcode(wallet);
    },
    unlockxwallet(wallet) {
      this.unlockQrcode(wallet);
    },
    unlockbc_vault(address) {
      const actualAddress = address ? address : this.selectedAddress;
      const _wallet = this.walletInstance.getAccount(actualAddress);
      this.setWallet(_wallet);
    },
    unlockkeepkey() {},
    unlockcool_wallet() {
      this.unlockPathAndPassword(null, this.password);
    },
    setSelectedBitbox(val) {
      if (!val) {
        this.walletType = bitboxType;
      } else {
        this.walletType = bitbox02Type;
      }

      this.nextStep();
    },
    unlockPathOnly() {
      this.wallets[this.walletType]
        .create(this.hasPath)
        .then(_hwWallet => {
          this.hwWalletInstance = _hwWallet;
        })
        .catch(() => {
          this.step -= 1;
          this.hwWalletInstance = {};
        });
    },
    unlockPathAndPassword(path, password) {
      this.wallets[this.walletType]
        .create(path, password)
        .then(_hwWallet => {
          this.hwWalletInstance = _hwWallet;
        })
        .catch(() => {
          this.step -= 1;
          this.hwWalletInstance = {};
        });
    },
    unlockQrcode(wallet) {
      this.setWallet(wallet);
    },
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
        // eslint-disable-next-line
        console.log(e);
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
    },
    setWallet(wallet) {
      try {
        this.setWallet([wallet])
          .then(() => {
            this.$router.push({ name: 'Dashboard' });
          })
          .catch(e => {
            // eslint-disable-next-line
            console.log(e);
          });
      } catch (e) {
        // eslint-disable-next-line
        console.log(e);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.button-container {
  height: 100px;
}

table {
  border-spacing: 0;
}

.table-header {
  text-align: center;
  background-color: #f0f0f0;
  th {
    color: #96a8b6;
    font-weight: bold;
    text-transform: uppercase;
  }
}

.table-row-class {
  tr:nth-child(odd) {
    background-color: #f9f9f9;
  }
}

.network-container {
  max-height: 250px;
  overflow: scroll;
}

.address-copy-input {
  opacity: 0;
  position: absolute;
  z-index: -1;
}

.bcvault-active {
  background-color: #dcfff9 !important;
  border-color: #05c0a5 !important;
}

.bcvault-address {
  cursor: pointer;
  border: 1px solid #0b1a40;
}
.bcvault-address-container {
  width: 100%;
}
</style>
