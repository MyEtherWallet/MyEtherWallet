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
        :persistent-hint="hasPersistentHint"
        :hint="persistentHintMessage"
      />
    </div>
    <div class="pt-10 pb-13">
      <div class="d-flex align-center justify-space-between mb-2">
        <div class="mew-body textDark--text font-weight-bold">
          Estimated Network Fee
        </div>
        <div v-if="!estimatingFees" class="mew-body">~{{ txFeeInEth }}</div>
        <v-skeleton-loader v-else type="text" width="150px" />
      </div>
      <div class="mew-body textMedium--text">
        After submitting your sell order, you will have to send your crypto to
        Moonpay. Remember to have enough ETH for the Send Network Fee.
      </div>
    </div>
    <!-- ============================================================== -->
    <!-- Sell button -->
    <!-- ============================================================== -->
    <mew-button
      title="Sell now"
      btn-size="xlarge"
      has-full-width
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
import { fromWei } from 'web3-utils';
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
      loading: true,
      hasPersistentHint: false,
      gasLimit: 21000,
      estimatingFees: true,
      maxBalance: '0'
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapState('global', ['gasPriceType']),
    ...mapGetters('wallet', ['balanceInETH', 'tokensList']),
    ...mapGetters('global', ['isEthNetwork', 'network', 'gasPriceByType']),
    persistentHintMessage() {
      return this.hasPersistentHint
        ? `Max adjusted to leave sufficient ${this.selectedCurrency.name} for network fee`
        : '';
    },
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
        !this.amount ||
        this.amount === '' ||
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
      const symbol = this.selectedCurrency?.name
        ? this.selectedCurrency.name
        : this.network.type.currencyName;
      const amount = BigNumber(this.amount);
      if (amount.lt(0)) {
        return "Amount can't be negative.";
      }

      if (amount.gt(this.selectedCurrencyBalance)) {
        return `You do not have enough ${symbol} to sell.`;
      }

      if (!isEmpty(this.sendHandler) && !this.sendHandler.hasEnoughBalance()) {
        return `You do not have enough ${symbol} to pay for network fee.`;
      }

      if (amount.gt(0) && amount.lt(this.min)) {
        return `The minimum transaction amount is ${this.min.toString()} ${symbol}.`;
      }
      if (amount.gt(0) && amount.gt(this.max)) {
        return `The maximum transaction amount is ${this.max.toString()} ${symbol}.`;
      }

      return '';
    }
  },
  watch: {
    selectedCurrency: {
      handler: function (newVal) {
        this.amount = '0';
        this.maxBalance = '0';
        this.hasPersistentHint = false;
        if (
          !isEmpty(this.sendHandler) &&
          this.selectedCurrency.hasOwnProperty('name')
        ) {
          this.sendHandler.setCurrency(newVal);
        }
        this.fetchSellInfo();
        this.$emit('selectedCurrency', newVal);
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
    }
  },
  mounted() {
    this.sendHandler = new handlerSend();
    this.fetchSellInfo();
    this.locGasPrice = this.gasPriceByType(this.gasPriceType);
  },
  methods: {
    debouncedSetAmount: debounce(function (newVal) {
      if (!BigNumber(newVal).eq(this.maxBalance)) {
        this.hasPersistentHint = false;
      }

      if (BigNumber(newVal).lt(0)) {
        return;
      }
      if (newVal && !isEmpty(this.sendHandler)) {
        const newValue = BigNumber(newVal ? newVal : 0)
          .times(
            BigNumber(10).pow(
              this.selectedCurrency?.text ? 18 : this.selectedCurrency.decimals
            )
          )
          .toString();
        this.sendHandler.setValue(newValue);
        if (this.errorMessages === '') {
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
      this.selectedCurrency = e;
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
      this.maxBalance = this.amount;
      this.hasPersistentHint = true;
    },
    sell() {
      this.handler
        .sell(this.selectedCurrency.name, this.amount)
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
      this.amount = '0';
      this.sendHandler.setCurrency(this.selectedCurrency);
      this.sendHandler.setValue(this.amount);
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
      this.handler
        .getSupportedFiatToSell()
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
