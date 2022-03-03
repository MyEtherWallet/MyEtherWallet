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
      <button-balance :balance="selectedBalance" :loading="fetchingBalance" />
      <mew-input
        v-model="amount"
        type="number"
        label="Amount"
        placeholder="Enter amount to sell"
        :max-btn-obj="maxButton"
        :disabled="loading"
        :error-messages="errorMessages"
        :persistent-hint="hasPersistentHint"
        :hint="persistentHintMessage"
      />
    </div>
    <div class="pt-8 pb-13">
      <div class="d-flex align-center justify-space-between mb-2">
        <div class="mew-body textDark--text font-weight-bold">
          Estimated Network Fee
        </div>
        <div v-if="!estimatingFees" class="mew-body textDark--text">
          ~{{ txFeeInEth }}
        </div>
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
import { isEmpty, debounce, isNumber } from 'lodash';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import BigNumber from 'bignumber.js';
import handlerSend from '@/modules/send/handlers/handlerSend.js';
import { fromWei } from 'web3-utils';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common.js';
import abi from '@/modules/balance/handlers/abiERC20.js';
import nodes from '@/utils/networks';
import Web3 from 'web3';
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
      fetchingBalance: true,
      gasLimit: 21000,
      estimatingFees: true,
      maxBalance: '0',
      selectedBalance: '0'
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapState('global', ['gasPriceType']),
    ...mapGetters('wallet', ['balanceInETH']),
    ...mapGetters('global', ['isEthNetwork', 'network', 'gasPriceByType']),
    persistentHintMessage() {
      return this.hasPersistentHint
        ? `Max adjusted to leave sufficient ${this.selectedCurrency.name} for network fee`
        : '';
    },
    maxButton() {
      return BigNumber(this.selectedBalance).gt(0)
        ? {
            title: 'Max',
            method: this.setMax
          }
        : {};
    },
    currencyItems() {
      // hard writing for now
      const tokensList = [
        {
          decimals: 18,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'Ethereum',
          symbol: 'ETH',
          contract: MAIN_TOKEN_ADDRESS
        },
        {
          decimals: 6,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7-eth.png',
          name: 'USDT',
          subtext: 'Tether',
          value: 'Tether',
          symbol: 'USDT (ERC20)',
          contract: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
        },
        {
          decimals: 6,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/USDC-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48-eth.svg',
          name: 'USDC',
          subtext: 'USD Coin',
          value: 'USD Coin',
          symbol: 'USDC (ERC20)',
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
        }
      ];
      const imgs = tokensList.map(item => {
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

      if (amount.gt(this.selectedBalance)) {
        return `You do not have enough ${symbol} to sell.`;
      }

      if (!isEmpty(this.sendHandler) && !this.sendHandler.hasEnoughBalance()) {
        return `You do not have enough ${symbol} to pay for network fee.`;
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

      if (amount.gt(0) && amount.lt(this.min)) {
        return `The minimum transaction amount is ${this.min.toString()} ${symbol}.`;
      }
      if (amount.gt(0) && amount.gt(this.max)) {
        return `The maximum transaction amount is ${this.max.toString()} ${symbol}.`;
      }

      return '';
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
    defaultCurrency(e) {
      this.selectedCurrency = e;
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
    getEthBalance() {
      const web3Instance = new Web3(nodes['ETH'][0].url);
      web3Instance.eth.getBalance(this.address).then(res => {
        this.fetchingBalance = false;
        this.selectedBalance = fromWei(res);
      });
    },
    getTokenBalance() {
      const web3Instance = new Web3(nodes['ETH'][0].url);
      const contract = new web3Instance.eth.Contract(
        abi,
        this.selectedCurrency.contract
      );
      contract.methods
        .balanceOf(this.address)
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
      if (newVal && !isEmpty(this.sendHandler) && this.isValidAmount) {
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
      this.fetchingBalance = true;
      if (this.selectedCurrency.contract === MAIN_TOKEN_ADDRESS) {
        this.getEthBalance();
      } else {
        this.getTokenBalance();
      }
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
