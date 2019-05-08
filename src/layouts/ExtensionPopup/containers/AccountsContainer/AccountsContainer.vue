<template>
  <div class="popup-accounts-container">
    <b-tabs
      justified
      nav-class="accounts-container-b-tabs"
      active-tab-class="accounts-container-active-b-tab"
    >
      <b-tab :active="active" title="My Wallets" class="tab-container">
        <wallet-view-component
          v-for="item in myWallets"
          v-show="myWallets.length > 0"
          :address="item.address"
          :name="item.nick"
          :key="item.address"
        />
        <h3 v-show="myWallets === false">
          No wallets found 😢
        </h3>
      </b-tab>
      <b-tab :active="!active" title="Watch Only Wallets" class="tab-container">
        <wallet-view-component
          v-for="item in watchOnlyWallets"
          v-show="watchOnlyWallets.length > 0"
          :address="item.address"
          :name="item.nick"
          :key="item.address"
        />
        <h3 v-show="watchOnlyWallets === false">
          No wallets found 😢
        </h3>
      </b-tab>
    </b-tabs>
    <div class="popup-button-options">
      <div class="button-option" @click="addWallet">
        My Wallet
      </div>
      <div class="button-option" @click="() => {}">
        Quick Send
      </div>
    </div>
  </div>
</template>

<script>
import { WATCH_ONLY } from '@/wallets/bip44/walletTypes';
import WalletViewComponent from '../../components/WalletViewComponent';
export default {
  components: {
    'wallet-view-component': WalletViewComponent
  },
  props: {
    accounts: {
      type: Object,
      default: () => {
        return {};
      }
    },
    addWallet: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      active: false
    };
  },
  computed: {
    watchOnlyWallets() {
      return this.parseReceivedWallets(true);
    },
    myWallets() {
      return this.parseReceivedWallets(false);
    }
  },
  methods: {
    parseReceivedWallets(watchOnly) {
      const wallets = [];
      Object.keys(this.accounts).forEach(account => {
        const parsedValue = JSON.parse(this.accounts[account]);
        if (watchOnly) {
          if (this.accounts[account].type === WATCH_ONLY) {
            const reformObj = Object.assign({}, this.accounts[account], {
              address: account
            });
            wallets.push(reformObj);
          }
        } else {
          if (parsedValue.type !== WATCH_ONLY) {
            const reformObj = Object.assign({}, parsedValue, {
              address: account
            });
            wallets.push(reformObj);
          }
        }
      });
      return wallets.length > 0 ? wallets : false;
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
