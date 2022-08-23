<template>
  <div class="mew-component--moon-pay">
    <mew-popup
      :show="open"
      :has-buttons="false"
      :has-title="false"
      :has-padding="false"
      max-width="540"
      :left-btn="leftBtn"
      scrollable
      has-body-content
    >
      <div v-if="step === 0">
        <mew-tabs
          v-if="open"
          :items="tabItems"
          :active-tab="activeTab"
          active-color="greenPrimary"
          has-underline
          class="pt-3"
          @onTab="onTab"
        >
          <template #tabContent1>
            <buy-eth-component
              :order-handler="orderHandler"
              :close="close"
              :tab="activeTab"
              :default-currency="defaultCurrency"
              :in-wallet="inWallet"
              :supported-buy="supportedBuy"
              @selectedCurrency="setSelectedCurrency"
              @openProviders="openProviders"
              @selectedFiat="setSelectedFiat"
              @hideMoonpay="hideMoonpay"
              @simplexQuote="setSimplexQuote"
              @toAddress="setToAddress"
              @success="buySuccess"
            />
          </template>
          <template #tabContent2>
            <sell-eth-component
              :order-handler="orderHandler"
              :close="close"
              :tab="activeTab"
              :in-wallet="inWallet"
              :default-currency="defaultCurrency"
              @selectedCurrency="setSelectedCurrency"
            />
          </template>
        </mew-tabs>
      </div>
      <MoonPayBuyProviderComponent
        v-if="step === 1"
        :order-handler="orderHandler"
        :close="close"
        :in-wallet="inWallet"
        :only-simplex="onlySimplex"
        :selected-currency="selectedCurrency"
        :selected-fiat="selectedFiat"
        :buy-obj="buyObj"
        :simplex-quote="simplexQuote"
        :to-address="toAddress"
        @close="step = 0"
        @openProviders="openProviders"
        @reset="reset"
      />
    </mew-popup>
  </div>
</template>

<script>
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { mapGetters, mapState, mapActions } from 'vuex';
import BuyEthComponent from './components/MoonPayBuyComponent';
import SellEthComponent from './components/MoonPaySellComponent';
import handler from './handlers/handlerOrder';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { isEmpty } from 'lodash';
import nodes from '@/utils/networks';
import { SUCCESS, Toast } from '../toast/handler/handlerToast';
import MoonPayBuyProviderComponent from './components/MoonPayBuyProviderComponent.vue';

export default {
  name: 'MoonPay',
  components: {
    BuyEthComponent,
    SellEthComponent,
    MoonPayBuyProviderComponent
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
      activeTab: 0,
      orderHandler: {},
      selectedCurrency: {},
      selectedFiat: {},
      nodes: nodes,
      onlySimplex: false,
      buyObj: {},
      step: 0,
      simplexQuote: {},
      toAddress: ''
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'instance']),
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('global', ['network']),
    ...mapGetters('external', ['contractToToken']),
    inWallet() {
      return (
        this.$route.fullPath.includes('/wallet') && !this.$route.meta.noAuth
      );
    },
    defaultCurrency() {
      if (isEmpty(this.selectedCurrency) && this.supportedBuy) {
        if (this.inWallet) return this.tokensList[0];
        const token = this.contractToToken(MAIN_TOKEN_ADDRESS);
        token.value = token.symbol;
        return token;
      } else if (isEmpty(this.selectedCurrency) || !this.supportedBuy) {
        return {
          decimals: 18,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'ETH',
          symbol: 'ETH',
          network: 'ETH',
          contract: MAIN_TOKEN_ADDRESS
        };
      }
      return this.selectedCurrency;
    },
    supportedBuy() {
      return (
        this.network.type.name === 'ETH' ||
        this.network.type.name === 'BSC' ||
        this.network.type.name === 'MATIC'
      );
    },
    leftBtn() {
      return {
        method: this.close
      };
    },
    tabItems() {
      return [
        {
          name: `Buy`
        },
        {
          name: `Sell`
        }
      ];
    }
  },
  watch: {
    open(newVal) {
      this.isOpen = newVal;
      if (newVal) {
        this.orderHandler = new handler();
      }
      this.selectedCurrency = {};
      this.selectedCurrency = this.defaultCurrency;
    },
    address() {
      this.selectedCurrency = this.defaultCurrency;
    },
    network() {
      this.selectedCurrency = {};
      this.selectedCurrency = this.defaultCurrency;
      this.setTokens();
    }
  },
  methods: {
    ...mapActions('wallet', ['setWeb3Instance']),
    ...mapActions('global', ['setNetwork']),
    ...mapActions('external', ['setNetworkTokens']),
    onTab(val) {
      this.selectedCurrency = this.defaultCurrency;
      if (val === 1 || (val === 0 && (!this.supportedBuy || !this.inWallet))) {
        if (this.network.type.chainID !== 1) {
          const defaultNetwork = this.nodes['ETH'].find(item => {
            return item.service === 'myetherwallet.com-ws';
          });
          if (
            !this.instance ||
            (this.instance &&
              this.instance.identifier !== WALLET_TYPES.WEB3_WALLET)
          ) {
            this.setNetwork({ network: defaultNetwork }).then(() => {
              this.setWeb3Instance();
              this.activeTab = val;
              Toast(`Switched network to: ETH`, {}, SUCCESS);
            });
          }
        }
      } else {
        this.activeTab = val;
      }
    },
    setTokens() {
      if (!this.inWallet) {
        const tokenMap = new Map();
        this.network.type.tokens.forEach(token => {
          tokenMap.set(token.address.toLowerCase(), token);
        });
        this.setNetworkTokens(tokenMap);
      }
    },
    close() {
      this.activeTab = 0;
      this.step = 0;
      this.onlySimplex = false;
      this.$emit('close', false);
    },
    setSelectedCurrency(e) {
      this.selectedCurrency = e;
    },
    setSelectedFiat(e) {
      this.selectedFiat = e;
    },
    openProviders(val) {
      this.step = val;
    },
    setBuyObj(val) {
      this.buyObj = val;
    },
    setSimplexQuote(val) {
      this.simplexQuote = val;
    },
    setToAddress(val) {
      this.toAddress = val;
    },
    reset() {
      this.selectedCurrency = this.defaultCurrency;
      this.selectedFiat = {
        name: 'USD',
        value: 'USD',
        // eslint-disable-next-line
        img: require(`@/assets/images/currencies/USD.svg`)
      };
      this.onlySimplex = false;
    },
    hideMoonpay(val) {
      this.onlySimplex = val;
    },
    buySuccess(items) {
      this.setSimplexQuote(items[0]);
      this.setToAddress(items[1]);
      this.setBuyObj(items[2]);
      this.openProviders(items[3]);
      this.setSelectedCurrency(items[4]);
      this.setSelectedFiat(items[5]);
    }
  }
};
</script>

<style lang="scss" scoped></style>
