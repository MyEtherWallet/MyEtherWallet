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
          <div class="deprecation-notice">
            MEW CX is no longer being maintained by the MEW team.
            <br />
            <a
              href="https://help.myetherwallet.com/en/articles/6434663-migrating-from-mew-cx-to-enkrypt"
              target="_blank"
            >
              Migrate wallet to new extension</a
            >
          </div>
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
          <div class="deprecation-notice">
            MEW CX will no longer be supported on
            <b>October 4th, 2022</b>
          </div>
          <div class="wallet-component-container watch-only">
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
        <div class="button-option" @click="moveToQuicksend">Migrate</div>
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
      allWallets: [],
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
    },
    myWallets() {
      return this.allWallets.filter(item => {
        return item.type !== WATCH_ONLY;
      });
    },
    watchOnlyWallets() {
      return this.allWallets.filter(item => {
        return item.type === WATCH_ONLY;
      });
    },
    hasWallets() {
      return this.myOwnWallets.length > 0 || this.watchOnlyWallets.length > 0;
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
    parseReceivedWallets() {
      this.loading = true;
      this.totalBalance = 0;
      const allWallets = [];
      for (const account of this.accounts) {
        const address = Object.keys(account)[0];
        const parsedValue = JSON.parse(account[address]);
        Promise.all([this.fetchBalance(address)]).then(res => {
          if (parsedValue.type !== WATCH_ONLY) {
            this.totalBalance += res[0];
          }
          const reformObj = Object.assign({}, parsedValue, {
            address: address,
            balance: res[0],
            type: parsedValue.type
          });
          allWallets.push(reformObj);
        });
      }
      this.loading = false;
      this.allWallets = allWallets;
    },
    async fetchBalance(address) {
      if (address !== '0x' || isAddress(address)) {
        try {
          const balance = await this.web3.eth.getBalance(address);
          return this.web3.utils.fromWei(balance);
        } catch (e) {
          return '0';
        }
      }
    },
    moveToQuicksend() {
      // if (this.myWallets.length === 0) {
      //   this.addWallet();
      // } else {
      //   this.$refs.fromModal.show();
      // }

      window.open(
        'https://help.myetherwallet.com/en/articles/6434663-migrating-from-mew-cx-to-enkrypt',
        '_blank'
      );
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
.deprecation-notice {
  background-color: #fff6e6;
  padding: 10px;
  text-align: center;
  margin: 0 20px 15px 0;
  border-radius: 5px;
}

@import 'AccountsContainerBtabs.scss';
</style>
