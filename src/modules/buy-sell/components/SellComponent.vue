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
        <app-button-balance
          v-if="!loading && !fetchingBalance"
          style="position: relative; top: 0; right: 0"
          :balance="selectedBalance"
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
          style="max-width: 251px; max-height: 86px"
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
          style="max-width: 251px; max-height: 86px"
          :max-btn-obj="maxButton"
          :disabled="loading"
          :error-messages="errorMessages"
          :persistent-hint="hasPersistentHint"
          :hint="persistentHintMessage"
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
      is-sell
      @close="openTokenSelect = false"
    />
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watch, onMounted, defineEmits } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import MultiCoinValidator from 'multicoin-address-validator';
import { isEmpty, debounce, isNumber, isEqual } from 'lodash';
import BigNumber from 'bignumber.js';
import { fromWei, toBN } from 'web3-utils';
import Web3 from 'web3';

import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import handlerSend from '@/modules/send/handlers/handlerSend.js';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common.js';
import abi from '@/modules/balance/handlers/abiERC20.js';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
import { toBase } from '@/core/helpers/unit';
import { sellContracts } from './tokenList';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook.vue';
import BuySellTokenSelect from '@/modules/buy-sell/components/TokenSelect.vue';
import { getCurrency } from '@/modules/settings/components/currencyList';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
import { BUY_SELL } from '@/modules/analytics-opt-in/handlers/configs/events';
import * as nodes from '@/utils/networks/types/index.js';
import {
  getLatestPrices,
  getCoinGeckoTokenMarketDataByIds
} from '@/apollo/queries/wallets/wallets.graphql';
import { useExternalStore } from '@/core/store/external';
import { useWalletStore } from '@/core/store/wallet';
import { useGlobalStore } from '@/core/store/global';
import { useAmplitude } from '@/core/composables/amplitude';

// emits
const emit = defineEmits(['selectedFiat']);

// injection/use
const { setCoinGeckoTokens, setCoinGeckoNetworkIds, contractToToken } =
  useExternalStore();
const { gasPriceByType, gasPriceType, network } = useGlobalStore();
const { address, instance, web3, tokensList } = useWalletStore();
const { trackBuySell } = useAmplitude();

// apollo
const { onResult: getLatestPricesResult, onError: getLatestPricesError } =
  useQuery(
    getLatestPrices,
    () => ({}),
    () => ({
      pollInterval: 600000
    })
  );
getLatestPricesResult(({ data }) => {
  const tokensData = new Map();
  if (data && data.getLatestPrices) {
    data.getLatestPrices.forEach(token => {
      tokensData.set(token.id, token);
    });
    setCoinGeckoTokens(tokensData);
  }
});
getLatestPricesError(({ error }) => {
  Toast(error.message, {}, ERROR);
});

const {
  onResult: getCoinGeckoTokenMarketDataByIdsResult,
  onError: getCoinGeckoTokenMarketDataByIdsError
} = useQuery(
  getCoinGeckoTokenMarketDataByIds,
  () => ({
    ids: Object.keys(nodes)
      .map(item => nodes[item].coingeckoID)
      .filter(item => !!item)
  }),
  () => ({
    pollingInterval: 600000
  })
);

getCoinGeckoTokenMarketDataByIdsResult(({ data }) => {
  const networkValuesData = new Map();
  if (data && data.getCoinGeckoTokenMarketDataByIds) {
    data.getCoinGeckoTokenMarketDataByIds.forEach(token => {
      networkValuesData.set(token.id, token);
    });
    setCoinGeckoNetworkIds(networkValuesData);
  }
});
getCoinGeckoTokenMarketDataByIdsError(({ error }) => {
  Toast(error.message, {}, ERROR);
});

// props
const props = defineProps({
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
});

