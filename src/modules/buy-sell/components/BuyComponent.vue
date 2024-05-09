<template>
  <div class="py-8 px-8 moonpay-buy-component">
    <!-- ========================================================================= -->
    <!-- Sending amount in fiat -->
    <!-- ========================================================================= -->
    <div class="mt-2">
      <div class="font-weight-medium textDark--text mb-2">
        How much do you want to spend?
      </div>
      <div class="d-flex align-center">
        <mew-input
          v-model="amount"
          hide-clear-btn
          type="number"
          :error-messages="amountErrorMessages"
          class="no-right-border"
          style="max-height: 92px; max-width: 251px"
          @keydown.native="preventCharE($event)"
        />
        <mew-select
          v-model="selectedFiat"
          style="max-width: 135px; margin-top: -30px"
          :items="fiatCurrencyItems"
          is-custom
          class="selectedFiat no-left-border"
        />
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- Receiving amount in crypto -->
    <!-- ========================================================================= -->
    <div class="mt-2">
      <div class="d-flex align-center mb-2">
        <div class="font-weight-medium textDark--text mr-1">You will get</div>
        <mew-tooltip style="height: 21px">
          <template #contentSlot>
            <div>
              {{ includesFeeText }}
              <br />
              <br />
              {{ networkFeeText }}
              <br />
              <br />
              {{ dailyLimit }}
              <br />
              {{ monthlyLimit }}
            </div>
          </template>
        </mew-tooltip>
      </div>
      <div class="d-flex align-start">
        <mew-input
          is-read-only
          :value="
            !loading
              ? `${cryptoToFiat} ${selectedCryptoName} ≈ ${plusFeeF} `
              : 'Loading...'
          "
          hide-clear-btn
          class="no-right-border"
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
    <!-- Receiver's address -->
    <!-- ========================================================================= -->
    <div v-if="!inWallet" class="mt-2">
      <div class="font-weight-medium textDark--text mb-2">
        Where should we send your crypto?
      </div>
      <module-address-book
        ref="addressInput"
        label="Enter Crypto Address"
        :currency="selectedCryptoName"
        :enable-save-address="false"
        :is-home-page="true"
        @setAddress="setAddress"
      />
    </div>

    <!-- ========================================================================= -->
    <!-- BUY NEW button -->
    <!-- ========================================================================= -->
    <mew-button
      class="mt-2"
      btn-size="xlarge"
      has-full-width
      :disabled="disableBuy"
      :title="buyBtnTitle"
      :is-valid-address-func="isValidToAddress"
      @click.native="buy"
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

<script setup>
import {
  defineAsyncComponent,
  defineProps,
  ref,
  computed,
  watch,
  onMounted,
  defineEmits
} from 'vue';
import MultiCoinValidator from 'multicoin-address-validator';
import { isEmpty, cloneDeep, isEqual } from 'lodash';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { fromWei, toBN } from 'web3-utils';

import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import nodeList from '@/utils/networks';
import {
  formatFloatingPointValue,
  formatFiatValue
} from '@/core/helpers/numberFormatHelper';
import { getCurrency } from '@/modules/settings/components/currencyList';
import { buyContracts } from './tokenList';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook.vue';

const BuySellTokenSelect = defineAsyncComponent(() =>
  import('@/modules/buy-sell/components/TokenSelect.vue')
);

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import { storeToRefs } from 'pinia';

// injections/use
const { address, tokensList } = useWalletStore();
const { currencyRate, contractToToken } = useExternalStore();
const { coinGeckoTokens } = storeToRefs(useExternalStore);
const { network } = storeToRefs(useGlobalStore);

// emits
const emit = defineEmits([
  'selectedCurrency',
  'selectedFiat',
  'toAddress',
  'openTokenSelect',
  'hideMoonpay',
  'simplexQuote',
  'success'
]);

// props
const props = defineProps({
  orderHandler: {
    type: Object,
    default: () => {}
  },
  defaultCurrency: {
    type: Object,
    default: () => {}
  },
  inWallet: {
    type: Boolean,
    default: false
  },
  supportedBuy: {
    type: Boolean,
    default: false
  }
});

