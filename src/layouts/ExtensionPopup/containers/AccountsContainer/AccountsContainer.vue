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
          :name="item.name"
          :key="item.address"
        />
      </b-tab>
      <b-tab :active="!active" title="Watch Only Wallets" class="tab-container">
        <wallet-view-component
          v-for="item in watchOnly"
          v-show="watchOnly.length > 0"
          :address="item.address"
          :name="item.name"
          :key="item.address"
        />
      </b-tab>
    </b-tabs>
    <div class="popup-button-options">
      <div class="button-option">
        My Wallet
      </div>
      <div class="button-option">
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
    }
  },
  data() {
    return {
      active: false
    };
  },
  computed: {
    watchOnly() {
      const wallets = [];
      Object.keys(this.accounts).forEach(account => {
        if (this.accounts[account].type === WATCH_ONLY) {
          const reformObj = Object.assign({}, this.accounts[account], {
            address: account
          });
          wallets.push(reformObj);
        }
      });

      return wallets.length > 0 ? wallets : false;
    },
    myWallets() {
      const wallets = [];
      Object.keys(this.accounts).forEach(account => {
        if (this.accounts[account].type !== WATCH_ONLY) {
          const reformObj = Object.assign({}, this.accounts[account], {
            address: account
          });
          wallets.push(reformObj);
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
