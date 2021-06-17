<template>
  <div class="wallet-main">
    <the-wallet-side-menu />
    <the-wallet-header />
    <v-main>
      <v-container
        class="pa-2 pa-md-3 mb-14 align-center wallet-content-container"
        fluid
      >
        <module-confirmation />
        <router-view />
      </v-container>
    </v-main>
    <the-wallet-footer />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { toBN } from 'web3-utils';
import TheWalletSideMenu from './components-wallet/TheWalletSideMenu';
import TheWalletHeader from './components-wallet/TheWalletHeader';
import TheWalletFooter from './components-wallet/TheWalletFooter';
import ModuleConfirmation from '@/modules/confirmation/ModuleConfirmation';
import handlerWallet from '@/core/mixins/handlerWallet.mixin';
import ethImg from '@/assets/images/networks/eth.svg';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import BigNumber from 'bignumber.js';
import {
  getGasBasedOnType,
  gasPriceTypes
} from '@/core/helpers/gasPriceHelper.js';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
const TOKEN_BALANCE_API = 'https://tokenbalance.mewapi.io/';
export default {
  components: {
    TheWalletSideMenu,
    TheWalletHeader,
    TheWalletFooter,
    ModuleConfirmation
  },
  mixins: [handlerWallet],
  computed: {
    ...mapState('wallet', ['address', 'web3', 'tokens', 'coinGeckoTokens']),
    ...mapState('global', ['online', 'gasPriceType', 'baseGasPrice']),
    ...mapGetters('global', ['network']),
    isTokenBalanceApiSupported() {
      return (
        this.network.type.name === BSC.name ||
        this.network.type.name === ETH.name ||
        this.network.type.name === MATIC.name
      );
    }
  },
  watch: {
    web3() {
      this.web3.eth.clearSubscriptions();
      this.subscribeToBlockNumber();
      this.setGas();
      this.setTokensAndBalance();
    },
    coinGeckoTokens() {
      this.setTokenBalanceFromAPI();
    }
  },
  mounted() {
    if (this.online) {
      this.setTokensAndBalance();
      this.setGas();
      this.subscribeToBlockNumber();
    }
  },
  destroyed() {
    this.web3.eth.clearSubscriptions();
  },
  methods: {
    ...mapActions('wallet', [
      'setAccountBalance',
      'setBlockNumber',
      'setTokens',
      'setCoinGeckoTokens'
    ]),
    ...mapActions('global', ['setGasPrice']),
    ...mapActions('external', ['setETHUSDValue']),
    setTokensAndBalance() {
      this.web3.eth.getBalance(this.address).then(res => {
        this.setAccountBalance(toBN(res));
      });
      if (this.coinGeckoTokens.get) {
        this.setTokenBalanceFromAPI();
      } else {
        this.setTokens([]);
      }
    },
    getTokenInfoByAddress(address) {
      for (const t of this.network.type.tokens) {
        if (t.address.toLowerCase() === address.toLowerCase()) return t;
      }
      return null;
    },
    setTokenBalanceFromAPI() {
      if (!this.isTokenBalanceApiSupported) {
        this.setTokens([]);
        return;
      }
      fetch(
        `${TOKEN_BALANCE_API}/${this.network.type.name.toLowerCase()}?address=${
          this.address
        }`
      )
        .then(res => res.json())
        .then(res => res.result)
        .then(tokens => {
          const formattedList = [];
          tokens.forEach(t => {
            const token = this.getTokenInfoByAddress(t.contract);
            if (!token) return;
            const foundToken = this.coinGeckoTokens.get(
              t.contract.toLowerCase()
            );
            const denominator = new BigNumber(10).pow(token.decimals);
            const usdBalance = foundToken
              ? new BigNumber(t.balance)
                  .div(denominator)
                  .times(foundToken.current_price)
                  .toString()
              : null;
            const price = foundToken ? foundToken.current_price : null;
            formattedList.push({
              name: token.symbol,
              symbol: token.symbol,
              subtext: token.name,
              value: token.name,
              balance: t.balance,
              contract: token.address,
              img: token.icon ? token.icon : ethImg,
              decimals: token.decimals,
              market_cap: foundToken ? foundToken.market_cap : null,
              price_change_percentage_24h: foundToken
                ? foundToken.price_change_percentage_24h
                : null,
              totalBalanceRaw: usdBalance,
              totalBalance: formatFiatValue(usdBalance).value,
              priceRaw: price,
              price: formatFiatValue(price).value,
              tokenBalance: this._getTokenBalance(t.balance, token.decimals)
                .value
            });
          });
          this.setTokens(formattedList);
        });
    },
    setGas() {
      this.web3.eth.getGasPrice().then(res => {
        if (this.gasPriceType === gasPriceTypes.STORED) {
          this.setGasPrice(this.baseGasPrice);
        } else if (this.gasPriceType) {
          this.setGasPrice(getGasBasedOnType(res, this.gasPriceType));
        } else {
          this.setGasPrice(getGasBasedOnType(res, gasPriceTypes.ECONOMY));
        }
      });
    },
    subscribeToBlockNumber() {
      this.web3.eth.getBlockNumber().then(res => {
        this.setBlockNumber(res);
      });
      this.web3.eth.subscribe('newBlockHeaders').on('data', res => {
        this.setBlockNumber(res.number);
      });
    },
    /**
     * Get token balance
     */
    _getTokenBalance(balance, decimals) {
      let n = new BigNumber(balance);
      if (decimals) {
        n = n.div(new BigNumber(10).pow(decimals));
        n = formatFloatingPointValue(n);
      }
      return n;
    }
  }
};
</script>

<style lang="scss" scoped>
.box-shadow {
  box-shadow: 0 0 15px var(--v-boxShadow-base) !important;
}
.wallet-main {
  background-color: var(--v-walletBg-base);
  height: 100%;
}
</style>