// data
const openTokenSelect = ref(false);
const selectedCurrency = ref(props.defaultCurrency);
const loading = ref(true);
const selectedFiat = ref({
  name: 'USD',
  value: 'USD',
  // eslint-disable-next-line
  img: require(`@/assets/images/currencies/USD.svg`)
});
const fetchedData = ref({});
const currencyRates = ref([]);
const amount = ref('300');
const toAddress = ref('');
const validToAddress = ref(false);
const gasPrice = ref('0');
const web3Connections = ref({});
const simplexQuote = ref({});
const showMoonpay = ref(true);
const disableCurrencySelect = ref(true);
const localCryptoAmount = ref('0');
const addressInput = ref(null);

// computed
const includesFeeText = computed(() => {
  return `Includes ${percentFee.value} fee (${
    formatFiatValue(minFee, currencyConfig.value).value
  } min)`;
});
const networkFeeText = computed(() => {
  return `${
    selectedCurrency.value.symbol
  } network fee (for transfers to your wallet) ~${
    formatFiatValue(networkFeeToFiat, currencyConfig.value).value
  }`;
});
const dailyLimit = computed(() => {
  const moonpayMax = max.value.moonpay;
  const simplexMax = max.value.simplex;
  const value = Math.max(moonpayMax.toString(), simplexMax.toString());
  return `Daily limit: ${
    formatFiatValue(value.toString(), currencyConfig.value).value
  }`;
});
const monthlyLimit = computed(() => {
  const value = BigNumber(fiatMultiplier).times(50000);
  return `Monthly limit: ${
    formatFiatValue(value.toString(), currencyConfig.value).value
  }`;
});
const currencyConfig = computed(() => {
  const fiat = selectedFiat.value;
  const rate = currencyRate.value[fiat];
  const currency = fiat;
  return { rate, currency };
});
const fiatMultiplier = computed(() => {
  if (hasData.value) {
    const selectedCurrencyPrice = fetchedData.value[0].conversion_rates.find(
      item => item.fiat_currency === selectedFiatName.value
    );
    return selectedCurrencyPrice
      ? BigNumber(selectedCurrencyPrice.exchange_rate)
      : toBN(1);
  }
  return toBN(1);
});
const selectedFiatName = computed(() => {
  return selectedFiat.value.name;
});
const actualAddress = computed(() => {
  return props.inWallet ? address : toAddress.value;
});
const actualValidAddress = computed(() => {
  return props.inWallet ? true : validToAddress.value;
});
const networkFee = computed(() => {
  return fromWei(BigNumber(gasPrice.value).times(21000).toString());
});
const priceOb = computed(() => {
  if (!isEmpty(fetchedData.value)) {
    if (fetchedData.value[0] && fetchedData.value[0].prices.length > 0) {
      const inMoonpay = fetchedData.value[0].prices.find(
        item => item.fiat_currency === selectedFiatName.value
      );
      if (inMoonpay) return inMoonpay;
    }

    if (fetchedData.value[1] && fetchedData.value[1].prices.length > 0) {
      const inSimplex = fetchedData.value[1].prices.find(
        item => item.fiat_currency === selectedFiatName.value
      );
      return inSimplex;
    }
  }
  return {
    crypto_currency: ETH.name,
    fiat_currency: 'USD',
    price: '3379.08322'
  };
});
const networkFeeToFiat = computed(() => {
  return BigNumber(networkFee).times(priceOb.value.price).toString();
});
const minFee = computed(() => {
  return BigNumber(4.43).times(fiatMultiplier).toString();
});
const plusFee = computed(() => {
  const fee = isEUR.value
    ? BigNumber(BigNumber(0.7).div(100)).times(amount.value)
    : BigNumber(BigNumber(3.25).div(100)).times(amount.value);
  const withFee = fee.gt(minFee)
    ? BigNumber(amount.value).minus(fee)
    : BigNumber(amount.value).minus(fee).minus(minFee);
  return withFee.minus(networkFeeToFiat).toString();
});
const plusFeeF = computed(() => {
  return formatFiatValue(plusFee, currencyConfig.value).value;
});
const percentFee = computed(() => {
  return isEUR.value ? '0.7%' : '3.25%';
});
const selectedCryptoName = computed(() => {
  return selectedCurrency.value?.symbol ? selectedCurrency.value.symbol : '';
});
const isEUR = computed(() => {
  return selectedFiatName.value === 'EUR' || selectedFiatName.value === 'GBP';
});
const isCAD = computed(() => {
  return selectedFiatName.value === 'CAD';
});
const disableBuy = computed(() => {
  return (
    (!props.inWallet && !actualValidAddress.value) ||
    loading.value ||
    amountErrorMessages.value !== '' ||
    !props.supportedBuy
  );
});
const buyBtnTitle = computed(() => {
  return 'BUY NOW';
});
const amountErrorMessages = computed(() => {
  if (BigNumber(amount.value).isNaN() || BigNumber(amount.value).eq(0)) {
    return 'Amount required';
  }
  if (BigNumber(amount.value).lt(0)) {
    return `Amount can't be negative`;
  }
  if (min.value.gt(amount.value)) {
    return `Amount can't be below provider's minimum: ${
      formatFiatValue(min.value.toFixed(), currencyConfig.value).value
    } ${selectedFiatName.value}`;
  }
  if (maxVal.value.gt(0) && maxVal.value.lt(amount.value)) {
    return `Amount can't be above provider's maximum: ${
      formatFiatValue(maxVal.value.toFixed(), currencyConfig.value).value
    } ${selectedFiatName.value}`;
  }
  return '';
});
const tokens = computed(() => {
  const filteredContracts = isCAD.value ? [buyContracts[0]] : buyContracts;
  if (props.inWallet) {
    return filteredContracts.reduce((arr, item) => {
      const inList = tokensList.find(t => {
        if (t.contract.toLowerCase() === item.toLowerCase()) return t;
      });
      if (inList) {
        arr.push(inList);
        return arr;
      }
      const token = contractToToken(item);
      if (token) arr.push(token);
      return arr;
    }, []);
  }
  const arr = new Array();
  for (const contract of filteredContracts) {
    const token = contractToToken(contract);
    if (token) arr.push(token);
  }
  return arr;
});
const currencyItems = computed(() => {
  if (!props.supportedBuy) return;
  const tokensListWPrice =
    currencyRates.value.length > 0
      ? tokens.value.map(token => {
          const priceRate = currencyRates.value.find(rate => {
            return rate.crypto_currency === token.symbol;
          });
          const actualPrice = priceRate?.quotes.find(quote => {
            return quote.fiat_currency === selectedFiatName.value;
          });
          token.price = formatFiatValue(
            actualPrice ? actualPrice.price : '0',
            currencyConfig
          ).value;
          token.value = token.name;
          token.name = token.symbol;
          return token;
        })
      : tokens;
  const returnedArray = [...tokensListWPrice];
  return returnedArray;
});
const hasData = computed(() => {
  return !isEmpty(fetchedData.value);
});
const cryptoToFiat = computed(() => {
  return showMoonpay.value ? moonpayCryptoAmount : simplexCryptoAmount;
});
const moonpayCryptoAmount = computed(() => {
  return formatFloatingPointValue(
    BigNumber(plusFee).div(priceOb.value.price).toString()
  ).value;
});
const simplexCryptoAmount = computed(() => {
  return formatFloatingPointValue(simplexQuote.value.crypto_amount).value;
});
const fiatCurrencyItems = computed(() => {
  const arrItems =
    hasData.value && fetchedData.value[0].fiat_currencies.length > 0
      ? fetchedData.value[0].fiat_currencies.filter(item => item !== 'RUB')
      : ['USD'];
  return getCurrency(arrItems);
});
const max = computed(() => {
  if (hasData.value) {
    const dataToArray = Object.values(fetchedData.value);
    const moonPay = dataToArray.find(item => item.name === 'MOONPAY');
    const simplex = dataToArray.find(item => item.name === 'SIMPLEX');
    const moonpayMax = moonPay?.limits.find(
      item => item.fiat_currency === selectedFiatName.value
    );
    const simplexMax = simplex?.limits.find(
      item => item.fiat_currency === selectedFiatName.value
    );
    return {
      moonpay: moonpayMax ? BigNumber(moonpayMax.limit.max) : BigNumber(0),
      simplex: simplexMax ? BigNumber(simplexMax.limit.max) : BigNumber(0)
    };
  }
  return {
    moonpay: BigNumber(0),
    simplex: BigNumber(0)
  };
});
const maxVal = computed(() => {
  const moonpayMax = max.value.moonpay;
  const simplexMax = max.value.simplex;
  const maxVal = Math.max(moonpayMax.toString(), simplexMax.toString());
  return BigNumber(maxVal);
});
const min = computed(() => {
  if (hasData.value) {
    const foundLimit = fetchedData.value[0].limits.find(
      item => item.fiat_currency === selectedFiatName.value
    );
    return foundLimit ? BigNumber(foundLimit.limit.min) : BigNumber(30);
  }
  return BigNumber(30);
});

