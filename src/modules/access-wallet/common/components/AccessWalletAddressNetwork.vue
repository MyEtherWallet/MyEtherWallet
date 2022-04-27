<template>
  <div style="width: 100%">
    <div v-if="paths.length > 0 && !hideCustomPaths" class="text-right mb-3">
      <access-wallet-derivation-path
        :selected-path="selectedPath"
        :passed-paths="paths"
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
        <div>
          <v-radio-group v-model="selectedAddress">
            <!--
                =====================================================================================
                  Table - Header
                =====================================================================================
                -->
            <v-row dense class="table-header mx-0">
              <v-col offset="3">
                <p>Address</p>
              </v-col>
              <v-col cols="4" sm="3">
                <p class="text-center">{{ network.type.name }} Balance</p>
              </v-col>
            </v-row>
            <!--
                =====================================================================================
                  Table - Address Row
                =====================================================================================
                -->
            <v-row
              v-for="index in 5"
              v-show="isLoading"
              :key="`${index}addressLoader`"
              dense
              class="table-row-class align-center justify-center py-2 mx-0"
            >
              <v-col md="9" sm="9">
                <v-row
                  dense
                  class="align-center justify-start pl-1 pl-sm-3 pr-2 pr-sm-3"
                >
                  <v-col cols="12" class="d-flex flex-column">
                    <v-skeleton-loader
                      max-height="25"
                      type="list-item-avatar"
                      class="custom-skeleton-loader"
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col md="3" sm="3">
                <v-skeleton-loader
                  type="list-item"
                  max-height="25"
                  class="custom-skeleton-loader"
                />
              </v-col>
            </v-row>
            <v-row
              v-for="acc in accounts"
              v-show="!isLoading"
              :key="acc.address"
              dense
              class="table-row-class align-center justify-center py-2 mx-0"
            >
              <v-col cols="1" sm="1">
                <v-radio label="" :value="acc.address" class="mx-2" />
              </v-col>
              <v-col cols="1" sm="1" class="text-center">
                {{ acc.idx }}
              </v-col>
              <v-col cols="7">
                <v-row
                  dense
                  class="align-center justify-start pl-1 pl-sm-3 pr-2 pr-sm-3"
                >
                  <mew-blockie
                    width="25px"
                    height="25px"
                    :address="acc.address"
                    class="mr-2"
                  />
                  <v-col cols="9" class="d-none d-sm-flex flex-column">
                    <a
                      :href="getExplorerLink(acc.address)"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span v-if="acc.nickname" class="font-weight-bold">{{
                        acc.nickname
                      }}</span>
                      <mew-transform-hash :hash="acc.address" />
                      <span v-if="acc.ensName">{{ acc.ensName }}</span>
                    </a>
                  </v-col>
                  <p class="d-block d-sm-none">
                    {{ acc.address | concatAddressXS }}
                  </p>
                  <mew-copy
                    is-small
                    tooltip="Copy Address"
                    :copy-value="acc.address"
                    class="ml-2"
                  />
                </v-row>
              </v-col>
              <v-col cols="3">
                <p class="balance-overflow text-center">
                  {{
                    acc.balance === 'Loading..'
                      ? acc.balance
                      : `${acc.balance} ${network.type.name}`
                  }}
                </p>
              </v-col>
            </v-row>
          </v-radio-group>
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
                :disabled="currentIdx === 0"
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
        label="To access my wallet, I accept "
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
      :next-disable="!acceptTerms"
    />
  </div>
</template>
<script>
import AppBtnRow from '@/core/components/AppBtnRow';
import NetworkSwitch from '@/modules/network/components/NetworkSwitch.vue';
import AccessWalletDerivationPath from '@/modules/access-wallet/hardware/components/AccessWalletDerivationPath.vue';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { getEthBalance } from '@/apollo/queries/wallets/wallets.graphql';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { fromWei, toChecksumAddress } from 'web3-utils';
import { mapGetters, mapState } from 'vuex';
import { isEmpty, isEqual } from 'underscore';
import ENS, { getEnsAddress } from '@ensdomains/ensjs';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';

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
    AppBtnRow,
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
    hideCustomPaths: {
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
        return this.skipApollo || this.accountAddress === null;
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
        wallet.account.isHardware = true;
        return wallet.account;
      }
      return null;
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
          const chainId = BigNumber(this.network.type.chainID);
          const ens = this.network.type.hasOwnProperty('ens')
            ? new ENS({
                provider: this.web3.eth.currentProvider,
                ensAddress: getEnsAddress(chainId.toString())
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
            const balance = this.network.type.isEthVMSupported.supported
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
        const address = item.resolvedAddr
          ? toChecksumAddress(item.resolvedAddr)
          : toChecksumAddress(item.address);
        if (address === checksummedAddress) {
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
      return this.network.type.blockExplorerAddr.replace('[[address]]', addr);
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
