<template>
  <div class="pa-8 moonpay-sell-component">
    <!-- ========================================================================= -->
    <!-- Selling amount in crypto -->
    <!-- ========================================================================= -->
    <div class="mt-2">
      <div class="mb-2 d-flex align-center justify-space-between">
        <div class="font-weight-medium textDark--text">
          How much do you want to sell?
        </div>
        <button-balance
          v-if="!loading && !fetchingBalance"
          style="position: relative; top: 0; right: 0"
          :balance="balance"
          :loading="loading"
        />
      </div>

      <div class="d-flex align-start">
        <mew-input
          v-if="inWallet"
          v-model="amount"
          hide-clear-btn
          class="no-right-border"
          type="number"
          placeholder="Enter amount to sell"
          :max-btn-obj="maxButton"
          :disabled="loading"
          :error-messages="errorMessages"
          :persistent-hint="hasPersistentHint"
          :hint="persistentHintMessage"
          @keydown.native="preventCharE($event)"
        />
        <mew-input
          v-else
          v-model="amount"
          hide-clear-btn
          class="no-right-border"
          type="number"
          placeholder="Enter amount to sell"
          :max-btn-obj="maxButton"
          :disabled="loading"
          :error-messages="errorMessages"
          :persistent-hint="hasPersistentHint"
          :hint="persistentHintMessage"
          @keydown.native="preventCharE($event)"
        />
        <div
          style="max-width: 135px"
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

    <!-- ========================================================================= -->
    <!-- Receiving amount in fiat -->
    <!-- ========================================================================= -->
    <div class="mt-2">
      <div class="font-weight-medium textDark--text mb-2">You will get</div>
      <div class="d-flex align-start">
        <mew-input
          is-read-only
          :value="cryptoAmount"
          hide-clear-btn
          type="number"
          class="no-right-border"
        />
        <mew-select
          v-model="selectedFiat"
          style="max-width: 135px"
          :items="fiatCurrencyItems"
          is-custom
          class="selectedFiat no-left-border"
        />
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- Refund address -->
    <!-- ============================================================== -->
    <div v-if="!inWallet" class="mt-2">
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

    <div class="pt-2 pb-10">
      <div class="mew-body textMedium--text">
        After submitting your sell order, you will have to send your crypto to
        Moonpay. Make sure to have enough currency in your wallet to cover
        network transaction fees.
      </div>

      <div
        v-if="inWallet"
        class="d-flex align-center justify-space-between mt-4"
      >
        <div class="mew-body textMedium--text">Estimated Network Fee</div>
        <div v-if="!estimatingFees" class="mew-body textMedium--text">
          ~{{ txFeeInEth }}
        </div>
        <v-skeleton-loader v-else type="text" width="150px" />
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- Sell button -->
    <!-- ============================================================== -->
    <mew-button
      title="SELL WITH MOONPAY"
      btn-size="xlarge"
      has-full-width
      :disabled="disableSell"
      :is-valid-address-func="isValidToAddress"
      @click.native="sell"
    />

    <!-- ========================================================================= -->
    <!-- Token select popup -->
    <!-- ========================================================================= -->
    <buy-sell-token-select
      :open="openTokenSelect"
      :currency-items="currencyItems"
      :selected-currency="selectedCurrency"
      :set-currency="setCurrency"
      :in-wallet="inWallet"
      @close="openTokenSelect = false"
    />
  </div>
</template>

<script>
import MultiCoinValidator from 'multicoin-address-validator';
import { mapActions, mapGetters, mapState } from 'vuex';
import { isEmpty, debounce, isNumber, isEqual } from 'lodash';
import BigNumber from 'bignumber.js';
import { fromWei, toBN } from 'web3-utils';
import Web3 from 'web3';

import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import handlerSend from '@/modules/send/handlers/handlerSend.js';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common.js';
import abi from '@/modules/balance/handlers/abiERC20.js';
import {
  formatFloatingPointValue,
  formatFiatValue
} from '@/core/helpers/numberFormatHelper';
import { toBase } from '@/core/helpers/unit';
import { sellContracts } from './tokenList';
import handlerWallet from '@/core/mixins/handlerWallet.mixin';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook.vue';
import BuySellTokenSelect from '@/modules/buy-sell/components/TokenSelect.vue';
import { getCurrency } from '@/modules/settings/components/currencyList';

