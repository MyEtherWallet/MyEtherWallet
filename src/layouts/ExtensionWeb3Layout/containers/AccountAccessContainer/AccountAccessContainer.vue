<template>
  <div class="connection-request">
    <div class="connection-request-container">
      <div class="website-logos">
        <img :src="request.favicon" class="site-logo" />
        <img src="~@/assets/images/icons/clip.svg" />
        <img class="site-logo" src="~@/assets/images/logo-small.png" />
      </div>
      <p>
        {{ request.connectionRequest }} is trying to access MEW CX. Please
        choose a wallet that you want to connect.
      </p>
    </div>
    <div class="addresses-container">
      <div class="address-container">
        <address-selection-component
          v-for="(acc, idx) in accWithBal"
          :key="acc.address + idx"
          :address="acc.address"
          :balance="acc.balance"
          :selected-account="selectedAccount"
          :select-account="selectAccount"
        />
      </div>
    </div>
    <button
      :class="[selectedAccount === '' ? 'disabled' : '', 'submit-button']"
      @click="sendAccount"
    >
      Access
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { Misc, ExtensionHelpers } from '@/helpers';
import AddressSelectionComponent from './components/AddressSelectionComponent';
export default {
  components: {
    'address-selection-component': AddressSelectionComponent
  },
  data() {
    return {
      selectedAccount: '',
      accounts: [],
      accWithBal: []
    };
  },
  computed: {
    ...mapState(['linkQuery', 'web3']),
    request() {
      const { connectionRequest, favicon } = this.linkQuery;
      const obj = {};
      obj['favicon'] = favicon;
      obj['connectionRequest'] = Misc.getService(connectionRequest);
      return obj;
    }
  },
  mounted() {
    ExtensionHelpers.getAccounts(this.getAccounts);
  },
  methods: {
    getAccounts(acc) {
      this.accounts = Object.keys(acc);
      this.getBalance();
    },
    async getBalance() {
      for (let i = 0; i < this.accounts.length; i++) {
        const balance = await this.web3.eth.getBalance(this.accounts[i]);
        const balanceToWei = this.web3.utils.fromWei(balance);
        this.accWithBal.push({
          balance: new BigNumber(balanceToWei).toString(),
          address: this.accounts[i]
        });
      }
    },
    selectAccount(acc) {
      if (this.selectedAccount === acc) {
        this.selectedAccount = '';
      } else {
        this.selectedAccount = acc;
      }
    },
    sendAccount() {
      const account = this.selectedAccount;
      const chrome = window.chrome;
      chrome.tabs.query(
        { url: `*://*.${this.request.connectionRequest}/*` },
        function(tab) {
          const obj = {
            msg: 'selectedMewCXAccount',
            account: account
          };
          chrome.storage.sync.set({ selectedAccount: account }, function() {});
          chrome.tabs.sendMessage(tab[0].id, obj);
          window.close();
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AccountAccessContainer.scss';
</style>
