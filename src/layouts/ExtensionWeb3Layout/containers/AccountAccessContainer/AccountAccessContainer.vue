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
        <div v-if="accWithBal.length === 0" class=""></div>
      </div>
    </div>
    <accept-cancel-buttons
      :func-one="sendAccount"
      :func-two="rejectAction"
      :disabled="selectedAccount === ''"
      text-one="Access"
      text-two="Reject"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { Misc, ExtensionHelpers } from '@/helpers';
import { isAddress } from '@/helpers/addressUtils';
import AddressSelectionComponent from '../../components/AddressSelectionComponent';
import AcceptCancelButtons from '../../components/AcceptCancelButtons';
import {
  REJECT_MEW_CX_ACC,
  SELECTED_MEW_CX_ACC
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
export default {
  components: {
    'address-selection-component': AddressSelectionComponent,
    'accept-cancel-buttons': AcceptCancelButtons
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
        if (isAddress(this.accounts[i])) {
          const balance = await this.web3.eth.getBalance(this.accounts[i]);
          const balanceToWei = this.web3.utils.fromWei(balance);
          this.accWithBal.push({
            balance: new BigNumber(balanceToWei).toString(),
            address: this.accounts[i]
          });
        }
      }
    },
    selectAccount(acc) {
      if (this.selectedAccount === acc) {
        this.selectedAccount = '';
      } else {
        this.selectedAccount = acc;
      }
    },
    rejectAction() {
      const _self = this;
      window.chrome.tabs.query(
        { url: `*://*.${_self.request.connectionRequest}/*` },
        function(tab) {
          const obj = {
            msg: REJECT_MEW_CX_ACC
          };
          window.chrome.tabs.sendMessage(tab[0].id, obj);
          window.close();
        }
      );
    },
    sendAccount() {
      const account = this.selectedAccount;
      const chrome = window.chrome;
      const eventObj = {};
      eventObj[`${this.request.connectionRequest.toLowerCase()}`] = account;
      chrome.tabs.query(
        { url: `*://*.${this.request.connectionRequest.toLowerCase()}/*` },
        function(tab) {
          const obj = {
            msg: SELECTED_MEW_CX_ACC,
            account: account
          };
          chrome.storage.sync.set(eventObj, function() {});
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
