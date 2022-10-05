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
            <img
              src="@/assets/images/icons/copy_white.png"
              @click.stop="copyAddress"
            />
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
            @click.stop="
              () => {
                openPasswordModal('view');
              }
            "
            >{{ $t('mewcx.view') }}</b-dropdown-text
          >
          <b-dropdown-text
            v-if="walletType !== 'watchOnly'"
            @click.stop="
              () => {
                backupWallet();
              }
            "
            >{{ $t('mewcx.backup') }}</b-dropdown-text
          >
          <b-dropdown-text @click="edit">{{
            $t('mewcx.rename')
          }}</b-dropdown-text>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-text class="remove-text" @click.stop="openRemoveWallet">{{
            $t('mewcx.remove')
          }}</b-dropdown-text>
        </b-dropdown>
        <i
          :class="[
            'fa fa-lg',
            !favorited ? 'fa-heart-o' : 'fa-heart heart-color'
          ]"
          @click.stop="
            () => {
              addToFavorites(address, nickname);
            }
          "
        />
      </div>
    </div>
    <div class="wallet-info-body">
      <div class="link-to-download">
        <a
          ref="downloadLink"
          :href="downloadFile"
          :download="toV3Name"
          rel="noopener noreferrer"
        ></a>
      </div>
      <div
        v-show="showBalanceReminder"
        v-if="balanceWarnHidden"
        class="low-eth-warning"
      >
        <div class="warning-container">
          <p class="actual-warning">
            <img src="@/assets/images/icons/exclamation.svg" />
            The ETH balance of your wallet is running low.
          </p>
          <img
            src="@/assets/images/icons/close.svg"
            @click.stop="balanceWarnHidden = !balanceWarnHidden"
          />
        </div>
        <div class="link-container">
          <a
            href="https://ccswap.myetherwallet.com/#/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t('mewcx.buy-eth') }}
          </a>
        </div>
      </div>
      <div class="main-wallet-content">
        <div class="main-wallet-content-container">
          <div class="wallet-value-with-img">
            <div class="wallet-img-container">
              <img
                v-if="page === ''"
                alt
                class="icon"
                src="~@/assets/images/icons/wallet-with-background.svg"
              />
              <img
                v-else-if="page !== '' && walletType !== 'watchOnly'"
                v-b-popover.hover.top="'My Wallet'"
                alt
                class="icon"
                src="~@/assets/images/icons/wallet_grey.svg"
              />
              <img
                v-else
                v-b-popover.hover.top="'Watch Only Wallet'"
                alt
                class="icon"
                src="~@/assets/images/icons/eye_grey.svg"
              />
            </div>
            <div class="wallet-value-container">
              <p class="title">{{ $t('mewcx.total-wallet-value') }}</p>
              <i
                v-if="fetchingTokens && fetchingBalance"
                class="fa fa-lg fa-spin fa-spinner"
              />
              <p v-else class="dollar-amt">
                {{ isEth ? walletBalance : fixedEthBalance }}
              </p>
            </div>
          </div>
          <div class="wallet-value-container">
            <p class="title">
              {{ network.type.currencyName }} {{ $t('mewcx.balance') }}
            </p>
            <i v-if="fetchingBalance" class="fa fa-lg fa-spin fa-spinner" />
            <div v-else>
              <p class="dollar-amt">
                {{ isEth ? convertedBalance : fixedEthBalance }}
              </p>
              <p v-if="isEth" class="value">
                {{ fixedEthBalance }}
              </p>
            </div>
          </div>
          <div class="wallet-value-container">
            <p class="title">
              {{ $t('mewcx.value-of-tokens', { plural: '' }) }}
            </p>
            <i v-if="fetchingTokens" class="fa fa-lg fa-spin fa-spinner" />
            <div v-else>
              <p class="dollar-amt">{{ convertedTokenTotal }}</p>
              <p class="value">
                {{ tokensWithDollarAmount.length }}
                {{ $t('mewcx.tokens') }}
              </p>
            </div>
          </div>
        </div>
        <div
          :class="[
            'view-all-container',
            tokensWithDollarAmount.length > 0 ? '' : 'disable-token-show'
          ]"
          @click.stop="showTokens = !showTokens"
        >
          <p>
            {{
              showTokens
                ? $t('mewcx.hide-all-tokens')
                : $t('mewcx.view-all-tokens')
            }}
          </p>
          <i :class="['fa', showTokens ? 'fa-angle-up' : 'fa-angle-down']" />
        </div>
      </div>
      <div v-show="showTokens" class="wallet-tokens">
        <table v-if="tokensWithDollarAmount.length > 0">
          <tr class="table-header">
            <th>
              {{ $t('mewcx.token.name') }}
            </th>
            <th>
              {{ $t('mewcx.token.price') }}
            </th>
            <th>
              {{ $t('mewcx.token.market-cap') }}
            </th>
            <th>
              {{ $t('mewcx.token.change') }}
            </th>
            <th>
              {{ $t('mewcx.token.amount') }}
            </th>
            <th>
              {{ $t('mewcx.token.value') }}
            </th>
          </tr>
          <tr
            v-for="(token, idx) in tokensWithDollarAmount"
            :key="token.symbol + `${idx}`"
            class="table-body"
          >
            <td>
              <div class="name-container">
                <figure v-lazy-load class="token-icon">
                  <img :data-url="token.tokenMew.logo" @error="iconFallback" />
                </figure>
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
                <img
                  :src="
                    isGreateThanZero(
                      token.tokenData.quotes.USD.percent_change_24h
                    )
                      ? require('@/assets/images/icons/arrow_up.svg')
                      : require('@/assets/images/icons/arrow_down.svg')
                  "
                />
              </p>
            </td>
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
          {{ $t('mewcx.cant-find-tokens') }}
        </div>
      </div>
    </div>
    <edit-wallet-modal
      ref="editModal"
      :address="address"
      :name="parsedWallet.nick"
      :wallet="parsedWallet"
    />
    <remove-wallet-modal
      ref="removeWalletModal"
      :wallet-type="parsedWallet.type"
      :address="address"
      :remove-wallet="removeWallet"
      :nickname="nickname"
      :loading="loading"
      @password="e => (password = e)"
    />
    <password-only-modal
      v-if="walletType !== 'watchOnly'"
      ref="passwordOnlyModal"
      :path="path"
      :valid-input="validInput"
      :submit="path === 'access' ? accessWallet : viewWallet"
      @password="e => (password = e)"
    />
    <verify-details-modal
      v-if="walletType !== 'watchOnly'"
      ref="verifyWalletModal"
      :usd="usd"
      :nickname="actualFileName"
      :tokens-with-dollar="tokensWithDollarAmount"
      :token-total="convertedTokenTotal"
      :wallet-balance="walletBalance"
      :file="file"
      :type="walletType"
    />
  </div>
