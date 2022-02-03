<template>
  <div class="pt-10 px-8">
    <!-- ============================================================== -->
    <!-- Currency select -->
    <!-- ============================================================== -->
    <mew-select
      label="Currency"
      :items="currencyItems"
      :value="selectedCurrency"
      :disabled="loading"
      is-custom
      @input="setCurrency"
    />

    <!-- ============================================================== -->
    <!-- Amount -->
    <!-- ============================================================== -->
    <div class="position--relative mt-9">
      <button-balance :balance="selectedCurrencyBalance" :loading="loading" />
      <mew-input
        v-model="amount"
        type="number"
        label="Amount"
        placeholder="Enter amount to sell"
        :max-btn-obj="{
          title: 'Max',
          disabled: disableMax,
          method: setMax
        }"
        :disabled="loading"
        :error-messages="errorMessages"
      />
    </div>
    <!-- ============================================================== -->
    <!-- Sell button -->
    <!-- ============================================================== -->
    <mew-button
      title="Sell now"
      btn-size="xlarge"
      has-full-width
      class="mt-10"
      :disabled="disableSell"
      @click.native="sell"
    />
  </div>
</template>

<script>
import ButtonBalance from '@/core/components/AppButtonBalance';
import { mapGetters, mapState } from 'vuex';
import { isEmpty, debounce } from 'lodash';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import BigNumber from 'bignumber.js';
import handlerSend from '@/modules/send/handlers/handlerSend.js';
export default {
  name: 'ModuleSellEth',
  components: { ButtonBalance },
  props: {
    handler: {
      type: Object,
      default: () => {}
    },
    close: {
      type: Function,
      default: () => {}
    },
    defaultCurrency: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      selectedCurrency: this.defaultCurrency,
      amount: '0',
      fetchedData: {},
      locGasPrice: '0',
      sendHandler: {},
      loading: true
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapState('global', ['gasPriceType']),
    ...mapGetters('wallet', ['balanceInETH', 'tokensList']),
    ...mapGetters('global', ['isEthNetwork', 'network', 'gasPriceByType']),
    currencyItems() {
      // no ref copy
      const tokensList = this.tokensList.slice();
      const filteredTokens = tokensList.filter(item => {
        return (
          item.name === 'ETH' || item.name === 'USDT' || item.name === 'USDC'
        );
      });
      const imgs = filteredTokens.map(item => {
        item.totalBalance = item.usdBalancef;
        item.tokenBalance = item.balancef;
        item.price = item.pricef;
        return item.img;
      });
      const returnedArray = [
        {
          text: 'Select Token',
          imgs: imgs.splice(0, 3),
          total: `${filteredTokens.length}`,
          divider: true,
          selectLabel: true
        },
        {
          header: 'My Wallet'
        },
        ...filteredTokens
      ];
      return returnedArray;
    },
    selectedCurrencyBalance() {
      if (this.isEthNetwork) {
        const currency = this.selectedCurrency?.text
          ? { balance: 0, decimals: 18 }
          : this.selectedCurrency;
        return BigNumber(currency.balance)
          .div(BigNumber(10).pow(currency.decimals))
          .toString();
      }
      return this.balanceInETH;
    },
    disableMax() {
      return !BigNumber(this.selectedCurrencyBalance).gt(0);
    },
    disableSell() {
      return (
        BigNumber(this.amount).eq(0) ||
        this.loading ||
        this.errorMessages !== ''
      );
    },
    min() {
      if (!isEmpty(this.fetchedData)) {
        const found = this.fetchedData.limits.find(item => {
          return (
            item.crypto_currency === this.selectedCurrency.name &&
            item.type === 'WEB'
          );
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
          return (
            item.crypto_currency === this.selectedCurrency.name &&
            item.type === 'WEB'
          );
        });

        if (found) {
          return BigNumber(found.limit.max);
        }
      }
      return BigNumber(3);
    },
    errorMessages() {
      const symbol = this.selectedCurrency?.name
        ? this.selectedCurrency.name
        : this.network.type.currencyName;
      if (BigNumber(this.amount).lt(this.min)) {
        return `Entered amount is less than allowed minimum value: ${this.min.toString()} ${symbol}`;
      }
      if (BigNumber(this.amount).gt(this.max)) {
        return `Entered amount is greater than allowed maximum value: ${this.max.toString()} ${symbol}`;
      }
      if (BigNumber(this.amount).gt(this.selectedCurrencyBalance)) {
        return `Entered amount is greater than ${symbol} balance!`;
      }

      if (!isEmpty(this.sendHandler) && !this.sendHandler.hasEnoughBalance()) {
        return `You don't have enough balance to send ${symbol} ${this.amount} and cover the network fees!`;
      }

      return '';
    }
  },
  watch: {
    selectedCurrency: {
      handler: function (newVal) {
        this.amount = '0';
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
    amount: {
      handler: debounce(function (newVal) {
        if (newVal && !isEmpty(this.sendHandler)) {
          const newValue = BigNumber(newVal ? newVal : 0)
            .times(
              BigNumber(10).pow(
                this.selectedCurrency?.text
                  ? 18
                  : this.selectedCurrency.decimals
              )
            )
            .toString();
          this.sendHandler.setValue(newValue);
          if (this.errorMessages === '') {
            this.sendHandler
              .estimateGas()
              .then(() => {})
              .catch(err => {
                Toast(err, {}, ERROR);
              });
          }
        } else {
          this.amount = '0';
        }
      }, 500)
    },
    gasPriceType(newVal) {
      this.locGasPrice = this.gasPriceByType(newVal);
    },
    locGasPrice(val) {
      this.sendHandler.setLocalGasPrice(val);
    }
  },
  mounted() {
    this.fetchSellInfo();
    this.locGasPrice = this.gasPriceByType(this.gasPriceType);
  },
  methods: {
    setCurrency(e) {
      this.selectedCurrency = e;
    },
    reset() {
      this.amount = '0';
      this.sendHandler = {};
    },
    setMax() {
      const bal = this.sendHandler.getEntireBal();
      this.amount = BigNumber(bal)
        .div(
          BigNumber(10).pow(
            this.selectedCurrency.hasOwnProperty('name')
              ? this.selectedCurrency.decimals
              : 18
          )
        )
        .toString();
    },
    sell() {
      this.handler
        .sell(this.selectedCurrency.name, this.amount)
        .then(() => {
          this.reset();
          this.close();
          this.selectedCurrency = this.defaultCurrency;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
          this.reset();
          this.close();
          this.selectedCurrency = this.defaultCurrency;
        });
    },
    fetchSellInfo() {
      this.reset();
      this.sendHandler = new handlerSend();
      this.sendHandler.setCurrency(this.selectedCurrency);
      // eslint-disable-next-line
      this.sendHandler.setTo(ETH_DONATION_ADDRESS, 'TYPED');
      this.handler
        .getSupportedFiatToSell(this.selectedCurrency.name)
        .then(res => {
          this.loading = false;
          this.fetchedData = Object.assign({}, res);
        })
        .catch(e => {
          this.loading = false;
          Toast(e, {}, ERROR);
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
