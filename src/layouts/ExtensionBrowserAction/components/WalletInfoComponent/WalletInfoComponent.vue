<template>
  <div class="wallet-info-container">
    <div class="wallet-info-header">
      <div class="address-and-blockie">
        <div class="blockie-container">
          <blockie :address="address" width="50px" height="50px" />
        </div>
        <div class="address-and-nickname-container">
          <p>
            <b> {{ nickname }} </b>
          </p>
          <p>
            {{ concattedAddr }}
            <img src="@/assets/images/icons/copy.svg" @click="copyAddress" />
          </p>
          <input ref="addressInput" v-model="address" />
        </div>
      </div>
      <div class="wallet-options">
        <b-dropdown
          toggle-class="wallet-options-toggle"
          no-caret
          offset="-60"
          menu-class="wallet-options-menu"
        >
          <template v-slot:button-content>
            <i class="fa fa-ellipsis-v fa-lg" />
          </template>
          <b-dropdown-text
            v-if="walletType !== 'watchOnly'"
            @click="
              () => {
                access(wallet, 'access');
              }
            "
            >Access</b-dropdown-text
          >
          <b-dropdown-text @click="edit">Rename</b-dropdown-text>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-text class="remove-text" @click="openRemoveWallet"
            >Remove</b-dropdown-text
          >
        </b-dropdown>
        <i
          :class="[
            'fa fa-lg',
            !favorited ? 'fa-heart-o' : 'fa-heart heart-color'
          ]"
          @click="addToFavorites(address, nickname)"
        />
      </div>
    </div>
    <div class="wallet-info-body">
      <div class="low-eth-warning">
      </div>
      <div class="main-wallet-content">
        <div class="main-wallet-content-container">
          <div class="wallet-value-with-img">
            <div :class="[page !== ''? 'no-background':'','wallet-img-container']">
              <img alt class="icon" src="~@/assets/images/icons/wallet.svg" v-if="page === '' || walletType !== 'watchOnly'"/>
              <img alt class="icon" src="~@/assets/images/icons/hide-password.svg" v-else/>
            </div>
            <div class="wallet-value-container">
              <p class="title">Total Wallet Value</p>
              <p class="dollar-amt">
                {{ walletTokensWithBalance.totalWalletBalance }}
              </p>
            </div>
          </div>
          <div class="wallet-value-container">
            <p class="title">ETH Balance</p>
            <p class="dollar-amt">{{ convertedBalance }}</p>
            <p class="value">{{ fixedEthBalance }}</p>
          </div>
          <div class="wallet-value-container">
            <p class="title">Value of Token</p>
            <p class="dollar-amt">{{ walletTokensWithBalance.total }}</p>
            <p class="value">
              {{ walletTokensWithBalance.tokensWDollarAmtLength }} tokens
            </p>
          </div>
        </div>
        <div class="view-all-container" @click="showTokens = !showTokens">
          <p>{{ showTokens ? 'Hide all tokens' : 'View all tokens' }}</p>
          <i :class="['fa', showTokens ? 'fa-angle-up' : 'fa-angle-down']" />
        </div>
      </div>
      <div v-show="showTokens" class="wallet-tokens">
        <table v-if="walletTokensWithBalance.tokensWDollarAmt.length > 0">
          <tr class="table-header">
            <th>
              TOKEN NAME
            </th>
            <th>
              PRICE
            </th>
            <th>
              MARKET CAP
            </th>
            <th>
              CHANGE (24H)
            </th>
            <th>
              CHART(24H)
            </th>
            <th>
              AMOUNT
            </th>
            <th>
              MY VALUE
            </th>
          </tr>
          <tr
            v-for="(token, idx) in walletTokensWithBalance.tokensWDollarAmt"
            :key="token.symbol + `${idx}`"
            class="table-body"
          >
            <td>
              <div class="name-container">
                <!-- <div class="token-icon">
                  <img
                    v-if="
                      retrieveLogo(
                        token.tokenMew.address,
                        token.tokenMew.symbol
                      ).includes('.png')
                    "
                    :src="
                      retrieveLogo(
                        token.tokenMew.address,
                        token.tokenMew.symbol
                      )
                    "
                  />
                  <svg
                    v-if="
                      retrieveLogo(
                        token.tokenMew.address,
                        token.tokenMew.symbol
                      ).includes('.svg')
                    "
                    :xmlns="
                      retrieveLogo(
                        token.tokenMew.address,
                        token.tokenMew.symbol
                      )
                    "
                  />
                </div> -->
                <p>
                  {{ token.tokenMew.name }}
                  ({{ token.tokenMew.symbol }})
                </p>
              </div>
            </td>
            <td>$ {{ token.tokenData.quotes.USD.price }}</td>
            <td>$ {{ moneyFormat(token.tokenData.quotes.USD.market_cap) }}</td>
            <td>
              <p
                :class="
                  isGreateThanZero(
                    token.tokenData.quotes.USD.percent_change_24h
                  )
                    ? 'green'
                    : 'red'
                "
              >
                {{ toDecimal(token.tokenData.quotes.USD.percent_change_24h) }}%
                <i
                  :class="[
                    'fa',
                    isGreateThanZero(
                      token.tokenData.quotes.USD.percent_change_24h
                    )
                      ? 'fa-arrow-up'
                      : 'fa-arrow-down'
                  ]"
                />
              </p>
            </td>
            <td>CHART WIP</td>
            <td>{{ token.tokenMew.balance }}</td>
            <td>
              {{
                toDollar(
                  token.tokenMew.balance * token.tokenData.quotes.USD.price
                )
              }}
            </td>
          </tr>
        </table>

        <div v-else>
          Can't find tokens with value.
        </div>
      </div>
    </div>
    <!-- <interface-tokens-modal ref="tokenModal" :add-token="addToken" /> -->
    <edit-wallet-modal
      ref="editModal"
      :address="address"
      :name="parsedWallet.nick"
      :wallet="parsedWallet"
    />
    <remove-wallet-modal
      ref="removeWalletModal"
      :cancel-remove="cancelRemove"
      :wallet-type="parsedWallet.type"
      :nickname="parsedWallet.nick"
      :address="address"
    />
  </div>