// data
const selectedFiat = ref({
  name: 'USD',
  value: 'USD',
  // eslint-disable-next-line
  img: require(`@/assets/images/currencies/USD.svg`)
});
const openTokenSelect = ref(false);
const selectedCurrency = ref(props.defaultCurrency);
const amount = ref('0');
const fetchedData = ref({});
const locGasPrice = ref('0');
const sendHandler = ref({});
const loading = ref(true);
const hasPersistentHint = ref(false);
const fetchingBalance = ref(true);
const gasLimit = ref(21000);
const estimatingFees = ref(true);
const maxBalance = ref('0');
const selectedBalance = ref('0');
const toAddress = ref('');
const validToAddress = ref(false);
const currencyRates = ref([]);
const addressInput = ref(null);

// computed
const fiatCurrencyItems = computed(() => {
  const arrItems = hasData.value
    ? fetchedData.value.fiat_currencies.filter(item => item !== 'RUB')
    : ['USD'];
  return getCurrency(arrItems);
});
const persistentHintMessage = computed(() => {
  return hasPersistentHint.value
    ? `Max adjusted to leave sufficient ${selectedCurrency.value.symbol} for network fee`
    : '';
});
const maxButton = computed(() => {
  return BigNumber(selectedBalance.value).gt(0)
    ? {
        title: 'Max',
        method: setMax,
        disabled:
          nonMainnetMetamask.value ||
          BigNumber(txFee.value).gte(selectedBalance.value)
      }
    : {};
});
const currencyConfig = computed(() => {
  const fiat = selectedFiat.value;
  const rate = currencyRates.value[fiat];
  const currency = fiat;
  return { rate, currency };
});
const preselectedCurrencies = computed(() => {
  if (props.inWallet) {
    return sellContracts.reduce((arr, item) => {
      const inList = tokensList.value.find(t => {
        if (t.contract.toLowerCase() === item.toLowerCase()) return t;
      });
      if (inList) {
        inList.price = formatFiatValue(inList ? inList.price : '0').value;
        arr.push(inList);
        return arr;
      }

      const token = contractToToken(item);
      if (token) {
        token.price = formatFiatValue(
          token ? token.price : '0',
          currencyConfig.value
        ).value;
        arr.push(token);
      }
      return arr;
    }, []);
  }
  const arr = new Array();
  for (const contract of sellContracts) {
    const token = contractToToken(contract);
    if (token) {
      token.price = formatFiatValue(token ? token.price : '0').value;
      arr.push(token);
    }
  }
  return arr;
});
const currencyItems = computed(() => {
  const locTokensList = preselectedCurrencies.value.map(token => {
    token.name = token.symbol;
    return token;
  });
  return locTokensList;
});
const supportedCurrency = computed(() => {
  return ['ETH', 'USDT', 'USDC', 'MATIC', 'BNB'];
});
const supportedNetworks = computed(() => {
  return [ETH.name, BSC.name, MATIC.name];
});
const name = computed(() => {
  return supportedCurrency.value.includes(selectedCurrency.value.symbol)
    ? selectedCurrency.value.symbol
    : network.value.type.currencyName;
});
const disableSell = computed(() => {
  return (
    !amount.value ||
    amount.value === '' ||
    BigNumber(amount.value).eq(0) ||
    loading.value ||
    errorMessages.value !== '' ||
    !actualValidAddress.value
  );
});
const min = computed(() => {
  if (!isEmpty(fetchedData.value)) {
    const found = fetchedData.value.limits.find(item => {
      return item.crypto_currency === name.value && item.type === 'WEB';
    });

    if (found) {
      return BigNumber(found.limit.min);
    }
  }
  return BigNumber(0.015);
});
const max = computed(() => {
  if (!isEmpty(fetchedData.value)) {
    const found = fetchedData.value.limits.find(item => {
      return item.crypto_currency === name.value && item.type === 'WEB';
    });

    if (found) {
      return BigNumber(found.limit.max);
    }
  }
  return BigNumber(3);
});
const txFee = computed(() => {
  return fromWei(BigNumber(locGasPrice.value).times(gasLimit.value).toString());
});
const txFeeInEth = computed(() => {
  return `${BigNumber(txFee.value).decimalPlaces(4)} ${
    network.value.type.currencyName
  }`;
});
const errorMessages = computed(() => {
  const symbol = selectedCurrency.value?.symbol
    ? name
    : network.value.type.currencyName;
  const locAmount = BigNumber(amount.value);
  if (nonMainnetMetamask.value) {
    return 'Please switch your network to the Ethereum Mainnet on Metamask.';
  }

  if (BigNumber(selectedBalance.value).eq(0) && actualValidAddress) {
    return `Address provided has no ${selectedCurrency.value.symbol}`;
  }

  if (locAmount.isNaN() || locAmount.eq(0)) {
    return 'Amount required';
  }

  if (locAmount.lt(0)) {
    return "Amount can't be negative.";
  }

  if (locAmount.gt(0) && locAmount.lt(min)) {
    return `The minimum amount to sell is ${min.value.toString()} ${symbol}.`;
  }
  if (locAmount.gt(0) && locAmount.gt(max)) {
    return `The maximum amount to sell is ${max.value.toString()} ${symbol}.`;
  }

  if (props.inWallet) {
    if (locAmount.gt(selectedBalance.value)) {
      return `You do not have enough ${symbol} to sell.`;
    }
    if (!isEmpty(sendHandler.value) && !sendHandler.value.hasEnoughBalance()) {
      return `You do not have enough ETH to pay for network fee.`;
    }
  } else {
    // Not in wallet
    if (
      actualValidAddress.value &&
      isValidAmount.value &&
      !hasEnoughAssets.value
    ) {
      return 'Address provided does not have enough balance to complete the transaction';
    }
  }
  if (
    locAmount &&
    !handlerSend.helpers.hasValidDecimals(
      locAmount,
      selectedCurrency.value.decimals
    )
  ) {
    return `Invalid decimals! Max decimals for selected currency is ${selectedCurrency.value.decimals}`;
  }

  return '';
});
const nonMainnetMetamask = computed(() => {
  return (
    instance.value &&
    instance.value.identifier === WALLET_TYPES.WEB3_WALLET &&
    network.value?.type.name !== ETH.name
  );
});
const isValidAmount = computed(() => {
  /** !amount */
  if (!amount.value) {
    return false;
  }
  if (!isNumber(selectedCurrency.value?.decimals)) {
    return false;
  }
  /** amount is negative */
  if (BigNumber(amount.value).lt(0)) {
    return false;
  }
  /** return amount has valid decimals */
  return handlerSend.helpers.hasValidDecimals(
    amount.value,
    selectedCurrency.value.decimals
  );
});
const getCalculatedAmount = computed(() => {
  const locAmount = new BigNumber(amount.value ? amount.value : 0)
    .times(new BigNumber(10).pow(selectedCurrency.value.decimals))
    .toFixed(0);
  return toBN(locAmount);
});
const getAmountBN = computed(() => {
  // Duplicate of getCalculatedAmount
  if (!isValidAmount.value) return toBN(0);
  const locAmount = toBase(
    amount.value ? amount.value : 0,
    selectedCurrency.value.decimals
  );
  return toBN(locAmount);
});
const hasEnoughAssets = computed(() => {
  try {
    const bal = toBase(selectedBalance.value, selectedCurrency.value.decimals);
    return toBN(bal).gte(getAmountBN.value);
  } catch (e) {
    Toast(e, {}, ERROR);
    return false;
  }
});
const actualAddress = computed(() => {
  return props.inWallet ? address.value : toAddress.value;
});
const actualValidAddress = computed(() => {
  return props.inWallet ? true : validToAddress.value;
});
const hasData = computed(() => {
  return !isEmpty(fetchedData.value);
});
const cryptoAmount = computed(() => {
  return BigNumber(amount.value).times(priceOb.value.price).toString();
});
const selectedFiatName = computed(() => {
  return selectedFiat.value.name;
});
const priceOb = computed(() => {
  return !isEmpty(fetchedData.value)
    ? fetchedData.value.prices.find(
        item => item.fiat_currency === selectedFiatName.value
      )
    : { crypto_currency: 'ETH', fiat_currency: 'USD', price: '3379.08322' };
});

