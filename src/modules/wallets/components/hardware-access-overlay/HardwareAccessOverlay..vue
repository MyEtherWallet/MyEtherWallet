<template>
  <mew-overlay
    :show-overlay="open"
    :title="title"
    right-btn-text="Cancel"
    :back="accessBack"
    :close="overlayClose"
  >
    <template v-slot:mewOverlayBody>
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
                    <template v-slot:contentSlot>
                      <img :src="button.icon" />
                    </template>
                  </mew-super-button>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </div>
      <mew6-white-sheet v-else-if="step === 1 && showPaths">
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
                <template v-slot:panelBody1>
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
                <template v-slot:panelBody2>
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
                                    <blockie
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
                          button-size="small"
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
                          button-size="small"
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
                  button-size="large"
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
              <v-row align="center" justify="center">
                <qrcode :value="qrcode" :options="{ size: 186 }" />
              </v-row>
              <v-row
                v-show="walletType === 'xwalletType'"
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
    needsQr: false
  },
  [trezorType]: {
    create: trezorWallet,
    when: 1,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false
  },
  [bitboxType]: {
    create: bitboxWallet,
    when: 2,
    hasPaths: true,
    requiresPassword: true,
    needsQr: false
  },
  [bitbox02Type]: {
    create: bitbox02Wallet,
    when: 2,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false
  },
  [secalotType]: {
    create: secalotWallet,
    when: 2,
    hasPaths: true,
    requiresPassword: true,
    needsQr: false
  },
  [keepkeyType]: {
    create: keepkeyWallet,
    when: 1,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false
  },
  [finneyType]: {
    create: mewconnectWallet,
    when: 1,
    hasPaths: false,
    requiresPassword: false,
    needsQr: true
  },
  [xwalletType]: {
    create: mewconnectWallet,
    when: 1,
    hasPaths: false,
    requiresPassword: false,
    needsQr: true
  },
  [bcvaultType]: {
    create: bcvaultWallet,
    when: 1,
    hasPaths: false,
    requiresPassword: false,
    needsQr: false
  },
  [coolwalletType]: {
    create: coolwalletWallet,
    when: 2,
    hasPaths: false,
    requiresPassword: true,
    needsQr: false
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
      step: 0,
      steps: {},
      hwWalletInstance: {},
      selectedPath: null,
      wallets: walletHolder,
      walletInstance: {},
      walletType: '',
      selectedLedgerApp: '',
      ledgerApps: parsedAppPaths,
      selectedAddress: '',
      panelItems: [
        {
          name: 'Network'
        },
        {
          name: 'Address to interact with'
        }
      ],
      selectedNetwork: '',
      accounts: [],
      currentIdx: 0,
      acceptTerms: false,
      link: {
        title: 'Terms',
        url: 'https://www.myetherwallet.com/terms-of-service'
      },
      addressPage: 0,
      qrcode: ''
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
    showNetworkAddresses() {
      return Object.keys(this.hwWalletInstance).length > 0 && this.step >= 1;
    },
    showQrCode() {
      return this.wallets[this.walletType].needsQr;
    },
    showPaths() {
      return this.wallets[this.walletType].hasPaths;
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
      return !this.step ? 'Hardware Wallets' : this.steps[this.step];
    },
    wallet() {
      const wallet = this.accounts.find(item => {
        return item.address === this.selectedAddress;
      });

      return wallet ? wallet : null;
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
    ...mapActions(['decryptWallet']),
    accessBack() {
      !this.step ? this.close() : (this.step -= 1);
    },
    overlayClose() {
      this.close();
    },
    nextStep(str) {
      try {
        const actualString =
          typeof str === 'string' && str !== '' ? str : this.walletType;
        if (!this.step) {
          this.walletType = actualString;
        }
        this.step += 1;
        this.steps[this.step] = actualString;
        if (this.wallets[actualString].when === this.step) {
          if (!this.wallets[actualString].requiresPassword) {
            this.wallets[actualString].create().then(instance => {
              this.walletInstance = instance;
            });
          } else if (this.wallets[actualString].needsQr) {
            new this.wallets[actualString].create(this.generateQr).then(
              wallet => {
                this.unlockQrcode(wallet);
              }
            );
          } else {
            this.wallets[actualString].create().then(instance => {
              this.walletInstance = instance;
            });
          }
        } else if (this.wallets[actualString].when < this.step) {
          this[`unlock${actualString}`]();
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
      this.unlockPathAndPassword();
    },
    unlockbitbox02() {
      this.unlockPathOnly();
    },
    unlocksecalot() {
      this.unlockPathAndPassword();
    },
    unlockkeepkey() {},
    unlockfinney() {},
    unlockxwallet() {},
    unlockbc_vault() {},
    unlockcool_wallet() {},
    unlockPathOnly() {
      this.wallets[this.walletType]
        .create(this.selectedPath.value)
        .then(_hwWallet => {
          this.hwWalletInstance = _hwWallet;
        });
    },
    unlockPathAndPassword() {
      this.wallets[this.walletType]
        .create(this.selectedPath.value)
        .then(_hwWallet => {
          this.hwWalletInstance = _hwWallet;
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
        this.decryptWallet([wallet])
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
</style>