</template>
<script>
import Blockie from '@/components/Blockie';
import BigNumber from 'bignumber.js';
import EditWalletModal from '../EditWalletModal';
import RemoveWalletModal from '../RemoveWalletModal';
import { mapState, mapActions } from 'vuex';
import { Toast, Misc, ExtensionHelpers } from '@/helpers';
import { toChecksumAddress } from '@/helpers/addressUtils';
import masterFile from '@/_generated/master-file.json';
import PasswordOnlyModal from '../PasswordOnlyModal';
import { KEYSTORE as keyStoreType } from '@/wallets/bip44/walletTypes';
import { WalletInterface } from '@/wallets';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import VerifyDetailsModal from '../VerifyDetailsModal';
import createBlob from '@/helpers/createBlob.js';
import web3utils from 'web3-utils';
import TokenBalance from '@myetherwallet/eth-token-balance';
import sortByBalance from '@/helpers/sortByBalance.js';
import { ETH } from '@/networks/types';
export default {
  components: {
    blockie: Blockie,
    'edit-wallet-modal': EditWalletModal,
    'remove-wallet-modal': RemoveWalletModal,
    'password-only-modal': PasswordOnlyModal,
    'verify-details-modal': VerifyDetailsModal
  },
  props: {
    address: {
      type: String,
      default: ''
    },
    keystore: {
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
      showTokens: false,
      favorited: false,
      balanceWarnHidden: true,
      path: 'access',
      password: '',
      downloadFile: '',
      tokens: [],
      toV3Name: '',
      balance: 0,
      fetchingTokens: false,
      fetchingBalance: false
    };
  },
  computed: {
    ...mapState('main', ['network', 'web3']),
    actualFileName() {
      return this.generateName(this.address);
    },
    showBalanceReminder() {
      if (this.isEth && this.walletType !== 'watchOnly') {
        return this.showLowBalance;
      }
      return false;
    },
    validInput() {
      return (
        (this.password !== '' || this.password.length > 0) &&
        this.walletRequirePass(JSON.parse(this.keystore).priv)
      );
    },
    file() {
      if (this.walletType !== 'watchOnly') {
        return JSON.parse(JSON.parse(this.keystore).priv);
      }
      return {};
    },
    showLowBalance() {
      const lessThan = new BigNumber(this.balance).lte(0.05);
      return lessThan;
    },
    parsedWallet() {
      return JSON.parse(this.keystore);
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
      const currencyBalance = new BigNumber(this.balance).toFixed(3);
      return `${currencyBalance} ${this.network.type.currencyName}`;
    },
    tokensWithDollarAmount() {
      const hasDollarAmount = this.tokens.filter(item => {
        if (this.prices[item.symbol]) {
          return item;
        }
      });

      const returnedTokens =
        hasDollarAmount.length > 0
          ? hasDollarAmount.map(item => {
              return {
                tokenMew: item,
                tokenData: this.prices[item.symbol]
              };
            })
          : [];
      return returnedTokens;
    },
    tokenTotal() {
      try {
        let totalTokenAmt = new BigNumber(0);
        this.tokens.forEach(token => {
          if (this.prices[token.symbol]) {
            totalTokenAmt = totalTokenAmt.plus(
              new BigNumber(this.prices[token.symbol].quotes.USD.price).times(
                token.balance
              )
            );
          }
        });
        return totalTokenAmt.toNumber();
      } catch (e) {
        return 0;
      }
    },
    convertedTokenTotal() {
      return this.toDollar(this.tokenTotal);
    },
    walletBalance() {
      try {
        const balance = new BigNumber(this.balance)
          .times(this.usd)
          .plus(this.tokenTotal)
          .toNumber();
        return this.toDollar(balance);
      } catch (e) {
        return this.toDollar(0);
      }
    },
    networkTokens() {
      const newTokenObj = {};
      const matchedNetwork = masterFile.filter(item => {
        return (
          item.network.toLowerCase() === this.network.type.name.toLowerCase()
        );
      });
      matchedNetwork.forEach(item => {
        newTokenObj[toChecksumAddress(item.contract_address)] = item;
      });

      return newTokenObj;
    },
    isEth() {
      return this.network.type.name === ETH.name;
    }
  },
  watch: {
    tokens: {
      handler: function (newValue) {
        this.tokens = newValue;
      },
      deep: true
    },
    balance(newVal) {
      this.$emit('balanceUpdate', newVal);
    },
    web3() {
      this.setToken();
      this.getBalance();
    }
  },
  created() {
    window.chrome.storage.onChanged.addListener(this.checkIfFavorited);
  },
  mounted() {
    window.chrome.storage.sync.get('favorites', this.checkIfFavorited);
    if (this.keystore !== '') {
      this.generateBlob();
    }
    try {
      this.setToken();
      this.getBalance();
    } catch (e) {
      Toast.responseHandler(this.$t('mewcx.something-went-wrong'), Toast.ERROR);
    }
  },
  destroyed() {
    window.chrome.storage.onChanged.removeListener(this.checkIfFavorited);
  },
  methods: {
    ...mapActions('main', ['decryptWallet']),
    iconFetch(address) {
      const token = this.networkTokens[toChecksumAddress(address)];
      if (token) {
        const tokenSrc =
          token.icon_png !== ''
            ? `https://img.mewapi.io/?image=${token.icon_png}&width=50&height=50&fit=scale-down`
            : token.icon !== ''
            ? `https://img.mewapi.io/?image=${token.icon}&width=50&height=50&fit=scale-down`
            : this.network.type.icon;
        return tokenSrc;
      }

      return this.network.type.icon;
    },
    setToken() {
      this.fetchingTokens = true;
      const tb = new TokenBalance(this.web3.currentProvider);
      tb.getBalance(this.address, true, true, true, {
        gas: '0x11e1a300'
      })
        .then(res => {
          const tokens = [];
          res.forEach(token => {
            const balance = token.balance;
            delete token.balance;
            token.balance = new BigNumber(balance).gt(0)
              ? new BigNumber(balance)
                  .div(new BigNumber(10).pow(token.decimals))
                  .toFixed(3)
              : 0;
            token.address = token.addr;
            token.logo = this.iconFetch(token.addr);
            delete token.addr;
            tokens.push(token);
          });
          const sorted = tokens.sort(sortByBalance).filter(item => {
            return new BigNumber(item.balance).gt(0);
          });
          this.tokens = sorted;
          this.fetchingTokens = false;
        })
        .catch(() => {
          this.tokens = [];
          this.fetchingTokens = false;
        });
    },
    getBalance() {
      this.fetchingBalance = true;
      this.web3.eth
        .getBalance(this.address)
        .then(res => {
          this.fetchingBalance = false;
          this.balance = web3utils.fromWei(res);
        })
        .catch(() => {
          this.balance = 0;
          this.fetchingBalance = 0;
        });
    },
    iconFallback(evt) {
      evt.target.src = this.network.type.icon;
    },
    walletRequirePass(ethjson) {
      if (!ethjson) return false;
      if (ethjson.encseed != null) return true;
      else if (ethjson.Crypto != null || ethjson.crypto != null) return true;
      else if (ethjson.hash != null && ethjson.locked) return true;
      else if (ethjson.hash != null && !ethjson.locked) return false;
      else if (ethjson.publisher == 'MyEtherWallet' && !ethjson.encrypted)
        return false;
      return true;
    },
    openPasswordModal(action) {
      this.path = action;
      this.$refs.passwordOnlyModal.$refs.passwordOnlyModal.$refs.modalWrapper.show();
    },
    removeWallet() {
      this.loading = true;
      if (this.walletType !== 'watchOnly') {
        const worker = new walletWorker();
        worker.postMessage({
          type: 'unlockWallet',
          data: [this.file, this.password]
        });

        worker.onmessage = () => {
          ExtensionHelpers.deleteWalletFromStore(this.address, () => {
            this.$refs.removeWalletModal.$refs.removeWalletModal.$refs.modalWrapper.hide();
            this.loading = false;
            Toast.responseHandler(
              this.$t('mewcx.remove-wallet-successfully'),
              Toast.SUCCESS
            );
          });
        };
        worker.onerror = e => {
          e.preventDefault();
          this.loading = false;
          Toast.responseHandler(e, Toast.ERROR);
        };
      } else {
        ExtensionHelpers.deleteWalletFromStore(this.address, () => {
          Toast.responseHandler(
            this.$t('mewcx.remove-wallet-successfully'),
            Toast.SUCCESS
          );
        });
      }
    },
    backupWallet() {
      this.$refs.downloadLink.click();
    },
    generateBlob() {
      const priv = JSON.parse(this.keystore).priv;
      const blob = createBlob(priv, 'mime');
      this.toV3Name = this.generateName(this.address);
      this.downloadFile = blob;
    },
    generateName(address) {
      const stamp = new Date();
      // from ethereumjs-wallet getV3Filename
      return [
        'UTC--',
        stamp.toJSON().replace(/:/g, '-'),
        '--',
        address.toString('hex')
      ].join('');
    },
    viewWallet() {
      this.loading = true;
      const nickname =
        this.nickname !== null && this.nickname.length > 0 ? this.nickname : '';
      const worker = new walletWorker();
      worker.postMessage({
        type: 'unlockWallet',
        data: [this.file, this.password]
      });
      worker.onmessage = e => {
        const obj = {
          file: this.file,
          name: e.data.filename
        };

        this.decryptWallet([
          new WalletInterface(
            Buffer.from(e.data._privKey),
            false,
            keyStoreType,
            nickname,
            JSON.stringify(obj)
          )
        ]).then(() => {
          this.loading = false;
          this.password = '';
          this.openViewWallet();
        });
      };
      worker.onerror = e => {
        e.preventDefault();
        this.loading = false;
        Toast.responseHandler(e, Toast.ERROR);
      };
    },
    accessWallet() {
      const _self = this;
      _self.loading = true;
      const nickname =
        _self.nickname !== null && _self.nickname.length > 0
          ? _self.nickname
          : '';
      const worker = new walletWorker();
      worker.postMessage({
        type: 'unlockWallet',
        data: [_self.file, _self.password]
      });
      worker.onmessage = e => {
        const obj = {
          file: _self.file,
          name: e.data.filename
        };

        _self
          .decryptWallet([
            new WalletInterface(
              Buffer.from(e.data._privKey),
              false,
              keyStoreType,
              nickname,
              JSON.stringify(obj)
            )
          ])
          .then(() => {
            _self.loading = false;
            _self.password = '';
            _self.$router.push({
              path: 'interface'
            });
          });
      };
      worker.onerror = e => {
        e.preventDefault();
        _self.loading = false;
        Toast.responseHandler(e, Toast.ERROR);
      };
    },
    openViewWallet() {
      this.$refs.verifyWalletModal.$refs.viewWalletModal.$refs.modalWrapper.show();
      this.$refs.passwordOnlyModal.$refs.passwordOnlyModal.$refs.modalWrapper.hide();
    },
    addToFavorites(address, nickname) {
      const dateAdded = new Date();
      const toAdd = {
        address,
        nickname,
        dateAdded
      };

      window.chrome.storage.sync.get('favorites', item => {
        if (Object.keys(item).length > 0) {
          const parsedItem = JSON.parse(item['favorites']);
          const alreadyStored = parsedItem.find(item => {
            return item.address === toAdd.address;
          });
          if (!alreadyStored) {
            parsedItem.push(toAdd);
          } else {
            const idx = parsedItem.findIndex(item => {
              return item.address === toAdd.address;
            });
            parsedItem.splice(idx, 1);
          }
          window.chrome.storage.sync.set(
            { favorites: JSON.stringify(parsedItem) },
            () => {}
          );
        }
      });
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
    edit() {
      this.$refs.editModal.$refs.editWalletModal.$refs.modalWrapper.show();
    },
    openRemoveWallet() {
      this.$refs.removeWalletModal.$refs.removeWalletModal.$refs.modalWrapper.show();
    },
    checkIfFavorited(res) {
      if (res && res.hasOwnProperty('favorites')) {
        const parsedRes = res.favorites.hasOwnProperty('newValue')
          ? JSON.parse(res.favorites.newValue)
          : res.favorites.hasOwnProperty('oldValue')
          ? JSON.parse(res.favorites.oldValue)
          : JSON.parse(res.favorites);
        const foundVal = parsedRes.find(item => {
          return item.address === this.address;
        });

        if (foundVal) {
          this.favorited = true;
        } else {
          this.favorited = false;
        }
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