export default {
  name: 'ModuleSellEth',
  components: {
    ButtonBalance: () => import('@/core/components/AppButtonBalance'),
    ModuleAddressBook,
    BuySellTokenSelect
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
    }
  },
  data() {
    return {
      selectedFiat: {
        name: 'USD',
        value: 'USD',
        // eslint-disable-next-line
        img: require(`@/assets/images/currencies/USD.svg`)
      },
      openTokenSelect: false,
      selectedCurrency: this.defaultCurrency,
      amount: '0',
      fetchedData: {},
      locGasPrice: '0',
      sendHandler: {},
      loading: true,
      hasPersistentHint: false,
      fetchingBalance: true,
      gasLimit: 21000,
      estimatingFees: true,
      maxBalance: '0',
      selectedBalance: '0',
      toAddress: '',
      validToAddress: false,
      currencyRates: []
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'instance', 'web3']),
    ...mapState('global', ['gasPriceType']),
    ...mapGetters('wallet', ['balanceInETH', 'balanceInWei', 'tokensList']),
    ...mapGetters('global', ['isEthNetwork', 'network', 'gasPriceByType']),
    ...mapGetters('external', ['contractToToken']),
    balance() {
      return `${formatFloatingPointValue(this.selectedBalance).value}`;
    },
    fiatCurrencyItems() {
      const arrItems = this.hasData
        ? this.fetchedData.fiat_currencies.filter(item => item !== 'RUB')
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
    currencyConfig() {
      const fiat = this.selectedFiat.value;
      const rate = this.currencyRates[fiat];
      const currency = fiat;
      return { rate, currency };
    },
    preselectedCurrencies() {
      if (this.inWallet) {
        return sellContracts.reduce((arr, item) => {
          const inList = this.tokensList.find(t => {
            if (t.contract.toLowerCase() === item.toLowerCase()) return t;
          });
          if (inList) {
            inList.price = formatFiatValue(inList ? inList.price : '0').value;
            arr.push(inList);
            return arr;
          }

          const token = this.contractToToken(item);
          if (token) {
            token.price = formatFiatValue(
              token ? token.price : '0',
              this.currencyConfig
            ).value;
            arr.push(token);
          }
          return arr;
        }, []);
      }
      const arr = new Array();
      for (const contract of sellContracts) {
        const token = this.contractToToken(contract);
        if (token) {
          token.price = formatFiatValue(token ? token.price : '0').value;
          arr.push(token);
        }
      }
      return arr;
    },
    currencyItems() {
      const tokensList = this.preselectedCurrencies;
      const imgs = tokensList.map(item => {
        item.value = item.name;
        item.name = item.symbol;
        return item.img;
      });

      const returnedArray = [
        {
          text: 'Select Token',
          imgs: imgs.splice(0, 3),
          total: `${tokensList.length}`,
          divider: true,
          selectLabel: true
        },
        ...tokensList
      ];
      return returnedArray;
    },
    supportedCurrency() {
      return ['ETH', 'USDT', 'USDC', 'MATIC', 'BNB'];
    },
    supportedNetworks() {
      return ['ETH', 'MATIC', 'BSC'];
    },
    name() {
      return this.supportedCurrency.includes(this.selectedCurrency.symbol)
        ? this.selectedCurrency.symbol
        : this.network.type.currencyName;
    },
    disableSell() {
      return (
        !this.amount ||
        this.amount === '' ||
        BigNumber(this.amount).eq(0) ||
        this.loading ||
        this.errorMessages !== '' ||
        !this.actualValidAddress
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
      return `${BigNumber(this.txFee).decimalPlaces(4)} ${
        this.network.type.currencyName
      }`;
    },
    errorMessages() {
      const symbol = this.selectedCurrency?.symbol
        ? this.name
        : this.network.type.currencyName;
      const amount = BigNumber(this.amount);
      if (this.nonMainnetMetamask) {
        return 'Please switch your network to the Ethereum Mainnet on Metamask.';
      }

      if (BigNumber(this.selectedBalance).eq(0) && this.actualValidAddress) {
        return `Address provided has no ${this.selectedCurrency.symbol}`;
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
      return toBN(amount);
    },
    getAmountBN() {
      // Duplicate of getCalculatedAmount
      if (!this.isValidAmount) return toBN(0);
      const amount = toBase(
        this.amount ? this.amount : 0,
        this.selectedCurrency.decimals
      );
      return toBN(amount);
    },
    hasEnoughAssets() {
      try {
        const bal = toBase(
          this.selectedBalance,
          this.selectedCurrency.decimals
        );
        return toBN(bal).gte(this.getAmountBN);
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
    },
    hasData() {
      return !isEmpty(this.fetchedData);
    },
    cryptoAmount() {
      return BigNumber(this.amount).times(this.priceOb.price).toString();
    },
    selectedFiatName() {
      return this.selectedFiat.name;
    },
    priceOb() {
      return !isEmpty(this.fetchedData)
        ? this.fetchedData.prices.find(
            item => item.fiat_currency === this.selectedFiatName
          )
        : { crypto_currency: 'ETH', fiat_currency: 'USD', price: '3379.08322' };
    }
  },
  watch: {
    toAddress() {
      this.amount = '0';
    },
    selectedCurrency: {
      handler: function (newVal) {
        this.maxBalance = '0';
        this.hasPersistentHint = false;
        this.selectedBalance = '0';
        if (
          !isEmpty(this.sendHandler) &&
          this.selectedCurrency.hasOwnProperty('name')
        ) {
          this.sendHandler.setCurrency(newVal);
        }
        this.fetchSellInfo();
      },
      deep: true
    },
    selectedFiat: {
      handler: function (newVal, oldVal) {
        if (!isEqual(newVal, oldVal)) {
          this.$emit('selectedFiat', newVal);
        }
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
    },
    network() {
      this.maxBalance = '0';
      this.hasPersistentHint = false;
      this.selectedBalance = '0';
      this.amount = '0';
      this.selectedCurrency = {};
      this.selectedCurrency = this.defaultCurrency;
      if (this.supportedNetworks.includes(this.network.type.name)) {
        this.sendHandler = new handlerSend();
        this.fetchSellInfo();
        this.locGasPrice = this.gasPriceByType(this.gasPriceType);
      }
    }
  },
  mounted() {
    if (!this.inWallet) this.$refs.addressInput.$refs.addressSelect.clear();
    this.sendHandler = new handlerSend();
    this.fetchSellInfo();
    this.locGasPrice = this.gasPriceByType(this.gasPriceType);
  },
  methods: {
    ...mapActions('external', ['setCoinGeckoTokens']),
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
      const web3Instance = this.inWallet
        ? this.web3
        : new Web3(this.network.url);
      web3Instance.eth.getBalance(this.actualAddress).then(res => {
        this.fetchingBalance = false;
        this.selectedBalance = fromWei(res);
      });
    },
    getTokenBalance() {
      if (!this.actualValidAddress) return;
      const web3Instance = this.inWallet
        ? this.web3
        : new Web3(this.network.url);
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
    setCurrency(e) {
      this.amount = '0';
      this.selectedCurrency = e;
    },
    setMax() {
      if (
        this.selectedCurrency.contract !== MAIN_TOKEN_ADDRESS ||
        this.inWallet
      ) {
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
      } else {
        this.amount = BigNumber(this.selectedBalance)
          .minus(this.txFee)
          .toString();
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
  height: 56px;
  border: 1px solid var(--v-inputBorder-base);
  border-radius: 0 8px 8px 0;
  width: 135px;
  padding: 0 11px 0 14px;
  line-height: initial;
  user-select: none;
  cursor: pointer;
  &:hover {
    border: 1px solid var(--v-greyPrimary-base);
  }
}
</style>
<style lang="scss">
.moonpay-sell-component {
  .v-input__slot {
    height: 47px !important;
  }

  .no-right-border {
    fieldset {
      border-radius: 8px 0 0 8px !important;
    }
  }
  .no-left-border fieldset {
    border-radius: 0 8px 8px 0 !important;
  }
}
</style>
