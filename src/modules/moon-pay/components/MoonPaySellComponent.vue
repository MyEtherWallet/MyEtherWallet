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
      <button-balance :balance="selectedCurrencyBalance" />
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
import { mapGetters } from 'vuex';
import { cloneDeep, isEmpty } from 'lodash';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import BigNumber from 'bignumber.js';
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
        text: 'Select a currency',
        selectLabel: true,
        divider: true
      },
      amount: '0'
    };
  },
  computed: {
    ...mapGetters('wallet', ['tokensList', 'balanceInETH']),
    ...mapGetters('global', ['isEthNetwork', 'network']),
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

        return isEmpty(found) ? '0' : found.balancef;
      }
      return this.balanceInETH;
    },
    disableMax() {
      return !BigNumber(this.selectedCurrencyBalance).gt(0);
    },
    disableSell() {
      return !(
        BigNumber(this.amount).gt(0) &&
        BigNumber(this.selectedCurrencyBalance).gte(this.amount)
      );
    },
    errorMessages() {
      if (BigNumber(this.amount).gt(this.selectedCurrencyBalance)) {
        const symbol = this.selectedCurrency?.name
          ? this.selectedCurrency.name
          : this.network.type.currencyName;
        return `Entered amount is greater than ${symbol} balance!`;
      }

      return '';
    }
  },
  methods: {
    setCurrency(e) {
      this.selectedCurrency = e;
    },
    reset() {
      this.selectedCurrency = {
        text: 'Select a currency',
        selectLabel: true,
        divider: true
      };
      this.amount = '0';
    },
    setMax() {
      this.amount = this.selectedCurrencyBalance;
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
    }
  }
};
</script>

<style lang="scss" scoped></style>
