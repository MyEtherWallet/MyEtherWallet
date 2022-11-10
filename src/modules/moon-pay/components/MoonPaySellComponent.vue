<template>
  <div class="pt-10 px-8">
    <!-- ============================================================== -->
    <!-- Selling amount -->
    <!-- ============================================================== -->
    <div class="mt-2">
      <div class="d-flex align-center justify-space-between mb-2">
        <div class="font-weight-medium textDark--text">
          How much do you want to sell?
        </div>
        <div v-if="inWallet" class="primary--text font-weight-medium">
          Balance: {{ walletChainBalance }}
        </div>
      </div>
      <div class="d-flex align-start">
        <mew-input
          :value="amount"
          hide-clear-btn
          class="no-right-border"
          type="number"
          :error-messages="errorMessages"
          @keydown.native="preventCharE($event)"
        />
        <div
          class="d-flex align-center token-select-button"
          @click="openTokenSelect = true"
        >
          <mew-token-container :img="selectedCurrency.img" size="28px" />
          <div class="basic--text" style="margin-left: 8px">
            {{ selectedCurrency.name }}
          </div>
          <v-icon class="ml-auto" size="20px" color="titlePrimary">
            mdi-chevron-down
          </v-icon>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <div class="font-weight-medium textDark--text mb-2">You will get</div>
      <div class="d-flex align-start">
        <mew-input
          :value="cryptoToFiat"
          hide-clear-btn
          class="no-right-border"
          type="number"
          :error-messages="currencyErrorMessages"
          @keydown.native="preventCharE($event)"
        />
        <mew-select
          v-model="selectedFiat"
          :items="fiatCurrencyItems"
          is-custom
          class="selectedFiat no-left-border mb-5"
        />
      </div>
    </div>

    <!-- =================================================================================================== -->
    <!-- =================================================================================================== -->
    <!-- =================================================================================================== -->
    <div v-show="false">
      <mew-select
        ref="selectedCurrency"
        label="Currency"
        :items="currencyItems"
        :value="selectedCurrency"
        :disabled="loading"
        is-custom
      />

      <!-- ============================================================== -->
      <!-- Amount -->
      <!-- ============================================================== -->
      <div v-if="inWallet" class="position--relative mt-9">
        <button-balance :balance="selectedBalance" :loading="fetchingBalance" />
        <mew-input
          :value="amount"
          type="number"
          label="Amount"
          placeholder="Enter amount to sell"
          :max-btn-obj="maxButton"
          :disabled="loading"
          :error-messages="errorMessages"
          :persistent-hint="hasPersistentHint"
          :hint="persistentHintMessage"
          @keydown.native="preventCharE($event)"
        />
      </div>
      <div v-else class="position--relative mt-9">
        <mew-input
          :value="amount"
          type="number"
          label="Amount"
          placeholder="Enter amount to sell"
          :disabled="loading"
          :error-messages="errorMessages"
          :persistent-hint="hasPersistentHint"
          :hint="persistentHintMessage"
          @keydown.native="preventCharE($event)"
        />
      </div>
      <div class="pt-8 pb-13">
        <div
          v-if="inWallet"
          class="d-flex align-center justify-space-between mb-2"
        >
          <div class="mew-body textDark--text font-weight-bold">
            Estimating Network Fee
          </div>
          <div v-if="!estimatingFees" class="mew-body textDark--text">
            ~{{ txFeeInEth }}
          </div>
          <v-skeleton-loader v-else type="text" width="150px" />
        </div>
      </div>
    </div>
    <!-- =================================================================================================== -->
    <!-- =================================================================================================== -->
    <!-- =================================================================================================== -->

    <!-- ============================================================== -->
    <!-- Refund address -->
    <!-- ============================================================== -->
    <div v-if="!inWallet" class="mt-0">
      <div class="font-weight-medium textDark--text mb-2">
        What wallet are you sending your crypto from?
      </div>
      <module-address-book
        ref="addressInput"
        label="Enter Crypto Address"
        :enable-save-address="false"
        :is-home-page="true"
        @setAddress="setAddress"
      />
    </div>

    <div class="mew-body textMedium--text">
      After submitting your sell order, you will have to send your crypto to
      Moonpay. Make sure to have enough currency in your wallet to cover network
      transaction fees.
    </div>

    <div
      class="textMedium--text mt-3 mb-6 d-flex align-center justify-space-between"
    >
      <div>Network Fee</div>
      <div>{{ networkFeeText }}</div>
    </div>
    <!-- ============================================================== -->
    <!-- Sell button -->
    <!-- ============================================================== -->
    <mew-button
      class="mb-6"
      title="SELL WITH MOONPAY"
      btn-size="xlarge"
      has-full-width
      :disabled="disableSell"
      :is-valid-address-func="isValidToAddress"
      @click.native="sell"
    />

    <!-- ============================================================== -->
    <!-- Token select popup -->
    <!-- ============================================================== -->
    <moonpay-token-select
      :open="openTokenSelect"
      :currency-items="currencyItems"
      :selected-currency="selectedCurrency"
      :set-currency="setCurrency"
      :fetched-networks="fetchedNetworks"
      @newNetwork="setNewNetwork"
      @close="openTokenSelect = false"
    />
  </div>
