<template>
  <div class="popup-accounts-container">
    <div v-show="!quickSend">
      <b-tabs
        justified
        nav-class="accounts-container-b-tabs"
        active-tab-class="accounts-container-active-b-tab"
      >
        <b-tab :active="hasMyWallets" title="My Wallets" class="tab-container">
          <div class="wallet-component-container">
            <div class="total-balance-container">
              <p>Total Balance:</p>
              <p>
                {{ concatBalance }} <b>{{ network.type.name }}</b>
              </p>
            </div>
            <wallet-view-component
              v-for="item in myWallets"
              v-show="myWallets.length > 0"
              :address="item.address"
              :name="item.nick"
              :key="item.address"
              :balance="item.balance"
            />
            <div v-if="myWallets.length === 0" class="no-wallet-container">
              <h3>
                No wallets found 😢
              </h3>
            </div>
          </div>
        </b-tab>
        <b-tab
          :active="!hasMyWallets"
          title="Watch-Only Wallets"
          class="tab-container"
        >
          <div class="wallet-component-container">
            <wallet-view-component
              v-for="item in watchOnlyWallets"
              v-show="watchOnlyWallets.length > 0"
              :address="item.address"
              :name="item.nick"
              :key="item.address"
              :balance="item.balance"
            />
            <div
              v-if="watchOnlyWallets.length === 0"
              class="no-wallet-container"
            >
              <h3>
                No wallets found 😢
              </h3>
            </div>
          </div>
        </b-tab>
      </b-tabs>
      <div class="popup-button-options">
        <div class="button-option" @click="addWallet">
          My Wallet
        </div>
        <div class="button-option" @click="moveToQuicksend">
          Quick Send
        </div>
      </div>
    </div>
    <div v-show="quickSend">
      <quick-send-container
        :selected-wallet="selectedWallet"
        :cancel="cancel"
        :switch-wallet="moveToQuicksend"
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
          <h3>From</h3>
          <i class="fa fa-times fa-lg" @click="closeFromModal" />
        </div>
        <div class="from-address-container">
          <div
            v-for="wallet in myWallets"
            ref="fromWallet"
            :key="wallet.nick + wallet.address"
            class="wallet-from-view"
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
import QuickSendContainer from '../QuickSendContainer';
import BigNumber from 'bignumber.js';
import Blockie from '@/components/Blockie';
import { toChecksumAddress } from '@/helpers/addressUtils';
import { mapState } from 'vuex';
import { isAddress } from '@/helpers/addressUtils';

export default {
  components: {
    'wallet-view-component': WalletViewComponent,
    'quick-send-container': QuickSendContainer,
    blockie: Blockie
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
    ...mapState(['web3', 'network']),
    concatBalance() {
      const stringifiedBal = `${this.totalBalance}`;
      return stringifiedBal.length > 11
        ? `${stringifiedBal.substr(0, 11)}...`
        : stringifiedBal;
    }
  },
  watch: {
    accounts(newVal) {
      if (newVal !== undefined && newVal.length > 0)
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
    selectWallet(wallet, e) {
      if (this.selectedWallet.hasOwnProperty('nick')) {
        if (
          toChecksumAddress(wallet.address) ===
          toChecksumAddress(this.selectedWallet.address)
        ) {
          e.target.classList.remove('selected');
          this.selectedWallet = {};
        } else {
          this.$refs.fromWallet.forEach(item => {
            item.classList.remove('selected');
          });
          this.selectedWallet = wallet;
          e.target.classList.add('selected');
        }
      } else {
        this.$refs.fromWallet.forEach(item => {
          item.classList.remove('selected');
        });
        this.selectedWallet = wallet;
        e.target.classList.add('selected');
      }

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