</template>
<script>
import Blockie from '@/components/Blockie';
import TokenBalance from '@myetherwallet/eth-token-balance';
import sortByBalance from '@/helpers/sortByBalance.js';
import BigNumber from 'bignumber.js';
import EditWalletModal from '../EditWalletModal';
import RemoveWalletModal from '../RemoveWalletModal';
import { mapState } from 'vuex';
import { Toast, Misc } from '@/helpers';
import store from 'store';
import * as networkTypes from '@/networks/types';
import utils from 'web3-utils';
import InterfaceTokensModal from '@/layouts/InterfaceLayout/components/InterfaceTokensModal';
import masterFile from '@/master-file.json';

export default {
  components: {
    blockie: Blockie,
    'edit-wallet-modal': EditWalletModal,
    'remove-wallet-modal': RemoveWalletModal,
    'interface-tokens-modal': InterfaceTokensModal
  },
  props: {
    address: {
      type: String,
      default: ''
    },
    wallet: {
      type: String,
      default: ''
    },
    nickname: {
      type: String,
      default: ''
    },
    walletType: {
      type: String,
      default: 'watchOnly'
    },
    access: {
      type: Function,
      default: () => {}
    },
    detail: {
      type: Function,
      default: () => {}
    },
    balance: {
      type: String,
      default: ''
    },
    usd: {
      type: Number,
      default: 0
    },
    prices: {
      type: Object,
      default: () => {
        return {};
      }
    },
    page: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      tokens: [],
      localTokenVersion: [],
      customTokens: [],
      localCustomTokens: [],
      showTokens: false,
      masterFile: masterFile,
      favorited: false
    };
  },
  computed: {
    ...mapState('main', ['network', 'web3']),
    parsedWallet() {
      return JSON.parse(this.wallet);
    },
    convertedBalance() {
      const balance = new BigNumber(this.balance).times(this.usd).toNumber();
      return this.toDollar(balance);
    },
    concattedAddr() {
      return (
        this.address.substr(0, 18) +
        '...' +
        this.address.substr(this.address.length - 6, this.address.length)
      );
    },
    fixedEthBalance() {
      const currencyBalance = new BigNumber(this.balance).toFixed(2);
      return `${currencyBalance} ${this.network.type.currencyName}`;
    },
    walletTokensWithBalance() {
      const tokensWithBalance = this.tokens.filter(item => {
        return item.balance !== 'Load' && item.balance > 0;
      });
      let totalTokenAmt = 0;
      const tokensWithDollarAmt = [];
      tokensWithBalance.forEach(item => {
        if (this.prices[item.symbol]) {
          totalTokenAmt +=
            this.prices[item.symbol].quotes.USD.price * item.balance;
          tokensWithDollarAmt.push({
            tokenMew: item,
            tokenData: this.prices[item.symbol]
          });
        }
      });

      const currencyDollar = new BigNumber(this.balance).times(this.usd);
      const totalWalletBalance = currencyDollar.plus(totalTokenAmt).toNumber();

      return {
        tokens: tokensWithBalance,
        length: tokensWithBalance.length,
        tokensWDollarAmt: tokensWithDollarAmt,
        tokensWDollarAmtLength: tokensWithDollarAmt.length,
        total: this.toDollar(new BigNumber(totalTokenAmt).toNumber()),
        totalWalletBalance: this.toDollar(totalWalletBalance)
      };
    }
  },
  created() {
    window.chrome.storage.onChanged.addListener(this.fetchTokens);
  },
  mounted() {
    window.chrome.storage.sync.get('favorites', this.fetchTokens);
  },
  destroyed() {
    window.chrome.storage.onChanged.removeListener(this.fetchTokens);
  },
  methods: {
    addToFavorites(address, nickname) {
      let newArr = [];
      const dateAdded = new Date();
      const toAdd = {
        address,
        nickname,
        dateAdded
      };

      window.chrome.storage.sync.get('favorites', item => {
        newArr.push(toAdd);
        if (Object.keys(item).length > 0) {
          const parsedItem = JSON.parse(item['favorites']);
          const alreadyStored = parsedItem.find(item => {
            return item.address === toAdd.address;
          });
          if (!alreadyStored) {
            parsedItem.push(toAdd);
            newArr = parsedItem.slice();
          } else {
            newArr.splice(alreadyStored, 1);
          }
        }
        window.chrome.storage.sync.set(
          { favorites: JSON.stringify(newArr) },
          () => {}
        );
      });
    },
    retrieveLogo(address, symbol) {
      const networkMasterFile = this.masterFile.data.filter(item => {
        return (
          item.network.toLowerCase() === this.network.type.name.toLowerCase()
        );
      });
      try {
        return require(`@/assets/images/currency/coins/AllImages/${symbol}.svg`);
      } catch (e) {
        const foundToken = networkMasterFile.find(item => {
          return (
            utils.toChecksumAddress(item.contract_address) ===
            utils.toChecksumAddress(address)
          );
        });

        if (foundToken) {
          return foundToken.icon;
        }
        try {
          return require(`@/assets/images/networks/${symbol.toLowerCase()}`);
        } catch (e) {
          return this.network.type.icon;
        }
      }
      // console.log(networkMasterFile);
    },
    isGreateThanZero(val) {
      return new BigNumber(val).gt(0);
    },
    moneyFormat(labelValue) {
      // Nine Zeroes for Billions
      return Math.abs(Number(labelValue)) >= 1.0e9
        ? new BigNumber(Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + ' B'
        : // Six Zeroes for Millions
        Math.abs(Number(labelValue)) >= 1.0e6
        ? new BigNumber(Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + ' M'
        : // Three Zeroes for Thousands
        Math.abs(Number(labelValue)) >= 1.0e3
        ? new BigNumber(Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + ' K'
        : new BigNumber(Math.abs(Number(labelValue))).toFixed(2);
    },
    toDecimal(val) {
      return new BigNumber(val).toFixed(2);
    },
    toDollar: Misc.toDollar,
    cancelRemove() {
      this.$refs.removeWalletModal.$refs.removeWalletModal.hide();
    },
    edit() {
      this.$refs.editModal.$refs.editModal.show();
    },
    async fetchTokenBalance(token) {
      const contractAbi = [
        {
          name: 'balanceOf',
          type: 'function',
          constant: true,
          inputs: [{ name: 'address', type: 'address' }],
          outputs: [{ name: 'out', type: 'uint256' }]
        }
      ];
      const contract = new this.web3.eth.Contract(contractAbi);
      const data = contract.methods.balanceOf(this.address).encodeABI();
      const balance = await this.web3.eth
        .call({
          to: token.address,
          data: data
        })
        .then(res => {
          let tokenBalance;
          if (Number(res) === 0 || res === '0x') {
            tokenBalance = 0;
          } else {
            const denominator = new BigNumber(10).pow(token.decimals);
            tokenBalance = new BigNumber(res).div(denominator).toString();
          }
          return tokenBalance;
        })
        .catch(e => {
          Toast.responseHandler(e, false);
        });

      return balance;
    },
    openRemoveWallet() {
      this.$refs.removeWalletModal.$refs.removeWalletModal.show();
    },
    async fetchTokens(res) {
      if (res && res.hasOwnProperty('favorites')) {
        const parsedRes = res.favorites.hasOwnProperty('newValue')
          ? JSON.parse(res.favorites.newValue)
          : JSON.parse(res.favorites);
        const foundVal = parsedRes.find(item => {
          return item.address === this.address;
        });

        if (foundVal) {
          this.favorited = !this.favorited;
        } else {
          this.favorited = false;
        }
      }
      this.loading = true;
      let tokens = [];
      const tb = new TokenBalance(this.web3.currentProvider);
      const newLogo = {
        // eslint-disable-next-line
        src: require(`@/assets/images/networks/eth-logo.svg`)
      };
      try {
        tokens = await tb.getBalance(this.address);
        tokens = tokens.map(token => {
          const balance = token.balance;
          delete token.balance;
          token.balance = new BigNumber(balance).gt(0)
            ? new BigNumber(balance)
                .div(new BigNumber(10).pow(token.decimals))
                .toFixed(3)
            : 0;
          token.address = token.addr;
          token['logo'] = newLogo;
          delete token.addr;
          return token;
        });
        this.loading = false;
        this.tokens = tokens.sort(sortByBalance);
      } catch (e) {
        tokens = this.network.type.tokens.map(token => {
          token.balance = 'Load';
          token['logo'] = newLogo;
          return token;
        });
        this.loading = false;
        this.tokens = tokens;
      }
    },
    copyAddress() {
      this.$refs.addressInput.select();
      document.execCommand('copy');
      Toast.responseHandler(this.$t('mewcx.copy-success'), Toast.SUCCESS);
    }
  }
};
</script>

<style lang="scss">
@import '~@/scss/GlobalVariables';

.show {
  .wallet-options-toggle {
    background: none !important;
  }
}

.wallet-options-toggle {
  border: none;
  background: none !important;
  padding: 0;
}

.wallet-options-menu {
  padding: 10px;
  min-width: 60px;

  .b-dropdown-text {
    text-align: center !important;
    color: $dark-blue-2 !important;
    font-weight: normal !important;
    cursor: pointer;
  }
  .remove-text {
    p {
      color: $red-5 !important;
    }
  }
}
</style>
<style lang="scss" scoped>
@import 'WalletInfoComponent.scss';
</style>
