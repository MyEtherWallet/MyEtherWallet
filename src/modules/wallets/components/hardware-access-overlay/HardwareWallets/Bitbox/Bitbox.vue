<template>
  <v-sheet
    v-if="showSelectBitbox"
    color="transparent"
    max-width="450px"
    width="100%"
  >
    BITBOX
    <mew-super-button
      class="mb-4"
      btn-mode="small-right-image"
      title="Bitbox"
      :cols-num="6"
      color-theme="basic"
      :right-icon-height="45"
      :right-icon="
        require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg')
      "
      @click.native="setSelectedBitbox(0)"
    />
    <mew-super-button
      btn-mode="small-right-image"
      title="Bitbox 2"
      :cols-num="6"
      color-theme="basic"
      :right-icon-height="45"
      :right-icon="
        require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg')
      "
      @click.native="setSelectedBitbox(1)"
    />
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
                          <v-radio :label="item.service" :value="item.url" />
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
                        <th width="25%" class="align-center">Eth Balance</th>
                        <th width="25%" class="align-center"># of Tokens</th>
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
                                <span>{{ acc.address | concatAddress }}</span>
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
                  setHardwareWallet(wallet.account);
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
                    btn-size="xlarge"
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
</template>
<!--  </mew-overlay>-->
<!--</template>-->

<script>
// TODO: add component in mew components
// import GroupRadioButtons from '@/components/Buttons/GroupRadioButtons';
// import addressTable from './components/AddressTable/AddressTable';

import {
  BCVAULT as bcvaultType,
  BITBOX as bitboxType,
  BITBOX02 as bitbox02Type,
  COOLWALLET as coolwalletType,
  FINNEY as finneyType,
  KEEPKEY as keepkeyType,
  LEDGER as ledgerType,
  SECALOT as secalotType,
  TREZOR as trezorType,
  XWALLET as xwalletType
} from '@/modules/wallets/utils/bip44/walletTypes';
import appPaths from '@/modules/wallets/utils/hardware/ledger/appPaths';
import bitboxWallet from '@/modules/wallets/utils/hardware/bitbox';
import bitbox02Wallet from '@/modules/wallets/utils/hardware/bitbox02';
import { mapActions, mapState } from 'vuex';
import { ERROR, Toast } from '@/components/toast';
import allPaths from '@/modules/wallets/utils/bip44';

const MAX_ADDRESSES = 5;
const walletHolder = {
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
  }
};

export default {
  components: {
    // GroupRadioButtons,
    // addressTable
  },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    },
    walletType: {
      type: String,
      default: ''
    },
    change: {
      default: false,
      type: Boolean
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
      ledgerApps: appPaths.map(item => {
        return {
          name: item.network.name_long,
          value: item.network.name_long
        };
      }),
      wallets: walletHolder,
      // resettable
      step: 1,
      steps: {},
      hwWalletInstance: {},
      selectedPath: null,
      versionType: '',
      selectedLedgerApp: {
        name: '',
        value: ''
      },
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
    ...mapState('global', ['Networks']),
    ...mapState('wallet', ['network']),
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
      return this.walletType.includes('bitbox');
    },
    showNetworkAddresses() {
      return (
        Object.keys(this.hwWalletInstance).length > 0 &&
        // this.step >= 1 &&
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
          this.setNetwork(found);
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
            newVal.errorHandler(e);
          }
        }
      }
    }
  },
  mounted() {
    this.selectedNetwork = this.network.url;
  },
  methods: {
    ...mapActions('wallet', ['setWallet', 'setNetwork']),
    setBCvaultAddress(address) {
      this.selectedAddress = address;
    },
    reset() {
      this.step = 0;
      this.steps = {};
      this.hwWalletInstance = {};
      this.selectedPath = null;
      this.versionType = '';
      this.selectedLedgerApp = {
        name: '',
        value: ''
      };
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
      this.reset();
      this.close('showHardware');
    },
    nextStep(str) {
      try {
        const actualString =
          typeof str === 'string' && str !== '' ? str : this.versionType;
        if (!this.step) {
          this.versionType = actualString;
        }
        this.step += 1;
        // bcvault initializes on step 1 but unlocks at step 2
        // if (this.wallets[actualString].accountOnly && this.step === 1) {
        //   this.bcvaultLoading = true;
        //   this.walletInstance = this.wallets[actualString].create();
        //   this.walletInstance
        //     .init()
        //     .then(res => {
        //       if (res.length > 1) {
        //         this.accounts = res;
        //         this.bcvaultLoading = false;
        //       } else if (res.length === 1) {
        //         this[`unlock${actualString}`](
        //           res[0].userRawData + res[0].address
        //         );
        //       }
        //     })
        //     .catch(() => {
        //       this.bcvaultLoading = false;
        //     });
        // }
        console.log(actualString); // todo remove dev item
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
        Toast(e.message, {}, ERROR);
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
      this.setHardwareWallet(_wallet);
    },
    unlockkeepkey() {},
    unlockcool_wallet() {
      this.unlockPathAndPassword(null, this.password);
    },
    setSelectedBitbox(val) {
      if (!val) {
        this.versionType = bitboxType;
      } else {
        this.versionType = bitbox02Type;
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
      this.setHardwareWallet(wallet);
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
    },
    setHardwareWallet(wallet) {
      try {
        this.setWallet([wallet])
          .then(() => {
            this.$router.push({ name: 'Dashboard' });
          })
          .catch(e => {
            Toast(e.message, {}, ERROR);
          });
      } catch (e) {
        Toast(e.message, {}, ERROR);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.overlay-content {
  width: 500px;
}
</style>