// watch
watch(
  () => selectedCurrency,
  (newVal, oldVal) => {
    const supportedCoins = {
      ETH: ETH.name,
      BNB: BSC.name,
      MATIC: MATIC.name
    };
    if (
      !newVal ||
      (newVal?.contract?.toLowerCase() === MAIN_TOKEN_ADDRESS &&
        !supportedCoins[newVal.symbol])
    ) {
      selectedCurrency.value = oldVal;
      return;
    }
    if (!isEqual(newVal, oldVal)) {
      fetchCurrencyData();
    }
    emit('selectedCurrency', selectedCurrency.value);
  },
  () => ({ deep: true })
);

watch(
  () => selectedFiat,
  (newVal, oldVal) => {
    if (!isEqual(newVal, oldVal)) {
      if (newVal.name === 'CAD' || newVal.name === 'JPY') {
        selectedCurrency.value = tokens.value[0];
        emit('selectedFiat', newVal);
        return;
      }

      const token = currencyItems.value.find(
        item => item.name === selectedCryptoName.value
      );
      const price = token.price.substring(1).replace(',', '');
      amount.value = BigNumber(localCryptoAmount.value)
        .multipliedBy(price)
        .toFixed(2);
      localCryptoAmount.value = BigNumber(amount.value).div(price).toString();

      emit('selectedFiat', newVal);
    }
  },
  () => ({
    deep: true
  })
);

