<template>
  <div class="connection-request">
    <div class="connection-request-container">
      <div class="website-logos">
        <img :src="request.favicon" class="site-logo" />
        <img src="~@/assets/images/icons/clip.svg" class="clip-logo" />
        <img class="site-logo" src="~@/assets/images/mew-cx-logo.png" />
      </div>
      <p>
        {{ request.connectionRequest.toLowerCase() }}
        {{ $t('mewcx.trying-to-access-mew') }}
      </p>
    </div>
    <div class="accounts-container">
      <div class="account-container">
        <address-selection-component
          v-for="(acc, idx) in accWithBal"
          :key="acc.address + idx"
          :address="acc.address"
          :nickname="acc.nickname"
          :balance="acc.balance"
          :selected-account="selectedAccount"
          :select-account="selectAccount"
          :currency="network.type.name"
        />
        <address-selection-component
          :selected-account="selectedAccount"
          :select-account="selectAccount"
          :wallet-type="'burner'"
          :address="null"
        />
      </div>
    </div>
    <p v-show="selectedAccount === 'burner'" class="warning">
      {{ $t('mewcx.burner-warning') }}
    </p>
    <accept-cancel-buttons
      :func-one="sendAccount"
      :func-two="rejectAction"
      :disabled="selectedAccount === ''"
      :text-one="
        selectedAccount === 'burner'
          ? 'mewcx.user-understand'
          : $t('mewcx.access')
      "
      :text-two="$t('mewcx.reject')"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { Misc, ExtensionHelpers, Wallet } from '@/helpers';
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
    ...mapState('main', ['linkQuery', 'web3', 'network']),
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
      const nonWatchOnly = Object.keys(acc).filter(item => {
        if (isAddress(item)) {
          const parsedAcc = JSON.parse(acc[item]);
          if (parsedAcc.type !== 'watchOnly') {
            return acc[item];
          }
        }
      });
      this.accounts = nonWatchOnly.map(item => {
        const parsed = JSON.parse(acc[item]);
        return {
          nickname: parsed.nick,
          address: item
        };
      });
      this.getBalance();
    },
    async getBalance() {
      for (let i = 0; i < this.accounts.length; i++) {
        if (isAddress(this.accounts[i].address)) {
          const balance = await this.web3.eth.getBalance(
            this.accounts[i].address
          );
          const balanceToWei = this.web3.utils.fromWei(balance);
          const pushableItem = Object.assign({}, this.accounts[i], {
            balance: new BigNumber(balanceToWei).toString()
          });
          this.accWithBal.push(pushableItem);
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
      const chrome = window.chrome;
      chrome.tabs.query(
        { url: `*://*.${_self.request.connectionRequest}/*` },
        function(tab) {
          const obj = {
            event: REJECT_MEW_CX_ACC
          };
          chrome.tabs.sendMessage(tab[0].id, obj);
          window.parent.close();
        }
      );
    },
    sendAccount() {
      const generatedAccount = new Wallet.generate();
      const account = isAddress(this.selectedAccount)
        ? this.selectedAccount
        : generatedAccount.getAddressString();
      const chrome = window.chrome;
      const eventObj = {};
      eventObj[`${this.request.connectionRequest.toLowerCase()}`] = account;
      chrome.tabs.query(
        { url: `*://*.${this.request.connectionRequest.toLowerCase()}/*` },
        function(tab) {
          const obj = {
            event: SELECTED_MEW_CX_ACC,
            payload: [account]
          };
          chrome.storage.sync.set(eventObj, function() {});
          chrome.tabs.sendMessage(tab[0].id, obj);
          window.parent.close();
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AccountAccessContainer.scss';
</style>