// watchers
watch(
  () => toAddress,
  () => {
    amount.value = '0';
  }
);
watch(
  () => selectedCurrency,
  newVal => {
    maxBalance.value = '0';
    hasPersistentHint.value = false;
    selectedBalance.value = '0';
    if (
      !isEmpty(sendHandler.value) &&
      selectedCurrency.value.hasOwnProperty('name')
    ) {
      sendHandler.value.setCurrency(newVal);
    }
    fetchSellInfo();
  },
  { deep: true }
);
watch(
  () => selectedFiat,
  (newVal, oldVal) => {
    if (!isEqual(newVal, oldVal)) {
      emit('selectedFiat', newVal);
    }
  },
  { deep: true }
);
watch(
  () => amount,
  newVal => {
    debouncedSetAmount(newVal);
  }
);
watch(
  () => gasPriceType.value,
  newVal => {
    locGasPrice.value = gasPriceByType(newVal);
  }
);
watch(
  () => locGasPrice,
  val => {
    sendHandler.value.setLocalGasPrice(val);
  }
);
watch(
  () => gasLimit,
  val => {
    sendHandler.value.setGasLimit(val);
  }
);
watch(
  () => props.orderHandler,
  () => {
    sendHandler.value = new handlerSend();
    fetchSellInfo();
    locGasPrice.value = gasPriceByType(gasPriceType.value);
  },
  { deep: true }
);
watch(
  () => network.value,
  () => {
    maxBalance.value = '0';
    hasPersistentHint.value = false;
    selectedBalance.value = '0';
    amount.value = '0';
    selectedCurrency.value = {};
    selectedCurrency.value = props.defaultCurrency;
    if (supportedNetworks.value.includes(network.value.type.name)) {
      sendHandler.value = new handlerSend();
      fetchSellInfo();
      locGasPrice.value = gasPriceByType(gasPriceType.value);
    }
  }
);

