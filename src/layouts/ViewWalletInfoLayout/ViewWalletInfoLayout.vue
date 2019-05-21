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
      </div>
      <div class="wallet-tokens">
        <interface-tokens
          :tokens="tokens"
          :get-token-balance="getTokenBalance"
          :received-tokens="loading"
          :reset-token-selection="setTokensWithBalance"
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
export default {
  components: {
    'interface-tokens': InterfaceTokens
  },
  data() {
    return {
      tokens: [],
      loading: false
    };
  },
  computed: {
    ...mapState(['acccount'])
  },
  methods: {
    async getTokenBalance(token) {
      try {
        const web3 = this.web3;
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
      this.receivedTokens = false;
      let tokens = [];
      if (this.network.type.chainID === 1 || this.network.type.chainID === 3) {
        const tb = new TokenBalance(this.web3.currentProvider);
        try {
          tokens = await tb.getBalance(this.account.address);
          tokens = tokens.map(token => {
            token.address = token.addr;
            delete token.addr;
            return token;
          });
        } catch (e) {
          tokens = this.network.type.tokens.map(token => {
            token.balance = 'Load';
            return token;
          });
        }
      } else {
        tokens = this.network.type.tokens.map(token => {
          token.balance = 'Load';
          return token;
        });
      }
      return tokens;
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
            this.receivedTokens = true;
          })
          .catch(e => {
            Toast.responseHandler(e, Toast.ERROR);
          });
      } else {
        this.receivedTokens = true;
        this.tokensWithBalance = this.tokens.filter(token => token.balance > 0);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ViewWalletInfoLayout.scss';
</style>