watch(
  () => network,
  () => {
    selectedCurrency.value = {};
    selectedCurrency.value = props.defaultCurrency;
  },
  () => ({ deep: true })
);

watch(
  () => props.orderHandler,
  () => {
    fetchCurrencyData();
  },
  () => ({
    deep: true
  })
);

watch(
  () => amount,
  newVal => {
    const simplexMax = max.value.simplex.multipliedBy(fiatMultiplier);
    checkMoonPayMax();
    if (
      simplexMax.lt(newVal) ||
      isEmpty(newVal) ||
      min.value.gt(newVal) ||
      isNaN(newVal)
    ) {
      loading.value = true;
    } else {
      loading.value = false;
      getSimplexQuote();
      localCryptoAmount.value = BigNumber(amount.value)
        .div(priceOb.value.price)
        .toString();
    }
  }
);

watch(
  () => validToAddress,
  newVal => {
    if (!newVal) return;
    emit('toAddress', toAddress.value);
    getSimplexQuote();
  }
);

watch(
  () => coinGeckoTokens,
  () => {
    fetchCurrencyData();
  }
);

watch(
  () => openTokenSelect,
  () => {
    emit('openTokenSelect', openTokenSelect);
  }
);

// mounted
onMounted(() => {
  if (!props.inWallet) addressInput.value.addressSelect.value.clear();
  fetchCurrencyData();
});

