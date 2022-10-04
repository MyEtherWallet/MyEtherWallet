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
    <div v-if="inWallet" class="position--relative mt-9">
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
    <div v-else class="position--relative mt-9">
      <mew-input
        v-model="amount"
        type="number"
        label="Amount"
        placeholder="Enter amount to sell"
        :disabled="loading"
        :error-messages="errorMessages"
        :persistent-hint="hasPersistentHint"
        :hint="persistentHintMessage"
      />
    </div>
    <div class="pt-8 pb-13">
      <div
        v-if="inWallet"
        class="d-flex align-center justify-space-between mb-2"
      >
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
    <!-- Refund address -->
    <!-- ============================================================== -->
    <div v-if="!inWallet" class="mt-0">
      <div class="mew-heading-3 textDark--text mb-5">Refund address</div>
      <module-address-book
        ref="addressInput"
        label="Enter Crypto Address"
        :enable-save-address="false"
        :is-home-page="true"
        @setAddress="setAddress"
      />
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
  </div>
</template>

<script>
import MultiCoinValidator from 'multicoin-address-validator';
import { mapActions, mapGetters, mapState } from 'vuex';
import { isEmpty, debounce, isNumber } from 'lodash';
import BigNumber from 'bignumber.js';
import { fromWei } from 'web3-utils';
import Web3 from 'web3';

import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import handlerSend from '@/modules/send/handlers/handlerSend.js';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common.js';
import abi from '@/modules/balance/handlers/abiERC20.js';
import nodes from '@/utils/networks';
import { toBNSafe, formatFiatValue } from '@/core/helpers/numberFormatHelper';
import { toBase } from '@/core/helpers/unit';
import { sellContracts } from './tokenList';
import handlerWallet from '@/core/mixins/handlerWallet.mixin';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook.vue';

export default {
  name: 'ModuleSellEth',
  components: {
    ButtonBalance: () => import('@/core/components/AppButtonBalance'),
    ModuleAddressBook
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
      validToAddress: false
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'instance']),
    ...mapState('global', ['gasPriceType']),
    ...mapGetters('wallet', ['balanceInETH', 'tokensList']),
    ...mapGetters('global', ['isEthNetwork', 'network', 'gasPriceByType']),
    ...mapGetters('external', ['contractToToken']),
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
            token.price = formatFiatValue(token ? token.price : '0').value;
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
      return `${BigNumber(this.txFee).decimalPlaces(4)} ETH`;
    },
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
    if (this.$refs.addressInput) {
      this.$refs.addressInput.$refs.addressSelect.clear();
    }
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
      const web3Instance = new Web3(nodes.ETH[0].url);
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
    setCurrency(e) {
      this.amount = '0';
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
      if (this.actualValidAddress) {
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
    }
  }
};
</script>

<style lang="scss" scoped></style>
