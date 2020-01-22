<template>
  <div class="popup-accounts-container">
    <div v-show="!quickSend">
      <b-tabs
        justified
        nav-class="accounts-container-b-tabs"
        active-tab-class="accounts-container-active-b-tab"
      >
        <b-tab :active="hasMyWallets" title="My Wallets" class="tab-container">
          <network-component />
          <div class="total-balance-container">
            <p>{{ $t('common.balance.total') }}:</p>
            <div>
              <p>
                {{ concatBalance }} <b>{{ network.type.name }}</b>
              </p>
              <p v-if="network.type.name === 'ETH'" class="converted-balance">
                {{ convertedBalance }}
              </p>
            </div>
          </div>
          <div class="wallet-component-container">
            <wallet-view-component
              v-for="item in myWallets"
              v-show="myWallets.length > 0"
              :key="item.address"
              :address="item.address"
              :name="item.nick"
              :balance="item.balance"
              :usd="usd"
            />
            <div v-if="myWallets.length === 0" class="no-wallet-container">
              <h3>
                {{ $t('mewcx.no-wallets-found') }}
              </h3>
            </div>
          </div>
        </b-tab>
        <b-tab
          :active="!hasMyWallets"
          title="Watch-Only Wallets"
          class="tab-container"
        >
          <network-component />
          <div class="wallet-component-container">
            <wallet-view-component
              v-for="item in watchOnlyWallets"
              v-show="watchOnlyWallets.length > 0"
              :key="item.address"
              :address="item.address"
              :name="item.nick"
              :balance="item.balance"
              :usd="usd"
            />
            <div
              v-if="watchOnlyWallets.length === 0"
              class="no-wallet-container user-select--none"
            >
              <h3>
                {{ $t('mewcx.no-wallets-found') }}
              </h3>
            </div>
          </div>
        </b-tab>
      </b-tabs>
      <div class="popup-button-options">
        <div class="button-option" @click="addWallet">
          {{ $t('mewcx.my-wallet') }}
        </div>
        <div class="button-option" @click="moveToQuicksend">
          {{ $t('mewcx.quick-send') }}
        </div>
      </div>
    </div>
    <div v-show="quickSend">
      <quick-send-container
        :selected-wallet="selectedWallet"
        :cancel="cancel"
        :switch-wallet="moveToQuicksend"
        :usd="usd"
        :has-many-wallets="myWallets.length > 1"
      />
    </div>
    <b-modal
      ref="fromModal"
      hide-footer
      hide-header
      no-fade
      class="bootstrap-modal nopadding"
      modal-class="quick-send-from-modal"
    >
      <div class="quick-send-from-content">
        <div class="quick-send-from-header">
          <h3>{{ $t('mewcx.from') }}</h3>
          <i class="fa fa-times fa-lg" @click="closeFromModal" />
        </div>
        <div class="from-address-container">
          <div
            v-for="wallet in myWallets"
            ref="fromWallet"
            :key="wallet.nick + wallet.address"
            :class="[
              Object.keys(selectedWallet).length > 0 &&
              selectedWallet.address === wallet.address
                ? 'selected'
                : '',
              'wallet-from-view'
            ]"
            @click="selectWallet(wallet, $event)"
          >
            <div>
              <blockie :address="wallet.address" width="50px" height="50px" />
            </div>
            <div class="info-container">
              <p>
                <b>{{ wallet.nick }}</b>
              </p>
              <p>{{ wallet.address }}</p>
              <p>
                <b>
                  {{
                    wallet.balance.length > 11
                      ? `${wallet.balance.substr(0, 11)}...`
                      : wallet.balance
                  }}
                </b>
                {{ network.type.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { WATCH_ONLY } from '@/wallets/bip44/walletTypes';
import WalletViewComponent from '../../components/WalletViewComponent';
import NetworkCompoent from '../../components/NetworkComponent';
import QuickSendContainer from '../QuickSendContainer';
import BigNumber from 'bignumber.js';
import Blockie from '@/components/Blockie';
import { mapState } from 'vuex';
import { isAddress } from '@/helpers/addressUtils';

export default {
  components: {
    'wallet-view-component': WalletViewComponent,
    'quick-send-container': QuickSendContainer,
    blockie: Blockie,
    'network-component': NetworkCompoent
  },
  props: {
    accounts: {
      type: Array,
      default: () => {
        return [];
      }
    },
    addWallet: {
      type: Function,
      default: () => {}
    },
    usd: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      hasMyWallets: true,
      totalBalance: 0,
      loading: false,
      watchOnlyWallets: [],
      myWallets: [],
      quickSend: false,
      selectedWallet: {}
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network']),
    concatBalance() {
      const balance = new BigNumber(this.totalBalance).toFixed(5);
      return this.totalBalance > 0 ? balance : this.totalBalance;
    },
    convertedBalance() {
      const balance = new BigNumber(this.usd)
        .times(this.totalBalance)
        .toFixed(2);
      return `$ ${balance}`;
    }
  },
  watch: {
    accounts(newVal) {
      if (newVal !== undefined && newVal.length > 0)
        this.parseReceivedWallets();
    },
    network() {
      this.parseReceivedWallets();
    }
  },
  mounted() {
    if (this.accounts !== undefined && this.accounts.length > 0)
      this.parseReceivedWallets();
    this.$refs.fromModal.$on('hidden', () => {
      if (Object.keys(this.selectedWallet).length > 0) {
        this.quickSend = true;
      } else {
        this.quickSend = false;
      }
    });
  },
  methods: {
    async parseReceivedWallets() {
      this.loading = true;
      this.totalBalance = 0;
      const watchOnlyWallets = [];
      const myOwnWallets = [];
      let totalBalance = new BigNumber(this.totalBalance);
      for (const account of this.accounts) {
        const address = Object.keys(account)[0];
        const parsedValue = JSON.parse(account[address]);
        if (parsedValue.type === WATCH_ONLY) {
          const reformObj = Object.assign({}, parsedValue, {
            address: address,
            balance: await this.fetchBalance(address)
          });
          watchOnlyWallets.push(reformObj);
        } else if (parsedValue.type !== WATCH_ONLY) {
          const balance = await this.fetchBalance(address);
          totalBalance = totalBalance.plus(balance);
          const reformObj = Object.assign({}, parsedValue, {
            address: address,
            balance: balance
          });
          myOwnWallets.push(reformObj);
        }
      }

      if (myOwnWallets.length === 0 && watchOnlyWallets.length > 0) {
        this.hasMyWallets = false;
      } else {
        this.hasMyWallets = true;
      }
      this.loading = false;
      this.totalBalance = totalBalance;
      this.watchOnlyWallets = watchOnlyWallets;
      this.myWallets = myOwnWallets;
    },
    async fetchBalance(address) {
      if (address !== '0x' || isAddress(address)) {
        const balance = await this.web3.eth.getBalance(address);
        return this.web3.utils.fromWei(balance);
      }
    },
    moveToQuicksend() {
      if (this.myWallets.length === 0) {
        this.addWallet();
      } else {
        this.$refs.fromModal.show();
      }
    },
    closeFromModal() {
      this.$refs.fromModal.hide();
    },
    selectWallet(wallet) {
      this.selectedWallet = wallet;
      this.closeFromModal();
    },
    cancel() {
      this.quickSend = false;
      this.selectedWallet = {};
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AccountsContainer.scss';
</style>

<style lang="scss">
@import 'AccountsContainerBtabs.scss';
</style>
