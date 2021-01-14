<template>
  <mew-overlay
    :show-overlay="open"
    title="1. Connect with Ledger"
    right-btn-text="Cancel"
  >
    <template #mewOverlayBody>
      <v-sheet
        v-if="showNetworkAddresses"
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
      <mew6-white-sheet v-else-if="showPaths">
        <div class="overlay-content pa-8">
          <div class="text-center mb-8">
            <img :src="icon" alt="Network Icon" height="60" />
          </div>
          <div>
            <mew-select
              v-show="walletType === 'ledger'"
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
            btn-size="xlarge"
            title="Unlock wallet"
            has-full-width
            @click.native="nextStep"
          />
        </div>
      </mew6-white-sheet>
    </template>
<!--    <template #mewComponent>
      <mew-tabs :items="tabs" is-block>
        <template #tabContent1>
          <mew6-white-sheet>
            <div class="overlay-content pa-8">
              <div class="text-center mb-8">
                <img
                  src="@/assets/images/currencies/icon-eth-blue.svg"
                  alt="Eth icon"
                  height="60"
                />
              </div>
              <div>
                <mew-select label="App opened in Ledger" />
                <mew-select label="HD derivation path" />
              </div>
              <mew-button
                btn-size="xlarge"
                title="Connect with Ledger"
                has-full-width
                @click.native="activeTab = 1"
              />
            </div>
          </mew6-white-sheet>
        </template>
        <template #tabContent2>
          <mew6-white-sheet>
            <GroupRadioButtons :buttons="networkButtons" />
            <address-table />
          </mew6-white-sheet>
        </template>
      </mew-tabs>-->
<!--    </template>-->
  </mew-overlay>
</template>

<script>
// TODO: add component in mew components
// import GroupRadioButtons from '@/components/Buttons/GroupRadioButtons';
// import addressTable from '@/components/AddressTable/AddressTable';

import qrcode from '@xkeshi/vue-qrcode';
import mewSuperButton from '@/components/mewSuperButton/MewSuperButton';
import { Toast, ERROR } from '@/components/toast';
import ledgerWallet from '@/modules/wallets/utils/hardware/ledger';
import appPaths from '@/modules/wallets/utils/hardware/ledger/appPaths.js';
import allPaths from '@/modules/wallets/utils/bip44';
import { mapState, mapActions } from 'vuex';

// const parsedAppPaths = appPaths.map(item => {
//   const newObj = {
//     name: item.network.name_long,
//     value: item.network.name_long
//   };
//
//   return newObj;
// });

const MAX_ADDRESSES = 5;
import {
  BITBOX as bitboxType, BITBOX02 as bitbox02Type,
  LEDGER as ledgerType,
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
}

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
    }
  },
  data() {
    return {
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
      step: 0,
      steps: {},
      hwWalletInstance: {},
      selectedPath: null,
      // walletType: '',
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
      walletInstance: {},
      tabs: [
        {
          name: ''
        },
        {
          name: ''
        }
      ],
      networkButtons: [
        {
          groupName: 'ETH',
          btns: [
            { label: 'myetherapi.com', value: 'eth-myetherapi' },
            { label: 'infura.io', value: 'eth-infura' },
            { label: 'giveth.io', value: 'eth-giveth' },
            { label: 'therscan.io', value: 'eth-therscan' }
          ]
        },
        {
          groupName: 'ROP',
          btns: [
            { label: 'etherscan.io', value: 'rop-etherscan' },
            { label: 'infura.io', value: 'rop-infura' },
            { label: 'giveth.io', value: 'rop-giveth' },
            { label: 'therscan.io', value: 'rop-therscan' }
          ]
        },
        {
          groupName: 'RIN',
          btns: [
            { label: 'etherscan.io', value: 'rin-etherscan' },
            { label: 'infura.io', value: 'rin-infura' },
            { label: 'giveth.io', value: 'rin-giveth' },
            { label: 'therscan.io', value: 'rin-therscan' }
          ]
        }
      ],
      appSelect: 'eth',
      derivationPathSelect: '1',
      activeTab: 0,
      apps: [
        { label: 'Ethereum', value: 'eth' },
        { label: 'SometingElse', value: 'smt' }
      ],
      derivationPath: [
        { label: `m/44'/60'/0'`, value: '1' },
        { label: `m/44'/60'/0'`, value: '2' }
      ]
    };
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
      // this.walletType = '';
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
          typeof str === 'string' && str !== '' ? str : this.walletType;
        // if (!this.step) {
        //   this.walletType = actualString;
        // }
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
        Toast(e.message, {}, ERROR);
      }
    },
    // generateQr(code) {
    //   this.qrcode = code;
    // },
    unlockledger() {
      this.unlockPathOnly();
    },
    // unlocktrezor() {
    //   this.unlockPathOnly();
    // },
    // unlockbitbox() {
    //   this.unlockPathAndPassword(this.hasPath, this.password);
    // },
    // unlockbitbox02() {
    //   this.unlockPathOnly();
    // },
    // unlocksecalot() {
    //   this.unlockPathAndPassword(this.hasPath, this.password);
    // },
    // unlockfinney(wallet) {
    //   this.unlockQrcode(wallet);
    // },
    // unlockxwallet(wallet) {
    //   this.unlockQrcode(wallet);
    // },
    // unlockbc_vault(address) {
    //   const actualAddress = address ? address : this.selectedAddress;
    //   const _wallet = this.walletInstance.getAccount(actualAddress);
    //   this.setHardwareWallet(_wallet);
    // },
    // unlockkeepkey() {},
    // unlockcool_wallet() {
    //   this.unlockPathAndPassword(null, this.password);
    // },
    // setSelectedBitbox(val) {
    //   if (!val) {
    //     this.walletType = bitboxType;
    //   } else {
    //     this.walletType = bitbox02Type;
    //   }
    //
    //   this.nextStep();
    // },
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
    // unlockPathAndPassword(path, password) {
    //   this.wallets[this.walletType]
    //     .create(path, password)
    //     .then(_hwWallet => {
    //       this.hwWalletInstance = _hwWallet;
    //     })
    //     .catch(() => {
    //       this.step -= 1;
    //       this.hwWalletInstance = {};
    //     });
    // },
    // unlockQrcode(wallet) {
    //   this.setHardwareWallet(wallet);
    // },
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
