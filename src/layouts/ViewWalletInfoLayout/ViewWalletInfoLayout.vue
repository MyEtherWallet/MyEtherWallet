<template>
  <div class="view-wallet-info-layout">
    <div class="title">
      <h2>View Wallet Info</h2>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempora totam
        asperiores beatae distinctio est id, nulla iusto dolore sunt earum
        molestiae consequatur laudantium aspernatur ratione labore nisi ab iure
        pariatur.
      </p>
    </div>
    <div class="wallet-info-container">
      <div class="wallet-info">
        <div class="wallet-info-header">
          <h3>Wallet Information</h3>
          <router-link to="/interface">Access Wallet</router-link>
        </div>
        <div class="balance-container">
          <div class="balance-main-container">
            <h4>Balance</h4>
            <div class="balance-and-buttons">
              <p>
                <b>{{ account.balance }}</b> ETH
              </p>
              <div class="balance-button-container">
                <i class="fa fa-refresh fa-lg" />
                <img src="~@/assets/images/icons/more-black.svg" />
              </div>
            </div>
          </div>
        </div>
        <div class="account-details">
          <div class="blockie-container">
            <blockie :address="account.address" width="80px" height="80px" />
            <h3>{{ account.nickname }}'s wallet</h3>
            <div class="address-copy-container">
              <input ref="copyAddress" :value="account.address" />
              <p>{{ account.address | concatAddr }}</p>
              <img src="@/assets/images/icons/copy-colored.svg" @click="copy" />
            </div>
          </div>
          <div class="other-options">
            <div
              v-for="option in otherOptions"
              :key="option.key"
              class="option-item"
              @click="option.func"
            >
              <img :src="option.icon" />
              <p>{{ option.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="wallet-tokens">
        <interface-tokens
          :tokens="tokens"
          :get-token-balance="getTokenBalance"
          :received-tokens="!loading"
          :reset-token-selection="setTokensWithBalance"
          :fetch-tokens="fetchTokens"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import store from 'store';
import TokenBalance from '@myetherwallet/eth-token-balance';
import InterfaceTokens from '@/layouts/InterfaceLayout/components/InterfaceTokens';
import { BigNumber } from 'bignumber.js';
import sortByBalance from '@/helpers/sortByBalance.js';
import Blockie from '@/components/Blockie';
import more from '@/assets/images/icons/more-black.svg';

import Web3 from 'web3';
const web3 = new Web3('https://api.myetherwallet.com/eth');

export default {
  components: {
    'interface-tokens': InterfaceTokens,
    blockie: Blockie
  },
  data() {
    return {
      tokens: [],
      loading: false,
      otherOptions: [
        {
          name: 'Private Key',
          key: 'privKey',
          icon: more,
          func: () => {}
        },
        {
          name: 'Txn History',
          key: 'txnHis',
          icon: more,
          func: this.openTxHistory
        },
        {
          name: 'Keystore File',
          key: 'keyStor',
          icon: more,
          func: () => {}
        },
        {
          name: 'Print Wallet',
          key: 'printWal',
          icon: more,
          func: () => {}
        }
      ]
    };
  },
  computed: {
    ...mapState(['account', 'network'])
  },
  mounted() {
    this.fetchTokens();
  },
  methods: {
    openTxHistory() {
      window.open(
        `${this.network.type.blockExplorerAddr.replace('[[address]]', '') +
          this.account.address}`,
        '_blank'
      );
    },
    copy() {
      this.$refs.copyAddress.select();
      document.execCommand('copy');
      Toast.responseHandler('Copied!', Toast.INFO);
    },
    async getTokenBalance(token) {
      try {
        const contractAbi = [
          {
            name: 'balanceOf',
            type: 'function',
            constant: true,
            inputs: [{ name: 'address', type: 'address' }],
            outputs: [{ name: 'out', type: 'uint256' }]
          }
        ];
        const contract = new web3.eth.Contract(contractAbi);
        const data = contract.methods
          .balanceOf(this.account.address)
          .encodeABI();
        const balance = await web3.eth
          .call({
            to: token.address,
            data: data
          })
          .then(res => {
            let tokenBalance;
            if (Number(res) === 0 || res === '0x') {
              tokenBalance = 0;
            } else {
              const denominator = new BigNumber(10).pow(token.decimals);
              tokenBalance = new BigNumber(res).div(denominator).toString();
            }
            return tokenBalance;
          })
          .catch(e => {
            Toast.responseHandler(e, false);
          });
        return balance;
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    async fetchTokens() {
      this.loading = true;
      const tb = new TokenBalance(web3.currentProvider);
      try {
        this.tokens = await tb.getBalance(this.account.address);
        this.tokens = this.tokens.map(token => {
          token.address = token.addr;
          delete token.addr;
          return token;
        });
        this.tokens = this.tokens.sort(sortByBalance);
        this.loading = false;
      } catch (e) {
        this.tokens = this.network.type.tokens.map(token => {
          token.balance = 'Load';
          return token;
        });
        this.tokens = this.tokens.sort(sortByBalance);
        this.loading = false;
      }
    },
    setTokensWithBalance() {
      const customStore = store.get('customTokens');
      if (
        customStore !== undefined &&
        customStore[this.network.type.name] !== undefined &&
        customStore[this.network.type.name].length > 0
      ) {
        new Promise(resolve => {
          const newArr = customStore[this.network.type.name].map(
            async token => {
              token.balance = await this.getTokenBalance(token);
              return token;
            }
          );
          Promise.all(newArr).then(res => {
            customStore[this.network.type.name] = res;
            store.set('customTokens', customStore);
            resolve(res);
          });
        })
          .then(res => {
            const allTokens = this.tokens
              .filter(token => token.balance > 0)
              .concat(res.filter(token => token.balance > 0));
            this.tokensWithBalance = allTokens;
            this.loading = true;
          })
          .catch(e => {
            Toast.responseHandler(e, Toast.ERROR);
          });
      } else {
        this.loading = true;
        this.tokensWithBalance = this.tokens.filter(token => token.balance > 0);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ViewWalletInfoLayout.scss';
</style>
