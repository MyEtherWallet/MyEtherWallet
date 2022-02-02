<template>
  <div class="pt-10">
    <!-- ============================================================== -->
    <!-- Currency select -->
    <!-- ============================================================== -->
    <mew-select
      label="Currency"
      :items="availableCurrencyItems"
      :value="selectedCurrency"
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
import { cloneDeep, isEmpty } from 'lodash';
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
    currencyItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedCurrency: {
        name: 'ETH',
        subtext: 'Ethereum',
        value: 'eth'
      },
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
    ...mapGetters('wallet', ['tokensList', 'balanceInETH']),
    ...mapGetters('global', ['isEthNetwork', 'network', 'gasPriceByType']),
    availableCurrencyItems() {
      const arr = cloneDeep(this.currencyItems).splice(0, 2);
      if (this.isEthNetwork) {
        const filteredTokensList = this.tokensList.filter(item => {
          return item.name === 'USDT' || item.name === 'USDC';
        });

        filteredTokensList.forEach(item => {
          const found = cloneDeep(this.currencyItems)
            .splice(1, this.currencyItems.length - 1)
            .find(currI => {
              return item.name === currI.name;
            });
          if (found) {
            arr.push(found);
          }
        });
      }
      return arr;
    },
    selectedCurrencyBalance() {
      if (this.isEthNetwork) {
        const symbol = this.selectedCurrency?.name
          ? this.selectedCurrency.name
          : this.selectedCurrency.text;
        const found = this.tokensList.find(item => {
          return item.name === symbol;
        });

        return isEmpty(found)
          ? '0'
          : BigNumber(found.balance)
              .div(BigNumber(10).pow(found.decimals))
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
      const limit = isEmpty(this.fetchedData)
        ? BigNumber(0.015)
        : BigNumber(this.fetchedData.limits[0].min);
      return limit;
    },
    max() {
      const limit = isEmpty(this.fetchedData)
        ? BigNumber(3)
        : BigNumber(this.fetchedData.limits[0].max);
      return limit;
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
    },
    selectedTokensList() {
      const symbol = this.selectedCurrency.name;
      const foundItem = this.tokensList.filter(item => {
        return item.name === symbol;
      });

      return foundItem[0];
    }
  },
  watch: {
    selectedTokensList: {
      handler: function (newVal) {
        this.amount = '0';
        if (!isEmpty(this.sendHandler)) {
          this.sendHandler.setCurrency(newVal);
        }
      },
      deep: true
    },
    amount(newVal) {
      if (newVal && !isEmpty(this.sendHandler)) {
        const newValue = BigNumber(newVal ? newVal : 0)
          .times(BigNumber(10).pow(this.selectedTokensList.decimals))
          .toString();
        this.loading = true;
        this.sendHandler.setValue(newValue);
        this.sendHandler
          .estimateGas()
          .then(() => {
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
            Toast(err, {}, ERROR);
          });
      } else {
        this.amount = '0';
      }
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
      this.selectedCurrency = {
        name: 'ETH',
        subtext: 'Ethereum',
        value: 'eth'
      };
      this.amount = '0';
      this.sendHandler = {};
    },
    setMax() {
      const bal = this.sendHandler.getEntireBal();
      this.amount = BigNumber(bal)
        .div(BigNumber(10).pow(this.selectedTokensList.decimals))
        .toString();
    },
    sell() {
      this.handler
        .sell(this.selectedCurrency.name, this.amount)
        .then(() => {
          this.reset();
          this.close();
        })
        .catch(err => {
          Toast(err, {}, ERROR);
          this.reset();
          this.close();
        });
    },
    fetchSellInfo() {
      this.reset();
      this.sendHandler = new handlerSend();
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