</template>

<script>
import MultiCoinValidator from 'multicoin-address-validator';
import { mapActions, mapGetters, mapState } from 'vuex';
import { isEmpty, debounce, isNumber, isEqual, cloneDeep } from 'lodash';
import BigNumber from 'bignumber.js';
import { fromWei } from 'web3-utils';
import Web3 from 'web3';

import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { ERROR, Toast, SUCCESS } from '@/modules/toast/handler/handlerToast';
import handlerSend from '@/modules/send/handlers/handlerSend.js';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common.js';
import abi from '@/modules/balance/handlers/abiERC20.js';
import * as nodes from '@/utils/networks/nodes';
import nodeList from '@/utils/networks';
import {
  toBNSafe,
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import { toBase } from '@/core/helpers/unit';
import { sellContracts } from './tokenList';
import { getCurrency } from '@/modules/settings/components/currencyList';
import handlerWallet from '@/core/mixins/handlerWallet.mixin';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook.vue';
import MoonpayTokenSelect from '@/modules/moon-pay/components/MoonPayTokenSelect.vue';

export default {
  name: 'ModuleSellEth',
  components: {
    ButtonBalance: () => import('@/core/components/AppButtonBalance'),
    ModuleAddressBook,
    MoonpayTokenSelect
  },
  mixins: [handlerWallet],
  props: {
    orderHandler: {
      type: Object,
      default: () => {}
    },
    close: {
      type: Function,
      default: () => {}
    },
    inWallet: {
      type: Boolean,
      default: false
    },
    defaultCurrency: {
      type: Object,
      default: () => {}
    },
    supportedSell: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedCurrency: this.defaultCurrency,
      loading: true,
      nodes: nodes,
      selectedFiat: {
        name: 'USD',
        value: 'USD',
        // eslint-disable-next-line
        img: require(`@/assets/images/currencies/USD.svg`)
      },
      amount: '0',
      fetchedData: {},
      locGasPrice: '0',
      sendHandler: {},
      web3Connections: {},
      fetchedNetworks: {},
      hasPersistentHint: false,
      fetchingBalance: true,
      gasLimit: 21000,
      estimatingFees: true,
      maxBalance: '0',
      selectedBalance: '0',
      toAddress: '',
      disableCurrencySelect: true,
      validToAddress: false,
      openTokenSelect: false
    };
  },
  computed: {
    ...mapGetters('global', [
      'network',
      'getFiatValue',
      'Networks',
      'gasPriceByType'
    ]),
    ...mapState('wallet', [
      'web3',
      'address',
      'identifier',
      'instance',
      'isOfflineApp',
      'setWeb3Instance'
    ]),
    ...mapState('external', ['currencyRate', 'coinGeckoTokens']),
    ...mapState('global', ['validNetwork']),
    ...mapGetters('external', ['contractToToken']),
    ...mapGetters('wallet', ['tokensList', 'balanceInETH']),
    cryptoToFiat() {
      return this.moonpayCryptoAmount;
    },
    moonpayCryptoAmount() {
      return formatFloatingPointValue(
        BigNumber(this.plusFee).div(this.priceOb?.price).toString()
      ).value;
    },
    walletChainBalance() {
      return `${formatFloatingPointValue(this.balanceInETH).value}`;
    },
    // networkFee() {
    //   return fromWei(BigNumber(this.gasPrice).times(21000).toString());
    // },
    priceOb() {
      return !isEmpty(this.fetchedData)
        ? this.fetchedData.prices?.find(
            item => item.fiat_currency === this.selectedFiatName
          )
        : { crypto_currency: 'ETH', fiat_currency: 'USD', price: '3379.08322' };
    },
    networkFeeToFiat() {
      return BigNumber(this.networkFee).times(this.priceOb?.price).toString();
    },
    networkFeeText() {
      return `${this.selectedCurrency.symbol} ~${
        formatFiatValue(this.networkFeeToFiat, this.currencyConfig).value
      }`;
    },
    currencyConfig() {
      const fiat = this.selectedFiat.value;
      const rate = this.currencyRate[fiat];
      const currency = fiat;
      return { rate, currency };
    },
    // fiatMultiplier() {
    //   if (this.hasData) {
    //     const selectedCurrencyPrice = this.fetchedData[0].conversion_rates.find(
    //       item => item.fiat_currency === this.selectedFiatName
    //     );
    //     return selectedCurrencyPrice
    //       ? BigNumber(selectedCurrencyPrice.exchange_rate)
    //       : toBN(1);
    //   }
    //   return toBN(1);
    // },
    selectedFiatName() {
      return this.selectedFiat.name;
    },
    minFee() {
      return BigNumber(4.43).times(this.fiatMultiplier).toString();
    },
    plusFee() {
      const fee = this.isEUR
        ? BigNumber(BigNumber(0.7).div(100)).times(this.amount)
        : BigNumber(BigNumber(3.25).div(100)).times(this.amount);
      const withFee = fee.gt(this.minFee)
        ? BigNumber(this.amount).minus(fee)
        : BigNumber(this.amount).minus(fee).minus(this.minFee);
      return withFee.minus(this.networkFeeToFiat).toString();
    },
    isEUR() {
      return this.selectedFiatName === 'EUR' || this.selectedFiatName === 'GBP';
    },
    fiatCurrencyItems() {
      const arrItems = this.hasData
        ? this.fetchedData[0].fiat_currencies.filter(item => item !== 'RUB')
        : ['USD'];
      return getCurrency(arrItems);
    },
    persistentHintMessage() {
      return this.hasPersistentHint
        ? `Max adjusted to leave sufficient ${this.selectedCurrency.symbol} for network fee`
        : '';
    },
    maxButton() {
      return BigNumber(this.selectedBalance).gt(0)
        ? {
            title: 'Max',
            method: this.setMax,
            disabled:
              this.nonMainnetMetamask ||
              BigNumber(this.txFee).gte(this.selectedBalance)
          }
        : {};
    },
    tokens() {
      if (this.inWallet) {
        return sellContracts.reduce((arr, item) => {
          const inList = this.tokensList.find(t => {
            if (t.contract.toLowerCase() === item.toLowerCase()) return t;
          });
          if (inList) {
            arr.push(inList);
            return arr;
          }
          const token = this.contractToToken(item);
          if (token) arr.push(token);
          return arr;
        }, []);
      }
      const arr = new Array();
      for (const contract of sellContracts) {
        const token = this.contractToToken(contract);
        if (token) arr.push(token);
      }
      return arr;
    },
    currencyItems() {
      if (!this.supportedSell) return;
      const tokensListWPrice =
        this.currencyRates?.length > 0
          ? this.tokens.map(token => {
              const priceRate = this.currencyRates?.find(rate => {
                return rate.crypto_currency === token.symbol;
              });
              const actualPrice = priceRate?.quotes.find(quote => {
                return quote.fiat_currency === this.selectedFiatName;
              });
              token.price = formatFiatValue(
                actualPrice ? actualPrice.price : '0',
                this.currencyConfig
              ).value;
              token.value = token.name;
              token.name = token.symbol;
              return token;
            })
          : this.tokens;
      const returnedArray = [
        {
          text: 'Select Token',
          divider: true,
          selectLabel: true
        },
        ...tokensListWPrice
      ];
      return returnedArray;
    },
    name() {
      return this.selectedCurrency.symbol !== 'ETH' &&
        this.selectedCurrency.symbol !== 'USDC' &&
        this.selectedCurrency.symbol !== 'USDT'
        ? 'ETH'
        : this.selectedCurrency.symbol;
    },
    disableSell() {
      return (
        !this.amount ||
        this.amount === '' ||
        BigNumber(this.amount).eq(0) ||
        this.loading ||
        this.errorMessages !== '' ||
        !this.actualValidAddress ||
        !this.supportedSell
      );
    },
    min() {
      if (!isEmpty(this.fetchedData)) {
        const found = this.fetchedData.limits.find(item => {
          return item.crypto_currency === this.name && item.type === 'WEB';
        });

        if (found) {
          return BigNumber(found.limit.min);
        }
      }
      return BigNumber(0.015);
    },
    max() {
      if (!isEmpty(this.fetchedData)) {
        const found = this.fetchedData.limits.find(item => {
          return item.crypto_currency === this.name && item.type === 'WEB';
        });

        if (found) {
          return BigNumber(found.limit.max);
        }
      }
      return BigNumber(3);
    },
    txFee() {
      return fromWei(
        BigNumber(this.locGasPrice).times(this.gasLimit).toString()
      );
    },
    txFeeInEth() {
      return `${BigNumber(this.txFee).decimalPlaces(4)} ETH`;
    },
    currencyErrorMessages() {
      if (
        (!this.supportedSell && !this.inWallet) ||
        (!this.supportedSell && this.inWallet)
      ) {
        return 'Please switch network back to the Ethereum Mainnet.';
      }
      return '';
    },
    // amountErrorMessages() {
    //   if (BigNumber(this.amount).isNaN() || BigNumber(this.amount).eq(0)) {
    //     return 'Amount required';
    //   }
    //   if (BigNumber(this.amount).lt(0)) {
    //     return `Amount can't be negative`;
    //   }
    //   if (this.min.gt(this.amount)) {
    //     return `Amount can't be below provider's minimum: ${
    //       formatFiatValue(this.min.toFixed(), this.currencyConfig).value
    //     } ${this.selectedFiatName}`;
    //   }
    //   if (this.maxVal.lt(this.amount)) {
    //     return `Amount can't be above provider's maximum: ${
    //       formatFiatValue(this.maxVal.toFixed(), this.currencyConfig).value
    //     } ${this.selectedFiatName}`;
    //   }
    //   return '';
    // },
    errorMessages() {
      const symbol = this.selectedCurrency?.symbol
        ? this.name
        : this.network.type.currencyName;
      const amount = BigNumber(this.amount);
      if (this.nonMainnetMetamask) {
        return 'Please switch your network to the Ethereum Mainnet on Metamask.';
      }

      if (amount.isNaN() || amount.eq(0)) {
        return 'Amount required';
      }

      if (amount.lt(0)) {
        return "Amount can't be negative.";
      }

      if (amount.gt(0) && amount.lt(this.min)) {
        return `The minimum amount to sell is ${this.min.toString()} ${symbol}.`;
      }
      if (amount.gt(0) && amount.gt(this.max)) {
        return `The maximum amount to sell is ${this.max.toString()} ${symbol}.`;
      }

      if (this.inWallet) {
        if (amount.gt(this.selectedBalance)) {
          return `You do not have enough ${symbol} to sell.`;
        }
        if (
          !isEmpty(this.sendHandler) &&
          !this.sendHandler.hasEnoughBalance()
        ) {
          return `You do not have enough ETH to pay for network fee.`;
        }
      } else {
        // Not in wallet
        if (
          this.actualValidAddress &&
          this.isValidAmount &&
          !this.hasEnoughAssets
        ) {
          return 'Address provided does not have enough balance to complete the transaction';
        }
      }
      if (
        this.amount &&
        !handlerSend.helpers.hasValidDecimals(
          this.amount,
          this.selectedCurrency.decimals
        )
      ) {
        return `Invalid decimals! Max decimals for selected currency is ${this.selectedCurrency.decimals}`;
      }

      return '';
    },
    nonMainnetMetamask() {
      return (
        this.instance &&
        this.instance.identifier === WALLET_TYPES.WEB3_WALLET &&
        this.network?.type.name !== 'ETH'
      );
    },
    isValidAmount() {
      /** !amount */
      if (!this.amount) {
        return false;
      }
      if (!isNumber(this.selectedCurrency?.decimals)) {
        return false;
      }
      /** amount is negative */
      if (BigNumber(this.amount).lt(0)) {
        return false;
      }
      /** return amount has valid decimals */
      return handlerSend.helpers.hasValidDecimals(
        this.amount,
        this.selectedCurrency.decimals
      );
    },
    getCalculatedAmount() {
      const amount = new BigNumber(this.amount ? this.amount : 0)
        .times(new BigNumber(10).pow(this.selectedCurrency.decimals))
        .toFixed(0);
      return toBNSafe(amount);
    },
    getAmountBN() {
      // Duplicate of getCalculatedAmount
      if (!this.isValidAmount) return toBNSafe(0);
      const amount = toBase(
        this.amount ? this.amount : 0,
        this.selectedCurrency.decimals
      );
      return toBNSafe(amount);
    },
    hasEnoughAssets() {
      try {
        const bal = toBase(
          this.selectedBalance,
          this.selectedCurrency.decimals
        );
        return toBNSafe(bal).gte(this.getAmountBN);
      } catch (e) {
        Toast(e, {}, ERROR);
        return false;
      }
    },
    actualAddress() {
      return this.inWallet ? this.address : this.toAddress;
    },
    actualValidAddress() {
      return this.inWallet ? true : this.validToAddress;
    }
  },
  watch: {
    cryptoToFiat: {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.$emit('input', newVal);
        }
      }
    },
    selectedCurrency: {
      handler: function (newVal, oldVal) {
        this.maxBalance = '0';
        this.hasPersistentHint = false;
        this.selectedBalance = '0';
        const supportedCoins = {
          ETH: 'ETH',
          BNB: 'BNB',
          MATIC: 'MATIC'
        };
        if (
          !newVal ||
          (newVal?.contract?.toLowerCase() === MAIN_TOKEN_ADDRESS &&
            !supportedCoins[newVal.symbol])
        ) {
          this.selectedCurrency = oldVal;
          return;
        }
        if (!isEqual(newVal, oldVal)) {
          this.fetchCurrencyData();
        }
        if (
          !isEmpty(this.sendHandler) &&
          this.selectedCurrency.hasOwnProperty('name')
        ) {
          this.sendHandler.setCurrency(newVal);
        }
        this.$emit('selectedCurrency', this.selectedCurrency);
        this.fetchSellInfo();
      },
      deep: true
    },
    selectedFiat: {
      handler: function (newVal, oldVal) {
        if (!isEqual(newVal, oldVal)) {
          this.amount = newVal.name != 'JPY' ? '300' : '30000';
          this.$emit('selectedFiat', newVal);
        }
      },
      deep: true
    },
    network: {
      handler: function () {
        this.selectedCurrency = {};
        this.selectedCurrency = this.defaultCurrency;
      },
      deep: true
    },
    amount(newVal) {
      this.debouncedSetAmount(newVal);
    },
    gasPriceType(newVal) {
      this.locGasPrice = this.gasPriceByType(newVal);
    },
    locGasPrice(val) {
      this.sendHandler.setLocalGasPrice(val);
    },
    gasLimit(val) {
      this.sendHandler.setGasLimit(val);
    },
    orderHandler: {
      handler: function () {
        this.sendHandler = new handlerSend();
        this.fetchSellInfo();
        this.locGasPrice = this.gasPriceByType(this.gasPriceType);
      },
      deep: true
    }
  },
  mounted() {
    // Watch for currency menu isActive
    // const selectedCurrencyRef = this.$refs.selectedCurrency;
    // const menuRef = selectedCurrencyRef.$children[0].$refs.menu;
    // this.$watch(
    //   () => {
    //     return menuRef.isActive;
    //   },
    //   val => {
    //     // If menu is closed make sure search is cleared
    //     if (!val) {
    //       if (
    //         selectedCurrencyRef.search !== '' ||
    //         selectedCurrencyRef.selectItems.length === 0
    //       )
    //         selectedCurrencyRef.search = '';
    //     }
    //   }
    // );

    if (!this.inWallet) this.$refs?.addressInput.$refs?.addressSelect.clear();
    this.sendHandler = new handlerSend();
    this.locGasPrice = this.gasPriceByType(this.gasPriceType);
    this.fetchSellInfo();
    this.fetchCurrencyData();
    this.fetchNetworks();
  },
  methods: {
    ...mapActions('external', ['setCoinGeckoTokens']),
    ...mapActions('global', ['setNetwork']),
    fetchNetworks() {
      const networksObj = Object.values(this.Networks);
      const networkList = networksObj.map(network => {
        return {
          img: network[0].type?.icon,
          name: network[0].type?.name_long,
          symbol: network[0].type?.name
        };
      });
      const returnedArray = [
        {
          img: this.network.type.icon,
          name: this.network.type.name_long,
          symbol: this.network.type.name
        },
        ...networkList
      ];
      this.fetchedNetworks = returnedArray;
      return this.fetchedNetworks;
    },
    setCurrency(currency) {
      this.amount = '0';
      this.selectedCurrency = currency;
      this.openTokenSelect = false;
    },
    setNewNetwork(network) {
      const found = Object.values(this.nodes).filter(item => {
        if (item.type.name === network.symbol) {
          return item;
        }
      });
      this.setNetwork({
        network: found[0],
        walletType: this.instance?.identifier || ''
      })
        .then(() => {
          if (this.isWallet) {
            this.networkSelected = this.validNetwork
              ? this.network[0].type.name
              : '';
            const provider =
              this.identifier === WALLET_TYPES.WEB3_WALLET
                ? this.setWeb3Instance(window.ethereum)
                : this.setWeb3Instance();
            if (!this.isOfflineApp) {
              provider.then(() => {
                this.setTokenAndEthBalance();
              });
            }
            Toast(`Switched network to: ${network.type.name}`, {}, SUCCESS);
            this.trackNetworkSwitch(network.type.name);
            this.$emit('newNetwork');
          }
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    },
    fetchCurrencyData() {
      this.loading = true;
      this.disableCurrencySelect = true;
      this.fetchData = {};
      this.fetchGasPrice();
      this.orderHandler
        .getSupportedFiatToSell(this.selectedCurrency?.symbol)
        .then(res => {
          this.fetchedData = Object.assign({}, res);
          // this.orderHandler.getFiatRatesForBuy().then(res => {
          this.currencyRates = cloneDeep(res);
          //   this.loading = false;
          //   this.disableCurrencySelect = false;
          // });
          this.loading = false;
          this.disableCurrencySelect = false;
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    },
    async fetchGasPrice() {
      const supportedNodes = {
        ETH: 'ETH',
        BNB: 'BSC',
        MATIC: 'MATIC'
      };
      const nodeType = !supportedNodes[this.selectedCurrency?.symbol]
        ? 'ETH'
        : supportedNodes[this.selectedCurrency.symbol];
      const node = nodeList[nodeType];
      if (!this.web3Connections[nodeType]) {
        const web3 = new Web3(node[0].url);
        this.web3Connections[nodeType] = web3;
      }
      this.gasPrice = await this.web3Connections[nodeType].eth.getGasPrice();
    },
    setAddress(newVal, isValid, data) {
      if (data.type === 'RESOLVED' && !data.value.includes('.'))
        this.toAddress = data.value;
      else this.toAddress = newVal;
      this.validToAddress = isValid;
      if (!this.validToAddress) return;
      this.sendHandler.setFrom(this.toAddress);
      this.fetchSellInfo();
    },
    getEthBalance() {
      if (!this.actualValidAddress) return;
      const supportedNodes = {
        ETH: 'ETH',
        BNB: 'BSC',
        MATIC: 'MATIC'
      };
      const nodeType = !supportedNodes[this.selectedCurrency?.symbol]
        ? 'ETH'
        : supportedNodes[this.selectedCurrency.symbol];
      const node = nodeList[nodeType];
      const web3Instance = new Web3(node[0].url);
      web3Instance.eth.getBalance(this.actualAddress).then(res => {
        this.fetchingBalance = false;
        this.selectedBalance = fromWei(res);
      });
    },
    getTokenBalance() {
      if (!this.actualValidAddress) return;
      const web3Instance = new Web3(nodes.ETH[0].url);
      const contract = new web3Instance.eth.Contract(
        abi,
        this.selectedCurrency.contract
      );
      contract.methods
        .balanceOf(this.actualAddress)
        .call()
        .then(res => {
          this.fetchingBalance = false;
          this.selectedBalance = BigNumber(res)
            .div(BigNumber(10).pow(this.selectedCurrency.decimals))
            .toString();
        });
    },
    debouncedSetAmount: debounce(function (newVal) {
      if (!BigNumber(newVal).eq(this.maxBalance)) {
        this.hasPersistentHint = false;
      }

      if (BigNumber(newVal).lt(0)) {
        return;
      }
      if (
        newVal &&
        !isEmpty(this.sendHandler) &&
        this.isValidAmount &&
        this.inWallet
      ) {
        const newValue = BigNumber(newVal ? newVal : 0)
          .times(
            BigNumber(10).pow(
              this.selectedCurrency?.decimals
                ? this.selectedCurrency.decimals
                : 18
            )
          )
          .toString();
        this.sendHandler.setValue(newValue);
        if (this.errorMessages === '' && this.hasEnoughAssets) {
          this.estimatingFees = true;
          this.sendHandler
            .estimateGas()
            .then(res => {
              this.estimatingFees = false;
              this.gasLimit = res;
            })
            .catch(err => {
              Toast(err, {}, ERROR);
            });
        }
      }
    }, 500),
    setMax() {
      const bal = this.sendHandler.getEntireBal();
      if (bal) {
        this.amount = BigNumber(bal)
          .div(
            BigNumber(10).pow(
              this.selectedCurrency.hasOwnProperty('name')
                ? this.selectedCurrency.decimals
                : 18
            )
          )
          .toString();
      } else {
        this.amount = this.selectedBalance;
      }
      this.maxBalance = this.amount;
      this.hasPersistentHint = true;
    },
    sell() {
      this.orderHandler
        .sell(this.name, this.amount, this.actualAddress)
        .then(() => {
          this.amount = '0';
          this.close();
          this.selectedCurrency = this.defaultCurrency;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
          this.amount = '0';
          this.close();
          this.selectedCurrency = this.defaultCurrency;
        });
    },
    fetchSellInfo() {
      if (this.actualValidAddress && this.selectedCurrency.contract) {
        this.fetchingBalance = true;
        if (this.selectedCurrency.contract === MAIN_TOKEN_ADDRESS) {
          this.getEthBalance();
        } else {
          this.getTokenBalance();
        }
        if (this.hasEnoughAssets) {
          this.sendHandler.setFrom(this.actualAddress);
          this.sendHandler.setCurrency(this.selectedCurrency);
          this.sendHandler.setValue(this.getCalculatedAmount);
          // eslint-disable-next-line
          this.sendHandler.setTo(ETH_DONATION_ADDRESS, 'TYPED');
          this.estimatingFees = true;
          this.sendHandler
            .estimateGas()
            .then(res => {
              this.estimatingFees = false;
              this.gasLimit = res;
            })
            .catch(err => {
              Toast(err, {}, ERROR);
            });
        }
      } else {
        this.fetchingBalance = false;
        this.selectedBalance = fromWei('0');
      }
      this.orderHandler
        .getSupportedFiatToSell(this.name)
        .then(res => {
          this.loading = false;
          this.fetchedData = res[0];
        })
        .catch(e => {
          this.loading = false;
          Toast(e, {}, ERROR);
        });
    },
    isValidToAddress(address) {
      return MultiCoinValidator.validate(address, this.selectedCurrency.symbol);
    },
    preventCharE(e) {
      if (e.key === 'e') e.preventDefault();
    }
  }
};
</script>

<style lang="scss" scoped>
.token-select-button {
  height: 62px;
  border: 1px solid var(--v-inputBorder-base);
  border-radius: 0 8px 8px 0;
  width: 120px;
  padding: 0 11px 0 14px;
  line-height: initial;
  user-select: none;
  cursor: pointer;
  &:hover {
    border: 1px solid var(--v-greyPrimary-base);
  }
}
</style>
