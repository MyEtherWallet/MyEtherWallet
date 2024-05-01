<template>
  <div style="width: 100%">
    <div v-if="paths.length > 0 && !hidePathSelection" class="text-right mb-3">
      <access-wallet-derivation-path
        :selected-path="selectedPath"
        :passed-paths="paths"
        :disable-custom-paths="disableCustomPaths"
        @setPath="setPath"
      />
    </div>
    <mew-expand-panel :interactive-content="true" :panel-items="panelItems">
      <!--
          =====================================================================================
            Panel: Select Address
          =====================================================================================
          -->
      <template #panelBody1>
        <v-radio-group v-model="selectedAddress">
          <mew-light-table
            :loader-count="5"
            background
            full-width
            flat
            :loading="isLoading"
            :no-table-padding="isMobile"
          >
            <table>
              <thead>
                <tr>
                  <td style="width: 55px; padding-right: 0"></td>
                  <td v-if="!isMobile" style="padding: 0"></td>
                  <td>ADDRESS</td>
                  <td v-if="!isOfflineApp" class="text-right">
                    <span v-if="!isMobile">{{ network.type.name }}</span>
                    BALANCE
                  </td>
                </tr>
              </thead>

              <tbody>
                <tr v-for="acc in accounts" :key="acc.address">
                  <td style="padding-right: 0">
                    <v-radio label="" :value="acc.address" class="mb-0" />
                  </td>
                  <td v-if="!isMobile" style="padding: 0">{{ acc.idx }}</td>
                  <td>
                    <div class="d-flex align-center flex-shrink-1">
                      <mew-blockie
                        width="21px"
                        height="21px"
                        :address="acc.address"
                        class="mr-2"
                      />
                      <div>
                        <div class="d-flex align-center">
                          <mew-transform-hash
                            style="
                              width: 34vw;
                              max-width: 220px;
                              min-width: 100px;
                            "
                            :hash="acc.address"
                          />
                          <app-copy-btn
                            v-if="!isMobile"
                            class="ml-2"
                            :copy-value="acc.address"
                          >
                            <v-btn x-small icon color="greenPrimary">
                              <img
                                src="@/assets/images/icons/icon-copy-green.svg"
                                alt="copy"
                                height="13"
                              />
                            </v-btn>
                          </app-copy-btn>
                          <a
                            v-if="!isMobile"
                            :href="getExplorerLink(acc.address)"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <v-btn x-small icon color="greenPrimary">
                              <img
                                src="@/assets/images/icons/icon-arrow-top-right-green.svg"
                                alt="copy"
                                height="13"
                              />
                            </v-btn>
                          </a>
                        </div>

                        <div v-if="acc.ensName" class="mew-label">
                          {{ acc.ensName }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="d-flex justify-end align-center">
                    <div
                      v-if="!isOfflineApp"
                      class="balance-overflow text-right mew-label"
                      style="width: 18vw; max-width: 81px"
                    >
                      {{ acc.balance }}
                      <span v-if="!isMobile">{{ network.type.name }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </mew-light-table>
        </v-radio-group>

        <div>
          <!--
              =====================================================================================
               Previous / Next Buttons
              =====================================================================================
              -->
          <v-row class="pb-6" align="center" justify="center">
            <div>
              <mew-button
                title="Previous"
                color-theme="basic"
                icon="mdi-chevron-left"
                icon-type="mdi"
                btn-size="small"
                icon-align="left"
                btn-style="transparent"
                :disabled="currentIdx === 0 || addressPage === 1"
                @click.native="previousAddressSet"
              />
              <mew-button
                title="Next"
                color-theme="basic"
                icon="mdi-chevron-right"
                icon-type="mdi"
                btn-size="small"
                icon-align="right"
                btn-style="transparent"
                @click.native="nextAddressSet"
              />
            </div>
          </v-row>
        </div>
      </template>
      <!--
          =====================================================================================
            Panel: Network
          =====================================================================================
          -->
      <template #panelBody2>
        <div class="px-5">
          <network-switch :is-wallet="false" @newNetwork="setNetworkPanel" />
        </div>
      </template>
    </mew-expand-panel>
    <!--
        =====================================================================================
         Terms
        =====================================================================================
        -->
    <div class="d-flex align-center flex-column py-6">
      <mew-checkbox
        v-model="acceptTerms"
        :label="label"
        :link="link"
        class="justify-center"
      />
    </div>
    <!--
        =====================================================================================
          Back / Access Wallet Buttons
        =====================================================================================
        -->
    <app-btn-row
      class="my-2"
      next-btn-text="Access my wallet"
      :next-btn-method="accessWallet"
      :back-btn-method="null"
      :next-disable="buttonDisabled"
    />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import { fromWei, toChecksumAddress } from 'web3-utils';
import { isEmpty, isEqual } from 'underscore';
import ENS from '@ensdomains/ensjs';
import Web3 from 'web3';
import { isValidAddress } from 'ethereumjs-util';

import NetworkSwitch from '@/modules/network/components/NetworkSwitch.vue';
import AccessWalletDerivationPath from '@/modules/access-wallet/hardware/components/AccessWalletDerivationPath.vue';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { getEthBalance } from '@/apollo/queries/wallets/wallets.graphql';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';

const MAX_ADDRESSES = 5;

export default {
  name: 'AccessWalletAddressNetwork',
  filters: {
    concatAddress(val) {
      return `${val.substring(0, 11)}...${val.substring(
        val.length - 4,
        val.length
      )}`;
    },
    concatAddressXS(val) {
      return `${val.substring(0, 4)}...${val.substring(
        val.length - 4,
        val.length
      )}`;
    }
  },
  components: {
    NetworkSwitch,
    AccessWalletDerivationPath
  },
  props: {
    handlerWallet: {
      type: Object,
      default: function () {
        return {};
      }
    },
    paths: {
      type: Array,
      default: () => []
    },
    selectedPath: {
      type: Object,
      default: () => {}
    },
    /**
     * hides access wallet derivation path component
     */
    hidePathSelection: {
      type: Boolean,
      default: false
    },
    /**
     * disables custom derivation path
     */
    disableCustomPaths: {
      type: Boolean,
      default: false
    },
    hideNetworks: {
      type: Boolean,
      default: false
    }
  },
  apollo: {
    /**
     * Apollo query to return eth balance for each account
     */
    getEthBalance: {
      query: getEthBalance,
      variables() {
        return {
          hash: this.accountAddress
        };
      },
      skip() {
        return this.isOfflineApp
          ? true
          : this.skipApollo || this.accountAddress === null;
      },
      result({ data }) {
        if (data && data.getEthBalance) {
          if (this.accounts[this.onAccountIndex]) {
            /**
             * Sets the balance of the account of accountAddress
             */
            this.accounts[this.onAccountIndex].balance =
              formatFloatingPointValue(
                fromWei(data.getEthBalance.balance)
              ).value;
            /**
             * Find the next index and set the address of it to accountAddress
             */
            const nextIdx = this.onAccountIndex + 1;
            if (
              nextIdx < this.accounts.length &&
              this.accounts[nextIdx].balance === 'Loading..'
            ) {
              this.accountAddress = this.accounts[nextIdx].address;
            }
          }
        }
      }
    }
  },
  data() {
    return {
      currentIdx: 0,
      acceptTerms: false,
      label: 'To access my wallet, I accept ',
      link: {
        title: 'Terms',
        url: 'https://www.myetherwallet.com/terms-of-service'
      },
      selectedAddress: '',
      accountAddress: '',
      /*Network Items: */
      panelNetworkSubstring: '',
      /* Path Items: */
      addressPage: 0,
      accounts: []
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    ...mapState('addressBook', ['addressBookStore']),
    ...mapState('wallet', ['isOfflineApp']),
    buttonDisabled() {
      return !this.acceptTerms || this.selectedAddress === '';
    },
    web3() {
      return new Web3(this.network.url);
    },
    isLoading() {
      return this.accounts.length !== MAX_ADDRESSES;
    },
    /**
     * Property returns the index of the account of the accountAddress
     */
    onAccountIndex() {
      return this.accounts.findIndex(
        acc => acc.address === this.accountAddress
      );
    },
    /**
     * Property returns boolean and validates whether or not to skip Apollo GetEthBalance query.
     */
    skipApollo() {
      return (
        (!this.accountAddress && this.accountAddress === '') ||
        (this.accounts[this.onAccountIndex] &&
          this.accounts[this.onAccountIndex].balance !== 'Loading..')
      );
    },
    /**
     * Property returns edited version of the selected address. ie: 0x3453...3a3b
     */
    panelAddressSubstring() {
      return this.selectedAddress && this.selectedAddress !== ''
        ? `${this.selectedAddress.substring(
            0,
            6
          )} ... ${this.selectedAddress.substring(
            this.selectedAddress.length - 4,
            this.selectedAddress.length
          )}`
        : '';
    },
    /**
     * Property returns expand panel items for the Address and Network
     */
    panelItems() {
      const panelItems = [
        {
          name: 'Address',
          subtext: this.panelAddressSubstring,
          colorTheme: 'greyLight',
          hasActiveBorder: true
        }
      ];
      if (!this.hideNetworks) {
        panelItems.push({
          name: 'Network',
          subtext: this.panelNetworkSubstring,
          colorTheme: 'greyLight',
          hasActiveBorder: true
        });
      }
      return panelItems;
    },
    /**
     * Property returns default network and nodes items
     * Property Interface:
     * {  name = string -> Name of the Path,
     *    subtext = string --> Derivation Path,
     *    value = tring --> Derivation Path
     * }
     */
    walletAccount() {
      const wallet = this.accounts.find(item => {
        return item.address === this.selectedAddress;
      });
      if (wallet) {
        return wallet.account;
      }
      return null;
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    blockExplorer() {
      const networkType = this.network.type;
      const blockExplorer = networkType.blockExplorerAddr;
      return blockExplorer;
    }
  },
  watch: {
    accounts: {
      deep: true,
      handler: function (newVal) {
        this.accounts = newVal;
      }
    },
    network: {
      deep: true,
      handler: function () {
        this.changeHandler();
      }
    },
    selectedPath: {
      handler: function (newVal, oldVal) {
        if (!isEqual(newVal, oldVal)) {
          this.changeHandler();
        }
      },
      deep: true
    },
    handlerWallet(newVal, oldVal) {
      if (!isEqual(newVal, oldVal)) {
        this.changeHandler();
      }
    }
  },
  mounted() {
    if (this.isOfflineApp) {
      this.link = {};
      this.label = 'To access my wallet, I accept Terms';
    }
    this.setNetworkPanel();
    this.setAccounts();
  },
  methods: {
    setPath(path) {
      this.$emit('setPath', path);
    },
    changeHandler() {
      this.accounts.splice(0);
      this.addressPage = 0;
      this.selectedAddress = '';
      this.accountAddress = '';
      this.currentIdx = 0;
      this.setAccounts();
    },
    /**
     * Async method that gets accounts according to the pagination
     */
    async setAccounts() {
      /**
       * prevents error when this.handlerWallet
       * is empty due to selectedPatch changing
       */
      if (!isEmpty(this.handlerWallet)) {
        const accountsArray = [];
        try {
          // resets the array to empty
          this.accounts.splice(0);
          const ens =
            this.network.type.hasOwnProperty('ens') && !this.isOfflineApp
              ? new ENS({
                  provider: this.web3.eth.currentProvider,
                  ensAddress: this.network.type.ens.registry
                })
              : null;
          for (
            let i = this.currentIdx;
            i < this.currentIdx + MAX_ADDRESSES;
            i++
          ) {
            const account = await this.handlerWallet.getAccount(i);
            const address = account.getAddressString();
            const name = ens
              ? await ens.getName(address)
              : {
                  name: ''
                };
            const balance = this.isOfflineApp
              ? '0'
              : this.network.type.isEthVMSupported.supported
              ? 'Loading..'
              : await this.web3.eth.getBalance(address);
            const nickname = this.getNickname(address);
            accountsArray.push({
              address: address,
              account: account,
              idx: i,
              balance: balance !== 'Loading..' ? fromWei(balance) : balance,
              ensName: name.name ? name.name : '',
              nickname: nickname
            });
          }
          this.currentIdx += MAX_ADDRESSES;
          this.addressPage += 1;
          this.selectedAddress = accountsArray[0].address;
          this.accountAddress = accountsArray[0].address;
          this.accounts = accountsArray;
        } catch (e) {
          Toast(e, {}, ERROR);
        }
      }
    },
    getNickname(address) {
      const checksummedAddress = toChecksumAddress(address);
      const isStored = this.addressBookStore.find(item => {
        const addressStored = item.resolvedAddr
          ? item.resolvedAddr
          : item.address;
        if (!isValidAddress(addressStored)) return;
        const storedAddr = toChecksumAddress(addressStored);
        if (storedAddr === checksummedAddress) {
          return item;
        }
      });
      return isStored
        ? isStored.resolvedAddr
          ? isStored.resolvedAddr
          : isStored.nickname
        : '';
    },
    /**
     * Methods generates previous derived addresses
     */
    nextAddressSet() {
      this.setAccounts();
    },
    /**
     * Methods generates previous derived addresses
     */
    previousAddressSet() {
      const pageDeductor = this.currentIdx / MAX_ADDRESSES;
      const idxDeductor = this.addressPage * MAX_ADDRESSES;
      this.addressPage -=
        this.currentIdx <= 10 ? pageDeductor : pageDeductor - 1;
      this.currentIdx -=
        this.currentIdx <= 10 ? idxDeductor : idxDeductor - MAX_ADDRESSES;
      this.setAccounts();
    },
    /**
     * Methods sets panelNetworkSubstring  based on the
     * @return {void}
     */
    setNetworkPanel() {
      this.panelNetworkSubstring = `${this.network.type.name} - ${this.network.type.name_long}`;
    },
    /**
     * Methods emits parent to unlock wallet
     * and passes selected wallet account
     * this.walletAccount should always be defined,
     * check in place if logic was compromised.
     */
    accessWallet() {
      if (this.walletAccount) {
        this.$emit('unlock', this.walletAccount);
      }
    },
    getExplorerLink(addr) {
      return this.blockExplorer.replace('[[address]]', addr);
    }
  }
};
</script>
<style lang="scss" scoped>
table {
  border-spacing: 0;
}

.table-header {
  text-align: start;
  background-color: #f0f0f0;
  p {
    color: #96a8b6;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 0px;
  }
}
.table-row-class {
  p {
    margin-bottom: 0px;
  }
}
.table-row-class:nth-child(odd) {
  background-color: #f9f9f9;
}
.balance-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<style lang="scss">
.custom-skeleton-loader {
  .v-skeleton-loader__avatar {
    height: 25px !important;
    width: 25px !important;
  }

  .v-skeleton-loader__list-item-avatar,
  .v-skeleton-loader__list-item {
    background-color: transparent !important;
    height: 25px !important;
  }
}
</style>