// method
const setAddress = (newVal, isValid, data) => {
  if (data.type === 'RESOLVED' && !data.value.includes('.'))
    toAddress.value = data.value;
  else toAddress.value = newVal;
  validToAddress.value = isValid;
};
const fetchGasPrice = async () => {
  const supportedNodes = {
    ETH: ETH.name,
    BNB: BSC.name,
    MATIC: MATIC.name
  };
  const nodeType = !supportedNodes[selectedCurrency.value?.symbol]
    ? ETH.name
    : supportedNodes[selectedCurrency.value.symbol];
  const node = nodeList[nodeType];
  if (!web3Connections[nodeType]) {
    const web3 = new Web3(node[0].url);
    web3Connections[nodeType] = web3;
  }
  gasPrice.value = await web3Connections[nodeType].eth.getGasPrice();
};
const isLT = (num, num2) => {
  return BigNumber(num).lt(num2);
};
const isValidToAddress = address => {
  return MultiCoinValidator.validate(address, selectedCurrency.value.symbol);
};
const checkMoonPayMax = () => {
  const moonpayMax = max.value.moonpay;
  const hideMoonpay = isLT(moonpayMax, amount.value);
  emit('hideMoonpay', hideMoonpay);
};
const setCurrency = e => {
  selectedCurrency.value = e;
};
const fetchCurrencyData = () => {
  loading.value = true;
  disableCurrencySelect.value = true;
  fetchedData.value = {};
  fetchGasPrice();
  props.orderHandler
    .getSupportedFiatToBuy(selectedCurrency.value?.symbol)
    .then(res => {
      props.orderHandler.getFiatRatesForBuy().then(res => {
        currencyRates.value = cloneDeep(res);
        loading.value = false;
        disableCurrencySelect.value = false;
      });
      fetchedData.value = Object.assign({}, res);
      localCryptoAmount.value = BigNumber(amount.value)
        .div(priceOb.value.price)
        .toString();
    })
    .catch(e => {
      Toast(e, {}, ERROR);
    });
  getSimplexQuote();
};
const getSimplexQuote = () => {
  if (
    !actualValidAddress.value ||
    isEmpty(amount.value) ||
    min.value.gt(amount.value) ||
    isNaN(amount.value) ||
    (max.value.simplex.gt(0) && max.value.simplex.lt(amount.value)) ||
    amountErrorMessages.value !== ''
  ) {
    return;
  }
  loading.value = true;
  disableCurrencySelect.value = true;
  simplexQuote.value = {};
  props.orderHandler
    .getSimplexQuote(
      selectedCryptoName,
      selectedFiatName,
      amount.value,
      actualAddress
    )
    .then(res => {
      simplexQuote.value = Object.assign({}, res);
      loading.value = false;
      disableCurrencySelect.value = false;
      emit('simplexQuote', simplexQuote.value);
      compareQuotes();
    })
    .catch(e => {
      const error = e.response ? e.response.data.error : e;
      loading.value = false;
      emit('simplexQuote', {});
      Toast(error, {}, ERROR);
    });
};
const compareQuotes = () => {
  const moonpayMax = max.value.moonpay;
  // Moonpay has better rate and is not above max
  showMoonpay.value = isLT(moonpayMax, amount.value) // max < amount
    ? false
    : isLT(simplexQuote.value.crypto_amount, moonpayCryptoAmount);
};
const buy = () => {
  const buyObj = {
    cryptoToFiat: moonpayCryptoAmount,
    selectedCryptoName: selectedCryptoName,
    plusFeeF: plusFeeF,
    includesFeeText: includesFeeText,
    networkFeeText: networkFeeText,
    dailyLimit: dailyLimit,
    monthlyLimit: monthlyLimit,
    fiatAmount: amount
  };
  checkMoonPayMax();
  emit('success', [
    simplexQuote.value,
    toAddress.value,
    buyObj,
    1,
    selectedCurrency.value,
    selectedFiat.value
  ]);
};
const preventCharE = e => {
  if (e.key === 'e') e.preventDefault();
};
</script>

<style lang="scss" scoped>
// Force set button border color(greyMedium) for not selected buttons
.not-selected {
  border: 1px solid var(--v-greyMedium-base);
}
.icon-holder {
  border: 2px solid var(--v-greyMedium-base);
  border-radius: 100px;
  width: 20px;
  height: 20px;
}
.section-block {
  height: 145px;
  border-radius: 12px;
  left: 0px;
  top: 0px;
  box-sizing: border-box;
  border: 2px solid var(--v-greyMedium-base);
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  margin: 8px 0px;
  position: relative;
}
.section-block:hover {
  cursor: pointer;
  border: 2px solid #1eb19b;
  background-color: #e5eaee;
}
.selected {
  border: 2px solid #1eb19b;
}
.provider-logo {
  position: absolute;
  top: 18px;
  right: 20px;
}
.token-select-button {
  height: 62px;
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
.moonpay-buy-component {
  .v-input__slot {
    height: 62px !important;
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