// onMounted
onMounted(() => {
  if (!props.inWallet) addressInput.value.$refs.addressSelect.clear();
  sendHandler.value = new handlerSend();
  fetchSellInfo();
  locGasPrice.value = gasPriceByType(gasPriceType.value);
});

// methods

const setAddress = (newVal, isValid, data) => {
  if (data.type === 'RESOLVED' && !data.value.includes('.'))
    toAddress.value = data.value;
  else toAddress.value = newVal;
  validToAddress.value = isValid;
  if (!validToAddress.value) return;
  sendHandler.value.setFrom(toAddress.value);
  fetchSellInfo();
};
const getEthBalance = () => {
  if (!actualValidAddress.value) return;
  const web3Instance = props.inWallet
    ? web3.value
    : new Web3(network.value.url);
  web3Instance.eth.getBalance(actualAddress.value).then(res => {
    fetchingBalance.value = false;
    selectedBalance.value = fromWei(res);
  });
};
const getTokenBalance = () => {
  if (!actualValidAddress.value) return;
  const web3Instance = props.inWallet
    ? web3.value
    : new Web3(network.value.url);
  const contract = new web3Instance.eth.Contract(
    abi,
    selectedCurrency.value.contract
  );
  contract.methods
    .balanceOf(actualAddress.value)
    .call()
    .then(res => {
      fetchingBalance.value = false;
      selectedBalance.value = BigNumber(res)
        .div(BigNumber(10).pow(selectedCurrency.value.decimals))
        .toString();
    });
};
const debouncedSetAmount = debounce(function (newVal) {
  if (!BigNumber(newVal).eq(maxBalance.value)) {
    hasPersistentHint.value = false;
  }

  if (BigNumber(newVal).lt(0)) {
    return;
  }
  if (
    newVal &&
    !isEmpty(sendHandler.value) &&
    isValidAmount.value &&
    props.inWallet
  ) {
    const newValue = BigNumber(newVal ? newVal : 0)
      .times(
        BigNumber(10).pow(
          selectedCurrency.value?.decimals
            ? selectedCurrency.value.decimals
            : 18
        )
      )
      .toString();
    sendHandler.value.setValue(newValue);
    if (errorMessages.value === '' && hasEnoughAssets) {
      estimatingFees.value = true;
      sendHandler.value
        .estimateGas()
        .then(res => {
          estimatingFees.value = false;
          gasLimit.value = res;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    }
  }
}, 500);
const setCurrency = e => {
  amount.value = '0';
  selectedCurrency.value = e;
};
const setMax = () => {
  if (
    selectedCurrency.value.contract !== MAIN_TOKEN_ADDRESS ||
    props.inWallet
  ) {
    const bal = sendHandler.value.getEntireBal();
    if (bal) {
      amount.value = BigNumber(bal)
        .div(
          BigNumber(10).pow(
            selectedCurrency.value.hasOwnProperty('name')
              ? selectedCurrency.value.decimals
              : 18
          )
        )
        .toString();
    } else {
      amount.value = selectedBalance.value;
    }
  } else {
    amount.value = BigNumber(max.value).lt(selectedBalance.value)
      ? max.value.toString()
      : BigNumber(selectedBalance.value).minus(txFee.value).toString();
  }
  maxBalance.value = amount.value;
  hasPersistentHint.value = true;
};
const sell = () => {
  trackBuySell(BUY_SELL.SELL_WITH_MOONPAY);
  props.orderHandler
    .sell(name.value, amount.value, actualAddress.value)
    .then(() => {
      trackBuySell(BUY_SELL.SELL_WITH_MOONPAY_SUCCESS);
      amount.value = '0';
      props.close();
      selectedCurrency.value = props.defaultCurrency;
    })
    .catch(err => {
      trackBuySell(BUY_SELL.SELL_WITH_MOONPAY_FAILED);
      Toast(err, {}, ERROR);
      amount.value = '0';
      props.close();
      selectedCurrency.value = props.defaultCurrency;
    });
};
const fetchSellInfo = () => {
  if (actualValidAddress.value && selectedCurrency.value.contract) {
    fetchingBalance.value = true;
    if (selectedCurrency.value.contract === MAIN_TOKEN_ADDRESS) {
      getEthBalance();
    } else {
      getTokenBalance();
    }
    if (hasEnoughAssets.value) {
      sendHandler.value.setFrom(actualAddress);
      sendHandler.value.setCurrency(selectedCurrency);
      sendHandler.value.setValue(getCalculatedAmount);
      // eslint-disable-next-line
      sendHandler.value.setTo(ETH_DONATION_ADDRESS, 'TYPED');
      estimatingFees.value = true;
      sendHandler.value
        .estimateGas()
        .then(res => {
          estimatingFees.value = false;
          gasLimit.value = res;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    }
  } else {
    fetchingBalance.value = false;
    selectedBalance.value = fromWei('0');
  }
  props.orderHandler
    .getSupportedFiatToSell(name)
    .then(res => {
      loading.value = false;
      fetchedData.value = res[0];
    })
    .catch(e => {
      loading.value = false;
      Toast(e, {}, ERROR);
    });
};
const isValidToAddress = addr => {
  return MultiCoinValidator.validate(addr, selectedCurrency.value.symbol);
};
const preventCharE = e => {
  if (e.key === 'e') e.preventDefault();
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
