<template>
  <div class="popover-container">
    <div v-if="hasAccounts">
      <accounts-container
        :add-wallet="addWallet"
        :accounts="accounts"
        :usd="ethPrice"
      />
    </div>
    <div v-else>
      <welcome-container :add-wallet="addWallet" />
    </div>
  </div>
</template>

<script>
/* eslint no-console:0 */
import WelcomeContainer from './containers/WelcomeContainer';
import AccountsContainer from './containers/AccountsContainer';
import { ExtensionHelpers } from '@/helpers';
import { isAddress } from '@/helpers/addressUtils';
import BigNumber from 'bignumber.js';

export default {
  components: {
    'welcome-container': WelcomeContainer,
    'accounts-container': AccountsContainer
  },
  data() {
    return {
      hasAccounts: false,
      accounts: [],
      ethPrice: 0
    };
  },
  created() {
    window.chrome.storage.onChanged.addListener(() => {
      ExtensionHelpers.getAccounts(this.getAccountsCb);
    });
  },
  mounted() {
    ExtensionHelpers.getAccounts(this.getAccountsCb);
  },
  methods: {
    addWallet() {
      const chrome = window.chrome;
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        // eslint-disable-next-line
        window.open(chrome.runtime.getURL('index.html'));
      }
    },
    async fetchEthBalance() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          console.log(e);
        });

      this.convertedBalance = `$ ${new BigNumber(
        price.data.ETH.quotes.USD.price
      )
        .times(this.totalBalance)
        .toFixed(2)}`;

      this.ethPrice = price.data.ETH.quotes.USD.price;
    },
    getAccountsCb(res) {
      const accounts = Object.keys(res)
        .filter(item => {
          return isAddress(item);
        })
        .map(item => {
          const newObj = {};
          newObj[item] = res[item];
          return newObj;
        });
      this.hasAccounts = accounts.length > 0;
      this.accounts = this.hasAccounts ? accounts : {};
      this.fetchEthBalance();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionPopup.scss';
</style>
